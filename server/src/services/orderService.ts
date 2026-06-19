import { query } from '../db';
import * as productService from './productService';
import logger from '../utils/logger';
import { clearProductCache } from '../utils/redisClient';
import * as emailService from './emailService';

interface OrderProduct {
  productId: string;
  quantity: number;
}

interface CreateOrderParams {
  userId: string;
  userEmail: string;
  addressId: string;
  items: OrderProduct[];
  status: 'Processing' | 'Shipping' | 'Delivered',
  payment_status: 'processing' | 'completed' | 'failed',
  payment_gateway: 'razorpay' | 'COD',
  // Optional: for razorpay the gateway order id only exists after we know the
  // total, so it is attached afterwards via setOrderPaymentOrderId.
  payment_order_id?: string | null,
}

// Single source of truth for a product's effective unit price (discounted price
// when present, otherwise list price). Used both when snapshotting order line
// items and when computing a checkout total up front.
export const productUnitPrice = (product: any): number =>
  Number(product.discounted_price || product.price);

export const createOrder = async (params: CreateOrderParams) => {
  const { userId, userEmail, items, addressId, status, payment_status, payment_gateway, payment_order_id } = params;

  try {
    // Validate delivery pincode and snapshot address
    const addressRes = await query('SELECT * FROM user_addresses WHERE id = $1', [params.addressId]);
    if (addressRes.rows.length === 0) {
      throw new Error(`Address not found: ${params.addressId}`);
    }
    const deliveryAddress = addressRes.rows[0];
    const pin = parseInt(deliveryAddress.pincode, 10);
    if (isNaN(pin) || pin < 110001 || pin > 110096) {
      throw new Error('Sorry, we currently only deliver to pincodes between 110001 and 110096.');
    }

    await query('BEGIN'); // Start transaction

    // 1. Validate + check stock (lock rows) and snapshot each line item.
    // Price/name/image are captured here so the order reflects what was bought
    // at the time, regardless of later product changes.
    // total_price is derived from the locked snapshot (not trusted from the
    // caller), so it always matches the line items actually charged.
    const orderItems = [];
    let total_price = 0;
    for (const item of items) {
      const { productId, quantity } = item;

      const productRes = await query(
        'SELECT * FROM products WHERE id = $1 FOR UPDATE',
        [productId]
      );
      if (productRes.rows.length === 0) {
        throw new Error(`Product not found: ${productId}`);
      }
      const product = productRes.rows[0];

      if (product.quantity < quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      const price = productUnitPrice(product);
      total_price += price * quantity;

      orderItems.push({
        productId,
        quantity,
        name: product.name,
        price,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
      });
    }

    // 2. Create a single order row holding all items
    const insertOrderQuery = `
      INSERT INTO orders (user_id, user_email, address_id, delivery_address, items, total_price, status, payment_gateway, payment_order_id, payment_id, payment_signature, payment_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    const orderRes = await query(insertOrderQuery, [
      userId,
      userEmail,
      addressId,
      deliveryAddress,
      JSON.stringify(orderItems),
      total_price,
      status,
      payment_gateway,
      payment_order_id ?? null,
      null,
      null,
      payment_status,
    ]);
    const createdOrder = orderRes.rows[0];

    // 3. Decrement stock for each product
    for (const item of items) {
      await query(
        'UPDATE products SET quantity = quantity - $1 WHERE id = $2',
        [item.quantity, item.productId]
      );
    }

    await query('COMMIT'); // Commit transaction

    // Clear product cache to reflect new quantity levels
    await clearProductCache();

    logger.info(
      `Order created for user ${userEmail}, items: ${items.length}`
    );
    return createdOrder;
  } catch (err) {
    await query('ROLLBACK'); // Rollback transaction on error
    logger.error('Error creating orders', err);
    throw err;
  }
};

// Update payment fields after gateway verification. Matched by payment_order_id
// (the gateway order id), which is unique per checkout.
export const updateOrderPaymentStatus = async (
  paymentOrderId: string,
  paymentStatus: 'completed' | 'failed',
  paymentId?: string,
  paymentSignature?: string
) => {
  const res = await query(
    `UPDATE orders
        SET payment_status = $1,
            payment_id = COALESCE($2, payment_id),
            payment_signature = COALESCE($3, payment_signature),
            updated_at = CURRENT_TIMESTAMP
      WHERE payment_order_id = $4
      RETURNING *;`,
    [paymentStatus, paymentId ?? null, paymentSignature ?? null, paymentOrderId]
  );
  return res.rows[0] ?? null;
};

// Attach the payment gateway's order id once it has been created (razorpay
// flow). The order row is created first so the total can be computed under
// lock, then the gateway order is opened for that exact amount.
export const setOrderPaymentOrderId = async (orderId: string, paymentOrderId: string) => {
  const res = await query(
    `UPDATE orders
        SET payment_order_id = $1,
            updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;`,
    [paymentOrderId, orderId]
  );
  return res.rows[0] ?? null;
};

// Build and send the order confirmation email from the snapshotted order items.
export const sendOrderConfirmation = async (order: any) => {
  try {
    const emailItems = (order.items || []).map((i: any) => ({
      name: i.name ?? 'Product',
      quantity: i.quantity,
      price: Number(i.price || 0),
      image: i.image ?? undefined,
    }));

    const userRes = await query('SELECT name FROM users WHERE id = $1', [order.user_id]);
    const userName = userRes.rows.length > 0 ? userRes.rows[0].name : 'Customer';

    // Fire off asynchronously so it doesn't block the caller's response
    emailService
      .sendOrderConfirmationEmail(
        order.user_email,
        userName,
        order.id,
        emailItems,
        Number(order.total_price)
      )
      .catch((e) => logger.error('Unhandled email service error', e));
  } catch (emailErr) {
    logger.error('Failed to send order confirmation email', emailErr);
  }
};

export const getOrders = async (userId: string) => {
  try {
    const res = await query(
      `SELECT * FROM orders WHERE user_id = $1 AND payment_status = $2 ORDER BY created_at DESC;`,
      [userId, 'completed']
    );
    const orders = res.rows;

    // New orders snapshot name/price/image at creation time. Legacy orders only
    // stored { productId, quantity }, so backfill their details from the products
    // table to ensure the orders page can always render product info.
    const idsNeedingEnrichment = new Set<string>();
    for (const order of orders) {
      delete order.address_id;
      delete order.payment_gateway;
      delete order.payment_id;
      delete order.payment_signature;
      delete order.payment_order_id;

      for (const item of order.items || []) {
        if (item.productId && item.name == null) {
          idsNeedingEnrichment.add(item.productId);
        }
      }
    }

    if (idsNeedingEnrichment.size > 0) {
      const dbProducts = await productService.getProducts(
        { ids: Array.from(idsNeedingEnrichment) },
        true
      );
      const productMap: Record<string, any> = {};
      dbProducts.forEach((p: any) => {
        productMap[p.id] = p;
      });

      for (const order of orders) {
        order.items = (order.items || []).map((item: any) => {
          if (item.name != null) return item;
          const p = productMap[item.productId];
          return {
            ...item,
            name: p?.name ?? 'Product',
            price: Number(item.price ?? p?.discounted_price ?? p?.price ?? 0),
            image: p?.images && p.images.length > 0 ? p.images[0] : null,
          };
        });
      }
    }

    return orders;
  } catch (err) {
    logger.error('Error fetching orders', err);
    throw err;
  }
};

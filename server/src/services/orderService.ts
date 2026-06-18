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
  total_price: number,
  status: 'Processing' | 'Shipping' | 'Delivered',
  payment_status: 'processing' | 'completed' | 'failed',
  payment_gateway: 'razorpay' | 'COD',
  payment_order_id: string,
}

export const createOrder = async (params: CreateOrderParams) => {
  const { userId, userEmail, items, addressId, total_price, status, payment_status, payment_gateway, payment_order_id } = params;

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

    // 1. Validate each product and check stock (lock the rows)
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
      JSON.stringify(items),
      total_price,
      status,
      payment_gateway,
      payment_order_id,
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

// Build and send the order confirmation email. order.items only stores
// { productId, quantity }, so product details are fetched here for the email.
export const sendOrderConfirmation = async (order: any) => {
  try {
    const itemIds = (order.items || []).map((i: any) => i.productId);
    const dbProducts = itemIds.length
      ? await productService.getProducts({ ids: itemIds }, true)
      : [];
    const productMap: Record<string, any> = {};
    dbProducts.forEach((p: any) => {
      productMap[p.id] = p;
    });

    const emailItems = (order.items || []).map((i: any) => {
      const p = productMap[i.productId];
      return {
        name: p?.name ?? 'Product',
        quantity: i.quantity,
        price: Number(p?.discounted_price || p?.price || 0),
        image: p?.images && p.images.length > 0 ? p.images[0] : undefined,
      };
    });

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
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC;`,
      [userId]
    );
    return res.rows;
  } catch (err) {
    logger.error('Error fetching orders', err);
    throw err;
  }
};

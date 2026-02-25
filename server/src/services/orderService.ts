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
  products: OrderProduct[];
}

export const createOrder = async (params: CreateOrderParams) => {
  const { userId, userEmail, products } = params;

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

    const createdOrders = [];
    const orderProducts = [];
    for (const item of products) {
      const { productId, quantity } = item;

      // 1. Fetch product details
      const productRes = await query(
        'SELECT * FROM products WHERE id = $1 FOR UPDATE',
        [productId]
      );
      if (productRes.rows.length === 0) {
        throw new Error(`Product not found: ${productId}`);
      }
      const product = productRes.rows[0];

      // 2. Check stock availability
      if (product.quantity < quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      orderProducts.push(product);
    }

    for (const product of orderProducts) {
      const quantity = products.find(
        (p) => p.productId === product.id
      )?.quantity;
      if (!quantity) {
        throw new Error(`Quantity not found for product: ${product.id}`);
      }
      // 3. Calculate totals
      const priceAtPurchase = product.discounted_price || product.price;
      const totalPrice = priceAtPurchase * quantity;

      // 4. Create order record
      const insertOrderQuery = `
                INSERT INTO orders (user_id, user_email, address_id, delivery_address, product_id, quantity, price_at_purchase, total_price, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'processing')
                RETURNING *;
            `;

      const orderRes = await query(insertOrderQuery, [
        userId,
        userEmail,
        params.addressId,
        deliveryAddress,
        product.id,
        quantity,
        priceAtPurchase,
        totalPrice,
      ]);

      createdOrders.push(orderRes.rows[0]);

      // 5. Update product stock (Optional but recommended)
      await query(
        'UPDATE products SET quantity = quantity - $1 WHERE id = $2',
        [quantity, product.id]
      );
    }

    await query('COMMIT'); // Commit transaction

    // Clear product cache to reflect new quantity levels
    await clearProductCache();

    // Send order confirmation email
    try {
      const emailItems = orderProducts.map(p => {
        const qty = products.find(x => x.productId === p.id)?.quantity || 1;
        const price = p.discounted_price || p.price;
        return {
          name: p.name,
          quantity: qty,
          price: Number(price),
          image: p.images && p.images.length > 0 ? p.images[0] : undefined
        };
      });

      const orderTotal = emailItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Fetch user name for personalization
      const userRes = await query('SELECT name FROM users WHERE id = $1', [userId]);
      const userName = userRes.rows.length > 0 ? userRes.rows[0].name : 'Customer';

      // Fire off email asynchronously (no need to await it to block user response)
      emailService.sendOrderConfirmationEmail(
        userEmail,
        userName,
        createdOrders.length > 0 ? createdOrders[0].id : 'new-order',
        emailItems,
        orderTotal
      ).catch(e => logger.error('Unhandled email service error', e));
    } catch (emailErr) {
      logger.error('Failed to prepare order confirmation email', emailErr);
    }

    logger.info(
      `Orders created for user ${userEmail}, items: ${products.length}`
    );
    return createdOrders;
  } catch (err) {
    await query('ROLLBACK'); // Rollback transaction on error
    logger.error('Error creating orders', err);
    throw err;
  }
};

export const getOrders = async (userId: string) => {
  try {
    const queryText = `
            SELECT o.*, p.name as product_name, p.images as product_images
            FROM orders o
            JOIN products p ON o.product_id = p.id
            WHERE o.user_id = $1
            ORDER BY o.created_at DESC;
        `;
    const res = await query(queryText, [userId]);
    return res.rows;
  } catch (err) {
    logger.error('Error fetching orders', err);
    throw err;
  }
};

import { query } from '../db';
import * as productService from './productService';
import logger from '../utils/logger';

interface CreateOrderParams {
    userId: number;
    userEmail: string;
    productId: string;
    quantity: number;
}

export const createOrder = async (params: CreateOrderParams) => {
    const { userId, userEmail, productId, quantity } = params;

    try {
        // 1. Fetch product details
        const products = await productService.getProducts({}); // We need a way to get a single product efficiently, but for now this works if we filter in memory or add getProductById
        // Ideally productService should have getProductById. Let's assume we can fetch it via DB directly for now to be safe and atomic, or better, add getProductById to productService.
        // For this MVP, let's query DB directly for the product to ensure we get the latest stock/price.

        const productRes = await query('SELECT * FROM products WHERE id = $1', [productId]);
        if (productRes.rows.length === 0) {
            throw new Error('Product not found');
        }
        const product = productRes.rows[0];

        // 2. Check stock availability
        if (product.quantity < quantity) {
            throw new Error('Insufficient stock');
        }

        // 3. Calculate totals
        const priceAtPurchase = product.discounted_price || product.price;
        const totalPrice = priceAtPurchase * quantity;

        // 4. Create order record
        const insertOrderQuery = `
            INSERT INTO orders (user_id, user_email, product_id, quantity, price_at_purchase, total_price, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'processing')
            RETURNING *;
        `;

        const orderRes = await query(insertOrderQuery, [
            userId,
            userEmail,
            productId,
            quantity,
            priceAtPurchase,
            totalPrice
        ]);

        const order = orderRes.rows[0];

        // 5. Update product stock (Optional but recommended)
        // await query('UPDATE products SET quantity = quantity - $1 WHERE id = $2', [quantity, productId]);

        logger.info(`Order created: ${order.id} for user ${userEmail}`);
        return order;

    } catch (err) {
        logger.error('Error creating order', err);
        throw err;
    }
};

export const getOrders = async (userId: number) => {
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

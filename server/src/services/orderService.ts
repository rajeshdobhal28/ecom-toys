import { query } from '../db';
import * as productService from './productService';
import logger from '../utils/logger';

interface OrderProduct {
    productId: string;
    quantity: number;
}

interface CreateOrderParams {
    userId: number;
    userEmail: string;
    products: OrderProduct[];
}

export const createOrder = async (params: CreateOrderParams) => {
    const { userId, userEmail, products } = params;

    try {
        await query('BEGIN'); // Start transaction

        const createdOrders = [];
        const orderProducts = [];
        for (const item of products) {
            const { productId, quantity } = item;

            // 1. Fetch product details
            const productRes = await query('SELECT * FROM products WHERE id = $1 FOR UPDATE', [productId]);
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

            const quantity = products.find((p) => p.productId === product.id)?.quantity;
            if (!quantity) {
                throw new Error(`Quantity not found for product: ${product.id}`);
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
                product.id,
                quantity,
                priceAtPurchase,
                totalPrice
            ]);

            createdOrders.push(orderRes.rows[0]);

            // 5. Update product stock (Optional but recommended)
            await query('UPDATE products SET quantity = quantity - $1 WHERE id = $2', [quantity, product.id]);
        }

        await query('COMMIT'); // Commit transaction

        logger.info(`Orders created for user ${userEmail}, items: ${products.length}`);
        return createdOrders;

    } catch (err) {
        await query('ROLLBACK'); // Rollback transaction on error
        logger.error('Error creating orders', err);
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

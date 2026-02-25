import * as db from '../db';
import logger from '../utils/logger';

export const getCart = async (userId: string) => {
    try {
        const res = await db.query('SELECT items FROM carts WHERE user_id = $1', [userId]);

        // If cart doesn't exist, return empty array
        if (res.rows.length === 0) {
            return [];
        }

        const items = res.rows[0].items || [];

        // If empty array, return it directly
        if (items.length === 0) {
            return [];
        }

        // Otherwise, fetch the full product details for these items
        const productIds = items.map((item: any) => item.id);

        // Create parameterized list like $1, $2, $3 to prevent SQL injection
        const placeholders = productIds.map((_: any, idx: number) => `$${idx + 1}`).join(',');

        const productsRes = await db.query(
            `SELECT * FROM products WHERE id IN (${placeholders})`,
            productIds
        );

        // Merge the database product structure with the user's saved quantities
        const fullCart = items.map((cartItem: any) => {
            const product = productsRes.rows.find((p: any) => p.id === cartItem.id);

            // If product was deleted or not found, just return the placeholder
            if (!product) return cartItem;

            return {
                id: product.id,
                title: product.name,
                price: Number(product.price),
                rating: 5, // Default/static for now as with other products
                imageUrl: product.images && product.images.length > 0 ? product.images[0] : undefined,
                category: product.category,
                slug: product.slug,
                color: '#f8f9fa', // Default color,
                quantity: cartItem.quantity
            };
        }).filter((item: any) => item.title); // filter out items that don't have matches

        return fullCart;
    } catch (err: any) {
        logger.error(`Error fetching cart for user ${userId}`, err);
        throw err;
    }
};

export const updateCart = async (userId: string, items: any[]) => {
    try {
        // Basic validation: ensure items only have needed fields to save space
        const compactItems = items.map(item => ({
            id: item.id,
            quantity: item.quantity
        }));

        const queryText = `
      INSERT INTO carts (user_id, items, updated_at) 
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) 
      DO UPDATE SET items = EXCLUDED.items, updated_at = EXCLUDED.updated_at
      RETURNING items;
    `;

        const res = await db.query(queryText, [userId, JSON.stringify(compactItems)]);
        return res.rows[0].items;
    } catch (err: any) {
        logger.error(`Error updating cart for user ${userId}`, err);
        throw err;
    }
};

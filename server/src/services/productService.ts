import * as db from '../db';
import logger from '../utils/logger';

export const getProducts = async (filters: { category?: string; name?: string }) => {
    try {
        console.error("🔍 [DEBUG] getProducts FILTERS:", filters);
        let queryText = 'SELECT * FROM products';
        const queryParams: any[] = [];
        const whereClauses: string[] = [];

        if (filters.category) {
            whereClauses.push(`category = $${queryParams.length + 1}`);
            queryParams.push(filters.category);
        }

        if (filters.name) {
            whereClauses.push(`name = $${queryParams.length + 1}`);
            queryParams.push(filters.name);
        }

        if (whereClauses.length > 0) {
            queryText += ' WHERE ' + whereClauses.join(' AND ');
        }

        // Add sorting (optional, but good practice)
        queryText += ' ORDER BY created_at DESC';

        console.error("🔍 [DEBUG] Executing Query:", queryText, queryParams);

        const res = await db.query(queryText, queryParams);
        console.error(`🔍 [DEBUG] Found ${res.rows.length} products`);
        return res.rows;
    } catch (err: any) {
        logger.error('Error fetching products', err);
        throw err;
    }
};

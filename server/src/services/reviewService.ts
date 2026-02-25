import * as db from '../db';
import logger from '../utils/logger';
import { clearProductCache } from '../utils/redisClient';

export const upsertReview = async (userId: string, productId: string, rating: number, comment: string, isApproved: boolean = false) => {
    try {
        const queryText = `
      INSERT INTO product_reviews (user_id, product_id, rating, comment, is_approved, created_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, is_approved = EXCLUDED.is_approved, created_at = EXCLUDED.created_at
      RETURNING *;
    `;
        const res = await db.query(queryText, [userId, productId, rating, comment, isApproved]);
        await clearProductCache();
        return res.rows[0];
    } catch (err: any) {
        logger.error(`Error upserting review for user ${userId} and product ${productId}`, err);
        throw err;
    }
};

export const getReviewsByProduct = async (productId: string) => {
    try {
        const queryText = `
      SELECT r.id, r.product_id, r.rating, 
             CASE WHEN r.is_approved THEN r.comment 
                  WHEN r.comment IS NOT NULL AND r.comment != '' THEN '###UNAPPROVED###' 
                  ELSE r.comment 
             END as comment, 
             r.is_approved, r.created_at, u.name, u.picture
      FROM product_reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC;
    `;
        const res = await db.query(queryText, [productId]);
        return res.rows;
    } catch (err: any) {
        logger.error(`Error fetching reviews for product ${productId}`, err);
        throw err;
    }
};

export const getReviewsByUser = async (userId: string) => {
    try {
        const queryText = `
      SELECT id, product_id, rating, comment, is_approved, created_at
      FROM product_reviews
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
        const res = await db.query(queryText, [userId]);
        return res.rows;
    } catch (err: any) {
        logger.error(`Error fetching reviews for user ${userId}`, err);
        throw err;
    }
};

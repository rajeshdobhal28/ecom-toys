import pool from './index';
import logger from '../utils/logger';

const migrate = async () => {
    try {
        await pool.query('BEGIN');

        // Add `is_approved` column to product_reviews table
        await pool.query(`
            ALTER TABLE product_reviews
            ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;
        `);

        // Update all existing reviews to be approved so we don't accidentally hide old ones
        await pool.query(`
            UPDATE product_reviews SET is_approved = TRUE;
        `);

        await pool.query('COMMIT');
        logger.info('Review Migration completed successfully');
    } catch (err) {
        await pool.query('ROLLBACK');
        logger.error('Error in review migration', err);
    } finally {
        pool.end();
    }
};

migrate();

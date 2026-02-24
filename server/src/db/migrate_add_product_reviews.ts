import { query } from './index';

const logger = {
    info: (msg: string) => console.log(`[INFO] ${msg}`),
    error: (msg: string, err: any) => console.error(`[ERROR] ${msg}`, err),
};

const createProductReviewsTableSchema = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS product_reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
    );
  `;

    try {
        await query(createTableQuery);
        logger.info('✅ Product reviews table created successfully');
        process.exit(0);
    } catch (err) {
        logger.error('❌ Error creating product_reviews table', err);
        process.exit(1);
    }
};

createProductReviewsTableSchema();

import { query } from './index';

const logger = {
    info: (msg: string) => console.log(`[INFO] ${msg}`),
    error: (msg: string, err: any) => console.error(`[ERROR] ${msg}`, err),
};

const createCartsTableSchema = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS carts (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        items JSONB NOT NULL DEFAULT '[]',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

    try {
        await query(createTableQuery);
        logger.info('✅ Carts table created successfully');
        process.exit(0);
    } catch (err) {
        logger.error('❌ Error creating carts table', err);
        process.exit(1);
    }
};

createCartsTableSchema();

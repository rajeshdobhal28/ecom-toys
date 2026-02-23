import { query } from './index';

const logger = {
    info: (msg: string) => console.log(`[INFO] ${msg}`),
    error: (msg: string, err: any) => console.error(`[ERROR] ${msg}`, err),
};

const alterProductsTable = async () => {
    const alterTableQuery = `
    ALTER TABLE products 
    ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10, 2),
    ADD COLUMN IF NOT EXISTS brand VARCHAR(255);
  `;

    try {
        await query(alterTableQuery);
        logger.info('✅ Products table altered successfully with cost_price and brand');
        process.exit(0);
    } catch (err) {
        logger.error('❌ Error altering products table', err);
        process.exit(1);
    }
};

alterProductsTable();

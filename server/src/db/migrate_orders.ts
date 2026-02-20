import { query } from './index';

const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: string, err: any) => console.error(`[ERROR] ${msg}`, err),
};

const createOrdersTable = async () => {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS orders (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id INTEGER NOT NULL REFERENCES users(id),
            user_email VARCHAR(255),
            product_id UUID NOT NULL REFERENCES products(id),
            quantity INTEGER NOT NULL CHECK (quantity > 0),
            price_at_purchase DECIMAL(10, 2) NOT NULL,
            total_price DECIMAL(10, 2) NOT NULL,
            status VARCHAR(50) DEFAULT 'processing',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

  try {
    await query(createTableQuery);
    logger.info('✅ Orders table created successfully');
    process.exit(0);
  } catch (err) {
    logger.error('❌ Error creating orders table', err);
    process.exit(1);
  }
};

createOrdersTable();

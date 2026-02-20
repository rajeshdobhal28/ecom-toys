import { query } from './index';

const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: string, err: any) => console.error(`[ERROR] ${msg}`, err),
};

const createProductsTable = async () => {
  // Enable pgcrypto for gen_random_uuid() if not available
  const extensionQuery = `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`;

  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            sku VARCHAR(100) UNIQUE,
            slug VARCHAR(255) UNIQUE NOT NULL,
            description TEXT,
            short_description TEXT,
            category VARCHAR(100),
            quantity INTEGER DEFAULT 0,
            price DECIMAL(10, 2) NOT NULL,
            discounted_price DECIMAL(10, 2),
            is_active BOOLEAN DEFAULT true,
            images TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

  try {
    await query(extensionQuery);
    await query(createTableQuery);
    logger.info('✅ Products table created successfully');
    process.exit(0);
  } catch (err) {
    logger.error('❌ Error creating products table', err);
    process.exit(1);
  }
};

createProductsTable();

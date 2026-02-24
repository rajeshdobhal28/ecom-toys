import { query } from './index';
// Simple logging since logger might have import issues in standalone script
const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: string, err: any) => console.error(`[ERROR] ${msg}`, err),
};

const createTable = async () => {
  const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255),
            picture VARCHAR(255),
            is_admin BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

  const createCartsTable = `
        CREATE TABLE IF NOT EXISTS carts (
            user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            items JSONB NOT NULL DEFAULT '[]',
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

  try {
    await query(createUsersTable);
    logger.info('✅ Users table created successfully');
    await query(createCartsTable);
    logger.info('✅ Carts table created successfully');
    process.exit(0);
  } catch (err) {
    logger.error('❌ Error creating users table', err);
    process.exit(1);
  }
};

createTable();

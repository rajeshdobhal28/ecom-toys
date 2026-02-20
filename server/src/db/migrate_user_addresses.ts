import { query } from './index';

const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: string, err: any) => console.error(`[ERROR] ${msg}`, err),
};

const createUserAddressesTable = async () => {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS user_addresses (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            phone_number BIGINT,
            state VARCHAR(100),
            city VARCHAR(100),
            pincode INTEGER,
            address TEXT,
            is_default BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

  try {
    await query(createTableQuery);
    logger.info('✅ User addresses table created successfully');
    process.exit(0);
  } catch (err) {
    logger.error('❌ Error creating user_addresses table', err);
    process.exit(1);
  }
};

createUserAddressesTable();

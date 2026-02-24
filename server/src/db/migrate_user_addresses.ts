import { query } from './index';
import logger from '../utils/logger';

const createUserAddressesTable = async () => {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS user_addresses (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            full_name VARCHAR(255) NOT NULL,
            address_line VARCHAR(255) NOT NULL,
            city VARCHAR(255) NOT NULL,
            state VARCHAR(255) NOT NULL,
            postal_code VARCHAR(20) NOT NULL,
            country VARCHAR(100) NOT NULL DEFAULT 'India',
            phone VARCHAR(20) NOT NULL,
            is_default BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

  try {
    await query(createTableQuery);
    logger.info('✅ User Addresses table created successfully');
    process.exit(0);
  } catch (err) {
    logger.error('❌ Error creating user_addresses table', err);
    process.exit(1);
  }
};

createUserAddressesTable();

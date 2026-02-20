import { query } from './index';

const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: string, err: any) => console.error(`[ERROR] ${msg}`, err),
};

const cleanupUsersTable = async () => {
  const dropColumnsQuery = `
        ALTER TABLE users 
        DROP COLUMN IF EXISTS city,
        DROP COLUMN IF EXISTS state,
        DROP COLUMN IF EXISTS pincode,
        DROP COLUMN IF EXISTS address;
    `;

  try {
    await query(dropColumnsQuery);
    logger.info('✅ Redundant address fields removed from users table');
    process.exit(0);
  } catch (err) {
    logger.error('❌ Error cleaning up users table', err);
    process.exit(1);
  }
};

cleanupUsersTable();

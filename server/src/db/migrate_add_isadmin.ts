import { query } from './index';

const logger = {
    info: (msg: string) => console.log(`[INFO] ${msg}`),
    error: (msg: string, err: any) => console.error(`[ERROR] ${msg}`, err),
};

const alterUsersTable = async () => {
    const alterTableQuery = `
    ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
  `;

    try {
        await query(alterTableQuery);
        logger.info('✅ Users table altered successfully with is_admin');
        process.exit(0);
    } catch (err) {
        logger.error('❌ Error altering users table', err);
        process.exit(1);
    }
};

alterUsersTable();

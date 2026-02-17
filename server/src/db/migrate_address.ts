import { query } from './index';

const logger = {
    info: (msg: string) => console.log(`[INFO] ${msg}`),
    error: (msg: string, err: any) => console.error(`[ERROR] ${msg}`, err)
};

const addAddressFields = async () => {
    const alterTableQuery = `
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
        ADD COLUMN IF NOT EXISTS city VARCHAR(100),
        ADD COLUMN IF NOT EXISTS state VARCHAR(100),
        ADD COLUMN IF NOT EXISTS pincode VARCHAR(20),
        ADD COLUMN IF NOT EXISTS address TEXT;
    `;

    try {
        await query(alterTableQuery);
        logger.info('✅ Address fields added successfully to users table');
        process.exit(0);
    } catch (err) {
        logger.error('❌ Error adding address fields', err);
        process.exit(1);
    }
};

addAddressFields();

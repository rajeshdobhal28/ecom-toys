import { query } from './index';

const logger = {
    info: (msg: string) => console.log(`[INFO] ${msg}`),
    error: (msg: string, err: any) => console.error(`[ERROR] ${msg}`, err)
};

const addAddressFields = async () => {
    const alterTableQuery = `
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS phone BIGINT,
        ADD COLUMN IF NOT EXISTS city VARCHAR(100),
        ADD COLUMN IF NOT EXISTS state VARCHAR(100),
        ADD COLUMN IF NOT EXISTS pincode INTEGER,
        ADD COLUMN IF NOT EXISTS address TEXT;
    `;

    // Also handle case where columns might already exist as VARCHAR (if previously run)
    // using a separate query to be safe, or combining if we are sure.
    // Since this is a dev environment migration script, let's try to ensure types.
    const ensureTypesQuery = `
        ALTER TABLE users 
        ALTER COLUMN phone TYPE BIGINT USING phone::bigint,
        ALTER COLUMN pincode TYPE INTEGER USING pincode::integer;
    `;

    try {
        await query(alterTableQuery);
        // We run this just in case the columns existed but were wrong type (idempotency check)
        // If they were just added as BIGINT/INTEGER above, this is a no-op or harmless.
        await query(ensureTypesQuery);

        logger.info('✅ Address fields added and types verified successfully');
        process.exit(0);
    } catch (err) {
        logger.error('❌ Error adding/modifying address fields', err);
        process.exit(1);
    }
};

addAddressFields();

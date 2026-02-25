import { query } from './index';

const addFullName = async () => {
    const alterTableQuery = `
        ALTER TABLE user_addresses 
        ADD COLUMN IF NOT EXISTS full_name VARCHAR(255) DEFAULT '';
    `;

    try {
        await query(alterTableQuery);
        console.log('✅ Added full_name column to user_addresses');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error altering user_addresses', err);
        process.exit(1);
    }
};

addFullName();

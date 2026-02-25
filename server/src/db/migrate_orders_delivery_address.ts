import { query } from './index';
import dotenv from 'dotenv';
dotenv.config();

const migrate = async () => {
    try {
        await query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS delivery_address JSONB;
    `);
        console.log('Successfully added delivery_address to orders table');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        process.exit();
    }
};

migrate();

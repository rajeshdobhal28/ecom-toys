import { query } from './index';
import logger from '../utils/logger';

const addAddressToOrders = async () => {
    const addAddressIdColumnQuery = `
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_id UUID;
    ALTER TABLE orders DROP CONSTRAINT IF EXISTS fk_orders_address_id;
    ALTER TABLE orders ADD CONSTRAINT fk_orders_address_id FOREIGN KEY (address_id) REFERENCES user_addresses(id) ON DELETE SET NULL;
  `;

    try {
        await query(addAddressIdColumnQuery);
        logger.info('✅ Added address_id to orders table successfully');
        process.exit(0);
    } catch (err) {
        logger.error('❌ Error adding address_id to orders table', err);
        process.exit(1);
    }
};

addAddressToOrders();

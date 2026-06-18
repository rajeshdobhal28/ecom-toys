import { query } from './index';
import logger from '../utils/logger';

// NOTE: This DROPS and recreates the orders table.
// The old schema was one-row-per-product with no grouping key, so existing
// rows cannot be merged into multi-product orders — recreation is the only
// clean path. Existing order data WILL be lost (acceptable in dev).
const recreateOrdersTable = async () => {
  const sql = `
    DROP TABLE IF EXISTS orders CASCADE;

    CREATE TABLE orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id),
      user_email VARCHAR(255),
      address_id UUID REFERENCES user_addresses(id) ON DELETE SET NULL,
      delivery_address JSONB,
      items JSONB NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'processing',
      payment_gateway VARCHAR(50),
      payment_order_id VARCHAR(255),
      payment_id VARCHAR(255),
      payment_signature VARCHAR(255),
      payment_status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE UNIQUE INDEX idx_orders_payment_order_id
      ON orders(payment_order_id)
      WHERE payment_order_id IS NOT NULL;

    CREATE INDEX idx_orders_user_id ON orders(user_id);
  `;

  try {
    await query(sql);
    logger.info('✅ Recreated orders table (multi-product + payment columns) successfully');
    process.exit(0);
  } catch (err) {
    logger.error('❌ Error recreating orders table', err);
    process.exit(1);
  }
};

recreateOrdersTable();

import { query } from './index';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

const migrate = async () => {
    try {
        logger.info('Starting UUID migration for users.id...');

        await query('BEGIN');

        // 1. Add uuid extension if not exists
        await query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

        // 2. Add temporary UUID columns to all affected tables
        logger.info('Adding temporary UUID columns...');
        await query(`
      ALTER TABLE users ADD COLUMN new_id UUID DEFAULT uuid_generate_v4();
      ALTER TABLE carts ADD COLUMN new_user_id UUID;
      ALTER TABLE user_addresses ADD COLUMN new_user_id UUID;
      ALTER TABLE product_reviews ADD COLUMN new_user_id UUID;
      ALTER TABLE orders ADD COLUMN new_user_id UUID;
    `);

        // 3. Backfill child tables with the new UUIDs by JOINing on the old INTEGER ids
        logger.info('Backfilling UUID data across relationships...');
        await query(`
      UPDATE carts
      SET new_user_id = users.new_id
      FROM users
      WHERE carts.user_id = users.id;

      UPDATE user_addresses
      SET new_user_id = users.new_id
      FROM users
      WHERE user_addresses.user_id = users.id;

      UPDATE product_reviews
      SET new_user_id = users.new_id
      FROM users
      WHERE product_reviews.user_id = users.id;

      UPDATE orders
      SET new_user_id = users.new_id
      FROM users
      WHERE orders.user_id = users.id;
    `);

        // 4. Drop old foreign keys and constraints
        logger.info('Dropping old foreign keys and constraints...');
        await query(`
      ALTER TABLE carts DROP CONSTRAINT carts_user_id_fkey;
      ALTER TABLE user_addresses DROP CONSTRAINT user_addresses_user_id_fkey;
      ALTER TABLE product_reviews DROP CONSTRAINT product_reviews_user_id_fkey;
      ALTER TABLE product_reviews DROP CONSTRAINT product_reviews_user_id_product_id_key;
      ALTER TABLE orders DROP CONSTRAINT orders_user_id_fkey;
    `);

        // 5. Drop old primary key constraints and integer columns
        logger.info('Replacing INTEGER id columns with UUID columns...');
        await query(`
      ALTER TABLE users DROP CONSTRAINT users_pkey;
      
      ALTER TABLE users DROP COLUMN id;
      ALTER TABLE carts DROP COLUMN user_id;
      ALTER TABLE user_addresses DROP COLUMN user_id;
      ALTER TABLE product_reviews DROP COLUMN user_id;
      ALTER TABLE orders DROP COLUMN user_id;
    `);

        // 6. Rename the new UUID columns to their original names
        await query(`
      ALTER TABLE users RENAME COLUMN new_id TO id;
      ALTER TABLE carts RENAME COLUMN new_user_id TO user_id;
      ALTER TABLE user_addresses RENAME COLUMN new_user_id TO user_id;
      ALTER TABLE product_reviews RENAME COLUMN new_user_id TO user_id;
      ALTER TABLE orders RENAME COLUMN new_user_id TO user_id;
    `);

        // 7. Make the new columns NOT NULL and re-apply constraints
        logger.info('Enforcing NOT NULL and re-applying Constraints...');
        await query(`
      ALTER TABLE users ALTER COLUMN id SET NOT NULL;
      ALTER TABLE users ADD PRIMARY KEY (id);

      ALTER TABLE carts ALTER COLUMN user_id SET NOT NULL;
      ALTER TABLE carts ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

      ALTER TABLE user_addresses ALTER COLUMN user_id SET NOT NULL;
      ALTER TABLE user_addresses ADD CONSTRAINT user_addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

      ALTER TABLE product_reviews ALTER COLUMN user_id SET NOT NULL;
      ALTER TABLE product_reviews ADD CONSTRAINT product_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
      ALTER TABLE product_reviews ADD CONSTRAINT product_reviews_user_id_product_id_key UNIQUE(user_id, product_id);

      ALTER TABLE orders ALTER COLUMN user_id SET NOT NULL;
      ALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    `);

        await query('COMMIT');
        logger.info('UUID migration successfully completed!');
    } catch (err) {
        await query('ROLLBACK');
        logger.error('UUID Migration failed! Transactions rolled back.', err);
    } finally {
        process.exit();
    }
};

migrate();

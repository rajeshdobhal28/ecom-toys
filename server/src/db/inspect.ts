import { query } from './index';

async function describeTable(table: string) {
    const result = await query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = $1;
  `, [table]);
    console.log(`--- Table: ${table} ---`);
    console.table(result.rows);
}

async function run() {
    await describeTable('orders');
    await describeTable('user_addresses');
    process.exit(0);
}
run();

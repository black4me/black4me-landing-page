const { Client } = require('pg');

async function run() {
  const client = new Client({ connectionString: 'postgresql://postgres:Adc7aQINEW1oG389@db.rgfiszmnxktetnahufpm.supabase.co:5432/postgres' });
  await client.connect();
  const res = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'coupons';`);
  console.log('Coupons Columns:', res.rows.map(r => r.column_name));
  await client.end();
}
run().catch(console.error);

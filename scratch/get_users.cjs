const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:Adc7aQINEW1oG389@db.rgfiszmnxktetnahufpm.supabase.co:5432/postgres'
});

async function run() {
  await client.connect();
  const res = await client.query('SELECT id, email, encrypted_password FROM auth.users');
  console.log(res.rows);
  await client.end();
}

run().catch(console.error);

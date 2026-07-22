const fs = require('fs');
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:Adc7aQINEW1oG389@db.rgfiszmnxktetnahufpm.supabase.co:5432/postgres'
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to DB');
    const sql = fs.readFileSync('black4me-landing-page/supabase/migrations/20260721200000_create_offer_pages.sql', 'utf8');
    await client.query(sql);
    console.log('Migration executed successfully');
    
    // Also mark this migration as applied to avoid issues later
    await client.query(`
      CREATE TABLE IF NOT EXISTS supabase_migrations.schema_migrations (
        version character varying(255) NOT NULL PRIMARY KEY
      );
      INSERT INTO supabase_migrations.schema_migrations (version) 
      VALUES ('20260721200000') ON CONFLICT DO NOTHING;
    `);
    console.log('Migration version saved in supabase_migrations');

  } catch (err) {
    console.error('Error executing migration:', err);
  } finally {
    await client.end();
  }
}

run();

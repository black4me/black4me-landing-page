require('dotenv').config({path: '.env.vercel.prod'});
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const sql = fs.readFileSync('black4me-landing-page/supabase/migrations/20260721200000_create_offer_pages.sql', 'utf8');
    const { data, error } = await supabase.rpc('exec_sql', { query: sql });
    if (error) {
      console.error('Migration failed:', error);
    } else {
      console.log('Migration successful:', data);
    }
  } catch (err) {
    console.error('Error running script:', err);
  }
}

run();

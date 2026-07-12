require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const query = `
    ALTER TABLE products ADD COLUMN IF NOT EXISTS features text[] DEFAULT '{}'::text[];
    ALTER TABLE products ADD COLUMN IF NOT EXISTS chapters text[] DEFAULT '{}'::text[];
  `;

  // Note: we can't run arbitrary SQL via JS client without an RPC function
  // But wait! Is there an RPC function `exec_sql`? Let's try.
  const { data, error } = await supabase.rpc('exec_sql', { query: query });
  console.log('RPC result:', error || data);
}
run();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing env vars. NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl, 'SUPABASE_SERVICE_ROLE_KEY:', serviceKey ? 'exists' : 'missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function run() {
  const { data, error } = await supabase.auth.admin.updateUserById(
    'a5fb2c71-dc1b-4a0b-9eee-33e9f9a7a003', // info@black4me.com
    { password: 'Black4meAdmin123!' }
  );
  if (error) throw error;
  console.log('Password updated successfully for info@black4me.com');
}

run().catch(console.error);

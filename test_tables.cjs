const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const tables = [
  'products',
  'orders',
  'coupons',
  'newsletter',
  'subscribers',
  'email_campaigns',
  'site_settings',
  'comparison_items',
  'funnel_stages',
  'value_stack_items',
  'faqs',
  'testimonials',
  'consultations',
  'lead_magnets',
  'user_access',
  'checkout_sessions',
  'private_settings',
  'blog_posts',
  'authors'
];

async function check() {
  console.log('--- Checking Supabase Tables ---');
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Table "${table}": Error -> ${error.message} (Code: ${error.code})`);
      } else {
        console.log(`✅ Table "${table}": Exists -> Row count: ${count}`);
      }
    } catch (err) {
      console.log(`❌ Table "${table}": Exception -> ${err.message}`);
    }
  }
}

check();

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false }, db: { schema: 'crm' } }
);

async function seed() {
  console.log('Seeding integration accounts...');

  // Update Activepieces
  const { data: ap, error: apErr } = await supabase
    .from('integrations')
    .select('id')
    .eq('name', 'activepieces')
    .single();

  if (ap) {
    await supabase.from('integration_accounts').update({
      config: { webhook_url: 'https://cloud.activepieces.com/api/v1/webhooks/catch/dummy_activepieces_hook' }
    }).eq('integration_id', ap.id);
    console.log('Updated Activepieces config');
  }

  // Update Google Sheets
  const { data: gs, error: gsErr } = await supabase
    .from('integrations')
    .select('id')
    .eq('name', 'google_sheets')
    .single();
    
  if (gs) {
    await supabase.from('integration_accounts').update({
      config: { webhook_url: 'https://hooks.zapier.com/hooks/catch/dummy_google_sheets_hook' } // Using a dummy zapier/make hook for sheets
    }).eq('integration_id', gs.id);
    console.log('Updated Google Sheets config');
  }
  
  console.log('Done.');
}

seed();

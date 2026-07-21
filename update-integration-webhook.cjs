const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false }, db: { schema: 'crm' } }
);

async function updateWebhook() {
  // Find the activepieces integration
  const { data: integration, error: intErr } = await supabase
    .from('integrations')
    .select('id, name')
    .eq('name', 'activepieces')
    .maybeSingle();

  if (intErr || !integration) {
    // Integration might not exist yet — insert both integration + account
    console.log('Activepieces integration not found. Inserting...');
    
    const { data: newInt, error: insertErr } = await supabase
      .from('integrations')
      .insert([{
        name: 'activepieces',
        display_name: 'Activepieces',
        type: 'automation',
        status: 'active',
        description: 'Automation layer for CRM events'
      }])
      .select()
      .single();

    if (insertErr) { console.error('Insert error:', insertErr); return; }

    await supabase.from('integration_accounts').insert([{
      integration_id: newInt.id,
      account_name: 'BLACK4ME Main',
      config: {
        webhook_url: 'https://cloud.activepieces.com/api/v1/webhooks/jRZDWIbkP3WWZRmhU1fyz',
        spreadsheet_name: 'BLACK4ME LEAD CRM',
        worksheet_name: 'Leads CRM',
        verified: true,
        verified_at: new Date().toISOString()
      },
      status: 'active'
    }]);

    console.log('Created integration + account with real webhook URL ✅');
    return;
  }

  // Update existing account
  const { data: updated, error: updateErr } = await supabase
    .from('integration_accounts')
    .update({
      config: {
        webhook_url: 'https://cloud.activepieces.com/api/v1/webhooks/jRZDWIbkP3WWZRmhU1fyz',
        spreadsheet_name: 'BLACK4ME LEAD CRM',
        worksheet_name: 'Leads CRM',
        verified: true,
        verified_at: new Date().toISOString()
      },
      status: 'active'
    })
    .eq('integration_id', integration.id)
    .select();

  if (updateErr) { console.error('Update error:', updateErr); return; }
  console.log('Updated Activepieces webhook URL in Supabase ✅', updated);
}

updateWebhook();

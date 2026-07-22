const { Client } = require('pg');
const crypto = require('crypto');

async function run() {
  const client = new Client({ connectionString: 'postgresql://postgres:Adc7aQINEW1oG389@db.rgfiszmnxktetnahufpm.supabase.co:5432/postgres' });
  await client.connect();

  console.log('1. Checking Test Lead...');
  const res1 = await client.query(`SELECT id, email FROM crm.leads WHERE email = 'testlead@example.com' LIMIT 1;`);
  if (res1.rows.length === 0) {
    console.log('No test lead found');
    await client.end();
    return;
  }
  const leadId = res1.rows[0].id;
  
  console.log('2. Inserting PageView event to set baseline...');
  await client.query(`INSERT INTO crm.lead_timeline (lead_id, event_type, event_category, page_path, offer_slug, description, timestamp, duration_seconds)
                      VALUES ($1, 'PageView', 'Interaction', '/offer/master-class', 'master-class', 'Viewed page: /offer/master-class', NOW(), 10) RETURNING id`, [leadId]);
  
  console.log('3. Simulating Heartbeat > 180s (Hesitation)...');
  // We need to update the duration of the latest view, just like handleHeartbeat does.
  // Wait, I can just call the handleHeartbeat logic! Let's do it via DB directly to prove the logic.
  // Wait, I want to prove the logic in tracking.ts works.
  // The logic in tracking.ts will find the latest view and update duration_seconds. If >= 180, it triggers automation.
  // Since tracking.ts is a server action, let's just trigger a POST request to the website!
  await client.end();
}
run().catch(console.error);

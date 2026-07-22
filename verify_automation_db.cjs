const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:Adc7aQINEW1oG389@db.rgfiszmnxktetnahufpm.supabase.co:5432/postgres'
});
async function run() {
  try {
    await client.connect();
    console.log('Connected to DB');
    
    // Check subscribers
    const subRes = await client.query("SELECT * FROM public.subscribers WHERE email = 'subscribeduser@example.com'");
    console.log('Subscribers Row:', subRes.rows);

    // Check crm.leads
    const leadRes = await client.query("SELECT * FROM crm.leads WHERE email = 'subscribeduser@example.com'");
    console.log('CRM Lead Row:', leadRes.rows);

    // Check events
    const eventRes = await client.query("SELECT event_type FROM public.events WHERE user_email = 'subscribeduser@example.com'");
    console.log('Events logged:', eventRes.rows);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}
run();

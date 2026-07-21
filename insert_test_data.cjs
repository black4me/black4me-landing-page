const { Client } = require('pg');

const connectionString = "postgresql://postgres:Adc7aQINEW1oG389@db.rgfiszmnxktetnahufpm.supabase.co:5432/postgres";

async function insertTestData() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    console.log("Inserting test lead...");
    
    // Insert Lead
    const leadRes = await client.query(`
      INSERT INTO crm.leads (email, phone, full_name, lead_source, lead_score)
      VALUES ('test_diagnostics@example.com', '+1234567890', 'Test Lead', 'Activepieces', 15)
      RETURNING id;
    `);
    const leadId = leadRes.rows[0].id;
    console.log("Lead ID:", leadId);

    // Insert Funnel Progress
    await client.query(`
      INSERT INTO crm.lead_funnel_progress (lead_id, current_stage, time_in_stage, has_purchased_core, is_lost)
      VALUES ($1, 'aware', '1 day', false, false);
    `, [leadId]);
    
    // Insert Funnel History
    await client.query(`
      INSERT INTO crm.funnel_stage_history (lead_id, stage_name, entered_at)
      VALUES ($1, 'aware', NOW());
    `, [leadId]);

    // Update Daily Metrics
    await client.query(`
      INSERT INTO crm.funnel_metrics_daily (date, new_leads, active_leads, converted_to_core)
      VALUES (CURRENT_DATE, 1, 1, 0)
      ON CONFLICT (date) DO UPDATE SET new_leads = crm.funnel_metrics_daily.new_leads + 1;
    `);

    console.log("Test data inserted successfully.");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await client.end();
  }
}

insertTestData();

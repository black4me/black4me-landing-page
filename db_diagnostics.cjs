const { Client } = require('pg');

const connectionString = "postgresql://postgres:Adc7aQINEW1oG389@db.rgfiszmnxktetnahufpm.supabase.co:5432/postgres";

async function checkDiagnostics() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    console.log("--- Checking Dashboard Views ---");
    const views = ['v_daily_revenue', 'v_daily_leads', 'v_daily_funnel', 'v_offer_performance'];
    for (const view of views) {
      try {
        const res = await client.query(`SELECT * FROM crm.${view} LIMIT 5`);
        console.log(`[OK] View ${view}: ${res.rowCount} rows found.`);
        if (res.rowCount > 0) console.log(res.rows);
      } catch (e) {
        console.error(`[ERROR] View ${view}: ${e.message}`);
      }
    }

    console.log("\n--- Checking Leads Data ---");
    const leadTables = ['leads', 'lead_funnel_progress', 'lead_offer_state'];
    for (const table of leadTables) {
      try {
        const res = await client.query(`SELECT count(*) as total FROM crm.${table}`);
        console.log(`[OK] Table ${table} count: ${res.rows[0].total}`);
      } catch (e) {
        console.error(`[ERROR] Table ${table}: ${e.message}`);
      }
    }

    console.log("\n--- Checking Sequences Relations ---");
    try {
      const res = await client.query(`
        SELECT
            tc.table_schema, 
            tc.constraint_name, 
            tc.table_name, 
            kcu.column_name, 
            ccu.table_schema AS foreign_table_schema,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name 
        FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema='crm' AND tc.table_name LIKE '%sequence%';
      `);
      console.log(`Foreign keys for sequence tables:`, res.rows);
    } catch (e) {
      console.error(`[ERROR] Checking FKs: ${e.message}`);
    }

    console.log("\n--- Checking Integrations Data ---");
    const intTables = ['integrations', 'integration_accounts', 'integration_events', 'integration_sync_logs'];
    for (const table of intTables) {
      try {
        const res = await client.query(`SELECT count(*) as total FROM crm.${table}`);
        console.log(`[OK] Table ${table} count: ${res.rows[0].total}`);
      } catch (e) {
        console.error(`[ERROR] Table ${table}: ${e.message}`);
      }
    }

  } catch (error) {
    console.error("Error connecting to DB:", error);
  } finally {
    await client.end();
  }
}

checkDiagnostics();

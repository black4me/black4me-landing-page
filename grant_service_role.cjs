const { Client } = require('pg');

const connectionString = "postgresql://postgres:Adc7aQINEW1oG389@db.rgfiszmnxktetnahufpm.supabase.co:5432/postgres";

async function executeSql() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    // Grant usage on schema to service_role
    await client.query("GRANT USAGE ON SCHEMA crm TO service_role;");
    
    // Grant all privileges on all tables in schema crm to service_role
    await client.query("GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA crm TO service_role;");
    
    // Grant all privileges on all sequences in schema crm to service_role
    await client.query("GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA crm TO service_role;");
    
    // Grant to postgres (just in case)
    await client.query("GRANT USAGE ON SCHEMA crm TO postgres;");
    await client.query("GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA crm TO postgres;");
    await client.query("GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA crm TO postgres;");

    // Also, for sequences error: Could not find a relationship between 'message_sequences' and 'sequence_enrollments'
    // Let's check the schema for these tables to ensure foreign keys are defined.

    console.log("Permissions granted to service_role successfully.");
  } catch (error) {
    console.error("Error executing SQL script:", error);
  } finally {
    await client.end();
  }
}

executeSql();

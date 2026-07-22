const { Client } = require('pg');

async function run() {
  const proofEmail = 'testlead@example.com';

  const client = new Client({ connectionString: 'postgresql://postgres:Adc7aQINEW1oG389@db.rgfiszmnxktetnahufpm.supabase.co:5432/postgres' });
  await client.connect();
  
  const resLead = await client.query(`SELECT id FROM crm.leads WHERE email = $1 LIMIT 1;`, [proofEmail]);
  if (resLead.rows.length === 0) {
     console.log('Lead not found!'); return;
  }
  const leadId = resLead.rows[0].id;
  console.log('Lead found with ID:', leadId);

  console.log('1. Sending PageView event via API...');
  const res1 = await fetch('https://black4me.com/api/tracking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'PageView',
      userEmail: proofEmail,
      parameters: {
        page_path: '/offer/master-class',
        offer_slug: 'master-class'
      }
    })
  });
  console.log('PageView API Response:', await res1.json());

  console.log('2. Simulating 3-minute Hesitation via API...');
  const res2 = await fetch('https://black4me.com/api/tracking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'Heartbeat',
      userEmail: proofEmail,
      parameters: {
        page_path: '/offer/master-class',
        offer_slug: 'master-class',
        duration_seconds: 185
      }
    })
  });
  console.log('Heartbeat API Response:', await res2.json());

  console.log('3. Querying Timeline from DB to verify results...');
  const resTimeline = await client.query(`
    SELECT event_type, event_category, description, timestamp 
    FROM crm.lead_timeline 
    WHERE lead_id = $1 
    ORDER BY timestamp DESC LIMIT 3;
  `, [leadId]);
  
  console.log('--- TIMELINE EVENTS ---');
  resTimeline.rows.forEach(r => {
    console.log(`[${r.timestamp.toISOString()}] ${r.event_type} (${r.event_category}): ${r.description}`);
  });
  
  const resCoupons = await client.query(`
    SELECT code, value as discount_value 
    FROM public.coupons 
    WHERE code LIKE 'COMEBACK-%' 
    ORDER BY created_at DESC LIMIT 1;
  `);
  console.log('--- GENERATED COUPON ---');
  if (resCoupons.rows.length > 0) {
    console.log(`Coupon Code: ${resCoupons.rows[0].code}, Discount: ${resCoupons.rows[0].discount_value}%`);
  } else {
    console.log('No coupon generated.');
  }

  await client.end();
}

run().catch(console.error);

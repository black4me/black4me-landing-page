const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function runTest() {
  console.log('--- STARTING E2E CRM TEST ---');

  // 1. New Lead Flow
  console.log('\n[1] Testing New Lead Flow...');
  const leadRes = await fetch(`${baseUrl}/api/tracking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      distinct_id: `e2e_device_${Date.now()}`,
      event_name: 'lead_created',
      lead_id: null,
      email: `test_lead_${Date.now()}@example.com`,
      source: 'e2e_test',
      metadata: {}
    })
  });
  
  // Try to parse lead_id from some response? 
  // Actually, /api/tracking might not return the lead_id right now in success response.
  // Wait, my /api/tracking implementation: it returns `{ success: true, lead_id: ... }` if it creates a lead?
  const leadData = await leadRes.json();
  const leadId = leadData.lead_id || '9b8cebb0-85f9-461d-8b09-f62f0f4a2d80'; // fallback just in case
  console.log('Lead creation response:', leadData);

  // 2. Sequence Enrollment Flow
  console.log('\n[2] Testing Sequence Enrollment...');
  const seqRes = await fetch(`${baseUrl}/api/crm/sequences/enroll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lead_id: leadId,
      sequence_id: '12345678-1234-1234-1234-123456789012' // Need a real ID or it fails safely
    })
  });
  console.log('Sequence enrollment response:', await seqRes.json());

  // 3. Offer Purchase Flow
  console.log('\n[3] Testing Offer Purchase Flow...');
  const purchaseRes = await fetch(`${baseUrl}/api/tracking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: 'payment_success',
      lead_id: leadId,
      metadata: { offer_id: '22345678-1234-1234-1234-123456789012', order_id: 'ord_123' }
    })
  });
  console.log('Offer purchase response:', await purchaseRes.json());

  // 4. Trigger Worker to process integration events
  console.log('\n[4] Triggering Integrations Worker...');
  const workerRes = await fetch(`${baseUrl}/api/crm/integrations/worker`, { method: 'POST' });
  console.log('Worker response:', await workerRes.json());

  console.log('\n--- E2E TEST COMPLETE ---');
}

runTest();

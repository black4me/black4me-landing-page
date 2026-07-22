import { trackEvent } from '../src/server/actions/tracking';

async function testHeartbeat() {
  console.log('Testing Heartbeat for testlead@example.com');
  
  // 1. Send PageView to set up the baseline
  await trackEvent({
    eventType: 'PageView',
    userEmail: 'testlead@example.com',
    parameters: {
      page_path: '/offer/master-class',
      offer_slug: 'master-class'
    }
  });
  console.log('PageView recorded.');
  
  // 2. Send Heartbeat with duration_seconds = 185 (hesitation)
  await trackEvent({
    eventType: 'Heartbeat',
    userEmail: 'testlead@example.com',
    parameters: {
      page_path: '/offer/master-class',
      offer_slug: 'master-class',
      duration_seconds: 185
    }
  });
  console.log('Heartbeat (185s) recorded. Hesitation automation should have triggered.');
}

testHeartbeat().catch(console.error);

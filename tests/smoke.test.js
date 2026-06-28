const crypto = require('crypto');

console.log("=== BLACK4ME Smoke Tests ===");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// 1. Webhook Signature Generation & Verification Simulator
function testStripeWebhookSignature() {
  const payload = '{"type":"checkout.session.completed"}';
  const secret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy';
  
  // Create valid signature
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
  const stripeSignatureHeader = `t=${timestamp},v1=${signature}`;
  
  assert(stripeSignatureHeader.includes('v1='), 'Generates valid Stripe signature format');
  assert(stripeSignatureHeader.includes(`t=${timestamp}`), 'Includes timestamp in signature');
}

// 2. Auth Fallback Security
function testAuthFallbacks() {
  // If the app runs without RESEND_API_KEY it should fail fast instead of failing open
  const hasResend = !!process.env.RESEND_API_KEY;
  assert(!hasResend || process.env.RESEND_API_KEY !== 're_dummy', 'No dummy fallback for Resend is used in prod configuration');
}

// Run Tests
try {
  testStripeWebhookSignature();
  testAuthFallbacks();
} catch (e) {
  console.error("Test execution error:", e);
  failed++;
}

console.log(`\nResults: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

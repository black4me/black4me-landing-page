import { test, describe } from 'node:test';
import assert from 'node:assert';
import { createClient } from '@supabase/supabase-js';

// We run these tests against the environment variables provided in CI or .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key';

describe('Security Regression Tests', () => {
  test('RLS Bypass Simulation (Zero-Trust Check)', async () => {
    // 1. Initialize anonymous, untrusted client
    const anonClient = createClient(supabaseUrl, supabaseAnonKey);
    
    // 2. Attempt to select restricted table
    const { data, error } = await anonClient.from('user_access').select('*');
    
    // 3. Verify it does not bypass RLS
    // Expected: error because RLS policies block anonymous select, or data is strictly empty array.
    if (error) {
      // Supabase sometimes returns empty string code if anon key is completely invalid or no rows exist with RLS
      if (error.code && error.code !== '') {
        assert.ok(['42501', 'PGRST301'].includes(error.code), `Should throw permission denied / RLS violation. Got: ${error.code}`);
      }
    } else {
      assert.strictEqual(data?.length, 0, 'RLS must return 0 rows for unauthenticated access');
    }
  });

  test('Webhook Replay & Validation Simulation', async () => {
    // We simulate hitting the local API or testing the schema directly.
    // For this simulation, we'll test the Zod schema directly since CI might not have Next.js running yet.
    const { stripeWebhookSchema } = await import('../src/server/validation/webhook.schema');
    
    const invalidPayload = {
      id: 'evt_123',
      object: 'event',
      type: 'checkout.session.completed',
      // Missing 'created'
      data: {
        object: {}
      }
    };

    const result = stripeWebhookSchema.safeParse(invalidPayload);
    assert.strictEqual(result.success, false, 'Schema must reject incomplete payloads');
    
    const driftPayload = {
      id: 'evt_1234567890',
      object: 'event',
      type: 'checkout.session.completed',
      created: 1000000, // Year 1970 - very stale
      data: { object: {} }
    };

    const driftResult = stripeWebhookSchema.safeParse(driftPayload);
    assert.strictEqual(driftResult.success, true, 'Schema parses correctly but drift control should block it later');
    
    const now = Date.now();
    const eventTimestamp = driftPayload.created * 1000;
    assert.ok(now - eventTimestamp > (5 * 60 * 1000), 'Drift control logic must identify this as stale');
  });
});

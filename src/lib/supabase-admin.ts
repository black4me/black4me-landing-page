import { createClient } from '@supabase/supabase-js';

// We need the SERVICE ROLE KEY to bypass RLS and read/write securely from the backend.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

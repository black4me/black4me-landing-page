import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkCart() {
  const { data, error } = await supabase
    .from('checkout_sessions')
    .select('*')
    .eq('email', 'test_abandoned_cart@example.com');
  
  console.log("Error:", error);
  console.log("Data:", data);
}

checkCart();

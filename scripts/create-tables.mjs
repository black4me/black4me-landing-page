// Create missing tables in Supabase using REST API
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rgfiszmnxktetnahufpm.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZmlzem1ueGt0ZXRuYWh1ZnBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjEzNzEyOSwiZXhwIjoyMDk3NzEzMTI5fQ.AjaHd80swTNZMKauJPIEarLAu0UgqXtfRMT95tP8mys';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const queries = [
  // Add missing columns to products table
  `ALTER TABLE IF EXISTS products 
    ADD COLUMN IF NOT EXISTS sale_price NUMERIC(10,2),
    ADD COLUMN IF NOT EXISTS file_url TEXT,
    ADD COLUMN IF NOT EXISTS payment_link TEXT,
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true`,

  // Create consultations table
  `CREATE TABLE IF NOT EXISTS consultations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    appointment_date TEXT,
    appointment_time TEXT,
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Create testimonials table
  `CREATE TABLE IF NOT EXISTS testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    country TEXT DEFAULT 'السعودية',
    rating INTEGER DEFAULT 5,
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Create faqs table
  `CREATE TABLE IF NOT EXISTS faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Create subscribers table
  `CREATE TABLE IF NOT EXISTS subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    country TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
];

async function runSQL(query) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  return response;
}

// Use pg_query via Supabase management API
async function execMigration() {
  for (const sql of queries) {
    try {
      // Try using the postgres extension
      const { data, error } = await supabase.rpc('exec_sql', { query: sql }).catch(() => ({ error: { message: 'rpc not available' } }));
      if (error) {
        console.log(`⚠️ RPC error: ${error.message}`);
        // Try direct table operations as fallback
      } else {
        console.log('✅ SQL executed');
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }

  // Now seed data
  console.log('\nSeeding FAQs...');
  const { error: e1 } = await supabase.from('faqs').insert([
    { question: 'هل يناسب هذا النظام من لا يملك خبرة تسويقية؟', answer: 'نعم! النظام صُمِّم ليكون بسيطاً وعملياً حتى للمبتدئين تماماً.', order_index: 1 },
    { question: 'ما الذي يميز BLACK4ME؟', answer: 'نحن لا نبيع محتوى نظرياً، بل نقدم أنظمة جاهزة للتطبيق في السوق العربي.', order_index: 2 },
    { question: 'هل يوجد دعم بعد الشراء؟', answer: 'جميع المشترين يحصلون على دعم 30 يوماً + إمكانية حجز جلسة استشارة.', order_index: 3 },
    { question: 'ما طرق الدفع المتاحة؟', answer: 'نقبل جميع البطاقات الدولية عبر Stripe وPayPal.', order_index: 4 },
    { question: 'هل يمكن الحصول على استرداد؟', answer: 'نعم، ضمان استرداد كامل خلال 7 أيام.', order_index: 5 },
  ]);
  console.log(e1 ? `FAQs error: ${e1.message}` : '✅ FAQs inserted');

  console.log('Updating products...');
  const { error: e2 } = await supabase.from('products').update({ is_active: true, sale_price: 49 }).eq('is_active', false);
  const { error: e3 } = await supabase.from('products').select('*').limit(1);
  console.log(e3 ? `Products: ${e3.message}` : '✅ Products table ok');

  // Check all tables
  const tables = ['products', 'orders', 'consultations', 'testimonials', 'faqs', 'subscribers'];
  console.log('\nVerifying tables:');
  for (const t of tables) {
    const { error } = await supabase.from(t).select('*').limit(1);
    console.log(error ? `❌ ${t}: ${error.message}` : `✅ ${t}: OK`);
  }
}

execMigration().catch(console.error);

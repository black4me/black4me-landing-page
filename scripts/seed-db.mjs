// Script to initialize Supabase tables using the service role key
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
  'https://rgfiszmnxktetnahufpm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZmlzem1ueGt0ZXRuYWh1ZnBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjEzNzEyOSwiZXhwIjoyMDk3NzEzMTI5fQ.AjaHd80swTNZMKauJPIEarLAu0UgqXtfRMT95tP8mys'
);

async function seed() {
  console.log('Seeding FAQs...');
  const { error: faqErr } = await supabase.from('faqs').upsert([
    { question: 'هل يناسب هذا النظام من لا يملك خبرة تسويقية؟', answer: 'نعم! النظام صُمِّم ليكون بسيطاً وعملياً حتى للمبتدئين تماماً. ستجد خطوات واضحة وقابلة للتطبيق الفوري.', order_index: 1 },
    { question: 'ما الذي يميز BLACK4ME عن المنتجات الأخرى؟', answer: 'نحن لا نبيع محتوى نظرياً، بل نقدم أنظمة وأدوات جاهزة للتطبيق، مدعومة بتجربة حقيقية في السوق العربي.', order_index: 2 },
    { question: 'هل يوجد دعم بعد الشراء؟', answer: 'بالتأكيد! جميع المشترين يحصلون على دعم عبر البريد الإلكتروني لمدة 30 يوماً، ويمكن الترقية لجلسة استشارة شخصية.', order_index: 3 },
    { question: 'ما هي طرق الدفع المتاحة؟', answer: 'نقبل جميع البطاقات الدولية (Visa, MasterCard, Amex) عبر Stripe الآمن، بالإضافة إلى PayPal.', order_index: 4 },
    { question: 'هل يمكن الحصول على استرداد المبلغ؟', answer: 'نعم، نقدم ضمان استرداد كامل خلال 7 أيام إذا لم تكن راضياً عن المحتوى.', order_index: 5 }
  ], { onConflict: 'id', ignoreDuplicates: true });
  
  if (faqErr) console.log('FAQ error (table may not exist yet):', faqErr.message);
  else console.log('✅ FAQs seeded');

  console.log('Seeding products...');
  const { error: prodErr } = await supabase.from('products').upsert([
    {
      title: 'حزمة BLACK4ME الشاملة',
      description: 'النظام الكامل للتسويق الرقمي الذكي: كتابان + جلسة استشارة + أدوات تطبيقية جاهزة للسوق العربي.',
      price: 98,
      sale_price: 49,
      is_active: true
    }
  ], { ignoreDuplicates: true });

  if (prodErr) console.log('Product error:', prodErr.message);
  else console.log('✅ Products seeded');

  // Check tables exist
  const tables = ['products', 'orders', 'consultations', 'testimonials', 'faqs', 'subscribers'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) console.log(`❌ Table "${table}" issue: ${error.message}`);
    else console.log(`✅ Table "${table}" exists`);
  }
}

seed().catch(console.error);

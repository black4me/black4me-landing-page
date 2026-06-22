-- ═══════════════════════════════════════════════════════
-- BLACK4ME Database Schema - Supabase Migration
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 49,
  sale_price NUMERIC(10,2),
  file_url TEXT,
  payment_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  product_id TEXT,
  amount NUMERIC(10,2) NOT NULL,
  payment_gateway TEXT DEFAULT 'stripe',
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Consultations Table
CREATE TABLE IF NOT EXISTS consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  appointment_date TEXT,
  appointment_time TEXT,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  country TEXT DEFAULT 'السعودية',
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Subscribers Table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- Row Level Security (RLS) Policies
-- ═══════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Products: Public can read active products; only auth users can modify
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Orders: Only authenticated can read/write
CREATE POLICY "Authenticated can read orders" ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Service role can insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Consultations: Only authenticated can manage
CREATE POLICY "Authenticated can manage consultations" ON consultations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Anyone can submit consultation" ON consultations FOR INSERT WITH CHECK (true);

-- Testimonials: Public sees approved; authenticated can manage all
CREATE POLICY "Public can view approved testimonials" ON testimonials FOR SELECT USING (is_approved = true);
CREATE POLICY "Authenticated can manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Anyone can submit testimonial" ON testimonials FOR INSERT WITH CHECK (true);

-- FAQs: Public can read; authenticated can manage
CREATE POLICY "Public can read FAQs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage FAQs" ON faqs FOR ALL USING (auth.role() = 'authenticated');

-- Subscribers: Authenticated can read; anyone can subscribe
CREATE POLICY "Authenticated can read subscribers" ON subscribers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Anyone can subscribe" ON subscribers FOR INSERT WITH CHECK (true);

-- ═══════════════════════════════════════════════════════
-- Sample Data
-- ═══════════════════════════════════════════════════════

-- Insert default FAQs
INSERT INTO faqs (question, answer, order_index) VALUES
('هل يناسب هذا النظام من لا يملك خبرة تسويقية؟', 'نعم! النظام صُمِّم ليكون بسيطاً وعملياً حتى للمبتدئين تماماً. ستجد خطوات واضحة وقابلة للتطبيق الفوري.', 1),
('ما الذي يميز BLACK4ME عن المنتجات الأخرى؟', 'نحن لا نبيع محتوى نظرياً، بل نقدم أنظمة وأدوات جاهزة للتطبيق، مدعومة بتجربة حقيقية في السوق العربي.', 2),
('هل يوجد دعم بعد الشراء؟', 'بالتأكيد! جميع المشترين يحصلون على دعم عبر البريد الإلكتروني لمدة 30 يوماً، ويمكن الترقية لجلسة استشارة شخصية.', 3),
('ما هي طرق الدفع المتاحة؟', 'نقبل جميع البطاقات الدولية (Visa, MasterCard, Amex) عبر Stripe الآمن، بالإضافة إلى PayPal.', 4),
('هل يمكن الحصول على استرداد المبلغ؟', 'نعم، نقدم ضمان استرداد كامل خلال 7 أيام إذا لم تكن راضياً عن المحتوى.', 5)
ON CONFLICT DO NOTHING;

-- Insert default product
INSERT INTO products (title, description, price, sale_price, is_active) VALUES
('حزمة BLACK4ME الشاملة', 'النظام الكامل للتسويق الرقمي الذكي: كتابان + جلسة استشارة + أدوات تطبيقية جاهزة للسوق العربي. كل ما تحتاجه لبناء منظومة مبيعات ربحية من الصفر.', 98, 49, true)
ON CONFLICT DO NOTHING;

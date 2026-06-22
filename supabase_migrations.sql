-- جدول الجلسات المتروكة (Abandoned Cart)
CREATE TABLE IF NOT EXISTS public.checkout_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  status text DEFAULT 'pending', -- 'pending', 'completed', 'recovered'
  product_id text,
  price numeric,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- إعدادات أمان RLS (Row Level Security) للسماح بالإضافة من قبل أي مستخدم (بدون تسجيل دخول)
ALTER TABLE public.checkout_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert to checkout_sessions" ON public.checkout_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read/update to checkout_sessions" ON public.checkout_sessions FOR ALL USING (true); -- للمدير

-- جدول حملات البريد الإلكتروني (Email Campaigns)
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  subject text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'draft', -- 'draft', 'scheduled', 'sent'
  scheduled_at timestamp with time zone,
  sent_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated full access to email_campaigns" ON public.email_campaigns FOR ALL USING (true);

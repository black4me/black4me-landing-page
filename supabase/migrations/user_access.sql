-- =============================================
-- جدول user_access: يمنح العملاء وصولاً للمنتجات التي اشتروها
-- شغّل هذا الملف في Supabase Dashboard > SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS public.user_access (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email text NOT NULL,
  product_id   text,                          -- id المنتج من جدول products
  product_title text,                          -- اسم المنتج (cached للسرعة)
  file_url      text,                          -- رابط التحميل المباشر
  order_id      text NOT NULL,                 -- Stripe session / PayPal order ID
  payment_gateway text DEFAULT 'stripe',       -- 'stripe' | 'paypal' | 'spaceremit'
  granted_at   timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- فهرس لتسريع البحث بالإيميل
CREATE INDEX IF NOT EXISTS idx_user_access_email ON public.user_access(customer_email);

-- تفعيل Row Level Security
ALTER TABLE public.user_access ENABLE ROW LEVEL SECURITY;

-- كل عميل مُسجّل دخول يرى منتجاته فقط
CREATE POLICY "Users see own access"
  ON public.user_access
  FOR SELECT
  USING (auth.email() = customer_email);

-- الكتابة تتم فقط من service_role (supabaseAdmin في الـ API)
-- لا نحتاج policy للـ INSERT لأن service_role يتجاوز RLS تلقائياً

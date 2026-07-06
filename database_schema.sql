-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price numeric DEFAULT 0,
  payment_link text,
  file_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email text NOT NULL,
  product_id text, -- Changed to text to support Stripe Product IDs
  amount numeric DEFAULT 0,
  payment_gateway text,
  status text DEFAULT 'completed',
  access_code text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  type text NOT NULL, -- 'percentage', 'fixed', 'free'
  value numeric NOT NULL,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  usage_limit integer,
  usage_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create newsletter table
CREATE TABLE IF NOT EXISTS public.newsletter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text UNIQUE NOT NULL,
  country text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create email_campaigns table
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  body text NOT NULL,
  scheduled_at timestamp with time zone,
  sent_at timestamp with time zone,
  status text DEFAULT 'draft',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products and site_settings
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);

-- Allow public insert into newsletter
CREATE POLICY "Public insert newsletter" ON public.newsletter FOR INSERT WITH CHECK (true);

-- 🛡️ EXPLICIT SECURITY LOCKDOWNS (100% Security Shield)
-- By default, if RLS is enabled and no policy allows an action, it is denied.
-- However, explicitly stating these policies ensures no future accidental exposure.

-- Ensure only service_role (Admin API) can insert/update/delete on critical tables
CREATE POLICY "Deny all public inserts on orders" ON public.orders FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Deny all public updates on orders" ON public.orders FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Deny all public deletes on orders" ON public.orders FOR DELETE USING (auth.role() = 'service_role');

CREATE POLICY "Deny all public inserts on products" ON public.products FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Deny all public updates on products" ON public.products FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Deny all public deletes on products" ON public.products FOR DELETE USING (auth.role() = 'service_role');

CREATE POLICY "Deny all public inserts on coupons" ON public.coupons FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Deny all public updates on coupons" ON public.coupons FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Deny all public deletes on coupons" ON public.coupons FOR DELETE USING (auth.role() = 'service_role');

-- If you have a user_access table (which might be created in another script), 
-- you should apply the same locks:
-- ALTER TABLE public.user_access ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Deny all public inserts on user_access" ON public.user_access FOR INSERT WITH CHECK (auth.role() = 'service_role');

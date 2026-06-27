-- ME4BLACK Digital OS Schema Update
-- Run this script in the Supabase SQL Editor

-- 1. Create Users Table (العملاء)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text UNIQUE NOT NULL,
  phone text,
  country text,
  first_visit timestamp with time zone DEFAULT timezone('utc'::text, now()),
  last_visit timestamp with time zone,
  total_revenue numeric DEFAULT 0,
  clv numeric DEFAULT 0,
  favorite_category text,
  status text DEFAULT 'lead', -- e.g., lead, active, vip, cold
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Events Table (الأحداث الخام)
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL, -- e.g., page_view, product_view, abandoned_cart, purchase_success, lead_capture
  user_email text, -- References user email if known
  ip_address text,
  device text,
  browser text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  parameters jsonb, -- Additional payload like Cart Value, Book Title, etc.
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Error Logs Table (إدارة الأخطاء)
CREATE TABLE IF NOT EXISTS public.error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text NOT NULL, -- e.g., activepieces, stripe, spaceremit, resend
  error_message text NOT NULL,
  payload jsonb,
  resolved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Update Existing Tables
-- Orders table needs net_revenue and coupon_used if they don't exist
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS coupon_used text,
ADD COLUMN IF NOT EXISTS net_revenue numeric DEFAULT 0;

-- Consultations table needs revenue and rating
ALTER TABLE public.consultations
ADD COLUMN IF NOT EXISTS revenue numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating integer CHECK (rating >= 1 AND rating <= 5);

-- 5. Row Level Security & Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Deny public access to these sensitive tables, allow only service_role (Backend API)
CREATE POLICY "Deny all public inserts on users" ON public.users FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Deny all public updates on users" ON public.users FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Deny all public deletes on users" ON public.users FOR DELETE USING (auth.role() = 'service_role');

CREATE POLICY "Deny all public inserts on events" ON public.events FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Deny all public updates on events" ON public.events FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Deny all public deletes on events" ON public.events FOR DELETE USING (auth.role() = 'service_role');

CREATE POLICY "Deny all public inserts on error_logs" ON public.error_logs FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Deny all public updates on error_logs" ON public.error_logs FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Deny all public deletes on error_logs" ON public.error_logs FOR DELETE USING (auth.role() = 'service_role');

-- Grant admin email full access to the new tables from Dashboard
DO $$
BEGIN
    -- For users
    EXECUTE 'DROP POLICY IF EXISTS "Admin Full Access users" ON public.users;';
    EXECUTE 'CREATE POLICY "Admin Full Access users" ON public.users FOR ALL USING (auth.jwt() ->> ''email'' = ''info@black4me.com'');';
    
    -- For events
    EXECUTE 'DROP POLICY IF EXISTS "Admin Full Access events" ON public.events;';
    EXECUTE 'CREATE POLICY "Admin Full Access events" ON public.events FOR ALL USING (auth.jwt() ->> ''email'' = ''info@black4me.com'');';
    
    -- For error_logs
    EXECUTE 'DROP POLICY IF EXISTS "Admin Full Access error_logs" ON public.error_logs;';
    EXECUTE 'CREATE POLICY "Admin Full Access error_logs" ON public.error_logs FOR ALL USING (auth.jwt() ->> ''email'' = ''info@black4me.com'');';
END $$;

-- ==========================================
-- PASS 3: Database Security & Integrity Fixes
-- ==========================================

-- 1. Fix user_access Duplicate Risk (Race Condition Protection)
-- By adding a UNIQUE constraint on order_id, the database will inherently reject 
-- duplicate webhook calls trying to grant access for the same order twice.
ALTER TABLE public.user_access
ADD CONSTRAINT user_access_order_id_key UNIQUE (order_id);

-- 2. Admin RLS Fix
-- Update these emails to match your ADMIN_EMAILS environment variable
CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean AS $$
BEGIN
  RETURN (auth.jwt() ->> 'email') IN ('info@black4me.com', 'jasstylesg1@gmail.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Orders
DROP POLICY IF EXISTS "Admin Full Access Orders" ON public.orders;
CREATE POLICY "Admin Full Access Orders" ON public.orders FOR ALL USING (is_admin());

-- Products
DROP POLICY IF EXISTS "Admin Full Access Products" ON public.products;
CREATE POLICY "Admin Full Access Products" ON public.products FOR ALL USING (is_admin());

-- Coupons
DROP POLICY IF EXISTS "Admin Full Access Coupons" ON public.coupons;
CREATE POLICY "Admin Full Access Coupons" ON public.coupons FOR ALL USING (is_admin());

-- Newsletter
DROP POLICY IF EXISTS "Admin Full Access Newsletter" ON public.newsletter;
CREATE POLICY "Admin Full Access Newsletter" ON public.newsletter FOR ALL USING (is_admin());

-- Email Campaigns
DROP POLICY IF EXISTS "Admin Full Access Email Campaigns" ON public.email_campaigns;
CREATE POLICY "Admin Full Access Email Campaigns" ON public.email_campaigns FOR ALL USING (is_admin());

-- Site Settings
DROP POLICY IF EXISTS "Admin Full Access Site Settings" ON public.site_settings;
CREATE POLICY "Admin Full Access Site Settings" ON public.site_settings FOR ALL USING (is_admin());


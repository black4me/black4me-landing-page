-- ==========================================
-- PHASE 5: Supabase Custom Claims Setup
-- ==========================================
-- 1. Create the custom claims function if you prefer to set them via SQL
-- Note: Setting claims usually requires a secure backend (Edge Function),
-- but we can create a PostgreSQL function to grant admin rights manually via the SQL editor.

CREATE OR REPLACE FUNCTION set_claim(uid uuid, claim text, value jsonb)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = 
    raw_app_meta_data || 
    json_build_object(claim, value)::jsonb
  WHERE id = uid;
  RETURN 'OK';
END;
$$;

-- Example Usage to grant admin:
-- SELECT set_claim('user-uuid-here', 'admin', 'true'::jsonb);

-- 2. Update Policies to use Custom Claims
-- Once claims are set, you would change policies to check the claim instead of email:
-- CREATE POLICY "Admin Full Access Orders" ON public.orders FOR ALL USING (coalesce((auth.jwt()->'app_metadata'->>'admin')::boolean, false));

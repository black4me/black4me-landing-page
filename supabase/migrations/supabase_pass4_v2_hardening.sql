-- ==========================================
-- PHASE 1: V2 Hardening of Security Definer Functions
-- ==========================================

-- Drop the old insecure set_claim function
DROP FUNCTION IF EXISTS set_claim(uuid, text, jsonb);

-- Recreate with explicit LEAKPROOF and search_path reset
CREATE OR REPLACE FUNCTION set_claim(uid uuid, claim text, value jsonb)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
LEAKPROOF
AS $$
BEGIN
  -- Strict validation of caller
  -- Only allow if called from service role or superuser
  IF current_setting('request.jwt.claims', true)::json->>'role' != 'service_role' THEN
     -- Allow local postgres usage, but block anon/authenticated
     IF current_user IN ('anon', 'authenticated') THEN
        RAISE EXCEPTION 'Unauthorized';
     END IF;
  END IF;

  UPDATE auth.users
  SET raw_app_meta_data = 
    raw_app_meta_data || 
    json_build_object(claim, value)::jsonb
  WHERE id = uid;
  RETURN 'OK';
END;
$$;

-- Create an is_admin() function to be used in RLS securely
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER SET search_path = ''
LEAKPROOF
STABLE
AS $$
  SELECT coalesce((current_setting('request.jwt.claims', true)::json->'app_metadata'->>'admin')::boolean, false);
$$;

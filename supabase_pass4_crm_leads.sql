-- ==========================================
-- PASS 4: CRM Leads & Strategic Tracking
-- Run this script in the Supabase SQL Editor
-- ==========================================

-- 1. Create sequences if it doesn't exist
CREATE TABLE IF NOT EXISTS crm.sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create sequence_enrollments to resolve the missing relation error
CREATE TABLE IF NOT EXISTS crm.sequence_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES crm.leads(id) ON DELETE CASCADE,
  sequence_id uuid REFERENCES crm.sequences(id) ON DELETE CASCADE,
  status text DEFAULT 'active', -- active, completed, cancelled
  current_step_index integer DEFAULT 1,
  enrolled_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Modify lead_timeline to support detailed tracking (duration, coupons, etc.)
-- First, ensure the table exists
CREATE TABLE IF NOT EXISTS crm.lead_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES crm.leads(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add new columns if they don't exist to make querying faster/easier for the detailed timeline
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='crm' AND table_name='lead_timeline' AND column_name='event_category') THEN
    ALTER TABLE crm.lead_timeline ADD COLUMN event_category text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='crm' AND table_name='lead_timeline' AND column_name='page_path') THEN
    ALTER TABLE crm.lead_timeline ADD COLUMN page_path text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='crm' AND table_name='lead_timeline' AND column_name='offer_slug') THEN
    ALTER TABLE crm.lead_timeline ADD COLUMN offer_slug text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='crm' AND table_name='lead_timeline' AND column_name='duration_seconds') THEN
    ALTER TABLE crm.lead_timeline ADD COLUMN duration_seconds integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='crm' AND table_name='lead_timeline' AND column_name='coupon_code') THEN
    ALTER TABLE crm.lead_timeline ADD COLUMN coupon_code text;
  END IF;
END $$;

-- 4. Enable RLS and setup policies
ALTER TABLE crm.sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.sequence_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.lead_timeline ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
DROP POLICY IF EXISTS "Service Role Full Access sequences" ON crm.sequences;
CREATE POLICY "Service Role Full Access sequences" ON crm.sequences FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service Role Full Access sequence_enrollments" ON crm.sequence_enrollments;
CREATE POLICY "Service Role Full Access sequence_enrollments" ON crm.sequence_enrollments FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service Role Full Access lead_timeline" ON crm.lead_timeline;
CREATE POLICY "Service Role Full Access lead_timeline" ON crm.lead_timeline FOR ALL USING (auth.role() = 'service_role');

-- Allow Admin full access
DROP POLICY IF EXISTS "Admin Full Access sequences" ON crm.sequences;
CREATE POLICY "Admin Full Access sequences" ON crm.sequences FOR ALL USING (auth.jwt() ->> 'email' IN ('info@black4me.com', 'jasstylesg1@gmail.com'));

DROP POLICY IF EXISTS "Admin Full Access sequence_enrollments" ON crm.sequence_enrollments;
CREATE POLICY "Admin Full Access sequence_enrollments" ON crm.sequence_enrollments FOR ALL USING (auth.jwt() ->> 'email' IN ('info@black4me.com', 'jasstylesg1@gmail.com'));

DROP POLICY IF EXISTS "Admin Full Access lead_timeline" ON crm.lead_timeline;
CREATE POLICY "Admin Full Access lead_timeline" ON crm.lead_timeline FOR ALL USING (auth.jwt() ->> 'email' IN ('info@black4me.com', 'jasstylesg1@gmail.com'));

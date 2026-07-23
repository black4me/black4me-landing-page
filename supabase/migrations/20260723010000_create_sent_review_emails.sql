-- Migration: Create duplicate prevention table for review emails
CREATE TABLE IF NOT EXISTS sent_review_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  target_type TEXT NOT NULL, -- 'consultation', 'product', 'lead_magnet'
  target_id TEXT NOT NULL, -- booking_uid, order_id, or subscriber_id/email
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, target_type, target_id)
);

-- Enable RLS
ALTER TABLE sent_review_emails ENABLE ROW LEVEL SECURITY;

-- Admins can view/manage logs
CREATE POLICY "Enable all for authenticated admin" ON sent_review_emails FOR ALL USING (auth.role() = 'authenticated');

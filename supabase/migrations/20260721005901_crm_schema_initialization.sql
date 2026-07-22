-- Migration: CRM Schema Initialization
-- Description: Creates the crm schema and all tables as per the approved implementation plan.

CREATE SCHEMA IF NOT EXISTS crm;

-- 1. Leads Table
CREATE TABLE IF NOT EXISTS crm.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT,
    email TEXT,
    phone TEXT,
    country TEXT,
    city TEXT,
    language TEXT,
    lead_source TEXT,
    campaign TEXT,
    device TEXT,
    browser TEXT,
    os TEXT,
    landing_page TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    status TEXT DEFAULT 'Visitor',
    lead_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Visitor Sessions Table
CREATE TABLE IF NOT EXISTS crm.visitor_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES crm.leads(id) ON DELETE SET NULL,
    ip TEXT,
    country TEXT,
    device TEXT,
    browser TEXT,
    duration INTEGER DEFAULT 0,
    pages INTEGER DEFAULT 1,
    referrer TEXT,
    entry_page TEXT,
    exit_page TEXT,
    bounce BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Events Table
CREATE TABLE IF NOT EXISTS crm.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    lead_id UUID REFERENCES crm.leads(id) ON DELETE CASCADE,
    session_id UUID REFERENCES crm.visitor_sessions(session_id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Cart Table
CREATE TABLE IF NOT EXISTS crm.cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES crm.leads(id) ON DELETE CASCADE,
    product TEXT,
    price NUMERIC,
    currency TEXT DEFAULT 'USD',
    checkout_url TEXT,
    status TEXT DEFAULT 'started',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    abandoned_at TIMESTAMPTZ
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS crm.orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES crm.leads(id) ON DELETE CASCADE,
    payment_gateway TEXT,
    amount NUMERIC,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending',
    coupon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Email History Table
CREATE TABLE IF NOT EXISTS crm.email_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES crm.leads(id) ON DELETE CASCADE,
    template TEXT,
    subject TEXT,
    opened BOOLEAN DEFAULT FALSE,
    clicked BOOLEAN DEFAULT FALSE,
    replied BOOLEAN DEFAULT FALSE,
    unsubscribed BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Automation Queue Table
CREATE TABLE IF NOT EXISTS crm.automation_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    automation_name TEXT,
    trigger TEXT,
    status TEXT DEFAULT 'pending',
    retries INTEGER DEFAULT 0,
    last_run TIMESTAMPTZ,
    next_run TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Lead Timeline Table
CREATE TABLE IF NOT EXISTS crm.lead_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES crm.leads(id) ON DELETE CASCADE,
    event_type TEXT,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Lead Tags Table
CREATE TABLE IF NOT EXISTS crm.lead_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES crm.leads(id) ON DELETE CASCADE,
    tag_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Lead Notes Table
CREATE TABLE IF NOT EXISTS crm.lead_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES crm.leads(id) ON DELETE CASCADE,
    note TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Lead Tasks Table
CREATE TABLE IF NOT EXISTS crm.lead_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES crm.leads(id) ON DELETE CASCADE,
    task_description TEXT,
    due_date TIMESTAMPTZ,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Lead Files Table
CREATE TABLE IF NOT EXISTS crm.lead_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES crm.leads(id) ON DELETE CASCADE,
    file_url TEXT,
    file_name TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Lead Activity Summary Table
CREATE TABLE IF NOT EXISTS crm.lead_activity_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES crm.leads(id) ON DELETE CASCADE UNIQUE,
    total_events INTEGER DEFAULT 0,
    total_spent NUMERIC DEFAULT 0,
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Campaigns Table
CREATE TABLE IF NOT EXISTS crm.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    type TEXT,
    status TEXT DEFAULT 'active',
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Campaign Results Table
CREATE TABLE IF NOT EXISTS crm.campaign_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES crm.campaigns(id) ON DELETE CASCADE,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    spend NUMERIC DEFAULT 0,
    revenue NUMERIC DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Webhook Logs Table
CREATE TABLE IF NOT EXISTS crm.webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT,
    payload JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'received',
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. API Logs Table
CREATE TABLE IF NOT EXISTS crm.api_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint TEXT,
    method TEXT,
    response_time_ms INTEGER,
    status_code INTEGER,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Notifications Table
CREATE TABLE IF NOT EXISTS crm.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    message TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Audit Logs Table
CREATE TABLE IF NOT EXISTS crm.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action TEXT,
    entity TEXT,
    old_value JSONB,
    new_value JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION crm.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger to leads
CREATE TRIGGER update_crm_leads_modtime
BEFORE UPDATE ON crm.leads
FOR EACH ROW EXECUTE PROCEDURE crm.update_modified_column();

-- Add Indexes for Performance (as requested: "Indexes")
CREATE INDEX idx_crm_events_lead_id ON crm.events(lead_id);
CREATE INDEX idx_crm_events_session_id ON crm.events(session_id);
CREATE INDEX idx_crm_visitor_sessions_lead_id ON crm.visitor_sessions(lead_id);
CREATE INDEX idx_crm_cart_lead_id ON crm.cart(lead_id);
CREATE INDEX idx_crm_orders_lead_id ON crm.orders(lead_id);
CREATE INDEX idx_crm_lead_timeline_lead_id ON crm.lead_timeline(lead_id);
CREATE INDEX idx_crm_leads_email ON crm.leads(email);
CREATE INDEX idx_crm_events_timestamp ON crm.events(timestamp);

-- Enable RLS (Row Level Security) for all tables
ALTER TABLE crm.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.email_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.automation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.lead_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.lead_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.lead_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.lead_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.lead_activity_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.campaign_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view/modify (assuming dashboard users use authenticated role)
CREATE POLICY "Allow authenticated full access on crm.leads" ON crm.leads FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on crm.visitor_sessions" ON crm.visitor_sessions FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on crm.events" ON crm.events FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on crm.cart" ON crm.cart FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on crm.orders" ON crm.orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on crm.email_history" ON crm.email_history FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on crm.automation_queue" ON crm.automation_queue FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on crm.lead_timeline" ON crm.lead_timeline FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on crm.lead_tags" ON crm.lead_tags FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on crm.lead_notes" ON crm.lead_notes FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on crm.lead_tasks" ON crm.lead_tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on crm.lead_files" ON crm.lead_files FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on crm.lead_activity_summary" ON crm.lead_activity_summary FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on crm.campaigns" ON crm.campaigns FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on crm.campaign_results" ON crm.campaign_results FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on crm.webhook_logs" ON crm.webhook_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on crm.api_logs" ON crm.api_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on crm.notifications" ON crm.notifications FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on crm.audit_logs" ON crm.audit_logs FOR ALL TO authenticated USING (true);

-- Provide anon access to insert events and sessions for tracking script
CREATE POLICY "Allow anon insert on crm.events" ON crm.events FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon insert on crm.visitor_sessions" ON crm.visitor_sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon insert on crm.leads" ON crm.leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update on crm.leads" ON crm.leads FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anon update on crm.visitor_sessions" ON crm.visitor_sessions FOR UPDATE TO anon USING (true);

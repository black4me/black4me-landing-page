-- ==========================================
-- MODULE 5: INTEGRATIONS REGISTRY SCHEMA
-- ==========================================

-- 1. crm.integrations
CREATE TABLE IF NOT EXISTS crm.integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL, -- 'activepieces', 'google_sheets', 'gmail', 'stripe', 'paypal', 'cal_com'
    type VARCHAR(50) NOT NULL, -- 'automation', 'email', 'payments', 'scheduling', 'data_export'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial integrations
INSERT INTO crm.integrations (name, type) VALUES
('activepieces', 'automation'),
('google_sheets', 'data_export'),
('gmail', 'email'),
('stripe', 'payments'),
('paypal', 'payments'),
('cal_com', 'scheduling')
ON CONFLICT (name) DO NOTHING;

-- 2. crm.integration_accounts
CREATE TABLE IF NOT EXISTS crm.integration_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID NOT NULL REFERENCES crm.integrations(id) ON DELETE CASCADE,
    account_name VARCHAR(255) NOT NULL,
    config JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed dummy accounts for wiring
INSERT INTO crm.integration_accounts (integration_id, account_name, config)
SELECT id, 'Primary ' || name || ' Account', '{"status": "pending_configuration"}'::jsonb
FROM crm.integrations
WHERE NOT EXISTS (
    SELECT 1 FROM crm.integration_accounts ia WHERE ia.integration_id = crm.integrations.id
);

-- 3. crm.integration_events
CREATE TABLE IF NOT EXISTS crm.integration_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID NOT NULL REFERENCES crm.integrations(id) ON DELETE CASCADE,
    account_id UUID REFERENCES crm.integration_accounts(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL, -- 'lead_created_exported', 'payment_success_sync', 'sequence_enrollment_push'
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    payload JSONB,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'success', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. crm.integration_sync_logs
CREATE TABLE IF NOT EXISTS crm.integration_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_event_id UUID NOT NULL REFERENCES crm.integration_events(id) ON DELETE CASCADE,
    request_payload JSONB,
    response_payload JSONB,
    status_code INTEGER,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    duration_ms INTEGER
);

-- Indexes for quick lookup
CREATE INDEX idx_integration_events_status ON crm.integration_events(status);
CREATE INDEX idx_integration_events_type ON crm.integration_events(event_type);
CREATE INDEX idx_integration_sync_logs_event ON crm.integration_sync_logs(integration_event_id);

-- Triggers for updated_at
CREATE TRIGGER update_integrations_modtime BEFORE UPDATE ON crm.integrations FOR EACH ROW EXECUTE PROCEDURE crm.update_updated_at_column();
CREATE TRIGGER update_integration_accounts_modtime BEFORE UPDATE ON crm.integration_accounts FOR EACH ROW EXECUTE PROCEDURE crm.update_updated_at_column();
CREATE TRIGGER update_integration_events_modtime BEFORE UPDATE ON crm.integration_events FOR EACH ROW EXECUTE PROCEDURE crm.update_updated_at_column();

-- Enable RLS
ALTER TABLE crm.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.integration_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.integration_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.integration_sync_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Service Role Full Access" ON crm.integrations USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON crm.integration_accounts USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON crm.integration_events USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON crm.integration_sync_logs USING (true) WITH CHECK (true);

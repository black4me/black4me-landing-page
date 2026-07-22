-- ==========================================
-- MODULE 1: MESSAGE SEQUENCES ENGINE SCHEMA
-- ==========================================

-- 1. message_sequences
CREATE TABLE IF NOT EXISTS crm.message_sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_type VARCHAR(50) NOT NULL, -- e.g., 'lead_created', 'tag_added', 'score_reached'
    trigger_condition JSONB, -- specific conditions like {"score": 50, "tag": "hot"}
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. message_sequence_steps
CREATE TABLE IF NOT EXISTS crm.message_sequence_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id UUID NOT NULL REFERENCES crm.message_sequences(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    channel VARCHAR(50) NOT NULL CHECK (channel IN ('email', 'whatsapp', 'sms', 'manychat', 'webhook')),
    delay_value INTEGER DEFAULT 0,
    delay_unit VARCHAR(20) DEFAULT 'days' CHECK (delay_unit IN ('minutes', 'hours', 'days', 'weeks', 'months')),
    template_key VARCHAR(255) NOT NULL,
    cta_label VARCHAR(100),
    condition_json JSONB,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(sequence_id, step_order)
);

-- 3. lead_sequence_enrollments
CREATE TABLE IF NOT EXISTS crm.lead_sequence_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES crm.leads(id) ON DELETE CASCADE,
    sequence_id UUID NOT NULL REFERENCES crm.message_sequences(id) ON DELETE CASCADE,
    current_step_order INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'paused')),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    next_step_scheduled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(lead_id, sequence_id)
);

-- 4. message_delivery_logs
CREATE TABLE IF NOT EXISTS crm.message_delivery_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES crm.lead_sequence_enrollments(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES crm.leads(id) ON DELETE CASCADE,
    sequence_id UUID REFERENCES crm.message_sequences(id) ON DELETE SET NULL,
    step_id UUID REFERENCES crm.message_sequence_steps(id) ON DELETE SET NULL,
    channel VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'failed')),
    provider_response JSONB,
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_seq_enroll_status ON crm.lead_sequence_enrollments(status, next_step_scheduled_at);
CREATE INDEX idx_msg_delivery_lead ON crm.message_delivery_logs(lead_id, status);

-- Trigger for updating updated_at
CREATE OR REPLACE FUNCTION crm.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_message_sequences_modtime
    BEFORE UPDATE ON crm.message_sequences
    FOR EACH ROW EXECUTE PROCEDURE crm.update_updated_at_column();

CREATE TRIGGER update_message_sequence_steps_modtime
    BEFORE UPDATE ON crm.message_sequence_steps
    FOR EACH ROW EXECUTE PROCEDURE crm.update_updated_at_column();

-- Enable RLS
ALTER TABLE crm.message_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.message_sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.lead_sequence_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.message_delivery_logs ENABLE ROW LEVEL SECURITY;

-- Policies (Service Role Access Only for backend automations, Admin for frontend)
CREATE POLICY "Service Role Full Access" ON crm.message_sequences USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON crm.message_sequence_steps USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON crm.lead_sequence_enrollments USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON crm.message_delivery_logs USING (true) WITH CHECK (true);

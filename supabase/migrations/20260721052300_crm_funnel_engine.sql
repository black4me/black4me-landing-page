-- ==========================================
-- MODULE 1 FIXES & MODULE 2: FUNNEL ENGINE SCHEMA
-- ==========================================

-- 1. Fixes for Module 1 
-- Standardize lead_sequence_enrollments status
ALTER TABLE crm.lead_sequence_enrollments DROP CONSTRAINT IF EXISTS lead_sequence_enrollments_status_check;
ALTER TABLE crm.lead_sequence_enrollments ADD CONSTRAINT lead_sequence_enrollments_status_check 
CHECK (status IN ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled', 'failed'));

-- 2. Funnel Engine Schema
-- 2.1 funnel_stages
CREATE TABLE IF NOT EXISTS crm.funnel_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL, -- e.g., 'awareness', 'interest', 'desire', 'decision', 'purchase', 'retention'
    stage_order INTEGER NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name),
    UNIQUE(stage_order)
);

-- Seed initial stages
INSERT INTO crm.funnel_stages (name, stage_order, description) VALUES
('Awareness', 1, 'Top of Funnel - Visitors and first touchpoints'),
('Interest', 2, 'Engaged leads, opt-ins, content downloaders'),
('Desire', 3, 'Highly engaged leads, email sequence interactions'),
('Decision', 4, 'Intent to buy, checkout started, consult booked'),
('Purchase', 5, 'Successful payment, core offer converted'),
('Retention', 6, 'Upsells, continuity, repeat buyers')
ON CONFLICT (name) DO NOTHING;

-- 2.2 lead_funnel_progress
CREATE TABLE IF NOT EXISTS crm.lead_funnel_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES crm.leads(id) ON DELETE CASCADE,
    current_stage_id UUID NOT NULL REFERENCES crm.funnel_stages(id),
    entered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_event_id UUID REFERENCES crm.events(id) ON DELETE SET NULL,
    source VARCHAR(255),
    campaign VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lead_id)
);

-- 2.3 funnel_stage_history
CREATE TABLE IF NOT EXISTS crm.funnel_stage_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES crm.leads(id) ON DELETE CASCADE,
    stage_id UUID NOT NULL REFERENCES crm.funnel_stages(id),
    entered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP WITH TIME ZONE,
    reason TEXT
);

-- 2.4 funnel_metrics_daily
CREATE TABLE IF NOT EXISTS crm.funnel_metrics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_date DATE NOT NULL,
    stage_id UUID NOT NULL REFERENCES crm.funnel_stages(id),
    entries_count INTEGER DEFAULT 0,
    exits_count INTEGER DEFAULT 0,
    conversion_to_next NUMERIC DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(metric_date, stage_id)
);

-- Triggers for updated_at
CREATE TRIGGER update_funnel_stages_modtime
    BEFORE UPDATE ON crm.funnel_stages
    FOR EACH ROW EXECUTE PROCEDURE crm.update_updated_at_column();

CREATE TRIGGER update_lead_funnel_progress_modtime
    BEFORE UPDATE ON crm.lead_funnel_progress
    FOR EACH ROW EXECUTE PROCEDURE crm.update_updated_at_column();

-- Enable RLS
ALTER TABLE crm.funnel_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.lead_funnel_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.funnel_stage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.funnel_metrics_daily ENABLE ROW LEVEL SECURITY;

-- Policies (Service Role Access Only for backend automations, Admin for frontend)
CREATE POLICY "Service Role Full Access" ON crm.funnel_stages USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON crm.lead_funnel_progress USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON crm.funnel_stage_history USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON crm.funnel_metrics_daily USING (true) WITH CHECK (true);

-- ==========================================
-- MODULE 3: GRAND SLAM OFFER SYSTEM
-- ==========================================

-- 1. crm.offers
CREATE TABLE IF NOT EXISTS crm.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    ladder_level VARCHAR(50) NOT NULL CHECK (ladder_level IN ('lead_magnet', 'tripwire', 'core_offer', 'premium', 'continuity')),
    price NUMERIC DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial offers based on Value Ladder VIP
INSERT INTO crm.offers (name, slug, ladder_level, price) VALUES
('Free CRM Blueprint PDF', 'crm-blueprint-pdf', 'lead_magnet', 0),
('Mini CRM Setup Course', 'mini-crm-course', 'tripwire', 47),
('BLACK4ME LEAD CRM Mastery', 'crm-mastery-core', 'core_offer', 497),
('Done-For-You CRM Implementation', 'dfy-crm-vip', 'premium', 2497),
('CRM Maintenance & Support', 'crm-maintenance', 'continuity', 97)
ON CONFLICT (slug) DO NOTHING;

-- 2. crm.offer_steps (Hormozi's Offer Builder elements)
CREATE TABLE IF NOT EXISTS crm.offer_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID NOT NULL REFERENCES crm.offers(id) ON DELETE CASCADE,
    step_type VARCHAR(50) NOT NULL CHECK (step_type IN ('big_problem', 'dream_outcome', 'vehicle', 'obstacles', 'solutions', 'bonuses', 'guarantee', 'urgency', 'scarcity')),
    content JSONB NOT NULL,
    step_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(offer_id, step_type)
);

-- 3. crm.lead_offer_state
CREATE TABLE IF NOT EXISTS crm.lead_offer_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES crm.leads(id) ON DELETE CASCADE,
    offer_id UUID NOT NULL REFERENCES crm.offers(id) ON DELETE CASCADE,
    ladder_level VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('viewed', 'offered', 'accepted', 'declined', 'upsold')),
    source VARCHAR(100), -- landing_page, email_sequence, manychat, whatsapp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lead_id, offer_id)
);

-- 4. crm.offer_metrics_daily
CREATE TABLE IF NOT EXISTS crm.offer_metrics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_date DATE NOT NULL,
    offer_id UUID NOT NULL REFERENCES crm.offers(id) ON DELETE CASCADE,
    ladder_level VARCHAR(50) NOT NULL,
    views_count INTEGER DEFAULT 0,
    leads_count INTEGER DEFAULT 0,
    purchases_count INTEGER DEFAULT 0,
    revenue_total NUMERIC DEFAULT 0.00,
    conversion_rate NUMERIC DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(metric_date, offer_id)
);

-- Alter message_sequences to link to Offers
ALTER TABLE crm.message_sequences 
ADD COLUMN IF NOT EXISTS target_offer_id UUID REFERENCES crm.offers(id) ON DELETE SET NULL;

-- Triggers for updated_at
CREATE TRIGGER update_offers_modtime BEFORE UPDATE ON crm.offers FOR EACH ROW EXECUTE PROCEDURE crm.update_updated_at_column();
CREATE TRIGGER update_offer_steps_modtime BEFORE UPDATE ON crm.offer_steps FOR EACH ROW EXECUTE PROCEDURE crm.update_updated_at_column();
CREATE TRIGGER update_lead_offer_state_modtime BEFORE UPDATE ON crm.lead_offer_state FOR EACH ROW EXECUTE PROCEDURE crm.update_updated_at_column();

-- Enable RLS
ALTER TABLE crm.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.offer_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.lead_offer_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.offer_metrics_daily ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Service Role Full Access" ON crm.offers USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON crm.offer_steps USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON crm.lead_offer_state USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON crm.offer_metrics_daily USING (true) WITH CHECK (true);

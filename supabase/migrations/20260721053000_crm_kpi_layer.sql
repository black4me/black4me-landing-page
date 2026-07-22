-- ==========================================
-- MODULE 4: KPI & ANALYTICS LAYER (VIEWS)
-- ==========================================

-- 1. v_daily_leads
-- Tracks new leads created per day and average lead score.
CREATE OR REPLACE VIEW crm.v_daily_leads AS
SELECT 
    DATE(created_at) AS metric_date,
    COUNT(id) AS total_leads,
    COUNT(CASE WHEN lead_score >= 50 THEN 1 END) AS hot_leads,
    ROUND(AVG(lead_score), 2) AS avg_lead_score
FROM crm.leads
GROUP BY DATE(created_at)
ORDER BY metric_date DESC;

-- 2. v_daily_funnel
-- Tracks entries into funnel stages per day
CREATE OR REPLACE VIEW crm.v_daily_funnel AS
SELECT 
    DATE(fh.entered_at) AS metric_date,
    fs.name AS stage_name,
    fs.stage_order,
    COUNT(fh.id) AS entries_count
FROM crm.funnel_stage_history fh
JOIN crm.funnel_stages fs ON fh.stage_id = fs.id
GROUP BY DATE(fh.entered_at), fs.name, fs.stage_order
ORDER BY metric_date DESC, fs.stage_order ASC;

-- 3. v_daily_revenue
-- Calculates revenue per day based on accepted offers (price of the offer).
-- In a more robust system, we would join with an `orders` or `payments` table,
-- but tracking accepted offers gives us immediate expected revenue.
CREATE OR REPLACE VIEW crm.v_daily_revenue AS
SELECT 
    DATE(los.updated_at) AS metric_date,
    COUNT(los.id) AS total_sales,
    COALESCE(SUM(o.price), 0.00) AS total_revenue
FROM crm.lead_offer_state los
JOIN crm.offers o ON los.offer_id = o.id
WHERE los.status IN ('accepted', 'upsold')
GROUP BY DATE(los.updated_at)
ORDER BY metric_date DESC;

-- 4. v_offer_performance
-- Analyzes how each offer is performing in terms of views, purchases, and conversion rate.
CREATE OR REPLACE VIEW crm.v_offer_performance AS
SELECT 
    o.id AS offer_id,
    o.name AS offer_name,
    o.ladder_level,
    o.price,
    COUNT(CASE WHEN los.status IN ('viewed', 'offered', 'accepted', 'upsold') THEN 1 END) AS total_views,
    COUNT(CASE WHEN los.status IN ('accepted', 'upsold') THEN 1 END) AS total_purchases,
    CASE 
        WHEN COUNT(CASE WHEN los.status IN ('viewed', 'offered', 'accepted', 'upsold') THEN 1 END) > 0 
        THEN ROUND(
            (COUNT(CASE WHEN los.status IN ('accepted', 'upsold') THEN 1 END)::NUMERIC / 
            COUNT(CASE WHEN los.status IN ('viewed', 'offered', 'accepted', 'upsold') THEN 1 END)::NUMERIC) * 100, 
        2)
        ELSE 0.00 
    END AS conversion_rate,
    COALESCE(SUM(CASE WHEN los.status IN ('accepted', 'upsold') THEN o.price ELSE 0.00 END), 0.00) AS total_revenue
FROM crm.offers o
LEFT JOIN crm.lead_offer_state los ON o.id = los.offer_id
GROUP BY o.id, o.name, o.ladder_level, o.price
ORDER BY o.price ASC;

-- 5. v_channel_performance
-- Analyzes source performance based on offer assignments.
CREATE OR REPLACE VIEW crm.v_channel_performance AS
SELECT 
    COALESCE(los.source, 'organic') AS channel_name,
    COUNT(DISTINCT l.id) AS total_leads,
    COUNT(DISTINCT CASE WHEN l.lead_score >= 50 THEN l.id END) AS hot_leads,
    COALESCE(SUM(CASE WHEN los.status IN ('accepted', 'upsold') THEN o.price ELSE 0.00 END), 0.00) AS generated_revenue
FROM crm.lead_offer_state los
JOIN crm.leads l ON los.lead_id = l.id
JOIN crm.offers o ON los.offer_id = o.id
GROUP BY COALESCE(los.source, 'organic')
ORDER BY generated_revenue DESC, total_leads DESC;

-- Grant permissions for backend access
GRANT SELECT ON crm.v_daily_leads TO service_role;
GRANT SELECT ON crm.v_daily_funnel TO service_role;
GRANT SELECT ON crm.v_daily_revenue TO service_role;
GRANT SELECT ON crm.v_offer_performance TO service_role;
GRANT SELECT ON crm.v_channel_performance TO service_role;

-- ═══════════════════════════════════════════════════════
-- BLACK4ME Performance Tuning
-- Adds indexes to columns that are frequently filtered or ordered
-- ═══════════════════════════════════════════════════════

-- Index on products.is_active for Landing Page queries
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Index on testimonials.is_approved for Landing Page queries
CREATE INDEX IF NOT EXISTS idx_testimonials_is_approved ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);

-- Index on orders.status for Dashboard and Validation queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Index on faqs.order_index and comparison_items.order_index for fast sorting
CREATE INDEX IF NOT EXISTS idx_faqs_order_index ON faqs(order_index);
CREATE INDEX IF NOT EXISTS idx_comparison_items_order_index ON comparison_items(order_index);
CREATE INDEX IF NOT EXISTS idx_funnel_stages_num ON funnel_stages(num);
CREATE INDEX IF NOT EXISTS idx_value_stack_items_order_index ON value_stack_items(order_index);

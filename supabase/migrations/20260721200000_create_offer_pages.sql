-- Create offer_pages table in crm schema
CREATE TABLE IF NOT EXISTS crm.offer_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('free_gift', 'paid_offer', 'discount', 'product', 'service')),
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    button_text TEXT DEFAULT 'سجل الآن',
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    enable_timer BOOLEAN DEFAULT false,
    timer_start TIMESTAMPTZ,
    timer_end TIMESTAMPTZ,
    redirect_url TEXT,
    display_mode TEXT DEFAULT 'standalone_page' CHECK (display_mode IN ('standalone_page', 'popup', 'banner', 'hybrid', 'show_on_homepage', 'show_as_popup', 'show_as_banner')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index on slug
CREATE INDEX IF NOT EXISTS idx_offer_pages_slug ON crm.offer_pages(slug);

-- Enable RLS
ALTER TABLE crm.offer_pages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to active offer pages"
ON crm.offer_pages
FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Allow full access to service_role"
ON crm.offer_pages
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Insert dummy data for testing
INSERT INTO crm.offer_pages (slug, type, title, subtitle, description, button_text, is_active, enable_timer, timer_end, redirect_url)
VALUES 
('master-class', 'free_gift', 'إتقان التسويق الرقمي: الهدية المجانية الخاصة بك!', 'نموذج صفحة هبوط عالية التحويل', 'حمّل نموذج صفحة هبوط عالية التحويل — جاهز للتعديل والنسخ', 'سجل واحصل على الهدية المجانية الآن!', true, true, NOW() + INTERVAL '3 days', '/success?gift=true'),
('special-discount', 'discount', 'خصم حصري على الكتاب', 'وفر 50% لفترة محدودة', 'احصل على الكتاب مع كافة المرفقات بنصف السعر', 'اشتر الآن', true, false, null, '/checkout')
ON CONFLICT (slug) DO NOTHING;

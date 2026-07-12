-- 1. Create ad_settings table
CREATE TABLE public.ad_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'disabled', -- 'disabled', 'adsterra', 'adsense', etc.
  enabled BOOLEAN NOT NULL DEFAULT false,
  article_only BOOLEAN NOT NULL DEFAULT true,
  script_url TEXT,
  script_inline TEXT,
  publisher_id TEXT,
  placement_config JSONB NOT NULL DEFAULT '{
    "after_intro": true,
    "mid_content": true,
    "end_content": true
  }'::jsonb,
  style_config JSONB NOT NULL DEFAULT '{
    "label": "إعلان",
    "containerVariant": "subtle"
  }'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Alter blog_posts table to add ad controls
ALTER TABLE public.blog_posts
ADD COLUMN ads_enabled BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN ad_density TEXT NOT NULL DEFAULT 'normal';

-- 3. Create post_ad_overrides table (optional for finer control)
CREATE TABLE public.post_ad_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  enabled BOOLEAN,
  placements JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(post_id)
);

-- 4. Enable RLS
ALTER TABLE public.ad_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_ad_overrides ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- ad_settings: Public can read, authenticated can manage
CREATE POLICY "Enable read for everyone" ON public.ad_settings FOR SELECT USING (true);
CREATE POLICY "Enable all for authenticated admin" ON public.ad_settings FOR ALL USING (auth.role() = 'authenticated');

-- post_ad_overrides: Public can read, authenticated can manage
CREATE POLICY "Enable read for everyone" ON public.post_ad_overrides FOR SELECT USING (true);
CREATE POLICY "Enable all for authenticated admin" ON public.post_ad_overrides FOR ALL USING (auth.role() = 'authenticated');

-- 6. Insert initial row
INSERT INTO public.ad_settings (provider, enabled) VALUES ('disabled', false);

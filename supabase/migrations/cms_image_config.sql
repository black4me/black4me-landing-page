ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS image_config JSONB DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_config JSONB DEFAULT '{}';

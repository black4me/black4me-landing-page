-- Add target_audience to email_campaigns

ALTER TABLE public.email_campaigns 
ADD COLUMN IF NOT EXISTS target_audience text DEFAULT 'all';

-- Set default for existing records to 'all'
UPDATE public.email_campaigns SET target_audience = 'all' WHERE target_audience IS NULL;

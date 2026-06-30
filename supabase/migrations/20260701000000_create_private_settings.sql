-- Create a secure table for storing sensitive settings (like API keys)
CREATE TABLE IF NOT EXISTS public.private_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.private_settings ENABLE ROW LEVEL SECURITY;

-- IMPORTANT: We DO NOT create any public read/write policies!
-- The table should only be accessible by the Supabase Service Role Key,
-- which bypasses RLS automatically. This ensures no client can read the keys.

-- Trigger to update 'updated_at' automatically
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS private_settings_updated_at ON public.private_settings;
CREATE TRIGGER private_settings_updated_at
  BEFORE UPDATE ON public.private_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

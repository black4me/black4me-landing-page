-- Add access_code column to orders table for Academy Access
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS access_code text;

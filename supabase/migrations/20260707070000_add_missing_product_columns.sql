ALTER TABLE products ADD COLUMN IF NOT EXISTS features text[] DEFAULT '{}'::text[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS chapters text[] DEFAULT '{}'::text[];

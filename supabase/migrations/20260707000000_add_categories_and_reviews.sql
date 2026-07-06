-- 1. Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Deny all public inserts on categories" ON public.categories FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Deny all public updates on categories" ON public.categories FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Deny all public deletes on categories" ON public.categories FOR DELETE USING (auth.role() = 'service_role');

-- 2. Update products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug text UNIQUE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS benefits jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images text[] DEFAULT ARRAY[]::text[];

-- Create an index for faster lookups by slug and category
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);

-- 3. Create product_reviews table
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up RLS for product_reviews
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
-- Public can read ONLY approved reviews
CREATE POLICY "Public read approved reviews" ON public.product_reviews FOR SELECT USING (is_approved = true);
-- Public CAN insert reviews (they will default to is_approved = false)
CREATE POLICY "Public insert reviews" ON public.product_reviews FOR INSERT WITH CHECK (true);
-- Only service_role can update or delete reviews
CREATE POLICY "Deny all public updates on product_reviews" ON public.product_reviews FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Deny all public deletes on product_reviews" ON public.product_reviews FOR DELETE USING (auth.role() = 'service_role');

-- 4. Automatically generate slugs for existing products based on title (Basic implementation to satisfy the unique constraint)
-- For existing rows, set a generic slug to avoid UNIQUE constraint violation if not set.
UPDATE public.products SET slug = 'product-' || substr(id::text, 1, 8) WHERE slug IS NULL;

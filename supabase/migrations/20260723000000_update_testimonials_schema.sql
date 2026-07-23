-- Migration: Update testimonials table for product-specific reviews & moderation
ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'product',
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, hidden
ADD COLUMN IF NOT EXISTS show_on_homepage BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Update existing testimonials to approved status if they were is_approved = true
UPDATE testimonials SET status = 'approved' WHERE is_approved = true;
UPDATE testimonials SET status = 'hidden' WHERE is_approved = false;

-- Create policy for public insert to support the new fields
DROP POLICY IF EXISTS "Anyone can submit testimonial" ON testimonials;
CREATE POLICY "Anyone can submit testimonial" ON testimonials FOR INSERT WITH CHECK (true);

-- Create policy for public read to filter by status
DROP POLICY IF EXISTS "Public can view approved testimonials" ON testimonials;
CREATE POLICY "Public can view approved testimonials" ON testimonials FOR SELECT USING (status = 'approved');

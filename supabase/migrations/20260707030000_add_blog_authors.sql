-- Create authors table
CREATE TABLE IF NOT EXISTS public.authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text,
  bio text,
  avatar_url text,
  social_links jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for authors
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read authors" 
ON public.authors FOR SELECT 
USING (true);

CREATE POLICY "Service role can do anything to authors" 
ON public.authors 
USING (auth.role() = 'service_role');

-- Update blog_posts table with SEO fields and author relation
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES public.authors(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS canonical_url text,
ADD COLUMN IF NOT EXISTS og_image text;

-- Remove old author_name column if it exists since we have author_id now
-- Note: We will keep it for backwards compatibility but make it nullable
ALTER TABLE public.blog_posts ALTER COLUMN author_name DROP NOT NULL;

-- Create default author (Jasim Mohammed)
INSERT INTO public.authors (name, title, bio, avatar_url, social_links)
VALUES (
  'جاسم محمد',
  'مستشار تسويق رقمي ومؤسس منصة BLACK4ME',
  'أساعد أصحاب المشاريع على زيادة مبيعاتهم وبناء مسارات تسويقية فعالة بأقل تكلفة ممكنة.',
  'https://black4me.com/assets/jasim.jpg',
  '{"x": "https://x.com/jasim", "linkedin": "https://linkedin.com/in/jasim"}'::jsonb
)
ON CONFLICT DO NOTHING;

-- Update existing blog posts to point to the new author
UPDATE public.blog_posts 
SET author_id = (SELECT id FROM public.authors LIMIT 1)
WHERE author_id IS NULL;

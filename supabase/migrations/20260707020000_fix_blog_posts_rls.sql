-- Fix RLS for blog_posts to allow insertions from the admin panel (anon/authenticated)
CREATE POLICY "Allow all actions for anon and authenticated on blog_posts" 
ON public.blog_posts 
FOR ALL 
USING (true) 
WITH CHECK (true);

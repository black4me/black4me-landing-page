-- 1. Add engagement fields to blog_posts
ALTER TABLE blog_posts 
ADD COLUMN views_count INTEGER DEFAULT 0,
ADD COLUMN comments_count INTEGER DEFAULT 0,
ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0.00;

-- 2. Create blog_comments table
CREATE TABLE blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, hidden
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Create blog_reviews table
CREATE TABLE blog_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    content TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, hidden
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Create moderation_logs table
CREATE TABLE moderation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_type TEXT NOT NULL, -- 'comment' or 'review'
    target_id UUID NOT NULL,
    action TEXT NOT NULL, -- 'approve', 'reject', 'hide'
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. Enable RLS
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- For public insert (Anyone can submit a comment or review)
CREATE POLICY "Enable insert for everyone" ON blog_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for everyone" ON blog_reviews FOR INSERT WITH CHECK (true);

-- For public read (Only approved items are visible)
CREATE POLICY "Enable read for approved comments" ON blog_comments FOR SELECT USING (status = 'approved');
CREATE POLICY "Enable read for approved reviews" ON blog_reviews FOR SELECT USING (status = 'approved');

-- Admin can manage everything
CREATE POLICY "Enable all for authenticated admin" ON blog_comments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated admin" ON blog_reviews FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated admin" ON moderation_logs FOR ALL USING (auth.role() = 'authenticated');

-- 7. Triggers to auto-update post engagement stats
CREATE OR REPLACE FUNCTION update_post_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update comments count
    UPDATE blog_posts 
    SET comments_count = (
        SELECT count(*) FROM blog_comments WHERE post_id = NEW.post_id AND status = 'approved'
    )
    WHERE id = NEW.post_id;

    -- Update average rating
    UPDATE blog_posts 
    SET average_rating = COALESCE((
        SELECT ROUND(AVG(rating)::numeric, 2) FROM blog_reviews WHERE post_id = NEW.post_id AND status = 'approved'
    ), 0.00)
    WHERE id = NEW.post_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_comment_status_change
AFTER INSERT OR UPDATE ON blog_comments
FOR EACH ROW EXECUTE FUNCTION update_post_stats();

CREATE TRIGGER on_review_status_change
AFTER INSERT OR UPDATE ON blog_reviews
FOR EACH ROW EXECUTE FUNCTION update_post_stats();

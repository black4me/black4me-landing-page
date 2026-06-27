-- 🛡️ Supabase Storage Security Policies for BLACK4ME
-- These policies prevent malicious file uploads (malware, large files) by locking down the storage bucket.

-- Assuming the bucket used for receipts is named 'receipts'
-- If you use a different bucket name, replace 'receipts' below with your bucket name.

-- 1. Create the receipts bucket if it doesn't exist (Optional, but good practice)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public to read/view receipts (Admin needs this to verify, or you can restrict to authenticated only)
CREATE POLICY "Public Receipt View" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'receipts' );

-- 3. CRITICAL SHIELD: Restrict Uploads
-- This policy allows inserts ONLY IF:
-- a) The file is an image or PDF
-- b) The file size is less than 5MB (5 * 1024 * 1024 bytes = 5242880 bytes)
CREATE POLICY "Secure Receipt Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'receipts' 
    AND (
        mimetype = 'image/jpeg' OR 
        mimetype = 'image/png' OR 
        mimetype = 'image/webp' OR 
        mimetype = 'application/pdf'
    )
);

-- Note: The best way to enforce maximum file size in Supabase is via the Dashboard:
-- Go to Storage -> receipts -> Settings -> Limits -> Set Maximum file size to "5MB".

-- 4. Prevent users from deleting or updating existing files
CREATE POLICY "Prevent Delete" 
ON storage.objects FOR DELETE 
USING ( auth.role() = 'service_role' );

CREATE POLICY "Prevent Update" 
ON storage.objects FOR UPDATE 
USING ( auth.role() = 'service_role' );

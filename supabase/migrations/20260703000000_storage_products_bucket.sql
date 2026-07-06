-- إعداد حاوية (Bucket) المنتجات الرقمية "products"

-- 1. إنشاء الحاوية وجعلها عامة (Public) لتسمح بتحميل الملفات عبر الرابط
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. السماح للجميع بمشاهدة وتحميل الملفات من هذه الحاوية
CREATE POLICY "Public Access Products Bucket" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'products');

-- 3. السماح برفع الملفات إلى هذه الحاوية (INSERT)
CREATE POLICY "Allow Upload Products Bucket" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'products');

-- 4. السماح بتحديث الملفات (UPDATE)
CREATE POLICY "Allow Update Products Bucket" 
ON storage.objects FOR UPDATE 
TO public 
USING (bucket_id = 'products');

-- 5. السماح بحذف الملفات (DELETE)
CREATE POLICY "Allow Delete Products Bucket" 
ON storage.objects FOR DELETE 
TO public 
USING (bucket_id = 'products');

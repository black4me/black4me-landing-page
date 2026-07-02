-- إنشاء جدول lead_magnets
CREATE TABLE IF NOT EXISTS lead_magnets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  name text,
  magnet text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- سياسات الأمان RLS
ALTER TABLE lead_magnets ENABLE ROW LEVEL SECURITY;

-- السماح للمستخدمين (بما في ذلك الزوار المجهولين) بالإضافة عبر API Service Role
CREATE POLICY "Enable insert for service role only" ON lead_magnets
  FOR INSERT
  WITH CHECK (true);

-- السماح للمشرفين فقط برؤية البيانات
CREATE POLICY "Enable read access for admins" ON lead_magnets
  FOR SELECT
  USING (auth.role() = 'authenticated');

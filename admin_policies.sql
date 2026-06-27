-- 🛡️ سياسات وصول لوحة التحكم (Admin Dashboard Access Policies)
-- هذا السكربت يمنح حق الوصول الكامل (القراءة، الإضافة، التعديل، الحذف)
-- لحساب الإدمن الخاص بك (info@black4me.com) على جميع الجداول،
-- بحيث تظهر الطلبات وكل شيء في لوحة التحكم بشكل صحيح.

-- السماح للمدير بالتحكم الكامل في الطلبات
CREATE POLICY "Admin Full Access Orders" ON public.orders FOR ALL USING (auth.jwt() ->> 'email' = 'info@black4me.com');

-- السماح للمدير بالتحكم الكامل في المنتجات (لتعديلها من لوحة التحكم)
CREATE POLICY "Admin Full Access Products" ON public.products FOR ALL USING (auth.jwt() ->> 'email' = 'info@black4me.com');

-- السماح للمدير بالتحكم الكامل في الكوبونات
CREATE POLICY "Admin Full Access Coupons" ON public.coupons FOR ALL USING (auth.jwt() ->> 'email' = 'info@black4me.com');

-- السماح للمدير بالتحكم الكامل في المشتركين (النشرة البريدية)
CREATE POLICY "Admin Full Access Newsletter" ON public.newsletter FOR ALL USING (auth.jwt() ->> 'email' = 'info@black4me.com');

-- السماح للمدير بالتحكم الكامل في حملات البريد
CREATE POLICY "Admin Full Access Email Campaigns" ON public.email_campaigns FOR ALL USING (auth.jwt() ->> 'email' = 'info@black4me.com');

-- السماح للمدير بالتحكم الكامل في الإعدادات
CREATE POLICY "Admin Full Access Site Settings" ON public.site_settings FOR ALL USING (auth.jwt() ->> 'email' = 'info@black4me.com');

-- (إذا كانت جداول الاستشارات والمراجعات موجودة، نمنح الصلاحية لها أيضاً)
DO $$ 
BEGIN 
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'consultations') THEN
        EXECUTE 'ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;';
        EXECUTE 'DROP POLICY IF EXISTS "Admin Full Access Consultations" ON public.consultations;';
        EXECUTE 'CREATE POLICY "Admin Full Access Consultations" ON public.consultations FOR ALL USING (auth.jwt() ->> ''email'' = ''info@black4me.com'');';
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'testimonials') THEN
        EXECUTE 'ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;';
        EXECUTE 'DROP POLICY IF EXISTS "Admin Full Access Testimonials" ON public.testimonials;';
        EXECUTE 'CREATE POLICY "Admin Full Access Testimonials" ON public.testimonials FOR ALL USING (auth.jwt() ->> ''email'' = ''info@black4me.com'');';
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'faqs') THEN
        EXECUTE 'ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;';
        EXECUTE 'DROP POLICY IF EXISTS "Admin Full Access FAQs" ON public.faqs;';
        EXECUTE 'CREATE POLICY "Admin Full Access FAQs" ON public.faqs FOR ALL USING (auth.jwt() ->> ''email'' = ''info@black4me.com'');';
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subscribers') THEN
        EXECUTE 'ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;';
        EXECUTE 'DROP POLICY IF EXISTS "Admin Full Access Subscribers" ON public.subscribers;';
        EXECUTE 'CREATE POLICY "Admin Full Access Subscribers" ON public.subscribers FOR ALL USING (auth.jwt() ->> ''email'' = ''info@black4me.com'');';
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'settings') THEN
        EXECUTE 'ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;';
        EXECUTE 'DROP POLICY IF EXISTS "Admin Full Access Settings" ON public.settings;';
        EXECUTE 'CREATE POLICY "Admin Full Access Settings" ON public.settings FOR ALL USING (auth.jwt() ->> ''email'' = ''info@black4me.com'');';
    END IF;
END $$;

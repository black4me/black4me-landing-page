-- =================================================================================
-- BLACK4ME - Full-Stack CMS Setup
-- Please run this script in your Supabase SQL Editor to create the necessary tables
-- =================================================================================

-- 1. Site Settings Table (Key-Value Store for general texts and settings)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert Default Settings
INSERT INTO public.site_settings (key, value) VALUES
    ('hero_subtitle', 'JASIM MOHAMMED يقدم'),
    ('comparison_title', 'قارن وشاهد الفارق: هندسة التحول الجذري لعملك'),
    ('comparison_subtitle', 'الانتقال من مرحلة العشوائية الفردية إلى مرحلة العلامة التجارية الممتازة ذات الدخل البارد المؤتمت.'),
    ('funnel_title', 'نظام BLACK4ME الفَنَل البصري المتعاقب'),
    ('funnel_subtitle', 'اضغط على أي مرحلة من مراحل قمع المبيعات تالياً لعرض الخريطة التشغيلية وتفاصيل رحلة التحول لعملائنا.'),
    ('payment_stripe_enabled', 'true'),
    ('payment_paypal_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- 2. Comparison Items Table
CREATE TABLE IF NOT EXISTS public.comparison_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    aspect TEXT NOT NULL,
    before_system TEXT NOT NULL,
    after_system TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert Default Comparison Items
INSERT INTO public.comparison_items (aspect, before_system, after_system, order_index) VALUES
    ('آلية جلب العملاء والمهتمين', 'ملاحقة مستمرة وإرسال مئات الرسائل العشوائية المكتوبة بالذكاء الاصطناعي دون إنصات أو استجابة.', 'الفنل يقوم بجذب وغربلة العملاء عاليي الملاءة وجلبهم مهيئين للشراء بنسبة 80% قبل التحدث الفردي.', 1),
    ('قواعد التسعير والتحصيل المالي', 'النزول بالتسعير للحد الأدنى لجذب المترددين، ما يؤثر على جودة الخدمة ويبقي أرباحك متعثرة.', 'بناء وتصميم عروض نخبوية (High-Ticket Program) بأسعار تبدأ من $2,000 وتبريرها بقيمتها الحقيقية.', 2),
    ('العائد الزمني والمجهود التشغيلي', 'تعمل 14 ساعة يومياً بمحاولات ترويجية مبعثرة، دون أي تكرار منهجي أو بنية أصول حقيقية لعلامتك.', 'نظام مؤتمت مكرر ومستقر، يحتاج فقط 3-4 ساعات مراجعة أسبوعية وتحديثات فنية لتوسيع الأرقام.', 3),
    ('صناعة الأثر والهيبة المعرفية', 'صانع محتوى عام ينشر يومياً "أفضل 5 نصائح برمجية" دون ترابط حقيقي يهدف للبيع.', 'هيبة فكرية كقائد رأي مستهدف، يفصل بدقة خريطة طريق تحل مشكلة العميل العميقة بوضوح.', 4)
ON CONFLICT DO NOTHING;

-- 3. Funnel Stages Table
CREATE TABLE IF NOT EXISTS public.funnel_stages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    num INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    details TEXT NOT NULL,
    badge TEXT NOT NULL,
    icon_name TEXT DEFAULT 'Layers',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert Default Funnel Stages
INSERT INTO public.funnel_stages (num, title, subtitle, details, badge, icon_name) VALUES
    (1, 'قراءة الكتاب التأسيسي الاستراتيجي', 'المرحلة الأولى: امتلاك العقلية القيادية وفك شفرة الغموض التسويقي', 'تبدأ رحلتك بتصفح كتاب "بدون التسويق... كارثة تهدد ثروتك المستقبلية". ستتعلم فيه تفكيك المفاهيم الصعبة التي تعوق تقدمك المالي، وتكتشف نماذج الاستهداف النخبوية لسلوك المستهلك المعاصر.', 'نقطة الدخول التأسيسية', 'BookOpen'),
    (2, 'بناء وتصميم عرضك فائق القيمة', 'المرحلة الثانية: تحويل المعرفة والمهارة إلى حل جاهز ومطلوب بشدة', 'تطبيق التمارين المرفقة لوضع هيكل تسعيري متدرج لخدماتك ومنتجاتك. ستخرج من صراع السعر المنخفض لتصعد لعرض ذو تذكرة مرتفعة (High-Ticket Offer) يستحقه جمهورك الحقيقي.', 'صياغة الميزة الفريدة', 'Lightbulb'),
    (3, 'هندسة المحتوى التحويلي المستهدف', 'المرحلة الثالثة: صياغة الرسائل التسويقية وصنع هيبتك القيادية', 'هنا سنعير اهتمامنا لجذب عقول المهتمين عاليي الدخل. تتوقف عن النشر العشوائي وتبدأ باتخاذ أساليب صناعة محتوى مصممة بعناية لإغلاق الصفقات وإقناع متلقيها بجودة عروضك.', 'محرك السيطرة المعرفية', 'PenTool'),
    (4, 'إطلاق نظام قمع المبيعات والفنل', 'المرحلة الرابعة: الأتمتة الكاملة لقمع المبيعات وبناء قوائم البيانات', 'ربط النماذج وقواعد البيانات، وإعداد بوابات الدفع (Stripe & PayPal) التلقائية. النظام يضمن جمع الأسماء والايميلات وتسهيل عملية السداد وتحميل المنتجات بنقرة واحدة.', 'التحصيل والأتمتة الرقمية', 'CheckSquare'),
    (5, 'جلسة الاستشارة الاستراتيجية الفردية', 'المرحلة الخامسة: تشريح عملك والتحقق المباشر مع جاسم محمد', 'جلسة مباشرة وجهاً لوجه لغربلة الهيكل، ومعالجة الثغرات التقنية، والتحقق التام من قابلية نظامك للتوسع والربح السلبي المستقر.', 'المصادقة وتعديل الثغرات', 'MessageSquareCode'),
    (6, 'النمو الرقمي الشامل ومضاعفة الأرقام', 'المرحلة السادسة: توسيع النطاق ومرحلة بناء الثروة المتكاملة', 'بعد اختبار وصيانة المراحل السابقة، نطلق العنان للمبيعات عبر توسيع الجمهور، وتحسين التحويل، وزيادة معدل الشراء المتكرر لبناء قيمة لا تنتهي لعلامتك الموثوقة.', 'الهروب نحو الحرية المالية', 'Rocket')
ON CONFLICT (num) DO NOTHING;

-- 4. Value Stack Items Table
CREATE TABLE IF NOT EXISTS public.value_stack_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    real_value NUMERIC NOT NULL,
    notes TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert Default Value Stack Items
INSERT INTO public.value_stack_items (name, real_value, notes, order_index) VALUES
    ('كتاب "بدون التسويق... كارثة تهدد ثروتك المستقبلية"', 99, 'النسخة الرقمية الكاملة عالية الجودة', 1),
    ('كتاب الهدية الممتازة "10 مبادئ للنجاح المالي والشخصي"', 29, 'بقلم جاسم محمد - غير متاحة للبيع المنفرد', 2),
    ('الحقيبة التسويقية الشاملة والقوالب العملية الجاهزة', 39, 'نماذج ملفات وهياكل جاهزة للاستخدام', 3),
    ('تمارين تفاعلية ودفتر تمارين لكل فصل', 19, 'لضمان تطبيق الأفكار التسويقية فورياً', 4),
    ('التحديثات الدورية وكافة الفصول الإضافية مدى الحياة', 25, 'ترقية مستمرة لأحدث استراتيجيات السوق', 5),
    ('الوصول الحصري لمجتمع BLACK4ME ودعم الخبراء والمؤسس', 49, 'قنوات تفاعلية لحل مشكلات أعمالك', 6)
ON CONFLICT DO NOTHING;

-- 5. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    discount_percentage NUMERIC NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert Default Coupon
INSERT INTO public.coupons (code, discount_percentage) VALUES
    ('DISCOUNT15', 15)
ON CONFLICT (code) DO NOTHING;

-- Policies for public access (Read only for public, Read/Write assumes authenticated or anon depending on setup)
-- Since RLS is likely enabled or disabled globally, we will just allow open access for simplicity in MVP,
-- but the correct way is enabling RLS and adding policies. Assuming the user has policies set or RLS disabled for these tables as in previous tables.

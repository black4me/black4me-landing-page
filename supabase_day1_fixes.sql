-- في Supabase SQL Editor
UPDATE site_settings SET value = '"بدون تسويق كارثة تهدد ثروتك المستقبلية"' 
WHERE key = 'hero_title';

UPDATE site_settings SET value = '"الكتاب العملي + النظام التعليمي + 6 قوالب جاهزة"'
WHERE key = 'hero_subtitle';

-- إضافة مفاتيح جديدة
INSERT INTO site_settings (key, value) VALUES
('hero_badge', '"🔥 عرض محدود: $49 بدل $199 — وفّر 75%"'),
('hero_support_text', '"دليل بناء العروض التي لا ترفض — من تأليف جاسم محمد"'),
('hero_cta_primary', '"← احصل على الحزمة الشاملة — $49"'),
('hero_cta_secondary', '"شاهد عينة مجانية من الكتاب"')
ON CONFLICT (key) DO NOTHING;

-- إصلاح تعارض Stripe
UPDATE site_settings SET value = 'true' WHERE key = 'enable_stripe';

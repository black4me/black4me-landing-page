-- إضافة 3 شهادات تجريبية لجدول testimonials
INSERT INTO testimonials (
  id, name, role, location, image_url, rating, review_date, linkedin_url, result_headline, content, is_verified
) VALUES
(
  'testimonial-001',
  'فيصل الشمري',
  'مؤسس متجر إلكتروني',
  'الرياض، السعودية',
  '/images/testimonials/faisal.webp',
  5,
  '2026-05-15',
  'https://linkedin.com/in/faisal-alshmri',
  'حصلت على 23 عميل في 60 يوم من تطبيق الكتاب',
  'قرأت مئات الكتب في التسويق لكن هذا الكتاب يقدم خريطة عملية مبنية للسوق الخليجي. مستوى مبيعاتي ارتفع من 8 إلى 23K شهرياً خلال شهرين من التطبيق الفعلي.',
  true
),
(
  'testimonial-002',
  'سارة عبدالله',
  'مستشارة أعمال',
  'دبي، الإمارات',
  '/images/testimonials/sara.webp',
  5,
  '2026-06-02',
  'https://linkedin.com/in/sara-abdullah',
  'نظام مبيعات متكامل وفر علي آلاف الدولارات',
  'الجميل في الكتاب والنظام أنه لا يعطيك تنظير، بل خطوات عملية. القوالب الجاهزة لوحدها تساوي أضعاف سعر الحزمة. أنصح به لأي شخص يبدأ مشروعه.',
  true
),
(
  'testimonial-003',
  'أحمد خالد',
  'مدرب ومقدم خدمات',
  'جدة، السعودية',
  '/images/testimonials/ahmed.webp',
  4,
  '2026-06-20',
  'https://linkedin.com/in/ahmed-khaled',
  'تضاعفت أرباحي خلال شهر واحد فقط!',
  'كنت أعاني من تسعير خدماتي وتحديد جمهوري. بعد تطبيق النظام، أصبحت عروضي لا ترفض. شكراً جاسم على هذه القيمة العظيمة.',
  true
)
ON CONFLICT (id) DO NOTHING;

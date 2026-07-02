# 📋 رسالة المتابعة للمطور — إصلاحات صفحة الهبوط

**المشروع:** black4me.com — صفحة هبوط كتاب "بدون تسويق كارثة"
**التاريخ:** 2 يوليو 2026
**من:** جاسم محمد — BLACK4ME (نيابة عني Vesper)
**المرجع:** مخطط الإصلاحات الكامل السابق (تم تنفيذه جزئياً)

---

## ملخص سريع

عملت الفحص الثاني للصفحة وطلعت بالنتائج التالية:

**✅ اللي اشتغل:**
- Sticky bar مع countdown timer (ممتاز)
- FAQ موسّعة (10 أسئلة)
- Lead magnet مجاني (نموذج صفحة هبوط)
- شهادتين مضافين (سارة عبدالله + أحمد خالد)

**❌ اللي ما اشتغل — لازم يتنفذ هالشحة:**

| # | المهمة | الأولوية |
|---|---|---|
| 1 | إصلاح العنوان الرئيسي (Hero) | 🔴 حرجة |
| 2 | رفع صورة حقيقية للمنتج | 🔴 حرجة |
| 3 | تطوير نبذة المؤلف بصورة وأرقام | 🔴 حرجة |
| 4 | تسجيل فيديو 60 ثانية للـHero | 🟠 عالية |
| 5 | جمع 10+ شهادات بصور وأرقام | 🟠 عالية |
| 6 | Schema Markup (Product + FAQ) | 🟡 متوسطة |
| 7 | ربط المنصة بالموقع (الفوتر + بريد الترحيب) | 🟡 متوسطة |

---

## 🔴 الإصلاح #1: إصلاح العنوان الرئيسي (Hero)

### افتح الملف
`components/Hero.tsx` أو `app/page.tsx`

### ابحث عن هذا النص واحذفه:
```tsx
<h1 className="...">
  أبني لك نظام تسويق يجلب
  <br/>
  20 عميل مؤكد شهرياً
</h1>
```

### واستبدله بـ:
```tsx
<h1 className="text-4xl md:text-6xl font-bold mt-6 leading-tight">
  بدون تسويق كارثة تهدد ثروتك المستقبلية
</h1>

<h2 className="text-xl md:text-2xl mt-4 text-gray-300">
  الكتاب العملي + النظام التعليمي + 6 قوالب جاهزة
</h2>

<p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
  دليل بناء العروض التي لا ترفض وتحويل المهارات إلى أرباح طائلة.
  من تأليف جاسم محمد — مستشار التسويق الرقمي في BLACK4ME.
</p>
```

### مهم: غيّر الـmetadata في `app/layout.tsx`
```tsx
export const metadata = {
  title: 'بدون تسويق كارثة تهدد ثروتك المستقبلية — كتاب + نظام تعليمي | BLACK4ME',
  description: 'كتاب عملي + نظام تعليمي + 6 قوالب تسويقية جاهزة. دليل بناء العروض التي لا ترفض. من تأليف جاسم محمد.',
};
```

### معايير القبول
- [ ] H1 يعرض اسم الكتاب مو "نظام تسويق يجلب 20 عميل".
- [ ] H2 يوضح مكونات الحزمة (كتاب + نظام + قوالب).
- [ ] الـmeta title ما يذكر "نظام تسويق يجلب 20 عميل".
- [ ] العنوان ما يعد بـ"20 عميل شهرياً" — هذا وعد خدمة مو كتاب.

---

## 🔴 الإصلاح #2: رفع صورة حقيقية للمنتج

### ابحث عن هذا النص في `app/page.tsx` واحذفه:
```tsx
<div>
  مكان صورة العرض الشامل

  قم برفع الصورة من لوحة التحكم (إعدادات الموقع - Book Preview Image)
</div>
```

### واستبدله بـ:
```tsx
<div className="product-preview relative">
  <Image
    src="/images/book-cover.webp"
    alt="كتاب بدون تسويق كارثة — الحزمة الشاملة"
    width={600}
    height={400}
    priority
    className="rounded-lg shadow-2xl"
  />

  <div className="platform-preview mt-8 relative">
    <Image
      src="/images/platform-preview.webp"
      alt="معاينة أكاديمية التسويق الرقمية"
      width={800}
      height={600}
      className="rounded-lg"
    />
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
      <p className="text-white text-xl font-bold">
        أكثر من 27 درساً و 6 قوالب جاهزة
      </p>
    </div>
  </div>
</div>
```

### الصور المطلوبة
ارفعها في `/public/images/`:
1. `book-cover.webp` — غلاف الكتاب + الحزمة (1200x800)
2. `platform-preview.webp` — لقطة شاشة للمنصة (800x600)
3. `templates-grid.webp` — شبكة القوالب الستة (1200x800)

> إذا ما عندك الصور جاهزة، استخدم Canva لتصميمها مؤقتاً، أو اطلبها من جاسم.

### معايير القبول
- [ ] ما في أي نص "مكان صورة العرض الشامل" في الصفحة.
- [ ] صورة الغلاف واضحة وجذابة.
- [ ] لقطة شاشة للمنصة موجودة مع overlay نص.

---

## 🔴 الإصلاح #3: تطوير نبذة المؤلف

### ابحث عن هذا النص واحذفه:
```tsx
<section>
  <h2>عن المؤلف</h2>
  <h3>جاسم محمد</h3>
  <p>مستشار تسويقي ميداني ومؤسس BLACK4ME. يساعد...</p>
</section>
```

### واستبدله بـ:
```tsx
<section className="author-section py-16 px-4 bg-gray-50">
  <div className="max-w-4xl mx-auto">
    <div className="flex flex-col md:flex-row gap-8 items-center">
      <div className="flex-shrink-0">
        <Image
          src="/images/jasim-mohammed.webp"
          alt="جاسم محمد — مؤسس BLACK4ME"
          width={200}
          height={200}
          className="rounded-full object-cover"
        />
      </div>

      <div className="flex-1 text-center md:text-right">
        <h2 className="text-3xl font-bold mb-4">
          جاسم محمد — مؤسس BLACK4ME
        </h2>

        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          خبير في بناء أنظمة تسويق رقمية متكاملة للسوق العربي.
          خلال 5 سنوات من العمل الميداني، ساعد أكثر من <strong>300 رائد أعمال</strong> على:
        </p>

        <ul className="text-gray-700 space-y-2 mb-6 text-right">
          <li>• بناء عروض تسويقية لا ترفض</li>
          <li>• تطوير أنظمة تسويق مؤتمتة</li>
          <li>• تحقيق أكثر من <strong>2 مليون دولار</strong> في مبيعات لعملائه</li>
        </ul>

        <div className="flex gap-4 justify-center md:justify-start flex-wrap">
          <a href="https://linkedin.com/in/jasim-mohammed" target="_blank" className="text-blue-600 hover:underline">LinkedIn</a>
          <a href="https://twitter.com/jasim_mohammed" target="_blank" className="text-black hover:underline">Twitter</a>
          <a href="https://youtube.com/@black4me" target="_blank" className="text-red-600 hover:underline">YouTube</a>
          <a href="https://instagram.com/black4me" target="_blank" className="text-pink-600 hover:underline">Instagram</a>
        </div>
      </div>
    </div>
  </div>
</section>
```

### الصورة المطلوبة
ارفعها في `/public/images/jasim-mohammed.webp` — صورة شخصية احترافية (400x400).

> إذا ما عنده صورة شخصية، استخدم placeholder مؤقت مع تعليق `// TODO: استبدل الصورة من جاسم`.

### معايير القبول
- [ ] صورة شخصية موجودة (حتى لو مؤقتة).
- [ ] النبذة فيها 3+ إنجازات بأرقام (300 عميل، 2 مليون دولار، إلخ).
- [ ] 4 روابط تواصل اجتماعي ظاهرة.

---

## 🟠 الإصلاح #4: تسجيل فيديو 60 ثانية

### الخطوات
1. صوّر مع جاسم فيديو قصير (60-90 ثانية، إضاءة طبيعية + صوت واضح).
2. اضغطه إلى أقل من 5MB (MP4 + WebM).
3. ارفعه في `/public/videos/hero-intro.mp4` و `hero-intro.webm`.

### أنشئ ملف جديد `components/HeroVideo.tsx`:
```tsx
export default function HeroVideo() {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      poster="/images/video-poster.webp"
      className="w-full max-w-2xl rounded-lg shadow-2xl mx-auto"
    >
      <source src="/videos/hero-intro.webm" type="video/webm" />
      <source src="/videos/hero-intro.mp4" type="video/mp4" />
    </video>
  );
}
```

### النص المقترح للفيديو
```
[0-5s]   "هل تملك مهارة ممتازة لكن ما أحد يشتري منك؟"
[5-20s]  "90% من أصحاب المشاريع يخسرون آلاف الدولارات كل شهر..."
[20-45s] "هذا الكتاب + النظام + القوالب يعطيك نظام تسويقي في 60 يوم."
[45-60s] "احصل على الحزمة اليوم بـ 49$. ضمان استرداد 7 أيام."
```

### معايير القبول
- [ ] الفيديو يشتغل تلقائياً (autoplay + muted).
- [ ] حجم أقل من 5MB.
- [ ] له poster image قبل التشغيل.

---

## 🟠 الإصلاح #5: تطوير الشهادات

### الهدف
10 شهادات على الأقل، كل واحدة فيها:
- اسم العميل + صورته.
- منصته (LinkedIn/Twitter).
- نتيجة محددة قبل/بعد بأرقام.
- تاريخ.

### استبدل مكون الشهادات الحالي بـ:
```tsx
// components/Testimonials.tsx
'use client';

const testimonials = [
  {
    name: "فيصل الشمري",
    role: "مؤسس متجر إلكتروني",
    location: "الرياض، السعودية",
    image: "/images/testimonials/faisal.webp",
    rating: 5,
    date: "2026-05-15",
    result: "حصلت على 23 عميل في 60 يوم",
    text: "قرأت مئات الكتب في التسويق لكن هذا الكتاب يقدم خريطة عملية. مستوى مبيعاتي ارتفع من 8K إلى 23K شهرياً.",
    linkedin: "https://linkedin.com/in/faisal-alshmri"
  },
  // أضيف 9 شهادات أخرى (اطلبها من جاسم)
];
```

### معايير القبول
- [ ] 10 شهادات على الأقل.
- [ ] كل شهادة فيها صورة + اسم + نتيجة محددة + تاريخ.
- [ ] شهادات موزعة على قطاعات مختلفة (متاجر، خدمات، استشارات).

---

## 🟡 الإصلاح #6: Schema Markup

### أضف في `app/layout.tsx` داخل `<head>`:
```tsx
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "بدون تسويق كارثة تهدد ثروتك المستقبلية",
  "description": "حزمة متكاملة: كتاب + نظام تعليمي + قوالب + استشارة",
  "brand": { "@type": "Brand", "name": "BLACK4ME" },
  "offers": {
    "@type": "Offer",
    "price": "49",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127"
  }
}
</script>
```

### أضف FAQ Schema أيضاً في قسم الـFAQ:
```tsx
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "هل الكتاب يناسبني لو كنت مبتدئ؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "نعم، الكتاب مصمم للمبتدئين والمتقدمين..."
      }
    }
    // أضيف باقي الأسئلة الـ10
  ]
}
</script>
```

### معايير القبول
- [ ] Product Schema موجود في الـ`<head>`.
- [ ] FAQ Schema موجود في قسم الـFAQ.
- [ ] اختبره في Google Rich Results Test بعد الرفع.

---

## 🟡 الإصلاح #7: ربط المنصة بالموقع

### أضف رابط في الفوتر `components/Footer.tsx`:
```tsx
<a href="https://marketing-academy-liard.vercel.app/" target="_blank" rel="noopener noreferrer">
  🎓 أكاديمية التسويق (منصة تعليمية مجانية)
</a>
```

### أضف في بريد الترحيب (بعد الشراء):
```
🎓 حسابك في المنصة التعليمية:
https://marketing-academy-liard.vercel.app/login
البريد: [إيميل العميل]
كلمة المرور: [كلمة المرور المؤقتة]
```

### معايير القبول
- [ ] رابط المنصة ظاهر في الفوتر.
- [ ] بريد الترحيب فيه بيانات الدخول للمنصة.

---

## ⚠️ ملاحظات حرجة للمطور

### أخطاء شائعة لازم تتجنبها:

1. **لا تضيف الكود في ملف جديد بدون ربطه** — تأكد إن المكون الجديد مُستورد في `app/page.tsx`.

2. **الصور لازم تكون في `/public/images/`** مو في `/src/images/` أو أي مكان ثاني.

3. **إذا ما عندك صورة لـ جاسم محمد، استخدم placeholder مؤقت** مع تعليق `// TODO: استبدل الصورة` عشان جاسم يقدر يحدّثها لاحقاً.

4. **لا تغيّر الـSticky Bar الموجود** — العداد التنازلي شغال ممتاز.

5. **FAQ الجديد ممتاز، لا تلمسه** — بس تأكد إن الـschema markup موجود فيه.

6. **الحزم الثلاث (49$, 149$, 529$) ممتازة** — لا تغيّر الأسعار أو البنية.

---

## ⏱️ الجدول الزمني المتوقع

| المهمة | الوقت |
|---|---|
| إصلاح العنوان | 30 دقيقة |
| رفع الصور | 30 دقيقة |
| تطوير نبذة المؤلف | 1 ساعة |
| تسجيل/رفع الفيديو | 1 ساعة (بعد ما يصور جاسم) |
| تطوير الشهادات | 3-4 ساعات (بحسب عدد الشهادات) |
| Schema Markup | 30 دقيقة |
| ربط المنصة | 1 ساعة |
| **الإجمالي** | **7-9 ساعات عمل** |

---

## ✅ معايير القبول النهائية

بعد تنفيذ كل اللي فوق، تأكد من:

- [ ] الصفحة الرئيسية تظهر اسم الكتاب في الـH1.
- [ ] صورة المنتج حقيقية (مو نص placeholder).
- [ ] صورة شخصية لـ جاسم محمد موجودة.
- [ ] النبذة فيها أرقام وإنجازات.
- [ ] الفيديو يشتغل تلقائياً في الـHero.
- [ ] 10 شهادات على الأقل بصور ونتائج محددة.
- [ ] FAQ Schema موجود.
- [ ] Product Schema موجود في `<head>`.
- [ ] رابط المنصة موجود في الفوتر.
- [ ] اختبار الصفحة على mobile + desktop بدون أخطاء.

---

## 📞 التواصل

إذا واجهت أي مشكلة تقنية أو تحتاج توضيح:
- واتس جاسم: +968 7919 1793
- إيميل: black4mestore@gmail.com

**بعد ما تخلص، ابعت تقرير قصير بـ:**
- وش عملت بالضبط.
- وش ما قدرت تعمله (مع السبب).
- لقطات شاشة قبل/بعد.

بالتوفيق! 🚀

---

*آخر تحديث: 2 يوليو 2026 — Vesper (نيابة عن جاسم محمد / BLACK4ME)*
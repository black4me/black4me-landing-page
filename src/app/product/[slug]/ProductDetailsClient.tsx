"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ArrowRight, CheckCircle2, ShoppingCart } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

export default function ProductDetailsClient({ product, initialReviews }: { product: any, initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ customer_name: '', customer_email: '', rating: 5, review_text: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  React.useEffect(() => {
    import('@/lib/tracking').then(tracking => {
      // 1. Track initial view
      tracking.trackEvent('ProductViewed', {
        content_name: product.title,
        content_ids: [product.id],
        content_type: 'product',
        value: product.sale_price || product.price,
        currency: 'USD'
      });

      // 2. Track time spent (30s, 60s, 180s)
      const timers = [
        setTimeout(() => {
          tracking.trackEvent('TimeSpentOnPage', { product_id: product.id, product_name: product.title, seconds: 30 });
        }, 30000),
        setTimeout(() => {
          tracking.trackEvent('TimeSpentOnPage', { product_id: product.id, product_name: product.title, seconds: 60 });
        }, 60000),
        setTimeout(() => {
          tracking.trackEvent('TimeSpentOnPage', { product_id: product.id, product_name: product.title, seconds: 180 });
        }, 180000)
      ];

      // 3. Track exit intent
      const handleMouseOut = (e: MouseEvent) => {
        if (e.clientY < 50) {
          tracking.trackEvent('ExitIntentDetected', { product_id: product.id, product_name: product.title });
          document.removeEventListener('mouseout', handleMouseOut);
        }
      };
      document.addEventListener('mouseout', handleMouseOut);

      return () => {
        timers.forEach(t => clearTimeout(t));
        document.removeEventListener('mouseout', handleMouseOut);
      };
    });
  }, [product.id, product.title, product.sale_price, product.price]);

  const handleBuyClick = () => {
    import('@/lib/tracking').then(tracking => {
      tracking.trackEvent('InitiateCheckout', {
        product_id: product.id,
        product_name: product.title,
        cart_value: product.sale_price || product.price,
        currency: 'USD'
      });
    });
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    const serviceType = product.slug.includes('book') ? 'book' : 'service';
    const { error } = await supabase.from('testimonials').insert([{
      product_id: product.id,
      customer_name: reviewForm.customer_name,
      rating: reviewForm.rating,
      review_text: reviewForm.review_text,
      status: 'pending',
      is_approved: false,
      service_type: serviceType,
      user_email: (reviewForm as any).customer_email || ''
    }]);

    setSubmittingReview(false);
    if (error) {
      alert('حدث خطأ أثناء إرسال التقييم: ' + error.message);
    } else {
      setReviewSubmitted(true);
      setShowReviewForm(false);
    }
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.file_url].filter(Boolean);
  const currentImage = images[0]; // Simple gallery for now

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  // Dynamic Content Blocks based on Product
  const isBook = product.slug.includes('book');
  
  const targetForList = isBook ? [
    "التجار المبتدئين الذين يريدون فهم أساسيات التسويق الرقمي قبل إطلاق حملاتهم.",
    "من يواجه مشكلة في جذب العملاء ويريد حلولاً عملية وسريعة للتطبيق والتجربة."
  ] : [
    "أصحاب المتاجر والمشاريع الرقمية الذين يريدون بناء نظام تسويق تلقائي ومبيعات مستقرة.",
    "صناع المحتوى والخبراء الذين يبحثون عن أتمتة مبيعات استشاراتهم وخدماتهم الاحترافية.",
    "كل من يريد التوقف عن هدر الأموال في إعلانات ممولة غير مربحة وبناء أصول دائمة."
  ];

  const targetNotForList = isBook ? [
    "من يمتلك بالفعل نظاماً تسويقياً متكاملاً ويحقق أرقاماً ممتازة مستقرة."
  ] : [
    "من يبحث عن ثراء سريع بضغطة زر دون الرغبة في التأسيس والعمل الجاد.",
    "من لا يمتلك أي مشروع أو منتج أو خدمة لبيعها حالياً."
  ];

  const costOfInactionList = isBook ? [
    "ستستمر في دفع تكاليف إعلانية باهظة دون فهم الخلل في آليات جذب العملاء.",
    "ستخسر الدليل العملي لحماية رأس مالك التسويقي من الهدر والتخمين العشوائي."
  ] : [
    "ستستمر في هدر ميزانيتك الإعلانية دون تحقيق عوائد مستدامة وجديرة بالاستثمار.",
    "ستبقى مبيعاتك وأرباحك رهينة لوقتك وحضورك اليدوي اليومي المرهق.",
    "ستفوت فرصة الاستفادة من سعر الدفعة الحالية والمزايا الحصرية المرفقة بالعرض."
  ];

  return (
    <div className="pt-24 pb-20" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-gold transition mb-8">
          <ArrowRight className="w-4 h-4" />
          <span>العودة للمتجر</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden relative">
              {currentImage ? (
                <Image src={currentImage} alt={product.title} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/20">لا توجد صورة</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img: string, idx: number) => (
                  <div key={idx} className="w-24 h-24 flex-shrink-0 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden relative cursor-pointer hover:border-brand-gold transition">
                     <Image src={img} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.category && (
              <span className="text-sm font-bold text-brand-purple-light bg-brand-purple/10 px-3 py-1 rounded-full mb-4 inline-block">
                {product.category.name}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4">{product.title}</h1>
            
            {/* Price & Assurances Area */}
            <div className="flex flex-col gap-4 mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-black text-brand-gold font-mono">${product.sale_price || product.price}</span>
                  {product.sale_price && product.sale_price < product.price && (
                    <span className="text-xl text-gray-500 line-through font-mono">${product.price}</span>
                  )}
                </div>
                {product.price > 0 && product.sale_price < product.price && (
                  <span className="text-xs bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2.5 py-1 rounded font-bold">
                    وفر ${(product.price - product.sale_price)} حالياً!
                  </span>
                )}
              </div>

              {/* Quiet Urgency Notice */}
              <div className="bg-[#0e0a05] border border-brand-gold/10 rounded-xl p-3 text-xs md:text-sm text-brand-gold/90 leading-relaxed font-bold">
                📢 {isBook 
                  ? 'العرض والمزايا الإضافية متاحة لفترة محدودة ضمن الدفعة الحالية.' 
                  : 'السعر الحالي مخصص للدفعة الحالية فقط، لضمان جودة المتابعة والتنفيذ لكل عميل.'}
              </div>

              {/* Clickable Micro-Guarantee Label */}
              <a href="#guarantee-section" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition w-fit">
                🛡️ <span className="underline decoration-dotted">شراء مطمئن: سياسة استرداد شفافة لهذا المنتج (اضغط للتفاصيل).</span>
              </a>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {product.benefits && product.benefits.length > 0 && (
              <div className="mb-8 space-y-3">
                <h3 className="text-lg font-bold text-white mb-4">ماذا ستستفيد؟</h3>
                {product.benefits.map((benefit: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm md:text-base">{benefit}</span>
                  </div>
                ))}
              </div>
            )}

            {product.chapters && product.chapters.length > 0 && (
              <div className="mb-8 space-y-3">
                <h3 className="text-lg font-bold text-white mb-4">المحتويات</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
                  {product.chapters.map((chapter: string, idx: number) => (
                    <li key={idx}>{chapter}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Who is this for / not for */}
            <div className="mb-8 grid sm:grid-cols-2 gap-6 pt-6 border-t border-white/5">
              <div className="space-y-3">
                <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider">🎯 لمن هذا المنتج؟</h4>
                <ul className="space-y-2 text-xs md:text-sm text-gray-300 list-disc list-inside">
                  {targetForList.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-black text-rose-400 uppercase tracking-wider">❌ لمن لا يناسب؟</h4>
                <ul className="space-y-2 text-xs md:text-sm text-gray-300 list-disc list-inside">
                  {targetNotForList.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
            </div>

            {/* Cost of Inaction */}
            <div className="mb-8 bg-[#110505] border border-rose-950/20 rounded-2xl p-5 space-y-3">
              <h4 className="text-sm font-black text-rose-400 flex items-center gap-2">⚠️ ماذا ستخسر إذا تجاهلت العرض؟</h4>
              <ul className="space-y-2 text-xs md:text-sm text-gray-300 list-disc list-inside">
                {costOfInactionList.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>

            <div className="mt-8">
              {product.payment_link ? (
                <Link href={product.payment_link} onClick={handleBuyClick} target="_blank" rel="noopener noreferrer" className="cta-glow w-full flex items-center justify-center gap-3 bg-brand-gold hover:bg-yellow-400 text-black font-black py-4 rounded-2xl transition text-lg shadow-xl shadow-brand-gold/5">
                  <ShoppingCart className="w-5 h-5" />
                  <span>شراء الآن بـ ${product.sale_price || product.price}</span>
                </Link>
              ) : (
                <Link href={`/checkout?productId=${product.id}`} onClick={handleBuyClick} className="cta-glow w-full flex items-center justify-center gap-3 bg-brand-gold hover:bg-yellow-400 text-black font-black py-4 rounded-2xl transition text-lg shadow-xl shadow-brand-gold/5">
                  <ShoppingCart className="w-5 h-5" />
                  <span>شراء الآن بـ ${product.sale_price || product.price}</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24 border-t border-white/10 pt-16">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-2xl font-black text-white">آراء العملاء حول هذا المنتج</h2>
              <p className="text-gray-400 mt-2">شهادات وتقييمات من قاموا بالتجربة الفعلية.</p>
            </div>
            <button onClick={() => setShowReviewForm(!showReviewForm)} className="bg-[#0a0a0a] border border-white/10 hover:border-brand-gold text-white font-bold px-6 py-3 rounded-xl transition">
              كتابة تقييم
            </button>
          </div>

          {reviewSubmitted && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl mb-8 font-bold">
              شكراً لك! تم إرسال تقييمك بنجاح وهو بانتظار المراجعة قبل النشر.
            </div>
          )}

          {showReviewForm && !reviewSubmitted && (
            <form onSubmit={submitReview} className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 rounded-2xl mb-12 space-y-6 animate-fadeIn">
              <h3 className="text-xl font-bold text-white mb-4">أضف تقييمك</h3>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">الاسم</label>
                  <input required type="text" value={reviewForm.customer_name} onChange={e => setReviewForm({...reviewForm, customer_name: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">البريد الإلكتروني (مطلوب للتحقق)</label>
                  <input required type="email" value={reviewForm.customer_email} onChange={e => setReviewForm({...reviewForm, customer_email: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-400 mb-2">التقييم</label>
                  <select value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple">
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                    <option value={3}>⭐⭐⭐ (3/5)</option>
                    <option value={2}>⭐⭐ (2/5)</option>
                    <option value={1}>⭐ (1/5)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-400 mb-2">رأيك بصراحة</label>
                  <textarea required rows={4} value={reviewForm.review_text} onChange={e => setReviewForm({...reviewForm, review_text: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple resize-none" />
                </div>
              </div>

              <button type="submit" disabled={submittingReview} className="bg-brand-purple hover:bg-brand-purple-light text-white font-bold px-8 py-3 rounded-xl transition disabled:opacity-50">
                {submittingReview ? 'جاري الإرسال...' : 'نشر التقييم'}
              </button>
            </form>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedReviews.map(review => (
              <div key={review.id} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-brand-gold fill-brand-gold' : 'text-gray-600'}`} />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 line-clamp-4 leading-relaxed text-sm">
                  "{review.review_text}"
                </p>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple-light">
                    {review.customer_name.charAt(0)}
                  </div>
                  {review.customer_name}
                </div>
              </div>
            ))}

            {reviews.length === 0 && (
              <div className="sm:col-span-2 lg:col-span-3 text-center py-12 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-gray-400">لا توجد تقييمات حتى الآن. كن أول من يقيّم هذا المنتج!</p>
              </div>
            )}
          </div>

          {reviews.length > 3 && (
            <div className="text-center mt-10">
              <button onClick={() => setShowAllReviews(!showAllReviews)} className="bg-[#0a0a0a] border border-white/10 hover:border-brand-gold text-white font-bold px-8 py-3 rounded-xl transition">
                {showAllReviews ? 'عرض أقل' : `عرض كافة الآراء (${reviews.length})`}
              </button>
            </div>
          )}
        </div>

        {/* Full Guarantee Section */}
        <div id="guarantee-section" className="mt-24 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 blur-3xl bg-brand-gold/5 rounded-full -mr-20 -mt-20"></div>
          <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full">🛡️ ضمان الجدية والقيمة</span>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                {isBook ? 'ضمان المعرفة العملية الفورية' : 'ضمان تطبيق وقيمة بلا مخاطر'}
              </h2>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                {isBook 
                  ? 'اقرأ الكتاب وطبّق أول ثلاثة تمارين فيه خلال 7 أيام. إذا شعرت أن الكتاب لم يقدم لك قيمة تساوي على الأقل 10 أضعاف قيمته، راسلنا مباشرة وسنعيد لك مبلغ الشراء فوراً دون أي تعقيد.'
                  : 'نحن نثق تماماً بنظام BLACK4ME. إذا طبقت الخطوات والأدوات المرفقة طوال أول 14 يوماً ولم تجد أي تحسن أو وضوح في تنظيم تسويق مشروعك، يمكنك التواصل معنا مباشرة لاسترداد كامل مبلغ الاستثمار. نتحمل عنك كل المخاطر لأننا نثق بجدوى ما نقدم.'}
              </p>
            </div>
            <div className="text-center bg-white/5 border border-white/5 rounded-2xl p-6">
              <span className="block text-4xl mb-2">🤝</span>
              <span className="block font-black text-white text-lg">راحة بال مطلقة</span>
              <span className="block text-xs text-gray-400 mt-1">سياسة استرداد شفافة ومباشرة</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 border-t border-white/10 pt-16">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-8 text-center">الأسئلة الشائعة</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-2">كيف سأحصل على المنتج بعد الشراء؟</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                ستحصل على رابط تحميل فوري مباشرة بعد إتمام عملية الدفع، كما سنرسل لك نسخة إضافية وتفاصيل الدخول عبر بريدك الإلكتروني لضمان وصولك الآمن للمحتوى في أي وقت.
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-2">هل أحتاج إلى معرفة تقنية أو برمجية؟</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                لا، لقد تم تصميم الأدوات والقوالب لتكون سهلة التطبيق والاستخدام بأسلوب السحب والإفلات، مع شرح مسجل مبسط خطوة بخطوة للبدء فوراً.
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-2">هل هناك دعم فني ومتابعة؟</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                نعم، فريق الدعم الفني متواجد عبر الواتساب والبريد الإلكتروني لمساعدتك في أي استفسار يخص إعداد النظام وتفعيله.
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-2">هل سياسة الاسترداد حقيقية؟</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                بالتأكيد، نحن ملتزمون بمبدأ القيمة والجدية. إذا طبقت الشروط المحددة ولم تستفد، فسيتم إعادة مبلغ الاستثمار لك بكل شفافية وود.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA Banner */}
        <div className="mt-24 text-center bg-gradient-to-r from-brand-purple/20 to-brand-gold/10 border border-brand-purple/20 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-4xl font-black text-white">ابدأ بناء نظامك التسويقي اليوم</h2>
            <p className="text-gray-300">انضم إلى مجموعة رواد الأعمال الذين اختاروا التوقف عن التخمين وبناء مبيعات حقيقية مستقرة.</p>
            <div className="flex justify-center">
              {product.payment_link ? (
                <Link href={product.payment_link} onClick={handleBuyClick} target="_blank" rel="noopener noreferrer" className="cta-glow bg-brand-gold hover:bg-yellow-400 text-black font-black px-8 py-4 rounded-2xl transition text-lg inline-flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>شراء الآن بـ ${product.sale_price || product.price}</span>
                </Link>
              ) : (
                <Link href={`/checkout?productId=${product.id}`} onClick={handleBuyClick} className="cta-glow bg-brand-gold hover:bg-yellow-400 text-black font-black px-8 py-4 rounded-2xl transition text-lg inline-flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>شراء الآن بـ ${product.sale_price || product.price}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

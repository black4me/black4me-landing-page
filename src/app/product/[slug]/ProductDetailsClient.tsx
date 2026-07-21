"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ArrowRight, CheckCircle2, ShoppingCart } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

export default function ProductDetailsClient({ product, initialReviews }: { product: any, initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ customer_name: '', rating: 5, review_text: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  React.useEffect(() => {
    import('@/lib/tracking').then(tracking => {
      tracking.trackEvent('ProductViewed', {
        content_name: product.title,
        content_ids: [product.id],
        content_type: 'product',
        value: product.sale_price || product.price,
        currency: 'USD'
      });
    });
  }, [product.id, product.title, product.sale_price, product.price]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    const { error } = await supabase.from('product_reviews').insert([{
      product_id: product.id,
      customer_name: reviewForm.customer_name,
      rating: reviewForm.rating,
      review_text: reviewForm.review_text,
      is_approved: false
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
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-brand-gold font-mono">${product.sale_price || product.price}</span>
                {product.sale_price && product.sale_price < product.price && (
                  <span className="text-lg text-gray-500 line-through font-mono">${product.price}</span>
                )}
              </div>
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
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            )}

            {product.chapters && product.chapters.length > 0 && (
              <div className="mb-8 space-y-3">
                <h3 className="text-lg font-bold text-white mb-4">المحتويات</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  {product.chapters.map((chapter: string, idx: number) => (
                    <li key={idx}>{chapter}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8">
              {product.payment_link ? (
                <Link href={product.payment_link} target="_blank" rel="noopener noreferrer" className="cta-glow w-full flex items-center justify-center gap-3 bg-brand-gold hover:bg-yellow-400 text-black font-black py-4 rounded-2xl transition text-lg">
                  <ShoppingCart className="w-5 h-5" />
                  <span>شراء الآن بـ ${product.sale_price || product.price}</span>
                </Link>
              ) : (
                <Link href={`/checkout?productId=${product.id}`} className="cta-glow w-full flex items-center justify-center gap-3 bg-brand-gold hover:bg-yellow-400 text-black font-black py-4 rounded-2xl transition text-lg">
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
              <h2 className="text-2xl font-black text-white">تقييمات العملاء</h2>
              <p className="text-gray-400 mt-2">آراء من جربوا هذا المنتج.</p>
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
            {reviews.map(review => (
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
        </div>

      </div>
    </div>
  );
}

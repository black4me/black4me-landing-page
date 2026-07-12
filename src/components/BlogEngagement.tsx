"use client";

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { MessageSquare, Star, Send, CheckCircle, AlertCircle, Eye } from 'lucide-react';

interface BlogEngagementProps {
  postId: string;
  viewsCount?: number;
  commentsCount?: number;
  averageRating?: number;
}

export default function BlogEngagement({ postId, viewsCount = 0, commentsCount = 0, averageRating = 0 }: BlogEngagementProps) {
  const [activeTab, setActiveTab] = useState<'comment' | 'review'>('comment');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !content) {
      setStatus('error');
      setErrorMessage('الرجاء تعبئة جميع الحقول المطلوبة.');
      return;
    }

    if (content.length < 10) {
      setStatus('error');
      setErrorMessage('محتوى الرسالة قصير جداً. يرجى كتابة 10 أحرف على الأقل.');
      return;
    }

    setStatus('loading');

    try {
      if (activeTab === 'comment') {
        const { error } = await supabase.from('blog_comments').insert([{
          post_id: postId,
          user_name: name,
          user_email: email,
          content: content,
          status: 'pending'
        }]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_reviews').insert([{
          post_id: postId,
          user_name: name,
          user_email: email,
          rating: rating,
          content: content,
          status: 'pending'
        }]);
        if (error) throw error;
      }

      setStatus('success');
      setContent('');
      // Optionally don't clear name/email if they want to post again later, but we will clear them here for simplicity
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'حدث خطأ غير متوقع.');
    }
  };

  return (
    <div className="mt-16 pt-12 border-t border-white/5">
      
      {/* Stats Widget */}
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mb-12 bg-[#111] border border-white/5 p-6 rounded-3xl">
        <div className="flex items-center gap-3 text-gray-300">
           <Eye className="w-5 h-5 text-blue-400" />
           <div>
             <div className="text-xl font-black text-white">{viewsCount}</div>
             <div className="text-xs text-gray-500">مشاهدة</div>
           </div>
        </div>
        <div className="w-px h-10 bg-white/10 hidden md:block"></div>
        <div className="flex items-center gap-3 text-gray-300">
           <MessageSquare className="w-5 h-5 text-emerald-400" />
           <div>
             <div className="text-xl font-black text-white">{commentsCount}</div>
             <div className="text-xs text-gray-500">تعليق</div>
           </div>
        </div>
        <div className="w-px h-10 bg-white/10 hidden md:block"></div>
        <div className="flex items-center gap-3 text-gray-300">
           <Star className="w-5 h-5 text-[#F5C542] fill-[#F5C542]" />
           <div>
             <div className="text-xl font-black text-white">{averageRating.toFixed(1)}</div>
             <div className="text-xs text-gray-500">متوسط التقييم</div>
           </div>
        </div>
      </div>

      {/* Submission Form */}
      <div className="bg-[#111114] border border-white/5 rounded-3xl p-6 md:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5C542]/5 rounded-full blur-3xl" />
        
        <h3 className="text-2xl font-black text-white mb-2 relative z-10">شاركنا رأيك</h3>
        <p className="text-gray-400 text-sm mb-8 relative z-10">نقدر تفاعلك! اختر إضافة تعليق للمناقشة، أو تقييم عام للمقال.</p>

        <div className="flex items-center gap-4 border-b border-white/10 mb-6 relative z-10">
           <button onClick={() => { setActiveTab('comment'); setStatus('idle'); }} 
             className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 transition border-b-2 ${activeTab === 'comment' ? 'border-[#F5C542] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
              <MessageSquare className="w-4 h-4"/> إضافة تعليق
           </button>
           <button onClick={() => { setActiveTab('review'); setStatus('idle'); }} 
             className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 transition border-b-2 ${activeTab === 'review' ? 'border-[#F5C542] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
              <Star className="w-4 h-4"/> تقييم المقال
           </button>
        </div>

        {status === 'success' ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-2xl text-center relative z-10">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">شكراً لمشاركتك!</h4>
            <p className="text-emerald-200 text-sm">تم إرسال {activeTab === 'comment' ? 'تعليقك' : 'تقييمك'} بنجاح، وهو الآن قيد المراجعة من قبل الإدارة وسيظهر قريباً.</p>
            <button onClick={() => setStatus('idle')} className="mt-6 text-sm text-emerald-400 hover:text-emerald-300 font-bold underline">إرسال المزيد</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">الاسم <span className="text-red-400">*</span></label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F5C542]" placeholder="اسمك الكريم" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">البريد الإلكتروني <span className="text-red-400">*</span></label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F5C542] text-left" dir="ltr" placeholder="your@email.com" />
              </div>
            </div>

            {activeTab === 'review' && (
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">التقييم <span className="text-red-400">*</span></label>
                <div className="flex items-center gap-2 bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 w-fit">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button type="button" key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                      <Star className={`w-6 h-6 ${star <= rating ? 'text-[#F5C542] fill-[#F5C542]' : 'text-gray-600 fill-transparent'}`} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2">المحتوى <span className="text-red-400">*</span></label>
              <textarea required rows={4} value={content} onChange={e => setContent(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F5C542] resize-y" 
                placeholder={activeTab === 'comment' ? "اكتب تعليقك هنا (10 أحرف كحد أدنى)..." : "ما رأيك في هذا المقال؟"} />
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            <button type="submit" disabled={status === 'loading'} className="bg-[#F5C542] hover:bg-yellow-400 text-black font-black px-8 py-3.5 rounded-xl transition flex items-center gap-2 disabled:opacity-50 w-full md:w-auto justify-center">
              {status === 'loading' ? 'جاري الإرسال...' : (
                <>إرسال {activeTab === 'comment' ? 'التعليق' : 'التقييم'} <Send className="w-4 h-4" /></>
              )}
            </button>
            <p className="text-[10px] text-gray-500 mt-2">لن يتم نشر بريدك الإلكتروني. جميع المشاركات تخضع للمراجعة قبل النشر.</p>
          </form>
        )}
      </div>
    </div>
  );
}

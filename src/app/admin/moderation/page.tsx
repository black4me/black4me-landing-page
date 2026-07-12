"use client";

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { CheckCircle, XCircle, EyeOff, MessageSquare, Star, Clock, AlertTriangle } from 'lucide-react';
import { BlogComment, BlogReview } from '@/types';

export default function ModerationAdmin() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [comments, setComments] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'comments' | 'reviews'>('comments');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'hidden'>('pending');

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    // Fetch comments
    const { data: commentsData } = await supabase
      .from('blog_comments')
      .select('*, blog_posts(title)')
      .eq('status', statusFilter)
      .order('created_at', { ascending: false });
    
    if (commentsData) setComments(commentsData);

    // Fetch reviews
    const { data: reviewsData } = await supabase
      .from('blog_reviews')
      .select('*, blog_posts(title)')
      .eq('status', statusFilter)
      .order('created_at', { ascending: false });
      
    if (reviewsData) setReviews(reviewsData);
  };

  const handleAction = async (type: 'comment' | 'review', id: string, action: 'approve' | 'reject' | 'hide') => {
    const table = type === 'comment' ? 'blog_comments' : 'blog_reviews';
    const newStatus = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'hidden';

    // Update status
    const { error: updateError } = await supabase
      .from(table)
      .update({ status: newStatus })
      .eq('id', id);

    if (updateError) {
      alert(updateError.message);
      return;
    }

    // Log the action
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      await supabase.from('moderation_logs').insert([{
        target_type: type,
        target_id: id,
        action: action,
        admin_id: userData.user.id
      }]);
    }

    // Refresh data
    fetchData();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5" dir="ltr">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`w-3 h-3 ${star <= rating ? 'text-[#F5C542] fill-[#F5C542]' : 'text-gray-600 fill-transparent'}`} />
        ))}
      </div>
    );
  };

  const renderItems = (items: any[], type: 'comment' | 'review') => {
    if (items.length === 0) {
      return (
        <div className="text-center py-16 bg-[#0a0a0a] border border-white/5 rounded-2xl">
          <CheckCircle className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
          <p className="text-gray-400">لا توجد عناصر {statusFilter === 'pending' ? 'بانتظار المراجعة' : 'بهذه الحالة'} حالياً.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-[#111] border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row gap-6 relative group">
             {/* Info */}
             <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                   <div>
                      <h4 className="text-white font-bold text-sm">{item.user_name}</h4>
                      <p className="text-gray-500 text-xs">{item.user_email}</p>
                   </div>
                   <span className="flex items-center gap-1 text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3"/>
                      {new Date(item.created_at).toLocaleDateString('ar-SA')}
                   </span>
                </div>
                
                {type === 'review' && (
                  <div className="mb-2">{renderStars(item.rating)}</div>
                )}

                <div className="bg-[#0a0a0a] p-3 rounded-lg text-gray-300 text-sm mb-3">
                   {item.content || <span className="text-gray-600 italic">لا يوجد محتوى نصي</span>}
                </div>

                <div className="text-xs text-gray-500 flex items-center gap-2">
                   <span className="font-bold text-gray-400">المقال:</span>
                   {item.blog_posts?.title || 'مقال غير معروف'}
                </div>
             </div>

             {/* Actions */}
             <div className="shrink-0 flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-r border-white/10 pt-4 md:pt-0 md:pr-6">
                {statusFilter !== 'approved' && (
                  <button onClick={() => handleAction(type, item.id, 'approve')} className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold px-4 py-2 rounded-xl transition text-sm flex-1 md:flex-none justify-center">
                    <CheckCircle className="w-4 h-4"/> موافقة
                  </button>
                )}
                {statusFilter !== 'rejected' && (
                  <button onClick={() => handleAction(type, item.id, 'reject')} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold px-4 py-2 rounded-xl transition text-sm flex-1 md:flex-none justify-center">
                    <XCircle className="w-4 h-4"/> رفض
                  </button>
                )}
                {statusFilter !== 'hidden' && statusFilter !== 'pending' && (
                  <button onClick={() => handleAction(type, item.id, 'hide')} className="flex items-center gap-2 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 font-bold px-4 py-2 rounded-xl transition text-sm flex-1 md:flex-none justify-center">
                    <EyeOff className="w-4 h-4"/> إخفاء
                  </button>
                )}
             </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">الإشراف (Moderation)</h2>
          <p className="text-gray-400 text-sm">إدارة ومراجعة التعليقات والتقييمات قبل نشرها للعامة.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-[#111] p-1.5 rounded-xl border border-white/10">
           {['pending', 'approved', 'hidden', 'rejected'].map(status => (
             <button key={status} onClick={() => setStatusFilter(status as any)} 
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${statusFilter === status ? 'bg-[#F5C542] text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
               {status === 'pending' ? 'بانتظار المراجعة' : status === 'approved' ? 'مقبول' : status === 'hidden' ? 'مخفي' : 'مرفوض'}
             </button>
           ))}
        </div>
      </div>

      <div className="flex items-center gap-6 border-b border-white/10 mb-6">
         <button onClick={() => setActiveTab('comments')} 
           className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 transition border-b-2 ${activeTab === 'comments' ? 'border-[#F5C542] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
            <MessageSquare className="w-4 h-4"/> 
            التعليقات
            {statusFilter === 'pending' && comments.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">{comments.length}</span>}
         </button>
         <button onClick={() => setActiveTab('reviews')} 
           className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 transition border-b-2 ${activeTab === 'reviews' ? 'border-[#F5C542] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
            <Star className="w-4 h-4"/> 
            التقييمات والمراجعات
            {statusFilter === 'pending' && reviews.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">{reviews.length}</span>}
         </button>
      </div>

      {statusFilter === 'pending' && (comments.length > 0 || reviews.length > 0) && (
        <div className="bg-[#F5C542]/10 border border-[#F5C542]/20 text-[#F5C542] p-4 rounded-xl flex items-start gap-3 mb-6">
           <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5"/>
           <div>
              <p className="font-bold text-sm">تنبيه إشراف</p>
              <p className="text-xs opacity-80 mt-1">يوجد محتوى بانتظار مراجعتك. الموافقة عليه ستجعله مرئياً للعامة مباشرة وسيتم تحديث إحصائيات المقال المرتبط.</p>
           </div>
        </div>
      )}

      {activeTab === 'comments' ? renderItems(comments, 'comment') : renderItems(reviews, 'review')}

    </div>
  );
}

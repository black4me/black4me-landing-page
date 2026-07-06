"use client";

import React from 'react';
import Link from 'next/link';
import { Star, User, Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';

export default function BlogPostClient({ post, products }: { post: any, products: any[] }) {
  
  // Format dates
  const publishDate = new Date(post.publish_date || post.created_at);
  const formattedDate = publishDate.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' });
  const formattedTime = publishDate.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header (Featured Image & Title) */}
        <div className="max-w-4xl mx-auto mb-16">
          {post.featured_image && (
            <div className="aspect-[21/9] bg-[#111] rounded-3xl overflow-hidden relative mb-10 border border-white/5">
              <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
          
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">{post.title}</h1>
          {post.subtitle && (
            <h2 className="text-xl md:text-2xl text-gray-400 mb-6">{post.subtitle}</h2>
          )}
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4"/> بواسطة جاسم محمد</span>
            <span>|</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> {formattedDate}</span>
            <span>|</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {formattedTime}</span>
          </div>
        </div>

        {/* Content Layout (Main + Sidebar) */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Main Article Body */}
          <div className="flex-1 space-y-8">
            {post.content_blocks && post.content_blocks.map((block: any) => {
              if (block.type === 'text') {
                return (
                  <div key={block.id} className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap" 
                    dangerouslySetInnerHTML={{ __html: block.content || '' }} 
                  />
                );
              }
              
              if (block.type === 'image' && block.imageUrl) {
                return (
                  <div key={block.id} className="my-10 relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/5">
                    <img src={block.imageUrl} alt="صورة توضيحية" className="w-full h-full object-cover" />
                  </div>
                );
              }
              
              if (block.type === 'product') {
                const product = products.find(p => p.id === block.productId);
                if (!product) return null;
                const image = product.images?.[0] || product.file_url;
                
                return (
                  <div key={block.id} className="my-10 bg-[#0d0d10] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 hover:border-[#F5C542]/40 transition group">
                    <div className="w-full md:w-48 aspect-video md:aspect-square bg-[#111] rounded-2xl overflow-hidden relative shrink-0">
                      {image ? (
                        <img src={image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs">لا صورة</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{product.title}</h3>
                      <div className="flex items-center gap-1 mb-3">
                        <span className="text-[#F5C542] font-bold ml-1">4.5</span>
                        {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-[#F5C542] fill-[#F5C542]' : 'text-[#F5C542]/30 fill-[#F5C542]/30'}`} />)}
                      </div>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-2xl font-black text-white font-mono">${product.sale_price || product.price}</span>
                        <Link href={`/product/${product.slug || product.id}`} className="bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-2 rounded-xl transition text-sm">
                          عرض التفاصيل
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }
              
              if (block.type === 'consultation') {
                // Mock consultation card as requested in design
                return (
                  <div key={block.id} className="my-10 bg-gradient-to-r from-[#0d0d10] to-[#111] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 group">
                    <div className="w-24 h-24 bg-[#1a1a1d] rounded-full overflow-hidden relative shrink-0 border-2 border-[#F5C542]/20">
                      <img src="/images/jasim-avatar.png" alt="استشارة" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-center md:text-right">
                      <h3 className="text-xl font-bold text-white mb-2">استشارة تسويق شخصية</h3>
                      <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                        <span className="text-[#F5C542] font-bold ml-1 text-sm">4.5</span>
                        {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-[#F5C542] fill-[#F5C542]' : 'text-[#F5C542]/30 fill-[#F5C542]/30'}`} />)}
                      </div>
                      <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">العمل اللصيق - مدة مفتوحة</p>
                    </div>
                    <div className="shrink-0 text-center w-full md:w-auto">
                      <Link href="/checkout" className="bg-transparent border border-[#F5C542]/50 text-[#F5C542] hover:bg-[#F5C542]/10 font-bold px-8 py-2.5 rounded-xl transition text-sm w-full md:w-auto inline-block">
                        حجز الآن
                      </Link>
                    </div>
                  </div>
                );
              }

              if (block.type === 'video') {
                // Parse YouTube ID to render custom player without controls
                const getYouTubeId = (url: string) => {
                  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
                  return match ? match[1] : null;
                };
                const videoId = block.videoUrl ? getYouTubeId(block.videoUrl) : null;
                
                return (
                  <div key={block.id} className="my-10 aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl">
                    {videoId ? (
                      <iframe 
                        src={`https://www.youtube.com/embed/${videoId}?controls=1&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&fs=1`} 
                        className="w-full h-full border-0 absolute inset-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">رابط الفيديو غير صالح</div>
                    )}
                  </div>
                );
              }

              return null;
            })}
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-white/5">
                <Tag className="w-5 h-5 text-gray-500 mt-1" />
                {post.tags.map((tag: string, i: number) => (
                  <span key={i} className="bg-white/5 text-gray-400 px-4 py-1.5 rounded-full text-sm font-medium hover:text-white hover:bg-white/10 transition cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-8">
            
            {/* Author Profile */}
            <div className="bg-[#111114] border border-white/5 p-6 rounded-3xl text-center">
              <div className="w-20 h-20 bg-[#1a1a1d] rounded-full mx-auto mb-4 overflow-hidden border border-white/10 relative">
                {/* User image */}
                <img src="/images/jasim-avatar.png" alt="جاسم محمد" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">جاسم محمد</h3>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mb-4">المؤسس - BLACK4ME</p>
              <button className="w-full bg-white/5 hover:bg-white/10 text-white text-sm font-bold py-2 rounded-xl transition">
                متابعة
              </button>
            </div>

            {/* Recommended Consultations Sidebar Block */}
            <div className="bg-[#111114] border border-white/5 p-6 rounded-3xl">
              <h3 className="text-sm font-bold text-white mb-1">استشارات شخصية</h3>
              <p className="text-xs text-gray-500 mb-6">احجز الآن جلسة عمل معي</p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-[#1a1a1d] rounded-full overflow-hidden shrink-0 border border-white/10"></div>
                   <div>
                     <h4 className="text-sm font-bold text-white">استشارة تسويق شخصية</h4>
                     <p className="text-xs text-[#F5C542]">4.5 ⭐⭐⭐⭐⭐</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-[#1a1a1d] rounded-full overflow-hidden shrink-0 border border-white/10"></div>
                   <div>
                     <h4 className="text-sm font-bold text-white">استشارة تسويق متقدمة</h4>
                     <p className="text-xs text-[#F5C542]">4.8 ⭐⭐⭐⭐⭐</p>
                   </div>
                </div>
              </div>
              
              <Link href="/checkout" className="w-full bg-transparent border border-[#F5C542]/30 hover:bg-[#F5C542]/10 text-[#F5C542] font-bold py-3 rounded-xl transition text-sm flex items-center justify-center">
                حجز الآن
              </Link>
            </div>

            {/* Latest Offers Ad */}
            <div className="bg-[#111114] border border-white/5 rounded-3xl overflow-hidden group cursor-pointer relative aspect-square flex flex-col items-center justify-center text-center p-6 hover:border-[#F5C542]/30 transition">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111] z-10" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5C542]/10 rounded-full blur-3xl group-hover:bg-[#F5C542]/20 transition" />
              
              <div className="relative z-20">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#F5C542]/50 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-[#F5C542] font-black">%</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">أحدث العروض</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">احصل على خصومات حصرية للمشتركين فقط على منتجاتنا المتميزة.</p>
                <Link href="/checkout" className="bg-[#F5C542] hover:bg-[#e0b53c] text-[#111] font-bold py-2 px-6 rounded-xl transition text-sm">
                  تصفح العروض
                </Link>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}

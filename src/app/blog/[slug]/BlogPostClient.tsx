"use client";

import React from 'react';
import Link from 'next/link';
import { Star, User, Calendar, Clock, ArrowLeft, Tag, Instagram, Facebook, Link as LinkIcon } from 'lucide-react';
import { BlogPost, Product, AdSettings } from '@/types';
import BlogEngagement from '@/components/BlogEngagement';
import InlineArticleAds from '@/components/ads/InlineArticleAds';
import AdProviderLoader from '@/components/ads/AdProviderLoader';

export default function BlogPostClient({ post, products, adSettings }: { post: BlogPost, products: Product[], adSettings?: AdSettings | null }) {
  
  // Format dates
  const publishDate = new Date(post.publish_date || post.created_at);
  const formattedDate = publishDate.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' });
  const formattedTime = publishDate.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

  // Get author data
  const author = post.authors || {
    name: post.author_name || 'فريق BLACK4ME',
    title: 'مستشار تسويق',
    bio: '',
    avatar_url: '/images/author-jasim.jpg',
    social_links: {}
  };

  return (
    <div className="pt-24 pb-20 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header (Featured Image & Title) */}
        <div className="max-w-4xl mx-auto mb-16">
          {post.featured_image && (
            <div className="aspect-[21/9] bg-[#111] rounded-3xl overflow-hidden relative mb-10 border border-white/5">
              <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.3] mb-6">{post.title}</h1>
          {post.subtitle && (
            <h2 className="text-xl md:text-2xl text-gray-400 leading-relaxed mb-8">{post.subtitle}</h2>
          )}
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
            <span className="flex items-center gap-1.5 text-white/90">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10">
                 <img src={author.avatar_url || '/images/author-jasim.jpg'} alt={author.name} className="w-full h-full object-cover" />
              </div>
              {author.name}
            </span>
            <span>|</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> {formattedDate}</span>
            <span>|</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {formattedTime}</span>
          </div>
        </div>

        {/* Content Layout (Main + Sidebar) */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Main Article Body */}
          <div className="flex-1 space-y-12">
            <InlineArticleAds
              blocks={post.content_blocks || []}
              settings={adSettings || null}
              renderBlock={(block: any, index: number) => {
                if (block.type === 'text') {
                return (
                  <div key={block.id} className="prose prose-invert prose-lg md:prose-xl max-w-none text-gray-300 leading-[2.2] whitespace-pre-wrap" 
                    dangerouslySetInnerHTML={{ __html: block.content || '' }} 
                  />
                );
              }
              
              if (block.type === 'heading') {
                return (
                   <h2 key={block.id} className="text-3xl md:text-4xl font-black text-white leading-tight mt-16 mb-8 border-b border-white/5 pb-4">
                     {block.content}
                   </h2>
                );
              }
              
              if (block.type === 'image' && block.imageUrl) {
                return (
                  <div key={block.id} className="my-14 relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/5 bg-[#0a0a0c]">
                    <img src={block.imageUrl} alt="صورة توضيحية" className="w-full h-full object-contain" />
                  </div>
                );
              }
              
              if (block.type === 'product') {
                const product: any = products.find(p => p.id === block.productId);
                if (!product) return null;
                const image = product.coverUrl || product.cover_url || product.fileUrl || product.file_url || (product.images && product.images.length > 0 ? product.images[0] : null);
                
                return (
                  <div key={block.id} className="my-14 bg-[#0d0d10] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 hover:border-[#F5C542]/40 transition group shadow-xl">
                    <div className="w-full md:w-56 h-56 bg-[#111] rounded-2xl overflow-hidden shrink-0 relative border border-white/5">
                      {image ? (
                        <img src={image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs">لا صورة</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{product.title}</h3>
                      <div className="flex items-center gap-1 mb-4">
                        {/* Removed hardcoded rating */}
                        {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 text-[#F5C542] fill-[#F5C542]`} />)}
                      </div>
                      <p className="text-gray-400 text-base mb-6 line-clamp-3 leading-relaxed">{product.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-3xl font-black text-white font-mono">${product.salePrice || product.sale_price || product.price}</span>
                        <Link href={`/product/${product.id}`} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-3 rounded-xl transition text-base flex items-center gap-2">
                          عرض التفاصيل <ArrowLeft className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }
              
              if (block.type === 'consultation') {
                return (
                  <div key={block.id} className="my-14 bg-gradient-to-r from-[#111] to-[#1a1a1d] border border-[#F5C542]/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#F5C542]/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="w-28 h-28 bg-[#1a1a1d] rounded-full overflow-hidden relative shrink-0 border-2 border-[#F5C542]/40 shadow-[0_0_30px_rgba(245,197,66,0.15)] z-10">
                      <img src="/images/jasim-avatar.png" alt="استشارة" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-center md:text-right z-10">
                      <h3 className="text-2xl md:text-3xl font-black text-white mb-3">استشارة تسويقية مع الأستاذ جاسم</h3>
                      <div className="flex items-center justify-center md:justify-start gap-1 mb-3">
                        <span className="text-[#F5C542] font-bold ml-1 text-base">5.0</span>
                        {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 text-[#F5C542] fill-[#F5C542]`} />)}
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed max-w-lg mx-auto md:mx-0">ضع خطة تسويقية محكمة لمشروعك مع تحليل شامل لنقاط القوة والضعف والمنافسين في جلسة خاصة.</p>
                    </div>
                    <div className="shrink-0 text-center w-full md:w-auto z-10">
                      <Link href="/consultation" className="bg-[#F5C542] text-[#111] hover:bg-[#e0b53c] font-black px-10 py-4 rounded-xl transition text-base w-full md:w-auto inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1">
                        احجز موعدك الآن <ArrowLeft className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                );
              }

              if (block.type === 'video') {
                const getYouTubeId = (url: string) => {
                  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
                  return match ? match[1] : null;
                };
                const videoUrl = block.videoUrl || '';
                const videoId = getYouTubeId(videoUrl);
                const isMp4 = videoUrl.toLowerCase().includes('.mp4');
                
                return (
                  <div key={block.id} className="my-14 aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl">
                    {videoId ? (
                      <iframe 
                        src={`https://www.youtube.com/embed/${videoId}?controls=1&rel=0`} 
                        title="YouTube video player"
                        frameBorder="0"
                        className="w-full h-full absolute inset-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen 
                      />
                    ) : isMp4 ? (
                      <video src={videoUrl} controls className="w-full h-full object-contain absolute inset-0" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">رابط الفيديو غير صالح</div>
                    )}
                  </div>
                );
              }

              return null;
            }} />
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mt-16 pt-8 border-t border-white/5">
                <Tag className="w-5 h-5 text-gray-500" />
                {post.tags.map((tag: string, i: number) => (
                  <Link href={`/blog?tag=${tag}`} key={i} className="bg-white/5 text-gray-300 px-5 py-2 rounded-full text-sm font-medium hover:text-[#F5C542] hover:bg-[#F5C542]/10 transition cursor-pointer border border-white/5">
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Engagement Widget */}
            <BlogEngagement 
              postId={post.id} 
              viewsCount={post.views_count || 0} 
              commentsCount={post.comments_count || 0} 
              averageRating={post.average_rating || 0} 
            />
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[360px] shrink-0 space-y-8 sticky top-32 self-start">
            
            {/* Dynamic Author Profile */}
            <div className="bg-[#111114] border border-white/5 p-8 rounded-3xl text-center shadow-lg">
              <div className="w-28 h-28 bg-[#1a1a1d] rounded-full mx-auto mb-5 overflow-hidden border-2 border-white/10 relative shadow-inner">
                <img src={author.avatar_url || '/images/author-jasim.jpg'} alt={author.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">{author.name}</h3>
              {author.title && <p className="text-[#F5C542] text-sm font-bold uppercase tracking-widest mb-4">{author.title}</p>}
              
              {author.bio && (
                <p className="text-gray-400 text-sm leading-[1.8] mb-6">{author.bio}</p>
              )}
              
              <div className="flex items-center justify-center gap-3 mb-6">
                {author.social_links?.instagram && (
                  <a href={author.social_links.instagram.startsWith('http') ? author.social_links.instagram : `https://${author.social_links.instagram}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#E1306C] hover:bg-white/10 transition">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {author.social_links?.facebook && (
                  <a href={author.social_links.facebook.startsWith('http') ? author.social_links.facebook : `https://${author.social_links.facebook}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#1877F2] hover:bg-white/10 transition">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {author.social_links?.website && (
                  <a href={author.social_links.website} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition">
                    <LinkIcon className="w-5 h-5" />
                  </a>
                )}
              </div>

              <Link href={author.social_links?.whatsapp ? (author.social_links.whatsapp.includes('wa.me') && !author.social_links.whatsapp.startsWith('http') ? `https://${author.social_links.whatsapp}` : author.social_links.whatsapp) : '/consultation'} className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 text-sm font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
                تواصل مع الكاتب
              </Link>
            </div>

            {/* Recommended Consultations Sidebar Block */}
            <div className="bg-gradient-to-br from-[#111114] to-[#0d0d10] border border-white/5 p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#F5C542]/5 rounded-full blur-3xl" />
              <h3 className="text-lg font-black text-white mb-2 relative z-10">استشارات شخصية</h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed relative z-10">احجز الآن جلسة عمل معي لمناقشة مشروعك</p>
              
              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition">
                   <div className="w-12 h-12 bg-[#1a1a1d] rounded-full overflow-hidden shrink-0 border border-white/10">
                     <img src="/images/author-jasim.jpg" alt="استشارة" className="w-full h-full object-cover" />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-white mb-1">استشارة تسويق شخصية</h4>
                     <p className="text-xs text-[#F5C542] flex items-center gap-1 font-bold">5.0 <Star className="w-3 h-3 fill-[#F5C542]" /></p>
                   </div>
                </div>
              </div>
              
              <Link href="/consultation" className="w-full bg-transparent border-2 border-[#F5C542]/50 hover:bg-[#F5C542]/10 text-[#F5C542] font-black py-3.5 rounded-xl transition text-base flex items-center justify-center relative z-10">
                حجز موعد
              </Link>
            </div>
            
          </aside>
        </div>
      </div>
      {adSettings && <AdProviderLoader settings={adSettings} />}
    </div>
  );
}

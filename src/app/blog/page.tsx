import React from 'react';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Image from 'next/image';

export const metadata = {
  title: 'المدونة | BLACK4ME',
  description: 'مقالات وأدلة حصرية في التسويق الرقمي وبناء المشاريع.',
};

export default async function BlogPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Fetch published blog posts
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
  }

  const articles = posts || [];

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">المدونة</h1>
          <p className="text-xl text-gray-400">مقالات وأدلة حصرية في التسويق الرقمي وبناء المشاريع</p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center text-gray-500 py-20 bg-[#111114] border border-white/5 rounded-3xl">
            <h2 className="text-2xl font-bold mb-2">لا توجد مقالات حالياً</h2>
            <p>سيتم إضافة مقالات جديدة قريباً، عد لاحقاً!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => {
              const publishDate = new Date(article.publish_date || article.created_at);
              const formattedDate = publishDate.toLocaleDateString('ar-EG');
              
              // Extract text excerpt from blocks if no explicit excerpt exists
              let excerpt = article.subtitle || '';
              if (!excerpt && article.content_blocks) {
                const textBlock = article.content_blocks.find((b: any) => b.type === 'text');
                if (textBlock && textBlock.content) {
                  // simple strip HTML
                  excerpt = textBlock.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...';
                }
              }

              return (
                <Link 
                  key={article.id} 
                  href={`/blog/${article.slug}`}
                  className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden hover:border-[#F5C542]/30 transition group flex flex-col"
                >
                  <div className="h-48 overflow-hidden relative bg-[#1a1a1d]">
                    {article.featured_image ? (
                      <Image 
                        src={article.featured_image} 
                        alt={article.title} 
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10 text-sm">لا توجد صورة</div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-[#F5C542] text-xs font-bold mb-3">{formattedDate}</div>
                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">{article.title}</h2>
                    <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed flex-1">{excerpt}</p>
                    <div className="mt-6 flex items-center text-[#F5C542] font-bold text-sm">
                      اقرأ المزيد 
                      <span className="mr-2">←</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

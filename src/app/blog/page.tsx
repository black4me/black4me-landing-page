import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'المدونة | BLACK4ME',
  description: 'مقالات وأدلة حصرية في التسويق الرقمي وبناء المشاريع.',
};

export default function BlogPage() {
  // Temporary mock data until CMS is fully connected
  const articles = [
    {
      id: 1,
      title: 'كيف تبني نظام تسويق يعمل بدون تدخل منك؟',
      excerpt: 'تعرف على الخطوات الأساسية لبناء نظام تسويقي متكامل يجذب العملاء ويزيد من مبيعاتك بشكل آلي...',
      slug: 'how-to-build-automated-marketing-system',
      date: '2026-07-07',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3'
    },
    {
      id: 2,
      title: '5 أخطاء كارثية في إعلانات فيسبوك تدمر ميزانيتك',
      excerpt: 'تجنب هذه الأخطاء الشائعة التي يقع فيها أغلب المسوقين المبتدئين والتي تؤدي إلى إهدار الميزانية الإعلانية...',
      slug: '5-disastrous-facebook-ads-mistakes',
      date: '2026-07-06',
      image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80&w=2000&ixlib=rb-4.0.3'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">المدونة</h1>
          <p className="text-xl text-gray-400">مقالات وأدلة حصرية في التسويق الرقمي وبناء المشاريع</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link 
              key={article.id} 
              href={`/blog/${article.slug}`}
              className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden hover:border-[#ceae88]/30 transition group"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-6">
                <div className="text-[#ceae88] text-xs font-bold mb-3">{new Date(article.date).toLocaleDateString('ar-EG')}</div>
                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">{article.title}</h2>
                <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">{article.excerpt}</p>
                <div className="mt-6 flex items-center text-[#ceae88] font-bold text-sm">
                  اقرأ المزيد 
                  <span className="mr-2">←</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

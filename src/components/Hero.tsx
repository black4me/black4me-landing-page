import React from 'react';
import { Target, ShieldCheck, Download, Zap, Sparkles, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import HeroVideo from './HeroVideo';

interface HeroProps {
  onBuyClick: () => void;
  onExploreClick: () => void;
}

export default function Hero({ onBuyClick, onExploreClick }: HeroProps) {
  const { products, siteSettings } = useApp();
  const mainProduct = products.find(p => p.id === 'prod-main-book') || {
    title: 'بدون التسويق... كارثة تهدد ثروتك المستقبلية',
    description: 'قد تمتلك أفضل مهارة أو خدمة في العالم، ولكن السوق لن يشتري منك شيئاً بدون نظام تسويقي حقيقي يحول المشاهدات إلى أرباح طائلة وقابلة للتنبؤ.',
    price: 199,
    salePrice: 49
  };

  const heroTitle = siteSettings?.hero_title || mainProduct.title;
  const heroBadge = siteSettings?.hero_badge || '🔥 عرض محدود: $49 بدل $199 — وفّر 75%';
  const heroSubtitle = siteSettings?.hero_subtitle || 'الكتاب العملي + النظام التعليمي + 6 قوالب جاهزة';
  const heroCtaPrimary = siteSettings?.hero_cta_primary || '← احصل على الحزمة الشاملة — $49';
  const heroCtaSecondary = siteSettings?.hero_cta_secondary || 'شاهد عينة مجانية من الكتاب';
  const heroSupportText = siteSettings?.hero_support_text || mainProduct.description;

  // Helper to split title for styling (if it contains '...')
  const titleParts = heroTitle.split('...');
  const titlePart1 = titleParts[0] ? titleParts[0] + (titleParts.length > 1 ? '...' : '') : heroTitle;
  const titlePart2 = titleParts[1] ? titleParts[1] : '';

  return (
    <section className="relative bg-[#000000] text-brand-white pt-20 pb-0 overflow-hidden border-b border-white/10" dir="rtl">
      {/* Immersive Dot Matrix Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(#6C3BFF 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}></div>
      </div>

      {/* Styled glowing blur halos from Immersive UI */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#6C3BFF]/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-brand-gold/10 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Right Column: Text and Action items */}
          <div className="lg:col-span-7 py-12 flex flex-col justify-center text-right">
            <div className="mb-6">
              <span className="inline-block bg-[#F5C542] text-black px-4 py-1.5 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(245,197,66,0.3)]">
                {heroBadge}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mt-6 leading-tight mb-4">
              بدون تسويق كارثة تهدد ثروتك المستقبلية
            </h1>

            <h2 className="text-xl md:text-2xl mt-4 text-gray-300">
              الكتاب العملي + النظام التعليمي + 6 قوالب جاهزة
            </h2>

            <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              دليل بناء العروض التي لا ترفض وتحويل المهارات إلى أرباح طائلة.
              من تأليف جاسم محمد — مستشار التسويق الرقمي في BLACK4ME.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                id="hero-buy-button"
                onClick={onBuyClick}
                className="px-8 py-4 bg-[#F5C542] hover:bg-yellow-500 text-black font-black text-lg rounded-xl flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_25px_rgba(245,197,66,0.35)]"
              >
                <span>{heroCtaPrimary}</span>
              </button>
              
              <button
                id="hero-explore-button"
                onClick={onExploreClick}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-lg hover:bg-white/10 text-white transition cursor-pointer"
              >
                {heroCtaSecondary}
              </button>
            </div>

            {/* Immersive Trust Proofs row */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-10 border-t border-white/10 pt-8 text-right">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white">+15,000</span>
                <span className="text-xs text-white/40 uppercase tracking-widest font-bold mt-0.5">عميل مستفيد</span>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/20"></div>
              
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white">99.9%</span>
                <span className="text-xs text-white/40 uppercase tracking-widest font-bold mt-0.5">دفع آمن</span>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/20"></div>

              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 space-x-reverse">
                  <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-black flex items-center justify-center text-[10px] font-bold">👤</div>
                  <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-black flex items-center justify-center text-[10px] font-bold">👤</div>
                  <div className="w-8 h-8 rounded-full bg-slate-500 border-2 border-black flex items-center justify-center text-[10px] font-bold">👤</div>
                </div>
                <span className="text-xs text-white/60 font-bold">دعم مستمر ومتاح 24/7 للعملاء</span>
              </div>
            </div>
          </div>

          {/* Left Column: Visual Panel (Video) */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0 pb-12 flex items-center justify-center">
            <HeroVideo />
          </div>

        </div>
      </div>

      {/* Styled Bottom Feature Bar from Immersive UI */}
      <div className="h-auto md:h-24 bg-[#050505] border-t border-white/10 grid grid-cols-2 md:grid-cols-4 mt-16" dir="rtl">
        <div className="flex items-center justify-center gap-4 py-6 md:py-0 border-l border-white/10 hover:bg-white/[0.02] transition">
          <div className="w-10 h-10 rounded-full bg-[#F5C542]/15 flex items-center justify-center text-[#F5C542] text-lg font-bold">⚡</div>
          <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-white">تحميل فوري للأصول</span>
        </div>
        
        <div className="flex items-center justify-center gap-4 py-6 md:py-0 border-l border-white/10 hover:bg-white/[0.02] transition">
          <div className="w-10 h-10 rounded-full bg-[#6C3BFF]/15 flex items-center justify-center text-[#6C3BFF] text-lg font-bold">💎</div>
          <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-white">جودة بريميوم فاخرة</span>
        </div>

        <div className="flex items-center justify-center gap-4 py-6 md:py-0 border-l border-white/10 hover:bg-white/[0.02] transition">
          <div className="w-10 h-10 rounded-full bg-[#22C55E]/15 flex items-center justify-center text-[#22C55E] text-lg font-bold">📈</div>
          <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-white">نتائج وتوصيات مثبتة</span>
        </div>

        <div className="flex items-center justify-center gap-4 py-6 md:py-0 hover:bg-white/[0.02] transition">
          <div className="w-10 h-10 rounded-full bg-[#EF4444]/15 flex items-center justify-center text-[#EF4444] text-lg font-bold">🛡️</div>
          <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-white">ضمان استرداد بنسبة %100</span>
        </div>
      </div>
    </section>
  );
}


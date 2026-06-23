import React from 'react';
import Hero from '../components/Hero';
import Problem from '../components/Problem';
import Transformation from '../components/Transformation';
import Funnel from '../components/Funnel';
import GrowthChart from '../components/GrowthChart';
import ProductSection from '../components/ProductSection';
import ValuePricing from '../components/ValuePricing';
import Testimonials from '../components/Testimonials';
import FAQAccordion from '../components/FAQAccordion';
import ConsultationSection from '../components/ConsultationSection';
import NewsletterSection from '../components/NewsletterSection';
import { Sparkles, Star } from 'lucide-react';

interface LandingPageProps {
  onNavigateToCheckout: () => void;
  onNavigateToConsultationCheckout: (name: string, email: string) => void;
}

export default function LandingPage({ onNavigateToCheckout, onNavigateToConsultationCheckout }: LandingPageProps) {
  
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-brand-black min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "BLACK4ME - نظام التسويق الذكي",
            "description": "المنصة المتكاملة للتسويق الذكي والمبيعات الرقمية المتقدمة.",
            "brand": {
              "@type": "Brand",
              "name": "BLACK4ME"
            },
            "offers": {
              "@type": "Offer",
              "url": "https://www.black4me.com",
              "priceCurrency": "USD",
              "price": "49",
              "availability": "https://schema.org/InStock"
            }
          })
        }}
      />
      {/* Floating Trust Banner */}
      <div className="bg-brand-purple text-white text-center py-2 text-xs font-bold leading-none sticky top-[45px] z-40 flex items-center justify-center gap-1.5 px-4" dir="rtl">
        <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-bounce" />
        <span>عرض الانطلاق المميز: اطلب الحزمة اليوم واحوز على كتابين بقيمة كتاب واحد مجدداً!</span>
      </div>

      <Hero 
        onBuyClick={onNavigateToCheckout} 
        onExploreClick={() => scrollToSection('funnel-section')} 
      />
      
      <Problem />
      
      <Transformation />
      
      <Funnel />
      
      <GrowthChart />
      
      <ProductSection />
      
      <ValuePricing onBuyClick={onNavigateToCheckout} />
      
      <Testimonials />
      
      <FAQAccordion />
      
      <ConsultationSection onProceedToPayment={onNavigateToConsultationCheckout} />
      
      <NewsletterSection />

      {/* Corporate Luxury Footer */}
      <footer className="bg-brand-black text-gray-500 border-t border-brand-white/10 py-12 px-4 text-center text-xs" dir="rtl">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex justify-center items-center gap-2">
            <span className="font-bold text-sm text-white">BLACK4ME</span>
            <span className="text-brand-purple font-medium text-xs">|</span>
            <span className="text-gray-400">بواسطة جاسم محمد (Jasim Mohammed)</span>
          </div>
          <p className="max-w-md mx-auto leading-relaxed">
            جميع الحقوق محفوظة © 2026. هذه المنصة مصممة برعاية فنية مطلقة لتسريع مبيعات المنتجات والاستشارات بأرقى معايير السلوك والتحويل المالي.
          </p>
          <div className="flex justify-center gap-6 text-[10px] text-gray-600">
            <a href="#pricing-section" className="hover:text-brand-gold transition duration-200">الأحكام والشروط</a>
            <span>•</span>
            <a href="#pricing-section" className="hover:text-brand-gold transition duration-200">سياسة الخصوصية</a>
            <span>•</span>
            <a href="#pricing-section" className="hover:text-brand-gold transition duration-200">حقوق الملكية الفكرية</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

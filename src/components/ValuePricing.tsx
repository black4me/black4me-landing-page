import React, { useState } from 'react';
import { Tag, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ValuePricingProps {
  onBuyClick: () => void;
}

export default function ValuePricing({ onBuyClick }: ValuePricingProps) {
  const { valueStackItems, products } = useApp();

  const mainProduct = products.find(p => p.id === 'prod-main-book') || products[0];
  
  const totalValue = valueStackItems.reduce((acc, item) => acc + item.realValue, 0);

  return (
    <section id="pricing-section" className="bg-brand-darkgray text-brand-white py-24 px-4 border-b border-brand-purple/10" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center space-y-4 mb-16">
          <span className="text-brand-purple font-bold text-xs bg-brand-purple/15 border border-brand-purple/30 px-4 py-1.5 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            <span>عرض التكلفة والمنفعة المتبادلة</span>
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            العرض الأثمن لهندسة مبيعاتك وأرباحك
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            انظر لتفاصيل القيمة الهيكلية التي ستحوز عليها، وسعر العرض الحصري المخفض والمدعوم للعلامة اليوم.
          </p>
        </div>

        {/* Value Stack Grid Frame */}
        <div className="bg-brand-black border border-brand-white/10 rounded-3xl overflow-hidden shadow-2xl relative mb-12">
          
          <div className="bg-gradient-to-l from-brand-purple/40 to-brand-black p-6 border-b border-brand-white/10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-gold" />
              <span>جدول تجميع قيمة الحزمة الكاملة (Hormozi Value Stack)</span>
            </h3>
          </div>

          <div className="divide-y divide-brand-white/5">
            {valueStackItems.map((item, idx) => (
              <div key={item.id || idx} className="p-5 sm:p-6 grid sm:grid-cols-12 gap-4 items-center hover:bg-brand-white/[0.01] transition duration-200">
                <div className="sm:col-span-8 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-gold" />
                    <span className="text-sm sm:text-base font-bold text-white">{item.name}</span>
                  </div>
                  <p className="text-xs text-gray-400 mr-4 font-medium">{item.notes}</p>
                </div>
                <div className="sm:col-span-4 text-left font-mono">
                  <span className="text-gray-400 text-sm line-through block sm:inline-block sm:ml-4">
                    ${item.realValue} USD
                  </span>
                  <span className="text-brand-green font-bold text-xs bg-brand-green/10 border border-brand-green/20 px-2 py-0.5 rounded">
                    مضمن مجاناً
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Sum Total Valuation Footer */}
          <div className="bg-brand-darkgray/80 p-6 border-t border-brand-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-gray-400 text-sm font-semibold">إجمالي القيمة التقديرية للحزمة:</span>
            <div className="text-left font-mono">
              <span className="text-2xl font-black text-brand-red line-through">${totalValue} USD</span>
            </div>
          </div>
        </div>

        {/* Final Interactive Pricing Tier */}
        <div className="bg-gradient-to-b from-brand-black to-brand-darkgray border-2 border-brand-gold rounded-3xl p-8 sm:p-12 text-center relative shadow-[0_8px_35px_rgba(245,197,66,0.15)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-gold text-brand-black px-6 py-1.5 font-black rounded-full text-xs uppercase tracking-wider shadow">
            عرض الملاك الأصليين المحدود
          </div>

          <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest border border-brand-gold/30 px-3 py-1 bg-brand-gold/5 rounded-full inline-block mb-4">
            تخفيض بنسبة 75٪ متاح حالياً لفترة مؤقتة
          </span>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">امتلك كامل أصول BLACK4ME والكتب الآن</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">
            ادفع مرة واحدة فقط، واحصل على تحديثات فورية وتحميل مدى الحياة دون أي فواتير متكررة أو مخفية.
          </p>

          <div className="space-y-1 mb-8">
            <p className="text-gray-500 text-sm line-through">القيمة الحقيقية: ${totalValue} دولار أمريكي</p>
            <div className="flex justify-center items-baseline gap-2">
              <span className="text-5xl font-black text-brand-gold drop-shadow-[0_0_10px_rgba(245,197,66,0.3)]">
                ${mainProduct?.salePrice || mainProduct?.price || 49}
              </span>
              <span className="text-lg text-gray-400 font-medium">دولار فقط لمرة واحدة</span>
            </div>
          </div>

          <button
            id="pricing-buy-button"
            onClick={onBuyClick}
            className="w-full sm:w-80 bg-brand-gold hover:bg-yellow-500 text-brand-black font-extrabold py-4 px-8 rounded-xl transition duration-300 shadow-[0_4px_25px_rgba(245,197,66,0.3)] transform hover:scale-[1.03] cursor-pointer flex items-center justify-center gap-2 mx-auto text-lg"
          >
            <ShoppingCart className="w-5 h-5 fill-current" />
            <span>شراء وتنزيل الكتب فوراً</span>
          </button>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
            <AlertCircle className="w-4 h-4 text-brand-gold shrink-0" />
            <span>ضمان استرجاع القيمة في حال وجود أي مشاكل تنزيل فنية.</span>
          </div>
        </div>

      </div>
    </section>
  );
}

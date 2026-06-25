"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '../context/AppContext';
import {
  Target, ShieldCheck, Download, Zap, Sparkles, ArrowLeft,
  CheckCircle2, Star, BookOpen, Users, TrendingUp, Clock,
  ChevronDown, ChevronUp, Play, Award, Rocket, MessageSquare,
  Lock, CreditCard, RefreshCw, Headphones, PenTool, Lightbulb,
  CheckSquare, ArrowDown, Gift, X
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   HERO SECTION — Above the fold, result-oriented
   ═══════════════════════════════════════════════════════════════ */

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => { setIsVisible(true); }, []);

  return (
    <section id="hero" className="relative bg-brand-black text-brand-white pt-8 pb-0 overflow-hidden" dir="rtl">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(#6C3BFF 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      </div>
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-brand-purple/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-brand-gold/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[80vh]">
          
          {/* Text Column */}
          <div className={`lg:col-span-7 py-8 lg:py-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span className="text-xs font-bold text-brand-purple-light">+300 مشترك في النظام التسويقي</span>
            </div>

            {/* H1 — Result-oriented headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-black leading-[1.15] mb-6">
              <span className="block">أبني لك نظام تسويق يجلب</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-l from-brand-gold via-brand-gold to-brand-purple drop-shadow-[0_2px_15px_rgba(245,197,66,0.15)]">
                20 عميل مؤكد شهرياً
              </span>
              <span className="block text-2xl sm:text-3xl md:text-3xl mt-2 text-gray-300 font-bold">
                خلال 60 يوم — ضمان استرداد أو عمل مجاني حتى تحقق النتيجة.
              </span>
            </h1>

            {/* H2 — How it works */}
            <h2 className="text-base md:text-lg text-gray-400 leading-relaxed mb-8 max-w-2xl">
              حزمة متكاملة تجمع كتاب عملي + نظام تعليمي رقمي + قوالب تسويقية جاهزة + استشارة فردية مباشرة — كل ما تحتاجه لتحوّل مهارتك إلى مصدر دخل مستقر بدون ملاحقة العملاء.
            </h2>

            {/* Value Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                { icon: Target, text: 'نتيجة مضمونة: 20 عميل أو استرداد' },
                { icon: Clock, text: 'تطبيق عملي خلال 60 يوم فقط' },
                { icon: ShieldCheck, text: 'ضمان استرداد كامل 7 أيام' },
                { icon: Headphones, text: 'دعم مباشر من المؤسس جاسم محمد' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-brand-gold" />
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link
                href="/checkout"
                className="cta-glow bg-brand-gold hover:bg-yellow-400 text-brand-black text-base font-black py-4 px-8 rounded-2xl transition-all duration-300 text-center flex items-center justify-center gap-2"
              >
                <span>احصل على الحزمة الشاملة $49 — ابدأ الآن</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <button
                onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-transparent border border-brand-white/15 hover:border-brand-purple/40 text-white text-sm font-bold py-4 px-6 rounded-2xl transition-all text-center hover:bg-brand-white/5"
              >
                اطّلع على القوالب مجاناً
              </button>
            </div>

            {/* Micro Trust */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>دفع آمن</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                <span>Stripe & PayPal</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                <span>استرداد 7 أيام</span>
              </div>
            </div>
          </div>

          {/* Book Cover Column */}
          <div className={`lg:col-span-5 flex justify-center lg:justify-end transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative">
              {/* Glow behind book */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-gold/10 blur-[60px] rounded-full scale-110" />
              
              {/* Book Image */}
              <div className="relative animate-float w-full max-w-[450px] aspect-[4/5] mx-auto">
                <Image
                  src="/images/book-cover.png"
                  alt="كتاب بدون التسويق كارثة تهدد ثروتك المستقبلية — تأليف جاسم محمد"
                  fill
                  className="drop-shadow-2xl object-cover rounded-2xl"
                  priority
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 glass-gold rounded-2xl px-4 py-3 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1 rtl:space-x-reverse">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white">4.9/5 — 127 تقييم</span>
                </div>
              </div>

              {/* Price Badge */}
              <div className="absolute -top-4 -left-4 bg-brand-green/90 text-white rounded-xl px-3 py-2 text-center">
                <span className="text-[10px] font-medium block line-through text-white/60">$199</span>
                <span className="text-lg font-black block leading-none">$49</span>
                <span className="text-[9px] font-bold">خصم 75%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="flex justify-center pb-8 pt-4">
        <button 
          onClick={() => document.getElementById('problem-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-brand-gold transition animate-bounce"
          aria-label="اكتشف المزيد"
        >
          <span className="text-[10px]">اكتشف المزيد</span>
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROBLEM SECTION — Agitate the pain
   ═══════════════════════════════════════════════════════════════ */

function ProblemSection() {
  return (
    <section id="problem-section" className="section-padding bg-surface-1 border-y border-brand-white/5" dir="rtl">
      <div className="max-w-5xl mx-auto text-center">
        <span className="text-brand-red text-xs font-bold uppercase tracking-widest mb-4 block">المشكلة الحقيقية</span>
        <h2 className="text-2xl md:text-4xl font-black text-white mb-6">
          تملك مهارة ممتازة… لكن لا أحد يشتري منك؟
        </h2>
        <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-12">
          90% من أصحاب المهارات والمشاريع الصغيرة يخسرون آلاف الدولارات شهرياً — ليس لأن منتجهم سيء، بل لأنهم يفتقدون نظام تسويقي يعمل بشكل مؤتمت ويحوّل المشاهدات إلى عملاء يدفعون.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              emoji: '😤',
              title: 'ملاحقة بدون نتيجة',
              desc: 'ترسل مئات الرسائل يومياً وتنشر محتوى عشوائي لكن لا أحد يتحول إلى عميل حقيقي.',
            },
            {
              emoji: '💸',
              title: 'أسعار منخفضة تأكل أرباحك',
              desc: 'تتنازل في السعر لتجذب أي عميل، فتنتهي بربح ضعيف وعمل مرهق لا يستحق الجهد.',
            },
            {
              emoji: '🔄',
              title: 'دوران بلا تقدم',
              desc: 'تعمل 12+ ساعة يومياً لكن الدخل الشهري لا يتغير. لا نظام، لا استقرار، لا نمو.',
            },
          ].map((item, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center hover:border-brand-red/20 transition-all group">
              <span className="text-4xl mb-4 block">{item.emoji}</span>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOW IT WORKS — 4 Steps
   ═══════════════════════════════════════════════════════════════ */

function HowItWorksSection() {
  const steps = [
    {
      num: 1,
      icon: BookOpen,
      title: 'اقرأ الكتاب التأسيسي',
      desc: 'افهم قواعد التسويق الحقيقية وتعلّم كيف تصيغ عرضاً لا يُرفض يستهدف العملاء ذوي الملاءة العالية.',
      color: 'brand-purple',
    },
    {
      num: 2,
      icon: PenTool,
      title: 'طبّق القوالب الجاهزة',
      desc: 'استخدم قوالب المحتوى التسويقي ونماذج الفنل الجاهزة لبناء نظامك في أيام بدلاً من أشهر.',
      color: 'brand-gold',
    },
    {
      num: 3,
      icon: Rocket,
      title: 'أطلق نظامك المؤتمت',
      desc: 'ربط بوابات الدفع وأنظمة البريد الإلكتروني والأتمتة. نظامك يعمل 24/7 حتى وأنت نائم.',
      color: 'brand-green',
    },
    {
      num: 4,
      icon: TrendingUp,
      title: 'احصل على أول عميل',
      desc: 'خلال 60 يوم من التطبيق، ستبدأ في استقبال عملاء مؤهلين ومستعدين للدفع بشكل منتظم.',
      color: 'brand-gold',
    },
  ];

  return (
    <section id="how-it-works" className="section-padding bg-brand-black" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-3 block">كيف يعمل النظام</span>
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
            4 خطوات من الصفر إلى أول عميل يدفع
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            لا تحتاج خبرة سابقة. النظام مصمم ليأخذك خطوة بخطوة من المبتدئ إلى صاحب نظام مبيعات مؤتمت.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -left-3 w-6 h-[2px] bg-gradient-to-l from-brand-white/10 to-transparent" />
              )}
              <div className="glass rounded-2xl p-6 hover:border-brand-gold/20 transition-all h-full">
                <div className={`w-12 h-12 rounded-xl bg-${step.color}/10 flex items-center justify-center mb-4`}>
                  <step.icon className={`w-6 h-6 text-${step.color}`} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold text-gray-500">الخطوة {step.num}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BOOK PREVIEW — Show the product (what's inside)
   ═══════════════════════════════════════════════════════════════ */

function BookPreviewSection() {
  return (
    <section id="products-section" className="section-padding bg-surface-1 border-y border-brand-white/5" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-brand-purple-light text-xs font-bold uppercase tracking-widest mb-3 block">ماذا ستحصل</span>
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
            حزمة شاملة تحوّل مهارتك إلى مصدر دخل حقيقي
          </h2>
        </div>

        {/* Main Product Card */}
        <div className="glass rounded-3xl overflow-hidden mb-8">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Side */}
            <div className="bg-gradient-to-br from-brand-blue/40 to-brand-black p-8 flex items-center justify-center min-h-[350px] relative">
              <div className="relative w-full h-full min-h-[250px] shadow-2xl rounded-xl overflow-hidden">
                <Image
                  src="/images/book-interior.png"
                  alt="من داخل كتاب بدون التسويق — محتوى عملي مع قوالب وخرائط تنفيذ"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            {/* Content Side */}
            <div className="p-8 lg:p-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-1.5 bg-brand-gold/10 border border-brand-gold/20 rounded-full px-3 py-1 mb-4 w-fit">
                <Gift className="w-3 h-3 text-brand-gold" />
                <span className="text-[10px] font-bold text-brand-gold">كتابان بسعر كتاب واحد</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-4">
                كتاب "بدون التسويق… كارثة تهدد ثروتك المستقبلية"
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                دليل عملي متكامل من 6 فصول يأخذك من فهم عقلية المشتري إلى بناء نظام مبيعات مؤتمت بالكامل. مع تمارين تفاعلية وقوالب جاهزة في كل فصل.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  'فهم سلوك المشترين ذوي الدخل المرتفع وكيفية جذبهم',
                  'صياغة العرض الذي لا يُرفض (Irresistible Offer)',
                  'بناء قمع المبيعات (Sales Funnel) خطوة بخطوة',
                  'أسرار المحتوى التسويقي التحويلي',
                  'تمارين عملية تفاعلية لكل فصل',
                  'قوالب جاهزة للتطبيق الفوري',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bonus Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: BookOpen,
              title: 'كتاب هدية مجانية',
              desc: '"10 مبادئ للنجاح المالي والشخصي" — بقلم جاسم محمد',
              value: '$29',
            },
            {
              icon: Lightbulb,
              title: 'نظام تعليمي متكامل',
              desc: '9 وحدات تعليمية + قوالب + أدوات احترافية جاهزة',
              value: '$99',
            },
            {
              icon: MessageSquare,
              title: 'استشارة فردية مباشرة',
              desc: 'جلسة خاصة مع المؤسس لتحليل مسارك وتعديل استراتيجيتك',
              value: '$150',
            },
          ].map((bonus, i) => (
            <div key={i} className="glass rounded-2xl p-5 hover:border-brand-gold/20 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center">
                  <bonus.icon className="w-5 h-5 text-brand-purple-light" />
                </div>
                <span className="text-[10px] font-mono font-bold text-gray-500 line-through">قيمتها {bonus.value}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{bonus.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{bonus.desc}</p>
            </div>
          ))}
        </div>

        {/* Platform Preview */}
        <div className="mt-12 glass rounded-3xl overflow-hidden">
          <div className="p-6 pb-0 text-center">
            <h3 className="text-lg font-bold text-white mb-2">النظام التعليمي المرفق</h3>
            <p className="text-sm text-gray-400 mb-6">نظام رقمي متكامل بواجهة عربية يحتوي على 9 وحدات تعليمية وأدوات تطبيقية</p>
          </div>
          <div className="relative w-full aspect-video">
            <Image
              src="/images/platform-screenshot.png"
              alt="لقطة من النظام التعليمي — أكاديمية التسويق المتكاملة"
              fill
              className="w-full rounded-t-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRICING TABLE — 3 Tiers
   ═══════════════════════════════════════════════════════════════ */

function PricingSection() {
  const plans = [
    {
      name: 'الكتاب الرقمي',
      subtitle: 'للراغبين في البداية',
      price: 29,
      originalPrice: 99,
      features: [
        'كتاب "بدون التسويق" — نسخة PDF',
        'التمارين التفاعلية لكل فصل',
        'تحديثات مجانية مدى الحياة',
      ],
      notIncluded: [
        'كتاب الهدية',
        'النظام التعليمي',
        'القوالب الجاهزة',
        'الاستشارة الفردية',
      ],
      cta: 'ابدأ بالكتاب',
      popular: false,
    },
    {
      name: 'الحزمة الشاملة',
      subtitle: 'الأكثر مبيعاً',
      price: 49,
      originalPrice: 199,
      features: [
        'كتاب "بدون التسويق" — نسخة PDF',
        'كتاب الهدية "10 مبادئ النجاح"',
        'النظام التعليمي الكامل (9 وحدات)',
        'القوالب والأدوات الجاهزة',
        'تحديثات مجانية مدى الحياة',
        'الوصول لمجتمع BLACK4ME',
      ],
      notIncluded: [
        'الاستشارة الفردية المباشرة',
      ],
      cta: 'احصل على الحزمة — $49',
      popular: true,
    },
    {
      name: 'الحزمة + استشارة',
      subtitle: 'للجادين في التغيير',
      price: 149,
      originalPrice: 399,
      features: [
        'كل محتويات الحزمة الشاملة',
        'جلسة استشارة فردية (60 دقيقة)',
        'تحليل شخصي لمشروعك',
        'خريطة طريق مخصصة',
        'متابعة بريدية لمدة 30 يوم',
        'أولوية في الدعم',
      ],
      notIncluded: [],
      cta: 'احجز الحزمة المتقدمة',
      popular: false,
    },
  ];

  return (
    <section id="pricing-section" className="section-padding bg-brand-black" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-3 block">العرض والأسعار</span>
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
            اختر الخطة المناسبة لبدايتك
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            جميع الخطط تأتي مع ضمان استرداد كامل خلال 7 أيام. لا مخاطرة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-3xl p-6 flex flex-col ${
                plan.popular
                  ? 'glass-gold border-brand-gold/30 border-2 shadow-[0_0_40px_rgba(245,197,66,0.08)]'
                  : 'glass'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-black text-[11px] font-black px-4 py-1 rounded-full">
                  الأكثر مبيعاً ⭐
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-400">{plan.subtitle}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">${plan.price}</span>
                  <span className="text-sm text-gray-500 line-through">${plan.originalPrice}</span>
                </div>
                <span className="text-xs text-brand-green font-bold">وفّر {Math.round((1 - plan.price / plan.originalPrice) * 100)}%</span>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
                {plan.notIncluded.map((f, j) => (
                  <li key={`not-${j}`} className="flex items-start gap-2 text-sm text-gray-600">
                    <X className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/checkout${plan.name === 'الحزمة + استشارة' ? '?mode=consultation' : ''}`}
                className={`w-full py-3.5 rounded-xl text-center font-bold text-sm transition-all block ${
                  plan.popular
                    ? 'cta-glow bg-brand-gold text-brand-black hover:bg-yellow-400'
                    : 'bg-brand-white/5 text-white hover:bg-brand-white/10 border border-brand-white/10'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TESTIMONIALS — Social Proof
   ═══════════════════════════════════════════════════════════════ */

function TestimonialsSection() {
  const { testimonials } = useApp();

  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    { id: '1', customerName: 'فيصل الشمري', country: 'السعودية', rating: 5, comment: 'قرأت مئات الكتب في التسويق لكن هذا الكتاب يقدم خريطة عملية مبنية للسوق الخليجي. خلال 45 يوم بدأت أستقبل عملاء من نظام الفنل بشكل يومي.', isApproved: true, createdAt: '' },
    { id: '2', customerName: 'مريم الصايغ', country: 'الإمارات', rating: 5, comment: 'محتوى استثنائي ومرتب بعناية. النظام التعليمي المرفق وفّر عليّ شهور من التعلم العشوائي. أنصح بشدة لكل صاحب مشروع صغير.', isApproved: true, createdAt: '' },
    { id: '3', customerName: 'عبدالرحمن الكواري', country: 'قطر', rating: 5, comment: 'الكتاب فتح عيني على ثغرات خطيرة في عملي. جلسة الاستشارة مع جاسم كانت نقطة تحول حقيقية. دخلي تضاعف 3 مرات في 90 يوم.', isApproved: true, createdAt: '' },
  ];

  return (
    <section id="testimonials-section" className="section-padding bg-surface-1 border-y border-brand-white/5" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-3 block">آراء العملاء</span>
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
            نتائج حقيقية من عملاء حقيقيين
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayTestimonials.slice(0, 3).map((t) => (
            <div key={t.id} className="glass rounded-2xl p-6 hover:border-brand-gold/15 transition-all">
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-brand-gold fill-brand-gold" />
                ))}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed mb-6 min-h-[80px]">
                "{t.comment}"
              </p>
              <div className="flex items-center gap-3 border-t border-brand-white/5 pt-4">
                <div className="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center text-sm font-bold text-brand-purple-light">
                  {t.customerName.charAt(0)}
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">{t.customerName}</span>
                  <span className="text-xs text-gray-500">{t.country}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GUARANTEE SECTION
   ═══════════════════════════════════════════════════════════════ */

function GuaranteeSection() {
  return (
    <section className="section-padding bg-brand-black" dir="rtl">
      <div className="max-w-3xl mx-auto text-center">
        <div className="glass-gold rounded-3xl p-8 md:p-12">
          <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-brand-gold" />
          </div>
          <h2 className="text-xl md:text-3xl font-black text-white mb-4">
            ضمان استرداد كامل — بدون أي شروط معقدة
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6 max-w-xl mx-auto">
            إذا اشتريت الحزمة ولم تجد فيها قيمة حقيقية خلال 7 أيام، أرسل لنا بريد إلكتروني واحد وسنُعيد لك كامل المبلغ فوراً — بدون أسئلة وبدون إجراءات معقدة. <strong className="text-white">نحن واثقون من جودة المحتوى.</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-brand-green" /> استرداد كامل 100%</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-brand-green" /> خلال 7 أيام</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-brand-green" /> بدون أسئلة</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-brand-green" /> بريد إلكتروني واحد</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FAQ SECTION — With FAQ Schema
   ═══════════════════════════════════════════════════════════════ */

function FAQSection() {
  const { faqs: dbFaqs } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = dbFaqs.length > 0 ? dbFaqs : [
    { id: '1', question: 'ماذا سأحصل عليه بالضبط عند الشراء؟', answer: 'ستحصل على وصول فوري ودائم لكتاب "بدون التسويق" بصيغة PDF، كتاب الهدية "10 مبادئ"، النظام التعليمي الرقمي (9 وحدات)، القوالب والأدوات الجاهزة، وجميع التحديثات المستقبلية مجاناً.', orderIndex: 1 },
    { id: '2', question: 'هل هذا مناسب للمبتدئين تماماً؟', answer: 'نعم 100%. الكتاب والنظام مصمم للأشخاص الذين لا يملكون أي خبرة تسويقية. ستجد شرح مبسط وخطوات واضحة مع تمارين عملية تطبقها مباشرة على مشروعك.', orderIndex: 2 },
    { id: '3', question: 'ما طرق الدفع المتاحة؟', answer: 'نقبل جميع البطاقات الدولية (Visa, Mastercard, Amex) عبر Stripe، وPayPal، بالإضافة إلى التحويل البنكي المحلي لعدة دول عربية (السعودية، عمان، الجزائر، الأردن، السودان).', orderIndex: 3 },
    { id: '4', question: 'كيف يعمل ضمان الاسترداد؟', answer: 'إذا لم تكن راضياً عن المحتوى خلال 7 أيام من الشراء، أرسل بريد إلكتروني إلى info@black4me.com وسنعيد لك كامل المبلغ فوراً بدون أي أسئلة.', orderIndex: 4 },
    { id: '5', question: 'كيف أصل للمحتوى بعد الشراء؟', answer: 'بمجرد إتمام الدفع، ستُوجَّه تلقائياً لصفحة التحميل. كما ستتلقى بريد إلكتروني يحتوي على روابط التنزيل وبيانات الدخول للنظام التعليمي.', orderIndex: 5 },
    { id: '6', question: 'هل يوجد دعم بعد الشراء؟', answer: 'نعم! جميع المشترين يحصلون على دعم عبر البريد الإلكتروني. مشتري الحزمة المتقدمة يحصلون على دعم أولوية ومتابعة لمدة 30 يوم مع المؤسس شخصياً.', orderIndex: 6 },
  ];

  // FAQ Schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section id="faq-section" className="section-padding bg-surface-1 border-y border-brand-white/5" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-brand-purple-light text-xs font-bold uppercase tracking-widest mb-3 block">أسئلة شائعة</span>
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
            عندك سؤال؟ عندنا الإجابة
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.id}
              className="glass rounded-xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-right cursor-pointer"
                aria-expanded={openIndex === i}
              >
                <span className="text-sm font-bold text-white flex-1">{faq.question}</span>
                {openIndex === i ? (
                  <ChevronUp className="w-5 h-5 text-brand-gold flex-shrink-0 mr-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 mr-4" />
                )}
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 border-t border-brand-white/5">
                  <p className="text-sm text-gray-400 leading-relaxed pt-4">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONSULTATION SECTION
   ═══════════════════════════════════════════════════════════════ */

function ConsultationSection() {
  return (
    <section id="consultations-section" className="section-padding bg-brand-black" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-3 block">للجادين فقط</span>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
              استشارة استراتيجية فردية مع جاسم محمد
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              جلسة مباشرة مدتها 60 دقيقة نحلل فيها مسار عملك التسويقي بالكامل، نحدد الثغرات، ونبني لك خريطة طريق مخصصة للنمو. تشمل متابعة بريدية لمدة 30 يوم بعد الجلسة.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'تحليل شامل لوضعك التسويقي الحالي',
                'بناء خريطة طريق مخصصة لمشروعك',
                'تحديد أولويات التنفيذ والميزانية',
                'متابعة ودعم لمدة 30 يوم',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/checkout?mode=consultation"
              className="inline-flex items-center gap-2 bg-brand-purple hover:bg-brand-purple-light text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-brand-purple/20"
            >
              <span>احجز استشارتك — $149</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
          <div className="glass rounded-3xl p-8 text-center">
            <div className="w-20 h-20 bg-brand-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-10 h-10 text-brand-gold" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">جلسة 1-على-1</h3>
            <p className="text-sm text-gray-400 mb-4">مع المؤسس جاسم محمد شخصياً</p>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-3xl font-black text-white">$149</span>
              <span className="text-sm text-gray-500 line-through">$399</span>
            </div>
            <span className="text-xs text-brand-green font-bold">متضمنة في الحزمة المتقدمة</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NEWSLETTER SECTION
   ═══════════════════════════════════════════════════════════════ */

function NewsletterSection() {
  const { subscribeNewsletter } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    const result = await subscribeNewsletter(name, email, '');
    setStatus({ type: result.success ? 'success' : 'error', message: result.message });
    if (result.success) { setName(''); setEmail(''); }
  };

  return (
    <section className="section-padding bg-surface-1 border-t border-brand-white/5" dir="rtl">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-black text-white mb-3">
          انضم لنشرتنا التسويقية المجانية
        </h2>
        <p className="text-sm text-gray-400 mb-8">
          نصائح تسويقية أسبوعية، قوالب مجانية، وعروض حصرية مباشرة في بريدك.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسمك"
            required
            className="flex-1 bg-brand-black border border-brand-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple text-sm"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="بريدك الإلكتروني"
            required
            dir="ltr"
            className="flex-1 bg-brand-black border border-brand-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple text-sm text-left"
          />
          <button
            type="submit"
            className="bg-brand-gold hover:bg-yellow-400 text-brand-black font-bold py-3 px-6 rounded-xl transition-all text-sm flex-shrink-0"
          >
            اشترك مجاناً
          </button>
        </form>

        {status.type && (
          <p className={`mt-4 text-sm ${status.type === 'success' ? 'text-brand-green' : 'text-brand-red'}`}>
            {status.message}
          </p>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STICKY MOBILE CTA
   ═══════════════════════════════════════════════════════════════ */

function StickyMobileCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="sticky-cta lg:hidden">
      <Link
        href="/checkout"
        className="cta-glow bg-brand-gold hover:bg-yellow-400 text-brand-black font-black py-3 px-6 rounded-xl text-sm text-center block"
      >
        احصل على الحزمة الشاملة — $49
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FINAL CTA
   ═══════════════════════════════════════════════════════════════ */

function FinalCTA() {
  return (
    <section className="section-padding bg-gradient-to-b from-brand-black to-surface-1" dir="rtl">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
          جاهز تبني نظامك التسويقي؟
        </h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          لا تنتظر أكثر. كل يوم بدون نظام تسويقي = فرص ضائعة وعملاء يذهبون لمنافسيك.
        </p>
        <Link
          href="/checkout"
          className="cta-glow inline-flex items-center gap-2 bg-brand-gold hover:bg-yellow-400 text-brand-black font-black py-4 px-10 rounded-2xl text-lg transition-all"
        >
          <span>ابدأ الآن — $49 فقط</span>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <p className="text-xs text-gray-500 mt-4">ضمان استرداد كامل خلال 7 أيام • دفع آمن عبر Stripe & PayPal</p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE — Main Export
   ═══════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  // Product Schema (JSON-LD)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "بدون التسويق كارثة",
    "image": [
      "https://www.black4me.com/images/book-cover.png"
    ],
    "description": "دليل عملي لبناء نظام تسويق رقمي متكامل وتحويل المهارات إلى أرباح.",
    "brand": {
      "@type": "Brand",
      "name": "BLACK4ME"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://www.black4me.com",
      "priceCurrency": "USD",
      "price": "49.00",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      
      {/* Trust Banner */}
      <div className="bg-gradient-to-l from-brand-purple to-brand-purple/90 text-white text-center py-2.5 text-xs font-bold sticky top-[64px] z-40 flex items-center justify-center gap-1.5 px-4" dir="rtl">
        <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
        <span>🔥 عرض محدود: الحزمة الشاملة بـ $49 بدلاً من $199 — وفّر 75% اليوم!</span>
      </div>

      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <BookPreviewSection />
      <PricingSection />
      <TestimonialsSection />
      <GuaranteeSection />
      <FAQSection />
      <ConsultationSection />
      <FinalCTA />
      <NewsletterSection />
      <StickyMobileCTA />
    </>
  );
}

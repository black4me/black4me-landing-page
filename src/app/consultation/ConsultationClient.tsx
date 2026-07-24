"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { 
  Target, TrendingUp, Lightbulb, CheckCircle2, ShieldCheck, 
  Clock, Video, Users, ChevronDown, Check, Star 
} from 'lucide-react';

import Cal, { getCalApi } from "@calcom/embed-react";

export default function ConsultationClient({ initialReviews = [] }: { initialReviews?: any[] }) {
  const [mounted, setMounted] = useState(false);
  const [reviews, setReviews] = useState(initialReviews);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  useEffect(() => {
    setMounted(true);
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        "styles": {
          "branding": {
            "brandColor": "#f59e0b"
          }
        },
        "hideEventTypeDetails": false,
        "layout": "month_view"
      });

      // Track Cal.com booking interactions
      cal("on", {
        action: "*",
        callback: (e: any) => {
          const actionName = e.detail?.action;
          import('@/lib/tracking').then(tracking => {
            tracking.trackEvent('CalendarInteracted', {
              action: actionName,
              service_name: 'جلسة استشارة شخصية'
            });
            if (actionName === 'bookingSuccessful') {
              tracking.trackEvent('Purchase', {
                service_name: 'جلسة استشارة شخصية',
                value: 0,
                currency: 'USD'
              });
            }
          });
        }
      });
    })();
  }, []);

  useEffect(() => {
    import('@/lib/tracking').then(tracking => {
      tracking.trackEvent('ProductViewed', {
        content_name: 'جلسة استشارة شخصية',
        content_type: 'service',
        value: 0,
        currency: 'USD'
      });

      const timers = [
        setTimeout(() => {
          tracking.trackEvent('TimeSpentOnPage', { service_name: 'جلسة استشارة شخصية', seconds: 30 });
        }, 30000),
        setTimeout(() => {
          tracking.trackEvent('TimeSpentOnPage', { service_name: 'جلسة استشارة شخصية', seconds: 60 });
        }, 60000),
        setTimeout(() => {
          tracking.trackEvent('TimeSpentOnPage', { service_name: 'جلسة استشارة شخصية', seconds: 180 });
        }, 180000)
      ];

      const handleMouseOut = (e: MouseEvent) => {
        if (e.clientY < 50) {
          tracking.trackEvent('ExitIntentDetected', { service_name: 'جلسة استشارة شخصية' });
          document.removeEventListener('mouseout', handleMouseOut);
        }
      };
      document.addEventListener('mouseout', handleMouseOut);

      return () => {
        timers.forEach(t => clearTimeout(t));
        document.removeEventListener('mouseout', handleMouseOut);
      };
    });
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const handleBookingStartClick = () => {
    import('@/lib/tracking').then(tracking => {
      tracking.trackEvent('ConsultationBookingStarted', {
        service_name: 'جلسة استشارة شخصية'
      });
    });
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const roadmapSteps = [
    {
      title: "التشخيص العميق",
      desc: "تحليل وضع مشروعك الحالي واكتشاف نقاط التسرب في المبيعات.",
      icon: <Target className="w-6 h-6 text-amber-500" />
    },
    {
      title: "كشف المنافسين",
      desc: "تحليل استراتيجيات منافسيك واقتناص الفرص البيعية غير المستغلة.",
      icon: <Lightbulb className="w-6 h-6 text-amber-500" />
    },
    {
      title: "خارطة الطريق",
      desc: "بناء خطة تسويقية محددة الخطوات وقابلة للتطبيق فوراً.",
      icon: <TrendingUp className="w-6 h-6 text-amber-500" />
    },
    {
      title: "النتائج الملموسة",
      desc: "زيادة في المبيعات، تقليل تكلفة الاستحواذ، ونمو مستدام.",
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />
    }
  ];

  if (!mounted) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0a0a] text-white selection:bg-amber-500/30 overflow-hidden font-sans">
      
      {/* 3D Background Element */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-[120px] pointer-events-none"
        />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeIn}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#111] border border-amber-500/30 text-amber-400 text-sm font-medium mb-10 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            متاح الآن للحجز الفوري
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[1.2]"
            style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
          >
            استشارة تسويقية <br className="md:hidden" />مع <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-200 via-amber-400 to-amber-600 drop-shadow-lg">الأستاذ جاسم</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-2xl text-zinc-400 mb-12 leading-relaxed max-w-3xl mx-auto"
          >
            خارطة طريق دقيقة لزيادة مبيعاتك وتخطي منافسيك في <strong className="text-white">ساعة واحدة فقط</strong>.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-16"
          >
            <div className="flex items-center gap-2 bg-[#111] border border-white/5 px-4 py-2 rounded-xl">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-zinc-300">المدة: 60 دقيقة</span>
            </div>
            <div className="flex items-center gap-2 bg-[#111] border border-white/5 px-4 py-2 rounded-xl">
              <Video className="w-5 h-5 text-amber-500" />
              <span className="text-zinc-300">اجتماع مرئي مباشر</span>
            </div>
            <div className="flex items-center gap-2 bg-[#111] border border-white/5 px-4 py-2 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <span className="text-zinc-300">سرية وخصوصية تامة</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col items-center justify-center gap-6"
          >
            <a 
              href="#booking-calendar" 
              onClick={handleBookingStartClick}
              className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-[#0a0a0a] bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] transform hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative z-10 flex items-center gap-2">
                احجز موعدك الآن
                <ChevronDown className="w-6 h-6 animate-bounce" />
              </span>
            </a>

            {/* Quiet Urgency Notice */}
            <div className="bg-[#0e0a05] border border-amber-500/10 rounded-xl p-3 text-xs md:text-sm text-amber-500/90 max-w-md mx-auto leading-relaxed font-bold">
              📢 الأوقات المتاحة محدودة لضمان جودة التحضير والتركيز لكل استشارة.
            </div>

            {/* Clickable Micro-Guarantee Label */}
            <a href="#guarantee-section" className="inline-flex items-center justify-center gap-2 text-xs text-zinc-400 hover:text-white transition w-fit mx-auto">
              🛡️ <span className="underline decoration-dotted">شراء مطمئن: ضمان استرداد القيمة 100% للجلسة الاستشارية (اضغط للتفاصيل).</span>
            </a>

            {/* Live Counter */}
            <div className="flex items-center gap-3 text-zinc-400 bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-sm">
              <Users className="w-5 h-5 text-amber-500" />
              <span>انضم إلى </span>
              <span className="text-xl font-bold text-white">
                +<CountUp end={450} duration={3} separator="," />
              </span>
              <span>مستفيد من الاستشارة</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3D Roadmap / Value Proposition */}
      <section className="py-24 px-6 lg:px-8 bg-[#111] relative z-10 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">خارطة الطريق نحو <span className="text-amber-500">النمو</span></h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">ما الذي سيحدث بالضبط في الـ 60 دقيقة؟</p>
          </div>
          
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#111] via-amber-500/30 to-[#111] -translate-y-1/2 z-0"></div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-4 gap-8 relative z-10"
            >
              {roadmapSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  variants={fadeIn}
                  className="bg-[#1a1a1a] border border-white/10 p-8 rounded-3xl relative group hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#111] border-2 border-amber-500 flex items-center justify-center text-xl font-bold text-amber-500 group-hover:bg-amber-500 group-hover:text-[#111] transition-colors duration-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                    {index + 1}
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-[#222] border border-white/5 flex items-center justify-center mb-6 mx-auto mt-4 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white text-center">{step.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-center text-sm">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Booking Calendar Section */}
      <section id="booking-calendar" className="py-24 px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">التقويم المباشر</h2>
            <p className="text-zinc-400 text-lg mb-2">اختر الوقت الأنسب لك. سيتم تحويل الأوقات إلى توقيتك المحلي تلقائياً.</p>
            <p className="text-amber-500 text-sm">إذا لم يعمل التقويم، <a href="https://cal.com/black4me" target="_blank" className="underline">اضغط هنا للحجز المباشر</a>.</p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-[2rem] p-2 md:p-4 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
          >
            <Cal 
              calLink="black4me"
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
              config={{ layout: 'month_view', theme: 'light' }}
            />
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      {reviews && reviews.length > 0 && (
        <section className="py-24 px-6 lg:px-8 bg-[#111] border-t border-white/5 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">شركاء النجاح</h2>
              <p className="text-zinc-400 text-lg">قصص نجاح واقعية من رواد أعمال حجزوا هذه الاستشارة.</p>
            </div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8"
            >
              {displayedReviews.map((review: any, index: number) => (
                <motion.div key={review.id || index} variants={fadeIn} className="bg-[#1a1a1a] p-10 rounded-3xl border border-white/5 relative group hover:border-amber-500/30 transition-colors">
                  <div className="absolute top-8 left-8 text-amber-500/20">
                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 32 32"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.456-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/></svg>
                  </div>
                  <div className="flex text-amber-500 mb-6 relative z-10">
                    {[...Array(review.rating || 5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-current" />)}
                  </div>
                  <p className="text-zinc-300 text-lg leading-relaxed mb-8 relative z-10 italic">
                    "{review.content}"
                  </p>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center font-bold text-xl text-[#111] shadow-lg">
                      {(review.user_name || 'ع').charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{review.user_name}</h4>
                      {review.user_title && <p className="text-zinc-500">{review.user_title}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {reviews.length > 3 && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold px-8 py-3 rounded-2xl transition"
                >
                  {showAllReviews ? 'إظهار أقل' : `عرض كافة الآراء (${reviews.length})`}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Guarantee Section */}
      <section id="guarantee-section" className="py-24 px-6 lg:px-8 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-amber-500/5 blur-[100px] pointer-events-none"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border border-white/10 p-12 rounded-[3rem] text-center shadow-2xl relative"
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full p-1 shadow-[0_0_30px_rgba(245,158,11,0.5)]">
              <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-amber-500" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-6 mt-6">ضمان القيمة والجدية 100%</h2>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto">
            نحن نقدر وقتك واستثمارك. إذا انتهيت من أول 15 دقيقة من الجلسة الاستشارية وشعرت أن الجلسة لم تقدم لك القيمة أو التحليل المطلوب لمشروعك، أخبر الأستاذ جاسم مباشرة وسنعيد لك كامل مبلغ الاستثمار فوراً دون أي تعقيد.
          </p>
        </motion.div>
      </section>
    </div>
  );
}

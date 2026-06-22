import React, { useState } from 'react';
import { AreaChart, Eye, Gem, CheckSquare, Sparkles, TrendingUp, Users } from 'lucide-react';

export default function GrowthChart() {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const chartMilestones = [
    {
      id: 0,
      label: "وضوح الرؤية التامة",
      desc: "تحديد هوية العميل المثالي بدقة وتفصيل رسالة المشروع من اليوم الأول لتجنب الضياع.",
      metric: "الأساس التأسيسي",
      icon: Eye,
      cx: 10,
      cy: 85
    },
    {
      id: 1,
      label: "مضاعفة قيمة عروضك",
      desc: "تصميم البرامج والخدمات لتكون من نوع High-Ticket التي تبيع بسعر يستحقه مجهودك.",
      metric: "ارتفاع الربحية لكل زائر",
      icon: Gem,
      cx: 30,
      cy: 65
    },
    {
      id: 2,
      label: "تحسين نسب التحويل",
      desc: "ترقية الفنل وإضافة الحوافز للتخلص الآمن من تسرب العملاء وتبسيط عملية الدفع للزوار.",
      metric: "أتمتة المبيعات وإزالة التعقيد",
      icon: CheckSquare,
      cx: 52,
      cy: 45
    },
    {
      id: 3,
      label: "نمو وتسارع المبيعات",
      desc: "شحن القمع بالجمهور الصحيح لتشهد زيادة فورية ثابتة في عدد الطلبات المكتملة.",
      metric: "تراكم الأرباح بشكل مستقر",
      icon: Sparkles,
      cx: 75,
      cy: 28
    },
    {
      id: 4,
      label: "توسع قاعدة العملاء الأوفياء",
      desc: "حيازة المرجعية القيادية في السوق وجني الأرباح السلبية والتنمية المتسارعة للعلامة التجارية.",
      metric: "الحرية التشغيلية والريادة",
      icon: Users,
      cx: 95,
      cy: 10
    }
  ];

  return (
    <section id="growth-chart-section" className="bg-brand-darkgray text-brand-white py-24 px-4 border-b border-brand-purple/10" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center space-y-4 mb-16">
          <span className="text-brand-gold font-bold text-xs uppercase tracking-widest px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-full">
            تراكمي وتصاعدي متسارع
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            مؤشر تسارع النمو الهيكلي بالأتمتة
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            مخطط اتجاه تصاعدي هندسي حقيقي (دون أرقام كاذبة مبنية على الوهم) يوضح الأثر التراكمي لخطوات نظام BLACK4ME على أرباحك وعملائك.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-center bg-brand-black p-6 sm:p-10 rounded-3xl border border-brand-white/5 shadow-2xl relative overflow-hidden">
          
          {/* Ambient Glow background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/5 to-transparent pointer-events-none" />

          {/* Interactive SVG Chart Stage */}
          <div className="lg:col-span-8 relative">
            <h3 className="text-sm font-bold text-gray-400 mb-6 text-right flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-gold" />
              <span>مخطط السيرورة التصاعدية لشكل الأرباح (اضغط أو مرر الماوس فوق النقاط)</span>
            </h3>

            {/* Custom Interactive SVG Canvas Container */}
            <div className="relative aspect-[16/9] w-full bg-brand-darkgray/60 rounded-2xl p-4 border border-brand-white/5 select-none overflow-hidden">
              
              {/* Backgrid lines */}
              <div className="absolute inset-0 grid grid-rows-5 grid-cols-5 opacity-10 pointer-events-none">
                {[...Array(25)].map((_, idx) => (
                  <div key={idx} className="border-t border-l border-white" />
                ))}
              </div>

              {/* Upward Line Visualization */}
              <svg 
                viewBox="0 0 100 100" 
                className="absolute inset-0 w-full h-full p-4 overflow-visible"
                preserveAspectRatio="none"
              >
                {/* Under Fill Area Color Gradient */}
                <defs>
                  <linearGradient id="chart-area-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6C3BFF" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#6C3BFF" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>

                {/* Filled Area */}
                <path 
                  d="M 10 95 L 10 85 L 30 65 L 52 45 L 75 28 L 95 10 L 95 95 Z" 
                  fill="url(#chart-area-glow)"
                  className="transition duration-500 ease-in-out"
                />

                {/* Trend Curve Bezier Path */}
                <path 
                  d="M 10 85 L 30 65 L 52 45 L 75 28 L 95 10" 
                  fill="none" 
                  stroke="#F5C542" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_8px_rgba(245,197,66,0.6)]"
                />

                {/* Connecting lines for hover tooltips */}
                {activeNode !== null && (
                  <line 
                    x1={chartMilestones[activeNode].cx} 
                    y1={chartMilestones[activeNode].cy} 
                    x2={chartMilestones[activeNode].cx} 
                    y2="92" 
                    stroke="#6C3BFF" 
                    strokeWidth="0.5" 
                    strokeDasharray="2,2" 
                  />
                )}

                {/* Grid Dot Markers */}
                {chartMilestones.map((node) => (
                  <g key={node.id}>
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={activeNode === node.id ? "5" : "3.5"} 
                      fill={activeNode === node.id ? "#F5C542" : "#6C3BFF"} 
                      stroke="#FFFFFF" 
                      strokeWidth="1.5"
                      className="cursor-pointer transition-all duration-300 hover:scale-150"
                      onClick={() => setActiveNode(node.id)}
                      onMouseEnter={() => setActiveNode(node.id)}
                    />
                  </g>
                ))}
              </svg>

              {/* Milestone Labels placed absolutely in percentage over layout */}
              <div className="absolute inset-0 px-4 py-8 pointer-events-none text-[8px] sm:text-[10px] md:text-xs">
                {chartMilestones.map((node) => (
                  <span 
                    key={node.id}
                    style={{
                      left: `${node.cx}%`,
                      top: `${node.cy + 5}%`,
                      transform: 'translateX(-50%)'
                    }}
                    className={`absolute font-bold text-center px-2 py-0.5 rounded transition ${
                      activeNode === node.id ? 'text-brand-gold bg-brand-black/95 shadow border border-brand-gold/30' : 'text-gray-500'
                    }`}
                  >
                    {node.label}
                  </span>
                ))}
              </div>

            </div>
          </div>

          {/* Left Column: Context Card explaining active Node or Trend */}
          <div className="lg:col-span-4 bg-brand-darkgray/90 border border-brand-white/5 rounded-2xl p-6 relative">
            
            {activeNode === null ? (
              <div className="text-right space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-gold mb-6 animate-pulse">
                  <AreaChart className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">تحليل منحنى النمو الهندسي</h4>
                <p className="text-sm text-gray-400 leading-relaxed font-semibold">
                  تحويل عملك من العشوائية يتطلب دقة وتدرجاً منطقياً. مرر الماوس فوق نقاط المخطط البياني على اليمين لتفهم تفاصيل تسارع العوائد والقيمة.
                </p>
                <button
                  onClick={() => setActiveNode(0)}
                  className="text-xs text-brand-gold font-bold bg-brand-gold/10 px-3 py-1.5 rounded border border-brand-gold/25 cursor-pointer hover:bg-brand-gold/20 transition"
                >
                  استكشف أول خطوة للنمو
                </button>
              </div>
            ) : (
              (() => {
                const node = chartMilestones[activeNode];
                const Icon = node.icon;
                return (
                  <div className="text-right space-y-4">
                    <div className="flex items-center gap-3 border-b border-brand-white/10 pb-4">
                      <div className="w-11 h-11 bg-brand-purple/30 text-brand-gold rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-brand-purple font-bold tracking-widest uppercase block">MILESTONE 0{node.id + 1}</span>
                        <h4 className="text-lg font-bold text-white leading-none mt-1">{node.label}</h4>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 uppercase inline-block">
                        {node.metric}
                      </span>
                      <p className="text-sm text-gray-300 leading-relaxed font-bold">
                        {node.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-brand-white/5 flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-mono">BLACK4ME Engine</span>
                      <button 
                        onClick={() => setActiveNode(activeNode === 4 ? 0 : activeNode + 1)}
                        className="text-brand-purple hover:text-white transition font-bold cursor-pointer"
                      >
                        الخطوة التالية ←
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
          </div>

        </div>

      </div>
    </section>
  );
}

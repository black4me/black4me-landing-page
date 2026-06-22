"use client";

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import CheckoutPage from './pages/CheckoutPage';
import ThankYouPage from './pages/ThankYouPage';
import AdminLogin from './pages/AdminLogin';
import { Sparkles, Menu, ShieldCheck } from 'lucide-react';

function AppContent() {
  const { currentUser, loginAs } = useApp();
  const [view, setView] = useState<'landing' | 'checkout' | 'thankyou' | 'admin_login'>('landing');

  return (
    <div className="min-h-screen bg-brand-black text-brand-white select-none selection:bg-brand-gold selection:text-brand-black font-sans">
      
      {/* Corporate Luxury Core Navbar */}
      <nav className="bg-brand-black/80 backdrop-blur-md border-b border-brand-white/10 py-4 px-6 md:px-12 sticky top-0 z-30" dir="rtl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Right Brand Logo & Founder */}
          <div className="flex items-center gap-2">
            <span 
              onDoubleClick={() => setView('admin_login')}
              className="w-10 h-10 rounded-xl bg-brand-gold text-brand-black font-black flex items-center justify-center font-mono hover:scale-105 transition shadow-lg shadow-brand-gold/10 text-sm cursor-pointer"
              title="BLACK4ME"
            >
              B4M
            </span>
            <div className="text-right">
              <span className="font-mono text-lg font-black tracking-widest leading-none block text-white">BLACK4ME</span>
              <span className="text-[9px] text-brand-gold font-medium block mt-0.5">JASIM MOHAMMED</span>
            </div>
          </div>

          {/* Center Links (Scrolling) */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-bold text-gray-400">
            <button onClick={() => { setView('landing'); setTimeout(() => { const el = document.getElementById('funnel-section'); if(el) el.scrollIntoView({behavior:'smooth'}); }, 100); }} className="hover:text-brand-gold transition cursor-pointer">مسارات العميل</button>
            <button onClick={() => { setView('landing'); setTimeout(() => { const el = document.getElementById('growth-chart-section'); if(el) el.scrollIntoView({behavior:'smooth'}); }, 100); }} className="hover:text-brand-gold transition cursor-pointer">مؤشر الأداء</button>
            <button onClick={() => { setView('landing'); setTimeout(() => { const el = document.getElementById('products-section'); if(el) el.scrollIntoView({behavior:'smooth'}); }, 100); }} className="hover:text-brand-gold transition cursor-pointer">محتويات الحزمة</button>
            <button onClick={() => { setView('landing'); setTimeout(() => { const el = document.getElementById('pricing-section'); if(el) el.scrollIntoView({behavior:'smooth'}); }, 100); }} className="hover:text-brand-gold transition cursor-pointer">العرض والسعر</button>
            <button onClick={() => { setView('landing'); setTimeout(() => { const el = document.getElementById('testimonials-section'); if(el) el.scrollIntoView({behavior:'smooth'}); }, 100); }} className="hover:text-brand-gold transition cursor-pointer">آراء العملاء</button>
            <button onClick={() => { setView('landing'); setTimeout(() => { const el = document.getElementById('faq-section'); if(el) el.scrollIntoView({behavior:'smooth'}); }, 100); }} className="hover:text-brand-gold transition cursor-pointer">الأسئلة الشائعة</button>
            <button onClick={() => { setView('landing'); setTimeout(() => { const el = document.getElementById('consultations-section'); if(el) el.scrollIntoView({behavior:'smooth'}); }, 100); }} className="hover:text-brand-gold transition cursor-pointer">حجز استشارة</button>
          </div>

          {/* Left quick actions Portal */}
          <div className="flex gap-2 items-center">
            
            <a
              href="/login"
              className="hidden md:flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white border border-brand-white/10 bg-brand-darkgray/90 hover:bg-brand-white/5 py-1.5 px-3 rounded-lg cursor-pointer transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
              <span>دخول العملاء والإدارة</span>
            </a>
            
            <button
              onClick={() => {
                if(view === 'landing') {
                  setView('checkout');
                } else {
                  setView('landing');
                }
              }}
              className="bg-brand-gold hover:bg-yellow-500 text-brand-black text-[11px] font-black py-2 px-4 rounded-xl shadow shadow-brand-gold/10 transition duration-300 transform hover:scale-[1.02] cursor-pointer"
            >
              {view === 'checkout' ? 'الرجوع ومراجعة المنصة' : 'امتلك العرض المحدود ($49)'}
            </button>
          </div>

        </div>
      </nav>

      {/* Main switch router rendering */}
      <div className="min-h-[calc(100vh-120px)] animate-fadeIn">
        {view === 'landing' && (
          <LandingPage onNavigateToCheckout={() => setView('checkout')} />
        )}
        
        {view === 'checkout' && (
          <CheckoutPage 
            onSuccess={() => setView('thankyou')}
            onCancel={() => setView('landing')}
          />
        )}
        
        {view === 'thankyou' && (
          <ThankYouPage 
            onBackToHome={() => setView('landing')}
            onNavigateToPortal={() => setView('landing')}
          />
        )}
        
        {view === 'admin_login' && (
          <AdminLogin 
            onBack={() => setView('landing')}
            onSuccess={() => {
              loginAs('admin');
              setView('admin');
            }}
          />
        )}

        {view === 'admin' && (
          <AdminDashboard />
        )}
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

import React from 'react';
import { useApp } from '../context/AppContext';
import { Monitor, CreditCard, CheckCircle, User, ShieldAlert } from 'lucide-react';

interface QuickSwitcherProps {
  currentView: 'landing' | 'checkout' | 'thankyou' | 'customer' | 'admin';
  setView: (view: 'landing' | 'checkout' | 'thankyou' | 'customer' | 'admin') => void;
}

export default function QuickSwitcher({ currentView, setView }: QuickSwitcherProps) {
  const { currentUser, loginAs } = useApp();

  return (
    <div className="bg-brand-black/90 backdrop-blur-md border-b border-brand-gold/20 text-white py-2 px-4 sticky top-0 z-50 flex flex-wrap items-center justify-between text-xs font-medium rtl" dir="rtl">
      <div className="flex items-center gap-3">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
        </span>
        <span className="text-gray-400">نظام BLACK4ME النشط</span>
        <span className="text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 font-mono text-[10px]">
          {currentUser ? (currentUser.role === 'admin' ? 'صلاحية: مسؤول النظام' : 'صلاحية: عميل مقتني للكتاب') : 'صلاحية: زائر'}
        </span>
      </div>

      <div className="flex items-center gap-1 md:gap-2 overflow-x-auto py-1">
        <button
          onClick={() => setView('landing')}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition duration-200 cursor-pointer ${
            currentView === 'landing' ? 'bg-brand-gold text-brand-black font-bold' : 'hover:bg-brand-white/10 text-gray-300'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>صفحة الهبوط</span>
        </button>

        <button
          onClick={() => setView('checkout')}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition duration-200 cursor-pointer ${
            currentView === 'checkout' ? 'bg-brand-gold text-brand-black font-bold' : 'hover:bg-brand-white/10 text-gray-300'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>منطقة الدفع ($49)</span>
        </button>

        <button
          onClick={() => setView('thankyou')}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition duration-200 cursor-pointer ${
            currentView === 'thankyou' ? 'bg-brand-gold text-brand-black font-bold' : 'hover:bg-brand-white/10 text-gray-300'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>صفحة الشكر والتنزيل</span>
        </button>

        <button
          onClick={() => {
            if (!currentUser || currentUser.role !== 'customer') {
              loginAs('customer', { name: 'عبدالله العتيبي', email: 'abdullah@example.com' });
            }
            setView('customer');
          }}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition duration-200 cursor-pointer ${
            currentView === 'customer' ? 'bg-brand-purple text-brand-white font-bold border border-brand-purple/50' : 'hover:bg-brand-white/10 text-gray-300'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>لوحة العميل {currentUser?.role === 'customer' && '✓'}</span>
        </button>

        <button
          onClick={() => {
            loginAs('admin');
            setView('admin');
          }}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition duration-150 cursor-pointer ${
            currentView === 'admin' ? 'bg-brand-red text-brand-white font-bold border border-brand-red/50 animate-pulse' : 'hover:bg-brand-white/15 text-gray-300'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-brand-gold" />
          <span>لوحة الإدارة الكاملة</span>
        </button>
      </div>
    </div>
  );
}

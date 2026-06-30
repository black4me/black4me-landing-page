"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import {
  LogOut, Users, DollarSign, ShoppingBag, ShieldCheck,
  BarChart3, Tag, Calendar, MessageSquare, HelpCircle,
  Settings, GitCompare, Layers, Ticket, Mail, CreditCard
} from 'lucide-react';
import { AppProvider } from '../../context/AppContext';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // Check auth
  useEffect(() => {
    const checkAuth = async () => {
      const { createBrowserClient } = await import('@supabase/ssr');
      const supabaseBrowser = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    const { createBrowserClient } = await import('@supabase/ssr');
    const supabaseBrowser = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabaseBrowser.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#6C3BFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: '/admin/stats', label: 'نظرة عامة', icon: BarChart3 },
    { id: '/admin/products', label: 'المنتجات', icon: Tag },
    { id: '/admin/orders', label: 'الطلبات', icon: ShoppingBag },
    { id: '/admin/consultations', label: 'الاستشارات', icon: Calendar },
    { id: '/admin/testimonials', label: 'الآراء', icon: MessageSquare },
    { id: '/admin/faq', label: 'الأسئلة الشائعة', icon: HelpCircle },
    { id: '/admin/subscribers', label: 'المشتركون', icon: Users },
    { id: '/admin/campaigns', label: 'التسويق البريدي', icon: Mail },
    { id: '/admin/site-settings', label: 'إعدادات الموقع والنصوص', icon: Settings },
    { id: '/admin/comparison', label: 'جدول المقارنة', icon: GitCompare },
    { id: '/admin/funnels', label: 'مراحل الفنل', icon: Layers },
    { id: '/admin/value-stack', label: 'الحزمة المضافة', icon: DollarSign },
    { id: '/admin/coupons', label: 'كوبونات الخصم', icon: Ticket },
    { id: '/admin/payment-gateways', label: 'بوابات الدفع', icon: CreditCard },
  ];

  return (
    <AppProvider>
      <div className="min-h-screen flex bg-[#050505] text-white font-sans relative" dir="rtl">
        {/* Background Decorative Gradients */}
        <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-[#6C3BFF]/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
        <div className="fixed bottom-0 left-1/4 w-[500px] h-[500px] bg-[#F5C542]/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

        {/* ─── Sidebar (Right) ─── */}
        <aside className="w-64 bg-[#0A0A0A]/90 backdrop-blur-xl border-l border-white/5 flex flex-col fixed inset-y-0 right-0 z-50">
          {/* Brand/Logo Area */}
          <div className="p-6 border-b border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6C3BFF]/30 to-[#F5C542]/20 border border-[#6C3BFF]/40 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#F5C542]" />
              </div>
              <div>
                <h1 className="text-base font-black text-white tracking-tight leading-tight">
                  BLACK4ME <span className="opacity-40 font-light block text-sm">HQ</span>
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-[#6C3BFF] font-mono uppercase tracking-widest">Super Admin</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = pathname === tab.id || (pathname === '/admin' && tab.id === '/admin/stats');
              return (
                <Link
                  key={tab.id}
                  href={tab.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                    ${isActive 
                      ? 'bg-[#6C3BFF]/10 text-[#6C3BFF] border border-[#6C3BFF]/20 shadow-inner' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                    }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#F5C542]' : 'opacity-70'}`} />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-white/5 flex flex-col gap-2">
            <Link href="/" className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-white border border-white/5 hover:bg-white/5 px-4 py-3 rounded-xl transition w-full">
              الموقع الرئيسي
            </Link>
            <button onClick={handleLogout} className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-red-500/5 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/20 px-4 py-3 rounded-xl transition w-full">
              <LogOut className="w-4 h-4" />
              خروج
            </button>
          </div>
        </aside>

        {/* ─── Main Content (Left) ─── */}
        <main className="flex-1 mr-64 min-h-screen p-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AppProvider>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import {
  LogOut, Users, DollarSign, ShoppingBag, ShieldCheck,
  BarChart3, Tag, Calendar, MessageSquare, HelpCircle,
  Settings, GitCompare, Layers, Ticket, Mail, Gift,
  Search, Bell, Grid, ChevronLeft, UserCircle2, ChevronRight,
  BookOpen
} from 'lucide-react';
import { AppProvider } from '../../context/AppContext';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(1);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login');
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d10] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#ceae88] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: '/admin/stats', label: 'نظرة عامة', icon: BarChart3 },
    { id: '/admin/products', label: 'المنتجات', icon: Tag },
    { id: '/admin/categories', label: 'التصنيفات', icon: Layers },
    { id: '/admin/orders', label: 'الطلبات', icon: ShoppingBag },
    { id: '/admin/consultations', label: 'الاستشارات', icon: Calendar },
    { id: '/admin/subscribers', label: 'المشتركون', icon: Users },
    { id: '/admin/lead-magnet', label: 'الهدية المجانية', icon: Gift },
    { id: '/admin/crm/offers', label: 'العروض والهدايا', icon: Tag },
    { id: '/admin/testimonials', label: 'المراجعات', icon: MessageSquare },
    { id: '/admin/content', label: 'المحتوى', icon: BookOpen },
    { id: '/admin/campaigns', label: 'إعدادات التسويق', icon: Mail },
    { id: '/admin/coupons', label: 'إعدادات الكوبونات', icon: Ticket },
    { id: '/admin/pages', label: 'تصميم الصفحات', icon: GitCompare },
    { id: '/admin/blog', label: 'المدونة', icon: BookOpen },
    { id: '/admin/authors', label: 'الكتّاب', icon: Users },
    { id: '/admin/moderation', label: 'الإشراف', icon: ShieldCheck },
    { id: '/admin/payment-gateways', label: 'طرق الدفع', icon: DollarSign },
    { id: '/admin/shipping', label: 'طرق الشحن', icon: Tag },
    { id: '/admin/site-settings', label: 'إعدادات النظام', icon: Settings },
  ];

  return (
    <AppProvider>
      <div className="flex h-screen overflow-hidden bg-[#0a0a0c] text-gray-300 font-sans" dir="rtl">
        
        {/* ─── Right Sidebar ─── */}
        <aside className="w-[260px] bg-[#111114] border-l border-white/5 flex flex-col shrink-0 shadow-2xl relative z-20">
          {/* Logo */}
          <div className="p-6 pb-2 flex items-center justify-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#ceae88]" />
            <h1 className="text-xl font-black text-[#ceae88] tracking-widest uppercase">
              BLACK4ME <span className="font-light">HQ</span>
            </h1>
          </div>

          {/* User Profile */}
          <div className="px-6 py-4 flex flex-col items-center border-b border-white/5">
            <p className="text-sm font-semibold text-white mb-1">Profile</p>
            <div className="px-3 py-0.5 rounded-full bg-[#ceae88]/10 border border-[#ceae88]/20 text-[#ceae88] text-[10px] font-bold uppercase tracking-wider mb-3">
              Super Admin
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 relative bg-[#1a1a1d]">
              <img src="/images/author-jasim.jpg" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = pathname === tab.id || (pathname === '/admin' && tab.id === '/admin/stats');
              return (
                <Link
                  key={tab.id}
                  href={tab.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-white/5 text-[#ceae88] font-bold border-r-2 border-[#ceae88]' 
                      : 'text-gray-400 font-medium hover:text-white hover:bg-white/5 border-r-2 border-transparent'
                    }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#ceae88]' : 'text-gray-500'}`} />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center justify-between px-3 py-2 text-gray-400 hover:text-white cursor-pointer rounded-lg hover:bg-white/5 transition mb-2">
              <div className="flex items-center gap-3 text-sm">
                <Users className="w-4 h-4" />
                <span>عناصر</span>
              </div>
              <ChevronLeft className="w-4 h-4 opacity-50" />
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-lg transition border border-white/5 hover:border-white/10">
              <LogOut className="w-4 h-4" />
              تسجيل خروج
            </button>
          </div>
        </aside>

        {/* ─── Main Content (Center) ─── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0d0d10] relative z-10">
          
          {/* Top Navbar */}
          <header className="h-[72px] border-b border-white/5 px-8 flex items-center justify-between bg-[#111114]/80 backdrop-blur-md sticky top-0 z-30">
            {/* Search */}
            <div className="relative w-72">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500" />
              </div>
              <input 
                type="text" 
                placeholder="نظرة عامة" 
                className="w-full bg-[#1a1a1d] border border-white/5 text-gray-300 text-sm rounded-lg focus:ring-1 focus:ring-[#ceae88] focus:border-[#ceae88] block pr-10 p-2.5 placeholder-gray-600 outline-none transition"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-4 relative">
              <button className="text-gray-400 hover:text-white transition">
                <Grid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-400 hover:text-white transition relative"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#111114]">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute left-0 top-10 w-80 bg-[#161b22] border border-gray-800 rounded-2xl shadow-2xl p-4 space-y-3 z-50 text-right animate-fadeIn" dir="rtl">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                    <span className="text-xs font-bold text-white">التنبيهات الأخيرة</span>
                    {notificationCount > 0 && (
                      <button 
                        onClick={() => setNotificationCount(0)}
                        className="text-[10px] text-brand-gold hover:underline"
                      >
                        تحديد كقروء
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notificationCount > 0 ? (
                      <div className="flex items-start gap-3 p-2 bg-[#1f242c] rounded-lg">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-gold mt-1.5 shrink-0 animate-pulse" />
                        <div>
                          <p className="text-xs text-white font-bold">تفعيل مسارات الأتمتة</p>
                          <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">تم ربط أتمتة مراجعة الكتب وجلسات Cal.com بنجاح بالمتجر.</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 text-center py-4">لا توجد تنبيهات جديدة</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 custom-scrollbar">
            {children}
          </main>
        </div>

        {/* ─── Left Assistant Panel ─── */}
        <aside className="w-[280px] bg-[#111114] border-r border-white/5 flex flex-col shrink-0 p-6 shadow-2xl relative z-20 hidden lg:flex">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-white tracking-wide">Assistant</h2>
            <button className="text-gray-500 hover:text-white transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="bg-[#1a1a1d] rounded-2xl p-5 border border-white/5 relative overflow-hidden group hover:border-white/10 transition cursor-pointer">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#ceae88]/5 rounded-full blur-2xl group-hover:bg-[#ceae88]/10 transition" />
            <h3 className="text-sm font-bold text-white mb-2 relative z-10">أنظمة الأتمتة والـ CRM</h3>
            <div className="text-xs text-gray-400 space-y-2 relative z-10 text-right" dir="rtl">
              <div className="flex items-center gap-1.5 text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                <span>أتمتة مراجعة الكتب: نشطة ✅</span>
              </div>
              <div className="flex items-center gap-1.5 text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                <span>أتمتة الاستشارات: نشطة ✅</span>
              </div>
              <div className="flex items-center gap-1.5 text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                <span>أتمتة انستقرام ManyChat: نشطة ✅</span>
              </div>
              <p className="text-[10px] text-gray-500 pt-1.5 border-t border-white/5 leading-relaxed">
                تكاملات Resend و Supabase تعمل بالكامل في الوضع الحي.
              </p>
            </div>
          </div>
        </aside>

      </div>
    </AppProvider>
  );
}


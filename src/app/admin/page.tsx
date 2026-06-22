"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import {
  LogOut, Users, DollarSign, ShoppingBag, ShieldCheck,
  TrendingUp, RefreshCw, BarChart3, Filter, CheckCircle2,
  Tag, ClipboardList, Calendar, MessageSquare, HelpCircle,
  Plus, Edit2, Trash2, Search, Download, XCircle, Star,
  ChevronDown, ChevronUp, Eye, EyeOff, Save, X
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Order {
  id: string;
  customer_email: string;
  product_id: string;
  amount: number;
  payment_gateway: string;
  status: string;
  created_at: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  sale_price?: number;
  file_url?: string;
  payment_link?: string;
  is_active: boolean;
  created_at: string;
}

interface Consultation {
  id: string;
  customer_name: string;
  customer_email: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes?: string;
  created_at: string;
}

interface Testimonial {
  id: string;
  customer_name: string;
  country: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

interface Subscriber {
  id: string;
  name: string;
  email: string;
  country: string;
  created_at: string;
}

type Tab = 'stats' | 'products' | 'orders' | 'consultations' | 'testimonials' | 'faqs' | 'subscribers';

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  // UI states
  const [searchQuery, setSearchQuery] = useState('');

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ title: '', description: '', price: 49, sale_price: 0, file_url: '', payment_link: '', is_active: true });

  // FAQ form
  const [showFAQForm, setShowFAQForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', order_index: 1 });

  // ─── Data fetching ──────────────────────────────────────────────────────────

  const fetchAllData = useCallback(async () => {
    setRefreshing(true);

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.email !== 'info@black4me.com') {
      router.push('/login');
      return;
    }

    // Fetch all tables in parallel
    const [ordersRes, productsRes, consultRes, testimonRes, faqsRes, subsRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('consultations').select('*').order('created_at', { ascending: false }),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
      supabase.from('faqs').select('*').order('order_index', { ascending: true }),
      supabase.from('subscribers').select('*').order('created_at', { ascending: false }),
    ]);

    if (ordersRes.data) setOrders(ordersRes.data);
    if (productsRes.data) setProducts(productsRes.data);
    if (consultRes.data) setConsultations(consultRes.data);
    if (testimonRes.data) setTestimonials(testimonRes.data);
    if (faqsRes.data) setFaqs(faqsRes.data);
    if (subsRes.data) setSubscribers(subsRes.data);

    setLoading(false);
    setRefreshing(false);
  }, [router]);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // ─── KPIs ───────────────────────────────────────────────────────────────────

  const totalRevenue = orders.reduce((s, o) => s + (o.amount || 0), 0);
  const uniqueCustomers = new Set(orders.map(o => o.customer_email)).size;

  // ─── Product CRUD ───────────────────────────────────────────────────────────

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ title: '', description: '', price: 49, sale_price: 0, file_url: '', payment_link: '', is_active: true });
    setShowProductForm(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({ title: p.title, description: p.description, price: p.price, sale_price: p.sale_price || 0, file_url: p.file_url || '', payment_link: p.payment_link || '', is_active: p.is_active });
    setShowProductForm(true);
  };

  const handleProductSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...productForm, sale_price: productForm.sale_price > 0 ? productForm.sale_price : null };
    if (editingProduct) {
      await supabase.from('products').update(payload).eq('id', editingProduct.id);
    } else {
      await supabase.from('products').insert([payload]);
    }
    setShowProductForm(false);
    fetchAllData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchAllData();
  };

  const toggleProductActive = async (p: Product) => {
    await supabase.from('products').update({ is_active: !p.is_active }).eq('id', p.id);
    fetchAllData();
  };

  // ─── FAQ CRUD ───────────────────────────────────────────────────────────────

  const openAddFAQ = () => {
    setEditingFAQ(null);
    setFaqForm({ question: '', answer: '', order_index: faqs.length + 1 });
    setShowFAQForm(true);
  };

  const openEditFAQ = (f: FAQ) => {
    setEditingFAQ(f);
    setFaqForm({ question: f.question, answer: f.answer, order_index: f.order_index });
    setShowFAQForm(true);
  };

  const handleFAQSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFAQ) {
      await supabase.from('faqs').update(faqForm).eq('id', editingFAQ.id);
    } else {
      await supabase.from('faqs').insert([faqForm]);
    }
    setShowFAQForm(false);
    fetchAllData();
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;
    await supabase.from('faqs').delete().eq('id', id);
    fetchAllData();
  };

  // ─── Testimonial moderation ─────────────────────────────────────────────────

  const toggleTestimonial = async (t: Testimonial) => {
    await supabase.from('testimonials').update({ is_approved: !t.is_approved }).eq('id', t.id);
    fetchAllData();
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('حذف هذه الشهادة؟')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    fetchAllData();
  };

  // ─── Consultation actions ───────────────────────────────────────────────────

  const updateConsultationStatus = async (id: string, status: string) => {
    await supabase.from('consultations').update({ status }).eq('id', id);
    fetchAllData();
  };

  // ─── CSV Export ─────────────────────────────────────────────────────────────

  const exportCSV = (type: 'orders' | 'subscribers') => {
    let csv = '';
    if (type === 'orders') {
      csv = 'ID,Email,Amount,Gateway,Status,Date\n';
      orders.forEach(o => { csv += `"${o.id}","${o.customer_email}","${o.amount}","${o.payment_gateway}","${o.status}","${o.created_at}"\n`; });
    } else {
      csv = 'ID,Name,Email,Country,Date\n';
      subscribers.forEach(s => { csv += `"${s.id}","${s.name}","${s.email}","${s.country}","${s.created_at}"\n`; });
    }
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `b4m_${type}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  // ─── Loading state ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#6C3BFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Tabs config ────────────────────────────────────────────────────────────

  const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: 'stats', label: 'نظرة عامة', icon: BarChart3 },
    { id: 'products', label: 'المنتجات', icon: Tag, count: products.length },
    { id: 'orders', label: 'الطلبات', icon: ShoppingBag, count: orders.length },
    { id: 'consultations', label: 'الاستشارات', icon: Calendar, count: consultations.length },
    { id: 'testimonials', label: 'الآراء', icon: MessageSquare, count: testimonials.length },
    { id: 'faqs', label: 'الأسئلة الشائعة', icon: HelpCircle, count: faqs.length },
    { id: 'subscribers', label: 'المشتركون', icon: Users, count: subscribers.length },
  ];

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans" dir="rtl">

      {/* ─── Header ─── */}
      <header className="bg-black/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#6C3BFF]/30 to-[#F5C542]/20 border border-[#6C3BFF]/40 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#F5C542]" />
            </div>
            <div>
              <h1 className="text-base font-black text-white tracking-tight">BLACK4ME <span className="opacity-40 font-light">HQ</span></h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[9px] text-[#6C3BFF] font-mono uppercase tracking-widest">Super Admin</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={fetchAllData} className={`p-2 rounded-xl border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 transition ${refreshing ? 'animate-spin text-[#F5C542]' : ''}`}>
              <RefreshCw className="w-4 h-4" />
            </button>
            <a href="/" className="text-xs font-bold text-gray-400 hover:text-white border border-white/5 hover:bg-white/5 px-3 py-2 rounded-xl transition">
              الموقع الرئيسي
            </a>
            <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-red-500/5 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/20 px-3 py-2 rounded-xl transition">
              <LogOut className="w-4 h-4" />
              خروج
            </button>
          </div>
        </div>
      </header>

      {/* ─── Tab Nav ─── */}
      <div className="bg-black/50 border-b border-white/5 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-[#6C3BFF] text-white shadow-lg shadow-[#6C3BFF]/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${activeTab === tab.id ? 'bg-white/20' : 'bg-white/5'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ════════════════════════════════════════════════════
            TAB 1: نظرة عامة على الأداء
        ════════════════════════════════════════════════════ */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white mb-1">نظرة عامة على الأداء</h2>
              <p className="text-gray-400 text-sm">مراقبة حية للمبيعات والبيانات الكاملة للمنصة.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'إجمالي الإيرادات', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
                { label: 'العملاء النشطون', value: uniqueCustomers, icon: Users, color: 'text-[#6C3BFF]', bg: 'bg-[#6C3BFF]/10', border: 'border-[#6C3BFF]/20' },
                { label: 'الطلبات الناجحة', value: orders.length, icon: ShoppingBag, color: 'text-[#F5C542]', bg: 'bg-[#F5C542]/10', border: 'border-[#F5C542]/20' },
                { label: 'الاستشارات', value: consultations.length, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
              ].map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <div key={i} className="bg-[#0a0a0a] border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-gray-400">{kpi.label}</p>
                      <div className={`w-8 h-8 rounded-lg ${kpi.bg} border ${kpi.border} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${kpi.color}`} />
                      </div>
                    </div>
                    <p className={`text-3xl font-black font-mono ${kpi.color}`}>{kpi.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Recent orders table */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white">آخر الطلبات</h3>
                <button onClick={() => exportCSV('orders')} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 px-3 py-2 rounded-xl transition">
                  <Download className="w-3.5 h-3.5" /> تصدير CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="text-xs text-gray-500 border-b border-white/10">
                    <tr>
                      <th className="pb-3 font-medium px-2">العميل</th>
                      <th className="pb-3 font-medium px-2">المبلغ</th>
                      <th className="pb-3 font-medium px-2">البوابة</th>
                      <th className="pb-3 font-medium px-2">التاريخ</th>
                      <th className="pb-3 font-medium px-2">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.length === 0 ? (
                      <tr><td colSpan={5} className="py-8 text-center text-gray-500 text-xs">لا توجد طلبات بعد</td></tr>
                    ) : orders.slice(0, 10).map(o => (
                      <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-2 text-xs text-gray-300 font-mono">{o.customer_email}</td>
                        <td className="py-3 px-2 font-black text-[#F5C542] font-mono">${o.amount}</td>
                        <td className="py-3 px-2 text-xs text-gray-400 uppercase">{o.payment_gateway}</td>
                        <td className="py-3 px-2 text-xs text-gray-500 font-mono">{new Date(o.created_at).toLocaleDateString('en-GB')}</td>
                        <td className="py-3 px-2">
                          <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-green-500/20">
                            <CheckCircle2 className="w-2.5 h-2.5" /> مكتمل
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            TAB 2: إدارة المنتجات
        ════════════════════════════════════════════════════ */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">إدارة المنتجات الرقمية</h2>
                <p className="text-gray-400 text-sm">أضف وعدّل وتحكم في الكتب والخدمات المعروضة في الموقع.</p>
              </div>
              <button onClick={openAddProduct} className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black text-sm px-4 py-2.5 rounded-xl transition">
                <Plus className="w-4 h-4" /> منتج جديد
              </button>
            </div>

            {/* Product Form */}
            {showProductForm && (
              <div className="bg-[#0a0a0a] border border-[#F5C542]/30 rounded-2xl p-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-[#F5C542]">{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
                  <button onClick={() => setShowProductForm(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleProductSave} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">اسم المنتج *</label>
                      <input required type="text" value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" placeholder="مثال: كتاب أسرار التسويق الرقمي" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">وصف المنتج *</label>
                      <textarea required rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF] resize-none" placeholder="اكتب وصفاً شاملاً للمنتج وقيمته..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">السعر الأصلي ($)</label>
                      <input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#6C3BFF]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">سعر العرض ($) — اتركه صفراً إن لا يوجد</label>
                      <input type="number" value={productForm.sale_price} onChange={e => setProductForm({...productForm, sale_price: Number(e.target.value)})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#6C3BFF]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">رابط الدفع (Stripe / PayPal)</label>
                      <input type="url" value={productForm.payment_link} onChange={e => setProductForm({...productForm, payment_link: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" placeholder="https://buy.stripe.com/..." dir="ltr" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">رابط التحميل (PDF / Google Drive)</label>
                      <input type="url" value={productForm.file_url} onChange={e => setProductForm({...productForm, file_url: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" placeholder="https://drive.google.com/..." dir="ltr" />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-3">
                      <input type="checkbox" id="isActive" checked={productForm.is_active} onChange={e => setProductForm({...productForm, is_active: e.target.checked})} className="w-4 h-4 accent-[#6C3BFF]" />
                      <label htmlFor="isActive" className="text-sm text-gray-300 cursor-pointer">منشور ومرئي في الموقع</label>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black px-6 py-2.5 rounded-xl transition">
                      <Save className="w-4 h-4" /> حفظ المنتج
                    </button>
                    <button type="button" onClick={() => setShowProductForm(false)} className="px-5 py-2.5 border border-white/10 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition">
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.length === 0 ? (
                <div className="sm:col-span-3 bg-[#0a0a0a] border border-white/10 rounded-2xl p-12 text-center">
                  <Tag className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">لا توجد منتجات بعد. أضف أول منتج!</p>
                </div>
              ) : products.map(p => (
                <div key={p.id} className={`bg-[#0a0a0a] border rounded-2xl p-5 transition-all duration-300 flex flex-col ${p.is_active ? 'border-white/10 hover:border-[#F5C542]/30' : 'border-white/5 opacity-60'}`}>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-white leading-snug">{p.title}</h3>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${p.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'}`}>
                        {p.is_active ? 'منشور' : 'مخفي'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{p.description}</p>
                    <div className="flex items-center gap-2 pt-1">
                      {p.sale_price ? (
                        <>
                          <span className="text-[#F5C542] font-black font-mono text-base">${p.sale_price}</span>
                          <span className="text-gray-500 font-mono text-xs line-through">${p.price}</span>
                        </>
                      ) : (
                        <span className="text-[#F5C542] font-black font-mono text-base">${p.price}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-4">
                    <button onClick={() => openEditProduct(p)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white border border-white/10 hover:border-[#6C3BFF]/40 hover:bg-[#6C3BFF]/10 py-2 rounded-xl transition">
                      <Edit2 className="w-3.5 h-3.5" /> تعديل
                    </button>
                    <button onClick={() => toggleProductActive(p)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl transition border" style={{ color: p.is_active ? '#F97316' : '#22C55E', borderColor: p.is_active ? '#F97316' : '#22C55E', background: p.is_active ? 'rgba(249,115,22,0.05)' : 'rgba(34,197,94,0.05)' }}>
                      {p.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {p.is_active ? 'إخفاء' : 'نشر'}
                    </button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-400 hover:text-red-300 border border-red-500/20 hover:bg-red-500/10 rounded-xl transition">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            TAB 3: الطلبات
        ════════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">إدارة الطلبات والمبيعات</h2>
                <p className="text-gray-400 text-sm">سجل كامل لجميع عمليات الشراء عبر المنصة.</p>
              </div>
              <button onClick={() => exportCSV('orders')} className="flex items-center gap-2 text-xs font-bold text-gray-300 border border-white/10 hover:bg-white/5 px-4 py-2.5 rounded-xl transition">
                <Download className="w-4 h-4" /> تصدير CSV
              </button>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="text-xs text-gray-500 border-b border-white/10 bg-black/30">
                    <tr>
                      <th className="py-4 px-4 font-medium">البريد الإلكتروني</th>
                      <th className="py-4 px-4 font-medium">المنتج</th>
                      <th className="py-4 px-4 font-medium">المبلغ</th>
                      <th className="py-4 px-4 font-medium">البوابة</th>
                      <th className="py-4 px-4 font-medium">التاريخ</th>
                      <th className="py-4 px-4 font-medium">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.length === 0 ? (
                      <tr><td colSpan={6} className="py-12 text-center text-gray-500 text-xs">لا توجد طلبات مسجلة</td></tr>
                    ) : orders.map(o => (
                      <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 text-xs text-gray-300 font-mono">{o.customer_email}</td>
                        <td className="py-3.5 px-4 text-xs text-gray-400 font-mono">{o.product_id?.substring(0, 20)}...</td>
                        <td className="py-3.5 px-4 font-black text-[#F5C542] font-mono">${o.amount}</td>
                        <td className="py-3.5 px-4 text-xs text-gray-400 uppercase font-bold">{o.payment_gateway}</td>
                        <td className="py-3.5 px-4 text-xs text-gray-500 font-mono">{new Date(o.created_at).toLocaleDateString('en-GB')}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 px-2.5 py-1 rounded-full text-[10px] font-bold border border-green-500/20">
                            <CheckCircle2 className="w-3 h-3" /> مكتمل
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            TAB 4: الاستشارات
        ════════════════════════════════════════════════════ */}
        {activeTab === 'consultations' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white mb-1">إدارة جلسات الاستشارة</h2>
              <p className="text-gray-400 text-sm">مواعيد الجلسات الفردية المحجوزة مع العملاء.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {consultations.length === 0 ? (
                <div className="sm:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-12 text-center">
                  <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">لا توجد استشارات محجوزة بعد.</p>
                </div>
              ) : consultations.map(c => (
                <div key={c.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">{c.customer_name}</h3>
                      <p className="text-xs text-[#6C3BFF] font-mono">{c.customer_email}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full ${
                      c.status === 'scheduled' ? 'bg-[#F5C542]/10 text-[#F5C542] border border-[#F5C542]/20' :
                      c.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {c.status === 'scheduled' ? 'محجوز' : c.status === 'completed' ? 'مكتمل' : 'ملغى'}
                    </span>
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="text-gray-400"><span className="text-gray-500">الموعد: </span><span className="text-white font-mono">{c.appointment_date} — {c.appointment_time}</span></p>
                    {c.notes && <p className="text-gray-400"><span className="text-gray-500">ملاحظات: </span>{c.notes}</p>}
                  </div>
                  {c.status === 'scheduled' && (
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      <button onClick={() => updateConsultationStatus(c.id, 'completed')} className="flex-1 text-xs font-bold text-green-400 border border-green-500/20 hover:bg-green-500/10 py-2 rounded-xl transition">
                        ✓ مكتملة
                      </button>
                      <button onClick={() => updateConsultationStatus(c.id, 'cancelled')} className="flex-1 text-xs font-bold text-red-400 border border-red-500/20 hover:bg-red-500/10 py-2 rounded-xl transition">
                        ✕ إلغاء
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            TAB 5: الآراء والشهادات
        ════════════════════════════════════════════════════ */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white mb-1">إدارة آراء العملاء</h2>
              <p className="text-gray-400 text-sm">اعتمد أو أخفِ شهادات العملاء المعروضة في الصفحة الرئيسية.</p>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="text-xs text-gray-500 border-b border-white/10 bg-black/30">
                    <tr>
                      <th className="py-4 px-4 font-medium">العميل</th>
                      <th className="py-4 px-4 font-medium">الدولة</th>
                      <th className="py-4 px-4 font-medium">التقييم</th>
                      <th className="py-4 px-4 font-medium">التعليق</th>
                      <th className="py-4 px-4 font-medium">الحالة</th>
                      <th className="py-4 px-4 font-medium">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {testimonials.length === 0 ? (
                      <tr><td colSpan={6} className="py-12 text-center text-gray-500 text-xs">لا توجد آراء مسجلة</td></tr>
                    ) : testimonials.map(t => (
                      <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 text-sm font-bold text-white">{t.customer_name}</td>
                        <td className="py-3.5 px-4 text-xs text-gray-400">{t.country}</td>
                        <td className="py-3.5 px-4">
                          <span className="text-[#F5C542] font-bold text-xs">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-400 max-w-xs truncate">{t.comment}</td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${t.is_approved ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                            {t.is_approved ? 'معتمد' : 'قيد المراجعة'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => toggleTestimonial(t)} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition ${t.is_approved ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'}`}>
                              {t.is_approved ? 'إخفاء' : 'اعتماد'}
                            </button>
                            <button onClick={() => deleteTestimonial(t.id)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            TAB 6: الأسئلة الشائعة
        ════════════════════════════════════════════════════ */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">إدارة الأسئلة الشائعة</h2>
                <p className="text-gray-400 text-sm">أضف وعدّل الأسئلة المعروضة في صفحة الهبوط.</p>
              </div>
              <button onClick={openAddFAQ} className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black text-sm px-4 py-2.5 rounded-xl transition">
                <Plus className="w-4 h-4" /> سؤال جديد
              </button>
            </div>

            {/* FAQ Form */}
            {showFAQForm && (
              <div className="bg-[#0a0a0a] border border-[#F5C542]/30 rounded-2xl p-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-[#F5C542]">{editingFAQ ? 'تعديل السؤال' : 'إضافة سؤال جديد'}</h3>
                  <button onClick={() => setShowFAQForm(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleFAQSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">السؤال *</label>
                    <input required type="text" value={faqForm.question} onChange={e => setFaqForm({...faqForm, question: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" placeholder="مثال: هل يتطلب خبرة تقنية؟" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">الجواب *</label>
                    <textarea required rows={4} value={faqForm.answer} onChange={e => setFaqForm({...faqForm, answer: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF] resize-none" placeholder="اكتب الإجابة التفصيلية هنا..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">الترتيب</label>
                    <input type="number" value={faqForm.order_index} onChange={e => setFaqForm({...faqForm, order_index: Number(e.target.value)})}
                      className="w-32 bg-black border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#6C3BFF]" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black px-6 py-2.5 rounded-xl transition">
                      <Save className="w-4 h-4" /> حفظ
                    </button>
                    <button type="button" onClick={() => setShowFAQForm(false)} className="px-5 py-2.5 border border-white/10 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition">
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* FAQs List */}
            <div className="space-y-3">
              {faqs.length === 0 ? (
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-12 text-center">
                  <HelpCircle className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">لا توجد أسئلة بعد. أضف أول سؤال!</p>
                </div>
              ) : faqs.map((f, i) => (
                <div key={f.id} className="bg-[#0a0a0a] border border-white/10 hover:border-white/20 rounded-2xl p-5 flex items-start gap-4 transition-all">
                  <span className="w-7 h-7 bg-[#6C3BFF]/10 border border-[#6C3BFF]/20 text-[#6C3BFF] text-xs font-black rounded-lg flex items-center justify-center flex-shrink-0">{f.order_index}</span>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-sm font-bold text-white">{f.question}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{f.answer}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => openEditFAQ(f)} className="p-2 text-gray-400 hover:text-white border border-white/10 hover:border-[#6C3BFF]/30 hover:bg-[#6C3BFF]/10 rounded-xl transition">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteFAQ(f.id)} className="p-2 text-red-400 hover:text-red-300 border border-red-500/20 hover:bg-red-500/10 rounded-xl transition">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            TAB 7: المشتركون
        ════════════════════════════════════════════════════ */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">قائمة المشتركين في النشرة البريدية</h2>
                <p className="text-gray-400 text-sm">جميع المشتركين الذين أدخلوا بريدهم الإلكتروني في الصفحة.</p>
              </div>
              <button onClick={() => exportCSV('subscribers')} className="flex items-center gap-2 text-xs font-bold text-gray-300 border border-white/10 hover:bg-white/5 px-4 py-2.5 rounded-xl transition">
                <Download className="w-4 h-4" /> تصدير CSV
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute right-4 top-3.5 w-4 h-4 text-gray-500" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="بحث بالاسم أو البريد الإلكتروني..."
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pr-11 pl-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" />
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="text-xs text-gray-500 border-b border-white/10 bg-black/30">
                    <tr>
                      <th className="py-4 px-4 font-medium">الاسم</th>
                      <th className="py-4 px-4 font-medium">البريد الإلكتروني</th>
                      <th className="py-4 px-4 font-medium">الدولة</th>
                      <th className="py-4 px-4 font-medium">تاريخ الاشتراك</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {subscribers
                      .filter(s => !searchQuery || s.email?.toLowerCase().includes(searchQuery.toLowerCase()) || s.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                      .length === 0 ? (
                      <tr><td colSpan={4} className="py-12 text-center text-gray-500 text-xs">لا توجد نتائج</td></tr>
                    ) : subscribers
                      .filter(s => !searchQuery || s.email?.toLowerCase().includes(searchQuery.toLowerCase()) || s.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(s => (
                        <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 text-sm font-bold text-white">{s.name || '—'}</td>
                          <td className="py-3.5 px-4 text-xs text-gray-300 font-mono">{s.email}</td>
                          <td className="py-3.5 px-4 text-xs text-[#F5C542]">{s.country || '—'}</td>
                          <td className="py-3.5 px-4 text-xs text-gray-500 font-mono">{new Date(s.created_at).toLocaleDateString('en-GB')}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

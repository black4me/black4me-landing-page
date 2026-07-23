"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Edit2, Trash2, Save, X, Star, Filter } from 'lucide-react';
import { useAutoSave } from '../../../hooks/useAutoSave';

interface Testimonial {
  id: string;
  customer_name: string;
  country: string;
  comment: string;
  rating: number;
  is_approved: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  service_type: 'product' | 'consultation' | 'general';
  product_id: string | null;
  user_email: string | null;
  products?: { title: string } | null;
  created_at: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const initialForm = { 
    customer_name: '', 
    country: 'السعودية', 
    comment: '', 
    rating: 5, 
    is_approved: false,
    status: 'pending',
    service_type: 'product',
    product_id: '',
    user_email: ''
  };

  const { data: form, updateData: setForm, clearDraft } = useAutoSave({
    key: 'testimonial_form_db_v2',
    initialData: initialForm,
  });

  useEffect(() => {
    fetchData();
    fetchProducts();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*, products(title)')
      .order('created_at', { ascending: false });
    if (data) setTestimonials(data);
    if (error) console.error('Error fetching testimonials:', error);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('id, title');
    if (data) setProducts(data);
  };

  const openAdd = () => {
    setEditingItem(null);
    setForm(initialForm);
    setShowForm(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditingItem(item);
    setForm({
      customer_name: item.customer_name,
      country: item.country,
      comment: item.comment,
      rating: item.rating,
      is_approved: item.status === 'approved',
      status: item.status,
      service_type: item.service_type,
      product_id: item.product_id || '',
      user_email: item.user_email || ''
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: any = { 
      customer_name: form.customer_name,
      country: form.country,
      comment: form.comment,
      rating: form.rating,
      status: form.status,
      service_type: form.service_type,
      product_id: form.service_type === 'product' && form.product_id ? form.product_id : null,
      user_email: form.user_email || null,
      is_approved: form.status === 'approved'
    };

    if (editingItem) {
      await supabase.from('testimonials').update(data).eq('id', editingItem.id);
    } else {
      await supabase.from('testimonials').insert([data]);
    }
    
    clearDraft();
    setShowForm(false);
    fetchData();
    alert('تم حفظ التقييم بنجاح');
  };

  const deleteItem = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
      await supabase.from('testimonials').delete().eq('id', id);
      fetchData();
    }
  };

  const filteredTestimonials = testimonials.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'consultation') return t.service_type === 'consultation';
    if (filter === 'general') return t.service_type === 'general';
    return t.product_id === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">التقييمات وآراء العملاء</h2>
          <p className="text-gray-400 text-sm">إدارة تقييمات العملاء حسب المنتج، الكتاب، أو الخدمة.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Service/Product Filter */}
          <div className="flex items-center gap-2 bg-[#111] px-3 py-2 rounded-xl border border-white/10 text-xs text-gray-300">
            <Filter className="w-3.5 h-3.5" />
            <select 
              value={filter} 
              onChange={e => setFilter(e.target.value)} 
              className="bg-transparent border-none text-white focus:outline-none font-bold"
            >
              <option value="all" className="bg-zinc-900">كل المنتجات والخدمات</option>
              <option value="consultation" className="bg-zinc-900">الاستشارات الشخصية</option>
              <option value="general" className="bg-zinc-900">عام (بدون تصنيف)</option>
              {products.map(p => (
                <option key={p.id} value={p.id} className="bg-zinc-900">منتج/كتاب: {p.title}</option>
              ))}
            </select>
          </div>

          <button onClick={openAdd} className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black text-sm px-4 py-2.5 rounded-xl transition">
            <Plus className="w-4 h-4" /> تقييم جديد
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-[#0a0a0a] border border-[#F5C542]/30 rounded-2xl p-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-[#F5C542]">{editingItem ? 'تعديل التقييم' : 'إضافة تقييم جديد'}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">اسم العميل *</label>
                <input required type="text" value={form.customer_name} onChange={e => setForm({customer_name: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">الدولة / البلد *</label>
                <input required type="text" value={form.country} onChange={e => setForm({country: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">البريد الإلكتروني للعميل</label>
                <input type="email" value={form.user_email} onChange={e => setForm({user_email: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">التقييم (من 1 إلى 5)</label>
                <input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({rating: Number(e.target.value)})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#6C3BFF]" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">نوع الكيان المرتبط *</label>
                <select value={form.service_type} onChange={e => setForm({service_type: e.target.value as any})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]">
                  <option value="product">منتج / كتاب</option>
                  <option value="consultation">جلسة استشارة</option>
                  <option value="general">عام للموقع</option>
                </select>
              </div>

              {form.service_type === 'product' && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">اختر المنتج / الكتاب المرتبط *</label>
                  <select required value={form.product_id} onChange={e => setForm({product_id: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]">
                    <option value="">-- اختر من القائمة --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">حالة التقييم (الإشراف)</label>
                <select value={form.status} onChange={e => setForm({status: e.target.value as any})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]">
                  <option value="pending">بانتظار المراجعة (Pending)</option>
                  <option value="approved">مقبول للعامة (Approved)</option>
                  <option value="rejected">مرفوض (Rejected)</option>
                  <option value="hidden">مخفي إدارياً (Hidden)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-400 mb-1.5">نص التقييم *</label>
                <textarea required rows={4} value={form.comment} onChange={e => setForm({comment: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF] resize-none" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black px-6 py-2.5 rounded-xl transition">
                <Save className="w-4 h-4" /> حفظ التقييم
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredTestimonials.length === 0 ? (
        <div className="text-center py-16 bg-[#0a0a0a] border border-white/5 rounded-2xl">
          <p className="text-gray-500 text-sm">لا توجد تقييمات مطابقة للفلتر المحدد.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTestimonials.map(t => (
            <div key={t.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex flex-col relative overflow-hidden pt-8">
              {/* Status Badge */}
              <div className={`absolute top-0 right-0 text-[10px] font-bold px-3 py-1 rounded-bl-lg text-black ${
                t.status === 'approved' ? 'bg-emerald-400' :
                t.status === 'pending' ? 'bg-amber-400' :
                t.status === 'rejected' ? 'bg-red-400 text-white' : 'bg-gray-400'
              }`}>
                {t.status === 'approved' ? 'مقبول' :
                 t.status === 'pending' ? 'بانتظار المراجعة' :
                 t.status === 'rejected' ? 'مرفوض' : 'مخفي'}
              </div>

              {/* Association Badge (Top Left) */}
              <div className={`absolute top-0 left-0 text-[10px] font-bold px-3 py-1 rounded-br-lg text-white ${
                t.service_type === 'product' ? 'bg-[#6C3BFF]' :
                t.service_type === 'consultation' ? 'bg-[#F5C542] text-black' : 'bg-zinc-700'
              }`}>
                {t.service_type === 'product' && t.products?.title ? `كتاب: ${t.products.title}` :
                 t.service_type === 'consultation' ? 'استشارة: جلسة استراتيجية' : 'عام للموقع'}
              </div>

              <div className="flex items-center gap-3 mb-3 mt-2">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 text-xs font-bold">
                  {t.customer_name?.charAt(0) || '?'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">{t.customer_name}</h3>
                  <p className="text-[10px] text-gray-500">{t.country}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < (t.rating || 0) ? 'text-[#F5C542] fill-[#F5C542]' : 'text-white/10'}`} />
                ))}
              </div>
              <p className="text-xs text-gray-400 line-clamp-3 mb-3 flex-1">{t.comment}</p>
              
              {t.user_email && (
                <div className="text-[10px] text-gray-500 mb-2 font-mono">
                  {t.user_email}
                </div>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                <button onClick={() => openEdit(t)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white border border-white/10 hover:border-[#6C3BFF]/40 hover:bg-[#6C3BFF]/10 py-2 rounded-xl transition">
                  <Edit2 className="w-3.5 h-3.5" /> تعديل
                </button>
                <button onClick={() => deleteItem(t.id)} className="flex items-center justify-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/10 w-10 h-9 rounded-xl transition">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

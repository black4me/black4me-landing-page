"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Edit2, Trash2, Save, X, Star } from 'lucide-react';
import { useAutoSave } from '../../../hooks/useAutoSave';

interface Testimonial {
  id: string;
  customer_name: string;
  country: string;
  comment: string;
  rating: number;
  is_approved: boolean;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  const initialForm = { customer_name: '', country: '', comment: '', rating: 5, is_approved: true };

  const { data: form, updateData: setForm, clearDraft } = useAutoSave({
    key: 'testimonial_form_db',
    initialData: initialForm,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (data) setTestimonials(data);
    if (error) console.error('Error fetching testimonials:', error);
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
      is_approved: item.is_approved,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form };

    if (editingItem) {
      await supabase.from('testimonials').update(data).eq('id', editingItem.id);
    } else {
      await supabase.from('testimonials').insert([data]);
    }
    
    clearDraft();
    setShowForm(false);
    fetchData();
    alert('تم الحفظ بنجاح');
  };

  const deleteItem = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
      await supabase.from('testimonials').delete().eq('id', id);
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">التقييمات وآراء العملاء</h2>
          <p className="text-gray-400 text-sm">إدارة تقييمات العملاء التي تظهر في الصفحة الرئيسية.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black text-sm px-4 py-2.5 rounded-xl transition">
          <Plus className="w-4 h-4" /> تقييم جديد
        </button>
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
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-400 mb-1.5">نص التقييم *</label>
                <textarea required rows={4} value={form.comment} onChange={e => setForm({comment: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">التقييم (من 1 إلى 5)</label>
                <input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({rating: Number(e.target.value)})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#6C3BFF]" />
              </div>
              
              <div className="sm:col-span-2 flex items-center gap-3">
                <input type="checkbox" id="isApproved" checked={form.is_approved} onChange={e => setForm({is_approved: e.target.checked})} className="w-4 h-4 accent-[#6C3BFF]" />
                <label htmlFor="isApproved" className="text-sm text-gray-300 cursor-pointer">معتمد (يظهر للعامة)</label>
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map(t => (
          <div key={t.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex flex-col relative overflow-hidden">
            {!t.is_approved && <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">مخفي</div>}
            <div className="flex items-center gap-3 mb-3">
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
            <p className="text-xs text-gray-400 line-clamp-3 mb-4 flex-1">{t.comment}</p>
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
    </div>
  );
}

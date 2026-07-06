"use client";

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Edit2, Trash2, Save, X, GripVertical } from 'lucide-react';
import { useAutoSave } from '../../../hooks/useAutoSave';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  order_index: number;
  is_active: boolean;
}

export default function CategoriesManager() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const initialForm = { name: '', slug: '', description: '', is_active: true };

  const { data: form, updateData: setForm, clearDraft } = useAutoSave({
    key: 'category_form',
    initialData: initialForm,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('order_index', { ascending: true });
    if (data) setCategories(data);
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    if (!editingCat) {
      setForm({ name, slug: generateSlug(name) });
    } else {
      setForm({ name });
    }
  };

  const openAdd = () => {
    setEditingCat(null);
    setForm(initialForm);
    setShowForm(true);
  };

  const openEdit = (c: Category) => {
    setEditingCat(c);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      is_active: c.is_active
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      is_active: form.is_active
    };

    if (editingCat) {
      const { error } = await supabase.from('categories').update(payload).eq('id', editingCat.id);
      if (error) return alert(error.message);
    } else {
      const { error } = await supabase.from('categories').insert([{ ...payload, order_index: categories.length }]);
      if (error) return alert(error.message);
    }
    
    clearDraft();
    setShowForm(false);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) alert('حدث خطأ: ' + error.message);
      else fetchCategories();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">إدارة التصنيفات</h2>
          <p className="text-gray-400 text-sm">أضف وتحكم في أقسام المنتجات (مثل: كتب، قوالب، دورات).</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black text-sm px-4 py-2.5 rounded-xl transition">
          <Plus className="w-4 h-4" /> تصنيف جديد
        </button>
      </div>

      {showForm && (
        <div className="bg-[#0a0a0a] border border-[#F5C542]/30 rounded-2xl p-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-[#F5C542]">{editingCat ? 'تعديل تصنيف' : 'إضافة تصنيف جديد'}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">الاسم *</label>
                <input required type="text" value={form.name} onChange={e => handleNameChange(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">الرابط المخصص (Slug) *</label>
                <input required type="text" value={form.slug} onChange={e => setForm({slug: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" dir="ltr" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-400 mb-1.5">الوصف</label>
                <textarea rows={2} value={form.description} onChange={e => setForm({description: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF] resize-none" />
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <input type="checkbox" id="isActive" checked={form.is_active} onChange={e => setForm({is_active: e.target.checked})} className="w-4 h-4 accent-[#6C3BFF]" />
                <label htmlFor="isActive" className="text-sm text-gray-300 cursor-pointer">منشور ومرئي</label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black px-6 py-2.5 rounded-xl transition">
                <Save className="w-4 h-4" /> حفظ التصنيف
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-xs font-bold text-gray-400">
              <th className="p-4 w-10"></th>
              <th className="p-4">الاسم</th>
              <th className="p-4">الوصف</th>
              <th className="p-4 w-24 text-center">الحالة</th>
              <th className="p-4 w-32">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {categories.map(c => (
              <tr key={c.id} className="hover:bg-white/5 transition group">
                <td className="p-4 text-center text-gray-600"><GripVertical className="w-4 h-4 mx-auto cursor-grab" /></td>
                <td className="p-4 font-bold text-white">{c.name} <span className="block text-xs font-normal text-gray-500 mt-0.5" dir="ltr">/{c.slug}</span></td>
                <td className="p-4 text-gray-400">{c.description || '-'}</td>
                <td className="p-4 text-center">
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wide ${c.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {c.is_active ? 'مرئي' : 'مخفي'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(c)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">لا توجد تصنيفات حالياً.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

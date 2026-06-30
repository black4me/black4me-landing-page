"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Edit2, Trash2, HelpCircle, Save, X } from 'lucide-react';
import { useAutoSave } from '../../../hooks/useAutoSave';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [showFAQForm, setShowFAQForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  const initialForm = { question: '', answer: '', order_index: 1 };

  const { data: faqForm, updateData: setFaqForm, clearDraft } = useAutoSave({
    key: 'faq_form',
    initialData: initialForm,
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    const { data } = await supabase.from('faqs').select('*').order('order_index', { ascending: true });
    if (data) setFaqs(data);
  };

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
    const fData = {
      question: faqForm.question,
      answer: faqForm.answer,
      order_index: faqForm.order_index
    };

    if (editingFAQ) {
      await supabase.from('faqs').update(fData).eq('id', editingFAQ.id);
    } else {
      await supabase.from('faqs').insert([fData]);
    }
    
    clearDraft();
    setShowFAQForm(false);
    fetchFaqs();
    alert('تم الحفظ بنجاح');
  };

  const deleteFAQ = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      await supabase.from('faqs').delete().eq('id', id);
      fetchFaqs();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">الأسئلة الشائعة</h2>
          <p className="text-gray-400 text-sm">إدارة الأسئلة الشائعة التي تظهر في الصفحة الرئيسية.</p>
        </div>
        <button onClick={openAddFAQ} className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black text-sm px-4 py-2.5 rounded-xl transition">
          <Plus className="w-4 h-4" /> سؤال جديد
        </button>
      </div>

      {showFAQForm && (
        <div className="bg-[#0a0a0a] border border-[#F5C542]/30 rounded-2xl p-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-[#F5C542]">{editingFAQ ? 'تعديل السؤال' : 'سؤال جديد'}</h3>
            <button onClick={() => setShowFAQForm(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleFAQSave} className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">السؤال *</label>
                <input required type="text" value={faqForm.question} onChange={e => setFaqForm({question: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">الإجابة *</label>
                <textarea required rows={4} value={faqForm.answer} onChange={e => setFaqForm({answer: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">الترتيب</label>
                <input type="number" value={faqForm.order_index} onChange={e => setFaqForm({order_index: Number(e.target.value)})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#6C3BFF]" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black px-6 py-2.5 rounded-xl transition">
                <Save className="w-4 h-4" /> حفظ السؤال
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {faqs.map(f => (
          <div key={f.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-white/10 text-white font-mono text-xs px-2 py-0.5 rounded">{f.order_index}</span>
                <h3 className="text-sm font-bold text-white">{f.question}</h3>
              </div>
              <p className="text-xs text-gray-400 line-clamp-3">{f.answer}</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button onClick={() => openEditFAQ(f)} className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white border border-white/10 hover:border-[#6C3BFF]/40 hover:bg-[#6C3BFF]/10 w-10 h-9 rounded-xl transition">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => deleteFAQ(f.id)} className="flex items-center justify-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/10 w-10 h-9 rounded-xl transition">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Calendar, Send, Clock, PlayCircle } from 'lucide-react';

interface Campaign {
  id: string;
  subject: string;
  content: string;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
}

export function EmailCampaignsTab() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ subject: '', content: '', scheduled_at: '' });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    const { data } = await supabase.from('email_campaigns').select('*').order('created_at', { ascending: false });
    if (data) setCampaigns(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      subject: form.subject,
      content: form.content,
      status: form.scheduled_at ? 'scheduled' : 'draft',
      scheduled_at: form.scheduled_at || null,
    };
    await supabase.from('email_campaigns').insert([payload]);
    setIsAdding(false);
    setForm({ subject: '', content: '', scheduled_at: '' });
    fetchCampaigns();
  };

  const sendNow = async (id: string) => {
    // In a real scenario, this would trigger an API route. 
    // Here we just mark it as sent for UI purposes since Resend requires an API route.
    alert('سيتم إرسال هذه الرسالة في الخلفية عن طريق الـ API المجدول.');
    await supabase.from('email_campaigns').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', id);
    fetchCampaigns();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><Mail className="w-5 h-5 text-brand-purple" /> إدارة النشرات البريدية</h3>
          <p className="text-xs text-gray-500">قم بإنشاء وجدولة رسائل بريدية ليتم إرسالها للعملاء.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-brand-purple text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-opacity-80 transition"
        >
          <Send className="w-4 h-4" /> إنشاء رسالة جديدة
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-brand-darkgray p-6 rounded-2xl border border-brand-purple/30 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">عنوان الرسالة (الموضوع) *</label>
            <input required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full bg-black border border-white/10 p-3 text-sm text-white rounded-xl focus:border-brand-purple outline-none" placeholder="اكتب عنواناً جذاباً..." />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">محتوى الرسالة *</label>
            <textarea required value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={5} className="w-full bg-black border border-white/10 p-3 text-sm text-white rounded-xl focus:border-brand-purple outline-none" placeholder="محتوى البريد..." />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">وقت الإرسال (اختياري للجدولة)</label>
            <input type="datetime-local" value={form.scheduled_at} onChange={e => setForm({...form, scheduled_at: e.target.value})} className="w-full sm:w-auto bg-black border border-white/10 p-2 text-sm text-white rounded-xl focus:border-brand-purple outline-none" />
            <p className="text-[10px] text-gray-500 mt-1">اتركه فارغاً لحفظه كمسودة.</p>
          </div>
          <button type="submit" className="bg-brand-purple text-white px-6 py-2 rounded-xl font-bold text-sm w-full">حفظ وجدولة</button>
        </form>
      )}

      <div className="grid gap-4">
        {campaigns.map(camp => (
          <div key={camp.id} className="bg-brand-darkgray p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">{camp.subject}</h4>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${camp.status === 'sent' ? 'bg-green-500/10 text-green-400' : camp.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-400'}`}>
                  {camp.status === 'sent' ? 'تم الإرسال' : camp.status === 'scheduled' ? 'مجدول' : 'مسودة'}
                </span>
              </div>
              <p className="text-xs text-gray-400 line-clamp-1">{camp.content}</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              {camp.scheduled_at && camp.status !== 'sent' && (
                <div className="text-[10px] text-brand-gold flex items-center gap-1 bg-brand-gold/10 px-3 py-1.5 rounded-lg">
                  <Calendar className="w-3 h-3" />
                  مجدول في: {new Date(camp.scheduled_at).toLocaleString('ar-SA')}
                </div>
              )}
              {camp.status === 'sent' && camp.sent_at && (
                <div className="text-[10px] text-green-400 flex items-center gap-1 bg-green-500/10 px-3 py-1.5 rounded-lg">
                  <Clock className="w-3 h-3" />
                  أُرسل في: {new Date(camp.sent_at).toLocaleString('ar-SA')}
                </div>
              )}
              {camp.status !== 'sent' && (
                <button onClick={() => sendNow(camp.id)} className="flex items-center gap-1 text-[10px] font-bold text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg transition ml-auto">
                  <PlayCircle className="w-3 h-3" /> إرسال الآن
                </button>
              )}
            </div>
          </div>
        ))}
        {campaigns.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            لا توجد حملات بريدية حالياً.
          </div>
        )}
      </div>
    </div>
  );
}


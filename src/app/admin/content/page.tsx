"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import {
  Mail, Plus, Send, Clock, CheckCircle2, Trash2, Edit3,
  Users, Zap, FileText, Eye, X, Save, ChevronDown
} from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  subject: string;
  body: string;
  status: 'draft' | 'scheduled' | 'sent';
  target_audience: 'all' | 'newsletter' | 'lead_magnets' | 'buyers';
  scheduled_at?: string;
  sent_at?: string;
  recipients_count?: number;
  created_at: string;
}

const STATUS_MAP = {
  draft:     { label: 'مسودة',     color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' },
  scheduled: { label: 'مجدولة',   color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  sent:      { label: 'تم الإرسال', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
};

const AUDIENCE_MAP = {
  all:          { label: 'الجميع (مشتركون + هدية + مشترين)', icon: '👥' },
  newsletter:   { label: 'مشتركو النشرة فقط', icon: '✉️' },
  lead_magnets: { label: 'طالبو الهدية المجانية', icon: '🎁' },
  buyers:       { label: 'المشترون فقط', icon: '💳' },
};

export default function ContentPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const [form, setForm] = useState({
    id: '',
    title: '',
    subject: '',
    body: '',
    target_audience: 'all' as Campaign['target_audience'],
    scheduled_at: '',
    status: 'draft' as Campaign['status'],
  });

  useEffect(() => {
    fetchCampaigns();
    fetchSubscriberCount();
  }, []);

  async function fetchCampaigns() {
    setLoading(true);
    const { data } = await supabase
      .from('email_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setCampaigns(data);
    setLoading(false);
  }

  async function fetchSubscriberCount() {
    const { count } = await supabase.from('subscribers').select('*', { count: 'exact', head: true });
    setSubscriberCount(count || 0);
  }

  function openNew() {
    setForm({ id: '', title: '', subject: '', body: '', target_audience: 'all', scheduled_at: '', status: 'draft' });
    setShowForm(true);
  }

  function openEdit(c: Campaign) {
    setForm({
      id: c.id,
      title: c.title || '',
      subject: c.subject || '',
      body: c.body || '',
      target_audience: c.target_audience || 'all',
      scheduled_at: c.scheduled_at ? c.scheduled_at.slice(0, 16) : '',
      status: c.status || 'draft',
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.title || !form.subject || !form.body) {
      alert('يرجى تعبئة العنوان والموضوع ومحتوى الرسالة');
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        title: form.title,
        subject: form.subject,
        body: form.body,
        target_audience: form.target_audience,
        status: form.scheduled_at ? 'scheduled' : 'draft',
        scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
      };

      if (form.id) {
        await supabase.from('email_campaigns').update(payload).eq('id', form.id);
      } else {
        await supabase.from('email_campaigns').insert(payload);
      }
      await fetchCampaigns();
      setShowForm(false);
    } catch (e: any) {
      alert('خطأ: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('هل تريد حذف هذه الحملة؟')) return;
    await supabase.from('email_campaigns').delete().eq('id', id);
    setCampaigns(prev => prev.filter(c => c.id !== id));
  }

  async function handleSendNow(campaign: Campaign) {
    if (!confirm(`هل تريد إرسال "${campaign.title}" الآن لكل المشتركين؟`)) return;
    setSending(campaign.id);
    try {
      const res = await fetch('/api/admin/schedule-newsletters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: campaign.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل الإرسال');
      alert('✅ تم إرسال الحملة بنجاح!');
      await fetchCampaigns();
    } catch (e: any) {
      alert('خطأ: ' + e.message);
    } finally {
      setSending(null);
    }
  }

  const draftCount = campaigns.filter(c => c.status === 'draft').length;
  const scheduledCount = campaigns.filter(c => c.status === 'scheduled').length;
  const sentCount = campaigns.filter(c => c.status === 'sent').length;

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white mb-1">إدارة المحتوى والنشرات</h2>
          <p className="text-gray-400 text-sm">أنشئ نشراتك البريدية وجدولها أو أرسلها الآن لمشتركيك</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#ff8c00] hover:bg-[#e07a00] text-black font-bold px-5 py-3 rounded-xl transition text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          نشرة جديدة
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'المشتركون', value: subscriberCount, icon: <Users className="w-5 h-5 text-[#ceae88]" />, color: '#ceae88' },
          { label: 'مسودات', value: draftCount, icon: <FileText className="w-5 h-5 text-gray-400" />, color: '#6b7280' },
          { label: 'مجدولة', value: scheduledCount, icon: <Clock className="w-5 h-5 text-blue-400" />, color: '#3b82f6' },
          { label: 'تم الإرسال', value: sentCount, icon: <CheckCircle2 className="w-5 h-5 text-green-400" />, color: '#22c55e' },
        ].map((kpi, i) => (
          <div key={i} className="bg-[#111114] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#1a1a1d] flex items-center justify-center border border-white/5 shrink-0">
              {kpi.icon}
            </div>
            <div>
              <p className="text-2xl font-black text-white">{kpi.value}</p>
              <p className="text-xs text-gray-500">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Campaigns List ── */}
      <div className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#ceae88]" />
            الحملات البريدية
          </h3>
          <span className="text-xs text-gray-500">{campaigns.length} حملة</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
            <div className="w-5 h-5 border-2 border-[#ceae88] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">جاري التحميل...</span>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm">لا توجد حملات حتى الآن — أنشئ أولى نشراتك!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {campaigns.map(c => {
              const status = STATUS_MAP[c.status] || STATUS_MAP.draft;
              const audience = AUDIENCE_MAP[c.target_audience] || AUDIENCE_MAP.all;
              return (
                <div key={c.id} className="p-5 hover:bg-white/[0.02] transition group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1a1a1d] border border-white/5 flex items-center justify-center text-lg shrink-0">
                      {c.status === 'sent' ? '✅' : c.status === 'scheduled' ? '🕐' : '📝'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <h4 className="font-bold text-white text-sm">{c.title || 'بدون عنوان'}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2 truncate">{c.subject}</p>
                      <div className="flex items-center gap-4 text-[11px] text-gray-600 flex-wrap">
                        <span>{audience.icon} {audience.label}</span>
                        {c.scheduled_at && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(c.scheduled_at).toLocaleString('ar-SA')}
                          </span>
                        )}
                        {c.sent_at && (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="w-3 h-3" />
                            أُرسِلت {new Date(c.sent_at).toLocaleDateString('ar-SA')}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(c.created_at).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setPreviewCampaign(c)}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
                        title="معاينة"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      {c.status !== 'sent' && (
                        <>
                          <button
                            onClick={() => openEdit(c)}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
                            title="تعديل"
                          >
                            <Edit3 className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleSendNow(c)}
                            disabled={sending === c.id}
                            className="flex items-center gap-1.5 bg-[#ff8c00]/10 hover:bg-[#ff8c00]/20 text-[#ff8c00] border border-[#ff8c00]/20 text-xs font-bold px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                          >
                            {sending === c.id ? (
                              <div className="w-3 h-3 border border-[#ff8c00] border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Send className="w-3 h-3" />
                            )}
                            إرسال الآن
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="w-8 h-8 rounded-lg bg-red-500/5 hover:bg-red-500/10 flex items-center justify-center transition"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4 text-red-500/50 hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Create/Edit Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div
            className="bg-[#111114] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">
                {form.id ? 'تعديل الحملة' : 'نشرة بريدية جديدة'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="text-xs text-gray-400 block mb-1.5">اسم الحملة (للمرجع الداخلي)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="مثال: نشرة يوليو — استراتيجية المحتوى"
                  className="w-full bg-[#0a0a0a] border border-white/10 p-3 rounded-xl text-white text-sm focus:border-[#ceae88]/50 outline-none transition"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="text-xs text-gray-400 block mb-1.5">موضوع الإيميل (Subject Line)</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  placeholder="مثال: 🔥 الاستراتيجية التي غيّرت عملي بالكامل"
                  className="w-full bg-[#0a0a0a] border border-white/10 p-3 rounded-xl text-white text-sm focus:border-[#ceae88]/50 outline-none transition"
                />
              </div>

              {/* Body */}
              <div>
                <label className="text-xs text-gray-400 block mb-1.5">محتوى الرسالة</label>
                <textarea
                  value={form.body}
                  onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
                  rows={10}
                  placeholder="اكتب محتوى نشرتك هنا... يدعم HTML أيضاً"
                  className="w-full bg-[#0a0a0a] border border-white/10 p-3 rounded-xl text-white text-sm resize-none leading-relaxed focus:border-[#ceae88]/50 outline-none transition font-mono"
                />
              </div>

              {/* Audience */}
              <div>
                <label className="text-xs text-gray-400 block mb-1.5">الجمهور المستهدف</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(AUDIENCE_MAP).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setForm(p => ({ ...p, target_audience: key as any }))}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium text-right transition ${
                        form.target_audience === key
                          ? 'border-[#ceae88]/50 bg-[#ceae88]/5 text-[#ceae88]'
                          : 'border-white/5 bg-[#0a0a0a] text-gray-400 hover:border-white/10'
                      }`}
                    >
                      <span className="text-base">{val.icon}</span>
                      <span>{val.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <label className="text-xs text-gray-400 block mb-1.5">
                  <Clock className="w-3 h-3 inline ml-1" />
                  جدولة الإرسال (اختياري — اتركه فارغاً للإرسال اليدوي)
                </label>
                <input
                  type="datetime-local"
                  value={form.scheduled_at}
                  onChange={e => setForm(p => ({ ...p, scheduled_at: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-white/10 p-3 rounded-xl text-white text-sm focus:border-[#ceae88]/50 outline-none transition"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 p-6 border-t border-white/5">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-[#ff8c00] hover:bg-[#e07a00] disabled:opacity-50 text-black font-bold px-6 py-2.5 rounded-xl transition text-sm"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {form.scheduled_at ? 'جدولة الإرسال' : 'حفظ كمسودة'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Preview Modal ── */}
      {previewCampaign && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreviewCampaign(null)}>
          <div
            className="bg-[#111114] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div>
                <h3 className="font-bold text-white">{previewCampaign.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">معاينة الإيميل</p>
              </div>
              <button onClick={() => setPreviewCampaign(null)} className="text-gray-500 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-[#0a0a0a] rounded-xl p-4 mb-4">
                <p className="text-xs text-gray-500 mb-1">الموضوع:</p>
                <p className="text-sm font-bold text-white">{previewCampaign.subject}</p>
              </div>
              <div
                className="bg-[#0a0a0a] rounded-xl p-5 text-sm text-gray-300 leading-loose whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: previewCampaign.body.replace(/\n/g, '<br/>') }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

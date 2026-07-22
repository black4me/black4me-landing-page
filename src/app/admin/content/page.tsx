"use client";

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import {
  Mail, Plus, Send, Clock, CheckCircle2, Trash2, Edit3,
  Users, Zap, FileText, Eye, X, Save, ChevronDown, Laptop, 
  Smartphone, Bold, AlignLeft, AlignCenter, AlignRight, 
  Image as ImageIcon, HelpCircle, AlertTriangle, ArrowLeft,
  ChevronRight, Gift, ShoppingCart, BookOpen, Award, Check
} from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  subject: string;
  body: string;
  status: 'draft' | 'scheduled' | 'sent';
  target_audience: string; // Dynamic targeting segments
  scheduled_at?: string;
  sent_at?: string;
  recipients_count?: number;
  created_at: string;
}

interface VisualBlock {
  id: string;
  type: 'heading' | 'subheading' | 'paragraph' | 'callout' | 'image' | 'cta' | 'icon' | 'divider';
  content?: string;
  align?: 'right' | 'center' | 'left';
  color?: string;
  bgColor?: string;
  fontSize?: string;
  fontWeight?: 'normal' | 'bold' | 'black';
  src?: string;
  link?: string;
  iconName?: string;
  iconColor?: string;
  iconSize?: string;
  borderRadius?: string;
}

const STATUS_MAP = {
  draft:     { label: 'مسودة',     color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' },
  scheduled: { label: 'مجدولة',   color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  sent:      { label: 'تم الإرسال', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
};

const AUDIENCE_SEGMENTS = [
  { id: 'all', label: 'الجميع (كل المسجلين)', icon: '👥' },
  { id: 'newsletter', label: 'مشتركو النشرة فقط', icon: '✉️' },
  { id: 'lead_magnets', label: 'طالبو الهدية المجانية', icon: '🎁' },
  { id: 'buyers', label: 'العملاء المشترون فقط', icon: '💳' },
  { id: 'cart_abandoners', label: 'سلات الشراء المتروكة', icon: '🛒' },
  { id: 'consultation_signups', label: 'من حجزوا استشارة استراتيجية', icon: '📅' },
  { id: 'no_purchase', label: 'المسجلون الذين لم يشتروا بعد', icon: '⏳' },
];

const VARIABLE_LIST = [
  { placeholder: '{{name}}', label: 'الاسم الكامل' },
  { placeholder: '{{first_name}}', label: 'الاسم الأول' },
  { placeholder: '{{email}}', label: 'البريد الإلكتروني' },
  { placeholder: '{{offer_name}}', label: 'اسم العرض الحالي' },
  { placeholder: '{{discount_code}}', label: 'كوبون الخصم' },
  { placeholder: '{{consultation_link}}', label: 'رابط الاستشارة الخاص' },
  { placeholder: '{{instagram_handle}}', label: 'حساب إنستجرام' },
];

const ICON_LIST = [
  { id: 'gift', label: 'هدية', char: '🎁' },
  { id: 'book', label: 'كتاب / دليل', char: '📖' },
  { id: 'cart', label: 'سلة شراء', char: '🛒' },
  { id: 'alert', label: 'تنبيه مهم', char: '⚠️' },
  { id: 'timer', label: 'مؤقت / وقت', char: '⏳' },
  { id: 'success', label: 'صح / تأكيد', char: '✅' },
  { id: 'discount', label: 'خصم', char: '🏷️' },
  { id: 'consultation', label: 'استشارة', char: '🤝' },
];

const FIXED_FOOTER_TEXT = `إذا وصلت إلى هنا، فأنت لا تبحث عن حلول سريعة، بل عن بناء عمل يمكنه النمو والاستمرار.
هذا هو الهدف الذي أعمل عليه مع عملائي في BLACK4ME.
إذا أردت متابعة المزيد من الأفكار والاستراتيجيات العملية، تابعني على إنستجرام:
@black4mee
وإذا كنت تريد توجيهًا يناسب مشروعك تحديدًا، فاحجز استشارة من الصفحة الرئيسية، وسنعمل معًا على بناء خطة عملية تناسب مرحلتك الحالية.
—
BLACK4ME JASIM MOHAMMED`;

const FIXED_FOOTER_HTML = `
<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #222; text-align: right; direction: rtl; font-family: sans-serif; font-size: 13px; color: #777; line-height: 1.8;">
  <p style="margin-bottom: 8px;">إذا وصلت إلى هنا، فأنت لا تبحث عن حلول سريعة، بل عن بناء عمل يمكنه النمو والاستمرار.</p>
  <p style="margin-bottom: 8px;">هذا هو الهدف الذي أعمل عليه مع عملائي في <strong>BLACK4ME</strong>.</p>
  <p style="margin-bottom: 12px;">إذا أردت متابعة المزيد من الأفكار والاستراتيجيات العملية، تابعني على إنستجرام: <a href="https://www.instagram.com/black4mee/" style="color: #ceae88; text-decoration: none;">@black4mee</a></p>
  <p style="margin-bottom: 20px;">وإذا كنت تريد توجيهًا يناسب مشروعك تحديدًا، فاحجز استشارة من الصفحة الرئيسية، وسنعمل معًا على بناء خطة عملية تناسب مرحلتك الحالية.</p>
  <p style="font-weight: bold; color: #aaa; margin: 0;">—</p>
  <p style="font-weight: bold; color: #ceae88; margin: 0;">BLACK4ME JASIM MOHAMMED</p>
</div>
`;

export default function ContentPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'preview' | 'schedule'>('content');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null);
  
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [subscriberCount, setSubscriberCount] = useState(0);

  // Visual Blocks Editor State
  const [blocks, setBlocks] = useState<VisualBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [includeFooter, setIncludeFooter] = useState(true);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [testingEmail, setTestingEmail] = useState(false);

  const [form, setForm] = useState({
    id: '',
    title: '',
    subject: '',
    target_audience: 'all',
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

  const compileBlocksToHTML = (visualBlocks: VisualBlock[], appendFooter: boolean) => {
    let html = `<div style="direction: rtl; text-align: right; font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0d0d10; color: #d1d1d6; border-radius: 16px; border: 1px solid #1a1a20;">`;

    visualBlocks.forEach(block => {
      const align = block.align || 'right';
      const color = block.color || '#d1d1d6';
      const fontSize = block.fontSize || '14px';
      
      switch (block.type) {
        case 'heading':
          html += `<h1 style="text-align: ${align}; color: ${color}; font-size: ${fontSize}; font-weight: ${block.fontWeight || 'bold'}; margin-bottom: 12px; line-height: 1.3;">${block.content}</h1>`;
          break;
        case 'subheading':
          html += `<h2 style="text-align: ${align}; color: ${color}; font-size: ${fontSize}; font-weight: ${block.fontWeight || 'bold'}; margin-bottom: 12px; line-height: 1.4;">${block.content}</h2>`;
          break;
        case 'paragraph':
          html += `<p style="text-align: ${align}; color: ${color}; font-size: ${fontSize}; line-height: 1.8; margin-bottom: 16px;">${block.content}</p>`;
          break;
        case 'callout':
          html += `<div style="text-align: ${align}; background-color: ${block.bgColor || '#1a1a24'}; border-right: 4px solid ${block.color || '#ceae88'}; padding: 15px; border-radius: 12px; margin-bottom: 16px; color: ${color}; font-size: ${fontSize}; line-height: 1.7;">${block.content}</div>`;
          break;
        case 'divider':
          html += `<hr style="border: none; border-top: 1px solid ${block.color || '#222'}; margin: 24px 0;" />`;
          break;
        case 'icon':
          const selectedIcon = ICON_LIST.find(i => i.id === block.iconName);
          html += `<div style="text-align: ${align}; font-size: ${block.iconSize || '24px'}; margin-bottom: 12px;">${selectedIcon?.char || '🎁'}</div>`;
          break;
        case 'image':
          if (block.src) {
            const imgHtml = `<img src="${block.src}" alt="Campaign Visual" style="max-width: 100%; height: auto; border-radius: 12px; margin-bottom: 16px; display: inline-block;" />`;
            html += `<div style="text-align: ${align};">`;
            if (block.link) {
              html += `<a href="${block.link}" target="_blank">${imgHtml}</a>`;
            } else {
              html += imgHtml;
            }
            html += `</div>`;
          }
          break;
        case 'cta':
          html += `
          <div style="text-align: ${align}; margin: 24px 0;">
            <a href="${block.link || '#'}" target="_blank" style="display: inline-block; padding: 12px 28px; background-color: ${block.bgColor || '#ceae88'}; color: ${block.color || '#000000'}; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: ${block.borderRadius || '12px'}; text-align: center; box-shadow: 0 4px 12px rgba(206, 174, 136, 0.2);">${block.content || 'اضغط هنا'}</a>
          </div>`;
          break;
      }
    });

    if (appendFooter) {
      html += FIXED_FOOTER_HTML;
    }

    html += `</div>`;
    return html;
  };

  const parseHTMLToBlocks = (html: string) => {
    // Try to extract blocks from our JSON marker comment
    const match = html.match(/<!-- VISUAL_BUILDER_STATE: ([\s\S]+?) -->/);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch (e) {
        console.error('Failed to parse blocks state from HTML comment', e);
      }
    }

    // Fallback block if parsing fails
    return [
      {
        id: 'block-1',
        type: 'paragraph',
        content: html.replace(/<div.*?>|<\/div>|<br\s*\/?>/gi, '').trim(),
        align: 'right',
        color: '#d1d1d6',
        fontSize: '14px',
      }
    ] as VisualBlock[];
  };

  function openNew() {
    setForm({ id: '', title: '', subject: '', target_audience: 'all', scheduled_at: '', status: 'draft' });
    setBlocks([
      { id: 'b-1', type: 'heading', content: 'مرحباً بك في BLACK4ME', align: 'center', color: '#ceae88', fontSize: '24px', fontWeight: 'bold' },
      { id: 'b-2', type: 'paragraph', content: 'أهلاً بك صديقي العزيز. نكتب لك اليوم لنشاركك بضع استراتيجيات عملية لتحويل عملك الرقمي وتأمين مستقبلك المالي.', align: 'right', color: '#d1d1d6', fontSize: '14px' }
    ]);
    setIncludeFooter(true);
    setActiveTab('content');
    setShowForm(true);
  }

  function openEdit(c: Campaign) {
    setForm({
      id: c.id,
      title: c.title || '',
      subject: c.subject || '',
      target_audience: c.target_audience || 'all',
      scheduled_at: c.scheduled_at ? c.scheduled_at.slice(0, 16) : '',
      status: c.status || 'draft',
    });

    const parsedBlocks = parseHTMLToBlocks(c.body);
    setBlocks(parsedBlocks);
    setIncludeFooter(c.body.includes('JASIM MOHAMMED'));
    setActiveTab('content');
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.title || !form.subject) {
      alert('يرجى تعبئة العنوان والموضوع');
      return;
    }
    setSaving(true);

    const compiledBody = compileBlocksToHTML(blocks, includeFooter) + `\n<!-- VISUAL_BUILDER_STATE: ${JSON.stringify(blocks)} -->`;

    try {
      const payload: any = {
        title: form.title,
        subject: form.subject,
        body: compiledBody,
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
    if (!confirm(`هل تريد إرسال "${campaign.title}" الآن لكل المستهدفين؟`)) return;
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

  const handleAddBlock = (type: VisualBlock['type']) => {
    let newBlock: VisualBlock = {
      id: 'block-' + Date.now(),
      type,
      align: 'right',
    };

    switch (type) {
      case 'heading':
        newBlock = { ...newBlock, content: 'عنوان جديد', fontSize: '20px', color: '#ffffff', fontWeight: 'bold' };
        break;
      case 'subheading':
        newBlock = { ...newBlock, content: 'عنوان فرعي', fontSize: '16px', color: '#ceae88', fontWeight: 'bold' };
        break;
      case 'paragraph':
        newBlock = { ...newBlock, content: 'اكتب الفقرة النصية هنا...', fontSize: '14px', color: '#d1d1d6' };
        break;
      case 'callout':
        newBlock = { ...newBlock, content: 'تنبيه أو اقتباس مميز هنا...', fontSize: '13px', color: '#ffffff', bgColor: '#1a1a24' };
        break;
      case 'image':
        newBlock = { ...newBlock, src: '', link: '', align: 'center' };
        break;
      case 'cta':
        newBlock = { ...newBlock, content: 'اضغط هنا للتحويل', link: '', bgColor: '#ceae88', color: '#000000', borderRadius: '12px', align: 'center' };
        break;
      case 'icon':
        newBlock = { ...newBlock, iconName: 'gift', iconSize: '32px', align: 'center' };
        break;
      case 'divider':
        newBlock = { ...newBlock, color: '#22222b' };
        break;
    }

    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const handleUpdateBlockField = (id: string, field: keyof VisualBlock, value: any) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= blocks.length) return;
    
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    
    setBlocks(updated);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const handleInsertVariable = (variable: string) => {
    if (!selectedBlockId) return;
    const block = blocks.find(b => b.id === selectedBlockId);
    if (!block || !block.content) return;
    
    handleUpdateBlockField(selectedBlockId, 'content', block.content + ' ' + variable);
  };

  const handleSendTestEmail = async () => {
    if (!testEmailAddress) {
      alert('يرجى كتابة البريد الإلكتروني للتجربة أولاً');
      return;
    }
    setTestingEmail(true);

    const compiledBody = compileBlocksToHTML(blocks, includeFooter);

    try {
      const res = await fetch('/api/preview-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmailAddress,
          subject: '[تجربة] ' + form.subject,
          body: compiledBody,
          name: 'صديقنا المميز'
        }),
      });

      if (res.ok) {
        alert('✅ تم إرسال البريد التجريبي بنجاح! يرجى فحص صندوق الوارد.');
      } else {
        const d = await res.json();
        throw new Error(d.error || 'فشل إرسال البريد التجريبي');
      }
    } catch (e: any) {
      alert('خطأ: ' + e.message);
    } finally {
      setTestingEmail(false);
    }
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);
  const draftCount = campaigns.filter(c => c.status === 'draft').length;
  const scheduledCount = campaigns.filter(c => c.status === 'scheduled').length;
  const sentCount = campaigns.filter(c => c.status === 'sent').length;

  return (
    <div className="space-y-8 animate-fade-in text-right" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white mb-1">إدارة المحتوى والنشرات</h2>
          <p className="text-gray-400 text-sm">أنشئ حملاتك البريدية، صمم قوالبك، وجدول رسائل الأتمتة والمتابعة.</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-brand-gold hover:bg-yellow-400 text-black font-bold px-5 py-3 rounded-xl transition text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>حملة بريدية جديدة</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'المشتركون المتاحون', value: subscriberCount, icon: <Users className="w-5 h-5 text-brand-gold" />, color: '#ceae88' },
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

      {/* Campaigns List */}
      <div className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-brand-gold" />
            <span>الحملات البريدية الفعالة</span>
          </h3>
          <span className="text-xs text-gray-500">{campaigns.length} حملة</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
            <div className="w-5 h-5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">جاري التحميل...</span>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p className="text-sm">لا توجد حملات حتى الآن — أنشئ أولى حملاتك التسويقية!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {campaigns.map(c => {
              const status = STATUS_MAP[c.status] || STATUS_MAP.draft;
              const audience = AUDIENCE_SEGMENTS.find(s => s.id === c.target_audience) || AUDIENCE_SEGMENTS[0];
              return (
                <div key={c.id} className="p-5 hover:bg-white/[0.02] transition group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1a1a1d] border border-white/5 flex items-center justify-center text-lg shrink-0">
                      {c.status === 'sent' ? '✅' : c.status === 'scheduled' ? '🕐' : '📝'}
                    </div>
                    <div className="flex-1 min-w-0 text-right">
                      <div className="flex items-center gap-3 flex-wrap mb-1 justify-start">
                        <h4 className="font-bold text-white text-sm">{c.title || 'بدون عنوان'}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2 truncate text-right">{c.subject}</p>
                      <div className="flex items-center gap-4 text-[11px] text-gray-600 flex-wrap justify-start">
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
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          const parsedBlocks = parseHTMLToBlocks(c.body);
                          const hasFooter = c.body.includes('JASIM MOHAMMED');
                          setPreviewCampaign({ ...c, body: compileBlocksToHTML(parsedBlocks, hasFooter) });
                        }}
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
                            className="flex items-center gap-1.5 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold border border-brand-gold/20 text-xs font-bold px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                          >
                            {sending === c.id ? (
                              <div className="w-3 h-3 border border-brand-gold border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Send className="w-3 h-3" />
                            )}
                            <span>إرسال الآن</span>
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

      {/* Visual Email Builder Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div
            className="bg-[#0e0e12] border border-white/10 rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#121217]">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {form.id ? 'تعديل وتصميم الحملة البريدية' : 'نشرة بريدية وحملة أتمتة جديدة'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">صمم قالب البريد التفاعلي الموجه لقوائم عملائك</p>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex bg-[#1a1a24] p-1 rounded-xl border border-white/5">
                {[
                  { id: 'content', label: 'المحرر المرئي' },
                  { id: 'preview', label: 'المعاينة الحية' },
                  { id: 'schedule', label: 'الجدولة والاستهداف' },
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeTab === t.id 
                        ? 'bg-brand-gold text-black' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Workspace */}
            <div className="flex-1 flex overflow-hidden min-h-0">
              
              {/* LEFT SIDE: Visual Editor Workspace */}
              {activeTab === 'content' && (
                <>
                  {/* Visual blocks list */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#070709] border-l border-white/5">
                    <div className="space-y-3">
                      <label className="text-xs text-gray-400 block font-bold">موضوع الإيميل (Subject Line) *</label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                        placeholder="مثال: 🔥 الاستراتيجية التي غيّرت عملي بالكامل"
                        className="w-full bg-[#111116] border border-white/10 p-3.5 rounded-xl text-white text-sm focus:border-brand-gold outline-none transition"
                      />
                    </div>

                    <div className="pt-4 space-y-3">
                      <label className="text-xs text-gray-400 block font-bold">بنية الرسالة (مكعبات المحتوى)</label>
                      
                      {blocks.map((block, index) => {
                        const isSelected = selectedBlockId === block.id;
                        return (
                          <div 
                            key={block.id}
                            onClick={() => setSelectedBlockId(block.id)}
                            className={`border rounded-2xl p-4 transition-all duration-200 cursor-pointer relative group ${
                              isSelected 
                                ? 'bg-[#121217] border-brand-gold/60 shadow-lg shadow-brand-gold/5' 
                                : 'bg-[#0e0e12] border-white/5 hover:border-white/10'
                            }`}
                          >
                            {/* Block Controls Header */}
                            <div className="flex items-center justify-between mb-2 flex-row-reverse">
                              <span className="text-[10px] font-bold text-brand-gold/60 uppercase bg-brand-gold/10 px-2 py-0.5 rounded-md">
                                {block.type === 'heading' && 'عنوان رئيسي'}
                                {block.type === 'subheading' && 'عنوان فرعي'}
                                {block.type === 'paragraph' && 'فقرة نصية'}
                                {block.type === 'callout' && 'مقتبس / تنبيه'}
                                {block.type === 'divider' && 'خط فاصل'}
                                {block.type === 'image' && 'صورة'}
                                {block.type === 'cta' && 'زر CTA'}
                                {block.type === 'icon' && 'أيقونة'}
                              </span>

                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition duration-200">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={(e) => { e.stopPropagation(); handleMoveBlock(index, 'up'); }}
                                  className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-gray-400"
                                >
                                  ▲
                                </button>
                                <button
                                  type="button"
                                  disabled={index === blocks.length - 1}
                                  onClick={(e) => { e.stopPropagation(); handleMoveBlock(index, 'down'); }}
                                  className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-gray-400"
                                >
                                  ▼
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id); }}
                                  className="w-5 h-5 rounded bg-red-950/20 hover:bg-red-500/20 flex items-center justify-center text-xs text-red-400"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>

                            {/* Block Inner Input */}
                            {(block.type === 'heading' || block.type === 'subheading' || block.type === 'paragraph' || block.type === 'callout' || block.type === 'cta') && (
                              <textarea
                                value={block.content || ''}
                                onChange={e => handleUpdateBlockField(block.id, 'content', e.target.value)}
                                placeholder="اكتب هنا..."
                                rows={block.type === 'paragraph' ? 3 : 1}
                                className="w-full bg-transparent border-none p-0 text-white text-sm focus:ring-0 outline-none resize-none leading-relaxed"
                              />
                            )}

                            {block.type === 'image' && (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={block.src || ''}
                                  onChange={e => handleUpdateBlockField(block.id, 'src', e.target.value)}
                                  placeholder="رابط الصورة المباشر"
                                  className="w-full bg-[#17171c] border border-white/5 px-3 py-2 rounded-xl text-xs text-white outline-none"
                                />
                                <input
                                  type="text"
                                  value={block.link || ''}
                                  onChange={e => handleUpdateBlockField(block.id, 'link', e.target.value)}
                                  placeholder="الرابط عند النقر على الصورة (اختياري)"
                                  className="w-full bg-[#17171c] border border-white/5 px-3 py-2 rounded-xl text-xs text-white outline-none"
                                />
                              </div>
                            )}

                            {block.type === 'cta' && (
                              <div className="space-y-2 pt-2 border-t border-white/5 mt-2">
                                <input
                                  type="text"
                                  value={block.link || ''}
                                  onChange={e => handleUpdateBlockField(block.id, 'link', e.target.value)}
                                  placeholder="رابط التوجيه (مثل: https://black4me.com/checkout)"
                                  className="w-full bg-[#17171c] border border-white/5 px-3 py-2 rounded-xl text-xs text-white outline-none"
                                />
                              </div>
                            )}

                            {block.type === 'icon' && (
                              <div className="flex gap-2 flex-wrap items-center">
                                {ICON_LIST.map(ic => (
                                  <button
                                    key={ic.id}
                                    type="button"
                                    onClick={() => handleUpdateBlockField(block.id, 'iconName', ic.id)}
                                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
                                      block.iconName === ic.id 
                                        ? 'bg-brand-gold text-black border-brand-gold' 
                                        : 'bg-[#17171c] border-white/5 text-gray-400 hover:border-white/10'
                                    }`}
                                  >
                                    {ic.char} {ic.label}
                                  </button>
                                ))}
                              </div>
                            )}

                            {block.type === 'divider' && (
                              <div className="h-[1px] bg-neutral-800 my-2" />
                            )}
                          </div>
                        );
                      })}

                      {/* Add block triggers */}
                      <div className="pt-4">
                        <p className="text-[10px] text-gray-500 mb-2 font-bold">إدراج عنصر جديد في الرسالة:</p>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { type: 'heading', label: 'عنوان رئيسي', char: 'H1' },
                            { type: 'subheading', label: 'عنوان فرعي', char: 'H2' },
                            { type: 'paragraph', label: 'نص فقرة', char: '¶' },
                            { type: 'callout', label: 'صندوق تمييز', char: '💡' },
                            { type: 'image', label: 'صورة/بانر', char: '🖼️' },
                            { type: 'cta', label: 'زر تحويل', char: '🔘' },
                            { type: 'icon', label: 'أيقونة', char: '🎁' },
                            { type: 'divider', label: 'خط فاصل', char: '―' },
                          ].map(el => (
                            <button
                              key={el.type}
                              type="button"
                              onClick={() => handleAddBlock(el.type as any)}
                              className="p-3 bg-[#111116] border border-white/5 hover:border-white/10 rounded-xl text-center transition group flex flex-col items-center justify-center gap-1"
                            >
                              <span className="text-sm font-black text-brand-gold group-hover:scale-110 transition duration-200">{el.char}</span>
                              <span className="text-[10px] text-gray-400">{el.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE: Block styling options */}
                  <div className="w-[300px] overflow-y-auto p-6 bg-[#111114] space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">خيارات التنسيق والمتغيرات</h4>
                      <p className="text-[10px] text-gray-500 leading-relaxed">
                        اختر أي عنصر من مكعبات الرسالة لتعديل لونه ومحاذاته وإضافة المتغيرات البريدية.
                      </p>
                    </div>

                    {/* Variable Selector */}
                    {selectedBlock && selectedBlock.content !== undefined && (
                      <div className="space-y-3">
                        <h5 className="text-[11px] font-bold text-brand-gold">إدراج متغير ديناميكي</h5>
                        <div className="grid grid-cols-1 gap-1.5 max-h-[180px] overflow-y-auto pr-1">
                          {VARIABLE_LIST.map(v => (
                            <button
                              key={v.placeholder}
                              type="button"
                              onClick={() => handleInsertVariable(v.placeholder)}
                              className="text-[10px] text-right p-2 rounded bg-[#17171c] hover:bg-[#1f1f28] text-gray-300 border border-white/5 flex items-center justify-between"
                            >
                              <span className="font-mono text-brand-gold">{v.placeholder}</span>
                              <span className="text-gray-400">{v.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Block Specific Stylers */}
                    {selectedBlock ? (
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <h5 className="text-[11px] font-bold text-white">تعديل مظهر العنصر المحدد</h5>
                        
                        {/* Text align (for text elements, image, cta, icon) */}
                        {selectedBlock.align !== undefined && (
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-500">محاذاة العناصر</label>
                            <div className="flex gap-1 bg-[#17171c] p-1 rounded-lg">
                              {[
                                { id: 'right', icon: <AlignRight className="w-3.5 h-3.5" /> },
                                { id: 'center', icon: <AlignCenter className="w-3.5 h-3.5" /> },
                                { id: 'left', icon: <AlignLeft className="w-3.5 h-3.5" /> },
                              ].map(al => (
                                <button
                                  key={al.id}
                                  type="button"
                                  onClick={() => handleUpdateBlockField(selectedBlock.id, 'align', al.id)}
                                  className={`flex-1 py-1 rounded flex justify-center text-gray-400 ${
                                    selectedBlock.align === al.id ? 'bg-white/10 text-white' : 'hover:text-white'
                                  }`}
                                >
                                  {al.icon}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Colors */}
                        {selectedBlock.color !== undefined && (
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-500">لون النص</label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                value={selectedBlock.color || '#ffffff'}
                                onChange={e => handleUpdateBlockField(selectedBlock.id, 'color', e.target.value)}
                                className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                              />
                              <input
                                type="text"
                                value={selectedBlock.color || ''}
                                onChange={e => handleUpdateBlockField(selectedBlock.id, 'color', e.target.value)}
                                className="flex-1 bg-[#17171c] border border-white/5 rounded-lg px-2 py-1 text-xs text-white text-left font-mono"
                              />
                            </div>
                          </div>
                        )}

                        {/* Background Colors (for CTA and Callout) */}
                        {selectedBlock.bgColor !== undefined && (
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-500">لون الخلفية</label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                value={selectedBlock.bgColor || '#1a1a24'}
                                onChange={e => handleUpdateBlockField(selectedBlock.id, 'bgColor', e.target.value)}
                                className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                              />
                              <input
                                type="text"
                                value={selectedBlock.bgColor || ''}
                                onChange={e => handleUpdateBlockField(selectedBlock.id, 'bgColor', e.target.value)}
                                className="flex-1 bg-[#17171c] border border-white/5 rounded-lg px-2 py-1 text-xs text-white text-left font-mono"
                              />
                            </div>
                          </div>
                        )}

                        {/* Font size */}
                        {selectedBlock.fontSize !== undefined && (
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-500">حجم الخط</label>
                            <input
                              type="text"
                              value={selectedBlock.fontSize || ''}
                              onChange={e => handleUpdateBlockField(selectedBlock.id, 'fontSize', e.target.value)}
                              placeholder="مثال: 14px أو 1.2rem"
                              className="w-full bg-[#17171c] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white text-left font-mono"
                            />
                          </div>
                        )}

                        {/* Font weight */}
                        {selectedBlock.fontWeight !== undefined && (
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-500">سُمك الخط</label>
                            <select
                              value={selectedBlock.fontWeight || 'normal'}
                              onChange={e => handleUpdateBlockField(selectedBlock.id, 'fontWeight', e.target.value)}
                              className="w-full bg-[#17171c] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white"
                            >
                              <option value="normal">عادي (Normal)</option>
                              <option value="bold">عريض (Bold)</option>
                              <option value="black">سميك جداً (Black)</option>
                            </select>
                          </div>
                        )}

                        {/* CTA specifics */}
                        {selectedBlock.borderRadius !== undefined && (
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-500">حواف الزر (Border Radius)</label>
                            <input
                              type="text"
                              value={selectedBlock.borderRadius || ''}
                              onChange={e => handleUpdateBlockField(selectedBlock.id, 'borderRadius', e.target.value)}
                              placeholder="مثال: 12px"
                              className="w-full bg-[#17171c] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white text-left font-mono"
                            />
                          </div>
                        )}

                        {/* Icon specifics */}
                        {selectedBlock.iconSize !== undefined && (
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-500">حجم الأيقونة (Size)</label>
                            <input
                              type="text"
                              value={selectedBlock.iconSize || ''}
                              onChange={e => handleUpdateBlockField(selectedBlock.id, 'iconSize', e.target.value)}
                              placeholder="مثال: 32px"
                              className="w-full bg-[#17171c] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white text-left font-mono"
                            />
                          </div>
                        )}

                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-600 border border-dashed border-white/5 rounded-2xl">
                        <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-[10px]">اضغط على أي عنصر لتعديل إعداداته الخاصة.</p>
                      </div>
                    )}

                    {/* Global Footer Toggle */}
                    <div className="pt-4 border-t border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white font-bold">تضمين التوقيع الثابت (Footer)</span>
                        <input
                          type="checkbox"
                          checked={includeFooter}
                          onChange={e => setIncludeFooter(e.target.checked)}
                          className="w-4 h-4 bg-[#17171c] border-white/10 rounded focus:ring-0 text-brand-gold"
                        />
                      </div>
                      <p className="text-[9px] text-gray-500 leading-relaxed">
                        سيتم إرفاق توقيع BLACK4ME المميز لتعزيز الثقة وعرض حجز الجلسات الترويجية تلقائياً في نهاية الرسالة.
                      </p>
                    </div>

                  </div>
                </>
              )}

              {/* CENTER SCREEN: HTML Live Preview Mockup */}
              {activeTab === 'preview' && (
                <div className="flex-1 bg-[#070709] p-6 flex flex-col items-center justify-start overflow-y-auto">
                  
                  {/* Preview Selector controls */}
                  <div className="flex items-center gap-4 mb-6 bg-[#111114] p-1.5 rounded-xl border border-white/5">
                    <button
                      type="button"
                      onClick={() => setPreviewMode('desktop')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
                        previewMode === 'desktop' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Laptop className="w-4 h-4" />
                      <span>كمبيوتر (Desktop)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode('mobile')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
                        previewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>جوال (Mobile)</span>
                    </button>
                  </div>

                  {/* Render Screen frame */}
                  {previewMode === 'desktop' ? (
                    <div className="w-full max-w-2xl bg-[#0e0e12] border border-white/10 rounded-2xl shadow-2xl p-6">
                      <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3 justify-start" dir="ltr">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <span className="text-[10px] text-gray-500 ml-2 font-mono">Subject: {form.subject || '(بدون موضوع)'}</span>
                      </div>
                      
                      <div 
                        dangerouslySetInnerHTML={{ __html: compileBlocksToHTML(blocks, includeFooter) }} 
                      />
                    </div>
                  ) : (
                    <div className="w-[360px] bg-black border-[12px] border-neutral-800 rounded-[40px] shadow-2xl overflow-hidden relative aspect-[9/18] flex flex-col">
                      {/* Phone notch */}
                      <div className="w-32 h-6 bg-neutral-800 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-black" />
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 pt-8 bg-[#070709] scrollbar-hide">
                        <div className="bg-[#0e0e12] border border-white/5 rounded-2xl p-4 text-xs">
                          <p className="text-[10px] text-gray-500 mb-1">الموضوع: {form.subject || '(بدون موضوع)'}</p>
                          <hr className="border-white/5 my-2" />
                          <div 
                            dangerouslySetInnerHTML={{ __html: compileBlocksToHTML(blocks, includeFooter) }} 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Test Email Box */}
                  <div className="mt-8 w-full max-w-md bg-[#111114] border border-white/5 rounded-2xl p-5 space-y-4">
                    <h5 className="text-xs text-white font-bold flex items-center gap-2">
                      <Send className="w-4 h-4 text-brand-gold" />
                      <span>إرسال بريد تجريبي فوري للتحقق (Test Email)</span>
                    </h5>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={testEmailAddress}
                        onChange={e => setTestEmailAddress(e.target.value)}
                        placeholder="example@domain.com"
                        className="flex-1 bg-[#0a0a0c] border border-white/10 px-3 py-2 rounded-xl text-xs text-white text-left font-mono outline-none focus:border-brand-gold"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        disabled={testingEmail}
                        onClick={handleSendTestEmail}
                        className="bg-brand-gold hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-xl text-xs transition"
                      >
                        {testingEmail ? 'جاري الإرسال...' : 'إرسال تجربة'}
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* TARGETING & SCHEDULING TAB */}
              {activeTab === 'schedule' && (
                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#070709]">
                  <h4 className="text-base text-brand-gold font-bold border-b border-white/5 pb-3">
                    تحديد الشريحة المستهدفة والجدولة
                  </h4>

                  {/* Dynamic Targeting Segment selection */}
                  <div className="space-y-3">
                    <label className="text-xs text-gray-400 block font-bold">اختر شريحة الجمهور المستهدفة (Targeting Segment)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {AUDIENCE_SEGMENTS.map(segment => {
                        const isSelected = form.target_audience === segment.id;
                        return (
                          <button
                            key={segment.id}
                            type="button"
                            onClick={() => setForm(p => ({ ...p, target_audience: segment.id }))}
                            className={`p-4 rounded-2xl border text-right transition flex items-center gap-4 ${
                              isSelected
                                ? 'bg-brand-gold/10 border-brand-gold text-brand-gold shadow-lg shadow-brand-gold/5'
                                : 'bg-[#0e0e12] border-white/5 hover:border-white/10 text-gray-300'
                            }`}
                          >
                            <span className="text-2xl">{segment.icon}</span>
                            <div>
                              <p className="text-xs font-bold">{segment.label}</p>
                              <p className="text-[9px] text-gray-500 mt-1">تحديد مرن حسب سلوك العميل في النظام المالي والـ CRM.</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scheduling options */}
                  <div className="bg-[#111114] p-5 rounded-2xl border border-white/5 space-y-4">
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-4.5 h-4.5 text-brand-gold" />
                      <span>جدولة وقت إرسال الحملة التلقائي (توقيت محدد)</span>
                    </h5>
                    <p className="text-[10px] text-gray-500">
                      اترك هذا الحقل فارغاً إذا كنت ترغب في حفظ الحملة كمسودة لتقوم بإرسالها يدوياً بنقرة واحدة لاحقاً.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">تاريخ ووقت الإرسال (حسب منطقتك الزمنية)</label>
                        <input
                          type="datetime-local"
                          value={form.scheduled_at}
                          onChange={e => setForm(p => ({ ...p, scheduled_at: e.target.value }))}
                          className="w-full bg-[#0a0a0c] border border-white/10 p-3 rounded-xl text-white text-sm focus:border-brand-gold outline-none transition text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Internal Admin Campaign Name */}
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 block font-bold">الاسم الداخلي للحملة (Internal Campaign Identifier)</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="مثال: نشرة يوليو البريدية - استراتيجية قمع المبيعات للمدربين"
                      className="w-full bg-[#111116] border border-white/10 p-3.5 rounded-xl text-white text-sm focus:border-brand-gold outline-none transition"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Modal Actions Footer */}
            <div className="flex items-center justify-between gap-3 p-6 border-t border-white/5 bg-[#121217]">
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm font-bold transition"
              >
                إلغاء
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-brand-gold hover:bg-yellow-400 disabled:opacity-50 text-black font-bold px-8 py-2.5 rounded-xl transition text-sm"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{form.scheduled_at ? 'جدولة وتفعيل الحملة' : 'حفظ كمسودة'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legacy Preview Modal */}
      {previewCampaign && activeTab !== 'preview' && (
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
              <div className="bg-[#0a0a0a] rounded-xl p-4 mb-4 text-right">
                <p className="text-xs text-gray-500 mb-1">الموضوع:</p>
                <p className="text-sm font-bold text-white">{previewCampaign.subject}</p>
              </div>
              <div
                className="bg-[#0a0a0a] rounded-xl p-5 text-sm text-gray-300 leading-loose"
                dangerouslySetInnerHTML={{ __html: previewCampaign.body }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

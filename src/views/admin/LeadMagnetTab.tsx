"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { uploadImageAdmin } from '../../server/actions/admin';
import { Save, Upload, Link as LinkIcon, MessageSquare, Instagram, Mail, FileText } from 'lucide-react';

export function LeadMagnetTab() {
  const { siteSettings, updateSiteSetting } = useApp();
  
  const [formData, setFormData] = useState({
    lead_magnet_file_url: siteSettings.lead_magnet_file_url || '',
    lead_magnet_email_subject: siteSettings.lead_magnet_email_subject || '🎁 هديتك المجانية جاهزة',
    lead_magnet_email_body: siteSettings.lead_magnet_email_body || 'شكراً لاهتمامك! لقد قمنا بتجهيز الهدية المجانية خصيصاً لك.\nنتمنى لك الاستفادة القصوى منها.',
    social_instagram_url: siteSettings.social_instagram_url || '',
    social_whatsapp_url: siteSettings.social_whatsapp_url || '',
    social_support_email: siteSettings.social_support_email || '',
  });

  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    setFormData({
      lead_magnet_file_url: siteSettings.lead_magnet_file_url || '',
      lead_magnet_email_subject: siteSettings.lead_magnet_email_subject || '🎁 هديتك المجانية جاهزة',
      lead_magnet_email_body: siteSettings.lead_magnet_email_body || 'شكراً لاهتمامك! لقد قمنا بتجهيز الهدية المجانية خصيصاً لك.\nنتمنى لك الاستفادة القصوى منها.',
      social_instagram_url: siteSettings.social_instagram_url || '',
      social_whatsapp_url: siteSettings.social_whatsapp_url || '',
      social_support_email: siteSettings.social_support_email || '',
    });
  }, [siteSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (key: string) => {
    updateSiteSetting(key, formData[key as keyof typeof formData]);
    alert('تم حفظ الإعداد بنجاح');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploadingFile(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `lead_magnet_${Date.now()}.${fileExt}`;

      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('fileName', fileName);

      // We can use uploadImageAdmin for generic files as it uploads to public products bucket
      const { url, error } = await uploadImageAdmin(formDataObj);

      if (error || !url) {
        throw new Error(error || 'Failed to upload file');
      }

      setFormData(prev => ({ ...prev, lead_magnet_file_url: url }));
      updateSiteSetting('lead_magnet_file_url', url);
      alert('تم رفع وتحديث ملف الهدية بنجاح!');
    } catch (error: any) {
      alert('خطأ أثناء رفع الملف: ' + error.message);
    } finally {
      setUploadingFile(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white">إعدادات الهدية المجانية (Lead Magnet)</h3>
        <p className="text-xs text-gray-500">قم برفع ملف الهدية وتخصيص محتوى البريد الإلكتروني الذي يصل للعملاء.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Upload Section */}
        <div className="bg-brand-darkgray p-6 rounded-2xl border border-brand-white/5 space-y-4 md:col-span-2">
          <h4 className="text-sm text-brand-gold font-bold flex items-center gap-2">
            <FileText className="w-4 h-4" /> ملف الهدية المجانية
          </h4>
          <p className="text-xs text-gray-400">هذا هو الملف (PDF, ZIP, الخ) الذي سيتم إرساله في الإيميل تلقائياً للعميل.</p>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                name="lead_magnet_file_url"
                value={formData.lead_magnet_file_url}
                onChange={handleChange}
                placeholder="رابط الملف المباشر..."
                className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white text-xs"
                dir="ltr"
              />
            </div>
            <div className="relative">
              <input 
                type="file" 
                onChange={handleFileUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploadingFile}
              />
              <button 
                type="button"
                className="bg-brand-purple hover:bg-opacity-80 text-white font-bold px-4 py-3 text-xs rounded-lg transition flex items-center gap-2 whitespace-nowrap"
                disabled={uploadingFile}
              >
                {uploadingFile ? 'جاري الرفع...' : 'أو ارفع ملف جديد'}
                <Upload className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button
            onClick={() => handleSave('lead_magnet_file_url')}
            className="bg-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white font-bold px-4 py-2 text-xs rounded-lg transition"
          >
            حفظ الرابط
          </button>
        </div>

        {/* Email Content Section */}
        <div className="bg-brand-darkgray p-6 rounded-2xl border border-brand-white/5 space-y-4">
          <h4 className="text-sm text-brand-gold font-bold flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> محتوى البريد الإلكتروني
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">عنوان البريد (Subject)</label>
              <input
                type="text"
                name="lead_magnet_email_subject"
                value={formData.lead_magnet_email_subject}
                onChange={handleChange}
                className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white text-xs"
              />
              <button
                onClick={() => handleSave('lead_magnet_email_subject')}
                className="mt-2 bg-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white font-bold px-4 py-2 text-[10px] rounded-lg transition"
              >حفظ العنوان</button>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">الرسالة التحفيزية (Body)</label>
              <textarea
                name="lead_magnet_email_body"
                value={formData.lead_magnet_email_body}
                onChange={handleChange}
                rows={5}
                className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white resize-none text-xs leading-relaxed"
              />
              <button
                onClick={() => handleSave('lead_magnet_email_body')}
                className="mt-2 bg-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white font-bold px-4 py-2 text-[10px] rounded-lg transition"
              >حفظ الرسالة</button>
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="bg-brand-darkgray p-6 rounded-2xl border border-brand-white/5 space-y-4">
          <h4 className="text-sm text-brand-gold font-bold flex items-center gap-2">
            <LinkIcon className="w-4 h-4" /> روابط التواصل (لإيميل الهدية)
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1 flex items-center gap-1"><Instagram className="w-3 h-3" /> رابط حساب انستجرام</label>
              <input
                type="url"
                name="social_instagram_url"
                value={formData.social_instagram_url}
                onChange={handleChange}
                className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white text-xs"
                dir="ltr"
                placeholder="https://instagram.com/..."
              />
              <button
                onClick={() => handleSave('social_instagram_url')}
                className="mt-2 bg-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white font-bold px-4 py-2 text-[10px] rounded-lg transition"
              >حفظ الحساب</button>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> رابط التواصل عبر واتساب</label>
              <input
                type="url"
                name="social_whatsapp_url"
                value={formData.social_whatsapp_url}
                onChange={handleChange}
                className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white text-xs"
                dir="ltr"
                placeholder="https://wa.me/..."
              />
              <button
                onClick={() => handleSave('social_whatsapp_url')}
                className="mt-2 bg-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white font-bold px-4 py-2 text-[10px] rounded-lg transition"
              >حفظ رقم الواتساب</button>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1 flex items-center gap-1"><Mail className="w-3 h-3" /> إيميل الدعم الفني</label>
              <input
                type="email"
                name="social_support_email"
                value={formData.social_support_email}
                onChange={handleChange}
                className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white text-xs"
                dir="ltr"
                placeholder="support@black4me.com"
              />
              <button
                onClick={() => handleSave('social_support_email')}
                className="mt-2 bg-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white font-bold px-4 py-2 text-[10px] rounded-lg transition"
              >حفظ إيميل الدعم</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

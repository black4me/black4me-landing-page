"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { uploadImageAdmin, getSignedUploadUrlAdmin } from '../../server/actions/admin';
import { Save, Upload, Link as LinkIcon, MessageSquare, Instagram, Mail, FileText, UserCircle, Camera } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function LeadMagnetTab() {
  const { siteSettings, updateSiteSetting } = useApp();
  
  const [formData, setFormData] = useState({
    lead_magnet_file_url: siteSettings.lead_magnet_file_url || '',
    lead_magnet_email_subject: siteSettings.lead_magnet_email_subject || '🎁 هديتك المجانية جاهزة',
    lead_magnet_email_body: siteSettings.lead_magnet_email_body || 'شكراً لاهتمامك! لقد قمنا بتجهيز الهدية المجانية خصيصاً لك.\nنتمنى لك الاستفادة القصوى منها.',
    social_instagram_url: siteSettings.social_instagram_url || '',
    social_whatsapp_url: siteSettings.social_whatsapp_url || '',
    social_support_email: siteSettings.social_support_email || '',
    author_photo_url: siteSettings.author_photo_url || '',
    author_name: siteSettings.author_name || 'جاسم محمد',
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    setFormData({
      lead_magnet_file_url: siteSettings.lead_magnet_file_url || '',
      lead_magnet_email_subject: siteSettings.lead_magnet_email_subject || '🎁 هديتك المجانية جاهزة',
      lead_magnet_email_body: siteSettings.lead_magnet_email_body || 'شكراً لاهتمامك! لقد قمنا بتجهيز الهدية المجانية خصيصاً لك.\nنتمنى لك الاستفادة القصوى منها.',
      social_instagram_url: siteSettings.social_instagram_url || '',
      social_whatsapp_url: siteSettings.social_whatsapp_url || '',
      social_support_email: siteSettings.social_support_email || '',
      author_photo_url: siteSettings.author_photo_url || '',
      author_name: siteSettings.author_name || 'جاسم محمد',
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

      // Use signed URL to bypass Vercel's 4.5MB server action limit
      const { signedUrl, path, token, error: signError } = await getSignedUploadUrlAdmin(fileName);

      if (signError || !path || !token) {
        throw new Error(signError || 'Failed to get upload signature');
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .uploadToSignedUrl(path, token, file);

      if (uploadError) {
        throw new Error(uploadError.message || 'Failed to upload file to storage');
      }

      const { data: urlData } = supabase.storage.from('products').getPublicUrl(path);
      const url = urlData.publicUrl;

      if (!url) {
        throw new Error('Failed to get public URL');
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploadingPhoto(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `author_photo_${Date.now()}.${fileExt}`;

      const { signedUrl, path, token, error: signError } = await getSignedUploadUrlAdmin(fileName);
      if (signError || !path || !token) throw new Error(signError || 'Failed to get upload signature');

      const { error: uploadError } = await supabase.storage
        .from('products')
        .uploadToSignedUrl(path, token, file);
      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage.from('products').getPublicUrl(path);
      const url = urlData.publicUrl;

      setFormData(prev => ({ ...prev, author_photo_url: url }));
      updateSiteSetting('author_photo_url', url);
      alert('تم رفع الصورة الشخصية بنجاح! ✅');
    } catch (error: any) {
      alert('خطأ أثناء رفع الصورة: ' + error.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white">إعدادات الهدية المجانية (Lead Magnet)</h3>
        <p className="text-xs text-gray-500">قم برفع ملف الهدية وتخصيص محتوى البريد الإلكتروني الذي يصل للعملاء.</p>
      </div>

      {/* ── Author Profile Section (appears at top of every email) ── */}
      <div className="bg-brand-darkgray p-6 rounded-2xl border border-brand-gold/20 space-y-5">
        <h4 className="text-sm text-brand-gold font-bold flex items-center gap-2">
          <UserCircle className="w-4 h-4" /> صورة المرسِل الشخصية (تظهر في كل إيميل)
        </h4>
        <p className="text-xs text-gray-400 -mt-2">الصورة التي تظهر في أعلى كل إيميل يصل للعملاء — مثل نموذج إيميلات المقربين.</p>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Photo Preview */}
          <div className="relative shrink-0">
            {formData.author_photo_url ? (
              <img
                src={formData.author_photo_url}
                alt="صورة المرسل"
                className="w-24 h-24 rounded-full object-cover border-2 border-brand-gold"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-brand-gold/20 border-2 border-brand-gold/30 flex items-center justify-center">
                <UserCircle className="w-10 h-10 text-brand-gold/50" />
              </div>
            )}
            {/* Upload overlay button */}
            <label
              htmlFor="author-photo-upload"
              className="absolute bottom-0 right-0 w-8 h-8 bg-brand-gold rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-400 transition shadow-lg"
              title="تغيير الصورة"
            >
              <Camera className="w-4 h-4 text-black" />
            </label>
            <input
              id="author-photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={uploadingPhoto}
            />
          </div>

          {/* Name + Upload area */}
          <div className="flex-1 space-y-3 w-full">
            <div>
              <label className="text-xs text-gray-400 block mb-1">اسم المرسِل (يظهر أسفل الصورة)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="author_name"
                  value={formData.author_name}
                  onChange={handleChange}
                  placeholder="جاسم محمد"
                  className="flex-1 bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white text-xs"
                />
                <button
                  onClick={() => handleSave('author_name')}
                  className="bg-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white font-bold px-4 py-2 text-xs rounded-lg transition whitespace-nowrap"
                >
                  حفظ الاسم
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">أو أدخل رابط الصورة مباشرة</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  name="author_photo_url"
                  value={formData.author_photo_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="flex-1 bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white text-xs"
                  dir="ltr"
                />
                <button
                  onClick={() => handleSave('author_photo_url')}
                  className="bg-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white font-bold px-4 py-2 text-xs rounded-lg transition whitespace-nowrap"
                >
                  حفظ الرابط
                </button>
              </div>
            </div>
            {uploadingPhoto && (
              <p className="text-xs text-brand-gold animate-pulse">جاري رفع الصورة...</p>
            )}
          </div>
        </div>
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

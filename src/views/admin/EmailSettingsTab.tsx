"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Link as LinkIcon, MessageSquare, Instagram, Mail, UserCircle, Camera } from 'lucide-react';

export function EmailSettingsTab() {
  const { siteSettings, updateSiteSetting } = useApp();
  
  const [formData, setFormData] = useState({
    social_instagram_url: siteSettings.social_instagram_url || '',
    social_whatsapp_url: siteSettings.social_whatsapp_url || '',
    social_support_email: siteSettings.social_support_email || '',
    author_photo_url: siteSettings.author_photo_url || '',
    author_name: siteSettings.author_name || 'جاسم محمد',
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    setFormData({
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploadingPhoto(true);
      const file = e.target.files[0];

      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'author_photo');

      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: fd,
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        throw new Error(result.error || 'فشل رفع الصورة');
      }

      setFormData(prev => ({ ...prev, author_photo_url: result.url }));
      updateSiteSetting('author_photo_url', result.url);
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
        <h3 className="text-lg font-bold text-white">إعدادات البريد الإلكتروني</h3>
        <p className="text-xs text-gray-500">قم بتخصيص معلومات المرسِل والروابط الاجتماعية التي تظهر في أسفل كافة رسائل البريد الإلكتروني.</p>
      </div>

      {/* ── Author Profile Section ── */}
      <div className="bg-brand-darkgray p-6 rounded-2xl border border-brand-gold/20 space-y-5">
        <h4 className="text-sm text-brand-gold font-bold flex items-center gap-2">
          <UserCircle className="w-4 h-4" /> صورة واسم المرسِل (تظهر في كل إيميل)
        </h4>
        <p className="text-xs text-gray-400 -mt-2">هذه المعلومات تظهر بشكل موحد في جميع رسائل البريد الصادرة لتعزيز الهوية الشخصية.</p>

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

      <div className="grid grid-cols-1 gap-6">
        {/* Social Links Section */}
        <div className="bg-brand-darkgray p-6 rounded-2xl border border-brand-white/5 space-y-4">
          <h4 className="text-sm text-brand-gold font-bold flex items-center gap-2">
            <LinkIcon className="w-4 h-4" /> روابط التواصل (تظهر في أسفل الإيميلات)
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

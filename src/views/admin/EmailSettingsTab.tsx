"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Link as LinkIcon, MessageSquare, Instagram, Mail, UserCircle } from 'lucide-react';

export function EmailSettingsTab() {
  const { siteSettings, updateSiteSetting } = useApp();

  const [formData, setFormData] = useState({
    social_instagram_url: siteSettings.social_instagram_url || '',
    social_whatsapp_url: siteSettings.social_whatsapp_url || '',
    social_support_email: siteSettings.social_support_email || '',
    author_name: siteSettings.author_name || 'جاسم محمد',
  });

  useEffect(() => {
    setFormData({
      social_instagram_url: siteSettings.social_instagram_url || '',
      social_whatsapp_url: siteSettings.social_whatsapp_url || '',
      social_support_email: siteSettings.social_support_email || '',
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white">إعدادات البريد الإلكتروني</h3>
        <p className="text-xs text-gray-500">قم بتخصيص معلومات المرسِل والروابط الاجتماعية التي تظهر في أسفل كافة رسائل البريد الإلكتروني.</p>
      </div>

      {/* ── Author Profile Section ── */}
      <div className="bg-brand-darkgray p-6 rounded-2xl border border-brand-gold/20 space-y-5">
        <h4 className="text-sm text-brand-gold font-bold flex items-center gap-2">
          <UserCircle className="w-4 h-4" /> اسم المرسِل (يظهر في كل إيميل)
        </h4>
        <p className="text-xs text-gray-400 -mt-2">هذه المعلومات تظهر بشكل موحد في جميع رسائل البريد الصادرة لتعزيز الهوية الشخصية.</p>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Name + URL area */}
          <div className="flex-1 space-y-3 w-full">
            <div>
              <label className="text-xs text-gray-400 block mb-1">اسم المرسِل</label>
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

"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { Link as LinkIcon, MessageSquare, Instagram, Mail, UserCircle, Camera, X, ZoomIn, ZoomOut, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';

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

  // Cropper State
  const [photoFile, setPhotoFile] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

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

  // Step 1: Read file and open cropper modal
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setPhotoFile(reader.result?.toString() || null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setIsCropping(true);
      });
      reader.readAsDataURL(e.target.files[0]);
      // Reset input so same file can be re-selected
      e.target.value = '';
    }
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Step 2: Crop, compress to JPEG, upload
  const handleCropAndUpload = async () => {
    if (!photoFile || !croppedAreaPixels) return;
    try {
      setUploadingPhoto(true);
      const croppedImage = await getCroppedImg(photoFile, croppedAreaPixels);
      if (!croppedImage) throw new Error('فشل قص الصورة');

      const fd = new FormData();
      fd.append('file', croppedImage);
      fd.append('folder', 'author_photo');

      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd });
      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'فشل رفع الصورة');

      setFormData(prev => ({ ...prev, author_photo_url: result.url }));
      updateSiteSetting('author_photo_url', result.url);
      setIsCropping(false);
      setPhotoFile(null);
      alert('تم رفع وتحديث الصورة الشخصية بنجاح! ✅');
    } catch (error: any) {
      alert('خطأ: ' + error.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setPhotoFile(null);
  };

  // Move crop position by a fixed step
  const moveCrop = (dx: number, dy: number) => {
    setCrop(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  return (
    <div className="space-y-6">

      {/* ── Crop Modal Overlay ── */}
      {isCropping && photoFile && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4">
          <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-brand-gold/30 w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white font-bold text-sm">✂️ ضبط وقص الصورة</h3>
              <button onClick={handleCancelCrop} className="text-gray-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cropper Canvas */}
            <div className="relative w-full" style={{ height: 320, background: '#111' }}>
              <Cropper
                image={photoFile}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Controls */}
            <div className="p-4 space-y-4">
              {/* Zoom */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400 flex items-center gap-1">
                  <ZoomIn className="w-3 h-3" /> التكبير / التصغير
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setZoom(z => Math.max(1, z - 0.1))}
                    className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 accent-yellow-400"
                  />
                  <button
                    onClick={() => setZoom(z => Math.min(3, z + 0.1))}
                    className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-gray-400 w-8 text-center">{zoom.toFixed(1)}x</span>
                </div>
              </div>

              {/* Position nudge controls */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400">تحريك الصورة</label>
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => moveCrop(0, -10)} className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition" title="للأعلى">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => moveCrop(-10, 0)} className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition" title="يسار">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setCrop({ x: 0, y: 0 }); setZoom(1); }} className="w-9 h-9 bg-brand-gold/20 rounded-lg flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-black transition text-xs font-bold">
                    ⌖
                  </button>
                  <button onClick={() => moveCrop(10, 0)} className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition" title="يمين">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => moveCrop(0, 10)} className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition" title="للأسفل">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCancelCrop}
                  className="flex-1 bg-white/10 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-white/20 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleCropAndUpload}
                  disabled={uploadingPhoto}
                  className="flex-1 bg-brand-gold text-black font-bold py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition disabled:opacity-50"
                >
                  {uploadingPhoto ? 'جاري الرفع...' : '✅ حفظ ورفع الصورة'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <div className="relative shrink-0 group">
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
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>

          {/* Name + URL area */}
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
            <p className="text-xs text-gray-500">💡 اضغط على أيقونة الكاميرا لرفع صورة من جهازك مع إمكانية الضبط والقص قبل الحفظ</p>
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

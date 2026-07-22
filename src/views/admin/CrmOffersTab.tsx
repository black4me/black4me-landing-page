"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit2, Trash2, Save, Upload, Link as LinkIcon, 
  ExternalLink, Eye, EyeOff, Calendar, Clock, ToggleLeft, 
  ToggleRight, Gift, FileText, CheckCircle, AlertTriangle 
} from 'lucide-react';
import { getOfferPages, saveOfferPage, deleteOfferPage, OfferPage } from '../../server/actions/crm';

export function CrmOffersTab() {
  const [offers, setOffers] = useState<OfferPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<Partial<OfferPage>>({});
  
  // File upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form notifications
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setIsLoading(true);
    const data = await getOfferPages();
    setOffers(data);
    setIsLoading(false);
  };

  const handleEditClick = (offer: OfferPage) => {
    setCurrentOffer({ ...offer });
    setIsEditing(true);
    setAlert(null);
  };

  const handleNewClick = () => {
    setCurrentOffer({
      slug: '',
      type: 'free_gift',
      title: '',
      subtitle: '',
      description: '',
      button_text: 'احصل عليه الآن',
      image_url: '',
      is_active: true,
      enable_timer: false,
      timer_end: '',
      redirect_url: '',
    });
    setIsEditing(true);
    setAlert(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentOffer(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: 'is_active' | 'enable_timer') => {
    setCurrentOffer(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploadingImage(true);
      const file = e.target.files[0];

      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'offers');

      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: fd,
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        throw new Error(result.error || 'فشل رفع الصورة');
      }

      setCurrentOffer(prev => ({ ...prev, image_url: result.url }));
      setAlert({ type: 'success', message: 'تم رفع الصورة بنجاح!' });
    } catch (error: any) {
      setAlert({ type: 'error', message: 'خطأ أثناء رفع الصورة: ' + error.message });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOffer.slug || !currentOffer.title) {
      setAlert({ type: 'error', message: 'يرجى إدخال العنوان والـ slug' });
      return;
    }

    // Format slug (replace spaces/special characters with dashes)
    const formattedSlug = currentOffer.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\-أ-ي]/g, '-')
      .replace(/-+/g, '-');

    const offerData: OfferPage = {
      id: currentOffer.id,
      slug: formattedSlug,
      type: currentOffer.type as any,
      title: currentOffer.title,
      subtitle: currentOffer.subtitle || '',
      description: currentOffer.description || '',
      button_text: currentOffer.button_text || 'احصل عليه الآن',
      image_url: currentOffer.image_url || '',
      is_active: currentOffer.is_active ?? true,
      enable_timer: currentOffer.enable_timer ?? false,
      timer_end: currentOffer.timer_end ? new Date(currentOffer.timer_end).toISOString() : null,
      redirect_url: currentOffer.redirect_url || '',
    };

    const res = await saveOfferPage(offerData);

    if (res.success) {
      setAlert({ type: 'success', message: 'تم حفظ العرض بنجاح! ✅' });
      setIsEditing(false);
      loadOffers();
    } else {
      setAlert({ type: 'error', message: 'فشل حفظ العرض: ' + res.error });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا العرض نهائياً؟')) return;

    const res = await deleteOfferPage(id);
    if (res.success) {
      setAlert({ type: 'success', message: 'تم حذف العرض بنجاح' });
      loadOffers();
    } else {
      setAlert({ type: 'error', message: 'فشل حذف العرض: ' + res.error });
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="flex justify-between items-center flex-row-reverse">
        <div>
          <h3 className="text-xl font-bold text-white">إدارة صفحات العروض والهدايا مستقلة (Offers & Lead Magnets)</h3>
          <p className="text-xs text-gray-500 mt-1">قم بإنشاء وتعديل العروض الترويجية والصفحات المستقلة للهدايا والخصومات.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={handleNewClick}
            className="flex items-center gap-2 bg-[#ceae88] hover:bg-yellow-500 text-black px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء عرض جديد</span>
          </button>
        )}
      </div>

      {alert && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          alert.type === 'success' 
            ? 'bg-emerald-950/20 border-emerald-500/25 text-emerald-400' 
            : 'bg-red-950/20 border-red-500/25 text-red-400'
        }`}>
          {alert.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <p className="text-sm font-medium">{alert.message}</p>
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-[#111114] border border-white/5 rounded-2xl p-6 space-y-6">
          <h4 className="text-base text-brand-gold font-bold border-b border-white/5 pb-3">
            {currentOffer.id ? 'تعديل بيانات العرض' : 'إنشاء عرض مستقل جديد'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Slug */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 font-bold">الرابط الفرعي (Slug) *</label>
              <input
                type="text"
                name="slug"
                required
                value={currentOffer.slug || ''}
                onChange={handleInputChange}
                placeholder="مثال: free-book-download"
                className="w-full px-4 py-2.5 bg-[#17171c] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold text-left"
                dir="ltr"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                الرابط سيكون: https://black4me-landing-page.vercel.app/offer/{currentOffer.slug || '[slug]'}
              </p>
            </div>

            {/* Publication Type */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 font-bold">نوع العرض *</label>
              <select
                name="type"
                value={currentOffer.type || 'free_gift'}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-[#17171c] border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-gold"
              >
                <option value="free_gift">هدية مجانية (Free Gift)</option>
                <option value="paid_offer">عرض مدفوع (Paid Offer)</option>
                <option value="discount">خصم مؤقت (Discount)</option>
                <option value="product">منتج مميز (Product)</option>
                <option value="service">خدمة (Service)</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 font-bold">العنوان الرئيسي *</label>
              <input
                type="text"
                name="title"
                required
                value={currentOffer.title || ''}
                onChange={handleInputChange}
                placeholder="مثال: احصل على كتابك المجاني الآن"
                className="w-full px-4 py-2.5 bg-[#17171c] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 font-bold">العنوان الفرعي</label>
              <input
                type="text"
                name="subtitle"
                value={currentOffer.subtitle || ''}
                onChange={handleInputChange}
                placeholder="تفاصيل تظهر أسفل العنوان الرئيسي"
                className="w-full px-4 py-2.5 bg-[#17171c] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-2 font-bold">الوصف التفصيلي (شرح العرض)</label>
              <textarea
                name="description"
                rows={3}
                value={currentOffer.description || ''}
                onChange={handleInputChange}
                placeholder="اكتب هنا تفاصيل ومميزات العرض وشروطه..."
                className="w-full px-4 py-2.5 bg-[#17171c] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold resize-none"
              />
            </div>

            {/* Button text */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 font-bold">نص زر التحويل (CTA)</label>
              <input
                type="text"
                name="button_text"
                value={currentOffer.button_text || ''}
                onChange={handleInputChange}
                placeholder="مثال: احصل على الهدية مجاناً"
                className="w-full px-4 py-2.5 bg-[#17171c] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold"
              />
            </div>

            {/* Redirect / Target URL */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 font-bold">رابط التحويل بعد الإرسال (Stripe checkout / Thank you)</label>
              <input
                type="text"
                name="redirect_url"
                value={currentOffer.redirect_url || ''}
                onChange={handleInputChange}
                placeholder="مثال: /checkout أو رابط مخصص"
                className="w-full px-4 py-2.5 bg-[#17171c] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold text-left"
                dir="ltr"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                في حال تركه فارغاً: سيتم توجيه العميل لصفحة الشكر الافتراضية للهدايا، أو لصفحة الدفع المعتادة للعروض.
              </p>
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-2 font-bold">صورة المنتج أو الهدية</label>
              <div className="flex gap-4 items-center flex-row-reverse">
                <input
                  type="text"
                  name="image_url"
                  value={currentOffer.image_url || ''}
                  onChange={handleInputChange}
                  placeholder="رابط الصورة المباشر أو ارفعها من اليسار"
                  className="flex-1 px-4 py-2.5 bg-[#17171c] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold text-left"
                  dir="ltr"
                />
                
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition duration-200"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploadingImage ? 'جاري الرفع...' : 'رفع صورة'}</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {currentOffer.image_url && (
                <div className="mt-4">
                  <p className="text-[10px] text-gray-500 mb-2">معاينة الصورة:</p>
                  <img src={currentOffer.image_url} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-white/10" />
                </div>
              )}
            </div>

            {/* Timer controls */}
            <div className="bg-[#17171c] p-4 rounded-2xl border border-white/5 space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h5 className="text-sm font-bold text-white">تفعيل مؤقت العد التنازلي التلقائي</h5>
                  <p className="text-[10px] text-gray-500">إذا تم تفعيله، سيظهر عداد تنازلي حقيقي ويتم إيقاف العرض عند انتهائه.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleChange('enable_timer')}
                  className="text-gray-400 hover:text-white transition"
                >
                  {currentOffer.enable_timer ? (
                    <ToggleRight className="w-10 h-10 text-brand-gold" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-gray-600" />
                  )}
                </button>
              </div>

              {currentOffer.enable_timer && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">وقت نهاية العرض *</label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        name="timer_end"
                        required={currentOffer.enable_timer}
                        value={currentOffer.timer_end ? currentOffer.timer_end.substring(0, 16) : ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-[#1c1c24] border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-gold text-left"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Active Status */}
            <div className="bg-[#17171c] p-4 rounded-2xl border border-white/5 flex items-center justify-between md:col-span-2">
              <div className="space-y-0.5">
                <h5 className="text-sm font-bold text-white">حالة العرض (نشط)</h5>
                <p className="text-[10px] text-gray-500">تمكين أو تعطيل ظهور الصفحة للعامة.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleChange('is_active')}
                className="text-gray-400 hover:text-white transition"
              >
                {currentOffer.is_active ? (
                  <ToggleRight className="w-10 h-10 text-brand-gold" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-gray-600" />
                )}
              </button>
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition font-bold text-sm"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-gold hover:bg-yellow-400 text-black rounded-xl font-bold text-sm transition"
            >
              حفظ وتثبيت
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">جاري تحميل قائمة العروض...</p>
            </div>
          ) : offers.length === 0 ? (
            <div className="p-12 text-center text-gray-500 space-y-3">
              <Gift className="w-12 h-12 text-gray-700 mx-auto" />
              <p className="text-sm">لا توجد عروض أو هدايا مضافة حالياً.</p>
              <button 
                onClick={handleNewClick}
                className="text-brand-gold hover:underline font-bold text-xs"
              >
                أنشئ عرضاً أولاً الآن
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-right">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-gray-400 text-xs font-bold">
                    <th className="p-4">العرض / الهدية</th>
                    <th className="p-4">النوع</th>
                    <th className="p-4">الرابط الفرعي (Slug)</th>
                    <th className="p-4">مؤقت</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4 text-left">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                  {offers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{offer.title}</div>
                        {offer.subtitle && <div className="text-[10px] text-gray-500 mt-0.5">{offer.subtitle}</div>}
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          offer.type === 'free_gift' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10'
                        }`}>
                          {offer.type === 'free_gift' ? 'هدية مجانية' : 'عرض مدفوع'}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs text-gray-400">{offer.slug}</td>
                      <td className="p-4">
                        {offer.enable_timer ? (
                          <div className="flex items-center gap-1.5 justify-end">
                            <Clock className="w-3.5 h-3.5 text-brand-gold" />
                            <span className="text-xs text-brand-gold">مفعّل</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-600">غير مفعّل</span>
                        )}
                      </td>
                      <td className="p-4">
                        {offer.is_active ? (
                          <span className="text-emerald-400 text-xs font-medium flex items-center gap-1 justify-end">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            نشط
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs font-medium flex items-center gap-1 justify-end">
                            <span className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                            معطل
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-left">
                        <div className="flex items-center gap-2 justify-start">
                          <a
                            href={`/offer/${offer.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition"
                            title="عرض الصفحة"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleEditClick(offer)}
                            className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition"
                            title="تعديل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(offer.id || '')}
                            className="p-2 hover:bg-white/5 rounded-lg text-red-500/20 hover:text-red-400 transition"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

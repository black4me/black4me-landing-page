'use client';

import { useState } from 'react';
import { upsertOffer } from '../../../../server/actions/offers';
import { Save, Plus, Edit2, Link as LinkIcon, ExternalLink, Settings } from 'lucide-react';
import Link from 'next/link';

export default function OfferEditor({ initialOffers }: { initialOffers: any[] }) {
  const [offers, setOffers] = useState(initialOffers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const startNew = () => {
    setFormData({
      slug: '',
      type: 'free_gift',
      title: '',
      subtitle: '',
      description: '',
      button_text: 'سجل الآن',
      image_url: '',
      is_active: true,
      enable_timer: false,
      redirect_url: '/success'
    });
    setEditingId(null);
    setShowForm(true);
  };

  const editOffer = (offer: any) => {
    setFormData({ ...offer });
    setEditingId(offer.id);
    setShowForm(true);
  };

  const saveOffer = async () => {
    setSaving(true);
    const res = await upsertOffer(formData);
    setSaving(false);
    
    if (res.success && res.data) {
      if (editingId) {
        setOffers(offers.map(o => o.id === editingId ? res.data : o));
      } else {
        setOffers([res.data, ...offers]);
      }
      setShowForm(false);
    } else {
      alert('Error saving offer: ' + res.error);
    }
  };

  return (
    <div className="space-y-6">
      
      {!showForm && (
        <div className="flex justify-end">
          <button onClick={startNew} className="bg-brand-purple text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-brand-purple-light transition-all">
            <Plus className="w-5 h-5" />
            إنشاء عرض جديد
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-surface-2 p-6 rounded-xl border border-white/10 space-y-4">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'تعديل العرض' : 'إنشاء عرض'}</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">الرابط المختصر (slug)</label>
              <input type="text" value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-3 rounded-lg bg-black border border-white/10" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">نوع العرض</label>
              <select value={formData.type || 'free_gift'} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-3 rounded-lg bg-black border border-white/10">
                <option value="free_gift">هدية مجانية (Lead Magnet)</option>
                <option value="paid_offer">عرض مدفوع (Paid Offer)</option>
                <option value="discount">خصم (Discount)</option>
                <option value="product">منتج (Product)</option>
                <option value="service">خدمة (Service)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">العنوان الرئيسي</label>
              <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-lg bg-black border border-white/10" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">العنوان الفرعي (اختياري)</label>
              <input type="text" value={formData.subtitle || ''} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full p-3 rounded-lg bg-black border border-white/10" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">الوصف</label>
              <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-lg bg-black border border-white/10 h-24" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">نص الزر</label>
              <input type="text" value={formData.button_text || ''} onChange={e => setFormData({...formData, button_text: e.target.value})} className="w-full p-3 rounded-lg bg-black border border-white/10" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">مسار التوجيه بعد التسجيل/الشراء</label>
              <input type="text" value={formData.redirect_url || ''} onChange={e => setFormData({...formData, redirect_url: e.target.value})} className="w-full p-3 rounded-lg bg-black border border-white/10" dir="ltr" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">صورة العرض / المنتج</label>
              <div className="flex gap-4 items-center">
                <input 
                  type="text" 
                  value={formData.image_url || ''} 
                  onChange={e => setFormData({...formData, image_url: e.target.value})} 
                  placeholder="رابط الصورة أو ارفعها من الزر الجانبي"
                  className="flex-1 p-3 rounded-lg bg-black border border-white/10" 
                  dir="ltr" 
                />
                <button 
                  type="button" 
                  onClick={() => document.getElementById('offerImageUpload')?.click()} 
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-3 rounded-lg transition-all whitespace-nowrap flex items-center gap-2"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? 'جاري الرفع...' : 'رفع صورة'}
                </button>
                <input 
                  id="offerImageUpload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={async (e) => {
                    try {
                      if (!e.target.files || e.target.files.length === 0) return;
                      setUploadingImage(true);
                      const file = e.target.files[0];
                      const fd = new FormData();
                      fd.append('file', file);
                      fd.append('folder', 'offers');
                      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd });
                      const result = await res.json();
                      if (!res.ok || result.error) throw new Error(result.error || 'فشل الرفع');
                      setFormData({ ...formData, image_url: result.url });
                    } catch (err: any) {
                      alert('خطأ: ' + err.message);
                    } finally {
                      setUploadingImage(false);
                    }
                  }} 
                />
              </div>
              {formData.image_url && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">معاينة الصورة:</p>
                  <img src={formData.image_url} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-white/10 bg-black" />
                </div>
              )}
            </div>

            {formData.type === 'free_gift' && (
              <div className="md:col-span-2 bg-black/50 p-4 rounded-xl border border-white/5 space-y-4 mt-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>إعدادات أتمتة البريد الإلكتروني للهدية (Email Automation)</span>
                </h3>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">موضوع البريد الإلكتروني (Email Subject)</label>
                  <input type="text" value={formData.email_subject || ''} onChange={e => setFormData({...formData, email_subject: e.target.value})} className="w-full p-3 rounded-lg bg-black border border-white/10" placeholder="🎁 هديتك المجانية جاهزة للتحميل" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">نص الرسالة الإلكترونية (Email Body)</label>
                  <textarea value={formData.email_body || ''} onChange={e => setFormData({...formData, email_body: e.target.value})} className="w-full p-3 rounded-lg bg-black border border-white/10 h-24" placeholder="اكتب هنا محتوى الرسالة الترحيبية..." />
                </div>
              </div>
            )}

            <div className="md:col-span-2 flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.is_active || false} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-5 h-5 accent-brand-gold" />
                <span>مفعل</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.enable_timer || false} onChange={e => setFormData({...formData, enable_timer: e.target.checked})} className="w-5 h-5 accent-brand-gold" />
                <span>تفعيل المؤقت التنازلي</span>
              </label>
            </div>
            
            {formData.enable_timer && (
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">تاريخ انتهاء المؤقت</label>
                <input type="datetime-local" value={formData.timer_end ? formData.timer_end.substring(0, 16) : ''} onChange={e => setFormData({...formData, timer_end: new Date(e.target.value).toISOString()})} className="w-full p-3 rounded-lg bg-black border border-white/10" dir="ltr" />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/10">
            <button onClick={saveOffer} disabled={saving} className="bg-brand-gold text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-all flex items-center gap-2">
              <Save className="w-5 h-5" />
              {saving ? 'جاري الحفظ...' : 'حفظ العرض'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-8 py-3 rounded-lg border border-white/20 hover:bg-white/5 transition-all">
              إلغاء
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <div className="grid gap-4">
          {offers.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-surface-2 rounded-xl border border-white/5">
              لا توجد عروض حالياً. قم بإنشاء عرضك الأول!
            </div>
          ) : (
            offers.map(offer => (
              <div key={offer.id} className="bg-surface-2 p-4 md:p-6 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-brand-purple/30 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold">{offer.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-md ${offer.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {offer.is_active ? 'نشط' : 'متوقف'}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-md bg-blue-500/20 text-blue-400">
                      {offer.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
                    <span className="flex items-center gap-1">
                      <LinkIcon className="w-4 h-4" />
                      /offer/{offer.slug}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Link href={`/offer/${offer.slug}`} target="_blank" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-all text-sm">
                    <ExternalLink className="w-4 h-4" />
                    معاينة
                  </Link>
                  <button onClick={() => editOffer(offer)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-purple-light px-4 py-2 rounded-lg transition-all text-sm">
                    <Edit2 className="w-4 h-4" />
                    تعديل
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

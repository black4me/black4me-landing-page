"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { uploadImageAdmin } from '../../server/actions/admin';
import { ComparisonItem, FunnelStage, ValueStackItem, Coupon } from '../../types';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Upload, Loader2 } from 'lucide-react';
import ImageUploader from '../../components/admin/ImageUploader';

export function SiteSettingsTab() {
  const { siteSettings, updateSiteSetting } = useApp();
  const [formData, setFormData] = useState({
    hero_title: siteSettings.hero_title || '',
    hero_subtitle: siteSettings.hero_subtitle || '',
    hero_badge: siteSettings.hero_badge || '',
    hero_support_text: siteSettings.hero_support_text || '',
    hero_price_original: siteSettings.hero_price_original || '',
    hero_price_discounted: siteSettings.hero_price_discounted || '',
    hero_price_discount_percent: siteSettings.hero_price_discount_percent || '',
    hero_cta_text: siteSettings.hero_cta_text || '',
    enable_top_banner: siteSettings.enable_top_banner === 'true',
    top_banner_text: siteSettings.top_banner_text || '',
    countdown_end_date: siteSettings.countdown_end_date || '',
    hero_video_url: siteSettings.hero_video_url || '',
    funnel_title: siteSettings.funnel_title || '',
    funnel_subtitle: siteSettings.funnel_subtitle || '',
    comparison_title: siteSettings.comparison_title || '',
    comparison_subtitle: siteSettings.comparison_subtitle || '',
    enable_paypal: siteSettings.enable_paypal === 'true',
    enable_stripe: siteSettings.enable_stripe === 'true',
    checkout_cover_image: siteSettings.checkout_cover_image || '',
    book_preview_image: siteSettings.book_preview_image || '',
    site_logo: siteSettings.site_logo || '',
    site_favicon: siteSettings.site_favicon || '',
    hero_image: siteSettings.hero_image || '',
    video_poster: siteSettings.video_poster || '',
    author_image: siteSettings.author_image || '',
    platform_preview_image: siteSettings.platform_preview_image || '',
  });

  const [uploadingImage, setUploadingImage] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setFormData({
      hero_title: siteSettings.hero_title || '',
      hero_subtitle: siteSettings.hero_subtitle || '',
      hero_badge: siteSettings.hero_badge || '',
      hero_support_text: siteSettings.hero_support_text || '',
      hero_price_original: siteSettings.hero_price_original || '',
      hero_price_discounted: siteSettings.hero_price_discounted || '',
      hero_price_discount_percent: siteSettings.hero_price_discount_percent || '',
      hero_cta_text: siteSettings.hero_cta_text || '',
      enable_top_banner: siteSettings.enable_top_banner === 'true',
      top_banner_text: siteSettings.top_banner_text || '',
      countdown_end_date: siteSettings.countdown_end_date || '',
      hero_video_url: siteSettings.hero_video_url || '',
      funnel_title: siteSettings.funnel_title || '',
      funnel_subtitle: siteSettings.funnel_subtitle || '',
      comparison_title: siteSettings.comparison_title || '',
      comparison_subtitle: siteSettings.comparison_subtitle || '',
      enable_paypal: siteSettings.enable_paypal === 'true',
      enable_stripe: siteSettings.enable_stripe === 'true',
      checkout_cover_image: siteSettings.checkout_cover_image || '',
      book_preview_image: siteSettings.book_preview_image || '',
      site_logo: siteSettings.site_logo || '',
      site_favicon: siteSettings.site_favicon || '',
      hero_image: siteSettings.hero_image || '',
      video_poster: siteSettings.video_poster || '',
      author_image: siteSettings.author_image || '',
      platform_preview_image: siteSettings.platform_preview_image || '',
    });
  }, [siteSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = (key: string) => {
    const val = typeof formData[key as keyof typeof formData] === 'boolean' 
      ? String(formData[key as keyof typeof formData]) 
      : formData[key as keyof typeof formData];
    updateSiteSetting(key, val as string);
    alert('تم حفظ الإعداد بنجاح');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploadingImage(prev => ({ ...prev, [fieldName]: true }));
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${fieldName}_${Math.random()}.${fileExt}`;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);

      const { url, error } = await uploadImageAdmin(formData);

      if (error || !url) {
        throw new Error(error || 'Failed to upload image');
      }

      setFormData(prev => ({ ...prev, [fieldName]: url }));
      updateSiteSetting(fieldName, url);
      alert('تم رفع وتحديث الصورة بنجاح!');
    } catch (error: any) {
      alert('خطأ أثناء رفع الصورة: ' + error.message);
    } finally {
      setUploadingImage(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white">إعدادات الموقع والنصوص الرئيسية</h3>
        <p className="text-xs text-gray-500">قم بتغيير العناوين والنصوص والصلاحيات مباشرة لتظهر للعملاء.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(formData).map((key) => {
          const val = formData[key as keyof typeof formData];
          return (
            <div key={key} className="bg-brand-darkgray p-6 rounded-2xl border border-brand-white/5 space-y-3">
              <label className="text-sm text-brand-gold font-bold block capitalize">{key.replace(/_/g, ' ')}</label>
              
              {key === 'checkout_cover_image' || key === 'book_preview_image' || key === 'site_logo' || key === 'site_favicon' || key === 'hero_image' || key === 'video_poster' || key === 'author_image' || key === 'platform_preview_image' ? (
                <div className="space-y-4">
                  <ImageUploader 
                    url={val as string || null}
                    config={(() => {
                      try {
                        return siteSettings[`${key}_config`] && siteSettings[`${key}_config`] !== 'undefined' ? JSON.parse(siteSettings[`${key}_config`]) : null;
                      } catch (e) {
                        return null;
                      }
                    })()}
                    onUrlChange={(newUrl) => {
                      setFormData(prev => ({ ...prev, [key]: newUrl }));
                      updateSiteSetting(key, newUrl);
                    }}
                    onConfigChange={(newConfig) => {
                      updateSiteSetting(`${key}_config`, JSON.stringify(newConfig));
                    }}
                  />
                </div>
              ) : typeof val === 'boolean' ? (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name={key}
                    checked={val}
                    onChange={handleChange}
                    className="w-5 h-5 accent-brand-purple"
                  />
                  <span className="text-white text-xs">تفعيل الميزة</span>
                </div>
              ) : key === 'countdown_end_date' ? (
                <input
                  type="datetime-local"
                  name={key}
                  value={val as string}
                  onChange={handleChange}
                  className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white text-xs"
                />
              ) : (
                <textarea
                  name={key}
                  value={val as string}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white resize-none text-xs"
                />
              )}
              
              {key !== 'checkout_cover_image' && key !== 'book_preview_image' && key !== 'site_logo' && key !== 'site_favicon' && key !== 'hero_image' && key !== 'video_poster' && key !== 'author_image' && key !== 'platform_preview_image' && (
                <button
                  onClick={() => handleSave(key)}
                  className="bg-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white font-bold px-4 py-2 text-xs rounded-lg transition"
                >
                  حفظ التعديل
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ComparisonTab() {
  const { comparisonItems, addComparisonItem, updateComparisonItem, deleteComparisonItem } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<ComparisonItem | null>(null);
  const [form, setForm] = useState({ aspect: '', beforeSystem: '', afterSystem: '', orderIndex: 1 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateComparisonItem(editingItem.id, form);
      setEditingItem(null);
    } else {
      addComparisonItem(form);
      setIsAdding(false);
    }
    setForm({ aspect: '', beforeSystem: '', afterSystem: '', orderIndex: comparisonItems.length + 2 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">إدارة جدول المقارنة (التحول)</h3>
          <p className="text-xs text-gray-500">عدّل ما قبل وما بعد الاستعانة بخدماتك.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-brand-gold text-brand-black px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> إضافة عنصر جديد
        </button>
      </div>

      {(isAdding || editingItem) && (
        <form onSubmit={handleSubmit} className="bg-brand-darkgray p-6 rounded-2xl border border-brand-gold/30 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">وجه المقارنة (الجانب)</label>
              <input required value={form.aspect} onChange={e => setForm({...form, aspect: e.target.value})} className="w-full bg-brand-black border border-brand-white/10 p-2 text-white rounded" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">قبل (بدون BLACK4ME)</label>
              <input required value={form.beforeSystem} onChange={e => setForm({...form, beforeSystem: e.target.value})} className="w-full bg-brand-black border border-brand-white/10 p-2 text-white rounded" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">بعد (مع BLACK4ME)</label>
              <input required value={form.afterSystem} onChange={e => setForm({...form, afterSystem: e.target.value})} className="w-full bg-brand-black border border-brand-white/10 p-2 text-white rounded" />
            </div>
          </div>
          <button type="submit" className="bg-brand-gold text-brand-black px-4 py-2 rounded font-bold text-xs">حفظ</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {comparisonItems.map(item => (
          <div key={item.id} className="bg-brand-darkgray p-4 rounded-xl border border-brand-white/5 flex flex-col gap-2">
            <span className="text-brand-purple text-xs font-bold">{item.aspect}</span>
            <div className="flex gap-4 text-[10px]">
              <div className="flex-1 bg-red-900/20 text-red-300 p-2 rounded">قبل: {item.beforeSystem}</div>
              <div className="flex-1 bg-green-900/20 text-green-300 p-2 rounded">بعد: {item.afterSystem}</div>
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => { setEditingItem(item); setForm({ aspect: item.aspect, beforeSystem: item.beforeSystem, afterSystem: item.afterSystem, orderIndex: item.orderIndex }); }} className="text-brand-gold text-[10px]">تعديل</button>
              <button onClick={() => deleteComparisonItem(item.id)} className="text-brand-red text-[10px]">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FunnelsTab() {
  const { funnelStages, addFunnelStage, updateFunnelStage, deleteFunnelStage } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<FunnelStage | null>(null);
  const [form, setForm] = useState({ num: 1, title: '', subtitle: '', details: '', badge: '', iconName: 'Layers' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateFunnelStage(editingItem.id, form);
      setEditingItem(null);
    } else {
      addFunnelStage(form);
      setIsAdding(false);
    }
    setForm({ num: funnelStages.length + 2, title: '', subtitle: '', details: '', badge: '', iconName: 'Layers' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">إدارة مراحل الفنل التسويقي</h3>
          <p className="text-xs text-gray-500">عدل وأضف خطوات الفنل المعروضة للمستخدم.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-brand-gold text-brand-black px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> إضافة مرحلة جديدة
        </button>
      </div>

      {(isAdding || editingItem) && (
        <form onSubmit={handleSubmit} className="bg-brand-darkgray p-6 rounded-2xl border border-brand-gold/30 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">العنوان الرئيسي</label>
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-brand-black border border-brand-white/10 p-2 text-white rounded" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">العنوان الفرعي</label>
              <input required value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} className="w-full bg-brand-black border border-brand-white/10 p-2 text-white rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-400 block mb-1">التفاصيل الكاملة</label>
              <textarea required rows={3} value={form.details} onChange={e => setForm({...form, details: e.target.value})} className="w-full bg-brand-black border border-brand-white/10 p-2 text-white rounded resize-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">الوسام (Badge)</label>
              <input required value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} className="w-full bg-brand-black border border-brand-white/10 p-2 text-white rounded" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">الترتيب الرقمي</label>
              <input type="number" required value={form.num} onChange={e => setForm({...form, num: Number(e.target.value)})} className="w-full bg-brand-black border border-brand-white/10 p-2 text-white rounded" />
            </div>
          </div>
          <button type="submit" className="bg-brand-gold text-brand-black px-4 py-2 rounded font-bold text-xs">حفظ</button>
        </form>
      )}

      <div className="space-y-4">
        {funnelStages.sort((a, b) => a.num - b.num).map(stage => (
          <div key={stage.id} className="bg-brand-darkgray p-4 rounded-xl border border-brand-white/5 flex justify-between items-center">
            <div>
              <span className="text-brand-purple text-[10px] font-bold">المرحلة {stage.num}</span>
              <h4 className="text-white font-bold text-sm">{stage.title}</h4>
              <p className="text-gray-400 text-xs">{stage.subtitle}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingItem(stage); setForm({ ...stage }); }} className="text-brand-gold text-[10px] bg-brand-gold/10 px-3 py-1 rounded">تعديل</button>
              <button onClick={() => deleteFunnelStage(stage.id)} className="text-brand-red text-[10px] bg-brand-red/10 px-3 py-1 rounded">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ValueStackTab() {
  const { valueStackItems, addValueStackItem, updateValueStackItem, deleteValueStackItem } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<ValueStackItem | null>(null);
  const [form, setForm] = useState({ name: '', realValue: 0, notes: '', orderIndex: 1 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateValueStackItem(editingItem.id, form);
      setEditingItem(null);
    } else {
      addValueStackItem(form);
      setIsAdding(false);
    }
    setForm({ name: '', realValue: 0, notes: '', orderIndex: valueStackItems.length + 2 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">إدارة الحزمة والقيمة المضافة</h3>
          <p className="text-xs text-gray-500">عدل عناصر القيمة التراكمية وأسعارها.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-brand-gold text-brand-black px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> إضافة قيمة جديدة
        </button>
      </div>

      {(isAdding || editingItem) && (
        <form onSubmit={handleSubmit} className="bg-brand-darkgray p-6 rounded-2xl border border-brand-gold/30 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs text-gray-400 block mb-1">اسم الميزة</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-brand-black border border-brand-white/10 p-2 text-white rounded" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">الملاحظات</label>
              <input required value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full bg-brand-black border border-brand-white/10 p-2 text-white rounded" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">القيمة المادية التقديرية ($)</label>
              <input type="number" required value={form.realValue} onChange={e => setForm({...form, realValue: Number(e.target.value)})} className="w-full bg-brand-black border border-brand-white/10 p-2 text-white rounded" />
            </div>
          </div>
          <button type="submit" className="bg-brand-gold text-brand-black px-4 py-2 rounded font-bold text-xs">حفظ</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {valueStackItems.map(item => (
          <div key={item.id} className="bg-brand-darkgray p-4 rounded-xl border border-brand-white/5 flex justify-between items-center">
            <div>
              <h4 className="text-white font-bold text-sm">{item.name}</h4>
              <p className="text-gray-400 text-xs">{item.notes}</p>
              <span className="text-brand-green font-mono text-[10px] block mt-1">${item.realValue} USD</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingItem(item); setForm({ ...item }); }} className="text-brand-gold text-[10px] bg-brand-gold/10 px-3 py-1 rounded">تعديل</button>
              <button onClick={() => deleteValueStackItem(item.id)} className="text-brand-red text-[10px] bg-brand-red/10 px-3 py-1 rounded">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CouponsTab() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<Coupon | null>(null);
  const [form, setForm] = useState({ code: '', discountPercent: 0, isActive: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateCoupon(editingItem.id!, form);
      setEditingItem(null);
    } else {
      addCoupon(form);
      setIsAdding(false);
    }
    setForm({ code: '', discountPercent: 0, isActive: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">إدارة كوبونات الخصم</h3>
          <p className="text-xs text-gray-500">أضف كوبونات ترويجية للعملاء.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-brand-gold text-brand-black px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> إضافة كوبون جديد
        </button>
      </div>

      {(isAdding || editingItem) && (
        <form onSubmit={handleSubmit} className="bg-brand-darkgray p-6 rounded-2xl border border-brand-gold/30 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">رمز الكوبون</label>
              <input required value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="w-full bg-brand-black border border-brand-white/10 p-2 text-white rounded font-mono uppercase" placeholder="SUMMER50" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">نسبة الخصم (%)</label>
              <input type="number" required max={100} min={1} value={form.discountPercent} onChange={e => setForm({...form, discountPercent: Number(e.target.value)})} className="w-full bg-brand-black border border-brand-white/10 p-2 text-white rounded" />
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-4 h-4" />
              <label className="text-xs text-gray-400 block">نشط ومفعل للاستخدام</label>
            </div>
          </div>
          <button type="submit" className="bg-brand-gold text-brand-black px-4 py-2 rounded font-bold text-xs">حفظ</button>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {coupons.map(item => (
          <div key={item.id} className="bg-brand-darkgray p-4 rounded-xl border border-brand-white/5 flex flex-col justify-between items-start gap-4">
            <div>
              <div className="flex gap-2 items-center">
                <h4 className="text-white font-mono text-lg font-bold">{item.code}</h4>
                <span className={`px-2 py-0.5 rounded text-[9px] ${item.isActive ? 'bg-brand-green/20 text-brand-green' : 'bg-brand-red/20 text-brand-red'}`}>
                  {item.isActive ? 'نشط' : 'معطل'}
                </span>
              </div>
              <p className="text-brand-purple font-bold mt-1 text-sm">خصم {item.discountPercent}%</p>
            </div>
            <div className="flex gap-2 w-full mt-2">
              <button onClick={() => { setEditingItem(item); setForm({ ...item }); }} className="flex-1 text-center bg-brand-white/5 hover:bg-brand-white/10 text-brand-gold text-[10px] py-1.5 rounded transition">تعديل</button>
              <button onClick={() => deleteCoupon(item.id!)} className="flex-1 text-center bg-brand-red/10 hover:bg-brand-red/20 text-brand-red text-[10px] py-1.5 rounded transition">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




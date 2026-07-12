"use client";

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Edit2, Trash2, Save, X, ImageIcon } from 'lucide-react';
import { useAutoSave } from '../../../hooks/useAutoSave';
import { deleteAdminProduct } from '../../../server/actions/products';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  sale_price?: number;
  salePrice?: number;
  file_url?: string;
  fileUrl?: string;
  payment_link?: string;
  paymentLink?: string;
  is_active?: boolean;
  isActive?: boolean;
  created_at?: string;
  features?: string[];
  chapters?: string[];
  category_id?: string | null;
  slug?: string;
  benefits?: string[];
  images?: string[];
}

export default function ProductsManager() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const initialForm = { 
    title: '', description: '', price: 49, sale_price: 0, 
    file_url: '', payment_link: '', is_active: true, 
    features: '', chapters: '', benefits: '',
    category_id: '', slug: '', images: [] as string[]
  };

  const { data: productForm, updateData: setProductForm, clearDraft } = useAutoSave({
    key: 'product_form_v2',
    initialData: initialForm,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name').order('order_index', { ascending: true });
    if (data) setCategories(data);
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    if (!editingProduct) {
      setProductForm({ title, slug: generateSlug(title) });
    } else {
      setProductForm({ title });
    }
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm(initialForm);
    setShowProductForm(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      title: p.title,
      description: p.description || '',
      price: p.price || 0,
      sale_price: p.sale_price || p.salePrice || 0,
      file_url: p.file_url || p.fileUrl || '',
      payment_link: p.payment_link || p.paymentLink || '',
      is_active: p.is_active ?? p.isActive ?? true,
      features: p.features?.join('\n') || '',
      chapters: p.chapters?.join('\n') || '',
      benefits: p.benefits?.join('\n') || '',
      category_id: p.category_id || '',
      slug: p.slug || '',
      images: p.images || []
    });
    setShowProductForm(true);
  };

  const handleProductSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const pData = {
      title: productForm.title,
      description: productForm.description,
      price: productForm.price,
      sale_price: productForm.sale_price,
      file_url: productForm.file_url,
      payment_link: productForm.payment_link,
      is_active: productForm.is_active,
      benefits: (productForm.benefits || '').split('\n').filter(Boolean),
      category_id: productForm.category_id || null,
      slug: productForm.slug || null,
      images: productForm.images || []
    };

    if (editingProduct) {
      const { error } = await supabase.from('products').update(pData).eq('id', editingProduct.id);
      if (error) {
        alert('حدث خطأ أثناء الحفظ: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('products').insert([pData]);
      if (error) {
        alert('حدث خطأ أثناء الحفظ: ' + error.message);
        return;
      }
    }
    
    clearDraft();
    setShowProductForm(false);
    fetchProducts();
    alert('تم الحفظ بنجاح');
  };

  const deleteProduct = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      const res = await deleteAdminProduct(id);
      if (res?.error) {
        alert('حدث خطأ أثناء الحذف: ' + res.error);
      } else {
        alert('تم الحذف بنجاح');
        fetchProducts();
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setUploadingFile(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error } = await supabase.storage.from('products').upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
      setProductForm({ file_url: publicUrl });
      alert('تم رفع الملف بنجاح!');
    } catch (error: any) {
      alert('حدث خطأ أثناء رفع الملف: ' + error.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `img-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      // Assuming a public 'products' bucket or 'images' bucket. Using 'products' for now.
      const { error } = await supabase.storage.from('products').upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
      setProductForm({ images: [...(productForm.images || []), publicUrl] });
    } catch (error: any) {
      alert('حدث خطأ أثناء رفع الصورة: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...productForm.images];
    newImages.splice(index, 1);
    setProductForm({ images: newImages });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">إدارة المنتجات الرقمية</h2>
          <p className="text-gray-400 text-sm">أضف وعدّل وتحكم في الكتب والخدمات المعروضة في الموقع.</p>
        </div>
        <button onClick={openAddProduct} className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black text-sm px-4 py-2.5 rounded-xl transition">
          <Plus className="w-4 h-4" /> منتج جديد
        </button>
      </div>

      {showProductForm && (
        <div className="bg-[#0a0a0a] border border-[#F5C542]/30 rounded-2xl p-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-[#F5C542]">{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
            <button onClick={() => setShowProductForm(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleProductSave} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-400 mb-1.5">التصنيف</label>
                <select value={productForm.category_id} onChange={e => setProductForm({category_id: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]">
                  <option value="">بدون تصنيف</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">اسم المنتج *</label>
                <input required type="text" value={productForm.title} onChange={e => handleTitleChange(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">الرابط المخصص (Slug) *</label>
                <input required type="text" value={productForm.slug} onChange={e => setProductForm({slug: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" dir="ltr" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-400 mb-1.5">وصف المنتج القصير *</label>
                <textarea required rows={2} value={productForm.description} onChange={e => setProductForm({description: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF] resize-none" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-400 mb-1.5">الفوائد (كل فائدة في سطر جديد)</label>
                <textarea rows={3} value={productForm.benefits} onChange={e => setProductForm({benefits: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF] resize-none" placeholder="ماذا سيستفيد العميل من هذا المنتج؟" />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-400 mb-1.5">محتويات / فصول المنتج (كل فصل في سطر)</label>
                <textarea rows={3} value={productForm.chapters} onChange={e => setProductForm({chapters: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF] resize-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">السعر الأصلي ($)</label>
                <input type="number" value={productForm.price} onChange={e => setProductForm({price: Number(e.target.value)})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#6C3BFF]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">سعر العرض ($)</label>
                <input type="number" value={productForm.sale_price} onChange={e => setProductForm({sale_price: Number(e.target.value)})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#6C3BFF]" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-400 mb-1.5">صور المنتج</label>
                <div className="flex gap-4 flex-wrap mb-2">
                  {productForm.images?.map((img: string, i: number) => (
                    <div key={i} className="relative w-20 h-20 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center group">
                      <img src={img} alt="" className="max-w-full max-h-full rounded-lg" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 bg-white/5 rounded-lg border border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition">
                    <ImageIcon className="w-5 h-5 text-gray-400 mb-1" />
                    <span className="text-[10px] text-gray-400">إضافة صورة</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                </div>
                {uploadingImage && <span className="text-xs text-[#F5C542]">جاري رفع الصورة...</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">رابط التحميل المباشر للملف</label>
                <input type="url" value={productForm.file_url} onChange={e => setProductForm({file_url: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" dir="ltr" />
                <div className="mt-2">
                  <input type="file" onChange={handleFileUpload} disabled={uploadingFile} className="w-full text-white text-xs" />
                  {uploadingFile && <span className="text-xs text-[#F5C542] block mt-1">جاري رفع الملف...</span>}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">رابط الدفع (اختياري)</label>
                <input type="url" value={productForm.payment_link} onChange={e => setProductForm({payment_link: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" dir="ltr" />
              </div>

              <div className="sm:col-span-2 flex items-center gap-3">
                <input type="checkbox" id="isActive" checked={productForm.is_active} onChange={e => setProductForm({is_active: e.target.checked})} className="w-4 h-4 accent-[#6C3BFF]" />
                <label htmlFor="isActive" className="text-sm text-gray-300 cursor-pointer">منشور ومرئي</label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black px-6 py-2.5 rounded-xl transition">
                <Save className="w-4 h-4" /> حفظ المنتج
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => {
          const categoryName = categories.find(c => c.id === p.category_id)?.name;
          return (
            <div key={p.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex flex-col">
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-bold text-white">{p.title}</h3>
                  {categoryName && (
                    <span className="text-[10px] font-bold bg-[#6C3BFF]/20 text-[#6C3BFF] px-2 py-0.5 rounded-full whitespace-nowrap">
                      {categoryName}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">{p.description}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[#F5C542] font-black font-mono text-base">${p.sale_price || p.salePrice || p.price}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-4">
                <button onClick={() => openEditProduct(p)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white border border-white/10 hover:border-[#6C3BFF]/40 hover:bg-[#6C3BFF]/10 py-2 rounded-xl transition">
                  <Edit2 className="w-3.5 h-3.5" /> تعديل
                </button>
                <button onClick={() => deleteProduct(p.id)} className="flex items-center justify-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/10 w-10 h-9 rounded-xl transition">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

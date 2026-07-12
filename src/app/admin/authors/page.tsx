"use client";

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Users } from 'lucide-react';
import Image from 'next/image';
import { Author } from '@/types';

export default function AuthorsAdmin() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [authors, setAuthors] = useState<Author[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    const { data } = await supabase.from('authors').select('*').order('name');
    if (data) setAuthors(data);
  };

  const openAdd = () => {
    setEditingAuthor(null);
    setName('');
    setTitle('');
    setAvatarUrl('');
    setBio('');
    setInstagramUrl('');
    setFacebookUrl('');
    setWhatsappUrl('');
    setShowEditor(true);
  };

  const openEdit = (author: Author) => {
    setEditingAuthor(author);
    setName(author.name);
    setTitle(author.title || '');
    setAvatarUrl(author.avatar_url || '');
    setBio(author.bio || '');
    setInstagramUrl(author.social_links?.instagram || '');
    setFacebookUrl(author.social_links?.facebook || '');
    setWhatsappUrl(author.social_links?.whatsapp || '');
    setShowEditor(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `author-${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('products').upload(fileName, file); 
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
      setAvatarUrl(publicUrl);
    } catch (error: any) {
      alert('حدث خطأ أثناء الرفع: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const saveAuthor = async () => {
    if (!name) return alert('الرجاء إدخال اسم الكاتب');

    const payload = {
      name, title, avatar_url: avatarUrl,
      bio, social_links: { instagram: instagramUrl, facebook: facebookUrl, whatsapp: whatsappUrl }
    };

    if (editingAuthor) {
      const { error } = await supabase.from('authors').update(payload).eq('id', editingAuthor.id);
      if (error) alert(error.message);
      else { alert('تم الحفظ بنجاح'); setShowEditor(false); fetchAuthors(); }
    } else {
      const { error } = await supabase.from('authors').insert([payload]);
      if (error) alert(error.message);
      else { alert('تم الإنشاء بنجاح'); setShowEditor(false); fetchAuthors(); }
    }
  };

  const deleteAuthor = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الكاتب؟ (لن يتم حذف مقالاته المرتبطة، بل ستبقى بدون مؤلف)')) {
      await supabase.from('authors').delete().eq('id', id);
      fetchAuthors();
    }
  };

  if (showEditor) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white mb-1">{editingAuthor ? 'تعديل الكاتب' : 'إضافة كاتب جديد'}</h2>
            <p className="text-gray-400 text-sm">إدارة حسابات الكتّاب</p>
          </div>
          <button onClick={() => setShowEditor(false)} className="text-gray-400 hover:text-white p-2 bg-white/5 rounded-xl hover:bg-white/10 transition"><X className="w-5 h-5" /></button>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border border-white/10 bg-[#222] shrink-0 group">
              {avatarUrl ? (
                <>
                   <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <ImageIcon className="w-6 h-6 text-white"/>
                   </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 group-hover:text-white transition">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
              <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
            </div>
            <div>
               <h3 className="text-white font-bold mb-1">الصورة الشخصية</h3>
               <p className="text-xs text-gray-500">يُفضل رفع صورة مربعة (1:1) وبحجم لا يتجاوز 1 ميجابايت.</p>
               {uploadingImage && <p className="text-xs text-[#F5C542] mt-2">جاري الرفع...</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-bold text-gray-400 mb-1.5">الاسم الكامل</label>
                 <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="مثال: جاسم النبهان"
                   className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F5C542]" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-400 mb-1.5">المسمى الوظيفي</label>
                 <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="مثال: مستشار تسويقي"
                   className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F5C542]" />
               </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">النبذة التعريفية (Bio)</label>
              <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="اكتب نبذة قصيرة تظهر في بطاقة الكاتب أسفل المقال..."
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F5C542] resize-y" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
               <div>
                 <label className="block text-xs font-bold text-gray-400 mb-1.5">إنستغرام (اختياري)</label>
                 <input type="text" value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/..." dir="ltr"
                   className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F5C542] text-left" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-400 mb-1.5">فيسبوك (اختياري)</label>
                 <input type="text" value={facebookUrl} onChange={e => setFacebookUrl(e.target.value)} placeholder="https://facebook.com/..." dir="ltr"
                   className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F5C542] text-left" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-400 mb-1.5">واتساب (اختياري)</label>
                 <input type="text" value={whatsappUrl} onChange={e => setWhatsappUrl(e.target.value)} placeholder="wa.me/..." dir="ltr"
                   className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F5C542] text-left" />
               </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
             <button onClick={saveAuthor} className="bg-[#F5C542] hover:bg-yellow-400 text-black font-black px-8 py-3 rounded-xl transition">
               {editingAuthor ? 'تحديث البيانات' : 'إضافة الكاتب'}
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">الكتّاب والمؤلفين</h2>
          <p className="text-gray-400 text-sm">إدارة بيانات الكتّاب لربطها بالمقالات.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black text-sm px-4 py-2.5 rounded-xl transition">
          <Plus className="w-4 h-4" /> إضافة كاتب
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         {authors.map(author => (
           <div key={author.id} className="bg-[#111] border border-white/10 rounded-2xl p-6 relative group flex flex-col items-center text-center">
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
               <button onClick={() => openEdit(author)} className="p-2 text-gray-400 hover:text-white bg-black/50 hover:bg-[#222] rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
               <button onClick={() => deleteAuthor(author.id)} className="p-2 text-red-400 hover:text-red-300 bg-black/50 hover:bg-red-500/10 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
             </div>
             
             <div className="w-20 h-20 rounded-full overflow-hidden mb-4 relative bg-[#222]">
               {author.avatar_url ? (
                  <Image src={author.avatar_url} alt={author.name} fill className="object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500"><Users className="w-8 h-8"/></div>
               )}
             </div>
             
             <h3 className="text-white font-bold text-lg mb-1">{author.name}</h3>
             <p className="text-[#F5C542] text-sm mb-3">{author.title || 'كاتب'}</p>
             {author.bio && <p className="text-gray-400 text-xs line-clamp-2">{author.bio}</p>}
           </div>
         ))}
         
         {authors.length === 0 && (
            <div className="md:col-span-3 text-center py-12 bg-[#0a0a0a] border border-white/5 rounded-2xl">
               <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
               <p className="text-gray-500">لا يوجد كتّاب مضافين بعد.</p>
            </div>
         )}
      </div>
    </div>
  );
}

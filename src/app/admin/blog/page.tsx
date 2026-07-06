"use client";

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Video, Box, PenTool, LayoutTemplate, Tag } from 'lucide-react';
import Image from 'next/image';

interface Block {
  id: string;
  type: 'text' | 'product' | 'consultation' | 'video';
  content?: string;
  productId?: string;
  consultationId?: string;
  videoUrl?: string;
}

export default function BlogAdmin() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [posts, setPosts] = useState<any[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [authorName, setAuthorName] = useState('فريق BLACK4ME');
  const [publishDate, setPublishDate] = useState('');
  const [publishTime, setPublishTime] = useState('');
  const [tags, setTags] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [status, setStatus] = useState('draft');
  const [uploadingImage, setUploadingImage] = useState(false);

  // References for products and consultations
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchPosts();
    fetchProducts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').eq('is_active', true);
    if (data) setProducts(data);
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) setSlug(generateSlug(val));
  };

  const openAdd = () => {
    setEditingPost(null);
    setTitle('');
    setSubtitle('');
    setSlug('');
    setFeaturedImage('');
    setAuthorName('فريق BLACK4ME');
    const now = new Date();
    setPublishDate(now.toISOString().split('T')[0]);
    setPublishTime(now.toTimeString().substring(0,5));
    setTags('');
    setBlocks([{ id: Date.now().toString(), type: 'text', content: '' }]);
    setStatus('draft');
    setShowEditor(true);
  };

  const openEdit = (post: any) => {
    setEditingPost(post);
    setTitle(post.title);
    setSubtitle(post.subtitle || '');
    setSlug(post.slug);
    setFeaturedImage(post.featured_image || '');
    setAuthorName(post.author_name || 'فريق BLACK4ME');
    if (post.publish_date) {
      const d = new Date(post.publish_date);
      setPublishDate(d.toISOString().split('T')[0]);
      setPublishTime(d.toTimeString().substring(0,5));
    }
    setTags((post.tags || []).join(', '));
    setBlocks(post.content_blocks && post.content_blocks.length > 0 ? post.content_blocks : [{ id: Date.now().toString(), type: 'text', content: '' }]);
    setStatus(post.status);
    setShowEditor(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `blog-${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('products').upload(fileName, file); // using products bucket for now
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
      setFeaturedImage(publicUrl);
    } catch (error: any) {
      alert('حدث خطأ أثناء الرفع: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const savePost = async (newStatus: string) => {
    if (!title || !slug) return alert('الرجاء إدخال العنوان والرابط المخصص');
    
    let combinedDate = null;
    if (publishDate && publishTime) {
      combinedDate = new Date(`${publishDate}T${publishTime}:00Z`).toISOString();
    }

    const payload = {
      title, subtitle, slug, featured_image: featuredImage,
      author_name: authorName, publish_date: combinedDate,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      content_blocks: blocks, status: newStatus
    };

    if (editingPost) {
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', editingPost.id);
      if (error) alert(error.message);
      else { alert('تم الحفظ بنجاح'); setShowEditor(false); fetchPosts(); }
    } else {
      const { error } = await supabase.from('blog_posts').insert([payload]);
      if (error) alert(error.message);
      else { alert('تم الإنشاء بنجاح'); setShowEditor(false); fetchPosts(); }
    }
  };

  // Block handlers
  const addBlock = (type: Block['type']) => {
    setBlocks([...blocks, { id: Date.now().toString(), type, content: '' }]);
  };
  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };
  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return;
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    setBlocks(newBlocks);
  };

  const deletePost = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المقالة؟')) {
      await supabase.from('blog_posts').delete().eq('id', id);
      fetchPosts();
    }
  };

  if (showEditor) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white mb-1">{editingPost ? 'تعديل تدوينة' : 'إنشاء تدوينة جديدة'}</h2>
            <p className="text-gray-400 text-sm">محرر المقالات المتقدم</p>
          </div>
          <button onClick={() => setShowEditor(false)} className="text-gray-400 hover:text-white p-2 bg-white/5 rounded-xl hover:bg-white/10 transition"><X className="w-5 h-5" /></button>
        </div>

        {/* Top Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-400 mb-2">صورة المقالة الرئيسية</label>
            <div className="bg-[#111] border-2 border-dashed border-white/10 rounded-2xl h-40 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#F5C542]/50 transition cursor-pointer">
              {featuredImage ? (
                <>
                  <Image src={featuredImage} alt="Featured" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="text-white font-bold text-sm">تغيير الصورة</span>
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-gray-500 mb-2" />
                  <span className="text-sm font-bold text-gray-400 group-hover:text-[#F5C542] transition">Featured Image</span>
                </>
              )}
              <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
            </div>
            {uploadingImage && <p className="text-xs text-[#F5C542] mt-2">جاري الرفع...</p>}
          </div>

          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">العنوان الأساسي للمقالة (H1)</label>
              <input type="text" value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="مثال: 5 استراتيجيات تسويقية لزيادة مبيعاتك"
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F5C542]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">العنوان الفرعي (H2) (اختياري)</label>
              <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="العنوان الفرعي"
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F5C542]" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">اسم الناشر (التوقيع)</label>
                <input type="text" value={authorName} onChange={e => setAuthorName(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F5C542]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">تاريخ النشر</label>
                <input type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F5C542]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">الوقت</label>
                <input type="time" value={publishTime} onChange={e => setPublishTime(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F5C542]" />
              </div>
            </div>
          </div>
        </div>

        {/* Editor Controls */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-4 mt-8">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
            <span className="text-sm font-bold text-white ml-4">إضافة محتوى:</span>
            <button onClick={() => addBlock('text')} className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg text-sm transition"><PenTool className="w-4 h-4"/> نص</button>
            <button onClick={() => addBlock('product')} className="flex items-center gap-1.5 bg-[#F5C542]/10 hover:bg-[#F5C542]/20 text-[#F5C542] px-3 py-1.5 rounded-lg text-sm transition"><Box className="w-4 h-4"/> منتج</button>
            <button onClick={() => addBlock('consultation')} className="flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg text-sm transition"><LayoutTemplate className="w-4 h-4"/> استشارة</button>
            <button onClick={() => addBlock('video')} className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-sm transition"><Video className="w-4 h-4"/> فيديو يوتيوب</button>
          </div>

          <div className="space-y-4">
            {blocks.map((block, index) => (
              <div key={block.id} className="relative group bg-[#0a0a0a] border border-white/5 p-4 rounded-xl">
                {/* Block Controls (Hover) */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-[#111] p-1 rounded-lg border border-white/10 transition z-10">
                  <button onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-white disabled:opacity-30">↑</button>
                  <button onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="p-1 text-gray-400 hover:text-white disabled:opacity-30">↓</button>
                  <button onClick={() => removeBlock(block.id)} className="p-1 text-red-400 hover:text-red-300 ml-1"><Trash2 className="w-3.5 h-3.5"/></button>
                </div>

                {/* Block Content */}
                {block.type === 'text' && (
                  <div className="pt-2">
                    <label className="text-xs text-gray-500 mb-1 block">محتوى نصي (يدعم HTML)</label>
                    <textarea rows={4} value={block.content || ''} onChange={e => updateBlock(block.id, { content: e.target.value })}
                      className="w-full bg-transparent text-white focus:outline-none resize-y" placeholder="اكتب فقرتك هنا..." />
                  </div>
                )}
                
                {block.type === 'product' && (
                  <div className="pt-2">
                    <label className="text-xs text-[#F5C542] mb-1 flex items-center gap-1"><Box className="w-3 h-3"/> بطاقة منتج</label>
                    <select value={block.productId || ''} onChange={e => updateBlock(block.id, { productId: e.target.value })}
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                      <option value="">اختر المنتج...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                  </div>
                )}

                {block.type === 'consultation' && (
                  <div className="pt-2">
                    <label className="text-xs text-blue-400 mb-1 flex items-center gap-1"><LayoutTemplate className="w-3 h-3"/> بطاقة استشارة</label>
                    {/* For demo, using same products dropdown or specific id. Ideally you have a consultations table */}
                    <input type="text" value={block.consultationId || ''} onChange={e => updateBlock(block.id, { consultationId: e.target.value })}
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none" placeholder="معرف الاستشارة (ID)" />
                    <p className="text-[10px] text-gray-500 mt-1">عند النقر في واجهة الزائر: سيظهر التقييم والسعر والتفاصيل للاستشارة الشخصية.</p>
                  </div>
                )}

                {block.type === 'video' && (
                  <div className="pt-2">
                    <label className="text-xs text-red-400 mb-1 flex items-center gap-1"><Video className="w-3 h-3"/> فيديو يوتيوب מخصص</label>
                    <input type="text" value={block.videoUrl || ''} onChange={e => updateBlock(block.id, { videoUrl: e.target.value })}
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none" dir="ltr" placeholder="https://www.youtube.com/watch?v=..." />
                    <p className="text-[10px] text-gray-500 mt-1">سيتم عرض الفيديو بأدوات تحكم أساسية وبدون هوية القناة لضمان احترافية المحتوى.</p>
                  </div>
                )}
              </div>
            ))}
            {blocks.length === 0 && <p className="text-center text-gray-500 text-sm py-4">لا توجد محتويات. أضف نصاً أو منتجاً للبدء.</p>}
          </div>
        </div>

        {/* Footer Settings */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 mt-6">
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-2"><Tag className="w-4 h-4"/> الكلمات المفتاحية (Tags)</label>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="التسويق الإلكتروني, زيادة المبيعات, BLACK4ME (مفصول بفاصلة)"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F5C542]" />
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
            <button onClick={() => savePost('draft')} className="bg-transparent border border-white/20 hover:border-white/40 text-white font-bold px-6 py-3 rounded-xl transition">
              حفظ مسودة
            </button>
            <button onClick={() => savePost('published')} className="bg-[#F5C542] hover:bg-yellow-400 text-black font-black px-8 py-3 rounded-xl transition">
              نشر التدوينة
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
          <h2 className="text-2xl font-black text-white mb-1">المدونة</h2>
          <p className="text-gray-400 text-sm">إدارة المقالات والمحتوى التسويقي.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black text-sm px-4 py-2.5 rounded-xl transition">
          <Plus className="w-4 h-4" /> تدوينة جديدة
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-xs font-bold text-gray-400">
              <th className="p-4">العنوان</th>
              <th className="p-4 w-32">المؤلف</th>
              <th className="p-4 w-32 text-center">الحالة</th>
              <th className="p-4 w-40 text-center">التاريخ</th>
              <th className="p-4 w-32 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-white/5 transition">
                <td className="p-4 font-bold text-white">
                  {post.title}
                  <span className="block text-xs font-normal text-gray-500 mt-1" dir="ltr">/{post.slug}</span>
                </td>
                <td className="p-4 text-gray-400">{post.author_name}</td>
                <td className="p-4 text-center">
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wide ${post.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                    {post.status === 'published' ? 'منشور' : 'مسودة'}
                  </span>
                </td>
                <td className="p-4 text-center text-gray-400">{new Date(post.created_at).toLocaleDateString('ar-SA')}</td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openEdit(post)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => deletePost(post.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">لا توجد مقالات حالياً.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, Star } from 'lucide-react';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  sale_price?: number;
  category_id: string;
  images?: string[];
}

export default function ProductsSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadData() {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          supabase.from('categories').select('*').eq('is_active', true).order('order_index'),
          supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false })
        ]);

        if (catsRes.data) setCategories(catsRes.data);
        if (prodsRes.data) setProducts(prodsRes.data);
      } catch (e) {
        console.error('Error fetching store data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="py-20 text-center text-white/50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-gold mx-auto mb-4"></div>
        جاري تحميل المنتجات...
      </div>
    );
  }

  return (
    <section id="products-section" className="py-20 bg-brand-black text-brand-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">متجر منتجات <span className="text-brand-gold">BLACK4ME</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">كل ما تحتاجه لتطوير عملك وزيادة مبيعاتك في مكان واحد.</p>
        </div>

        <div className="space-y-20">
          {categories.map(category => {
            const categoryProducts = products.filter(p => p.category_id === category.id);
            if (categoryProducts.length === 0) return null;

            return (
              <div key={category.id} className="space-y-8">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-8 bg-brand-gold rounded-full"></span>
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-400 mt-2 pr-4">{category.description}</p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryProducts.map(product => (
                    <Link href={`/product/${product.slug}`} key={product.id} className="group bg-[#0a0a0a] border border-white/5 hover:border-brand-purple/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col">
                      {product.images && product.images.length > 0 ? (
                        <div className="aspect-video relative overflow-hidden bg-white/5">
                          <Image src={product.images[0]} alt={product.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition duration-500" />
                        </div>
                      ) : (
                        <div className="aspect-video bg-white/5 flex items-center justify-center text-white/20">
                          لا توجد صورة
                        </div>
                      )}
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-brand-gold transition">{product.title}</h4>
                        <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{product.description}</p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-white">${product.sale_price || product.price}</span>
                            {product.sale_price && product.sale_price < product.price && (
                              <span className="text-xs text-gray-500 line-through">${product.price}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-brand-gold bg-brand-gold/10 px-2 py-1 rounded-full">
                            <span>عرض التفاصيل</span>
                            <ArrowLeft className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          
          {categories.length === 0 && products.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Fallback if no categories exist */}
              {products.map(product => (
                    <Link href={`/product/${product.slug}`} key={product.id} className="group bg-[#0a0a0a] border border-white/5 hover:border-brand-purple/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col">
                      {product.images && product.images.length > 0 ? (
                        <div className="aspect-video relative overflow-hidden bg-white/5">
                          <Image src={product.images[0]} alt={product.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition duration-500" />
                        </div>
                      ) : (
                        <div className="aspect-video bg-white/5 flex items-center justify-center text-white/20">
                          لا توجد صورة
                        </div>
                      )}
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-brand-gold transition">{product.title}</h4>
                        <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{product.description}</p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-white">${product.sale_price || product.price}</span>
                            {product.sale_price && product.sale_price < product.price && (
                              <span className="text-xs text-gray-500 line-through">${product.price}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-brand-gold bg-brand-gold/10 px-2 py-1 rounded-full">
                            <span>عرض التفاصيل</span>
                            <ArrowLeft className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

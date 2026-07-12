"use server";

import { unstable_cache } from 'next/cache';
import { supabaseAdmin } from '../../lib/supabase-admin';
import { Product } from '../../types';

const fetchProducts = unstable_cache(async () => {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data;
}, ['cms-products'], { revalidate: 900, tags: ['products'] });

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fetchProducts();

    return (data || []).map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      price: row.price,
      salePrice: row.sale_price || undefined,
      fileUrl: row.file_url || undefined,
      paymentLink: row.payment_link || undefined,
      features: row.features || [],
      chapters: row.chapters || [],
      images: row.images || [],
      benefits: row.benefits || [],
      categoryId: row.category_id || undefined,
      slug: row.slug || undefined,
      isActive: row.is_active ?? true,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error('getProducts failed:', error);
    return [];
  }
}
export async function deleteAdminProduct(id: string) {
  try {
    const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('deleteAdminProduct error:', err);
    return { error: err.message };
  }
}

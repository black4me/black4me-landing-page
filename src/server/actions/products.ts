"use server";

import { supabaseAdmin } from '../../lib/supabase-admin';
import { Product } from '../../types';

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

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
      isActive: row.is_active ?? true,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error('getProducts failed:', error);
    return [];
  }
}

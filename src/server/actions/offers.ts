"use server";

import { supabaseAdmin } from '../../lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function getOfferBySlug(slug: string) {
  try {
    const { data, error } = await supabaseAdmin
      .schema('crm')
      .from('offer_pages')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching offer:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Exception fetching offer:', err);
    return null;
  }
}

export async function getAllOffers() {
  try {
    const { data, error } = await supabaseAdmin
      .schema('crm')
      .from('offer_pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data || [];
  } catch (err) {
    console.error('Exception fetching offers:', err);
    return [];
  }
}

export async function upsertOffer(offerData: any) {
  try {
    // 1. Validate and normalize the slug
    if (!offerData.slug || typeof offerData.slug !== 'string') {
      return { success: false, error: 'الرابط المختصر (slug) مطلوب.' };
    }

    const normalizedSlug = offerData.slug
      .toLowerCase()
      .trim()
      .replace(/[\s/_\\]+/g, '-') // Replace spaces, slashes, and underscores with hyphens
      .replace(/[^a-z0-9-]/g, '') // Remove unauthorized characters (keep a-z, 0-9, and hyphen)
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end

    if (!normalizedSlug) {
      return { success: false, error: 'الرابط المختصر غير صالح. يجب أن يحتوي على أحرف إنجليزية وأرقام.' };
    }

    // 2. Check for uniqueness
    let query = supabaseAdmin
      .schema('crm')
      .from('offer_pages')
      .select('id')
      .eq('slug', normalizedSlug);
      
    if (offerData.id) {
      query = query.neq('id', offerData.id);
    }
    
    const { data: existing, error: queryError } = await query.maybeSingle();

    if (queryError && queryError.code !== 'PGRST116') {
      throw new Error('Error checking slug uniqueness: ' + queryError.message);
    }

    if (existing) {
      return { success: false, error: 'هذا الرابط المختصر مستخدم مسبقاً. يرجى اختيار رابط مختلف.' };
    }

    // 3. Save the offer with the normalized slug
    const { data, error } = await supabaseAdmin
      .schema('crm')
      .from('offer_pages')
      .upsert({
        id: offerData.id || undefined,
        slug: normalizedSlug,
        type: offerData.type,
        title: offerData.title,
        subtitle: offerData.subtitle,
        description: offerData.description,
        button_text: offerData.button_text,
        image_url: offerData.image_url,
        is_active: offerData.is_active,
        enable_timer: offerData.enable_timer,
        timer_start: offerData.timer_start || null,
        timer_end: offerData.timer_end || null,
        redirect_url: offerData.redirect_url,
        email_subject: offerData.email_subject || '',
        email_body: offerData.email_body || '',
        display_mode: offerData.display_mode || 'standalone_page',
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    
    // Invalidate the cache for this offer page
    if (offerData.slug) {
      revalidatePath(`/offer/${offerData.slug}`);
    }
    if (normalizedSlug !== offerData.slug) {
      revalidatePath(`/offer/${normalizedSlug}`);
    }
    revalidatePath('/admin/crm/offers');

    return { success: true, data };
  } catch (err: any) {
    console.error('Failed to upsert offer:', err);
    return { success: false, error: err.message };
  }
}

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
    const { data, error } = await supabaseAdmin
      .schema('crm')
      .from('offer_pages')
      .upsert({
        id: offerData.id || undefined,
        slug: offerData.slug,
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
    revalidatePath('/admin/crm/offers');

    return { success: true, data };
  } catch (err: any) {
    console.error('Failed to upsert offer:', err);
    return { success: false, error: err.message };
  }
}

"use server";

import { supabaseAdmin } from '../../lib/supabase-admin';
import { trackEvent, upsertUser } from './tracking';

export interface OfferPage {
  id?: string;
  slug: string;
  type: 'free_gift' | 'paid_offer' | 'discount' | 'product' | 'service';
  title: string;
  subtitle?: string;
  description?: string;
  button_text?: string;
  image_url?: string;
  is_active: boolean;
  enable_timer: boolean;
  timer_start?: string | null;
  timer_end?: string | null;
  redirect_url?: string;
  display_mode?: string;
  created_at?: string;
  updated_at?: string;
}

// Fetch all offer pages for admin crm
export async function getOfferPages(): Promise<OfferPage[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('offer_pages')
      .select('*')
      .order('created_at', { ascending: false });

    // Fallback/check if we need schema specification
    if (error) {
      // Try with explicit schema if default search path doesn't include crm
      const { data: crmData, error: crmError } = await supabaseAdmin
        .schema('crm')
        .from('offer_pages')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (crmError) throw crmError;
      return crmData || [];
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching offer pages:', error);
    return [];
  }
}

// Fetch single offer page by slug
export async function getOfferPageBySlug(slug: string): Promise<OfferPage | null> {
  try {
    const { data, error } = await supabaseAdmin
      .schema('crm')
      .from('offer_pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      // Try without schema schema override if client setup handles search path
      const { data: defaultData, error: defaultError } = await supabaseAdmin
        .from('offer_pages')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (defaultError) throw defaultError;
      return defaultData;
    }
    return data;
  } catch (error) {
    console.error(`Error fetching offer page for slug ${slug}:`, error);
    return null;
  }
}

// Save or Update offer page
export async function saveOfferPage(offer: OfferPage): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const dataToSave = {
      slug: offer.slug,
      type: offer.type,
      title: offer.title,
      subtitle: offer.subtitle || '',
      description: offer.description || '',
      button_text: offer.button_text || 'احصل عليه الآن',
      image_url: offer.image_url || null,
      is_active: offer.is_active,
      enable_timer: offer.enable_timer,
      timer_end: offer.timer_end || null,
      redirect_url: offer.redirect_url || '',
      updated_at: new Date().toISOString(),
    };

    if (offer.id) {
      // Update
      const { data, error } = await supabaseAdmin
        .schema('crm')
        .from('offer_pages')
        .update(dataToSave)
        .eq('id', offer.id)
        .select();

      if (error) throw error;
      return { success: true, data };
    } else {
      // Insert
      const { data, error } = await supabaseAdmin
        .schema('crm')
        .from('offer_pages')
        .insert([{ ...dataToSave, created_at: new Date().toISOString() }])
        .select();

      if (error) throw error;
      return { success: true, data };
    }
  } catch (error: any) {
    console.error('Error saving offer page:', error);
    return { success: false, error: error.message };
  }
}

// Delete offer page
export async function deleteOfferPage(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .schema('crm')
      .from('offer_pages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting offer page:', error);
    return { success: false, error: error.message };
  }
}

// Register dynamic offer lead
export async function registerOfferLead(payload: {
  name: string;
  email: string;
  slug: string;
  offerId: string;
  type: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}) {
  try {
    const { name, email, slug, offerId, type, utmSource, utmMedium, utmCampaign } = payload;

    // 1. Record lead in crm.leads
    const { error: leadError } = await supabaseAdmin
      .schema('crm')
      .from('leads')
      .insert([{
        full_name: name,
        email: email,
        lead_source: `offer_page:${slug}`,
        campaign: type,
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
        status: 'new'
      }]);

    if (leadError) {
      console.error('Error inserting into crm.leads:', leadError);
    }

    // 2. Upsert in public.users to maintain main audience list
    await upsertUser({
      email,
      name,
      status: 'lead'
    });

    // 3. Track events in public.events
    const eventParams = {
      offer_id: offerId,
      slug,
      type,
      is_free: type === 'free_gift'
    };

    await trackEvent({
      eventType: 'DynamicOfferClaimed',
      userEmail: email,
      utmSource,
      utmMedium,
      utmCampaign,
      parameters: eventParams
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error registering lead:', error);
    return { success: false, error: error.message };
  }
}

"use server";

import { supabaseAdmin } from '../../lib/supabase-admin';
import { FAQ, Testimonial, SiteSettings, ComparisonItem, FunnelStage, ValueStackItem } from '../../types';

export async function getFAQs(): Promise<FAQ[]> {
  try {
    const { data } = await supabaseAdmin.from('faqs').select('*').order('order_index', { ascending: true });
    return (data || []).map(row => ({
      id: row.id,
      question: row.question,
      answer: row.answer,
      orderIndex: row.order_index ?? 1,
    }));
  } catch (error) {
    console.error('getFAQs error', error);
    return [];
  }
}

export async function getTestimonials(filter?: { productId?: string; serviceType?: string; showOnHomepage?: boolean }): Promise<Testimonial[]> {
  try {
    let query = supabaseAdmin
      .from('testimonials')
      .select('*')
      .eq('status', 'approved');
      
    if (filter?.productId) {
      query = query.eq('product_id', filter.productId);
    }
    if (filter?.serviceType) {
      query = query.eq('service_type', filter.serviceType);
    }
    if (filter?.showOnHomepage) {
      query = query.eq('show_on_homepage', true);
    }

    const { data } = await query.order('created_at', { ascending: false });
    return (data || []).map(row => ({
      id: row.id,
      customerName: row.customer_name,
      country: row.country,
      rating: row.rating,
      comment: row.comment,
      isApproved: row.status === 'approved',
      status: row.status,
      serviceType: row.service_type || 'general',
      productId: row.product_id,
      userEmail: row.user_email,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error('getTestimonials error', error);
    return [];
  }
}

export async function getSiteSettings(): Promise<Partial<SiteSettings>> {
  try {
    const { data } = await supabaseAdmin.from('site_settings').select('*');
    const settings: any = {};
    if (data) {
      data.forEach(item => {
        settings[item.key] = item.value;
      });
    }
    return settings;
  } catch (error) {
    console.error('getSiteSettings error', error);
    return {};
  }
}

export async function getComparisonItems(): Promise<ComparisonItem[]> {
  try {
    const { data } = await supabaseAdmin.from('comparison_items').select('*').order('order_index', { ascending: true });
    return (data || []).map(row => ({
      id: row.id,
      aspect: row.aspect,
      beforeSystem: row.before_system,
      afterSystem: row.after_system,
      orderIndex: row.order_index ?? 0,
    }));
  } catch (error) {
    return [];
  }
}

export async function getFunnelStages(): Promise<FunnelStage[]> {
  try {
    const { data } = await supabaseAdmin.from('funnel_stages').select('*').order('num', { ascending: true });
    return (data || []).map(row => ({
      id: row.id,
      num: row.num,
      title: row.title,
      subtitle: row.subtitle,
      details: row.details,
      badge: row.badge,
      iconName: row.icon_name || 'Layers',
    }));
  } catch (error) {
    return [];
  }
}

export async function getValueStackItems(): Promise<ValueStackItem[]> {
  try {
    const { data } = await supabaseAdmin.from('value_stack_items').select('*').order('order_index', { ascending: true });
    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      realValue: row.real_value,
      notes: row.notes || '',
      orderIndex: row.order_index ?? 0,
    }));
  } catch (error) {
    return [];
  }
}

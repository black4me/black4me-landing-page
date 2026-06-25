"use server";

import { supabaseAdmin } from '../../lib/supabase-admin';
import { Order, NewsletterSubscriber, Consultation, Coupon, Testimonial } from '../../types';

export async function getAdminOrders(): Promise<Order[]> {
  try {
    const { data } = await supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false });
    return (data || []).map(row => ({
      id: row.id,
      customerId: row.customer_id || '',
      customerName: row.customer_name || '',
      customerEmail: row.customer_email,
      productId: row.product_id,
      productTitle: row.product_title || '',
      amount: row.amount,
      paymentGateway: row.payment_gateway as 'stripe' | 'paypal' | 'spaceremit',
      status: row.status as 'pending' | 'completed' | 'failed' | 'pending_verification',
      receiptUrl: row.receipt_url,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error('getAdminOrders error', error);
    return [];
  }
}

export async function getAdminSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const { data } = await supabaseAdmin.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      country: row.country,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error('getAdminSubscribers error', error);
    return [];
  }
}

export async function getAdminConsultations(): Promise<Consultation[]> {
  try {
    const { data } = await supabaseAdmin.from('consultations').select('*').order('created_at', { ascending: false });
    return (data || []).map(row => ({
      id: row.id,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      appointmentDate: row.appointment_date,
      appointmentTime: row.appointment_time,
      status: row.status as 'scheduled' | 'completed' | 'cancelled',
      notes: row.notes,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error('getAdminConsultations error', error);
    return [];
  }
}

export async function getAdminCoupons(): Promise<Coupon[]> {
  try {
    const { data } = await supabaseAdmin.from('coupons').select('*');
    return (data || []).map(row => ({
      id: row.id,
      code: row.code,
      discountPercent: row.discount_percentage,
      isActive: row.is_active ?? true,
    }));
  } catch (error) {
    console.error('getAdminCoupons error', error);
    return [];
  }
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    // Fetches ALL testimonials including pending ones for the admin moderation
    const { data } = await supabaseAdmin.from('testimonials').select('*').order('created_at', { ascending: false });
    return (data || []).map(row => ({
      id: row.id,
      customerName: row.customer_name,
      country: row.country,
      rating: row.rating,
      comment: row.comment,
      isApproved: row.is_approved,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error('getAllTestimonials error', error);
    return [];
  }
}

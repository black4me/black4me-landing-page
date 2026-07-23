"use server";

import { supabaseAdmin } from '../../lib/supabase-admin';
import { revalidatePath, revalidateTag } from 'next/cache';
import { Order, NewsletterSubscriber, Consultation, Coupon, Testimonial } from '../../types';
import { sendWelcomeEmail, sendReviewRequestEmail } from './email';

export async function updateAdminSiteSetting(key: string, value: string) {
  try {
    const { error } = await supabaseAdmin.from('site_settings').upsert(
      { key, value },
      { onConflict: 'key' }
    );
    if (error) throw error;
    revalidatePath('/', 'layout');
    // @ts-ignore - Next.js turbopack type definition mismatch
    revalidateTag('settings');
    return { success: true };
  } catch (err: any) {
    console.error('updateAdminSiteSetting error:', err);
    return { error: err.message };
  }
}

export async function uploadImageAdmin(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;

    if (!file || !fileName) {
      return { error: 'No file or fileName provided' };
    }

    const { error: uploadError } = await supabaseAdmin.storage
      .from('products')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data: urlData } = supabaseAdmin.storage.from('products').getPublicUrl(fileName);
    return { url: urlData.publicUrl };
  } catch (err: any) {
    console.error('uploadImageAdmin error:', err);
    return { error: err.message };
  }
}

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
    const { data } = await supabaseAdmin.from('subscribers').select('*').order('created_at', { ascending: false });
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
      isApproved: row.status === 'approved',
      status: row.status || 'pending',
      serviceType: row.service_type || 'general',
      productId: row.product_id,
      userEmail: row.user_email,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error('getAllTestimonials error', error);
    return [];
  }
}

export async function approveOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Fetch order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw orderError || new Error('Order not found');
    }

    if (order.status === 'completed') {
      return { success: true }; // Already approved
    }

    // 2. Fetch product details
    let productTitle = 'المنتج';
    let fileUrl = null;
    if (order.product_id) {
      const { data: product } = await supabaseAdmin
        .from('products')
        .select('title, file_url')
        .eq('id', order.product_id)
        .single();
      
      if (product) {
        productTitle = product.title;
        fileUrl = product.file_url;
      }
    }

    // 3. Grant access
    const { error: accessError } = await supabaseAdmin.from('user_access').insert({
      customer_email: order.customer_email,
      product_id: order.product_id,
      product_title: productTitle,
      file_url: fileUrl,
      order_id: order.id,
      payment_gateway: order.payment_gateway,
    });

    if (accessError) {
      throw accessError;
    }

    // 4. Update order status
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ status: 'completed' })
      .eq('id', orderId);

    if (updateError) {
      throw updateError;
    }

    // 5. Send welcome email (which contains the password if it's their first time, or just login link)
    await sendWelcomeEmail(order.customer_email, order.customer_name || '', orderId);
    await sendReviewRequestEmail(order.customer_email, order.customer_name || '', 'product', orderId, productTitle);

    return { success: true };
  } catch (err: any) {
    console.error('approveOrder error:', err);
    return { success: false, error: err.message };
  }
}

export async function getPrivateSettings() {
  try {
    const { data } = await supabaseAdmin.from('private_settings').select('*');
    const settings: Record<string, string> = {};
    if (data) {
      data.forEach(row => {
        settings[row.key] = row.value;
      });
    }
    return { settings };
  } catch (error: any) {
    console.error('getPrivateSettings error:', error);
    return { error: error.message };
  }
}

export async function updatePrivateSetting(key: string, value: string) {
  try {
    const { error } = await supabaseAdmin.from('private_settings').upsert({ key, value });
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('updatePrivateSetting error:', err);
    return { error: err.message };
  }
}

export async function getSignedUploadUrlAdmin(fileName: string): Promise<{ signedUrl?: string; path?: string; token?: string; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('products')
      .createSignedUploadUrl(fileName);

    if (error) {
      return { error: error.message };
    }

    return { 
      signedUrl: data?.signedUrl, 
      path: data?.path, 
      token: data?.token 
    };
  } catch (err: any) {
    console.error('getSignedUploadUrlAdmin error:', err);
    return { error: err.message };
  }
}

export async function getCustomerHistoryAdmin(email: string) {
  try {
    const [ordersRes, leadMagnetsRes, consultationsRes] = await Promise.all([
      supabaseAdmin.from('orders').select('*').eq('customer_email', email),
      supabaseAdmin.from('lead_magnets').select('*').eq('email', email),
      supabaseAdmin.from('consultations').select('*').eq('customer_email', email),
    ]);

    const history: any[] = [];

    if (ordersRes.data) {
      ordersRes.data.forEach(order => {
        history.push({ type: 'order', date: order.created_at, details: order });
      });
    }

    if (leadMagnetsRes.data) {
      leadMagnetsRes.data.forEach(lm => {
        history.push({ type: 'lead_magnet', date: lm.created_at, details: lm });
      });
    }

    if (consultationsRes.data) {
      consultationsRes.data.forEach(cons => {
        history.push({ type: 'consultation', date: cons.created_at, details: cons });
      });
    }

    history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return history;
  } catch (err: any) {
    console.error('getCustomerHistoryAdmin error:', err);
    return [];
  }
}


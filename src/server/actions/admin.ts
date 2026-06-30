"use server";

import { supabaseAdmin } from '../../lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { Order, NewsletterSubscriber, Consultation, Coupon, Testimonial } from '../../types';
import { sendWelcomeEmail } from './email';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function requireAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  const adminEmails = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
    : ['info@black4me.com', 'admin@black4me.com', 'black4mestore@gmail.com'];
    
  if (!user.email || !adminEmails.includes(user.email.toLowerCase())) {
    throw new Error('Forbidden');
  }
}

export async function updateAdminSiteSetting(key: string, value: string) {
  try {
    await requireAdmin();
    const { error } = await supabaseAdmin.from('site_settings').upsert({ key, value });
    if (error) throw error;
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.error('updateAdminSiteSetting error:', err);
    return { error: err.message };
  }
}

export async function uploadImageAdmin(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    await requireAdmin();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;

    if (!file || !fileName) {
      return { error: 'No file or fileName provided' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from('products')
      .upload(fileName, buffer, { 
        upsert: true,
        contentType: file.type
      });

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
    await requireAdmin();
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
    await requireAdmin();
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
    await requireAdmin();
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
    await requireAdmin();
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
    await requireAdmin();
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

export async function approveOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
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

    return { success: true };
  } catch (err: any) {
    console.error('approveOrder error:', err);
    return { success: false, error: err.message };
  }
}



export async function getPrivateSettings() {
  try {
    await requireAdmin();
    const { data, error } = await supabaseAdmin.from('private_settings').select('*');
    if (error) {
      if (error.code === '42P01') {
        // Table doesn't exist yet
        return { settings: {} };
      }
      throw error;
    }
    const settingsObj: Record<string, string> = {};
    if (data) {
      data.forEach(item => {
        if (item.value && item.value.length > 8 && item.key.includes('SECRET')) {
          // Mask secrets (show first 3 and last 3 characters)
          const val = item.value;
          settingsObj[item.key] = `${val.substring(0, 3)}...${val.substring(val.length - 3)}`;
        } else {
          settingsObj[item.key] = item.value;
        }
      });
    }
    return { settings: settingsObj };
  } catch (err: any) {
    console.error('getPrivateSettings error:', err);
    return { error: err.message };
  }
}

export async function updatePrivateSetting(key: string, value: string) {
  try {
    await requireAdmin();
    const { error } = await supabaseAdmin.from('private_settings').upsert({ key, value });
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('updatePrivateSetting error:', err);
    return { error: err.message };
  }
}

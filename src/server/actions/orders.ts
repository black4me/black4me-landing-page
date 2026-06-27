"use server";

import { supabaseAdmin } from '../../lib/supabase-admin';
import { sendToActivepieces } from '../../lib/activepieces';
import { trackEvent, upsertUser } from './tracking';

export async function createOrder(payload: {
  productId: string;
  productTitle: string;
  customerEmail: string;
  customerName?: string;
  amount: number;
  paymentGateway: 'stripe' | 'paypal';
}) {
  try {
    const { data, error } = await supabaseAdmin.from('orders').insert([{
      product_id: payload.productId,
      customer_email: payload.customerEmail,
      customer_name: payload.customerName || '',
      amount: payload.amount,
      payment_gateway: payload.paymentGateway,
      status: 'pending',
    }]).select().single();

    if (error) {
      console.error('Error creating order:', error);
      return { success: false, error: error.message };
    }

    // Upsert User as lead
    await upsertUser({
      email: payload.customerEmail,
      name: payload.customerName || '',
      status: 'lead'
    });

    // Track abandoned cart (it becomes an order later)
    await trackEvent({
      eventType: 'abandoned_cart',
      userEmail: payload.customerEmail,
      parameters: { productId: payload.productId, amount: payload.amount }
    });

    return { success: true, orderId: data.id };
  } catch (err: any) {
    console.error('Exception creating order:', err);
    return { success: false, error: err.message };
  }
}

export async function grantAccess(customerEmail: string, productId: string, orderId: string) {
  try {
    // Fetch product details
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('id, title, file_url, price')
      .eq('id', productId)
      .single();

    // Insert into user_access — this is what the portal reads
    const { error } = await supabaseAdmin.from('user_access').insert({
      customer_email: customerEmail,
      product_id: product?.id || productId,
      product_title: product?.title || 'المنتج',
      file_url: product?.file_url || null,
      order_id: orderId,
      payment_gateway: 'manual',
    });

    if (error) {
      console.error('Error granting access:', error);
      return { success: false, error: error.message };
    }

    // Track purchase success
    await trackEvent({
      eventType: 'purchase_success',
      userEmail: customerEmail,
      parameters: { productId: product?.id || productId, orderId, productTitle: product?.title || 'المنتج' }
    });

    // Upsert User as VIP
    await upsertUser({
      email: customerEmail,
      status: 'vip',
      revenue: product?.price || 0 // Warning: product price might need fetching or passed
    });

    // Notify Activepieces of a successful purchase
    await sendToActivepieces(process.env.ACTIVEPIECES_WEBHOOK_URL_PURCHASE, {
      event: 'purchase_completed',
      customerEmail,
      productId: product?.id || productId,
      productTitle: product?.title || 'المنتج',
      orderId,
    });

    return { success: true };
  } catch (err: any) {
    console.error('Exception granting access:', err);
    return { success: false, error: err.message };
  }
}


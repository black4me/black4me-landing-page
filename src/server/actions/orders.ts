"use server";

import { supabaseAdmin } from '../../lib/supabase-admin';

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
      product_title: payload.productTitle,
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

    return { success: true, orderId: data.id };
  } catch (err: any) {
    console.error('Exception creating order:', err);
    return { success: false, error: err.message };
  }
}

export async function grantAccess(customerEmail: string, productId: string) {
  try {
    // Basic implementation: Add the user/product pair to a `user_products` or just log it
    // If you have a specific table for access, you'd insert here.
    // e.g. await supabaseAdmin.from('user_access').upsert({ email: customerEmail, product_id: productId })

    // If customer doesn't exist in system, you might create an auth account here
    // using supabaseAdmin.auth.admin.createUser({...})

    return { success: true };
  } catch (err: any) {
    console.error('Exception granting access:', err);
    return { success: false, error: err.message };
  }
}

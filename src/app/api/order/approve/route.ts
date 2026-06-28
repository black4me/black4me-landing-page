import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-admin';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import WelcomeEmail from '../../../../emails/WelcomeEmail';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    // 1. Fetch the order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'pending_verification') {
      return NextResponse.json({ error: 'Order is not pending verification' }, { status: 400 });
    }

    // 2. Update order to completed
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ status: 'completed' })
      .eq('id', orderId);

    if (updateError) {
      throw updateError;
    }

    // 3. Fetch product details
    let fileUrl = null;
    let productTitle = 'المنتج';
    if (order.product_id) {
      const { data: prod } = await supabaseAdmin
        .from('products')
        .select('id, title, file_url')
        .eq('id', order.product_id)
        .single();
      if (prod) {
        fileUrl = prod.file_url;
        productTitle = prod.title;
      }
    }

    // 4. Grant full access to the product
    await supabaseAdmin.from('user_access').insert({
      customer_email: order.customer_email,
      product_id: order.product_id,
      product_title: productTitle,
      file_url: fileUrl,
      order_id: orderId,
      payment_gateway: order.payment_gateway || 'manual',
    });
    // 5. Send Welcome Email via Resend
    if (process.env.RESEND_API_KEY && order.customer_email) {
      try {
        const htmlContent = await render(
          React.createElement(WelcomeEmail, {
            userFirstname: order.customer_email.split('@')[0],
            downloadLink: fileUrl
          } as any)
        );

        await resend.emails.send({
          from: 'BLACK4ME <noreply@black4me.com>',
          to: order.customer_email,
          subject: 'شكرًا لطلبك من Black4me!',
          html: htmlContent,
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Order approval error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

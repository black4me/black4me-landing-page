import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-admin';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import WelcomeEmail from '../../../../emails/WelcomeEmail';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      console.error('Invalid JSON in SpaceRemit webhook payload');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    
    // Log headers and body for debugging during initial live phase
    const headers = Object.fromEntries(req.headers.entries());
    console.log('SpaceRemit Webhook received. Headers:', headers);
    console.log('SpaceRemit Webhook payload:', JSON.stringify(body));

    // Try to extract email from the generic JSON structures payment gateways use
    const customerEmail = body.email || body.customer?.email || body.data?.email || body.payer_email || body.customerEmail;
    const status = body.status || body.data?.status;

    if (!customerEmail) {
      console.error('No email found in payload, cannot match order');
      return NextResponse.json({ received: true });
    }

    // Usually payment gateways send a success status like 'success', 'paid', 'completed', 'approved'
    // If there is a status field and it's not successful, we ignore it. 
    // If no status field exists, we tentatively assume success if the webhook was triggered for "payment success".
    if (status) {
      const isSuccess = ['success', 'paid', 'completed', 'approved'].includes(String(status).toLowerCase());
      if (!isSuccess) {
        console.log(`Payment not successful, status: ${status}`);
        return NextResponse.json({ received: true });
      }
    }

    // Find the pending order for this email
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('customer_email', customerEmail)
      .eq('payment_gateway', 'spaceremit')
      .eq('status', 'pending_verification')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (orderError || !order) {
      console.error('No pending SpaceRemit order found for email:', customerEmail);
      return NextResponse.json({ received: true });
    }

    // Mark order as completed
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ status: 'completed' })
      .eq('id', order.id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    // Fetch product details
    let fileUrl = null;
    let productTitle = 'المنتج';
    let productDbId = order.product_id;

    if (order.product_id) {
      const { data: prod } = await supabaseAdmin
        .from('products')
        .select('id, title, file_url')
        .eq('id', order.product_id)
        .single();
      if (prod) {
        fileUrl = prod.file_url;
        productTitle = prod.title;
        productDbId = prod.id;
      }
    }

    // Grant full access to the purchased product
    await supabaseAdmin.from('user_access').insert({
      customer_email: customerEmail,
      product_id: productDbId,
      product_title: productTitle,
      file_url: fileUrl,
      order_id: order.id,
      payment_gateway: 'spaceremit',
    });

    // Send Welcome Email via Resend
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
        console.log('Welcome email sent to', order.customer_email);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error in SpaceRemit webhook:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

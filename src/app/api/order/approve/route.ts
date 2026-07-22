import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-admin';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import UnifiedEmail from '../../../../emails/UnifiedEmail';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

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

    // 5. Send Unified Welcome Email (newsletter + blog CTAs included)
    if (process.env.RESEND_API_KEY && order.customer_email) {
      // Fetch site_settings for author photo + name
      const { data: settingsData } = await supabaseAdmin.from('site_settings').select('*');
      const settings = (settingsData || []).reduce((acc: any, row: any) => {
        acc[row.key] = row.value;
        return acc;
      }, {} as Record<string, string>);

      try {
        const htmlContent = await render(
          React.createElement(UnifiedEmail, {
            userFirstname: order.customer_name || order.customer_email.split('@')[0],
            type: 'purchase',
            downloadLink: fileUrl || 'https://black4me.com/portal',
            productTitle,
            blogUrl: 'https://black4me.com/blog',
            newsletterUrl: 'https://black4me.com/#free-gift',
            instagramUrl: 'https://www.instagram.com/black4mee/',
            authorPhotoUrl: settings?.author_photo_url,
            authorName: settings?.author_name || 'جاسم محمد',
            customerEmail: order.customer_email,
            tempPassword: 'تم إرسالها مسبقاً' // Or generated if there is an integration
          } as any)
        );

        await resend.emails.send({
          from: 'جاسم محمد — BLACK4ME <noreply@black4me.com>',
          to: order.customer_email,
          subject: `🎉 طلبك جاهز يا ${order.customer_name || 'صديقي'} — ابدأ الآن`,
          html: htmlContent,
        });

        // Admin notification
        const adminHtml = `
          <div dir="rtl" style="font-family:sans-serif;padding:20px;background:#f9f9f9;border-radius:8px">
            <h2 style="color:#22C55E">🎉 طلب جديد تم تأكيده!</h2>
            <p>العميل: ${order.customer_name || ''} (${order.customer_email})</p>
            <p>المنتج: ${productTitle}</p>
            <p>المبلغ: $${order.amount || 0}</p>
            <p>رقم الطلب: #${orderId.slice(-8).toUpperCase()}</p>
          </div>
        `;
        await resend.emails.send({
          from: 'BLACK4ME System <noreply@black4me.com>',
          to: 'black4mestore@gmail.com',
          subject: '🎉 طلب مؤكد: ' + productTitle,
          html: adminHtml,
        });
      } catch (emailError) {
        console.error('Failed to send emails:', emailError);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Order approval error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

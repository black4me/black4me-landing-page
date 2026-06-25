"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function sendWelcomeEmail(email: string, name: string, orderId: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY missing, skipping email to', email);
      return { success: true };
    }

    await resend.emails.send({
      from: 'BLACK4ME <noreply@black4me.com>',
      to: email,
      subject: '✅ تم تأكيد طلبك - الدخول لنظام BLACK4ME',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6C3BFF;">مرحباً ${name || 'صديقي'}!</h2>
          <p>تم استلام طلبك بنجاح (رقم الطلب: ${orderId}).</p>
          <p>يمكنك الآن الوصول إلى المنتجات الرقمية والحزمة الشاملة عبر الرابط التالي:</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/portal" style="display: inline-block; padding: 12px 24px; background-color: #F5C542; color: #000; text-decoration: none; font-weight: bold; border-radius: 8px;">دخول البوابة التعليمية</a>
          <p>شكراً لثقتك بنا.</p>
          <p>فريق <strong>BLACK4ME</strong></p>
        </div>
      `
    });

    return { success: true };
  } catch (err: any) {
    console.error('Error sending welcome email:', err.message);
    return { success: false, error: err.message };
  }
}

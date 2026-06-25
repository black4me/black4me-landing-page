"use server";

import { Resend } from 'resend';
import { supabaseAdmin } from '../../lib/supabase-admin';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function sendWelcomeEmail(email: string, name: string, orderId: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY missing, skipping email to', email);
      return { success: true };
    }

    // Fetch order and product details
    const { data: order } = await supabaseAdmin.from('orders').select('*, product:products(*)').eq('id', orderId).single();
    
    const productName = order?.product?.title || 'الحزمة الشاملة';
    const productPrice = order?.amount || '49.00';
    const productImage = order?.product?.file_url || 'https://www.black4me.com/assets/default-product.png'; // Fallback image if any

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تأكيد الطلب - BLACK4ME</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #000000; color: #ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0A; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #111111; border-radius: 16px; overflow: hidden; border: 1px solid rgba(245, 197, 66, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, rgba(108,59,255,0.1), rgba(245,197,66,0.1)); border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <h1 style="margin: 0; color: #F5C542; font-size: 28px; letter-spacing: 2px;">BLACK4ME</h1>
                    <p style="margin: 10px 0 0 0; color: #888; font-size: 16px;">فاتورة وتأكيد طلبك</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #6C3BFF; margin-top: 0; font-size: 24px;">مرحباً ${name || 'صديقي'}! 👋</h2>
                    <p style="color: #dddddd; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                      يسعدنا جداً انضمامك إلينا. تم تأكيد طلبك بنجاح، ونحن متحمسون جداً لتبدأ رحلتك معنا. يمكنك الوصول لمنتجك مباشرة من خلال البوابة.
                    </p>

                    <!-- Order Details Box -->
                    <div style="background-color: #1A1A1A; border-radius: 12px; padding: 25px; margin-bottom: 30px; border: 1px solid rgba(255,255,255,0.05);">
                      <h3 style="margin: 0 0 15px 0; color: #F5C542; font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">تفاصيل الطلب</h3>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-bottom: 15px;">
                            <p style="margin: 0; color: #888; font-size: 14px;">رقم الطلب</p>
                            <p style="margin: 5px 0 0 0; color: #fff; font-size: 16px; font-weight: bold;">#${orderId.slice(-8).toUpperCase()}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05);">
                            <p style="margin: 0; color: #888; font-size: 14px;">المنتج</p>
                            <p style="margin: 5px 0 0 0; color: #fff; font-size: 16px; font-weight: bold;">${productName}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05);">
                            <p style="margin: 0; color: #888; font-size: 14px;">المبلغ المدفوع</p>
                            <p style="margin: 5px 0 0 0; color: #22C55E; font-size: 18px; font-weight: bold;">$${productPrice}</p>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 10px 0 30px 0;">
                          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/portal" style="display: inline-block; padding: 16px 32px; background-color: #F5C542; color: #000000; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 8px; box-shadow: 0 4px 15px rgba(245, 197, 66, 0.3);">
                            الدخول للبوابة وبدء الاستخدام
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Founder Note -->
                    <div style="border-right: 3px solid #6C3BFF; padding-right: 15px; margin-top: 20px;">
                      <p style="color: #cccccc; font-style: italic; line-height: 1.6; margin: 0 0 15px 0;">
                        "أشكرك شخصياً على ثقتك بمنتجاتنا. لقد بنينا هذا النظام بكل شغف واهتمام بأدق التفاصيل لنقدم لك تجربة استثنائية. أتمنى لك كل التوفيق والنجاح، وأنا وفريقي دائماً هنا لدعمك."
                      </p>
                      <p style="margin: 0; color: #F5C542; font-weight: bold;">- جاسم محمد</p>
                      <p style="margin: 5px 0 0 0; color: #888; font-size: 12px;">مؤسس BLACK4ME</p>
                    </div>
                  </td>
                </tr>

                <!-- Footer / Contact Links -->
                <tr>
                  <td style="padding: 30px; background-color: #0A0A0A; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
                    <p style="margin: 0 0 20px 0; color: #888; font-size: 14px;">يسعدنا تواصلك معنا عبر القنوات التالية:</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                      <tr>
                        <td align="center">
                          <!-- WhatsApp -->
                          <a href="https://wa.me/96879191793" style="display: inline-block; margin: 0 10px; color: #22C55E; text-decoration: none; font-weight: bold;">
                            📱 واتساب
                          </a>
                          <!-- Instagram -->
                          <a href="https://www.instagram.com/black4mee/?hl=en" style="display: inline-block; margin: 0 10px; color: #E1306C; text-decoration: none; font-weight: bold;">
                            📸 انستجرام (@black4mee)
                          </a>
                          <!-- Email -->
                          <a href="mailto:black4mestore@gmail.com" style="display: inline-block; margin: 0 10px; color: #6C3BFF; text-decoration: none; font-weight: bold;">
                            ✉️ الإيميل
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 0; color: #555; font-size: 12px;">
                      © ${new Date().getFullYear()} BLACK4ME. جميع الحقوق محفوظة.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await resend.emails.send({
      from: 'BLACK4ME <noreply@black4me.com>',
      to: email,
      subject: '✅ تم تأكيد طلبك - الدخول لنظام BLACK4ME',
      html: htmlContent
    });

    return { success: true };
  } catch (err: any) {
    console.error('Error sending welcome email:', err.message);
    return { success: false, error: err.message };
  }
}

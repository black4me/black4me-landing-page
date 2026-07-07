"use server";

import { Resend } from 'resend';
import { supabaseAdmin } from '../../lib/supabase-admin';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendWelcomeEmail(email: string, name: string, orderId: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY missing, skipping email to', email);
      return { success: true };
    }

    // Fetch order and product details
    const { data: order } = await supabaseAdmin.from('orders').select('*, product:products(*)').eq('id', orderId).single();
    
    // Generate access code if it doesn't exist
    let accessCode = order?.access_code;
    if (!accessCode) {
      accessCode = 'B4M-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      // Update order with the new access code
      await supabaseAdmin.from('orders').update({ access_code: accessCode }).eq('id', orderId);
    }

    const productName = order?.product?.title || 'ط§ظ„ط­ط²ظ…ط© ط§ظ„ط´ط§ظ…ظ„ط©';
    const productPrice = order?.amount || '49.00';
    const productImage = order?.product?.file_url || 'https://www.black4me.com/assets/default-product.png'; // Fallback image if any

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>طھط£ظƒظٹط¯ ط§ظ„ط·ظ„ط¨ - BLACK4ME</title>
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
                    <p style="margin: 10px 0 0 0; color: #888; font-size: 16px;">ظپط§طھظˆط±ط© ظˆطھط£ظƒظٹط¯ ط·ظ„ط¨ظƒ</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #6C3BFF; margin-top: 0; font-size: 24px;">ظ…ط±ط­ط¨ط§ظ‹ ${name || 'طµط¯ظٹظ‚ظٹ'}! ًں‘‹</h2>
                    <p style="color: #dddddd; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                      ظٹط³ط¹ط¯ظ†ط§ ط¬ط¯ط§ظ‹ ط§ظ†ط¶ظ…ط§ظ…ظƒ ط¥ظ„ظٹظ†ط§. طھظ… طھط£ظƒظٹط¯ ط·ظ„ط¨ظƒ ط¨ظ†ط¬ط§ط­طŒ ظˆظ†ط­ظ† ظ…طھط­ظ…ط³ظˆظ† ط¬ط¯ط§ظ‹ ظ„طھط¨ط¯ط£ ط±ط­ظ„طھظƒ ظ…ط¹ظ†ط§. ظٹظ…ظƒظ†ظƒ ط§ظ„ظˆطµظˆظ„ ظ„ظ„ط£ظƒط§ط¯ظٹظ…ظٹط© ظپظˆط±ط§ظ‹ ظ…ظ† ط®ظ„ط§ظ„ ط§ظ„ظƒظˆط¯ ط§ظ„ط®ط§طµ ط¨ظƒ ط£ط¯ظ†ط§ظ‡.
                    </p>

                    <!-- Order Details Box -->
                    <div style="background-color: #1A1A1A; border-radius: 12px; padding: 25px; margin-bottom: 30px; border: 1px solid rgba(255,255,255,0.05);">
                      <h3 style="margin: 0 0 15px 0; color: #F5C542; font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">طھظپط§طµظٹظ„ ط§ظ„ط·ظ„ط¨</h3>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-bottom: 15px;">
                            <p style="margin: 0; color: #888; font-size: 14px;">ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨</p>
                            <p style="margin: 5px 0 0 0; color: #fff; font-size: 16px; font-weight: bold;">#${orderId.slice(-8).toUpperCase()}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05);">
                            <p style="margin: 0; color: #888; font-size: 14px;">ط§ظ„ظ…ظ†طھط¬</p>
                            <p style="margin: 5px 0 0 0; color: #fff; font-size: 16px; font-weight: bold;">${productName}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05);">
                            <p style="margin: 0; color: #888; font-size: 14px;">ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ظ…ط¯ظپظˆط¹</p>
                            <p style="margin: 5px 0 0 0; color: #22C55E; font-size: 18px; font-weight: bold;">$${productPrice}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05);">
                            <p style="margin: 0; color: #888; font-size: 14px;">ظƒظˆط¯ ط§ظ„ط¯ط®ظˆظ„ ظ„ظ„ط£ظƒط§ط¯ظٹظ…ظٹط©</p>
                            <div style="background: #222; padding: 10px; border-radius: 6px; margin-top: 8px; text-align: center; border: 1px dashed #6C3BFF;">
                              <p style="margin: 0; color: #F5C542; font-size: 20px; font-weight: bold; letter-spacing: 2px;">${accessCode}</p>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 10px 0 30px 0;">
                          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/academy" style="display: inline-block; padding: 16px 32px; background-color: #F5C542; color: #000000; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 8px; box-shadow: 0 4px 15px rgba(245, 197, 66, 0.3);">
                            ط§ظ„ط¯ط®ظˆظ„ ظ„ظ„ط£ظƒط§ط¯ظٹظ…ظٹط© ظˆط¨ط¯ط، ط§ظ„ط§ط³طھط®ط¯ط§ظ…
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Founder Note -->
                    <div style="border-right: 3px solid #6C3BFF; padding-right: 15px; margin-top: 20px;">
                      <p style="color: #cccccc; font-style: italic; line-height: 1.6; margin: 0 0 15px 0;">
                        "ط£ط´ظƒط±ظƒ ط´ط®طµظٹط§ظ‹ ط¹ظ„ظ‰ ط«ظ‚طھظƒ ط¨ظ…ظ†طھط¬ط§طھظ†ط§. ظ„ظ‚ط¯ ط¨ظ†ظٹظ†ط§ ظ‡ط°ط§ ط§ظ„ظ†ط¸ط§ظ… ط¨ظƒظ„ ط´ط؛ظپ ظˆط§ظ‡طھظ…ط§ظ… ط¨ط£ط¯ظ‚ ط§ظ„طھظپط§طµظٹظ„ ظ„ظ†ظ‚ط¯ظ… ظ„ظƒ طھط¬ط±ط¨ط© ط§ط³طھط«ظ†ط§ط¦ظٹط©. ط£طھظ…ظ†ظ‰ ظ„ظƒ ظƒظ„ ط§ظ„طھظˆظپظٹظ‚ ظˆط§ظ„ظ†ط¬ط§ط­طŒ ظˆط£ظ†ط§ ظˆظپط±ظٹظ‚ظٹ ط¯ط§ط¦ظ…ط§ظ‹ ظ‡ظ†ط§ ظ„ط¯ط¹ظ…ظƒ."
                      </p>
                      <p style="margin: 0; color: #F5C542; font-weight: bold;">- ط¬ط§ط³ظ… ظ…ط­ظ…ط¯</p>
                      <p style="margin: 5px 0 0 0; color: #888; font-size: 12px;">ظ…ط¤ط³ط³ BLACK4ME</p>
                    </div>
                  </td>
                </tr>

                <!-- Footer / Contact Links -->
                <tr>
                  <td style="padding: 30px; background-color: #0A0A0A; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
                    <p style="margin: 0 0 20px 0; color: #888; font-size: 14px;">ظٹط³ط¹ط¯ظ†ط§ طھظˆط§طµظ„ظƒ ظ…ط¹ظ†ط§ ط¹ط¨ط± ط§ظ„ظ‚ظ†ظˆط§طھ ط§ظ„طھط§ظ„ظٹط©:</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                      <tr>
                        <td align="center">
                          <!-- WhatsApp -->
                          <a href="https://wa.me/96879191793" style="display: inline-block; margin: 0 10px; color: #22C55E; text-decoration: none; font-weight: bold;">
                            ًں“± ظˆط§طھط³ط§ط¨
                          </a>
                          <!-- Instagram -->
                          <a href="https://www.instagram.com/black4mee/?hl=en" style="display: inline-block; margin: 0 10px; color: #E1306C; text-decoration: none; font-weight: bold;">
                            ًں“¸ ط§ظ†ط³طھط¬ط±ط§ظ… (@black4mee)
                          </a>
                          <!-- Email -->
                          <a href="mailto:black4mestore@gmail.com" style="display: inline-block; margin: 0 10px; color: #6C3BFF; text-decoration: none; font-weight: bold;">
                            âœ‰ï¸ڈ ط§ظ„ط¥ظٹظ…ظٹظ„
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 0; color: #555; font-size: 12px;">
                      آ© ${new Date().getFullYear()} BLACK4ME. ط¬ظ…ظٹط¹ ط§ظ„ط­ظ‚ظˆظ‚ ظ…ط­ظپظˆط¸ط©.
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
      subject: 'âœ… طھظ… طھط£ظƒظٹط¯ ط·ظ„ط¨ظƒ - ط§ظ„ط¯ط®ظˆظ„ ظ„ظ†ط¸ط§ظ… BLACK4ME',
      html: htmlContent
    });

    return { success: true };
  } catch (err: any) {
    console.error('Error sending welcome email:', err.message);
    return { success: false, error: err.message };
  }
}

export async function sendPendingEmail(email: string, name: string, orderId: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY missing, skipping pending email to', email);
      return { success: true };
    }

    const { data: order } = await supabaseAdmin.from('orders').select('*, product:products(*)').eq('id', orderId).single();
    
    const productName = order?.product?.title || 'ط§ظ„ط­ط²ظ…ط© ط§ظ„ط´ط§ظ…ظ„ط©';
    const productPrice = order?.amount || '49.00';

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط±ط§ط¬ط¹ط© - BLACK4ME</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #000000; color: #ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0A; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #111111; border-radius: 16px; overflow: hidden; border: 1px solid rgba(108, 59, 255, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, rgba(108,59,255,0.1), rgba(0,195,255,0.1)); border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <h1 style="margin: 0; color: #6C3BFF; font-size: 28px; letter-spacing: 2px;">BLACK4ME</h1>
                    <p style="margin: 10px 0 0 0; color: #888; font-size: 16px;">طھظ… ط§ط³طھظ„ط§ظ… ط·ظ„ط¨ظƒ</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #00C3FF; margin-top: 0; font-size: 24px;">ظ…ط±ط­ط¨ط§ظ‹ ${name || 'طµط¯ظٹظ‚ظٹ'}! âڈ³</h2>
                    <p style="color: #dddddd; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                      ظ„ظ‚ط¯ ط§ط³طھظ„ظ…ظ†ط§ ط·ظ„ط¨ظƒ ظˆط¥ظٹطµط§ظ„ ط§ظ„ط­ظˆط§ظ„ط© ط§ظ„ط¨ظ†ظƒظٹط© ط¨ظ†ط¬ط§ط­. ظپط±ظٹظ‚ظ†ط§ ط§ظ„ط¢ظ† ظٹظ‚ظˆظ… ط¨ظ…ط±ط§ط¬ط¹ط© ط§ظ„ط¥ظٹطµط§ظ„ ظˆطھط£ظƒظٹط¯ ط§ظ„ط­ظˆط§ظ„ط©.
                      ظ‡ط°ظ‡ ط§ظ„ط¹ظ…ظ„ظٹط© طھط³طھط؛ط±ظ‚ ط¹ط§ط¯ط© ط¨ط¶ط¹ ط³ط§ط¹ط§طھ (ط¨ط­ط¯ ط£ظ‚طµظ‰ 24 ط³ط§ط¹ط©).
                    </p>

                    <!-- Order Details Box -->
                    <div style="background-color: #1A1A1A; border-radius: 12px; padding: 25px; margin-bottom: 30px; border: 1px solid rgba(255,255,255,0.05);">
                      <h3 style="margin: 0 0 15px 0; color: #6C3BFF; font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">طھظپط§طµظٹظ„ ط§ظ„ط·ظ„ط¨ (ظ‚ظٹط¯ ط§ظ„ظ…ط±ط§ط¬ط¹ط©)</h3>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-bottom: 15px;">
                            <p style="margin: 0; color: #888; font-size: 14px;">ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨</p>
                            <p style="margin: 5px 0 0 0; color: #fff; font-size: 16px; font-weight: bold;">#${orderId.slice(-8).toUpperCase()}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05);">
                            <p style="margin: 0; color: #888; font-size: 14px;">ط§ظ„ظ…ظ†طھط¬</p>
                            <p style="margin: 5px 0 0 0; color: #fff; font-size: 16px; font-weight: bold;">${productName}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05);">
                            <p style="margin: 0; color: #888; font-size: 14px;">ط§ظ„ظ…ط¨ظ„ط؛</p>
                            <p style="margin: 5px 0 0 0; color: #fff; font-size: 18px; font-weight: bold;">$${productPrice}</p>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <p style="color: #dddddd; font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center;">
                      <strong>ط¨ظ…ط¬ط±ط¯ طھط£ظƒظٹط¯ ط§ظ„ط­ظˆط§ظ„ط©طŒ ط³طھطµظ„ظƒ ط±ط³ط§ظ„ط© ط£ط®ط±ظ‰ طھط­طھظˆظٹ ط¹ظ„ظ‰ طھظپط§طµظٹظ„ طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„ ظ„ط¯ط®ظˆظ„ ط§ظ„ظ…ظ†طµط©!</strong>
                    </p>

                    <!-- Footer / Contact Links -->
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
      subject: 'âڈ³ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط±ط§ط¬ط¹ط© - BLACK4ME',
      html: htmlContent
    });

    return { success: true };
  } catch (err: any) {
    console.error('Error sending pending email:', err.message);
    return { success: false, error: err.message };
  }
}

export async function sendAdminNotificationEmail(orderId: string, customerEmail: string, customerName: string, amount: string | number, productName: string) {
  try {
    if (!process.env.RESEND_API_KEY) return { success: true };

    const adminEmail = 'black4mestore@gmail.com';
    const htmlContent = `
      <div dir="rtl" style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #22C55E;">🎉 طلب جديد تم تأكيده!</h2>
        <p style="font-size: 16px;">لقد تلقيت للتو طلباً جديداً على منصة BLACK4ME.</p>
        <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-top: 15px;">
          <p><strong>العميل:</strong> ${customerName} (${customerEmail})</p>
          <p><strong>المنتج:</strong> ${productName}</p>
          <p><strong>المبلغ:</strong> $${amount}</p>
          <p><strong>رقم الطلب:</strong> #${orderId.slice(-8).toUpperCase()}</p>
        </div>
        <p style="margin-top: 20px; font-size: 14px; color: #666;">يمكنك مراجعة تفاصيل الطلب بالكامل من خلال لوحة تحكم الإدارة.</p>
      </div>
    `;

    await resend.emails.send({
      from: 'BLACK4ME System <noreply@black4me.com>',
      to: adminEmail,
      subject: '🎉 طلب جديد: ' + productName,
      html: htmlContent
    });

    return { success: true };
  } catch (err: any) {
    console.error('Error sending admin notification email:', err.message);
    return { success: false, error: err.message };
  }
}


import { Resend } from 'resend';
import { supabaseAdmin } from './supabase';

async function getEmailSettings() {
  const { data } = await supabaseAdmin
    .from('site_settings')
    .select('key, value')
    .in('key', [
      'author_name',
      'author_photo_url',
      'social_whatsapp_url',
      'social_instagram_url',
      'social_support_email'
    ]);

  const settings: any = {
    author_name: 'جاسم محمد',
    author_photo_url: '',
    social_whatsapp_url: '',
    social_instagram_url: '',
    social_support_email: 'support@black4me.com'
  };

  if (data) {
    data.forEach(item => {
      settings[item.key] = item.value;
    });
  }
  return settings;
}

const generateEmailHtml = (emailSettings: any, title: string, bodyContent: string) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          
          <!-- Header / Profile -->
          <tr>
            <td align="center" style="padding: 40px 30px 20px; text-align: center;">
              ${emailSettings.author_photo_url ? 
                `<img src="${emailSettings.author_photo_url}" alt="${emailSettings.author_name}" width="64" height="64" style="border-radius: 50%; margin: 0 auto 10px; display: block; object-fit: cover; border: 1px solid #EAEAEA;" />`
                : 
                `<div style="width: 64px; height: 64px; border-radius: 50%; background-color: #F3F4F6; margin: 0 auto 10px; display: table; border: 1px solid #EAEAEA;">
                    <p style="font-size: 28px; font-weight: bold; color: #555; margin: 0; display: table-cell; vertical-align: middle; text-align: center;">
                      ${emailSettings.author_name ? emailSettings.author_name.charAt(0) : 'ج'}
                    </p>
                  </div>`
              }
              <p style="font-size: 16px; font-weight: bold; color: #111111; margin: 0 0 2px;">${emailSettings.author_name}</p>
              <p style="font-size: 13px; color: #6B7280; margin: 0;">مؤسس BLACK4ME</p>
            </td>
          </tr>

          <!-- Separator -->
          <tr>
            <td align="center" style="padding: 0 30px;">
              <hr style="border: 0; border-top: 1px solid #F3F4F6; margin: 0;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td dir="rtl" align="right" style="padding: 30px; text-align: right; direction: rtl;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #F9FAFB; border-top: 1px solid #F3F4F6; border-radius: 0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                <tr>
                  <td align="center" dir="rtl">
                    ${emailSettings.social_whatsapp_url ? `
                    <a href="${emailSettings.social_whatsapp_url}" style="display: inline-block; margin: 0 8px; color: #4B5563; text-decoration: none; font-size: 14px;">
                      📱 واتساب
                    </a>` : ''}
                    ${emailSettings.social_instagram_url ? `
                    <a href="${emailSettings.social_instagram_url}" style="display: inline-block; margin: 0 8px; color: #4B5563; text-decoration: none; font-size: 14px;">
                      📸 انستجرام
                    </a>` : ''}
                    ${emailSettings.social_support_email ? `
                    <a href="mailto:${emailSettings.social_support_email}" style="display: inline-block; margin: 0 8px; color: #4B5563; text-decoration: none; font-size: 14px;">
                      ✉️ الإيميل
                    </a>` : ''}
                  </td>
                </tr>
              </table>
              <p style="margin: 0; color: #9CA3AF; font-size: 12px; text-align: center;">
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


export async function sendLeadMagnetEmail(email: string, downloadLink: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: 'RESEND_API_KEY missing' };
    }
    const emailSettings = await getEmailSettings();
    const leadMagnetBody = `
              <h2 style="color: #111111; margin-top: 0; font-size: 20px; font-weight: bold;">مرحباً بك! 👋</h2>
              <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 25px;">
                شكراً لاهتمامك بمنتجاتنا. لقد قمنا بتجهيز الهدية المجانية لك.
              </p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${downloadLink}" style="display: inline-block; padding: 14px 32px; background-color: #111111; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  تحميل الهدية المجانية
                </a>
              </div>
              <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 15px;">
                إذا واجهت أي مشكلة في التحميل، لا تتردد في الرد على هذه الرسالة أو التواصل معنا عبر القنوات أدناه.
              </p>
              <p style="color: #111111; font-size: 16px; font-weight: bold; margin-top: 30px;">
                كل التوفيق،<br>
                ${emailSettings.author_name}
              </p>
    `;
    const htmlContent = generateEmailHtml(emailSettings, "الهدية المجانية من BLACK4ME", leadMagnetBody);

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'BLACK4ME <noreply@black4me.com>',
      to: email,
      subject: '🎁 هديتك المجانية جاهزة للتحميل',
      html: htmlContent
    });

    return { success: true };
  } catch (err: any) {
    console.error('Error sending email:', err.message);
    return { success: false, error: err.message };
  }
}

export async function sendWelcomeEmail(email: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: 'RESEND_API_KEY missing' };
    }
    const emailSettings = await getEmailSettings();
    const welcomeBody = `
              <h2 style="color: #111111; margin-top: 0; font-size: 20px; font-weight: bold;">أهلاً بك في نظام BLACK4ME 👋</h2>
              <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
                سعداء جداً بانضمامك إلينا! لقد قمنا بتجهيز حسابك بنجاح وأنت الآن جاهز للبدء.
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">
                في الأيام القادمة، سأشارك معك استراتيجيات مهمة جداً ستساعدك في مضاعفة أرباحك وبناء نظامك التسويقي بشكل صحيح. أنصحك بمتابعة رسائلنا القادمة.
              </p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="https://black4me.com/login" style="display: inline-block; padding: 14px 32px; background-color: #111111; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  الدخول إلى حسابك
                </a>
              </div>
              <p style="color: #111111; font-size: 16px; font-weight: bold; margin-top: 30px;">
                كل التوفيق،<br>
                ${emailSettings.author_name}
              </p>
    `;
    const htmlContent = generateEmailHtml(emailSettings, "مرحباً بك في BLACK4ME", welcomeBody);

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'BLACK4ME <noreply@black4me.com>',
      to: email,
      subject: '👋 مرحباً بك في نظام BLACK4ME',
      html: htmlContent
    });

    return { success: true };
  } catch (err: any) {
    console.error('Error sending welcome email:', err.message);
    return { success: false, error: err.message };
  }
}

export async function sendConsultationEmail(email: string, name: string, dateStr: string, title: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: 'RESEND_API_KEY missing' };
    }
    const emailSettings = await getEmailSettings();
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Email to Customer
    const consultationCustomerBody = `
              <h2 style="color: #111111; margin-top: 0; font-size: 20px; font-weight: bold;">تم تأكيد حجزك! ✅</h2>
              <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 25px;">
                مرحباً ${name}، لقد تم تأكيد حجز الاستشارة بنجاح. نتطلع للتحدث معك قريباً.
              </p>
              
              <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; border: 1px solid #EAEAEA; margin-bottom: 25px;">
                <p style="margin: 0 0 10px; color: #111111; font-size: 15px;"><strong>نوع الاستشارة:</strong> ${title}</p>
                <p style="margin: 0; color: #111111; font-size: 15px;"><strong>الموعد:</strong> ${dateStr} (بتوقيت مسقط)</p>
              </div>

              <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 15px;">
                سيصلك رابط Google Meet قريباً على بريدك الإلكتروني. الرجاء التواجد في الموعد المحدد.
              </p>
              <p style="color: #111111; font-size: 16px; font-weight: bold; margin-top: 30px;">
                أراك قريباً،<br>
                ${emailSettings.author_name}
              </p>
    `;
    const customerHtmlContent = generateEmailHtml(emailSettings, "تأكيد حجز الاستشارة", consultationCustomerBody);

    await resend.emails.send({
      from: 'BLACK4ME <noreply@black4me.com>',
      to: email,
      subject: '✅ تم تأكيد حجز الاستشارة: ' + title,
      html: customerHtmlContent
    });

    // Email to Admin
    const adminEmail = 'black4mestore@gmail.com';
    const consultationAdminBody = `
      <div dir="rtl" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 20px; background-color: #FAFAFA; border-radius: 8px; text-align: right; direction: rtl;">
        <h2 style="color: #22C55E; margin-top: 0;">حجز استشارة جديد! 🎉</h2>
        <p style="font-size: 16px; color: #374151;">تم حجز استشارة جديدة عبر Cal.com.</p>
        <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #EAEAEA; margin-top: 15px;">
          <p style="margin: 0 0 10px;"><strong>الاسم:</strong> ${name} (${email})</p>
          <p style="margin: 0 0 10px;"><strong>الاستشارة:</strong> ${title}</p>
          <p style="margin: 0;"><strong>الموعد:</strong> ${dateStr} (بتوقيت مسقط)</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'BLACK4ME System <noreply@black4me.com>',
      to: adminEmail,
      subject: '📅 حجز استشارة جديد: ' + name,
      html: consultationAdminBody
    });

    return { success: true };
  } catch (err: any) {
    console.error('Error sending consultation email:', err.message);
    return { success: false, error: err.message };
  }
}

export async function sendTestEmail(email: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: 'RESEND_API_KEY missing' };
    }
    const emailSettings = await getEmailSettings();
    const testEmailBody = `
              <h2 style="color: #111111; margin-top: 0; font-size: 20px; font-weight: bold;">أنت من المقربين! 👋</h2>
              <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 25px;">
                هذه رسالة اختبار للتأكد من المظهر الجديد للقالب.
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 15px;">
                تم تحسين الخطوط لتكون أكثر احترافية وأسهل للقراءة. اتجاه النص يبدأ من اليمين بشكل صحيح تماماً. تصميم الرسالة أصبح مشابهاً لتصميم الرسائل الاحترافية ليعطي ثقة ومصداقية أكبر للعملاء.
              </p>
              <p style="color: #111111; font-size: 16px; font-weight: bold; margin-top: 30px;">
                كل التوفيق،<br>
                ${emailSettings.author_name}
              </p>
    `;
    const htmlContent = generateEmailHtml(emailSettings, "اختبار إعدادات البريد - BLACK4ME", testEmailBody);

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'BLACK4ME <noreply@black4me.com>',
      to: email,
      subject: '🧪 اختبار القالب الجديد - BLACK4ME',
      html: htmlContent
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

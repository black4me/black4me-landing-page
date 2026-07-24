import { Resend } from 'resend';
import { supabaseAdmin } from '../../lib/supabase-admin';

async function getEmailSettings() {
  const { data } = await supabaseAdmin
    .from('site_settings')
    .select('key, value')
    .in('key', [
      'author_name',
      'social_whatsapp_url',
      'social_instagram_url',
      'social_support_email'
    ]);

  const settings: any = {
    author_name: 'جاسم محمد',
    social_whatsapp_url: '',
    social_instagram_url: '',
    social_support_email: 'support@black4me.com'
  };

  if (data) {
    data.forEach((item: any) => {
      settings[item.key] = item.value;
    });
  }
  return settings;
}

export async function sendLeadMagnetEmail(email: string, downloadLink: string) {
  try {
    if (!process.env.RESEND_API_KEY) return { success: false, error: 'RESEND_API_KEY missing' };
    
    const emailSettings = await getEmailSettings();
    const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>الهدية المجانية من BLACK4ME</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          
          <!-- Header / Profile -->
          <tr>
            <td align="center" style="padding: 40px 30px 20px; text-align: center;">
              <p style="font-size: 20px; font-weight: bold; color: #111111; margin: 0 0 4px;">جاسم محمد</p>
              <p style="font-size: 14px; color: #6B7280; margin: 0;">مؤسس BLACK4ME</p>
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
                جاسم محمد
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #F9FAFB; border-top: 1px solid #F3F4F6; border-radius: 0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
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
              <div dir="rtl" style="text-align: right; background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px; color: #4B5563; font-size: 13px; font-weight: bold;">تنويه مهم:</p>
                <p style="margin: 0 0 10px; color: #6B7280; font-size: 13px; line-height: 1.6;">
                  يرجى عدم الرد على هذا البريد الإلكتروني، لأن noreply@black4me.com مخصص فقط لإرسال الرسائل الآلية ولا يتم استخدامه للدعم أو الرد على الاستفسارات.
                </p>
                <p style="margin: 0; color: #6B7280; font-size: 13px; line-height: 1.6;">
                  إذا كنت بحاجة إلى المساعدة أو ترغب في التواصل معنا، يرجى استخدام:<br>
                  <strong>واتساب:</strong> +968 7919 1793<br>
                  <strong>البريد الإلكتروني:</strong> black4mestore@gmail.com
                </p>
              </div>
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

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'BLACK4ME <noreply@black4me.com>',
      to: email,
      subject: '🎁 هديتك المجانية جاهزة للتحميل',
      html: htmlContent
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendWelcomeEmail(email: string, name?: string, orderId?: string) {
  try {
    if (!process.env.RESEND_API_KEY) return { success: false, error: 'RESEND_API_KEY missing' };
    
    const emailSettings = await getEmailSettings();
    const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>مرحباً بك في BLACK4ME</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          
          <!-- Header / Profile -->
          <tr>
            <td align="center" style="padding: 40px 30px 20px; text-align: center;">
              <p style="font-size: 20px; font-weight: bold; color: #111111; margin: 0 0 4px;">جاسم محمد</p>
              <p style="font-size: 14px; color: #6B7280; margin: 0;">مؤسس BLACK4ME</p>
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
                جاسم محمد
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #F9FAFB; border-top: 1px solid #F3F4F6; border-radius: 0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
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
              <div dir="rtl" style="text-align: right; background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px; color: #4B5563; font-size: 13px; font-weight: bold;">تنويه مهم:</p>
                <p style="margin: 0 0 10px; color: #6B7280; font-size: 13px; line-height: 1.6;">
                  يرجى عدم الرد على هذا البريد الإلكتروني، لأن noreply@black4me.com مخصص فقط لإرسال الرسائل الآلية ولا يتم استخدامه للدعم أو الرد على الاستفسارات.
                </p>
                <p style="margin: 0; color: #6B7280; font-size: 13px; line-height: 1.6;">
                  إذا كنت بحاجة إلى المساعدة أو ترغب في التواصل معنا، يرجى استخدام:<br>
                  <strong>واتساب:</strong> +968 7919 1793<br>
                  <strong>البريد الإلكتروني:</strong> black4mestore@gmail.com
                </p>
              </div>
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

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'BLACK4ME <noreply@black4me.com>',
      to: email,
      subject: '👋 مرحباً بك في نظام BLACK4ME',
      html: htmlContent
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendConsultationEmail(email: string, name: string, dateStr: string, title: string) {
  try {
    if (!process.env.RESEND_API_KEY) return { success: false, error: 'RESEND_API_KEY missing' };
    
    const emailSettings = await getEmailSettings();
    const resend = new Resend(process.env.RESEND_API_KEY);

    const customerHtmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تأكيد حجز الاستشارة</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          
          <!-- Header / Profile -->
          <tr>
            <td align="center" style="padding: 40px 30px 20px; text-align: center;">
              <p style="font-size: 20px; font-weight: bold; color: #111111; margin: 0 0 4px;">جاسم محمد</p>
              <p style="font-size: 14px; color: #6B7280; margin: 0;">مؤسس BLACK4ME</p>
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
                جاسم محمد
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #F9FAFB; border-top: 1px solid #F3F4F6; border-radius: 0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
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
              <div dir="rtl" style="text-align: right; background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px; color: #4B5563; font-size: 13px; font-weight: bold;">تنويه مهم:</p>
                <p style="margin: 0 0 10px; color: #6B7280; font-size: 13px; line-height: 1.6;">
                  يرجى عدم الرد على هذا البريد الإلكتروني، لأن noreply@black4me.com مخصص فقط لإرسال الرسائل الآلية ولا يتم استخدامه للدعم أو الرد على الاستفسارات.
                </p>
                <p style="margin: 0; color: #6B7280; font-size: 13px; line-height: 1.6;">
                  إذا كنت بحاجة إلى المساعدة أو ترغب في التواصل معنا، يرجى استخدام:<br>
                  <strong>واتساب:</strong> +968 7919 1793<br>
                  <strong>البريد الإلكتروني:</strong> black4mestore@gmail.com
                </p>
              </div>
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

    await resend.emails.send({
      from: 'BLACK4ME <noreply@black4me.com>',
      to: email,
      subject: '✅ تم تأكيد حجز الاستشارة: ' + title,
      html: customerHtmlContent
    });

    const adminEmail = 'black4mestore@gmail.com';
    const adminHtmlContent = `
      <div dir="rtl" style="font-family: -apple-system, sans-serif; padding: 20px; background-color: #FAFAFA; border-radius: 8px; text-align: right; direction: rtl;">
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
      html: adminHtmlContent
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendTestEmail(email: string) {
  try {
    if (!process.env.RESEND_API_KEY) return { success: false, error: 'RESEND_API_KEY missing' };
    
    const emailSettings = await getEmailSettings();
    const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>اختبار القالب الجديد - BLACK4ME</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          
          <!-- Header / Profile -->
          <tr>
            <td align="center" style="padding: 40px 30px 20px; text-align: center;">
              <p style="font-size: 20px; font-weight: bold; color: #111111; margin: 0 0 4px;">جاسم محمد</p>
              <p style="font-size: 14px; color: #6B7280; margin: 0;">مؤسس BLACK4ME</p>
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
              
              <h2 style="color: #111111; margin-top: 0; font-size: 20px; font-weight: bold;">أنت من المقربين! 👋</h2>
              <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 25px;">
                هذه رسالة اختبار للتأكد من المظهر الجديد للقالب.
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 15px;">
                تم تحسين الخطوط لتكون أكثر احترافية وأسهل للقراءة. اتجاه النص يبدأ من اليمين بشكل صحيح تماماً. تصميم الرسالة أصبح مشابهاً لتصميم الرسائل الاحترافية ليعطي ثقة ومصداقية أكبر للعملاء.
              </p>
              <p style="color: #111111; font-size: 16px; font-weight: bold; margin-top: 30px;">
                كل التوفيق،<br>
                جاسم محمد
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #F9FAFB; border-top: 1px solid #F3F4F6; border-radius: 0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
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
              <div dir="rtl" style="text-align: right; background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px; color: #4B5563; font-size: 13px; font-weight: bold;">تنويه مهم:</p>
                <p style="margin: 0 0 10px; color: #6B7280; font-size: 13px; line-height: 1.6;">
                  يرجى عدم الرد على هذا البريد الإلكتروني، لأن noreply@black4me.com مخصص فقط لإرسال الرسائل الآلية ولا يتم استخدامه للدعم أو الرد على الاستفسارات.
                </p>
                <p style="margin: 0; color: #6B7280; font-size: 13px; line-height: 1.6;">
                  إذا كنت بحاجة إلى المساعدة أو ترغب في التواصل معنا، يرجى استخدام:<br>
                  <strong>واتساب:</strong> +968 7919 1793<br>
                  <strong>البريد الإلكتروني:</strong> black4mestore@gmail.com
                </p>
              </div>
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

export async function sendAdminNotificationEmail(orderId: string, customerEmail: string, customerName: string, amount: number, productTitle: string) {
  try {
    if (!process.env.RESEND_API_KEY) return { success: false };
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'BLACK4ME <noreply@black4me.com>',
      to: 'black4mestore@gmail.com',
      subject: `✅ طلب جديد #${orderId}`,
      html: `<div dir="rtl" style="font-family: sans-serif; padding: 20px;">
        <h2>✅ تم استلام طلب جديد!</h2>
        <p><strong>رقم الطلب:</strong> ${orderId}</p>
        <p><strong>العميل:</strong> ${customerName} (${customerEmail})</p>
        <p><strong>المنتج:</strong> ${productTitle}</p>
        <p><strong>المبلغ:</strong> ${amount.toFixed(2)} USD</p>
      </div>`
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendPendingEmail(email: string, name: string, orderId: string) {
  try {
    if (!process.env.RESEND_API_KEY) return { success: false };
    
    const emailSettings = await getEmailSettings();
    const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تأكيد الطلب - BLACK4ME</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          
          <!-- Header / Profile -->
          <tr>
            <td align="center" style="padding: 40px 30px 20px; text-align: center;">
              <p style="font-size: 20px; font-weight: bold; color: #111111; margin: 0 0 4px;">جاسم محمد</p>
              <p style="font-size: 14px; color: #6B7280; margin: 0;">مؤسس BLACK4ME</p>
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
              
      <h2 style="color:#111; margin-top:0; font-size:20px;">شكراً لطلبك! ⏳</h2>
      <p style="color:#374151; font-size:16px; line-height:1.8;">
        مرحباً ${name}! لقد استلمنا طلبك رقم <strong>${orderId}</strong> وهو قيد المعالجة.
      </p>
      <p style="color:#374151; font-size:16px; line-height:1.8;">
        سيتم تأكيد طلبك خلال 24 ساعة. إذا كان لديك أي استفسار لا تتردد في التواصل معنا.
      </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #F9FAFB; border-top: 1px solid #F3F4F6; border-radius: 0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
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
              <div dir="rtl" style="text-align: right; background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px; color: #4B5563; font-size: 13px; font-weight: bold;">تنويه مهم:</p>
                <p style="margin: 0 0 10px; color: #6B7280; font-size: 13px; line-height: 1.6;">
                  يرجى عدم الرد على هذا البريد الإلكتروني، لأن noreply@black4me.com مخصص فقط لإرسال الرسائل الآلية ولا يتم استخدامه للدعم أو الرد على الاستفسارات.
                </p>
                <p style="margin: 0; color: #6B7280; font-size: 13px; line-height: 1.6;">
                  إذا كنت بحاجة إلى المساعدة أو ترغب في التواصل معنا، يرجى استخدام:<br>
                  <strong>واتساب:</strong> +968 7919 1793<br>
                  <strong>البريد الإلكتروني:</strong> black4mestore@gmail.com
                </p>
              </div>
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

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'BLACK4ME <noreply@black4me.com>',
      to: email,
      subject: '⏳ طلبك قيد المعالجة - BLACK4ME',
      html: htmlContent
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendReviewRequestEmail(
  email: string,
  customerName: string,
  targetType: 'consultation' | 'product' | 'lead_magnet',
  targetId: string,
  productNameOrService: string
) {
  try {
    if (!process.env.RESEND_API_KEY) return { success: false, error: 'RESEND_API_KEY missing' };

    // 1. Check for duplicates in sent_review_emails
    const { data: existingLog, error: checkError } = await supabaseAdmin
      .from('sent_review_emails')
      .select('id')
      .eq('email', email)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (existingLog) {
      console.log(`[Review Automation] Duplicate prevented for ${email} (${targetType}:${targetId})`);
      return { success: false, error: 'Already sent review email' };
    }

    const emailSettings = await getEmailSettings();

    // 2. Map Tally link and compile template copy
    let reviewLink = '';
    let subject = '';
    let bodyText = '';

    if (targetType === 'consultation') {
      reviewLink = `https://tally.so/r/xX0d5d?name=${encodeURIComponent(customerName)}&email=${encodeURIComponent(email)}`;
      subject = '⭐ شاركنا تجربتك بعد الاستشارة مع الأستاذ جاسم';
      bodyText = `
        <h2 style="color: #111111; margin-top: 0; font-size: 20px; font-weight: bold;">أهلاً ${customerName}، 👋</h2>
        <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 25px;">
          سعدت جداً بالحديث معك في جلستنا الاستشارية الأخيرة وتشريح مسار مشروعك.
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 25px;">
          يهمني جداً معرفة أثر هذه الجلسة على خطتك القادمة ورؤيتك. تفضل بمشاركتنا تقييمك السريع (يستغرق دقيقة واحدة فقط):
        </p>
        <div style="text-align: center; margin: 35px 0;">
          <a href="${reviewLink}" style="display: inline-block; padding: 14px 32px; background-color: #111111; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            تقديم التقييم والمراجعة 📝
          </a>
        </div>
        <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 15px;">
          ملاحظاتك تساعدنا على تحسين وتصميم خدماتنا الاستشارية دائماً.
        </p>
      `;
    } else if (targetType === 'product') {
      const isBook = productNameOrService.includes('كتاب') || productNameOrService.includes('بدون التسويق');
      reviewLink = isBook 
        ? `https://tally.so/r/WOpoNj?name=${encodeURIComponent(customerName)}&email=${encodeURIComponent(email)}&product=${encodeURIComponent(productNameOrService)}`
        : `https://tally.so/r/WOpoNj?name=${encodeURIComponent(customerName)}&email=${encodeURIComponent(email)}&product=${encodeURIComponent(productNameOrService)}`; // dynamic mapping
      subject = isBook ? `📚 رأيك يهمنا في كتاب ${productNameOrService}` : `✨ رأيك يهمنا في ${productNameOrService}`;
      bodyText = `
        <h2 style="color: #111111; margin-top: 0; font-size: 20px; font-weight: bold;">أهلاً ${customerName}، 👋</h2>
        <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 25px;">
          أتمنى أنك بدأت بقراءة كتاب "${productNameOrService}" ورؤية الفجوات التسويقية في مشروعك الرقمي.
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 25px;">
          رأيك في المحتوى وفي التمارين المرفقة يهمني جداً شخصياً لتطوير هذا العمل. تفضل بمشاركتي مراجعتك وتقييمك الصادق:
        </p>
        <div style="text-align: center; margin: 35px 0;">
          <a href="${reviewLink}" style="display: inline-block; padding: 14px 32px; background-color: #111111; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            تقديم التقييم والمراجعة 📝
          </a>
        </div>
      `;
    } else if (targetType === 'lead_magnet') {
      reviewLink = `https://tally.so/r/44Lkyd?name=${encodeURIComponent(customerName)}&email=${encodeURIComponent(email)}`;
      subject = '🎁 ما الذي يؤخرك عن اقتناص الفرصة وبدء مشروعك؟';
      bodyText = `
        <h2 style="color: #111111; margin-top: 0; font-size: 20px; font-weight: bold;">أهلاً ${customerName}، 👋</h2>
        <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 25px;">
          لاحظت أنك حصلت على الهدية المجانية من BLACK4ME لبناء نظامك التسويقي، لكنك لم تبدأ بالخطوة الحقيقية وتقتنص الفرصة معنا بعد.
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 25px;">
          يهمني أن أعرف بصراحة: ما الذي يقف في طريقك أو يؤخرك عن البدء؟ شاركني رأيك وسأكون سعيداً بمساعدتك:
        </p>
        <div style="text-align: center; margin: 35px 0;">
          <a href="${reviewLink}" style="display: inline-block; padding: 14px 32px; background-color: #111111; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            شاركني رأيك بصراحة 💬
          </a>
        </div>
      `;
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          
          <!-- Header / Profile -->
          <tr>
            <td align="center" style="padding: 40px 30px 20px; text-align: center;">
              <p style="font-size: 20px; font-weight: bold; color: #111111; margin: 0 0 4px;">جاسم محمد</p>
              <p style="font-size: 14px; color: #6B7280; margin: 0;">مؤسس BLACK4ME</p>
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
              ${bodyText}
              <p style="color: #111111; font-size: 16px; font-weight: bold; margin-top: 30px;">
                كل التوفيق،<br>
                جاسم محمد
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #F9FAFB; border-top: 1px solid #F3F4F6; border-radius: 0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
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
              <div dir="rtl" style="text-align: right; background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px; color: #4B5563; font-size: 13px; font-weight: bold;">تنويه مهم:</p>
                <p style="margin: 0 0 10px; color: #6B7280; font-size: 13px; line-height: 1.6;">
                  يرجى عدم الرد على هذا البريد الإلكتروني، لأن noreply@black4me.com مخصص فقط لإرسال الرسائل الآلية ولا يتم استخدامه للدعم أو الرد على الاستفسارات.
                </p>
                <p style="margin: 0; color: #6B7280; font-size: 13px; line-height: 1.6;">
                  إذا كنت بحاجة إلى المساعدة أو ترغب في التواصل معنا، يرجى استخدام:<br>
                  <strong>واتساب:</strong> +968 7919 1793<br>
                  <strong>البريد الإلكتروني:</strong> black4mestore@gmail.com
                </p>
              </div>
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

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'BLACK4ME <noreply@black4me.com>',
      to: email,
      subject: subject,
      html: htmlContent
    });

    // 3. Log to sent_review_emails to prevent duplicates
    const { error: insertError } = await supabaseAdmin.from('sent_review_emails').insert({
      email,
      target_type: targetType,
      target_id: targetId
    });

    if (insertError) {
      throw insertError;
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendLeadMagnetEmail1(email: string, name: string, downloadLink: string) {
  try {
    if (!process.env.RESEND_API_KEY) return { success: false, error: 'RESEND_API_KEY missing' };
    
    const emailSettings = await getEmailSettings();
    const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>هديتك الحصرية بانتظارك: نظام التسويق الرقمي الذكي 🎁</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          
          <!-- Header / Profile -->
          <tr>
            <td align="center" style="padding: 40px 30px 20px; text-align: center;">
              <p style="font-size: 20px; font-weight: bold; color: #111111; margin: 0 0 4px;">جاسم محمد</p>
              <p style="font-size: 14px; color: #6B7280; margin: 0;">مؤسس BLACK4ME</p>
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
            <td dir="rtl" align="right" style="padding: 30px; text-align: right; direction: rtl; color: #374151; font-size: 16px; line-height: 1.8;">
              <p>يا هلا بك والله 👋</p>
              <p>أنا جاسم محمد، واليوم يسعدني جداً انضمامك لمنصتنا.</p>
              <p>التسويق الرقمي اليوم مو مجرد إعلانات تدفع ميزانيتها وتنتظر حظك؛ هو نظام دقيق تبنيه خطوة بخطوة عشان يشتغل لصالحك ويجيب لك مبيعات مستقرة ومستدامة.</p>
              <p>لقد جهزت لك الهدية المجانية اللي طلبتها بالكامل، وهي تلخص لك أولى الخطوات العملية اللي تحتاج تطبقها من اليوم عشان تحمي ميزانيتك التسويقية وتوجهها صح.</p>
              <p>تقدر تحمل هديتك مباشرة من الرابط أدناه:</p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${downloadLink}" style="display: inline-block; padding: 14px 32px; background-color: #111111; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  تحميل الهدية المجانية الآن 🚀
                </a>
              </div>
              <p>أقترح عليك تخصص لها 15 دقيقة هادئة اليوم تقرأها بتركيز، لأن اللي بتتعلمه فيها بيوفر عليك آلاف الريالات الضائعة في تجارب عشوائية.</p>
              <p>في الرسائل الجاية، بأشاركك أهم الدروس التطبيقية لتسريع نتائجك.</p>
              <p style="color: #111111; font-size: 16px; font-weight: bold; margin-top: 30px;">
                أخوك،<br>
                جاسم محمد — مؤسس BLACK4ME
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #F9FAFB; border-top: 1px solid #F3F4F6; border-radius: 0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
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

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'جاسم محمد - BLACK4ME <noreply@black4me.com>',
      to: email,
      subject: `هديتك الحصرية بانتظارك: نظام التسويق الرقمي الذكي 🎁`,
      html: htmlContent
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendLeadMagnetEmail2(email: string, name: string) {
  try {
    if (!process.env.RESEND_API_KEY) return { success: false, error: 'RESEND_API_KEY missing' };
    
    const emailSettings = await getEmailSettings();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://black4me-landing-page.vercel.app';
    const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>سر صغير: ليش يفشل 90% من التجار في التسويق الرقمي؟ 💡</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          
          <!-- Header / Profile -->
          <tr>
            <td align="center" style="padding: 40px 30px 20px; text-align: center;">
              <p style="font-size: 20px; font-weight: bold; color: #111111; margin: 0 0 4px;">جاسم محمد</p>
              <p style="font-size: 14px; color: #6B7280; margin: 0;">مؤسس BLACK4ME</p>
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
            <td dir="rtl" align="right" style="padding: 30px; text-align: right; direction: rtl; color: #374151; font-size: 16px; line-height: 1.8;">
              <p>مرحباً بك مجدداً يا صديقي،</p>
              <p>أتمنى أنك حظيت بفرصة للاطلاع على الهدية العملية اللي أرسلتها لك قبل يومين.</p>
              <p>خلال متابعتي لقرابة 450 صاحب مشروع ومتجر إلكتروني، لاحظت خلل متكرر يخلي 90% من الحملات الإعلانية تفشل حتى لو كانت الميزانية ضخمة.</p>
              <p>الخلل مو في المنصة الإعلانية ولا في جودة المنتج..</p>
              <p>الخلل الحقيقي هو "غياب التشخيص الدقيق".</p>
              <p>أغلب أصحاب الأعمال يبدأ بالترويج والدفع قبل ما يعرف وين نقاط التسرب الحقيقية في مسار العميل (Funnel). وهذا يخليه يخسر فلوسه على إعلانات غير مربحة.</p>
              <p>عشان كذا، وبصفتك عضو جديد في مجتمعنا، ودي أختصر عليك هالتعب وأعطيك التشخيص المناسب لمشروعك.</p>
              <p>تقدر تحجز معي جلسة استشارية تشخيصية مباشرة (60 دقيقة) نضع فيها يدنا على الخلل ونرسم لك خارطة طريق واضحة وقابلة للتطبيق فوراً.</p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${siteUrl}/consultation" style="display: inline-block; padding: 14px 32px; background-color: #111111; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  احجز جلستك الاستشارية التشخيصية الآن 🗓️
                </a>
              </div>
              <p>إذا كنت تفضل القراءة أولاً، تقدر تطلع على الكتاب الكامل للتسويق من الرابط أدناه:</p>
              <p style="text-align: center; margin: 20px 0;">
                <a href="${siteUrl}/product/black-book" style="color: #6C3BFF; text-decoration: underline; font-weight: bold;">تصفح كتاب BLACK4ME للتسويق</a>
              </p>
              <p style="color: #111111; font-size: 16px; font-weight: bold; margin-top: 30px;">
                أخوك،<br>
                جاسم محمد — مؤسس BLACK4ME
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #F9FAFB; border-top: 1px solid #F3F4F6; border-radius: 0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
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

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'جاسم محمد - BLACK4ME <noreply@black4me.com>',
      to: email,
      subject: `سر صغير: ليش يفشل 90% من التجار في التسويق الرقمي؟ 💡`,
      html: htmlContent
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendLeadMagnetEmail3(email: string, name: string) {
  try {
    if (!process.env.RESEND_API_KEY) return { success: false, error: 'RESEND_API_KEY missing' };
    
    const emailSettings = await getEmailSettings();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://black4me-landing-page.vercel.app';
    const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>كم يكلفك تأجيل تنظيم تسويق مشروعك؟ ⏳</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #EAEAEA; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          
          <!-- Header / Profile -->
          <tr>
            <td align="center" style="padding: 40px 30px 20px; text-align: center;">
              <p style="font-size: 20px; font-weight: bold; color: #111111; margin: 0 0 4px;">جاسم محمد</p>
              <p style="font-size: 14px; color: #6B7280; margin: 0;">مؤسس BLACK4ME</p>
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
            <td dir="rtl" align="right" style="padding: 30px; text-align: right; direction: rtl; color: #374151; font-size: 16px; line-height: 1.8;">
              <p>أهلاً بك،</p>
              <p>كل يوم يمر بدون نظام تسويق تلقائي وواضح لمشروعك، يعني أمرين:</p>
              <ol>
                <li>ميزانية إعلانية تضيع في التخمين دون عوائد واضحة.</li>
                <li>عملاء مهتمين يروحون لمنافسيك لمجرد أنهم بنوا معهم علاقة أسرع.</li>
              </ol>
              <p>الانتظار والتأجيل في التسويق هو التكلفة الأكبر على مشروعك.</p>
              <p>التسويق الرقمي مو لغز معقد؛ هو مجرد خطوات علمية مرتبة إذا طبقتها صح بتشوف النتائج في حسابك البنكي.</p>
              <p>عشان نساعدك تبدأ اليوم وبدون أي تردد، وفرت لك خصم خاص وحصري متاح فقط لـ 48 ساعة القادمة لحجز جلستك التشخيصية أو الانضمام للباقة الكاملة.</p>
              <p>اضغط على الرابط أدناه لحجز موعدك وتطبيق نظام BLACK4ME في مشروعك فوراً:</p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${siteUrl}/consultation" style="display: inline-block; padding: 14px 32px; background-color: #111111; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  احجز استشارتك الفورية بالخصم الخاص 📈
                </a>
              </div>
              <p>الفرصة متاحة الآن، والتأجيل لن يحل الخلل الحالي. دعنا نبدأ العمل!</p>
              <p style="color: #111111; font-size: 16px; font-weight: bold; margin-top: 30px;">
                أخوك،<br>
                جاسم محمد — مؤسس BLACK4ME
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #F9FAFB; border-top: 1px solid #F3F4F6; border-radius: 0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
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

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'جاسم محمد - BLACK4ME <noreply@black4me.com>',
      to: email,
      subject: `كم يكلفك تأجيل تنظيم تسويق مشروعك؟ ⏳`,
      html: htmlContent
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}


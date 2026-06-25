import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

// توليد قالب HTML فخم وثابت يتناسب مع الهوية البصرية (بدون ذكاء اصطناعي)
function generateBrandedHTML(subject: string, bodyText: string) {
  // نحول السطور الجديدة إلى <br/>
  const formattedText = bodyText.replace(/\n/g, '<br/>');

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #050505; width: 100%; margin: 0 auto;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #111111; border: 1px solid #333; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
          
          <!-- Header / Logo Area -->
          <tr>
            <td align="center" style="padding: 40px 30px 20px 30px; background: linear-gradient(180deg, #1a1a1a 0%, #111111 100%); border-bottom: 1px solid rgba(245, 197, 66, 0.2);">
              <h1 style="margin: 0; color: #F5C542; font-size: 28px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">
                BLACK<span style="color: #6C3BFF;">4ME</span>
              </h1>
            </td>
          </tr>

          <!-- Subject Line -->
          <tr>
            <td align="center" style="padding: 30px 30px 10px 30px;">
              <h2 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: bold; line-height: 1.4;">
                ${subject}
              </h2>
              <div style="height: 3px; width: 50px; background-color: #6C3BFF; margin: 20px auto 0 auto; border-radius: 2px;"></div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 20px 40px 40px 40px; color: #D1D5DB; font-size: 16px; line-height: 1.8; text-align: right;">
              <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 25px; border-radius: 12px;">
                ${formattedText}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #0A0A0A; border-top: 1px solid #222;">
              <p style="margin: 0 0 10px 0; color: #888888; font-size: 14px;">مع أطيب التحيات،</p>
              <p style="margin: 0 0 20px 0; color: #F5C542; font-size: 16px; font-weight: bold;">جاسم محمد</p>
              
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="padding: 0 10px;">
                    <a href="https://www.instagram.com/black4mee/?hl=en" style="color: #6C3BFF; text-decoration: none; font-size: 14px; font-weight: bold;">Instagram</a>
                  </td>
                  <td style="color: #444;">|</td>
                  <td style="padding: 0 10px;">
                    <a href="https://wa.me/96879191793" style="color: #10B981; text-decoration: none; font-size: 14px; font-weight: bold;">WhatsApp</a>
                  </td>
                  <td style="color: #444;">|</td>
                  <td style="padding: 0 10px;">
                    <a href="mailto:black4mestore@gmail.com" style="color: #F5C542; text-decoration: none; font-size: 14px; font-weight: bold;">Email Support</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        
        <p style="text-align: center; color: #555555; font-size: 12px; margin-top: 20px;">
          أنت تتلقى هذه الرسالة لأنك مشترك في النشرة البريدية لمتجر Black4Me.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function POST(req: Request) {
  try {
    // Webhook Security Check
    const authHeader = req.headers.get('authorization') || req.headers.get('x-webhook-secret');
    const secret = process.env.WEBHOOK_SECRET;
    
    // Only enforce security if WEBHOOK_SECRET is defined in the environment.
    // This prevents breaking existing testing flows if the secret hasn't been set yet.
    if (secret) {
      const token = authHeader?.replace('Bearer ', '');
      if (token !== secret) {
        return NextResponse.json({ error: 'Unauthorized Access. Invalid Webhook Secret.' }, { status: 401 });
      }
    }

    const { campaigns } = await req.json();

    if (!campaigns || !Array.isArray(campaigns)) {
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 });
    }

    const inserts = [];

    for (const campaign of campaigns) {
      const subject = campaign['Subject'] || campaign['عنوان الرسالة'] || 'نشرة جديدة';
      const bodyText = campaign['BodyText'] || campaign['النص'] || '';
      let scheduledAt = campaign['ScheduledAt'] || campaign['وقت الجدولة'];
      
      if (!scheduledAt) {
        // default schedule 24h from now
        const d = new Date();
        d.setDate(d.getDate() + 1);
        scheduledAt = d.toISOString();
      } else {
        const parsed = new Date(scheduledAt);
        if (!isNaN(parsed.getTime())) {
          scheduledAt = parsed.toISOString();
        }
      }

      // Generate highly styled HTML directly
      const finalHtml = generateBrandedHTML(subject, bodyText);

      inserts.push({
        subject,
        body: finalHtml,
        scheduled_at: scheduledAt,
        status: 'scheduled'
      });
    }

    if (inserts.length > 0) {
      const { error } = await supabaseAdmin.from('email_campaigns').insert(inserts);
      if (error) {
        throw new Error(error.message);
      }
    }

    return NextResponse.json({ success: true, count: inserts.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


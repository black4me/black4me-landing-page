import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

const emailTo = 'black4mestore@gmail.com';

const testCampaigns = [
  {
    subject: "🎯 كيف تحول الزوار إلى مشترين؟ (هيكل التسويق)",
    type: "conversion",
    text: "في هذا المخطط التسويقي، نستعرض كيف يتحول الزائر العادي إلى عميل يدفع.\\n يبدأ الأمر بزيارة صفحة الهبوط، ثم يتجه إلى قراءة القيمة المضافة، ثم يضغط على زر الشراء، وأخيراً يحصل على الفاتورة والمنتج في صندوق الوارد الخاص به."
  },
  {
    subject: "⚙️ البنية التحتية للاحتفاظ بالعملاء (Retention)",
    type: "retention",
    text: "الاحتفاظ بالعميل أرخص 5 مرات من جلب عميل جديد. البنية التحتية لذلك تتكون من:\\n 1- واجهة المستخدم وتجربة التسوق (Front-end).\\n 2- محرك الفوترة والدفع (Billing Engine).\\n 3- إدارة الموارد وتحديثات المنتج (Inventory Levels).\\n كل هذا يؤدي لتقليل نسبة الإلغاء (Churn Rate)."
  },
  {
    subject: "🎁 نموذج الولاء والجوائز السنوية",
    type: "anniversary",
    text: "كيف تكافئ عملائك؟\\n الشهر الثالث: هدية مجانية لتعزيز الثقة.\\n الشهر السادس: خصم 10% على المشتريات القادمة كتقدير.\\n السنة الأولى: ترقية العميل لحالة VIP مع صلاحيات حصرية لدعم الولاء المطلق."
  }
];

function generateBrandedHTML(subject: string, bodyText: string) {
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
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #111111; border: 1px solid #333; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
          <tr>
            <td align="center" style="padding: 40px 30px 20px 30px; background: linear-gradient(180deg, #1a1a1a 0%, #111111 100%); border-bottom: 1px solid rgba(245, 197, 66, 0.2);">
              <h1 style="margin: 0; color: #F5C542; font-size: 28px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">
                BLACK<span style="color: #6C3BFF;">4ME</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 30px 30px 10px 30px;">
              <h2 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: bold; line-height: 1.4;">
                ${subject}
              </h2>
              <div style="height: 3px; width: 50px; background-color: #6C3BFF; margin: 20px auto 0 auto; border-radius: 2px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px 40px 40px; color: #D1D5DB; font-size: 16px; line-height: 1.8; text-align: right;">
              <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 25px; border-radius: 12px;">
                ${formattedText}
              </div>
            </td>
          </tr>
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

async function runTests() {
  console.log('Starting Blueprint Generation Tests (Static)...');

  for (let i = 0; i < testCampaigns.length; i++) {
    const campaign = testCampaigns[i];
    console.log(`[${i + 1}/3] Generating Static Blueprint for: ${campaign.subject}`);
    
    try {
      const html = generateBrandedHTML(campaign.subject, campaign.text);
      
      console.log(`[${i + 1}/3] Sending email to ${emailTo}...`);
      await resend.emails.send({
        from: 'BLACK4ME <noreply@black4me.com>',
        to: emailTo,
        subject: campaign.subject,
        html: html
      });
      console.log(`[${i + 1}/3] Success! Email sent.`);
    } catch (e: any) {
      console.error(`[${i + 1}/3] Failed:`, e.message);
    }
  }

  console.log('All tests completed.');
}

runTests();

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase-admin';
import { sendConsultationEmail, sendReviewRequestEmail } from '../../../server/actions/email';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Cal.com webhook ready' }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { triggerEvent, payload } = body;

    if (triggerEvent === 'BOOKING_CREATED') {
      const { uid, title, startTime, endTime, attendees, videoCallUrl, metadata } = payload;
      
      const customerName = attendees?.[0]?.name || 'عميل';
      const customerEmail = attendees?.[0]?.email || '';
      const meetingLink = videoCallUrl || metadata?.videoCallUrl || `https://app.cal.com/booking/${uid}`;

      await supabaseAdmin.from('consultations').insert({
        booking_uid: uid,
        title: title,
        start_time: startTime,
        end_time: endTime,
        customer_name: customerName,
        customer_email: customerEmail,
        status: 'confirmed'
      });

      if (customerEmail) {
        try {
          const dateStr = new Date(startTime).toLocaleDateString('ar-AE', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          });
          const timeStr = new Date(startTime).toLocaleTimeString('ar-AE', {
            hour: '2-digit', minute: '2-digit'
          });

          await resend.emails.send({
            from: 'BLACK4ME <noreply@black4me.com>',
            to: customerEmail,
            subject: '✅ تم تأكيد استشارتك مع الأستاذ جاسم',
            html: `
              <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #000; letter-spacing: 2px;">BLACK4ME</h1>
                </div>
                
                <h2 style="color: #111;">أهلاً بك ${customerName}،</h2>
                <p>تم تأكيد حجز استشارتك بنجاح. نحن نتطلع للتحدث معك ومساعدتك في الوصول إلى أهدافك.</p>
                
                <div style="background-color: #f9f9f9; border-right: 4px solid #000; padding: 20px; margin: 25px 0; border-radius: 4px;">
                  <h3 style="margin-top: 0; color: #000;">تفاصيل الموعد:</h3>
                  <p><strong>التاريخ:</strong> ${dateStr}</p>
                  <p><strong>الوقت:</strong> ${timeStr} (بتوقيتك المحلي)</p>
                  <p><strong>المدة:</strong> 60 دقيقة</p>
                </div>
                
                <div style="text-align: center; margin: 35px 0;">
                  <a href="${meetingLink}" style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">الانضمام للاجتماع المرئي</a>
                </div>
                
                <p style="color: #555; font-size: 15px;">استعد جيداً للاستشارة وجهّز كل أسئلتك لنستثمر الوقت بأفضل شكل ممكن. نحن هنا لدعمك وتقديم القيمة الحقيقية التي تبحث عنها.</p>
                
                <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
                
                <p style="color: #888; font-size: 14px;">مع خالص التحيات،<br/><strong>الأستاذ جاسم محمد — BLACK4ME</strong></p>
              </div>
            `,
          });
        } catch (emailErr: any) {
          console.error('Failed to send confirmation email:', emailErr.message);
        }
      }
    } else if (triggerEvent === 'BOOKING_CANCELLED') {
      const { uid } = payload;
      await supabaseAdmin.from('consultations')
        .update({ status: 'cancelled' })
        .eq('booking_uid', uid);
    } else if (triggerEvent === 'BOOKING_RESCHEDULED') {
      const { uid, startTime, endTime } = payload;
      await supabaseAdmin.from('consultations')
        .update({ 
          start_time: startTime, 
          end_time: endTime,
          status: 'rescheduled'
        })
        .eq('booking_uid', uid);
    } else if (triggerEvent === 'BOOKING_COMPLETED') {
      const { uid, attendees } = payload;
      const customerName = attendees?.[0]?.name || 'عميل';
      const customerEmail = attendees?.[0]?.email || '';

      await supabaseAdmin.from('consultations')
        .update({ status: 'completed' })
        .eq('booking_uid', uid);

      if (customerEmail) {
        try {
          await sendReviewRequestEmail(customerEmail, customerName, 'consultation', uid, 'جلسة استشارة شخصية');
        } catch (emailErr: any) {
          console.error('Failed to send post-consultation email:', emailErr.message);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Cal webhook error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

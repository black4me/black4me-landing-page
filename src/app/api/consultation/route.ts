import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '../../../lib/supabase';
import { sendToActivepieces } from '../../../lib/activepieces';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export async function POST(req: Request) {
  try {
    const { customerName, customerEmail, notes } = await req.json();

    if (!customerName || !customerEmail) {
      return NextResponse.json({ error: 'Missing name or email' }, { status: 400 });
    }

    // Try saving to Supabase but ignore errors if table doesn't exist yet
    const { data: dbData, error: dbError } = await supabase.from('consultations').insert([{
      customer_name: customerName,
      customer_email: customerEmail,
      appointment_date: 'TBD',
      appointment_time: 'TBD',
      notes: notes || null,
      status: 'scheduled',
    }]).select();

    if (dbError) {
      console.warn("Could not save consultation to DB. Table might not exist:", dbError);
    }

    // Send email notification to admin
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'BLACK4ME <support@black4me.com>',
        to: 'jasstylesg1@gmail.com',
        subject: `[BLACK4ME] طلب استشارة جديد من ${customerName} 📅`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>طلب استشارة جديد! 🎉</h2>
            <p>لقد قام عميل جديد بالبدء في حجز استشارة من خلال الموقع.</p>
            <ul>
              <li><strong>الاسم:</strong> ${customerName}</li>
              <li><strong>البريد الإلكتروني:</strong> ${customerEmail}</li>
              <li><strong>طبيعة العمل / ملاحظات:</strong> ${notes || 'لا يوجد'}</li>
            </ul>
            <p>العميل الآن موجه إلى Notion Calendar لاختيار الوقت.</p>
          </div>
        `,
      });
    }

    // Send notification to Activepieces
    await sendToActivepieces(process.env.ACTIVEPIECES_WEBHOOK_URL_CONSULTATION, {
      event: 'new_consultation',
      customerName,
      customerEmail,
      notes,
    });

    return NextResponse.json({ success: true, dbSaved: !dbError });
  } catch (error: any) {
    console.error("Consultation API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase-admin';
import { sendConsultationEmail } from '../../../server/actions/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { triggerEvent, payload } = body;

    if (triggerEvent === 'BOOKING_CREATED') {
      const { uid, title, startTime, endTime, attendees } = payload;
      
      const customerName = attendees?.[0]?.name || 'عميل';
      const customerEmail = attendees?.[0]?.email || '';

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
        await sendConsultationEmail(customerEmail, customerName, startTime, title);
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
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Cal webhook error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { Resend } from 'resend';
import { sendToActivepieces } from '../../../../lib/activepieces';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export async function GET(req: Request) {
  // Protect cron endpoint (Vercel sets this header for cron requests)
  const authHeader = req.headers.get('authorization');
  if (process.env.VERCEL_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Find pending sessions older than 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: abandonedSessions } = await supabase
      .from('checkout_sessions')
      .select('*')
      .eq('status', 'pending')
      .lt('created_at', oneHourAgo);

    if (!abandonedSessions || abandonedSessions.length === 0) {
      return NextResponse.json({ message: 'No abandoned carts found.' });
    }

    const sentEmails = [];

    for (const session of abandonedSessions) {
      // Send email
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'BLACK4ME <support@black4me.com>',
          to: session.email,
          subject: 'لقد نسيت شيئاً مهماً في سلة التسوق! 🛒',
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>مرحباً!</h2>
              <p>لاحظنا أنك كنت على وشك الحصول على الحزمة التدريبية ولكنك لم تكمل عملية الدفع.</p>
              <p>كهدية خاصة، نود تقديم <strong>خصم 10%</strong> لك إذا أكملت الشراء الآن.</p>
              <p>استخدم الكود: <strong>COMEBACK10</strong></p>
              <br/>
              <a href="https://black4me-landing-page.vercel.app/" style="background-color: #6C3BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">أكمل الشراء الآن</a>
            </div>
          `,
        });
      }

      // Send to Activepieces instead of/in addition to Resend if configured
      await sendToActivepieces(process.env.ACTIVEPIECES_WEBHOOK_URL_ABANDONED_CART, {
        event: 'abandoned_cart',
        email: session.email,
        checkoutId: session.id
      });

      // Mark as recovered so we don't email them again
      await supabase.from('checkout_sessions').update({ status: 'recovered' }).eq('id', session.id);
      sentEmails.push(session.email);
    }

    return NextResponse.json({ message: `Sent ${sentEmails.length} abandoned cart emails.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

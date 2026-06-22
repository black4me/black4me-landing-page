import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export async function GET(req: Request) {
  // Protect cron endpoint
  const authHeader = req.headers.get('authorization');
  if (process.env.VERCEL_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const now = new Date().toISOString();

    // Fetch scheduled campaigns that haven't been sent yet
    const { data: campaigns } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_at', now);

    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({ message: 'No scheduled campaigns.' });
    }

    // Fetch all subscribers
    const { data: subscribers } = await supabase.from('subscribers').select('email');
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers found.' });
    }

    const emailsTo = subscribers.map(s => s.email);

    for (const campaign of campaigns) {
      if (process.env.RESEND_API_KEY) {
        // Send in batches of 50 (Resend limits)
        for (let i = 0; i < emailsTo.length; i += 50) {
          const batch = emailsTo.slice(i, i + 50);
          await resend.emails.send({
            from: 'BLACK4ME <newsletter@black4me.com>',
            to: [],
            bcc: batch,
            subject: campaign.subject,
            html: `<div dir="rtl" style="font-family: Arial, sans-serif;">${campaign.content.replace(/\\n/g, '<br/>')}</div>`,
          });
        }
      }

      await supabase.from('email_campaigns').update({
        status: 'sent',
        sent_at: new Date().toISOString()
      }).eq('id', campaign.id);
    }

    return NextResponse.json({ message: `Sent ${campaigns.length} campaigns.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

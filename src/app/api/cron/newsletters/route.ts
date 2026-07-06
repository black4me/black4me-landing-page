import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../../lib/supabase-admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

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

    // Fetch all newsletter subscribers
    const { data: subscribers } = await supabase.from('subscribers').select('email, name');
    
    // Fetch all lead magnets
    const { data: leadMagnets } = await supabase.from('lead_magnets').select('email, name');

    for (const campaign of campaigns) {
      let emailsToMap: Record<string, string> = {}; // map email to name

      const target = campaign.target_audience || 'all';

      if (target === 'all' || target === 'newsletter') {
        if (subscribers) {
          subscribers.forEach(sub => {
            if (sub.email) emailsToMap[sub.email] = sub.name || '';
          });
        }
      }

      if (target === 'all' || target === 'lead_magnets') {
        if (leadMagnets) {
          leadMagnets.forEach(lm => {
            if (lm.email) emailsToMap[lm.email] = lm.name || '';
          });
        }
      }

      const uniqueEmails = Object.keys(emailsToMap);

      if (uniqueEmails.length === 0) {
        // No recipients found for this campaign target
        await supabase.from('email_campaigns').update({
          status: 'sent',
          sent_at: new Date().toISOString()
        }).eq('id', campaign.id);
        continue;
      }

      // Render the HTML using the LeadMagnet template
      let htmlContent = campaign.content || campaign.body || ''; // Handle old body field if it existed

      if (process.env.RESEND_API_KEY) {
        const { render } = await import('@react-email/render');
        const LeadMagnetEmail = (await import('../../../../emails/LeadMagnetEmail')).default;

        // Fetch site settings for logos etc
        const { data: settingsData } = await supabase.from('site_settings').select('*');
        const settings = (settingsData || []).reduce((acc, row) => {
          acc[row.key] = row.value;
          return acc;
        }, {} as Record<string, string>);

        // Send in batches of 50 (Resend limits)
        for (let i = 0; i < uniqueEmails.length; i += 50) {
          const batch = uniqueEmails.slice(i, i + 50);
          
          // Since we use BCC, we don't have individualized names for each person in the BCC list
          // So we use a generic greeting if there are multiple.
          // Wait, if it's a generic greeting, we can just pass '' to userFirstname.
          
          const renderedHtml = await render(
            LeadMagnetEmail({
              userFirstname: 'صديقي', // Generic name
              emailSubject: campaign.subject,
              emailBody: htmlContent,
              logoUrl: settings.site_logo,
              instagramUrl: settings.social_instagram_url,
              whatsappUrl: settings.social_whatsapp_url,
              supportEmail: settings.social_support_email,
            })
          );

          await resend.emails.send({
            from: 'BLACK4ME <hello@black4me.com>',
            to: [],
            bcc: batch,
            subject: campaign.subject,
            html: renderedHtml,
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

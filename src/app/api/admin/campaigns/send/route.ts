import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase-admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

// POST /api/admin/campaigns/send
// Body: { campaignId: string }
export async function POST(req: NextRequest) {
  try {
    const { campaignId } = await req.json();

    if (!campaignId) {
      return NextResponse.json({ error: 'campaignId مطلوب' }, { status: 400 });
    }

    // 1. Fetch campaign
    const { data: campaign, error: campErr } = await supabaseAdmin
      .from('email_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campErr || !campaign) {
      return NextResponse.json({ error: 'الحملة غير موجودة' }, { status: 404 });
    }

    if (campaign.status === 'sent') {
      return NextResponse.json({ error: 'هذه الحملة أُرسلت بالفعل' }, { status: 400 });
    }

    // 2. Collect recipients based on target_audience
    const target = campaign.target_audience || 'all';
    const emailMap: Record<string, string> = {}; // maps email -> full name

    if (target === 'all' || target === 'newsletter') {
      const { data: subs } = await supabaseAdmin.from('subscribers').select('email, name');
      (subs || []).forEach((s: any) => { if (s.email) emailMap[s.email] = s.name || ''; });
    }

    if (target === 'all' || target === 'lead_magnets') {
      // Fetch from crm.leads
      const { data: crmLeads } = await supabaseAdmin.schema('crm').from('leads').select('email, full_name');
      (crmLeads || []).forEach((l: any) => { if (l.email) emailMap[l.email] = l.full_name || ''; });

      // Fetch from public.lead_magnets if it exists
      try {
        const { data: lms } = await supabaseAdmin.from('lead_magnets').select('email, name');
        (lms || []).forEach((l: any) => { if (l.email) emailMap[l.email] = l.name || ''; });
      } catch (e) {
        // lead_magnets table might not exist in some configurations
      }
    }

    if (target === 'buyers') {
      const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('customer_email, customer_name')
        .eq('status', 'completed');
      (orders || []).forEach((o: any) => { if (o.customer_email) emailMap[o.customer_email] = o.customer_name || ''; });
    }

    if (target === 'cart_abandoners') {
      // Started checkout but did not complete order in last 30 days
      const { data: events } = await supabaseAdmin
        .from('events')
        .select('user_email, parameters')
        .eq('event_type', 'DynamicOfferCheckoutStarted');
      
      const { data: completedOrders } = await supabaseAdmin
        .from('orders')
        .select('customer_email')
        .eq('status', 'completed');
      
      const completedEmails = new Set((completedOrders || []).map(o => o.customer_email));
      
      (events || []).forEach((ev: any) => {
        if (ev.user_email && !completedEmails.has(ev.user_email)) {
          emailMap[ev.user_email] = ev.parameters?.name || 'صديقنا المميز';
        }
      });
    }

    if (target === 'consultation_signups') {
      const { data: consultations } = await supabaseAdmin.from('consultations').select('email, name');
      (consultations || []).forEach((c: any) => { if (c.email) emailMap[c.email] = c.name || ''; });
    }

    if (target === 'no_purchase') {
      // Registered but no orders
      const { data: allUsers } = await supabaseAdmin.from('users').select('email, name');
      const { data: orders } = await supabaseAdmin.from('orders').select('customer_email');
      const buyerEmails = new Set((orders || []).map(o => o.customer_email));

      (allUsers || []).forEach((u: any) => {
        if (u.email && !buyerEmails.has(u.email)) {
          emailMap[u.email] = u.name || '';
        }
      });
    }

    const recipients = Object.entries(emailMap);

    if (recipients.length === 0) {
      return NextResponse.json({ error: 'لا يوجد مستلمون في الجمهور المحدد' }, { status: 400 });
    }

    // 3. Build HTML content
    const bodyContent = campaign.body || campaign.content || '';
    const isHtml = bodyContent.trim().startsWith('<');
    const htmlBody = isHtml
      ? bodyContent
      : `<div dir="rtl" style="font-family:sans-serif;line-height:1.8;color:#d1d1d6;background:#0d0d10;padding:32px;border-radius:16px;">${bodyContent.replace(/\n/g, '<br/>')}</div>`;

    // 4. Send individually to replace variables for personalization
    let successCount = 0;
    let errorCount = 0;

    for (const [email, name] of recipients) {
      const firstName = name.split(' ')[0] || 'صديقنا';
      
      // Dynamic variables replacement
      let personalizedSubject = campaign.subject
        .replace(/{{name}}/g, name || 'صديقنا المميز')
        .replace(/{{first_name}}/g, firstName)
        .replace(/{{email}}/g, email)
        .replace(/{{offer_name}}/g, 'عرض BLACK4ME الحصري')
        .replace(/{{discount_code}}/g, 'BLACK15')
        .replace(/{{consultation_link}}/g, 'https://black4me.com/#consultation')
        .replace(/{{instagram_handle}}/g, '@black4mee');

      let personalizedHtml = htmlBody
        .replace(/{{name}}/g, name || 'صديقنا المميز')
        .replace(/{{first_name}}/g, firstName)
        .replace(/{{email}}/g, email)
        .replace(/{{offer_name}}/g, 'عرض BLACK4ME الحصري')
        .replace(/{{discount_code}}/g, 'BLACK15')
        .replace(/{{consultation_link}}/g, 'https://black4me.com/#consultation')
        .replace(/{{instagram_handle}}/g, '@black4mee');

      try {
        const payload = {
          from: 'جاسم محمد — BLACK4ME <noreply@black4me.com>',
          to: email,
          subject: personalizedSubject,
          html: personalizedHtml,
        };

        const res = await resend.emails.send(payload);
        if (res.error) {
          console.error(`Failed to send email to ${email}:`, res.error);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        errorCount++;
        console.error(`Exception sending email to ${email}:`, err);
      }
    }

    // 5. Mark campaign as sent
    await supabaseAdmin
      .from('email_campaigns')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        recipients_count: successCount,
      })
      .eq('id', campaignId);

    return NextResponse.json({
      success: true,
      sent: successCount,
      errors: errorCount,
      total: recipients.length,
    });

  } catch (err: any) {
    console.error('Campaign send error:', err);
    return NextResponse.json({ error: err.message || 'فشل الإرسال' }, { status: 500 });
  }
}

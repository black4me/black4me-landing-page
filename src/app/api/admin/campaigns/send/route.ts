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
    const emailMap: Record<string, string> = {};

    if (target === 'all' || target === 'newsletter') {
      const { data: subs } = await supabaseAdmin.from('subscribers').select('email, name');
      (subs || []).forEach((s: any) => { if (s.email) emailMap[s.email] = s.name || ''; });
    }

    if (target === 'all' || target === 'lead_magnets') {
      const { data: lms } = await supabaseAdmin.from('lead_magnets').select('email, name');
      (lms || []).forEach((l: any) => { if (l.email) emailMap[l.email] = l.name || ''; });
    }

    if (target === 'buyers') {
      const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('customer_email, customer_name')
        .eq('status', 'completed');
      (orders || []).forEach((o: any) => { if (o.customer_email) emailMap[o.customer_email] = o.customer_name || ''; });
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
      : `<div dir="rtl" style="font-family:sans-serif;line-height:1.8;color:#fff;background:#111;padding:32px;border-radius:8px;">${bodyContent.replace(/\n/g, '<br/>')}</div>`;

    // 4. Send in batches (Resend batch max 100)
    const BATCH_SIZE = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      const emails = batch.map(([email, name]) => ({
        from: 'جاسم محمد — BLACK4ME <noreply@black4me.com>',
        to: email,
        subject: campaign.subject,
        html: htmlBody,
      }));

      try {
        // Send individually to avoid batch endpoint issues
        for (const emailPayload of emails) {
          const res = await resend.emails.send(emailPayload);
          if (res.error) errorCount++;
          else successCount++;
        }
      } catch (batchErr) {
        errorCount += batch.length;
        console.error('Batch send error:', batchErr);
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

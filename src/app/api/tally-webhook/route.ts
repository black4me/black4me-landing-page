import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase-admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Tally webhook endpoint active' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Tally payload structure has data.fields
    const fields = body?.data?.fields || [];
    if (!fields || fields.length === 0) {
      return NextResponse.json({ error: 'No fields found in payload' }, { status: 400 });
    }

    // Parse Tally fields robustly
    const parsed: Record<string, any> = {
      full_name: '',
      email: '',
      phone: '',
      book_rating: 5,
      review_text: '',
      needs_consultation: false
    };

    for (const field of fields) {
      const label = field.label || '';
      const key = field.key || '';
      const val = field.value;

      if (val === undefined || val === null) continue;

      const lowerLabel = label.toLowerCase();
      const lowerKey = key.toLowerCase();

      if (lowerKey === 'email' || lowerLabel.includes('البريد') || lowerLabel.includes('email')) {
        parsed.email = String(val).trim();
      } else if (lowerKey === 'full_name' || lowerKey === 'name' || lowerLabel.includes('الاسم') || lowerLabel.includes('name')) {
        parsed.full_name = String(val).trim();
      } else if (lowerKey === 'phone' || lowerLabel.includes('الجوال') || lowerLabel.includes('الهاتف') || lowerLabel.includes('phone')) {
        parsed.phone = String(val).trim();
      } else if (lowerKey === 'book_rating' || lowerLabel.includes('تقييم') || lowerLabel.includes('rating')) {
        parsed.book_rating = Number(val) || 5;
      } else if (lowerKey === 'review_text' || lowerLabel.includes('مراجعة') || lowerLabel.includes('رأيك') || lowerLabel.includes('review') || lowerLabel.includes('نص')) {
        parsed.review_text = String(val).trim();
      } else if (lowerKey === 'needs_consultation' || lowerLabel.includes('استشارة') || lowerLabel.includes('consultation') || lowerLabel.includes('صعوبة') || lowerLabel.includes('أطبق') || lowerLabel.includes('اطبق')) {
        const strVal = String(val).toLowerCase();
        parsed.needs_consultation = strVal.includes('yes') || strVal.includes('نعم') || strVal === 'true' || strVal.includes('لم أفهم') || strVal.includes('لم افهم') || strVal.includes('صعوبة');
      }
    }

    if (!parsed.email) {
      return NextResponse.json({ error: 'Email field is required' }, { status: 400 });
    }

    const stage = parsed.needs_consultation ? 'Consultation Invited' : 'Review Received';

    // 1. Save to book_reviews table
    const { error: dbErr } = await supabaseAdmin.from('book_reviews').insert({
      full_name: parsed.full_name || 'عميل',
      email: parsed.email,
      phone: parsed.phone || null,
      needs_consultation: parsed.needs_consultation,
      review_text: parsed.review_text || null,
      book_rating: parsed.book_rating,
      source: 'Book Review',
      stage: stage
    });

    if (dbErr) {
      console.error('Error saving review to DB:', dbErr.message);
    }

    // 2. Also save/upsert to subscribers table
    await supabaseAdmin.from('subscribers').upsert({
      name: parsed.full_name || 'عميل',
      email: parsed.email,
      country: 'SA'
    }, { onConflict: 'email' });

    // 3. Conditional: If customer needs help / consultation, send email via Resend
    if (parsed.needs_consultation) {
      try {
        await resend.emails.send({
          from: 'BLACK4ME <noreply@black4me.com>',
          to: parsed.email,
          subject: '🎁 هدية: دعوة لاستشارة استراتيجية مجانية مع الأستاذ جاسم',
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111; line-height: 1.6; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #000; letter-spacing: 2px; font-weight: 900; margin: 0;">BLACK4ME</h1>
                <p style="color: #888; font-size: 14px; margin-top: 5px;">نصنع الأنظمة التي تنمو تلقائياً</p>
              </div>
              
              <h2 style="color: #000; font-size: 20px; border-bottom: 2px solid #f5c542; padding-bottom: 8px;">مرحباً ${parsed.full_name || 'عميلنا العزيز'}،</h2>
              
              <p>شكراً جزيلاً لمشاركتك مراجعتك القيمة حول كتاب <strong>"بدون تسويق كارثة تهدد ثروتك المستقبلية"</strong>.</p>
              
              <p>لقد لاحظنا من خلال مراجعتك أنك واجهت بعض الصعوبة أو التحديات في فهم كيفية تطبيق الاستراتيجيات التسويقية المذكورة في الكتاب على مشروعك الخاص.</p>
              
              <div style="background-color: #fafafa; border-right: 4px solid #f5c542; padding: 20px; margin: 25px 0; border-radius: 6px;">
                <h3 style="margin-top: 0; color: #000; font-size: 17px;">🎁 هديتك الخاصة: جلسة استشارية مجانية 1:1</h3>
                <p style="margin-bottom: 0; font-size: 15px; color: #444;">
                  يسعدنا دعوتك لحجز <strong>جلسة استشارة استراتيجية مجانية (مدتها 60 دقيقة)</strong> مباشرة مع الأستاذ <strong>جاسم محمد</strong> (مستشار التسويق الرقمي في BLACK4ME) لمساعدتك في فك شيفرة التطبيق العملي وبناء عروضك التسويقية.
                </p>
              </div>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="https://cal.com/black4me/consultation" style="background-color: #000; color: #fff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">احجز استشارتك المجانية الآن 📅</a>
              </div>
              
              <p style="color: #555; font-size: 14px; text-align: center;">* المواعيد محدودة جداً وتُمنح الأولوية لأوائل المسجلين.</p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
              
              <p style="color: #888; font-size: 14px;">مع أطيب التحيات،<br/><strong>فريق الدعم — BLACK4ME</strong></p>
            </div>
          `
        });
      } catch (emailErr: any) {
        console.error('Failed to send conditional consultation email:', emailErr.message);
      }
    }

    return NextResponse.json({ success: true, parsed });
  } catch (err: any) {
    console.error('Tally webhook error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

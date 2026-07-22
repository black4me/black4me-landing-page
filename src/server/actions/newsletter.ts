"use server";

import { supabaseAdmin } from '../../lib/supabase-admin';
import { sendToActivepieces } from '../../lib/activepieces';
import { trackEvent, upsertUser } from './tracking';

export async function subscribeToNewsletter(payload: { name: string; email: string; country: string }) {
  try {
    const { name, email, country } = payload;

    // Check if user exists
    const { data: existing } = await supabaseAdmin.from('subscribers').select('id').eq('email', email).single();
    if (existing) {
      return { success: false, message: 'مرحبًا بك، هذا البريد الإلكتروني مسجل مسبقًا معنا!' };
    }

    // Track lead capture event
    await trackEvent({
      eventType: 'lead_capture',
      userEmail: email,
      parameters: { type: 'newsletter_signup', country }
    });

    // Upsert User
    await upsertUser({
      email,
      name,
      country,
      status: 'lead'
    });

    const { error } = await supabaseAdmin.from('subscribers').insert([{ name, email }]);
    if (error) {
      return { success: false, message: 'حدث خطأ أثناء التسجيل. حاول مرة أخرى.' };
    }

    // Notify Activepieces
    await sendToActivepieces(process.env.ACTIVEPIECES_WEBHOOK_URL_NEWSLETTER, {
      event: 'new_subscriber',
      name,
      email,
      country,
    });

    return { success: true, message: 'تهانينا! تم تسجيل اشتراكك بنجاح في رسائلنا التسويقية الحصرية.' };
  } catch (err) {
    return { success: false, message: 'تعذر الاتصال بالخادم.' };
  }
}

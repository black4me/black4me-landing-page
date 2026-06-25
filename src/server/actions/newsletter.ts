"use server";

import { supabaseAdmin } from '../../lib/supabase-admin';

export async function subscribeToNewsletter(payload: { name: string; email: string; country: string }) {
  try {
    const { name, email, country } = payload;
    
    // Check if user exists
    const { data: existing } = await supabaseAdmin.from('subscribers').select('id').eq('email', email).single();
    if (existing) {
      return { success: false, message: 'مرحبًا بك، هذا البريد الإلكتروني مسجل مسبقًا معنا!' };
    }

    const { error } = await supabaseAdmin.from('subscribers').insert([{ name, email, country }]);
    if (error) {
      return { success: false, message: 'حدث خطأ أثناء التسجيل. حاول مرة أخرى.' };
    }

    return { success: true, message: 'تهانينا! تم تسجيل اشتراكك بنجاح في رسائلنا التسويقية الحصرية.' };
  } catch (err) {
    return { success: false, message: 'تعذر الاتصال بالخادم.' };
  }
}

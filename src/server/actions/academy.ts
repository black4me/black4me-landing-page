"use server";

import { supabaseAdmin } from '../../lib/supabase-admin';

export async function verifyAcademyCode(code: string) {
  try {
    // Check if the code exists in an order that is completed
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('id, status')
      .eq('access_code', code.trim().toUpperCase())
      .single();

    if (error || !order) {
      return { success: false, message: "كود الدخول غير صحيح أو غير موجود." };
    }

    if (order.status !== 'completed') {
      return { success: false, message: "حالة الطلب المرتبط بهذا الكود غير مكتملة بعد." };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error verifying academy code:', err.message);
    return { success: false, message: "حدث خطأ أثناء التحقق من الكود." };
  }
}

'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_EMAILS = [
  'info@black4me.com',
  'admin@black4me.com',
  'black4mestore@gmail.com',
  'admin@admin.com',
];

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    redirect('/login?error=' + encodeURIComponent(error?.message || 'فشل تسجيل الدخول'));
  }

  const userEmail = data.user?.email?.toLowerCase() ?? '';
  if (ADMIN_EMAILS.includes(userEmail)) {
    redirect('/admin/site-settings');
  } else {
    redirect('/portal');
  }
}

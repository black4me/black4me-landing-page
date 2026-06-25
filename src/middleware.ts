import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check for auth cookie
    const accessToken = request.cookies.get('sb-access-token')?.value
      || request.cookies.get(`sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`)?.value;

    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect portal routes
  if (pathname.startsWith('/portal')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    if (!supabaseUrl) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const accessToken = request.cookies.get('sb-access-token')?.value
      || request.cookies.get(`sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`)?.value;

    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect admin API routes
  if (pathname.startsWith('/api/order/approve')) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*', '/api/order/approve'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (pathname.startsWith('/admin') || pathname.startsWith('/portal')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Helper to extract access token from cookies
  const getAccessToken = () => {
    let tokenValue = request.cookies.get('sb-access-token')?.value;
    if (!tokenValue) {
      const projectId = new URL(supabaseUrl).hostname.split('.')[0];
      const cookieVal = request.cookies.get(`sb-${projectId}-auth-token`)?.value;
      if (cookieVal) {
        try {
          const parsed = JSON.parse(cookieVal);
          tokenValue = parsed[0]; // access_token is typically the first element
        } catch (e) {
          tokenValue = cookieVal;
        }
      }
    }
    return tokenValue;
  };

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const accessToken = getAccessToken();
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: supabaseKey,
        },
      });

      if (!userRes.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      const user = await userRes.json();
      const adminEmails = ['info@black4me.com', 'admin@black4me.com', 'admin@admin.com', 'test@test.com'];
      if (!adminEmails.includes(user.email?.toLowerCase())) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect portal routes
  if (pathname.startsWith('/portal')) {
    const accessToken = getAccessToken();
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: supabaseKey,
        },
      });

      if (!userRes.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (e) {
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

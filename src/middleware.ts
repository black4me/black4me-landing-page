import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Fallback degraded limiter (in-memory, ephemeral per-instance)
// "Fail-safe" mode to ensure checkout/login doesn't crash if Upstash is down.
const degradedModeLimiter = new Map<string, { count: number, resetAt: number }>();

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "10 s"),
    })
  : null;

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const { pathname } = request.nextUrl;

  if (ratelimit && (request.method === 'POST' || pathname.startsWith('/api/'))) {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    
    try {
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }
    } catch (ratelimitError) {
      console.warn(`[Circuit Breaker] Upstash Redis failed, entering degraded mode for IP ${ip}`, ratelimitError);
      
      // Degraded Mode (Fail-safe memory limiter)
      const now = Date.now();
      
      // OOM Protection: Clear map if it gets too large
      if (degradedModeLimiter.size > 1000) {
        // Find and delete expired entries to free up memory
        for (const [key, state] of degradedModeLimiter.entries()) {
          if (now > state.resetAt) {
            degradedModeLimiter.delete(key);
          }
        }
        // If still too large, forcefully clear the oldest half or just clear all
        if (degradedModeLimiter.size > 1000) {
           degradedModeLimiter.clear();
        }
      }
      
      const userState = degradedModeLimiter.get(ip);
      
      if (!userState || now > userState.resetAt) {
        degradedModeLimiter.set(ip, { count: 1, resetAt: now + 10000 }); // 10s window
      } else {
        userState.count += 1;
        if (userState.count > 10) {
          return NextResponse.json({ error: 'Too many requests (Degraded)' }, { status: 429 });
        }
      }
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Fail-open prevention: If we don't have supabase config, redirect to login if accessing protected routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/portal')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Validate the session officially
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    const adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
      : ['info@black4me.com', 'admin@black4me.com', 'black4mestore@gmail.com'];
      
    if (!user.email || !adminEmails.includes(user.email.toLowerCase())) {
       return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect portal routes
  if (pathname.startsWith('/portal')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect admin API routes
  if (pathname.startsWith('/api/order/approve') || pathname.startsWith('/api/admin/')) {
    // If it's an admin API, verify they have an admin session
    // Or if it's schedule-newsletters, allow it if they have the webhook secret (handled in the route itself)
    // But we shouldn't block webhooks here unless we know it's a browser request.
    // Let's rely on the route's own protection for webhooks to avoid breaking external services.
    
    // For /api/order/approve specifically:
    if (pathname.startsWith('/api/order/approve')) {
      const authHeader = request.headers.get('authorization');
      if (!authHeader && !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

import { NextResponse } from 'next/server';

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

// In-memory store for rate limiting (Note: This is per-instance, so in a serverless environment it resets often, but still provides basic spam protection)
const rateLimits = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // Max 5 checkout requests per minute per IP

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);

  if (!entry) {
    rateLimits.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true; // Allowed
  }

  if (now > entry.resetTime) {
    rateLimits.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true; // Allowed
  }

  if (entry.count >= MAX_REQUESTS) {
    return false; // Rate limited
  }

  entry.count++;
  return true; // Allowed
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return 'unknown-ip';
}

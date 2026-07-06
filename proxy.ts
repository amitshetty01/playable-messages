import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";

  if (host.includes("vercel.app")) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  const res = NextResponse.next();
  res.headers.set("Content-Security-Policy", [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://*.highperformanceformat.com https://*.effectivecpmnetwork.com https://*.adsterra.com https://*.trafficfactory.com https://*.profitablecreativeformat.com https://*.furiousexpansion.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://www.google.com https://*.highperformanceformat.com https://*.effectivecpmnetwork.com https:",
    "frame-src 'self' https://*.highperformanceformat.com https://*.effectivecpmnetwork.com https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
  ].join("; "));
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};

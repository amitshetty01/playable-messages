import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.highperformanceformat.com https://*.highperformanceformat.com https://*.effectivecpmnetwork.com https://*.adsterra.com https://*.trafficfactory.com https://*.profitablecreativeformat.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://www.google.com https://*.highperformanceformat.com https://*.effectivecpmnetwork.com https://*.adsterra.com https://*.trafficfactory.com https://*.profitablecreativeformat.com`,
  `frame-src 'self' https://*.highperformanceformat.com https://*.effectivecpmnetwork.com https://*.adsterra.com https://*.trafficfactory.com https://*.profitablecreativeformat.com`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {
    root: projectRoot
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;

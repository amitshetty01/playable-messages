import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SoundToggleWrapper } from "@/components/SoundToggleWrapper";
import { SoundWelcome } from "@/components/SoundWelcome";
import { CookieBanner } from "@/components/CookieBanner";
import { ResponsiveBannerAd } from "@/components/ResponsiveBannerAd";
import { defaultDescription, defaultOgImage, siteName } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

const title = "Craft Your Message";
const description = "Create interactive messages people actually feel.";

export const metadata: Metadata = {
  title,
  description,
  verification: { google: "YqkvRoFtGrwkcNkndiT3yVoJhOPtECJ83gExA47yJh8" },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }
    ],
    apple: "/apple-touch-icon.png"
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title,
    description,
    url: absoluteUrl("/"),
    siteName,
    type: "website",
    images: [{ url: absoluteUrl(defaultOgImage), width: 1200, height: 630, alt: `${siteName} interactive message generator` }]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [absoluteUrl(defaultOgImage)]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#18122b"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-CKB6NM2LXG" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-CKB6NM2LXG');`}
        </Script>
        <script dangerouslySetInnerHTML={{ __html: `if("serviceWorker" in navigator){navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(r){r.unregister()})})}` }} />
        <a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-ink" href="#content">
          Skip to content
        </a>
        <Analytics />
        <Header />
        <ResponsiveBannerAd />
        <main id="content" className="mx-auto min-h-[calc(100svh-220px)] w-full max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
        <Footer />
        <SoundWelcome />
        <SoundToggleWrapper />
        <CookieBanner />
      </body>
    </html>
  );
}

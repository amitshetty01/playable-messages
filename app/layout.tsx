import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, Nunito_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme/context";
import { SoundToggleWrapper } from "@/components/SoundToggleWrapper";
import { SoundWelcome } from "@/components/SoundWelcome";
import { CookieBanner } from "@/components/CookieBanner";
import { ResponsiveBannerAd } from "@/components/ResponsiveBannerAd";
import { defaultDescription, defaultOgImage, siteName } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  weight: "variable",
  variable: "--font-display",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});

const title = "Craft Your Message - Send Love, Birthday & Sorry Messages That Feel Like a Surprise";
const description = "Turn your words into an interactive link. Send birthday surprises, love confessions, apology messages, and funny roasts that people actually want to open.";

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
    <html lang="en" className={`dark ${fraunces.variable} ${nunito.variable}`} suppressHydrationWarning>
      <body>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem("theme");if(t==="light"){document.documentElement.classList.remove("dark");document.documentElement.classList.add("light")}}catch(e){}})()`}
        </Script>
        <ThemeProvider>
        <LanguageProvider>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-CKB6NM2LXG" strategy="lazyOnload" />
        <Script id="google-analytics" strategy="lazyOnload">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-CKB6NM2LXG');`}
        </Script>
        <Script id="sw-unregister" strategy="afterInteractive">
          {`if("serviceWorker" in navigator){navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(r){r.unregister()})})}`}
        </Script>
        <a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white-static focus:px-4 focus:py-2 focus:text-ink" href="#content">
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
        </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, Nunito_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import { ConditionalChrome } from "@/components/ConditionalChrome";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme/context";
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

const title = "Craft Your Message - Create Interactive Messages Online with Games & Animations";
const description = "Create interactive messages people actually feel. Send apology messages, birthday wishes, love confessions, funny roasts, and friendship notes with unique shareable experience links.";

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
        <ConditionalChrome>
          {children}
        </ConditionalChrome>
        </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

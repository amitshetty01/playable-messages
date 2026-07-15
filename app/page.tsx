import type { Metadata } from "next";
import CinematicHomepage from "@/components/CinematicHomepage";
import { siteName, defaultDescription, jsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: `AI-Powered Interactive Messages | ${siteName}`,
  description: "Describe your idea and AI will craft a beautiful interactive experience in seconds. Confessions, apologies, birthday surprises, and more.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: `Create AI-Powered Interactive Messages | ${siteName}`,
    description: defaultDescription,
    url: absoluteUrl("/"),
    siteName,
    type: "website",
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: `${siteName} AI message generator` }]
  },
  twitter: {
    card: "summary_large_image",
    title: `Create AI-Powered Interactive Messages | ${siteName}`,
    description: defaultDescription,
    images: [absoluteUrl("/opengraph-image")]
  }
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd([
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteName,
              url: absoluteUrl("/"),
              description: defaultDescription
            },
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: siteName,
              url: absoluteUrl("/"),
              description: defaultDescription,
              applicationCategory: "Multimedia",
              operatingSystem: "All",
              browserRequirements: "Requires JavaScript"
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteName,
              url: absoluteUrl("/"),
              description: defaultDescription,
              foundingDate: "2025",
              sameAs: [
                "https://github.com/amitshetty01"
              ]
            }
          ])
        }}
      />
      <CinematicHomepage />
    </>
  );
}

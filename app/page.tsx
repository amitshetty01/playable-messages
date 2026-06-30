import type { Metadata } from "next";
import { HomePageContent } from "@/components/HomePageContent";
import { siteName, defaultDescription } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Create Interactive Messages Online | ${siteName}`,
  description: "Create interactive messages with games and animations. Send apology, birthday wishes, love confessions, and funny roasts as unique shareable links.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: `Create Interactive Messages Online | ${siteName}`,
    description: defaultDescription,
    url: absoluteUrl("/"),
    siteName,
    type: "website",
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: `${siteName} interactive message generator` }]
  },
  twitter: {
    card: "summary_large_image",
    title: `Create Interactive Messages Online | ${siteName}`,
    description: defaultDescription,
    images: [absoluteUrl("/opengraph-image")]
  }
};

export default function Page() {
  return <HomePageContent />;
}

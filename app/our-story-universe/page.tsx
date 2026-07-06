import type { Metadata } from "next"
import OurStoryUniverse from "@/components/our-story-universe/OurStoryUniverse"
import { siteName, defaultOgImage } from "@/lib/seo"
import { absoluteUrl } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Our Story Universe — Create Your Living Storybook | Craft Your Message",
  description: "Turn your love, memories, and dreams into a living storybook. Become the main characters of your own story.",
  alternates: { canonical: absoluteUrl("/our-story-universe") },
  openGraph: {
    title: "Our Story Universe — Create Your Living Storybook",
    description: "Turn your love, memories, and dreams into a living storybook. Become the main characters of your own story.",
    url: absoluteUrl("/our-story-universe"),
    siteName,
    type: "website",
    images: [{ url: absoluteUrl(defaultOgImage), width: 1200, height: 630, alt: `${siteName} Our Story Universe` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Story Universe — Create Your Living Storybook",
    description: "Turn your love, memories, and dreams into a living storybook.",
    images: [absoluteUrl(defaultOgImage)],
  },
}

export default function Page() {
  return <OurStoryUniverse />
}

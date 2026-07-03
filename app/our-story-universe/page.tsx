import type { Metadata } from "next"
import OurStoryUniverse from "@/components/our-story-universe/OurStoryUniverse"

export const metadata: Metadata = {
  title: "Our Story Universe — Create Your Living Storybook",
  description: "Turn your love, memories, and dreams into a living storybook. Become the main characters of your own story.",
  openGraph: {
    title: "Our Story Universe",
    description: "Create a personalized animated storybook for you and your partner.",
  },
}

export default function Page() {
  return <OurStoryUniverse />
}

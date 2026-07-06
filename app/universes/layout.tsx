import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Our Story Universe - Create Your Living Storybook | Craft Your Message",
  description: "Turn your love story into a living universe. Create personalized storybooks with chapters, themes, and interactive elements for you and your partner.",
  path: "/universes",
});

export default function UniversesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

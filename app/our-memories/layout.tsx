import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Our Memories - A Beautiful Love Story Page | Craft Your Message",
  description: "Create a personalized love story page with photos, memories, promises, and a days counter. Share your unique love story with your special someone.",
  path: "/our-memories",
});

export default function OurMemoriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

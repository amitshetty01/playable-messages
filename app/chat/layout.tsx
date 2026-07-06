import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Secret Room - Private Anonymous Chat Rooms | Craft Your Message",
  description: "Create or join private chat rooms with unique access codes. Send messages, photos, videos, and stickers that stay until you delete them.",
  path: "/chat",
  noIndex: true,
});

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}

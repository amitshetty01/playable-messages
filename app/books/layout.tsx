import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "My Books - Write & Publish Your Interactive Love Story | Craft Your Message",
  description: "Create and manage your AI-assisted storybooks. Write love stories, capture memories, and turn them into beautifully formatted books with chapters.",
  path: "/books",
});

export default function BooksLayout({ children }: { children: React.ReactNode }) {
  return children;
}

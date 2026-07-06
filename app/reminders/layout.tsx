import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Occasion Reminders - Never Forget a Birthday or Anniversary | Craft Your Message",
  description: "Set reminders for birthdays, anniversaries, and special occasions. We'll notify you before important dates so you can create the perfect message in time.",
  path: "/reminders",
});

export default function RemindersLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/edit/", "/my-experiences/", "/reminders/", "/books/", "/universes/", "/chat/", "/surprise/", "/report/", "/demo/", "/whatsapp-preview/"],
      crawlDelay: 10,
    },
    sitemap: absoluteUrl("/sitemap.xml")
  };
}

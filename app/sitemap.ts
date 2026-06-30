import type { MetadataRoute } from "next";
import { categories, getTemplateSeoSlug, moods, templates } from "@/lib/data";
import { useCasePages } from "@/lib/seo-content";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["/", "/about", "/templates", "/faq", "/privacy", "/terms", "/report", "/contact", "/create", "/my-experiences", "/chat", "/our-memories"];
  const templatePaths = templates.map((template) => `/templates/${getTemplateSeoSlug(template)}`);
  const useCasePaths = useCasePages.map((page) => `/use-cases/${page.slug}`);
  const moodPaths = moods.map((mood) => `/mood/${mood.slug}`);
  const categoryPaths = categories.map((cat) => `/category/${cat.slug}`);

  return [...staticPaths, ...templatePaths, ...useCasePaths, ...moodPaths, ...categoryPaths].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" as const : "monthly" as const,
    priority: path === "/" ? 1 : path.startsWith("/templates") ? 0.85 : path.startsWith("/category") || path.startsWith("/mood") ? 0.8 : path.startsWith("/use-cases") ? 0.7 : path === "/about" || path === "/contact" || path === "/faq" ? 0.7 : 0.65
  }));
}

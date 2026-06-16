import type { MetadataRoute } from "next";
import { categories, getTemplateSeoSlug, templates } from "@/lib/data";
import { useCasePages } from "@/lib/seo-content";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["/", "/about", "/categories", "/templates", "/faq", "/privacy", "/terms", "/report", "/contact", "/create", "/my-experiences"];
  const categoryPaths = categories.map((category) => `/category/${category.slug}`);
  const templatePaths = templates.map((template) => `/templates/${getTemplateSeoSlug(template)}`);
  const useCasePaths = useCasePages.map((page) => `/use-cases/${page.slug}`);

  return [...staticPaths, ...categoryPaths, ...templatePaths, ...useCasePaths].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" as const : "monthly" as const,
    priority: path === "/" ? 1 : path.startsWith("/use-cases") || path.startsWith("/templates") ? 0.85 : path === "/about" || path === "/contact" || path === "/faq" ? 0.7 : 0.65
  }));
}

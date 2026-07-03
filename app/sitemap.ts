import type { MetadataRoute } from "next";
import { categories, getTemplateSeoSlug, moods, templates } from "@/lib/data";
import { useCasePages } from "@/lib/seo-content";
import { allMessagesCache, collections, generators, gameSeoPages, seasonalPages, imageSeoPages } from "@/lib/messages-data";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["/", "/about", "/templates", "/faq", "/privacy", "/terms", "/report", "/contact", "/create", "/my-experiences", "/chat", "/our-memories", "/explore", "/messages", "/collections", "/generator", "/games", "/seasonal", "/images", "/reminders", "/whatsapp-preview"];
  const templatePaths = templates.map((template) => `/templates/${getTemplateSeoSlug(template)}`);
  const useCasePaths = useCasePages.map((page) => `/use-cases/${page.slug}`);
  const moodPaths = moods.map((mood) => `/mood/${mood.slug}`);
  const categoryPaths = categories.map((cat) => `/category/${cat.slug}`);

  const messagePaths = allMessagesCache.map((msg) => `/messages/${msg.slug}`);
  const collectionPaths = collections.map((col) => `/collections/${col.slug}`);
  const generatorPaths = generators.map((gen) => `/generator/${gen.slug}`);
  const gamePaths = gameSeoPages.map((game) => `/games/${game.slug}`);
  const seasonalPaths = seasonalPages.map((s) => `/seasonal/${s.slug}`);
  const imagePaths = imageSeoPages.map((img) => `/images/${img.slug}`);

  const indexPaths = [
    "/messages", "/collections", "/generator", "/games", "/seasonal", "/images"
  ];

  const allPaths = [
    ...staticPaths.map((path) => ({ path, priority: path === "/" ? 1 : 0.7 })),
    ...templatePaths.map((path) => ({ path, priority: 0.85 })),
    ...useCasePaths.map((path) => ({ path, priority: 0.7 })),
    ...moodPaths.map((path) => ({ path, priority: 0.8 })),
    ...categoryPaths.map((path) => ({ path, priority: 0.8 })),
    ...messagePaths.map((path) => ({ path, priority: 0.65 })),
    ...collectionPaths.map((path) => ({ path, priority: 0.8 })),
    ...generatorPaths.map((path) => ({ path, priority: 0.75 })),
    ...gamePaths.map((path) => ({ path, priority: 0.8 })),
    ...seasonalPaths.map((path) => ({ path, priority: 0.75 })),
    ...imagePaths.map((path) => ({ path, priority: 0.7 })),
    ...indexPaths.map((path) => ({ path, priority: 0.8 })),
  ];

  return allPaths.map(({ path, priority }) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" as const : "monthly" as const,
    priority,
  }));
}

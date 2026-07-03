import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

export const siteName = "Craft Your Message";
export const defaultDescription = "Create interactive love, birthday, sorry, and memory messages you can share as a link. Turn words into surprises with games, reveals, and heartfelt moments.";
export const defaultOgImage = "/opengraph-image";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
};

export function buildMetadata({ title, description, path, image = defaultOgImage, noIndex = false }: MetadataInput): Metadata {
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteName} interactive message generator`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl]
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false
          }
        }
      : undefined
  };
}

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

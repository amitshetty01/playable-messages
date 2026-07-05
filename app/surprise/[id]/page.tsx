import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getExperience } from "@/lib/experiences";
import { siteName } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import { SurpriseSite } from "./SurpriseSite";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const title = "You have a surprise message";
  const description = "A personal surprise message just for you.";
  return {
    title: `${title} | ${siteName}`,
    description,
    alternates: { canonical: absoluteUrl(`/surprise/${id}`) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/surprise/${id}`),
      siteName,
      type: "website",
      images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/opengraph-image")],
    },
    robots: { index: false, follow: false },
  };
}

export default async function SurprisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await getExperience(id);
  if (!data) notFound();

  return <SurpriseSite experience={data} />;
}

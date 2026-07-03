import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getExperience } from "@/lib/experiences";
import { siteName } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import { SurpriseSite } from "./SurpriseSite";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getExperience(id);
  const title = data?.creatorName ? `A message for you from ${data.creatorName}` : "You have a surprise message";
  return {
    title: `${title} | ${siteName}`,
    description: data?.finalMessage?.slice(0, 120) || "A personal surprise message just for you.",
    openGraph: {
      title,
      description: "A personal surprise message just for you.",
      url: absoluteUrl(`/surprise/${id}`),
      siteName,
      type: "website",
      images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630 }],
    },
  };
}

export default async function SurprisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await getExperience(id);
  if (!data) notFound();

  return <SurpriseSite experience={data} />;
}

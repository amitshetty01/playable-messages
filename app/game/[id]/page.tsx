import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return buildMetadata({
    title: "Legacy Message Link",
    description: "Legacy generated message route that redirects to the current experience URL.",
    path: `/game/${id}`,
    noIndex: true
  });
}

export default async function LegacyExperienceRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/experience/${id}`);
}

import { notFound } from "next/navigation";
import { getExperience } from "@/lib/experiences";
import { buildMetadata } from "@/lib/seo";
import { CreatorDashboard } from "@/components/CreatorDashboard";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getExperience(id);
  if (!data) return buildMetadata({ title: "Not Found", description: "Experience not found.", path: `/my-experiences/${id}`, noIndex: true });
  return buildMetadata({ title: `${data.creatorName}'s journey`, description: `See how your message traveled.`, path: `/my-experiences/${id}`, noIndex: true });
}

export default async function JourneyPage({ params }: Props) {
  const { id } = await params;
  const { data, error } = await getExperience(id);
  if (!data || error) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
      <CreatorDashboard experienceId={id} />
    </div>
  );
}

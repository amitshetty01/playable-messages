import type { Metadata } from "next";
import { ExperiencePlayer } from "@/components/ExperiencePlayer";
import { getTemplate } from "@/lib/data";
import { getExperience } from "@/lib/experiences";
import { SCENE_ENGINE_TEMPLATES } from "@/lib/scene-registry";
import { absoluteUrl, truncate } from "@/lib/utils";
import { siteName } from "@/lib/seo";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function EmbedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await getExperience(id);

  if (error || !data) {
    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center text-center px-4">
        <div className="glass rounded-[2rem] p-8 sm:p-12 max-w-md">
          <p className="text-5xl mb-4">🔗</p>
          <h1 className="text-xl font-bold text-white">Experience not found</h1>
          <p className="mt-3 text-sm text-white/60">This link may have expired or been removed.</p>
        </div>
      </div>
    );
  }

  const template = getTemplate(data.templateId) ?? getTemplate("the-final-button");
  if (!template) {
    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center text-center px-4">
        <div className="glass rounded-[2rem] p-8 sm:p-12 max-w-md">
          <p className="text-5xl mb-4">🔮</p>
          <h1 className="text-xl font-bold text-white">Template unavailable</h1>
          <p className="mt-3 text-sm text-white/60">The template for this experience is no longer available.</p>
        </div>
      </div>
    );
  }

  return (
    <ExperiencePlayer experience={data} mode="generated" shareUrl={absoluteUrl(`/experience/${data.id}`)} template={template} />
  );
}

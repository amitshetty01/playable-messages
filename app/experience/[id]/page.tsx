import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { ExperiencePlayer } from "@/components/ExperiencePlayer";
import { getTemplate } from "@/lib/data";
import { getExperience } from "@/lib/experiences";
import { SCENE_ENGINE_TEMPLATES } from "@/lib/scene-registry";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return buildMetadata({
    title: "Private Interactive Message",
    description: "A generated interactive message link. Generated experience pages are noindex by default.",
    path: `/experience/${id}`,
    noIndex: true
  });
}

export default async function ExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await getExperience(id);

  if (error || !data) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <div className="glass rounded-[2rem] p-5 sm:p-8">
          <p className="text-xs font-bold tracking-[0.08em] text-rose-100">Experience unavailable</p>
          <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-5xl">This generated link could not load.</h1>
          <p className="mt-5 text-white/70">{error || "The experience may not exist."}</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link className="premium-button" href="/create">Create a new one</Link>
            <Link className="ghost-button" href="/templates">Browse templates</Link>
          </div>
        </div>
      </div>
    );
  }

  const template = getTemplate(data.templateId) ?? getTemplate("the-final-button")!;
  const isScene = SCENE_ENGINE_TEMPLATES.includes(data.templateId) || SCENE_ENGINE_TEMPLATES.includes(template.id);

  if (isScene) {
    return (
      <ExperiencePlayer experience={data} mode="generated" shareUrl={absoluteUrl(`/experience/${data.id}`)} template={template} />
    );
  }

  return (
    <div className="space-y-6">
      <ExperiencePlayer experience={data} mode="generated" shareUrl={absoluteUrl(`/experience/${data.id}`)} template={template} />
      <div className="flex justify-center gap-3">
        <Link className="ghost-button" href={`/edit/${data.id}`}>Edit this message</Link>
      </div>
      <AdSlot label="After completion ad slot" />
    </div>
  );
}

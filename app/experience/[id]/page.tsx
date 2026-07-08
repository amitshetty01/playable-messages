import type { Metadata } from "next";
import Link from "next/link";
import { ExperiencePlayer } from "@/components/ExperiencePlayer";
import { getTemplate } from "@/lib/data";
import { getExperience } from "@/lib/experiences";
import { SCENE_ENGINE_TEMPLATES } from "@/lib/scene-registry";
import { buildMetadata, siteName, defaultOgImage } from "@/lib/seo";
import { absoluteUrl, truncate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getExperience(id);
  const title = data?.finalMessage ? truncate(data.finalMessage, 60) : "Interactive Message";
  const receiverName = data?.receiverName || "";
  const template = data?.templateId ? getTemplate(data.templateId) : null;
  const templateName = template?.title || "";

  const ogDescription = receiverName
    ? `A secret interactive message for ${receiverName}...`
    : `A ${templateName || "interactive message"} created on ${siteName}`;

  const ogImage = data?.templateId
    ? `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(ogDescription)}&type=message&receiverName=${encodeURIComponent(receiverName)}&templateName=${encodeURIComponent(templateName)}`
    : defaultOgImage;

  const metaDescription = receiverName
    ? `A secret interactive message for ${receiverName}... Open to play.`
    : "An interactive message experience created with love on Craft Your Message.";

  return {
    title: `${title} | ${siteName}`,
    description: metaDescription,
    alternates: { canonical: absoluteUrl(`/experience/${id}`) },
    openGraph: {
      title,
      description: metaDescription,
      url: absoluteUrl(`/experience/${id}`),
      siteName,
      type: "website",
      images: [{ url: absoluteUrl(ogImage), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
      images: [absoluteUrl(ogImage)],
    },
    robots: { index: false, follow: false },
  };
}

export default async function ExperiencePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ghost?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const isGhost = sp.ghost === "true";
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

  const template = getTemplate(data.templateId) ?? getTemplate("the-final-button");

  if (!template) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <div className="glass rounded-[2rem] p-5 sm:p-8">
          <p className="text-xs font-bold tracking-[0.08em] text-rose-100">Template unavailable</p>
          <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-5xl">The template for this experience is no longer available.</h1>
          <p className="mt-5 text-white/70">This experience may have been created with a template that has been removed.</p>
        </div>
      </div>
    );
  }

  const isScene = SCENE_ENGINE_TEMPLATES.includes(data.templateId) || SCENE_ENGINE_TEMPLATES.includes(template.id);

  const mode = isGhost ? "ghost" : "generated";

  if (isScene) {
    return (
      <ExperiencePlayer experience={data} mode={mode} shareUrl={absoluteUrl(`/experience/${data.id}`)} template={template} />
    );
  }

  return (
    <div className="space-y-6">
      <ExperiencePlayer experience={data} mode={mode} shareUrl={absoluteUrl(`/experience/${data.id}`)} template={template} />
      <div className="flex justify-center gap-3">
        <Link className="ghost-button" href={`/edit/${data.id}`}>Edit this message</Link>
      </div>
    </div>
  );
}

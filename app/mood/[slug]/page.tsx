import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TemplateCard } from "@/components/TemplateCard";
import { getMood, getTemplatesByMood, moods } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return moods.map((mood) => ({ slug: mood.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const mood = getMood(slug);
  if (!mood) return buildMetadata({ title: "Mood Not Found", description: "This mood page could not be found.", path: `/mood/${slug}`, noIndex: true });
  return buildMetadata({
    title: `${mood.name} Message Templates`,
    description: `${mood.description} Browse interactive ${mood.name.toLowerCase()} templates and create a shareable message link.`,
    path: `/mood/${mood.slug}`
  });
}

export default async function MoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mood = getMood(slug);
  if (!mood) notFound();
  const items = getTemplatesByMood(mood.slug);

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">
          <span className="mr-1">{mood.emoji}</span>
          {mood.name} mood
        </p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">
          {mood.emoji} {mood.name} templates.
        </h1>
        <p className="mt-5 max-w-3xl text-white/70">{mood.description}</p>
      </section>
      {items.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <p className="glass rounded-3xl p-5 text-center text-white/70 sm:p-8">
          No {mood.name.toLowerCase()} templates yet.
        </p>
      )}
    </div>
  );
}

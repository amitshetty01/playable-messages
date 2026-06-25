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

const moodSeoText: Record<string, string> = {
  love: "Send a romantic interactive love confession your crush will never forget. Just type your message, pick a style, and share the link. Watch them play through a beautifully designed experience before reading your words.",
  sorry: "Apologize in a creative way that shows you really care. Make your sorry message interactive with a fun game or reveal — it turns a tough moment into something they'll smile about.",
  funny: "Make them laugh out loud with a playful interactive message. Perfect for roasting your best friend, sending a hilarious inside joke, or just making their day brighter.",
  birthday: "Create a memorable birthday message that goes beyond a simple text. Add games, surprises, and a final heartfelt reveal that makes them feel special on their big day.",
  roast: "Deliver the ultimate playful roast through an interactive experience. Build up the suspense with games and challenges before dropping your savage punchline.",
  memory: "Celebrate your friendship or relationship with a nostalgic interactive message. Share inside jokes, favorite memories, and emotional moments in a way that feels personal.",
  mystery: "Build suspense with a mysterious interactive reveal. Perfect for dramatic confessions, hidden feelings, or any message that deserves a dramatic buildup.",
};

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
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/50">{moodSeoText[slug]}</p>
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

import type { Metadata } from "next";
import Link from "next/link";
import { seasonalPages } from "@/lib/messages-data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Seasonal Messages - Wishes for Every Occasion | Craft Your Message",
  description: "Find messages for every season and celebration. Valentine's Day, Mother's Day, Christmas, Diwali, and more.",
  path: "/seasonal",
});

export default function SeasonalIndexPage() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Seasonal</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">Seasonal Messages</h1>
        <p className="mt-5 max-w-3xl text-white/70">Find the perfect message for every season and celebration. Updated yearly with fresh content.</p>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {seasonalPages.map((item) => (
          <Link
            key={item.slug}
            href={`/seasonal/${item.slug}`}
            className="glass group rounded-[2rem] p-5 transition hover:bg-white/15 sm:p-8"
          >
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">{item.date}</p>
            <h2 className="display-title mt-3 text-2xl font-bold leading-tight sm:text-3xl">{item.title}</h2>
            <p className="mt-3 line-clamp-3 text-white/70">{item.description}</p>
          </Link>
        ))}
      </div>

      <section className="flex flex-wrap justify-center gap-3">
        <Link className="ghost-button" href="/templates">Browse Templates</Link>
        <Link className="ghost-button" href="/generator">AI Generators</Link>
        <Link className="ghost-button" href="/games">Message Games</Link>
      </section>
    </div>
  );
}

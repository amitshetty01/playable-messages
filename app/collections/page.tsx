import type { Metadata } from "next";
import Link from "next/link";
import { collections, categoryDisplay } from "@/lib/messages-data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Message Collections - Curated Lists of Messages for Every Occasion",
  description: "Browse our curated collections of messages. 100 Romantic Messages, 250 Birthday Wishes, 500 Good Night Texts, and more.",
  path: "/collections",
});

export default function CollectionsIndexPage() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Collections</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">Curated message collections</h1>
        <p className="mt-5 max-w-3xl text-white/70">Browse our hand-picked collections of messages for every occasion and relationship.</p>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {collections.map((col) => {
          const cat = categoryDisplay[col.categorySlug];
          return (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="glass group rounded-[2rem] p-5 transition hover:bg-white/15 sm:p-8"
            >
              <p className="text-xs font-bold tracking-[0.08em] text-white/50">{cat?.name || "Collection"}</p>
              <h2 className="display-title mt-3 text-2xl font-bold leading-tight sm:text-3xl">{col.title}</h2>
              <p className="mt-3 line-clamp-3 text-white/70">{col.description}</p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/60">
                {col.count} messages
              </p>
            </Link>
          );
        })}
      </div>

      <section className="flex flex-wrap justify-center gap-3">
        <Link className="ghost-button" href="/templates">Browse Templates</Link>
        <Link className="ghost-button" href="/generator">AI Generators</Link>
        <Link className="ghost-button" href="/games">Message Games</Link>
      </section>
    </div>
  );
}

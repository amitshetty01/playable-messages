import type { Metadata } from "next";
import Link from "next/link";
import { gameSeoPages } from "@/lib/messages-data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Interactive Message Games - Play & Share | Craft Your Message",
  description: "Explore our collection of interactive message games. Hide love letters, crack codes, solve puzzles, and deliver messages in creative ways.",
  path: "/games",
});

export default function GamesIndexPage() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Games</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">Interactive Message Games</h1>
        <p className="mt-5 max-w-3xl text-white/70">Turn your message into a fun interactive game. From love letters hidden in puzzles to birthday wishes behind candles — every message becomes an experience.</p>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {gameSeoPages.map((game) => (
          <Link
            key={game.slug}
            href={`/games/${game.slug}`}
            className="glass group rounded-[2rem] p-5 transition hover:bg-white/15 sm:p-8"
          >
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">{game.category}</p>
            <h2 className="display-title mt-3 text-2xl font-bold leading-tight sm:text-3xl">{game.title}</h2>
            <p className="mt-3 line-clamp-3 text-white/70">{game.description}</p>
          </Link>
        ))}
      </div>

      <section className="flex flex-wrap justify-center gap-3">
        <Link className="ghost-button" href="/templates">Browse Templates</Link>
        <Link className="ghost-button" href="/generator">AI Generators</Link>
        <Link className="ghost-button" href="/collections">View Collections</Link>
      </section>
    </div>
  );
}

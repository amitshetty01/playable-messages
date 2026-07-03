import type { Metadata } from "next";
import Link from "next/link";
import { generators } from "@/lib/messages-data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "AI Message Generators - Write Personalized Messages",
  description: "Use our AI message generators to create personalized love letters, birthday wishes, apology messages, and more. Free and easy to use.",
  path: "/generator",
});

export default function GeneratorIndexPage() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">AI Generators</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">AI Message Generators</h1>
        <p className="mt-5 max-w-3xl text-white/70">Find the perfect words with our AI-powered message generators. Pick a generator and create a personalized message in seconds.</p>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {generators.map((gen) => (
          <Link
            key={gen.slug}
            href={`/generator/${gen.slug}`}
            className="glass group rounded-[2rem] p-5 transition hover:bg-white/15 sm:p-8"
          >
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">{gen.tone}</p>
            <h2 className="display-title mt-3 text-2xl font-bold leading-tight sm:text-3xl">{gen.title}</h2>
            <p className="mt-3 line-clamp-3 text-white/70">{gen.description}</p>
          </Link>
        ))}
      </div>

      <section className="flex flex-wrap justify-center gap-3">
        <Link className="ghost-button" href="/templates">Browse Templates</Link>
        <Link className="ghost-button" href="/collections">View Collections</Link>
        <Link className="ghost-button" href="/games">Message Games</Link>
      </section>
    </div>
  );
}

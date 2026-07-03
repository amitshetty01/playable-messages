import type { Metadata } from "next";
import Link from "next/link";
import { templates, categories, moods } from "@/lib/data";
import { gameSeoPages, generators, collections } from "@/lib/messages-data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Explore - Interactive Message Templates & Games | Craft Your Message",
  description: "Explore featured, trending, and new interactive message templates. Browse by mood, category, or game type.",
  path: "/explore",
});

export default function ExplorePage() {
  const liveTemplates = templates.filter((t) => t.status === "full");
  const featured = liveTemplates.slice(0, 6);
  const newTemplates = liveTemplates.slice().reverse().slice(0, 6);

  return (
    <div className="space-y-12 sm:space-y-16">
      <section className="glass rounded-[2rem] p-5 sm:p-8 lg:p-10">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Explore</p>
        <h1 className="display-title mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">Discover interactive messages</h1>
        <p className="mt-4 max-w-3xl text-lg text-white/70">Browse featured templates, popular games, and AI generators. Find the perfect way to express yourself.</p>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Templates</p>
            <h2 className="display-title mt-1 text-3xl font-bold sm:text-4xl">Featured templates</h2>
          </div>
          <Link className="text-sm font-bold text-white/50 hover:text-white/80 transition" href="/templates">View all →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((template) => (
            <Link
              key={template.id}
              href={`/templates/${template.slug}`}
              className="glass group rounded-[2rem] p-5 transition hover:bg-white/15 sm:p-8"
            >
              <p className="text-xs font-bold tracking-[0.08em] text-white/50">{template.tone}</p>
              <h3 className="display-title mt-3 text-2xl font-bold leading-tight sm:text-3xl">{template.title}</h3>
              <p className="mt-3 line-clamp-2 text-sm text-white/70">{template.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {template.formula.map((step) => (
                  <span key={step} className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/50">{step}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Browse by</p>
            <h2 className="display-title mt-1 text-3xl font-bold sm:text-4xl">Moods & categories</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {moods.map((mood) => (
            <Link
              key={mood.slug}
              href={`/mood/${mood.slug}`}
              className="glass group rounded-[1.4rem] p-4 transition hover:bg-white/15"
            >
              <span className="text-2xl">{mood.emoji}</span>
              <h3 className="mt-2 text-lg font-extrabold text-white">{mood.name}</h3>
              <p className="mt-1 text-xs text-white/50">{mood.description}</p>
            </Link>
          ))}
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="glass group rounded-[1.4rem] p-4 transition hover:bg-white/15"
            >
              <span className="text-lg font-extrabold" style={{ color: cat.accent }}>{cat.icon}</span>
              <h3 className="mt-2 text-lg font-extrabold text-white">{cat.name}</h3>
              <p className="mt-1 text-xs text-white/50">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Games</p>
            <h2 className="display-title mt-1 text-3xl font-bold sm:text-4xl">Interactive games</h2>
          </div>
          <Link className="text-sm font-bold text-white/50 hover:text-white/80 transition" href="/games">View all →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {gameSeoPages.slice(0, 6).map((game) => (
            <Link
              key={game.slug}
              href={`/games/${game.slug}`}
              className="glass group rounded-[2rem] p-5 transition hover:bg-white/15 sm:p-8"
            >
              <p className="text-xs font-bold tracking-[0.08em] text-white/50">{game.category}</p>
              <h3 className="display-title mt-3 text-2xl font-bold leading-tight sm:text-3xl">{game.title}</h3>
              <p className="mt-3 line-clamp-2 text-sm text-white/70">{game.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">AI Generators</p>
            <h2 className="display-title mt-1 text-3xl font-bold sm:text-4xl">AI message generators</h2>
          </div>
          <Link className="text-sm font-bold text-white/50 hover:text-white/80 transition" href="/generator">View all →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {generators.slice(0, 6).map((gen) => (
            <Link
              key={gen.slug}
              href={`/generator/${gen.slug}`}
              className="glass group rounded-[2rem] p-5 transition hover:bg-white/15 sm:p-8"
            >
              <p className="text-xs font-bold tracking-[0.08em] text-white/50">Generator</p>
              <h3 className="display-title mt-3 text-2xl font-bold leading-tight sm:text-3xl">{gen.title}</h3>
              <p className="mt-3 line-clamp-2 text-sm text-white/70">{gen.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">New templates</p>
            <h2 className="display-title mt-1 text-3xl font-bold sm:text-4xl">Recently added</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {newTemplates.map((template) => (
            <Link
              key={template.id}
              href={`/templates/${template.slug}`}
              className="glass group rounded-[2rem] p-5 transition hover:bg-white/15 sm:p-8"
            >
              <p className="text-xs font-bold tracking-[0.08em] text-white/50">{template.tone}</p>
              <h3 className="display-title mt-3 text-2xl font-bold leading-tight sm:text-3xl">{template.title}</h3>
              <p className="mt-3 line-clamp-2 text-sm text-white/70">{template.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Collections</p>
            <h2 className="display-title mt-1 text-3xl font-bold sm:text-4xl">Message collections</h2>
          </div>
          <Link className="text-sm font-bold text-white/50 hover:text-white/80 transition" href="/collections">View all →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {collections.slice(0, 6).map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="glass group rounded-[2rem] p-5 transition hover:bg-white/15 sm:p-8"
            >
              <p className="text-xs font-bold tracking-[0.08em] text-white/50">{col.count} messages</p>
              <h3 className="display-title mt-3 text-2xl font-bold leading-tight sm:text-3xl">{col.title}</h3>
              <p className="mt-3 line-clamp-2 text-sm text-white/70">{col.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

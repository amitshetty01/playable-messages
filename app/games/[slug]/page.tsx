import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BannerAd } from "@/components/BannerAd";
import { gameSeoPages, getGameSeoBySlug, getRelatedGames } from "@/lib/messages-data";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, breadcrumbSchema, articleSchema, combinedSchema, webpageSchema, howToSchema } from "@/lib/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return gameSeoPages.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameSeoBySlug(slug);
  if (!game) return buildMetadata({ title: "Game Not Found", description: "This game could not be found.", path: `/games/${slug}`, noIndex: true });
  return buildMetadata({ title: game.metaTitle, description: game.metaDescription, path: `/games/${game.slug}` });
}

export default async function GameSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = getGameSeoBySlug(slug);
  if (!game) notFound();

  const related = getRelatedGames(game);
  const breadcrumb = [
    { name: "Home", path: "/" },
    { name: "Games", path: "/games" },
    { name: game.title, path: `/games/${game.slug}` },
  ];

  const schemas = combinedSchema(
    breadcrumbSchema(breadcrumb),
    articleSchema(game.metaTitle, game.metaDescription, `/games/${game.slug}`),
    webpageSchema(game.metaTitle, game.metaDescription, `/games/${game.slug}`),
    howToSchema(`How to play ${game.title}`, game.description, game.howToPlay),
    faqSchema(game.faqs),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, "\\u003c") }} />
      <article className="space-y-8 sm:space-y-10">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-white/50" aria-label="Breadcrumb">
          {breadcrumb.map((item, i) => (
            <span key={item.path} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {i === breadcrumb.length - 1 ? <span className="text-white/80">{item.name}</span> : <Link className="hover:text-white/80 transition" href={item.path}>{item.name}</Link>}
            </span>
          ))}
        </nav>

        <section className="glass overflow-hidden rounded-[2rem] p-5 sm:p-8 lg:p-10">
          <p className="text-xs font-bold tracking-[0.08em] text-white/50">{game.category} Game</p>
          <h1 className="display-title mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">{game.h1}</h1>
          <p className="mt-4 max-w-3xl text-lg text-white/70">{game.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {game.templateId && <Link className="premium-button" href={`/create/${game.templateId}`}>Play Now</Link>}
            <Link className="ghost-button" href="/templates">Browse all templates</Link>
          </div>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="display-title text-2xl font-bold leading-tight sm:text-4xl">About this game</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/75">{game.longDescription}</p>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="display-title text-2xl font-bold leading-tight sm:text-4xl">How to play</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {game.howToPlay.map((step, i) => (
              <div key={i} className="rounded-[1.4rem] border border-white/15 bg-white/5 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white">{i + 1}</div>
                <p className="mt-4 text-white/80">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <BannerAd />

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="display-title text-2xl font-bold leading-tight sm:text-4xl">FAQ</h2>
          <div className="mt-6 grid gap-4">
            {game.faqs.map((item) => (
              <section className="rounded-[1.4rem] border border-white/15 bg-white/10 p-4" key={item.question}>
                <h3 className="text-lg font-extrabold text-white">{item.question}</h3>
                <p className="mt-2 leading-7 text-white/70">{item.answer}</p>
              </section>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section>
            <div className="mb-5">
              <p className="text-xs font-bold tracking-[0.08em] text-white/50">Related games</p>
              <h2 className="display-title mt-2 text-3xl font-bold leading-tight sm:text-5xl">More fun games</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/games/${item.slug}`}
                  className="glass group rounded-[1.4rem] p-5 transition hover:bg-white/15"
                >
                  <h3 className="text-lg font-extrabold text-white">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-white/60">{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="flex flex-wrap justify-center gap-3">
          <Link className="ghost-button" href="/templates">Browse templates</Link>
          <Link className="ghost-button" href="/collections">View collections</Link>
          <Link className="ghost-button" href="/generator">AI generators</Link>
        </section>
      </article>
    </>
  );
}

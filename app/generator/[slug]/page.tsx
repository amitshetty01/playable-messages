import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BannerAd } from "@/components/BannerAd";
import { generators, getGeneratorBySlug, getRelatedGenerators, categoryDisplay } from "@/lib/messages-data";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, breadcrumbSchema, articleSchema, combinedSchema, webpageSchema, howToSchema } from "@/lib/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return generators.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const gen = getGeneratorBySlug(slug);
  if (!gen) return buildMetadata({ title: "Generator Not Found", description: "This generator could not be found.", path: `/generator/${slug}`, noIndex: true });
  return buildMetadata({ title: gen.metaTitle, description: gen.metaDescription, path: `/generator/${gen.slug}` });
}

export default async function GeneratorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gen = getGeneratorBySlug(slug);
  if (!gen) notFound();

  const related = getRelatedGenerators(gen);
  const breadcrumb = [
    { name: "Home", path: "/" },
    { name: "AI Generators", path: "/generator" },
    { name: gen.title, path: `/generator/${gen.slug}` },
  ];

  const schemas = combinedSchema(
    breadcrumbSchema(breadcrumb),
    articleSchema(gen.metaTitle, gen.metaDescription, `/generator/${gen.slug}`),
    webpageSchema(gen.metaTitle, gen.metaDescription, `/generator/${gen.slug}`),
    faqSchema(gen.faqs),
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
          <p className="text-xs font-bold tracking-[0.08em] text-white/50">AI Generator</p>
          <h1 className="display-title mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">{gen.h1}</h1>
          <p className="mt-4 max-w-3xl text-lg text-white/70">{gen.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="premium-button" href="/create">Try the Generator</Link>
            <Link className="ghost-button" href={`/messages?category=${gen.tone}`}>Browse {gen.tone} messages</Link>
          </div>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="display-title text-2xl font-bold leading-tight sm:text-4xl">How it works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-[1.4rem] border border-white/15 bg-white/5 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white">1</div>
              <h3 className="mt-4 text-lg font-extrabold text-white">Choose your style</h3>
              <p className="mt-2 text-sm text-white/60">Select the tone, audience, and type of message you want to create.</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/15 bg-white/5 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white">2</div>
              <h3 className="mt-4 text-lg font-extrabold text-white">AI generates your message</h3>
              <p className="mt-2 text-sm text-white/60">Our AI crafts a personalized message based on your preferences.</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/15 bg-white/5 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white">3</div>
              <h3 className="mt-4 text-lg font-extrabold text-white">Customize & share</h3>
              <p className="mt-2 text-sm text-white/60">Edit, copy, or turn it into an interactive experience to share.</p>
            </div>
          </div>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="display-title text-2xl font-bold leading-tight sm:text-4xl">Try these prompts</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {gen.prompts.map((prompt) => (
              <Link key={prompt} href={`/create?prompt=${encodeURIComponent(prompt)}`} className="rounded-[1.4rem] border border-white/15 bg-white/10 p-4 text-white/75 transition hover:bg-white/15">
                &ldquo;{prompt}&rdquo;
              </Link>
            ))}
          </div>
        </section>

        <BannerAd />

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="display-title text-2xl font-bold leading-tight sm:text-4xl">FAQ</h2>
          <div className="mt-6 grid gap-4">
            {gen.faqs.map((item) => (
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
              <p className="text-xs font-bold tracking-[0.08em] text-white/50">Related generators</p>
              <h2 className="display-title mt-2 text-3xl font-bold leading-tight sm:text-5xl">More AI generators</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/generator/${item.slug}`}
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
          <Link className="ghost-button" href="/templates">Interactive Templates</Link>
          <Link className="ghost-button" href="/games">Message Games</Link>
          <Link className="ghost-button" href="/seasonal">Seasonal Messages</Link>
        </section>
      </article>
    </>
  );
}

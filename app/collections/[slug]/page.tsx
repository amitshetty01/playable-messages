import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BannerAd } from "@/components/BannerAd";
import { collections, getCollectionBySlug, getRelatedCollections, categoryDisplay } from "@/lib/messages-data";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, breadcrumbSchema, articleSchema, combinedSchema, webpageSchema } from "@/lib/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const col = getCollectionBySlug(slug);
  if (!col) return buildMetadata({ title: "Collection Not Found", description: "This collection could not be found.", path: `/collections/${slug}`, noIndex: true });
  return buildMetadata({ title: col.metaTitle, description: col.metaDescription, path: `/collections/${col.slug}` });
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const col = getCollectionBySlug(slug);
  if (!col) notFound();

  const related = getRelatedCollections(col);
  const category = categoryDisplay[col.categorySlug];
  const breadcrumb = [
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    { name: col.title, path: `/collections/${col.slug}` },
  ];

  const schemas = combinedSchema(
    breadcrumbSchema(breadcrumb),
    articleSchema(col.metaTitle, col.metaDescription, `/collections/${col.slug}`),
    webpageSchema(col.metaTitle, col.metaDescription, `/collections/${col.slug}`),
    faqSchema(col.faqs),
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
          <p className="text-xs font-bold tracking-[0.08em] text-white/50">{category?.name || "Collection"}</p>
          <h1 className="display-title mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">{col.h1}</h1>
          <p className="mt-4 max-w-3xl text-lg text-white/70">{col.description}</p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/70">
            {col.count} messages
          </p>
        </section>

        <div className="flex justify-center">
          <BannerAd />
        </div>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">FAQ</h2>
          <div className="mt-6 grid gap-4">
            {col.faqs.map((item) => (
              <section className="rounded-[1.4rem] border border-white/15 bg-white/10 p-4" key={item.question}>
                <h3 className="text-lg font-extrabold text-white">{item.question}</h3>
                <p className="mt-2 leading-7 text-white/70">{item.answer}</p>
              </section>
            ))}
          </div>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8 text-center">
          <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Browse All {category?.name || "Messages"}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/70">Find the perfect message for every moment.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link className="premium-button" href={`/messages?category=${col.categorySlug}`}>Browse All</Link>
            <Link className="ghost-button" href={`/generator`}>Try AI Generator</Link>
          </div>
        </section>

        {related.length > 0 && (
          <section>
            <div className="mb-5">
              <p className="text-xs font-bold tracking-[0.08em] text-white/50">Related collections</p>
              <h2 className="display-title mt-2 text-3xl font-bold leading-tight sm:text-5xl">More collections</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/collections/${item.slug}`}
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
          <Link className="ghost-button" href="/games">Fun Games</Link>
          <Link className="ghost-button" href="/seasonal">Seasonal Messages</Link>
        </section>
      </article>
    </>
  );
}

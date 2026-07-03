import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BannerAd } from "@/components/BannerAd";
import { imageSeoPages, getImageSeoBySlug, getRelatedImages, categoryDisplay } from "@/lib/messages-data";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, breadcrumbSchema, articleSchema, combinedSchema, webpageSchema } from "@/lib/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return imageSeoPages.map((img) => ({ slug: img.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const img = getImageSeoBySlug(slug);
  if (!img) return buildMetadata({ title: "Image Page Not Found", description: "This image page could not be found.", path: `/images/${slug}`, noIndex: true });
  return buildMetadata({ title: img.metaTitle, description: img.metaDescription, path: `/images/${img.slug}` });
}

export default async function ImageSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getImageSeoBySlug(slug);
  if (!page) notFound();

  const related = getRelatedImages(page);
  const category = categoryDisplay[page.categorySlug];
  const breadcrumb = [
    { name: "Home", path: "/" },
    { name: "Images", path: "/images" },
    { name: page.title, path: `/images/${page.slug}` },
  ];

  const schemas = combinedSchema(
    breadcrumbSchema(breadcrumb),
    articleSchema(page.metaTitle, page.metaDescription, `/images/${page.slug}`),
    webpageSchema(page.metaTitle, page.metaDescription, `/images/${page.slug}`),
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
          <p className="text-xs font-bold tracking-[0.08em] text-white/50">{category?.name || "Images"}</p>
          <h1 className="display-title mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">{page.h1}</h1>
          <p className="mt-4 max-w-3xl text-lg text-white/70">{page.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="premium-button" href="/create">Create a Message</Link>
            <Link className="ghost-button" href={`/messages?category=${page.categorySlug}`}>Browse messages</Link>
          </div>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="display-title text-2xl font-bold leading-tight sm:text-4xl">Image keywords for SEO</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {page.keywords.map((kw) => (
              <span key={kw} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white/70">{kw}</span>
            ))}
          </div>
        </section>

        <BannerAd />

        {related.length > 0 && (
          <section>
            <div className="mb-5">
              <p className="text-xs font-bold tracking-[0.08em] text-white/50">Related image pages</p>
              <h2 className="display-title mt-2 text-3xl font-bold leading-tight sm:text-5xl">More images</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/images/${item.slug}`}
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
          <Link className="ghost-button" href="/seasonal">Seasonal</Link>
        </section>
      </article>
    </>
  );
}

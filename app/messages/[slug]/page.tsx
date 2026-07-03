import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { ResponsiveBannerAd } from "@/components/ResponsiveBannerAd";
import { InlineTemplatePreview } from "@/components/InlineTemplatePreview";
import { allMessagesCache, getMessageBySlug, getRelatedMessages, categoryDisplay } from "@/lib/messages-data";
import type { MessageFaq } from "@/lib/messages-data";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, breadcrumbSchema, articleSchema, combinedSchema, webpageSchema } from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return allMessagesCache.map((msg) => ({ slug: msg.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const msg = getMessageBySlug(slug);
  if (!msg) return buildMetadata({ title: "Message Not Found", description: "This message could not be found.", path: `/messages/${slug}`, noIndex: true });
  return buildMetadata({ title: msg.metaTitle, description: msg.metaDescription, path: `/messages/${msg.slug}` });
}

export default async function MessagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const msg = getMessageBySlug(slug);
  if (!msg) notFound();

  const related = getRelatedMessages(msg);
  const category = categoryDisplay[msg.categorySlug];

  const breadcrumb = [
    { name: "Home", path: "/" },
    { name: category?.name || "Messages", path: `/messages?category=${msg.categorySlug}` },
    { name: msg.title, path: `/messages/${msg.slug}` },
  ];

  const schemas = combinedSchema(
    breadcrumbSchema(breadcrumb),
    articleSchema(msg.metaTitle, msg.metaDescription, `/messages/${msg.slug}`),
    webpageSchema(msg.metaTitle, msg.metaDescription, `/messages/${msg.slug}`),
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
          <p className="text-xs font-bold tracking-[0.08em] text-white/50">{category?.name || "Message"}</p>
          <h1 className="display-title mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">{msg.title}</h1>
          <p className="mt-4 max-w-3xl text-white/70">{msg.metaDescription}</p>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-3xl">
              <h2 className="display-title text-2xl font-bold leading-tight sm:text-4xl">Your Message</h2>
              <div className="mt-6 rounded-[1.4rem] border border-white/15 bg-white/10 p-6">
                <p className="text-lg leading-8 text-white/85 sm:text-xl sm:leading-9">{msg.content}</p>
              </div>
            </div>
            <CopyButton text={msg.content} label="Copy Message" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="premium-button" href={`/generator/${msg.categorySlug}-generator`}>Generate Your Own</Link>
            <Link className="ghost-button" href="/create">Create Interactive Message</Link>
          </div>
        </section>

        {msg.relatedTemplateId && (
          <InlineTemplatePreview templateId={msg.relatedTemplateId} />
        )}

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="display-title text-2xl font-bold leading-tight sm:text-4xl">AI Generate Your Own {msg.title}</h2>
          <p className="mt-3 text-white/70">{msg.copyPrompt}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link className="premium-button" href={`/generator/${msg.categorySlug}-generator`}>Try AI Generator</Link>
          </div>
        </section>

        <ResponsiveBannerAd />

        {msg.usageTips.length > 0 && (
          <section className="glass rounded-[2rem] p-5 sm:p-8">
            <h2 className="display-title text-2xl font-bold leading-tight sm:text-4xl">How to Use This Message</h2>
            <p className="mt-1 text-sm text-white/50">Tips to make your message land perfectly.</p>
            <ul className="mt-6 space-y-3">
              {msg.usageTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/60">{i + 1}</span>
                  <span className="text-white/75">{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {msg.bestTiming && (
          <section className="glass rounded-[2rem] p-5 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="text-2xl">⏰</span>
              <div>
                <h2 className="display-title text-xl font-bold leading-tight sm:text-2xl">Best Time to Send</h2>
                <p className="mt-2 text-white/70">{msg.bestTiming}</p>
              </div>
            </div>
          </section>
        )}

        {msg.faqs.length > 0 && (
          <section className="glass rounded-[2rem] p-5 sm:p-8">
            <h2 className="display-title text-2xl font-bold leading-tight sm:text-4xl">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-4">
              {msg.faqs.map((faq: MessageFaq, i: number) => (
                <details key={i} className="group rounded-xl border border-white/10 bg-white/[0.04] transition hover:bg-white/[0.06]">
                  <summary className="flex cursor-pointer items-center justify-between p-4 font-bold text-white/80">
                    <span>{faq.question}</span>
                    <span className="ml-2 shrink-0 text-white/30 transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <div className="border-t border-white/10 px-4 py-3 text-sm text-white/60">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section>
            <div className="mb-5">
              <p className="text-xs font-bold tracking-[0.08em] text-white/50">Related messages</p>
              <h2 className="display-title mt-2 text-3xl font-bold leading-tight sm:text-5xl">More messages like this</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/messages/${item.slug}`}
                  className="glass group rounded-[1.4rem] p-5 transition hover:bg-white/15"
                >
                  <h3 className="text-lg font-extrabold text-white">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-white/60">{item.metaDescription}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="flex flex-wrap gap-3">
          <Link className="ghost-button" href="/templates">Browse Interactive Templates</Link>
          <Link className="ghost-button" href="/collections">View Collections</Link>
          <Link className="ghost-button" href="/games">Play Message Games</Link>
        </section>
      </article>
    </>
  );
}

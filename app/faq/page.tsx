import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, jsonLd, siteName } from "@/lib/seo";
import { faqItems } from "@/lib/seo-content";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "FAQ for Interactive Messages",
  description: "Answers about creating interactive messages, apology messages, birthday links, confession reveals, funny roasts, and public shareable links.",
  path: "/faq"
});

export default function FAQPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: `${siteName} FAQ`,
    url: absoluteUrl("/faq"),
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  return (
    <article className="space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <section className="glass rounded-[2rem] p-5 sm:p-8 lg:p-10">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">FAQ</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">Questions about interactive message links</h1>
        <p className="mt-5 max-w-3xl text-white/70">Everything you need to know before creating apology messages, birthday messages, friendship notes, confession reveals, funny roast messages, and surprise shareable links.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link className="premium-button" href="/create">Create Your Own</Link>
          <Link className="ghost-button" href="/templates">Browse templates</Link>
        </div>
      </section>

      <section className="grid gap-4">
        {faqItems.map((item) => (
          <section className="glass rounded-[1.6rem] p-5 sm:p-6" key={item.question}>
            <h2 className="text-xl font-extrabold text-white">{item.question}</h2>
            <p className="mt-3 leading-7 text-white/70">{item.answer}</p>
          </section>
        ))}
      </section>
    </article>
  );
}

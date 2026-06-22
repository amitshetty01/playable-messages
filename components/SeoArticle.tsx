import Link from "next/link";
import { TemplateCard } from "@/components/TemplateCard";
import { BannerAd } from "@/components/BannerAd";
import type { FaqItem } from "@/lib/seo-content";
import type { Template } from "@/lib/types";

type SeoArticleProps = {
  eyebrow: string;
  h1: string;
  intro: string[];
  examples: string[];
  relatedTemplates: Template[];
  faqs: FaqItem[];
  children?: React.ReactNode;
};

export function SeoArticle({ eyebrow, h1, intro, examples, relatedTemplates, faqs, children }: SeoArticleProps) {
  return (
    <article className="space-y-8 sm:space-y-10">
      <section className="glass overflow-hidden rounded-[2rem] p-5 sm:p-8 lg:p-10">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">{eyebrow}</p>
        <h1 className="display-title mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">{h1}</h1>
        <div className="mt-6 grid gap-4 text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
          {intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link className="premium-button" href="/create">Create Your Own</Link>
          <Link className="ghost-button" href="/templates">Browse templates</Link>
        </div>
      </section>

      <nav className="glass rounded-[1.6rem] p-4" aria-label="Helpful internal links">
        <div className="flex flex-col gap-3 text-sm font-bold text-white/75 sm:flex-row sm:flex-wrap sm:items-center">
          <Link className="rounded-full bg-white/10 px-4 py-2 transition hover:bg-white/15" href="/mood/love">Love messages</Link>
          <Link className="rounded-full bg-white/10 px-4 py-2 transition hover:bg-white/15" href="/templates">Templates</Link>
          <Link className="rounded-full bg-white/10 px-4 py-2 transition hover:bg-white/15" href="/faq">FAQ</Link>
          <Link className="rounded-full bg-white/10 px-4 py-2 transition hover:bg-white/15" href="/create">Create page</Link>
        </div>
      </nav>

      {children}

      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Example messages</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {examples.map((example) => <blockquote className="rounded-[1.4rem] border border-white/15 bg-white/10 p-4 text-white/75" key={example}>{example}</blockquote>)}
        </div>
      </section>

      <div className="flex justify-center">
        <BannerAd />
      </div>

      <section>
        <div className="mb-5">
          <p className="text-xs font-bold tracking-[0.08em] text-white/50">Related templates</p>
          <h2 className="display-title mt-2 text-3xl font-bold leading-tight sm:text-5xl">Start with a template</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {relatedTemplates.map((template) => <TemplateCard key={template.id} template={template} />)}
        </div>
      </section>

      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">FAQ</h2>
        <div className="mt-6 grid gap-4">
          {faqs.map((item) => (
            <section className="rounded-[1.4rem] border border-white/15 bg-white/10 p-4" key={item.question}>
              <h3 className="text-lg font-extrabold text-white">{item.question}</h3>
              <p className="mt-2 leading-7 text-white/70">{item.answer}</p>
            </section>
          ))}
        </div>
      </section>

      <section className="glass rounded-[2rem] p-5 text-center sm:p-8">
        <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Ready to make one?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-white/70">Pick a template, customize the wording, preview it on mobile, and share a link when it feels right.</p>
        <Link className="premium-button mt-6" href="/create">Create Your Own</Link>
      </section>
    </article>
  );
}

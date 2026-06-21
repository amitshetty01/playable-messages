import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoArticle } from "@/components/SeoArticle";
import { getTemplate, getTemplateSeoSlug, templates } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { getTemplateSeoContent } from "@/lib/seo-content";

export function generateStaticParams() {
  return templates.map((template) => ({ slug: getTemplateSeoSlug(template) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) return buildMetadata({ title: "Template Not Found", description: "This interactive message template could not be found.", path: `/templates/${slug}`, noIndex: true });
  const seo = getTemplateSeoContent(template.id);
  return buildMetadata({
    title: seo?.title || `${template.title} Interactive Message Template`,
    description: seo?.description || template.description,
    path: `/templates/${getTemplateSeoSlug(template)}`
  });
}

export default async function TemplateSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();
  const seo = getTemplateSeoContent(template.id);
  const relatedTemplates = templates.filter((item) => item.id !== template.id && item.categorySlugs.some((categorySlug) => template.categorySlugs.includes(categorySlug))).slice(0, 3);
  const examples = seo?.examples || [template.hook, template.description, "Customize this template and reveal your own final message."];
  const faqs = seo?.faqs || [
    { question: `What is ${template.title}?`, answer: template.description },
    { question: "Can I customize it?", answer: "Yes. You can edit the wording, tone, theme, steps, and final reveal." },
    { question: "Can I share it as a link?", answer: "Yes. Generate a public link after previewing the experience." }
  ];

  if (template.status === "coming-soon") {
    return (
      <div className="flex min-h-[50dvh] flex-col items-center justify-center text-center">
        <div className="rounded-[2rem] border border-white/15 bg-white/10 p-10 backdrop-blur-2xl">
          <h1 className="display-title text-4xl font-bold text-white sm:text-5xl">{template.title}</h1>
          <p className="mt-4 text-lg text-white/60">This template is coming soon. Check back later!</p>
          <Link className="premium-button mt-6 inline-flex" href="/templates">Browse available templates</Link>
        </div>
      </div>
    );
  }

  return (
    <SeoArticle
      eyebrow="Template"
      examples={examples}
      faqs={faqs}
      h1={`${template.title} template for interactive messages`}
      intro={seo?.intro || [template.description]}
      relatedTemplates={relatedTemplates}
    >
      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Template structure</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {template.formula.map((item) => <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-white/70" key={item}>{item}</span>)}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link className="ghost-button" href={`/demo/${template.id}`}>Preview template</Link>
          <Link className="premium-button" href={`/create/${template.id}`}>Create Your Own</Link>
        </div>
      </section>

      {seo?.relatedUseCases.length ? (
        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Related use cases</h2>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {seo.relatedUseCases.map((useCase) => <Link className="ghost-button" href={`/use-cases/${useCase}`} key={useCase}>{useCase.replace(/-/g, " ")}</Link>)}
          </div>
        </section>
      ) : null}
    </SeoArticle>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SeoArticle } from "@/components/SeoArticle";
import { categories, getTemplate, getTemplateSeoSlug, templates } from "@/lib/data";
import { buildMetadata, jsonLd } from "@/lib/seo";
import { getTemplateSeoContent } from "@/lib/seo-content";
import { absoluteUrl } from "@/lib/utils";
import { combinedSchema, breadcrumbSchema, webpageSchema, creativeWorkSchema, faqSchema } from "@/lib/structured-data";

export function generateStaticParams() {
  return templates.map((template) => ({ slug: getTemplateSeoSlug(template) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) return buildMetadata({ title: "Template Not Found", description: "This interactive message template could not be found.", path: `/templates/${slug}`, noIndex: true });
  const seo = getTemplateSeoContent(template.id);
  const title = seo?.title || `${template.title} Interactive Message Template`;
  const description = seo?.description || template.description;
  const image = `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=TEMPLATE`;
  return buildMetadata({
    title,
    description,
    path: `/templates/${getTemplateSeoSlug(template)}`,
    image
  });
}

export default async function TemplateSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();

  if (template.id === "sorry-maze") {
    redirect("/sorry-maze.html");
  }

  const seo = getTemplateSeoContent(template.id);
  const slugPath = getTemplateSeoSlug(template);
  const templateCategories = categories.filter((cat) => template.categorySlugs.includes(cat.slug));
  const relatedTemplates = templates.filter((item) => item.id !== template.id && item.categorySlugs.some((categorySlug) => template.categorySlugs.includes(categorySlug))).slice(0, 10);
  const title = seo?.title || `${template.title} Interactive Message Template`;
  const description = seo?.description || template.description;
  const pagePath = `/templates/${slugPath}`;

  const breadcrumb = [
    { name: "Home", path: "/" },
    { name: "Templates", path: "/templates" },
    { name: template.title, path: pagePath },
  ];
  const examples = seo?.examples || [template.hook, template.description, "Customize this template and create your own interactive message."];
  const faqs = seo?.faqs || [
    { question: `What is ${template.title}?`, answer: template.description },
    { question: "Can I customize it?", answer: "Yes. You can edit the wording, tone, theme, steps, and final reveal." },
    { question: "Can I share it as a link?", answer: "Yes. Generate a public link after previewing the experience." }
  ];

  const schemas = combinedSchema(
    breadcrumbSchema(breadcrumb),
    webpageSchema(title, description, pagePath),
    creativeWorkSchema(title, description, pagePath),
    faqSchema(faqs),
  );

  const breadcrumbNav = (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-white/50" aria-label="Breadcrumb">
      {breadcrumb.map((item, i) => (
        <span key={item.path} className="flex items-center gap-2">
          {i > 0 && <span>/</span>}
          {i === breadcrumb.length - 1 ? <span className="text-white/80">{item.name}</span> : <Link className="hover:text-white/80 transition" href={item.path}>{item.name}</Link>}
        </span>
      ))}
    </nav>
  );

  const categoriesSection = templateCategories.length > 0 ? (
    <section className="glass rounded-[2rem] p-5 sm:p-8">
      <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Categories</h2>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {templateCategories.map((cat) => <Link className="ghost-button" href={`/category/${cat.slug}`} key={cat.slug}>{cat.name}</Link>)}
      </div>
    </section>
  ) : null;

  const useCasesSection = seo?.relatedUseCases?.length ? (
    <section className="glass rounded-[2rem] p-5 sm:p-8">
      <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Related use cases</h2>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {seo.relatedUseCases.map((useCase) => <Link className="ghost-button" href={`/use-cases/${useCase}`} key={useCase}>{useCase.replace(/-/g, " ")}</Link>)}
      </div>
    </section>
  ) : null;

  const structureSection = (
    <section className="glass rounded-[2rem] p-5 sm:p-8">
      <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Template structure</h2>
      <div className="mt-6 flex flex-wrap gap-2">
        {template.formula.map((item) => <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-white/70" key={item}>{item}</span>)}
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {template.status === "full" ? (
          <Link className="ghost-button" href={`/demo/${template.id}`}>Preview template</Link>
        ) : null}
        <Link className="premium-button" href={`/create/${template.id}`}>Create Your Own</Link>
        <Link className="ghost-button" href="/templates">Browse templates</Link>
      </div>
    </section>
  );

  const pageContent = (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, "\\u003c") }} />
      {breadcrumbNav}
      <SeoArticle
        eyebrow="Template"
        examples={examples}
        faqs={faqs}
        h1={`${template.title} template for interactive messages`}
        intro={seo?.intro || [template.description]}
        relatedTemplates={relatedTemplates}
      >
        {categoriesSection}
        {structureSection}
        {useCasesSection}
      </SeoArticle>
    </>
  );

  if (template.status === "coming-soon") {
    return (
      <>
        <div className="mb-6 rounded-[2rem] border border-amber-500/30 bg-amber-500/10 p-6 text-center backdrop-blur-2xl">
          <p className="text-lg font-bold text-amber-300">Coming Soon</p>
          <p className="mt-1 text-white/60">This template is in development. The interactive experience is not yet available, but you can still customize and create your own message using similar templates below.</p>
        </div>
        {pageContent}
      </>
    );
  }

  return pageContent;
}

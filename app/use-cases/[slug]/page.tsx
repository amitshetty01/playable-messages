import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoArticle } from "@/components/SeoArticle";
import { getTemplate } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { getUseCase, useCasePages } from "@/lib/seo-content";

export function generateStaticParams() {
  return useCasePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getUseCase(slug);
  if (!page) return buildMetadata({ title: "Use Case Not Found", description: "This message use case could not be found.", path: `/use-cases/${slug}`, noIndex: true });
  return buildMetadata({ title: page.title, description: page.description, path: `/use-cases/${page.slug}` });
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getUseCase(slug);
  if (!page) notFound();
  const relatedTemplates = page.relatedTemplateIds.map((id) => getTemplate(id)).filter((template): template is NonNullable<typeof template> => Boolean(template));

  return (
    <SeoArticle
      eyebrow="Use case"
      examples={page.examples}
      faqs={page.faqs}
      h1={page.h1}
      intro={page.intro}
      relatedTemplates={relatedTemplates}
    />
  );
}

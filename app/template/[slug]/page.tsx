import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTemplate, getTemplateSeoSlug } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplate(slug);
  return buildMetadata({
    title: template ? `${template.title} Template` : "Template Redirect",
    description: template ? template.description : "Redirecting to the current interactive message template page.",
    path: template ? `/templates/${getTemplateSeoSlug(template)}` : "/templates",
    noIndex: true
  });
}

export default async function TemplateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = getTemplate(slug);
  redirect(template ? `/templates/${getTemplateSeoSlug(template)}` : "/templates");
}

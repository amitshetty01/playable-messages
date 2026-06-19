import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CreateForm } from "@/components/CreateForm";
import { getTemplate, getTemplateSeoSlug, templates } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return templates.map((template) => ({ templateId: template.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ templateId: string }> }): Promise<Metadata> {
  const { templateId } = await params;
  const template = getTemplate(templateId);
  if (!template) return buildMetadata({ title: "Create Message", description: "Create an interactive message link.", path: `/create/${templateId}`, noIndex: true });
  return buildMetadata({
    title: `Create ${template.title}`,
    description: `Customize ${template.title} with your own words, tone, theme, steps, and final reveal.`,
    path: `/create/${getTemplateSeoSlug(template)}`
  });
}

export default async function CreateTemplatePage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params;
  const template = getTemplate(templateId);
  if (!template) notFound();
  return <CreateForm initialTemplate={template} templates={[template]} />;
}

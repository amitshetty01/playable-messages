import type { Metadata } from "next";
import Link from "next/link";
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
  if (template.status === "coming-soon") {
    return (
      <div className="flex min-h-[50dvh] flex-col items-center justify-center text-center">
        <div className="rounded-[2rem] border border-white/15 bg-white/10 p-10 backdrop-blur-2xl">
          <p className="text-2xl font-bold text-white">{template.title} is coming soon.</p>
          <Link className="premium-button mt-6 inline-flex" href="/templates">Browse available templates</Link>
        </div>
      </div>
    );
  }
  return <CreateForm initialTemplate={template} templates={templates} />;
}

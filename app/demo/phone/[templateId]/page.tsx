import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhoneDemoView } from "@/components/PhoneDemoView";
import { getTemplate, templates } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return templates.map((template) => ({ templateId: template.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ templateId: string }> }): Promise<Metadata> {
  const { templateId } = await params;
  const template = getTemplate(templateId);
  if (!template) return buildMetadata({ title: "Template Demo", description: "Preview an interactive message template.", path: `/demo/phone/${templateId}`, noIndex: true });
  return buildMetadata({
    title: `Live Preview: ${template.title}`,
    description: `Try the ${template.title} interactive message template in a live preview.`,
    path: `/demo/phone/${template.id}`
  });
}

export default async function PhoneDemoPage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params;
  const template = getTemplate(templateId);
  if (!template) notFound();
  if (template.status === "coming-soon") {
    return (
      <div className="flex min-h-[50dvh] flex-col items-center justify-center text-center px-4">
        <div className="rounded-[2rem] border border-white/15 bg-white/10 p-10 backdrop-blur-2xl">
          <h1 className="text-2xl font-bold text-white">{template.title}</h1>
          <p className="mt-3 text-white/60">This template is coming soon.</p>
          <Link className="premium-button mt-6 inline-flex" href="/templates">Browse available templates</Link>
        </div>
      </div>
    );
  }
  return <PhoneDemoView template={template} />;
}

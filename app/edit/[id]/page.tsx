import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CreateForm } from "@/components/CreateForm";
import { getTemplate, templates } from "@/lib/data";
import { getExperience } from "@/lib/experiences";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return buildMetadata({
    title: "Edit Interactive Message",
    description: "Edit your generated interactive message.",
    path: `/edit/${id}`,
    noIndex: true
  });
}

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await getExperience(id);

  if (error || !data) notFound();

  const template = getTemplate(data.templateId);
  if (!template) notFound();

  return <CreateForm existingExperience={data} initialTemplate={template} templates={templates} />;
}

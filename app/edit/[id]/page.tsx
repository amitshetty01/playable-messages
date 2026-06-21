import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CreateForm } from "@/components/CreateForm";
import { AdsterraAd } from "@/components/AdsterraAd";
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

  return (
    <>
      <div className="mb-6 flex justify-center">
        <AdsterraAd type="rectangle" />
      </div>
      <CreateForm existingExperience={data} initialTemplate={template} templates={[template]} />
      <div className="mt-10 flex flex-col items-center gap-4">
        <AdsterraAd type="rectangle" />
        <AdsterraAd type="rectangle" />
        <AdsterraAd type="rectangle" />
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <AdsterraAd type="square" />
        <AdsterraAd type="square" />
        <AdsterraAd type="square" />
      </div>
    </>
  );
}

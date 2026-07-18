import { notFound } from "next/navigation";
import { getTemplate } from "@/lib/data";
import { createDemoExperience } from "@/lib/demo";
import { ExperiencePlayer } from "@/components/ExperiencePlayer";
import { DemoProvider } from "@/components/DemoContext";

export default async function EmbedDemoPage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params;
  const template = getTemplate(templateId);
  if (!template) notFound();

  const experience = createDemoExperience(template);

  return (
    <div data-embed-root>
      <DemoProvider>
        <ExperiencePlayer
          template={template}
          experience={experience}
          mode="demo"
        />
      </DemoProvider>
    </div>
  );
}

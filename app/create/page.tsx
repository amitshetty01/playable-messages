import type { Metadata } from "next";
import { CreateForm } from "@/components/CreateForm";
import { templates } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Create an Interactive Message",
  description: "Create your own interactive message link with custom wording, tone, theme, steps, and a personal final reveal.",
  path: "/create"
});

export default function CreatePage() {
  return <CreateForm initialTemplate={templates[0]} templates={templates} />;
}

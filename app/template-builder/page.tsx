import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { TemplateBuilder } from "@/components/TemplateBuilder";

export const metadata: Metadata = buildMetadata({
  title: "Template Builder",
  description: "Create your own custom interactive template.",
  path: "/template-builder",
  noIndex: true,
});

export default function TemplateBuilderPage() {
  return <TemplateBuilder />;
}

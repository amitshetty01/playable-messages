import type { Metadata } from "next";
import { ReportForm } from "@/components/ReportForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Report Abuse",
  description: "Report harmful, manipulative, threatening, or abusive interactive message links created with Craft Your Message.",
  path: "/report"
});

export default async function ReportPage({ searchParams }: { searchParams: Promise<{ experience?: string }> }) {
  const params = await searchParams;
  return <div className="mx-auto max-w-4xl px-6"><ReportForm initialExperience={params.experience || ""} /></div>;
}

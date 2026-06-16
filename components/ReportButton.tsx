import Link from "next/link";

export function ReportButton({ experienceId }: { experienceId?: string }) {
  const href = experienceId ? `/report?experience=${encodeURIComponent(experienceId)}` : "/report";
  return <Link className="ghost-button" href={href}>Report abuse</Link>;
}

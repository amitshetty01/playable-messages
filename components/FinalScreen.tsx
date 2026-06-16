import Link from "next/link";
import { ReportButton } from "@/components/ReportButton";
import { ShareButtons } from "@/components/ShareButtons";
import { DownloadCard } from "@/components/DownloadCard";
import { FinalReveal } from "@/components/FinalReveal";

export function FinalScreen({ finalMessage, ctaMessage, shareUrl, experienceId, templateId, templateTitle, onCtaClick }: { finalMessage: string; ctaMessage: string; shareUrl?: string; experienceId?: string; templateId: string; templateTitle: string; onCtaClick?: () => void }) {
  return (
    <article className="mx-auto w-full max-w-3xl rounded-[1.6rem] border border-white/15 bg-white/10 p-5 text-center shadow-glow backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">
      <FinalReveal message={finalMessage} />
      <p className="mt-6 text-base font-extrabold text-white sm:text-lg">{ctaMessage || "Create your own interactive message."}</p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
        {shareUrl ? <ShareButtons url={shareUrl} title="Craft Your Message" /> : null}
        <Link className="premium-button" href={`/create/${templateId}`} onClick={onCtaClick}>Create your own interactive message</Link>
        <ReportButton experienceId={experienceId} />
      </div>
      {shareUrl ? <DownloadCard shareUrl={shareUrl} title={templateTitle} subtitle={ctaMessage || "A message crafted just for you"} finalMessage={finalMessage} /> : null}
    </article>
  );
}

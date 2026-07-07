"use client";

import { useState } from "react";
import Link from "next/link";
import { ReportButton } from "@/components/ReportButton";
import { ShareButtons } from "@/components/ShareButtons";
import { StoryShare } from "@/components/StoryShare";
import { FinalReveal } from "@/components/FinalReveal";
import { HoldToReveal } from "@/components/HoldToReveal";
import { AdsterraAd } from "@/components/AdsterraAd";

export function FinalScreen({ finalMessage, ctaMessage, shareUrl, experienceId, templateId, templateTitle, onCtaClick, receiverName, creatorName }: { finalMessage: string; ctaMessage: string; shareUrl?: string; experienceId?: string; templateId: string; templateTitle: string; onCtaClick?: () => void; receiverName?: string; creatorName?: string }) {
  const [revealed, setRevealed] = useState(false);
  const [showStoryShare, setShowStoryShare] = useState(false);

  if (!revealed) {
    return (
      <div className="flex min-h-[50dvh] flex-col items-center justify-center px-4">
        <p className="mb-6 text-center text-sm font-bold text-white/40">Your message is ready. Hold to reveal it.</p>
        <HoldToReveal onComplete={() => setRevealed(true)} holdDuration={2000} />
      </div>
    );
  }

  return (
    <>
      <article className="mx-auto w-full max-w-3xl rounded-[1.6rem] border border-white/15 bg-white/10 p-5 text-center shadow-glow backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">
        <FinalReveal message={finalMessage} />
        <p className="mt-6 text-base font-extrabold text-white sm:text-lg">{ctaMessage || "Create your own interactive message."}</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          {shareUrl ? <ShareButtons url={shareUrl} title="Craft Your Message" /> : null}
          <button type="button" className="ghost-button" onClick={() => setShowStoryShare(true)}>
            📱 Share to Story
          </button>
          <Link className="premium-button" href={`/create/${templateId}`} onClick={onCtaClick}>Create your own interactive message</Link>
          {experienceId ? <Link className="ghost-button" href={`/create/${templateId}?remix=${experienceId}`}>Remix this message 🔄</Link> : null}
          <ReportButton experienceId={experienceId} />
        </div>
      </article>
      {showStoryShare && finalMessage && (
        <StoryShare
          message={finalMessage}
          receiverName={receiverName || "You"}
          creatorName={creatorName || ""}
          onClose={() => setShowStoryShare(false)}
        />
      )}
      <div className="mx-auto mt-10 max-w-3xl">
        <p className="mb-3 text-center text-[10px] font-bold tracking-[0.15em] text-white/20 uppercase">Sponsored</p>
        <AdsterraAd type="rectangle" />
      </div>
    </>
  );
}

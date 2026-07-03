"use client";

import { useState, useEffect } from "react";
import { ShareButtons } from "@/components/ShareButtons";
import { FavoriteButton } from "@/components/FavoriteButton";
import { LoadingScreen } from "@/components/LoadingScreen";
import type { ExperienceRecord } from "@/lib/types";
import { absoluteUrl } from "@/lib/utils";

type SurpriseSiteProps = {
  experience: ExperienceRecord;
};

export function SurpriseSite({ experience }: SurpriseSiteProps) {
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const url = absoluteUrl(`/surprise/${experience.id}`);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <LoadingScreen
        name={experience.receiverName || experience.creatorName}
        message={experience.creatorName ? `Creating something for` : "Preparing your surprise"}
        duration={2000}
      />
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-8rem)] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="glass rounded-[2rem] p-8 sm:p-12">
          {!revealed ? (
            <>
              <div className="mb-6 text-6xl animate-bounce">💌</div>
              <h1 className="text-3xl font-bold text-white sm:text-5xl">
                {experience.creatorName
                  ? `${experience.creatorName} made this for you`
                  : "Someone made this for you"}
              </h1>
              <p className="mt-4 text-white/60">Tap the button below when you&apos;re ready.</p>
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="premium-button mt-8 text-lg px-10 py-4"
              >
                Open your surprise ✨
              </button>
            </>
          ) : (
            <>
              <div className="mb-4 text-5xl">💫</div>
              <h1 className="text-3xl font-bold text-white sm:text-5xl">
                {experience.receiverName ? `Dear ${experience.receiverName}` : "A special message for you"}
              </h1>
              <div className="mt-8 rounded-[1.4rem] border border-white/15 bg-white/10 p-6">
                <p className="text-xl leading-relaxed text-white/85">{experience.finalMessage}</p>
              </div>
              {experience.giftSongUrl && (
                <div className="mt-6 rounded-[1.4rem] border border-white/15 bg-white/10 p-4">
                  <p className="text-sm font-bold text-white/50 mb-2">🎵 A song for you</p>
                  <a
                    href={experience.giftSongUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-300 hover:text-pink-200 underline font-bold"
                  >
                    {experience.giftSongTitle || "Listen on YouTube"}
                  </a>
                </div>
              )}
              <p className="mt-6 text-sm text-white/40">— {experience.creatorName || "Someone who cares"}</p>
            </>
          )}
        </div>

        {revealed && (
          <div className="space-y-4">
            <ShareButtons url={url} title={`A surprise message from ${experience.creatorName || "someone"}`} />
            <div className="flex justify-center gap-3">
              <FavoriteButton id={experience.id} />
              <a
                href={`/create?replyTo=${experience.id}`}
                className="ghost-button text-sm"
              >
                Send a reply ✨
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

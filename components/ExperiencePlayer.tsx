"use client";

import { useEffect, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { getSceneFlow, buildSceneContext } from "@/lib/scene-registry";
import { SceneErrorBoundary } from "@/components/SceneErrorBoundary";
import { FullscreenExperience } from "@/components/FullscreenExperience";
import { LockGate } from "@/components/LockGate";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ReactionCapture } from "@/components/ReactionCapture";
import type { AnalyticsEventType, ExperienceRecord, Template } from "@/lib/types";

const SceneEngine = dynamic(() => import("@/components/SceneEngine").then((m) => ({ default: m.SceneEngine })), { ssr: false });
const StaticFrequencyGame = dynamic(() => import("@/components/games/StaticFrequencyGame").then((m) => ({ default: m.StaticFrequencyGame })), { ssr: false });
const FateCardsGame = dynamic(() => import("@/components/games/FateCardsGame").then((m) => ({ default: m.FateCardsGame })), { ssr: false });
const FrozenInIceGame = dynamic(() => import("@/components/games/FrozenInIceGame").then((m) => ({ default: m.FrozenInIceGame })), { ssr: false });
const ShakeForAnswerGame = dynamic(() => import("@/components/games/ShakeForAnswerGame").then((m) => ({ default: m.ShakeForAnswerGame })), { ssr: false });
const CalmTheStormGame = dynamic(() => import("@/components/games/CalmTheStormGame").then((m) => ({ default: m.CalmTheStormGame })), { ssr: false });
const TugOfWarGame = dynamic(() => import("@/components/games/TugOfWarGame").then((m) => ({ default: m.TugOfWarGame })), { ssr: false });
const TreasureMapGame = dynamic(() => import("@/components/games/TreasureMapGame").then((m) => ({ default: m.TreasureMapGame })), { ssr: false });
const MemoryMatchGame = dynamic(() => import("@/components/games/MemoryMatchGame").then((m) => ({ default: m.MemoryMatchGame })), { ssr: false });
const ClimbMountainGame = dynamic(() => import("@/components/games/ClimbMountainGame").then((m) => ({ default: m.ClimbMountainGame })), { ssr: false });
const BlowOutCandlesGame = dynamic(() => import("@/components/games/BlowOutCandlesGame").then((m) => ({ default: m.BlowOutCandlesGame })), { ssr: false });
const BirthdaySurpriseGame = dynamic(() => import("@/components/games/BirthdaySurpriseGame").then((m) => ({ default: m.BirthdaySurpriseGame })), { ssr: false });
const BraidBraceletGame = dynamic(() => import("@/components/games/BraidBraceletGame").then((m) => ({ default: m.BraidBraceletGame })), { ssr: false });
const SnowGlobeGame = dynamic(() => import("@/components/games/SnowGlobeGame").then((m) => ({ default: m.SnowGlobeGame })), { ssr: false });
const ScratchCardGame = dynamic(() => import("@/components/games/ScratchCardGame").then((m) => ({ default: m.ScratchCardGame })), { ssr: false });
const LoveContractGame = dynamic(() => import("@/components/games/LoveContractGame").then((m) => ({ default: m.LoveContractGame })), { ssr: false });
const DominoChainGame = dynamic(() => import("@/components/games/DominoChainGame").then((m) => ({ default: m.DominoChainGame })), { ssr: false });
const PaperAirplaneGame = dynamic(() => import("@/components/games/PaperAirplaneGame").then((m) => ({ default: m.PaperAirplaneGame })), { ssr: false });
const PhotoBoothGame = dynamic(() => import("@/components/games/PhotoBoothGame").then((m) => ({ default: m.PhotoBoothGame })), { ssr: false });
const FortuneCookieGame = dynamic(() => import("@/components/games/FortuneCookieGame").then((m) => ({ default: m.FortuneCookieGame })), { ssr: false });
const MessageInTheSandGame = dynamic(() => import("@/components/games/MessageInTheSandGame").then((m) => ({ default: m.MessageInTheSandGame })), { ssr: false });
const PartyPopperGame = dynamic(() => import("@/components/games/PartyPopperGame").then((m) => ({ default: m.PartyPopperGame })), { ssr: false });
const HeartbeatSync = dynamic(() => import("@/components/experience/HeartbeatSync").then((m) => ({ default: m.HeartbeatSync })), { ssr: false });
const PolaroidStack = dynamic(() => import("@/components/experience/PolaroidStack").then((m) => ({ default: m.PolaroidStack })), { ssr: false });
const CandleCountdown = dynamic(() => import("@/components/experience/CandleCountdown").then((m) => ({ default: m.CandleCountdown })), { ssr: false });
const ScratchCard = dynamic(() => import("@/components/experience/ScratchCard").then((m) => ({ default: m.ScratchCard })), { ssr: false });
const TiltMaze = dynamic(() => import("@/components/experience/TiltMaze").then((m) => ({ default: m.TiltMaze })), { ssr: false });
const MorseCode = dynamic(() => import("@/components/experience/MorseCode").then((m) => ({ default: m.MorseCode })), { ssr: false });
const DissolveWall = dynamic(() => import("@/components/experience/DissolveWall").then((m) => ({ default: m.DissolveWall })), { ssr: false });
const LockPick = dynamic(() => import("@/components/experience/LockPick").then((m) => ({ default: m.LockPick })), { ssr: false });
const GravityFlip = dynamic(() => import("@/components/experience/GravityFlip").then((m) => ({ default: m.GravityFlip })), { ssr: false });
const EchoChamber = dynamic(() => import("@/components/experience/EchoChamber").then((m) => ({ default: m.EchoChamber })), { ssr: false });
const BalanceScale = dynamic(() => import("@/components/experience/BalanceScale").then((m) => ({ default: m.BalanceScale })), { ssr: false });
const GameAdapter = dynamic(() => import("@/components/GameAdapter").then((m) => ({ default: m.GameAdapter })), { ssr: false });
const EscapeMeGame = dynamic(() => import("@/components/games/EscapeMeGame").then((m) => ({ default: m.EscapeMeGame })), { ssr: false });
type Mode = "demo" | "generated" | "preview";

const FLOWS: Record<string, (props: { template: Template; experience: ExperienceRecord; mode: Mode; shareUrl?: string }) => React.ReactNode> = {
  "the-last-deleted-message": (props) => <StaticFrequencyGame {...props} />,
  "the-risk-button": (props) => <FateCardsGame {...props} />,
  "glitch-truth": (props) => <FrozenInIceGame {...props} />,
  "dont-smile-challenge": (props) => <ShakeForAnswerGame {...props} />,
  "choose-my-punishment": (props) => <CalmTheStormGame {...props} />,
  "mood-repair-machine": (props) => <TugOfWarGame {...props} />,
  "the-secret-room": (props) => <TreasureMapGame {...props} />,
  "memory-maze": (props) => <MemoryMatchGame {...props} />,
  "roast-to-respect": (props) => <ClimbMountainGame {...props} />,
  "birthday-surprise-journey": (props) => <BirthdaySurpriseGame {...props} />,
  "memory-journey": (props) => <BraidBraceletGame {...props} />,
  "secret-letter": (props) => <SnowGlobeGame {...props} />,
  "surprise-room": (props) => <ScratchCardGame {...props} />,
  "type-or-else": (props) => <DominoChainGame {...props} />,
  "the-trust-scale": (props) => <PaperAirplaneGame {...props} />,
  "inkblot": (props) => <PhotoBoothGame {...props} />,
  "two-lies-one-truth": (props) => <FortuneCookieGame {...props} />,
  "the-closer-you-get": (props) => <MessageInTheSandGame {...props} />,
  "spin-to-reveal": (props) => <PartyPopperGame {...props} />,
  "heartbeat-sync": (props) => <HeartbeatSync {...props} />,
  "polaroid-stack": (props) => <PolaroidStack {...props} />,
  "candle-countdown": (props) => <CandleCountdown {...props} />,
  "scratch-card": (props) => <ScratchCard {...props} />,
  "tilt-maze": (props) => <TiltMaze {...props} />,
  "morse-code": (props) => <MorseCode {...props} />,
  "dissolve-wall": (props) => <DissolveWall {...props} />,
  "lock-pick": (props) => <LockPick {...props} />,
  "gravity-flip": (props) => <GravityFlip {...props} />,
  "echo-chamber": (props) => <EchoChamber {...props} />,
  "balance-scale": (props) => <BalanceScale {...props} />,
  "love-beats": (props) => <GameAdapter {...props} />,
  "sorry-puzzle": (props) => <GameAdapter {...props} />,
  "kitty-apology": (props) => <GameAdapter {...props} />,
  "come-closer": (props) => <GameAdapter {...props} />,
  "funny-slots": (props) => <GameAdapter {...props} />,
  "secret-decoder": (props) => <GameAdapter {...props} />,
  "birthday-cake": (props) => <GameAdapter {...props} />,
  "roast-wheel": (props) => <GameAdapter {...props} />,
  "memory-flip": (props) => <GameAdapter {...props} />,
  "mystery-fog": (props) => <GameAdapter {...props} />,
  "escape-me": (props) => <EscapeMeGame {...props} />,
  "love-contract": (props) => <LoveContractGame {...props} />,
};

export function ExperiencePlayer({ template, experience, mode, shareUrl }: { template: Template; experience: ExperienceRecord; mode: Mode; shareUrl?: string }) {
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(!experience.lockType);
  const [showReaction, setShowReaction] = useState(false);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (mode === "generated") {
      void track(experience.id, "experience_opened", template.id);
      void track(experience.id, "template_used", template.id);
    }
  }, [experience.id, mode, template.id]);

  useEffect(() => {
    if (experience.scheduledAt && mode === "generated") {
      const scheduledTime = new Date(experience.scheduledAt).getTime();
      const now = Date.now();
      if (scheduledTime > now) {
        return;
      }
    }
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [experience.scheduledAt, mode]);

  const sceneFlow = getSceneFlow(template.id, experience);

  const handleComplete = useCallback(() => {
    setEnded(true);
    setShowReaction(true);
  }, []);

  const handleTrack = useCallback((action: string) => {
    void track(experience.id, "selected_mood_choice", template.id, action);
  }, [experience.id, template.id]);

  if (loading && mode === "generated") {
    return (
      <LoadingScreen
        name={experience.receiverName || experience.creatorName}
        message={experience.creatorName ? "Creating something for" : "Preparing"}
        duration={1500}
      />
    );
  }

  if (experience.scheduledAt && mode === "generated") {
    const scheduledTime = new Date(experience.scheduledAt).getTime();
    const now = Date.now();
    if (scheduledTime > now) {
      const diff = scheduledTime - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return (
        <div className="flex min-h-[60dvh] flex-col items-center justify-center text-center px-4">
          <div className="glass rounded-[2rem] p-8 sm:p-12 max-w-md">
            <p className="text-5xl mb-4">⏰</p>
            <h1 className="text-2xl font-bold text-white">This message is not ready yet</h1>
            <p className="mt-3 text-white/60">
              {experience.creatorName
                ? `${experience.creatorName} scheduled this message to open later.`
                : "This message has been scheduled for a future date."}
            </p>
            <div className="mt-6 rounded-xl bg-white/10 p-4">
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-fuchsia-300">
                {days > 0 ? `${days}d ${hours}h` : `${hours}h`}
              </p>
              <p className="text-xs text-white/40 mt-1">until it unlocks</p>
            </div>
          </div>
        </div>
      );
    }
  }

  if (!unlocked && experience.lockType) {
    return (
      <LockGate
        lockType={experience.lockType}
        lockValue={experience.lockValue}
        receiverName={experience.receiverName}
        creatorName={experience.creatorName}
        togetherSince={experience.togetherSince}
        onUnlock={() => setUnlocked(true)}
      />
    );
  }

  const content = sceneFlow ? (
    <SceneErrorBoundary>
      <FullscreenExperience templateId={template.id}>
        <SceneEngine flow={sceneFlow} context={buildSceneContext(experience, handleComplete, handleTrack)} theme={experience.theme} mode={mode} />
      </FullscreenExperience>
    </SceneErrorBoundary>
  ) : FLOWS[template.id] ? (
    <SceneErrorBoundary>
      {(template.id === "kitty-apology" || template.id === "escape-me") ? (
        FLOWS[template.id]({ template, experience, mode, shareUrl })
      ) : (
        <FullscreenExperience templateId={template.id} shareUrl={shareUrl}>
          {FLOWS[template.id]({ template, experience, mode, shareUrl })}
        </FullscreenExperience>
      )}
    </SceneErrorBoundary>
  ) : (
    <SceneErrorBoundary>
      <FullscreenExperience templateId={template.id} shareUrl={shareUrl}>
        <StaticFrequencyGame template={template} experience={experience} mode={mode} shareUrl={shareUrl} />
      </FullscreenExperience>
    </SceneErrorBoundary>
  );

  return (
    <>
      {content}
      {showReaction && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4">
          <ReactionCapture
            experienceId={experience.id}
            onReply={() => window.open(`/create?replyTo=${experience.id}`, "_blank")}
          />
        </div>
      )}
    </>
  );
}

async function track(experienceId: string, eventType: AnalyticsEventType, templateId: string, choice?: string) {
  if (!experienceId || experienceId === "demo" || experienceId === "preview") return;
  await fetch(`/api/experiences/${experienceId}/analytics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType, templateId, choice })
  }).catch(() => undefined);
}

"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { getSceneFlow, buildSceneContext } from "@/lib/scene-registry";
import { SceneErrorBoundary } from "@/components/SceneErrorBoundary";
import { FullscreenExperience } from "@/components/FullscreenExperience";
import { LockGate } from "@/components/LockGate";
import { ReactionCapture } from "@/components/ReactionCapture";
import { ReplyScreen } from "@/components/ReplyScreen";
import { VibeCapture } from "@/components/VibeCapture";
import { ChainMessageFlow } from "@/components/ChainMessageFlow";
import { TranslateBanner } from "@/components/TranslateBanner";
import { detectBrowserLanguage, translateText } from "@/lib/translator";
import type { AnalyticsEventType, ExperienceRecord, Template } from "@/lib/types";

function calcLateNight(): boolean {
  if (typeof window === "undefined") return false;
  const hour = new Date().getHours();
  return hour >= 23 || hour < 6;
}

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
const OurMemoriesPreview = dynamic(() => import("@/components/OurMemoriesPreview").then((m) => ({ default: m.OurMemoriesPreview })), { ssr: false });
const SorryMazePreview = dynamic(() => import("@/components/SorryMazePreview").then((m) => ({ default: m.SorryMazePreview })), { ssr: false });
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
  "our-memories": () => <OurMemoriesPreview />,
  "sorry-maze": () => <SorryMazePreview />,
};

export function ExperiencePlayer({ template, experience, mode, shareUrl, isPaused, onDemoClimax }: { template: Template; experience: ExperienceRecord; mode: Mode; shareUrl?: string; isPaused?: boolean; onDemoClimax?: () => void }) {
  const [unlocked, setUnlocked] = useState(!experience.lockType);
  const [chainComplete, setChainComplete] = useState(!experience.isChain || !!experience.chainCompleted);
  const [showReaction, setShowReaction] = useState(false);
  const [reactionSent, setReactionSent] = useState(false);
  const [ended, setEnded] = useState(false);
  const [isLateNight] = useState(calcLateNight);
  const stepTimers = useRef<Map<number, number>>(new Map());
  const stepRef = useRef(0);

  const [browserLang, setBrowserLang] = useState("");
  const [showTranslateBanner, setShowTranslateBanner] = useState(false);
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});
  const translateShown = useRef(false);

  useEffect(() => {
    const lang = detectBrowserLanguage();
    setBrowserLang(lang);
    if (lang !== "en" && !translateShown.current) {
      const cacheKey = `translation-${experience.id}-${lang}`;
      const cached = (() => { try { return localStorage.getItem(cacheKey); } catch { return null; } })();
      if (cached) {
        try { setTranslatedTexts(JSON.parse(cached)); } catch { /* ignore */ }
      } else {
        setShowTranslateBanner(true);
      }
    }
    translateShown.current = true;
  }, [experience.id]);

  useEffect(() => {
    if (mode === "generated") {
      void track(experience.id, "experience_opened", template.id);
      void track(experience.id, "template_used", template.id);
    }
  }, [experience.id, mode, template.id]);

  const translatedExperience = useMemo(() => {
    if (Object.keys(translatedTexts).length === 0) return experience;
    return {
      ...experience,
      finalMessage: translatedTexts.finalMessage || experience.finalMessage,
      customMessages: {
        ...experience.customMessages,
        steps: experience.customMessages?.steps?.map((s, i) => translatedTexts[`step-${i}`] || s) || experience.customMessages?.steps,
        landingText: translatedTexts.landingText || experience.customMessages?.landingText || "",
      },
    };
  }, [translatedTexts, experience]);

  const sceneFlow = getSceneFlow(template.id, translatedExperience);

  useEffect(() => {
    if (!sceneFlow || mode !== "generated") return;
    if (sceneFlow.scenes.length > 0 && stepRef.current < sceneFlow.scenes.length) {
      stepRef.current = 0;
      stepTimers.current.set(0, performance.now());
      void track(experience.id, "step_started", template.id, undefined, { step: 0 });
    }
  }, [sceneFlow, mode, template.id]);

  function handleStepProgress(step: number) {
    if (mode !== "generated") return;
    const prev = stepRef.current;
    const start = stepTimers.current.get(prev);
    if (start) {
      const duration = Math.round(performance.now() - start);
      void track(experience.id, "step_completed", template.id, undefined, { step: prev }, duration);
    }
    stepTimers.current.set(step, performance.now());
    stepRef.current = step;
    void track(experience.id, "step_started", template.id, undefined, { step });
  }

  function handleComplete() {
    if (mode === "generated") {
      const start = stepTimers.current.get(stepRef.current);
      if (start) {
        const duration = Math.round(performance.now() - start);
        void track(experience.id, "step_completed", template.id, undefined, { step: stepRef.current }, duration);
      }
      void track(experience.id, "experience_completed", template.id);
      if (experience.viewOnce) {
        fetch(`/api/experiences/${experience.id}/view-once`, { method: "POST" }).catch(() => {});
      }
    }
    setEnded(true);
    setShowReaction(true);
  }

  function handleTrack(action: string) {
    void track(experience.id, "selected_mood_choice", template.id, action);
    if (mode === "generated") {
      void track(experience.id, "game_interaction", template.id, undefined, { action });
    }
  }

  async function handleTranslate() {
    setShowTranslateBanner(false);
    const textsToTranslate: Record<string, string> = {};
    if (experience.finalMessage) textsToTranslate["finalMessage"] = await translateText(experience.finalMessage, browserLang);
    for (let i = 0; i < (experience.customMessages?.steps?.length || 0); i++) {
      textsToTranslate[`step-${i}`] = await translateText(experience.customMessages.steps[i], browserLang);
    }
    setTranslatedTexts(textsToTranslate);
    const cacheKey = `translation-${experience.id}-${browserLang}`;
    try { localStorage.setItem(cacheKey, JSON.stringify(textsToTranslate)); } catch { /* ignore */ }
  }

  if (experience.scheduledAt && mode === "generated") {
    const scheduledTime = new Date(experience.scheduledAt).getTime();
    const now = Date.now();
    if (scheduledTime > now) {
      const diff = scheduledTime - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const unlockDate = new Date(experience.scheduledAt);
      const formattedDate = !isNaN(unlockDate.getTime())
        ? `${unlockDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} at ${unlockDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
        : experience.scheduledAt;

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
            <p className="mt-2 text-sm text-white/40">Unlocks on {formattedDate}</p>
            <div className="mt-6 grid grid-cols-4 gap-3">
              {[
                { value: days, label: "Days" },
                { value: hours, label: "Hours" },
                { value: minutes, label: "Minutes" },
                { value: seconds, label: "Seconds" },
              ].map((unit) => (
                <motion.div
                  key={unit.label}
                  className="rounded-xl bg-white/10 p-3"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.p
                    className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-300 to-fuchsia-300"
                    key={unit.value}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {String(unit.value).padStart(2, "0")}
                  </motion.p>
                  <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">{unit.label}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-white/40 mt-4">until it unlocks</p>
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

  if (!chainComplete) {
    return (
      <ChainMessageFlow
        experience={experience}
        onComplete={() => setChainComplete(true)}
      />
    );
  }

  const content = sceneFlow ? (
    <SceneErrorBoundary>
      {mode === "demo" ? (
        <SceneEngine flow={sceneFlow} context={buildSceneContext(translatedExperience, handleComplete, handleTrack)} theme={translatedExperience.theme} mode={mode} isLateNight={isLateNight} />
      ) : (
        <FullscreenExperience templateId={template.id}>
          <SceneEngine flow={sceneFlow} context={buildSceneContext(translatedExperience, handleComplete, handleTrack)} theme={translatedExperience.theme} mode={mode} isLateNight={isLateNight} />
        </FullscreenExperience>
      )}
    </SceneErrorBoundary>
  ) : FLOWS[template.id] ? (
    <SceneErrorBoundary>
      {(template.fullscreen === false || mode === "demo") ? (
        FLOWS[template.id]({ template, experience: translatedExperience, mode, shareUrl })
      ) : (
        <FullscreenExperience templateId={template.id} shareUrl={shareUrl}>
          {FLOWS[template.id]({ template, experience: translatedExperience, mode, shareUrl })}
        </FullscreenExperience>
      )}
    </SceneErrorBoundary>
  ) : (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center text-center px-4">
      <div className="glass rounded-[2rem] p-8 sm:p-12 max-w-md">
        <p className="text-5xl mb-4">🔮</p>
        <h1 className="text-2xl font-bold text-white">This experience format is no longer supported</h1>
        <p className="mt-3 text-white/60">
          The template used to create this message has been removed or updated.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-2 px-4 pt-2">
        <TranslateBanner
          language={browserLang}
          onTranslate={handleTranslate}
          onDismiss={() => setShowTranslateBanner(false)}
        />
        {Object.keys(translatedTexts).length > 0 && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Translated
          </div>
        )}
      </div>
      {content}
      {showReaction && !reactionSent && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4">
          <ReactionCapture
            experienceId={experience.id}
            onSent={() => setReactionSent(true)}
            onReply={() => window.open(`/create?replyTo=${experience.id}`, "_blank")}
          />
        </div>
      )}
      {showReaction && reactionSent && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4">
          <VibeCapture experienceId={experience.id} />
        </div>
      )}
    </>
  );
}

async function track(experienceId: string, eventType: AnalyticsEventType, templateId: string, choice?: string, metadata?: Record<string, unknown>, durationMs?: number) {
  if (!experienceId || experienceId === "demo" || experienceId === "preview") return;
  await fetch(`/api/experiences/${experienceId}/analytics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType, templateId, choice, metadata, durationMs })
  }).catch(() => undefined);
}

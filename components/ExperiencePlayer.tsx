"use client";

import { useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { getSceneFlow, buildSceneContext } from "@/lib/scene-registry";
import { SceneErrorBoundary } from "@/components/SceneErrorBoundary";
import type { AnalyticsEventType, ExperienceRecord, Template } from "@/lib/types";

const SceneEngine = dynamic(() => import("@/components/SceneEngine").then((m) => ({ default: m.SceneEngine })), { ssr: false });
const RiskButton = dynamic(() => import("@/components/ExperienceFlows").then((m) => ({ default: m.RiskButton })), { ssr: false });
const GlitchTruth = dynamic(() => import("@/components/ExperienceFlows").then((m) => ({ default: m.GlitchTruth })), { ssr: false });
const ChooseMyApology = dynamic(() => import("@/components/ExperienceFlows").then((m) => ({ default: m.ChooseMyApology })), { ssr: false });
const MoodRepairMachine = dynamic(() => import("@/components/ExperienceFlows").then((m) => ({ default: m.MoodRepairMachine })), { ssr: false });
const SecretRoom = dynamic(() => import("@/components/ExperienceFlows").then((m) => ({ default: m.SecretRoom })), { ssr: false });
const MemoryMaze = dynamic(() => import("@/components/ExperienceFlows").then((m) => ({ default: m.MemoryMaze })), { ssr: false });
const LastDeletedMessage = dynamic(() => import("@/components/ExperienceFlows").then((m) => ({ default: m.LastDeletedMessage })), { ssr: false });
const TypeOrElse = dynamic(() => import("@/components/experience/TypeOrElse").then((m) => ({ default: m.TypeOrElse })), { ssr: false });
const TrustScale = dynamic(() => import("@/components/experience/TrustScale").then((m) => ({ default: m.TrustScale })), { ssr: false });
const Inkblot = dynamic(() => import("@/components/experience/Inkblot").then((m) => ({ default: m.Inkblot })), { ssr: false });
const TwoLiesOneTruth = dynamic(() => import("@/components/experience/TwoLiesOneTruth").then((m) => ({ default: m.TwoLiesOneTruth })), { ssr: false });
const CloserYouGet = dynamic(() => import("@/components/experience/CloserYouGet").then((m) => ({ default: m.CloserYouGet })), { ssr: false });
const SpinToReveal = dynamic(() => import("@/components/experience/SpinToReveal").then((m) => ({ default: m.SpinToReveal })), { ssr: false });
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

type Mode = "demo" | "generated" | "preview";

const FLOWS: Record<string, (props: { template: Template; experience: ExperienceRecord; mode: Mode; shareUrl?: string }) => React.ReactNode> = {
  "the-risk-button": (props) => <RiskButton {...props} />,
  "glitch-truth": (props) => <GlitchTruth {...props} />,
  "choose-my-punishment": (props) => <ChooseMyApology {...props} />,
  "mood-repair-machine": (props) => <MoodRepairMachine {...props} />,
  "the-secret-room": (props) => <SecretRoom {...props} />,
  "memory-maze": (props) => <MemoryMaze {...props} />,
  "type-or-else": (props) => <TypeOrElse {...props} />,
  "the-trust-scale": (props) => <TrustScale {...props} />,
  "inkblot": (props) => <Inkblot {...props} />,
  "two-lies-one-truth": (props) => <TwoLiesOneTruth {...props} />,
  "the-closer-you-get": (props) => <CloserYouGet {...props} />,
  "spin-to-reveal": (props) => <SpinToReveal {...props} />,
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
  "funny-slots": (props) => <GameAdapter {...props} />,
  "secret-decoder": (props) => <GameAdapter {...props} />,
  "birthday-cake": (props) => <GameAdapter {...props} />,
  "roast-wheel": (props) => <GameAdapter {...props} />,
  "memory-flip": (props) => <GameAdapter {...props} />,
  "mystery-fog": (props) => <GameAdapter {...props} />,
};

export function ExperiencePlayer({ template, experience, mode, shareUrl }: { template: Template; experience: ExperienceRecord; mode: Mode; shareUrl?: string }) {
  useEffect(() => {
    if (mode === "generated") {
      void track(experience.id, "experience_opened", template.id);
      void track(experience.id, "template_used", template.id);
    }
  }, [experience.id, mode, template.id]);

  const sceneFlow = getSceneFlow(template.id, experience);

  const handleComplete = useCallback(() => {
    /* scene handles its own completion UI */
  }, []);

  const handleTrack = useCallback((action: string) => {
    void track(experience.id, "selected_mood_choice", template.id, action);
  }, [experience.id, template.id]);

  if (sceneFlow) {
    const context = buildSceneContext(experience, handleComplete, handleTrack);
    return (
      <SceneErrorBoundary>
        <SceneEngine
          flow={sceneFlow}
          context={context}
          theme={experience.theme}
          mode={mode}
        />
      </SceneErrorBoundary>
    );
  }

  const FlowComponent = FLOWS[template.id];
  if (FlowComponent) {
    return (
      <SceneErrorBoundary>
        {FlowComponent({ template, experience, mode, shareUrl })}
      </SceneErrorBoundary>
    );
  }

  return (
    <SceneErrorBoundary>
      <LastDeletedMessage template={template} experience={experience} mode={mode} shareUrl={shareUrl} />
    </SceneErrorBoundary>
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

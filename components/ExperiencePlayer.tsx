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
  "spin-to-reveal": (props) => <SpinToReveal {...props} />
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

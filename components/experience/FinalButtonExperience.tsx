"use client";

import { useState, useCallback } from "react";
import { FinalScreen } from "@/components/FinalScreen";
import { Watermark } from "@/components/Watermark";
import { TypewriterText } from "@/components/TypewriterText";
import { StepTransition } from "@/components/StepTransition";
import { ProgressBar } from "@/components/ProgressBar";
import { ChoiceBadge } from "@/components/ChoiceBadge";
import { AutoMovingSlider } from "@/components/experience/AutoMovingSlider";
import { BreathingScreen } from "@/components/experience/BreathingScreen";
import { CatchObjectExperience } from "@/components/experience/CatchObjectExperience";
import { MovingButton } from "@/components/experience/MovingButton";
import { SuspenseReveal } from "@/components/experience/SuspenseReveal";
import { ExperienceLayout } from "@/components/ExperienceLayout";
import { playSound, playToneSound } from "@/lib/flowSounds";
import { useAutoAdvance } from "@/lib/useAutoAdvance";
import { useEasterEgg } from "@/lib/useEasterEgg";
import type { AnalyticsEventType, ExperienceRecord, Template } from "@/lib/types";

type Screen = "landing" | "pressed" | "mood" | "angry" | "angryReveal" | "happy" | "happySuccess" | "sad" | "sadReveal" | "missing" | "missingReveal" | "unknown" | "final";

async function track(experienceId: string, eventType: AnalyticsEventType, templateId: string, choice?: string) {
  if (!experienceId || experienceId === "demo" || experienceId === "preview") return;
  await fetch(`/api/experiences/${experienceId}/analytics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType, templateId, choice })
  }).catch(() => undefined);
}

function PlayerCard({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl rounded-[1.6rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">{children}</div>;
}

function EggBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-neon/30 bg-black/80 px-6 py-3 text-sm font-bold text-neon shadow-lg backdrop-blur-xl animate-[section-in_400ms_cubic-bezier(.22,1,.36,1)_both]">
      {message}
    </div>
  );
}

const STATIC_PROGRESS: Record<string, number> = {
  landing: 0, pressed: 1, mood: 2,
  angry: 3, angryReveal: 4,
  happy: 3, happySuccess: 4,
  sad: 3, sadReveal: 4,
  missing: 3, missingReveal: 4,
  unknown: 3,
  final: 5
};

export function FinalButtonExperience({ template, experience, mode, shareUrl }: { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string }) {
  const [screen, setScreen] = useState<Screen>("landing");
  const [missingResult, setMissingResult] = useState(54);
  const messages = experience.customMessages;
  const steps = messages.steps.length ? messages.steps : ["I made this because a normal text felt too easy to ignore.", "I did not want this to feel ordinary.", "So here is the truth." ];

  const totalSteps = 5;
  const tone = experience.tone;

  function chooseMood(mood: string, next: Screen) {
    playToneSound("tap", tone);
    void track(experience.id, "selected_mood_choice", template.id, mood);
    setScreen(next);
  }

  function advance(s: Screen) {
    playToneSound("whoosh", tone);
    setScreen(s);
  }

  function complete() {
    playToneSound("ding", tone);
    void track(experience.id, "experience_completed", template.id);
    setScreen("final");
  }

  const final = (
    <FinalScreen
      ctaMessage={messages.ctaMessage}
      experienceId={mode === "generated" ? experience.id : undefined}
      finalMessage={experience.finalMessage}
      onCtaClick={() => void track(experience.id, "final_cta_clicked", template.id)}
      shareUrl={shareUrl}
      templateId={template.id}
      templateTitle={template.title}
    />
  );

  const { message: eggMessage } = useEasterEgg(template.id);
  useAutoAdvance({ active: mode === "demo" && screen === "landing", onAdvance: useCallback(() => advance("pressed"), []) });

  return (
    <ExperienceLayout kicker={mode === "demo" ? "Demo experience" : "Playable message"} theme={experience.theme} title={template.title} titleAs={mode === "generated" ? "h1" : "h2"}>
      {screen === "landing" ? (
        <StepTransition step={0}>
          <PlayerCard>
            <ProgressBar current={1} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Start here</p>
            <h2 className="display-title mt-4 text-4xl font-bold leading-tight sm:text-6xl">{messages.landingText}</h2>
            <button className="premium-button mt-8" type="button" onClick={() => { playToneSound("tap", tone); setScreen("pressed"); }}>{messages.buttonText}</button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "pressed" ? (
        <StepTransition step={1}>
          <PlayerCard>
            <ProgressBar current={2} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">A tiny next step</p>
            <h2 className="display-title mt-4 text-4xl font-bold leading-tight sm:text-6xl">You started it. Let&apos;s make it worth the tap.</h2>
            <p className="mt-5 text-white/70">A few small choices will lead to the real message.</p>
            <button className="premium-button mt-8" type="button" onClick={() => advance("mood")}>Continue</button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "mood" ? (
        <StepTransition step={2}>
          <PlayerCard>
            <ProgressBar current={3} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Choose your mood</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Pick the option that feels closest right now.</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button className="ghost-button" type="button" onClick={() => chooseMood("Upset", "angry")}>Upset</button>
              <button className="ghost-button" type="button" onClick={() => chooseMood("Happy", "happy")}>Happy</button>
              <button className="ghost-button" type="button" onClick={() => chooseMood("A little sad", "sad")}>A little sad</button>
              <button className="ghost-button" type="button" onClick={() => chooseMood("Missing someone", "missing")}>Missing someone</button>
              <button className="ghost-button sm:col-span-2" type="button" onClick={() => chooseMood("Not sure yet", "unknown")}>Not sure yet</button>
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "angry" ? (
        <StepTransition step={3}>
          <PlayerCard>
            <ChoiceBadge label="You said: Upset" />
            <ProgressBar current={4} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">If you&apos;re upset, that&apos;s okay.</h2>
            <MovingButton label="A little forgiveness" onComplete={() => { playToneSound("whoosh", tone); setScreen("angryReveal"); }} />
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "angryReveal" ? (
        <StepTransition step={4}>
          <PlayerCard>
            <ProgressBar current={5} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Thanks for staying with it.</h2>
            <p className="mt-5 text-white/75"><TypewriterText text={steps[0]} /></p>
            <p className="mt-3 text-white/70"><TypewriterText text={steps[1]} /></p>
            <button className="premium-button mt-8" type="button" onClick={complete}>Okay, continue.</button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "happy" ? (
        <StepTransition step={3}>
          <PlayerCard>
            <ChoiceBadge label="You said: Happy" />
            <ProgressBar current={4} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Then here&apos;s a small playful mission.</h2>
            <CatchObjectExperience lines={steps} onComplete={() => { playToneSound("ding", tone); setScreen("happySuccess"); }} />
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "happySuccess" ? (
        <StepTransition step={4}>
          <PlayerCard>
            <ProgressBar current={5} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">You caught all three.</h2>
            <p className="mt-5 text-white/75">That means the reveal is ready.</p>
            <button className="premium-button mt-8" type="button" onClick={complete}>Open the reveal</button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "sad" ? (
        <StepTransition step={3}>
          <PlayerCard>
            <ChoiceBadge label="You said: A little sad" />
            <ProgressBar current={4} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Let&apos;s pause for a soft moment.</h2>
            <BreathingScreen onComplete={() => { playToneSound("whoosh", tone); setScreen("sadReveal"); }} />
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "sadReveal" ? (
        <StepTransition step={4}>
          <PlayerCard>
            <ChoiceBadge label="You said: A little sad" />
            <ProgressBar current={5} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">You stayed. That counts.</h2>
            <p className="mt-5 text-white/75"><TypewriterText text={steps[1] || steps[0]} /></p>
            <button className="premium-button mt-8" type="button" onClick={complete}>Continue softly</button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "missing" ? (
        <StepTransition step={3}>
          <PlayerCard>
            <ChoiceBadge label="You said: Missing someone" />
            <ProgressBar current={4} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">How much are you missing this person?</h2>
            <AutoMovingSlider onLock={(value) => { playToneSound("ding", tone); setMissingResult(value); setScreen("missingReveal"); }} />
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "missingReveal" ? (
        <StepTransition step={4}>
          <PlayerCard>
            <ChoiceBadge label="You said: Missing someone" />
            <ProgressBar current={5} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-4xl font-bold leading-tight sm:text-5xl">{missingResult <= 30 ? "Taking it slow?" : missingResult <= 70 ? "That feels real." : "That's a lot of heart."}</h2>
            <p className="mt-5 text-white/75"><TypewriterText text={steps[2] || steps[0]} /></p>
            <button className="premium-button mt-8" type="button" onClick={complete}>Reveal final message</button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "unknown" ? (
        <StepTransition step={3}>
          <PlayerCard>
            <ChoiceBadge label="You said: Not sure yet" />
            <SuspenseReveal
              steps={[
                { button: "Find out", text: "Not knowing is also an answer sometimes." },
                { button: "Keep going", text: steps[0] },
                { button: "Almost there", text: steps[1] || steps[0] },
                { button: "Reveal it", text: steps[2] || experience.finalMessage }
              ]}
              onComplete={complete}
            />
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "final" ? final : null}
      <EggBanner message={eggMessage} />
      <Watermark />
    </ExperienceLayout>
  );
}

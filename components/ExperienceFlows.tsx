"use client";

import { useState, useCallback } from "react";
import { FinalScreen } from "@/components/FinalScreen";
import { Watermark } from "@/components/Watermark";
import { TypewriterText } from "@/components/TypewriterText";
import { StepTransition } from "@/components/StepTransition";
import { ProgressBar } from "@/components/ProgressBar";
import { ChoiceBadge } from "@/components/ChoiceBadge";
import { BackButton } from "@/components/BackButton";
import { AutoMovingSlider } from "@/components/experience/AutoMovingSlider";
import { BreathingScreen } from "@/components/experience/BreathingScreen";
import { CatchObjectExperience } from "@/components/experience/CatchObjectExperience";
import { FakeChatScreen } from "@/components/experience/FakeChatScreen";
import { GlitchText } from "@/components/experience/GlitchText";
import { MemoryDoor } from "@/components/experience/MemoryDoor";
import { MoodScanner } from "@/components/experience/MoodScanner";
import { MovingButton } from "@/components/experience/MovingButton";
import { PasswordRoom } from "@/components/experience/PasswordRoom";
import { SuspenseReveal } from "@/components/experience/SuspenseReveal";
import { ExperienceLayout } from "@/components/ExperienceLayout";
import { playSound } from "@/lib/flowSounds";
import { useAutoAdvance } from "@/lib/useAutoAdvance";
import { useEasterEgg } from "@/lib/useEasterEgg";
import type { AnalyticsEventType, ExperienceRecord, Template } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

function PlayerCard({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl rounded-[1.6rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">{children}</div>;
}

async function track(experienceId: string, eventType: AnalyticsEventType, templateId: string, choice?: string) {
  if (!experienceId || experienceId === "demo" || experienceId === "preview") return;
  await fetch(`/api/experiences/${experienceId}/analytics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType, templateId, choice })
  }).catch(() => undefined);
}

function Final({ experience, mode, shareUrl, template }: Props) {
  return (
    <FinalScreen
      ctaMessage={experience.customMessages.ctaMessage}
      experienceId={mode === "generated" ? experience.id : undefined}
      finalMessage={experience.finalMessage}
      onCtaClick={() => track(experience.id, "final_cta_clicked", template.id)}
      shareUrl={shareUrl}
      templateId={template.id}
      templateTitle={template.title}
    />
  );
}

function EggBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-neon/30 bg-black/80 px-6 py-3 text-sm font-bold text-neon shadow-lg backdrop-blur-xl animate-[section-in_400ms_cubic-bezier(.22,1,.36,1)_both]">
      {message}
    </div>
  );
}

export function LastDeletedMessage({ template, experience, mode, shareUrl }: Props) {
  const [step, setStep] = useState(0);
  const messages = experience.customMessages.steps;
  const [one = "I typed something for you... then deleted it.", two = "I kept rewriting because I wanted it to be perfect.", three = "The truth I wanted to say never changed."] = messages;
  const steps = [
    { title: "I typed something for you... then deleted it.", body: "Four versions of the same message. Only the last one was honest.", actions: ["Show funny", "Show safe", "Show risky", "Show deleted"], chat: ["I started with a joke.", "I tried being normal.", "I almost sent this.", "DELETED: The real one"] },
    { title: "Funny version", body: one, actions: ["Show safe"], chat: [one] },
    { title: "Safe version", body: two, actions: ["Show risky"], chat: [two] },
    { title: "The risky version", body: three, actions: ["Show deleted"], chat: [three] },
    { title: "The deleted message", body: "I didn't delete it because it was wrong. I deleted it because I was scared.", actions: ["Open final reveal"], chat: ["Deleted message restored...", experience.finalMessage] }
  ];

  const totalSteps = steps.length + 1;

  function next(choice: string) {
    playSound("click");
    track(experience.id, "selected_mood_choice", template.id, choice);
    setStep((s) => Math.min(s + 1, steps.length));
  }

  const completed = step >= steps.length;
  const current = steps[Math.min(step, steps.length - 1)];

  useAutoAdvance({ active: mode === "demo" && !completed, onAdvance: useCallback(() => { if (!completed) { playSound("whoosh"); setStep((s) => Math.min(s + 1, steps.length)); } }, [completed]) });
  const { message: eggMessage } = useEasterEgg(template.id);

  return (
    <ExperienceLayout kicker="Playable message" theme={experience.theme} title={template.title} titleAs={mode === "generated" ? "h1" : "h2"}>
      {completed ? <Final experience={experience} mode={mode} shareUrl={shareUrl} template={template} /> : (
        <StepTransition step={step}>
          <PlayerCard>
            <BackButton onBack={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || mode === "demo"} />
            <ProgressBar current={step + 1} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">{current.title}</h2>
            <FakeChatScreen lines={current.chat} />
            <p className="mt-5 text-white/75"><TypewriterText text={current.body} /></p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {current.actions.map((action) => <button className="ghost-button" key={action} type="button" onClick={() => next(action)}>{action}</button>)}
            </div>
          </PlayerCard>
        </StepTransition>
      )}
      <EggBanner message={eggMessage} />
      <Watermark />
    </ExperienceLayout>
  );
}

export function RiskButton({ template, experience, mode, shareUrl }: Props) {
  const [step, setStep] = useState(0);
  const [confidence, setConfidence] = useState<"low" | "medium" | "high" | "reveal" | null>(null);
  const messages = experience.customMessages.steps;
  const [one = "Every risk reveals something true.", two = "The boldest choice leads to the real message.", three = "Here it is."] = messages;

  const totalSteps = 4;

  function pick(level: "low" | "medium" | "high" | "reveal") {
    playSound("click");
    track(experience.id, "selected_mood_choice", template.id, level);
    setConfidence(level);
    setStep(1);
  }

  function advance() {
    playSound("whoosh");
    setStep((s) => Math.min(s + 1, 4));
  }

  const final = <Final experience={experience} mode={mode} shareUrl={shareUrl} template={template} />;
  const { message: eggMessage } = useEasterEgg(template.id);

  useAutoAdvance({ active: mode === "demo" && step === 0, onAdvance: useCallback(() => pick("medium"), []) });

  return (
    <ExperienceLayout kicker="Playable message" theme={experience.theme} title={template.title} titleAs={mode === "generated" ? "h1" : "h2"}>
      {step === 0 ? (
        <StepTransition step={step}>
          <PlayerCard>
            <ProgressBar current={1} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">How bold do you want to be?</h2>
            <p className="mt-5 text-white/75"><TypewriterText text={one} /></p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button className="ghost-button" type="button" onClick={() => pick("low")}>Low key</button>
              <button className="ghost-button" type="button" onClick={() => pick("medium")}>Medium</button>
              <button className="ghost-button" type="button" onClick={() => pick("high")}>Bold</button>
              <button className="ghost-button" type="button" onClick={() => pick("reveal")}>Skip to reveal</button>
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {step === 1 && confidence === "high" ? (
        <StepTransition step={step}>
          <PlayerCard>
            <BackButton onBack={() => setStep(0)} disabled={mode === "demo"} />
            <ChoiceBadge label="You chose: Bold" />
            <ProgressBar current={2} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">You chose bold. That takes trust.</h2>
            <MovingButton label="Open the truth" onComplete={() => { playSound("ding"); setStep(3); }} />
          </PlayerCard>
        </StepTransition>
      ) : null}
      {step === 1 && confidence === "medium" ? (
        <StepTransition step={step}>
          <PlayerCard>
            <BackButton onBack={() => setStep(0)} disabled={mode === "demo"} />
            <ChoiceBadge label="You chose: Medium" />
            <ProgressBar current={2} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Medium risk. You're careful. I respect that.</h2>
            <p className="mt-5 text-white/75"><TypewriterText text={two} /></p>
            <button className="premium-button mt-8" type="button" onClick={() => advance()}>Go bolder</button>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {step === 1 && confidence === "low" ? (
        <StepTransition step={step}>
          <PlayerCard>
            <BackButton onBack={() => setStep(0)} disabled={mode === "demo"} />
            <ChoiceBadge label="You chose: Low key" />
            <ProgressBar current={2} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Playing it safe. That's okay.</h2>
            <SuspenseReveal steps={[
              { button: "Take a peek", text: one },
              { button: "One more step", text: two },
              { button: "Final reveal", text: three }
            ]} onComplete={() => { playSound("ding"); setStep(3); }} />
          </PlayerCard>
        </StepTransition>
      ) : null}
      {step === 1 && confidence === "reveal" ? (
        <StepTransition step={step}>
          <PlayerCard>
            <BackButton onBack={() => setStep(0)} disabled={mode === "demo"} />
            <ChoiceBadge label="You chose: Skip to reveal" />
            <ProgressBar current={2} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Straight to the truth.</h2>
            <p className="mt-5 text-white/75"><TypewriterText text={three} /></p>
            <button className="premium-button mt-8" type="button" onClick={() => { playSound("ding"); setStep(3); }}>Reveal</button>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {step === 2 ? (
        <StepTransition step={step}>
          <PlayerCard>
            <BackButton onBack={() => setStep(1)} disabled={mode === "demo"} />
            <ChoiceBadge label="You chose: Go bolder" />
            <ProgressBar current={3} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Bolder. Almost there.</h2>
            <p className="mt-5 text-white/75"><TypewriterText text={three} /></p>
            <MovingButton label="Unlock the truth" onComplete={() => { playSound("ding"); setStep(3); }} />
          </PlayerCard>
        </StepTransition>
      ) : null}
      {step >= 3 && step < 4 ? final : null}
      {step >= 4 ? final : null}
      <EggBanner message={eggMessage} />
      <Watermark />
    </ExperienceLayout>
  );
}

export function GlitchTruth({ template, experience, mode, shareUrl }: Props) {
  const [step, setStep] = useState(0);
  const messages = experience.customMessages.steps;
  const [one = "I've been meaning to say this for a while.", two = "But every time I try, it comes out wrong.", three = "So here's the truth, plain and simple."] = messages;

  const totalSteps = 5;

  function next(choice: string) {
    playSound(choice === "fix" || choice === "fix again" || choice === "recover" ? "glitch" : "click");
    track(experience.id, "selected_mood_choice", template.id, choice);
    setStep((s) => s + 1);
  }

  const final = <Final experience={experience} mode={mode} shareUrl={shareUrl} template={template} />;
  const { message: eggMessage } = useEasterEgg(template.id);

  useAutoAdvance({ active: mode === "demo" && step < 3, onAdvance: useCallback(() => { if (step < 3) { playSound("glitch"); setStep((s) => s + 1); } }, [step]) });

  return (
    <ExperienceLayout kicker="Playable message" theme={experience.theme} title={template.title} titleAs={mode === "generated" ? "h1" : "h2"}>
      {step === 0 ? (
        <StepTransition step={step}>
          <PlayerCard>
            <ProgressBar current={1} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">This is just a normal page.</h2>
            <p className="mt-5 text-white/75">Nothing unusual here. Just a regular page with regular text.</p>
            <GlitchText normal="Everything is fine." truth="Lie detected." />
            <button className="premium-button mt-8" type="button" onClick={() => next("fix")}>Fix page</button>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {step === 1 ? (
        <StepTransition step={step}>
          <PlayerCard>
            <BackButton onBack={() => setStep(0)} disabled={mode === "demo"} />
            <ProgressBar current={2} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Lie detected.</h2>
            <p className="mt-5 text-white/75"><TypewriterText text={one} /></p>
            <GlitchText normal={one} truth={two} />
            <button className="premium-button mt-8" type="button" onClick={() => next("fix again")}>Fix again</button>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {step === 2 ? (
        <StepTransition step={step}>
          <PlayerCard>
            <BackButton onBack={() => setStep(1)} disabled={mode === "demo"} />
            <ProgressBar current={3} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Almost recovered.</h2>
            <p className="mt-5 text-white/75"><TypewriterText text={two} /></p>
            <GlitchText normal={two} truth={three} />
            <button className="premium-button mt-8" type="button" onClick={() => next("recover")}>Recover truth</button>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {step === 3 ? (
        <StepTransition step={step}>
          <PlayerCard>
            <BackButton onBack={() => setStep(2)} disabled={mode === "demo"} />
            <ProgressBar current={4} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">System fixed. Truth recovered.</h2>
            <GlitchText normal="All systems normal." truth={experience.finalMessage} />
            <button className="premium-button mt-8" type="button" onClick={() => { playSound("ding"); track(experience.id, "experience_completed", template.id); setStep(4); }}>Read final message</button>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {step >= 4 ? final : null}
      <EggBanner message={eggMessage} />
      <Watermark />
    </ExperienceLayout>
  );
}

export function DontSmileChallenge({ template, experience, mode, shareUrl }: Props) {
  const [step, setStep] = useState(0);
  const messages = experience.customMessages.steps;
  const [one = "Your challenge is simple. Don't smile.", two = "Still holding strong? I have more material.", three = "You smiled. I win. Now read the message."] = messages;

  const totalSteps = 4;

  function next(choice: string) {
    playSound("click");
    track(experience.id, "selected_mood_choice", template.id, choice);
    setStep((s) => s + 1);
  }

  const final = <Final experience={experience} mode={mode} shareUrl={shareUrl} template={template} />;
  const { message: eggMessage } = useEasterEgg(template.id);

  useAutoAdvance({ active: mode === "demo" && step < 2, onAdvance: useCallback(() => { if (step < 2) { playSound("whoosh"); setStep((s) => s + 1); } }, [step]) });

  return (
    <ExperienceLayout kicker="Playable message" theme={experience.theme} title={template.title} titleAs={mode === "generated" ? "h1" : "h2"}>
      {step === 0 ? (
        <StepTransition step={step}>
          <PlayerCard>
            <ProgressBar current={1} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Don't Smile Challenge</h2>
            <p className="mt-5 text-white/75"><TypewriterText text={one} /></p>
            <div className="my-6 flex justify-center gap-3 text-5xl"><span>:|</span><span>😐</span><span>😶</span></div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button className="ghost-button" type="button" onClick={() => next("i smiled")}>I smiled</button>
              <button className="ghost-button" type="button" onClick={() => next("still not smiling")}>Still not smiling</button>
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {step === 1 ? (
        <StepTransition step={step}>
          <PlayerCard>
            <BackButton onBack={() => setStep(0)} disabled={mode === "demo"} />
            <ProgressBar current={2} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Okay, tough person.</h2>
            <CatchObjectExperience lines={[two]} onComplete={() => { playSound("ding"); setStep(2); }} />
          </PlayerCard>
        </StepTransition>
      ) : null}
      {step === 2 ? (
        <StepTransition step={step}>
          <PlayerCard>
            <BackButton onBack={() => setStep(1)} disabled={mode === "demo"} />
            <ProgressBar current={3} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">You made it.</h2>
            <p className="mt-5 text-white/75"><TypewriterText text={three} /></p>
            <button className="premium-button mt-8" type="button" onClick={() => { playSound("ding"); track(experience.id, "experience_completed", template.id); setStep(3); }}>Read the message</button>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {step >= 3 ? final : null}
      <EggBanner message={eggMessage} />
      <Watermark />
    </ExperienceLayout>
  );
}

export function ChooseMyApology({ template, experience, mode, shareUrl }: Props) {
  const [screen, setScreen] = useState<"landing" | "chosen" | "unlock" | "final">("landing");
  const [choice, setChoice] = useState("");
  const messages = experience.customMessages.steps;
  const [one = "Pick how I make it up to you.", two = "Okay, you chose. Now I get to say the real part.", three = "I'm sorry. Truly."] = messages;

  const totalSteps = 4;
  const stepIndex = screen === "landing" ? 0 : screen === "chosen" ? 1 : screen === "unlock" ? 2 : 3;

  function pick(value: string) {
    playSound("click");
    track(experience.id, "selected_mood_choice", template.id, value);
    setChoice(value);
    setScreen("chosen");
  }

  const final = <Final experience={experience} mode={mode} shareUrl={shareUrl} template={template} />;
  const { message: eggMessage } = useEasterEgg(template.id);

  useAutoAdvance({ active: mode === "demo" && screen === "landing", onAdvance: useCallback(() => pick("Say sorry properly"), []) });

  return (
    <ExperienceLayout kicker="Playable message" theme={experience.theme} title={template.title} titleAs={mode === "generated" ? "h1" : "h2"}>
      {screen === "landing" ? (
        <StepTransition step={0}>
          <PlayerCard>
            <ProgressBar current={1} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">{one}</h2>
            <p className="mt-5 text-white/75">Choose how I should make this right.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button className="ghost-button" type="button" onClick={() => pick("Say sorry properly")}>Say sorry properly</button>
              <button className="ghost-button" type="button" onClick={() => pick("Compliment you")}>Compliment you 10 times</button>
              <button className="ghost-button" type="button" onClick={() => pick("Give space")}>Give you space</button>
              <button className="ghost-button" type="button" onClick={() => pick("Try again")}>Try again gently</button>
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "chosen" ? (
        <StepTransition step={1}>
          <PlayerCard>
            <ChoiceBadge label={`You chose: ${choice}`} />
            <ProgressBar current={2} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Repair mode: {choice}</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Good choice.</h2>
            <p className="mt-5 text-white/75"><TypewriterText text={two} /></p>
            <MovingButton label="Unlock my real apology" onComplete={() => { playSound("ding"); setScreen("unlock"); }} />
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "unlock" ? (
        <StepTransition step={2}>
          <PlayerCard>
            <ChoiceBadge label={`You chose: ${choice}`} />
            <ProgressBar current={3} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Jokes aside.</h2>
            <p className="mt-5 text-white/75"><TypewriterText text={three} /></p>
            <p className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-5 text-lg font-extrabold"><TypewriterText text={experience.finalMessage} /></p>
            <button className="premium-button mt-8" type="button" onClick={() => { playSound("ding"); track(experience.id, "experience_completed", template.id); setScreen("final"); }}>Continue</button>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "final" ? final : null}
      <EggBanner message={eggMessage} />
      <Watermark />
    </ExperienceLayout>
  );
}

export function MoodRepairMachine({ template, experience, mode, shareUrl }: Props) {
  const [screen, setScreen] = useState<"landing" | "scan" | "result" | "breath" | "final">("landing");
  const [mood, setMood] = useState("");
  const messages = experience.customMessages.steps;
  const [one = "Machine started. Select the mood that needs repairing.", two = "Scan complete. Human attention required.", three = "The best repair is a real message."] = messages;

  const totalSteps = 4;
  const stepIndex = screen === "landing" ? 0 : screen === "scan" ? 1 : screen === "result" ? 2 : screen === "breath" ? 3 : 4;

  function startScan(selected: string) {
    playSound("click");
    track(experience.id, "selected_mood_choice", template.id, selected);
    setMood(selected);
    setScreen("scan");
    setTimeout(() => { playSound("ding"); setScreen("result"); }, 2500);
  }

  const final = <Final experience={experience} mode={mode} shareUrl={shareUrl} template={template} />;
  const { message: eggMessage } = useEasterEgg(template.id);

  useAutoAdvance({ active: mode === "demo" && screen === "landing", onAdvance: useCallback(() => startScan("Tired"), []) });

  return (
    <ExperienceLayout kicker="Playable message" theme={experience.theme} title={template.title} titleAs={mode === "generated" ? "h1" : "h2"}>
      {screen === "landing" ? (
        <StepTransition step={0}>
          <PlayerCard>
            <ProgressBar current={1} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Mood repair machine started.</h2>
            <p className="mt-5 text-white/75"><TypewriterText text={one} /></p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {["Angry", "Sad", "Bored", "Overthinking", "Tired"].map((m) => <button className="ghost-button" key={m} type="button" onClick={() => startScan(m)}>{m}</button>)}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "scan" ? (
        <StepTransition step={1}>
          <PlayerCard>
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Scanning {mood}...</h2>
            <MoodScanner />
            <p className="mt-5 text-white/70">Analyzing emotional patterns...</p>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "result" ? (
        <StepTransition step={2}>
          <PlayerCard>
            <ProgressBar current={3} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Diagnosis complete</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Machine diagnosis complete.</h2>
            <p className="mt-5 text-white/75"><TypewriterText text={two} /></p>
            <p className="mt-4 text-white/70">{messages[1] || "Detected: needs a real message from someone who cares."}</p>
            <button className="premium-button mt-8" type="button" onClick={() => { playSound("whoosh"); setScreen("breath"); }}>Apply human attention</button>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "breath" ? (
        <StepTransition step={3}>
          <PlayerCard>
            <ProgressBar current={4} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Applying human attention.</h2>
            <p className="mt-5 text-white/75"><TypewriterText text={three} /></p>
            <BreathingScreen onComplete={() => { playSound("ding"); track(experience.id, "experience_completed", template.id); setScreen("final"); }} />
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "final" ? final : null}
      <EggBanner message={eggMessage} />
      <Watermark />
    </ExperienceLayout>
  );
}

export function SecretRoom({ template, experience, mode, shareUrl }: Props) {
  const [screen, setScreen] = useState<"landing" | "room" | "final">("landing");
  const messages = experience.customMessages.steps;
  const [one = "A secret room. But the password is something honest.", two = "Box 1: What I noticed about you.", three = "Box 3: What I want you to know."] = messages;

  const totalSteps = 3;
  const stepIndex = screen === "landing" ? 0 : screen === "room" ? 1 : 2;

  function enterRoom() {
    playSound("whoosh");
    track(experience.id, "selected_mood_choice", template.id, "enter");
    setScreen("room");
  }

  const final = <Final experience={experience} mode={mode} shareUrl={shareUrl} template={template} />;
  const { message: eggMessage } = useEasterEgg(template.id);

  useAutoAdvance({ active: mode === "demo" && screen === "landing", onAdvance: useCallback(() => enterRoom(), []) });

  return (
    <ExperienceLayout kicker="Playable message" theme={experience.theme} title={template.title} titleAs={mode === "generated" ? "h1" : "h2"}>
      {screen === "landing" ? (
        <StepTransition step={0}>
          <PlayerCard>
            <ProgressBar current={1} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">{one}</h2>
            <p className="mt-5 text-white/75">Wrong passwords trigger dramatic reactions. The honest one opens the room.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button className="ghost-button" type="button" onClick={enterRoom}>Enter the room</button>
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "room" ? (
        <StepTransition step={1}>
          <PlayerCard>
            <ChoiceBadge label="You entered the room" />
            <ProgressBar current={2} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Three boxes. One truth.</h2>
            <p className="mt-5 text-white/75">Each box opens a part of the message.</p>
            <PasswordRoom boxes={[one, two, three, experience.finalMessage]} />
            <button className="premium-button mt-8" type="button" onClick={() => { playSound("ding"); track(experience.id, "experience_completed", template.id); setScreen("final"); }}>Read the final message</button>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "final" ? final : null}
      <EggBanner message={eggMessage} />
      <Watermark />
    </ExperienceLayout>
  );
}

export function MemoryMaze({ template, experience, mode, shareUrl }: Props) {
  const [screen, setScreen] = useState<"landing" | "maze" | "final">("landing");
  const messages = experience.customMessages.steps;
  const [one = "You are inside a memory. Find the exit.", two = "Each door is a moment we shared.", three = "You found the exit. But this memory stayed."] = messages;

  const totalSteps = 3;
  const stepIndex = screen === "landing" ? 0 : screen === "maze" ? 1 : 2;

  function enterMaze() {
    playSound("whoosh");
    track(experience.id, "selected_mood_choice", template.id, "enter");
    setScreen("maze");
  }

  const final = <Final experience={experience} mode={mode} shareUrl={shareUrl} template={template} />;
  const { message: eggMessage } = useEasterEgg(template.id);

  useAutoAdvance({ active: mode === "demo" && screen === "landing", onAdvance: useCallback(() => enterMaze(), []) });

  return (
    <ExperienceLayout kicker="Playable message" theme={experience.theme} title={template.title} titleAs={mode === "generated" ? "h1" : "h2"}>
      {screen === "landing" ? (
        <StepTransition step={0}>
          <PlayerCard>
            <ProgressBar current={1} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">{one}</h2>
            <p className="mt-5 text-white/75"><TypewriterText text={two} /></p>
            <button className="premium-button mt-8" type="button" onClick={enterMaze}>Enter the maze</button>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "maze" ? (
        <StepTransition step={1}>
          <PlayerCard>
            <ChoiceBadge label="You entered the maze" />
            <ProgressBar current={2} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title text-3xl font-bold leading-tight sm:text-5xl">Choose a memory door.</h2>
            <p className="mt-5 text-white/75"><TypewriterText text={three} /></p>
            <MemoryDoor doors={[one, two, three, "The truth", "Exit"]} />
            <button className="premium-button mt-8" type="button" onClick={() => { playSound("ding"); track(experience.id, "experience_completed", template.id); setScreen("final"); }}>Exit with the truth</button>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "final" ? final : null}
      <EggBanner message={eggMessage} />
      <Watermark />
    </ExperienceLayout>
  );
}

export function RoastToRespect({ template, experience, mode, shareUrl }: Props) {
  const [step, setStep] = useState(0);
  const messages = experience.customMessages.steps;
  const [one = "I will roast you first. Then say the truth.", two = "Your texting style needs a parental advisory label.", three = "Alright. Jokes aside."] = messages;
  const roasts = [
    { text: one, roast: "Your reply speed belongs to a government office.", action: "Next roast" },
    { text: two, roast: "Your attitude needs a software update.", action: "Enough roasting" },
    { text: "You take compliments worse than a dial-up internet.", roast: "One more?", action: "Last roast" },
    { text: three, roast: "But honestly? You're one of the few people I'm glad I know.", action: "Show respect" }
  ];

  const totalSteps = roasts.length + 1;
  const current = roasts[Math.min(step, roasts.length - 1)];

  function next(choice: string) {
    playSound("click");
    track(experience.id, "selected_mood_choice", template.id, choice);
    if (step >= roasts.length - 1) {
      playSound("ding");
      track(experience.id, "experience_completed", template.id);
      setStep(roasts.length);
    } else {
      setStep((s) => s + 1);
    }
  }

  const final = <Final experience={experience} mode={mode} shareUrl={shareUrl} template={template} />;
  const { message: eggMessage } = useEasterEgg(template.id);

  useAutoAdvance({ active: mode === "demo" && step < roasts.length, onAdvance: useCallback(() => { if (step < roasts.length) { playSound("click"); setStep((s) => Math.min(s + 1, roasts.length)); } }, [step, roasts.length]) });

  return (
    <ExperienceLayout kicker="Playable message" theme={experience.theme} title={template.title} titleAs={mode === "generated" ? "h1" : "h2"}>
      {step >= roasts.length ? final : (
        <StepTransition step={step}>
          <PlayerCard>
            <BackButton onBack={() => setStep(Math.max(0, step - 1))} disabled={step === 0 || mode === "demo"} />
            <ProgressBar current={step + 1} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">{current.text}</h2>
            <div className="my-8 rounded-2xl border border-white/15 bg-white/10 p-6 text-center">
              <p className="text-xl font-extrabold italic text-white/90">"{current.roast}"</p>
            </div>
            {step >= 2 ? (
              <>
                <p className="mt-4 text-white/75"><TypewriterText text={experience.finalMessage} /></p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button className="premium-button" type="button" onClick={() => next(current.action)}>{current.action}</button>
                </div>
              </>
            ) : (
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button className="ghost-button" type="button" onClick={() => next(current.action)}>{current.action}</button>
              </div>
            )}
          </PlayerCard>
        </StepTransition>
      )}
      <EggBanner message={eggMessage} />
      <Watermark />
    </ExperienceLayout>
  );
}

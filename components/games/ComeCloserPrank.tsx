"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Phase = "note" | "intro" | "darkroom" | "count3" | "count2" | "count1" | "flash" | "reveal" | "message";

const PRANK_TEXTS = [
  "Bro really fell for the dark room trick \u{1F62D}",
  "You actually went to a dark room for this \u{1F602}",
  "Bro turned off all the lights for NOTHING \u{1F62D}",
  "Dark room check passed. You're officially dumb \u{1F929}",
  "You really sat in the dark waiting for something \u{1F602}",
  "Mission accomplished. You look like an idiot in the dark \u{1F480}",
];

function playSuspenseDrone(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.035, ctx.currentTime);
  master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 18);
  master.connect(ctx.destination);

  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(75, ctx.currentTime);
  osc1.frequency.linearRampToValueAtTime(90, ctx.currentTime + 16);

  const lfo1 = ctx.createOscillator();
  lfo1.type = "sine";
  lfo1.frequency.value = 0.3;
  const lfoGain1 = ctx.createGain();
  lfoGain1.gain.value = 4;
  lfo1.connect(lfoGain1);
  lfoGain1.connect(osc1.frequency);
  lfo1.start();

  const gain1 = ctx.createGain();
  gain1.gain.setValueAtTime(0.5, ctx.currentTime);
  gain1.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 16);
  osc1.connect(gain1);
  gain1.connect(master);
  osc1.start();
  osc1.stop(ctx.currentTime + 17);

  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(112, ctx.currentTime);
  osc2.frequency.linearRampToValueAtTime(130, ctx.currentTime + 16);

  const lfo2 = ctx.createOscillator();
  lfo2.type = "sine";
  lfo2.frequency.value = 0.2;
  const lfoGain2 = ctx.createGain();
  lfoGain2.gain.value = 5;
  lfo2.connect(lfoGain2);
  lfoGain2.connect(osc2.frequency);
  lfo2.start();

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0.4, ctx.currentTime);
  gain2.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 16);
  osc2.connect(gain2);
  gain2.connect(master);
  osc2.start();
  osc2.stop(ctx.currentTime + 17);

  const osc3 = ctx.createOscillator();
  osc3.type = "triangle";
  osc3.frequency.setValueAtTime(55, ctx.currentTime);
  osc3.frequency.linearRampToValueAtTime(65, ctx.currentTime + 18);

  const lfo3 = ctx.createOscillator();
  lfo3.type = "sine";
  lfo3.frequency.value = 0.15;
  const lfoGain3 = ctx.createGain();
  lfoGain3.gain.value = 20;
  lfo3.connect(lfoGain3);
  lfoGain3.connect(osc3.frequency);
  lfo3.start();

  const gain3 = ctx.createGain();
  gain3.gain.setValueAtTime(0.15, ctx.currentTime);
  osc3.connect(gain3);
  gain3.connect(master);
  osc3.start();
  osc3.stop(ctx.currentTime + 18);

  return master;
}

function playSting(ctx: AudioContext) {
  const noiseLen = 0.35;
  const sampleRate = ctx.sampleRate;
  const buf = ctx.createBuffer(1, Math.ceil(sampleRate * noiseLen), sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.5);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.4, ctx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + noiseLen);

  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 800;

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start();

  const boom = ctx.createOscillator();
  boom.type = "sine";
  boom.frequency.setValueAtTime(60, ctx.currentTime);
  boom.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.5);

  const boomGain = ctx.createGain();
  boomGain.gain.setValueAtTime(0.5, ctx.currentTime);
  boomGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

  boom.connect(boomGain);
  boomGain.connect(ctx.destination);
  boom.start();
  boom.stop(ctx.currentTime + 0.5);
}

export function ComeCloserPrank({ message, onComplete }: { message: string; onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("note");
  const [prankText, setPrankText] = useState("");
  const [flashVisible, setFlashVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);

  const finalMessage = message.trim() || "Funniest remember \u{1F602}";

  const getOrCreateCtx = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  }, []);

  const startFullscreen = useCallback(() => {
    setPhase("intro");
  }, []);

  const advance = useCallback(() => {
    setPhase((p) => {
      if (p === "intro") return "darkroom";
      if (p === "darkroom") return "count3";
      return p;
    });
  }, []);

  useEffect(() => {
    if (phase === "intro" || phase === "darkroom") {
      try {
        const ctx = getOrCreateCtx();
        const g = playSuspenseDrone(ctx);
        droneGainRef.current = g;
      } catch { /* audio not supported */ }
    }
  }, [phase, getOrCreateCtx]);

  useEffect(() => {
    if (phase === "count3") { const t = setTimeout(() => setPhase("count2"), 1000); return () => clearTimeout(t); }
    if (phase === "count2") { const t = setTimeout(() => setPhase("count1"), 1000); return () => clearTimeout(t); }
    if (phase === "count1") { const t = setTimeout(() => setPhase("flash"), 1000); return () => clearTimeout(t); }
    if (phase === "flash") {
      try {
        playSting(getOrCreateCtx());
      } catch { /* audio not supported */ }
      setFlashVisible(true);
      setPrankText(PRANK_TEXTS[Math.floor(Math.random() * PRANK_TEXTS.length)]);
      const t = setTimeout(() => { setFlashVisible(false); setPhase("reveal"); }, 900);
      return () => clearTimeout(t);
    }
    if (phase === "reveal") {
      const t = setTimeout(() => setPhase("message"), 3500);
      return () => clearTimeout(t);
    }
  }, [phase, getOrCreateCtx]);

  return (
    <div
      ref={containerRef}
      onClick={phase === "intro" || phase === "darkroom" ? advance : undefined}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{
        fontFamily: "'Nunito Sans', system-ui, sans-serif",
        touchAction: "manipulation",
        background: "#0d0d12",
        cursor: phase === "intro" || phase === "darkroom" ? "pointer" : "default",
      }}
    >
      {/* Subtle grain */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")" }} />

      {/* Pulsing glow during setup */}
      {(phase === "intro" || phase === "darkroom") && (
        <div className="absolute inset-0 transition-opacity duration-1000" style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(255,200,150,0.06) 0%, transparent 60%)",
          animation: "cgPulse 3s ease-in-out infinite",
        }} />
      )}

      {/* Super-bright full-screen flash */}
      {flashVisible && (
        <>
          <div className="absolute inset-0 z-30 pointer-events-none" style={{
            background: "#fff",
            boxShadow: "inset 0 0 200px 100px rgba(255,255,255,0.95), 0 0 300px 150px rgba(255,255,255,0.6)",
            animation: "cgFlash 0.9s ease-out forwards",
          }} />
          <div className="absolute inset-0 z-30 pointer-events-none" style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 70%)",
            animation: "cgFlashGlow 0.9s ease-out forwards",
          }} />
        </>
      )}

      {/* Note — minimized window tab */}
      {phase === "note" && (
        <div className="relative z-10 flex flex-col items-center" style={{ animation: "cgNoteIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both" }}>
          <div className="w-72 rounded-xl border border-white/10 bg-[#13131a] shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-2.5">
              <span className="inline-block h-2 w-2 rounded-full bg-[#ff5f57]" />
              <span className="inline-block h-2 w-2 rounded-full bg-[#ffbd2e]" />
              <span className="inline-block h-2 w-2 rounded-full bg-[#28c840]" />
            </div>
            <div className="px-4 py-3.5 text-center">
              <p className="font-display text-sm leading-relaxed text-white/80">
                Note: Increase brightness to max to reveal a hidden secret. If not increased to max you will miss the secret. Be alone. It is a top secret thing.
              </p>
              <button
                onClick={startFullscreen}
                className="mt-3 inline-flex min-h-[38px] w-full items-center justify-center rounded-lg bg-white/10 border border-white/15 px-5 text-xs font-bold text-white/80 tracking-wide transition-all hover:bg-white/20 active:scale-[0.97]"
              >
                yes i did it
              </button>
            </div>
          </div>
          <p className="mt-2 text-[9px] font-medium tracking-widest text-white/15 uppercase">window minimized · click to restore</p>
        </div>
      )}

      {/* Intro / darkroom text */}
      {(phase === "intro" || phase === "darkroom") && (
        <div className="relative z-10 mx-auto max-w-lg px-8 text-center" style={{ animation: "cgReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) both" }}>
          <p className="font-display font-bold leading-relaxed tracking-wide text-white/90" style={{ fontSize: "clamp(1.1rem, 4.5vw, 1.6rem)" }}>
            {phase === "intro"
              ? "i want to show u something only see it if u are alone and in a dark room with full brightness for clarity"
              : "u liar go in a dark room i want to show u something"}
          </p>
          <div className="mt-6 flex items-center justify-center gap-1.5" style={{ animation: "cgFadePulse 2s ease-in-out infinite" }}>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/20" />
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/30" />
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/20" />
          </div>
        </div>
      )}

      {/* Countdown */}
      {(phase === "count3" || phase === "count2" || phase === "count1") && (
        <div className="relative z-10 mx-auto px-8 text-center" style={{ animation: "cgPop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both" }}>
          <span className="font-display font-black text-white/90" style={{
            fontSize: "clamp(5rem, 25vw, 12rem)",
            textShadow: "0 0 60px rgba(255,255,255,0.15)",
            lineHeight: 1,
          }}>
            {phase === "count3" ? "3" : phase === "count2" ? "2" : "1"}
          </span>
        </div>
      )}

      {/* BOOM text on top of flash */}
      {phase === "flash" && (
        <div className="relative z-40 mx-auto text-center pointer-events-none">
          <span className="font-display font-black text-white" style={{
            fontSize: "clamp(4rem, 20vw, 10rem)",
            textShadow: "0 0 80px rgba(255,255,255,0.4), 0 0 160px rgba(255,255,255,0.2)",
            lineHeight: 1,
          }}>
            BOOM
          </span>
        </div>
      )}

      {/* Reveal */}
      {phase === "reveal" && (
        <div className="relative z-10 mx-auto max-w-lg px-6 text-center" style={{ animation: "cgReveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) both" }}>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20" style={{ animation: "cgBounce 1s ease-in-out infinite" }}>
            <span className="text-4xl">{String.fromCodePoint(0x1F602)}</span>
          </div>
          <h1 className="font-display font-black leading-tight text-white" style={{
            fontSize: "clamp(1.5rem, 6vw, 3rem)",
            textShadow: "0 0 40px rgba(255,200,150,0.2)",
          }}>
            {prankText}
          </h1>
        </div>
      )}

      {/* Final message card */}
      {phase === "message" && (
        <div className="relative z-10 mx-auto w-full max-w-md px-6" style={{ animation: "cgReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) both" }}>
          <div className="rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-xl p-6 sm:p-8 text-center shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ff6b8a] to-[#ff8a6b] shadow-lg">
              <span className="text-2xl">{String.fromCodePoint(0x1F929)}</span>
            </div>
            <p className="font-display font-bold text-white/90 leading-relaxed" style={{ fontSize: "clamp(1rem, 4vw, 1.5rem)" }}>
              {finalMessage}
            </p>
            <button
              onClick={onComplete}
              className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-gradient-to-r from-white/15 to-white/10 border border-white/20 px-8 text-sm font-extrabold text-white/80 backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
            >
              Done \u2728
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes cgNoteIn { from { opacity: 0; transform: scale(0.85) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes cgPulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
        @keyframes cgFlash { 0% { opacity: 0; } 2% { opacity: 1; } 70% { opacity: 1; } 85% { opacity: 0.6; } 100% { opacity: 0; } }
        @keyframes cgFlashGlow { 0% { opacity: 0; } 2% { opacity: 1; } 60% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes cgReveal { from { opacity: 0; transform: scale(0.6) translateY(30px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes cgPop { from { opacity: 0; transform: scale(0.3); } to { opacity: 1; transform: scale(1); } }
        @keyframes cgBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes cgFadePulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
      `}</style>
    </div>
  );
}

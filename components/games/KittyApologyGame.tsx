"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { initAudio } from "@/lib/sounds";

type Phase =
  | "peek" | "enter" | "wave" | "stumble" | "present"
  | "zoom-in" | "read" | "letter-show" | "waiting"
  | "minimize" | "bow" | "sorry" | "hopeful" | "complete";

type Expression = "shy" | "guilty" | "surprised" | "reading" | "sad" | "hopeful" | "neutral";

export function KittyApologyGame({ message, onComplete }: { message: string; onComplete: () => void }) {
  const letterMessage = message.trim()
    ? message
    : "I'm really sorry for everything. You mean so much to me, and I hate that I made you feel bad. I promise I'll do better, because losing you isn't something I can handle. Please give me a chance to make it right.\n\nWith all my heart,\nYours";

  const [phase, setPhase] = useState<Phase>("peek");
  const [subPhase, setSubPhase] = useState(0);
  const [showText, setShowText] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [letterVisible, setLetterVisible] = useState(false);
  const [expression, setExpression] = useState<Expression>("shy");
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; delay: number; size: number; duration: number; drift: number; emoji: string }[]>([]);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; delay: number; size: number; duration: number; drift: number }[]>([]);
  const [controlsVisible, setControlsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const heartIdRef = useRef(0);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const tryFs = () => { if (document.fullscreenElement) return; el.requestFullscreen?.().catch(() => {}); };
    const onInteraction = () => {
      tryFs();
      initAudio();
      if (audioRef.current && !audioReady) {
        audioRef.current.volume = 0.15;
        audioRef.current.loop = true;
        audioRef.current.play().catch(() => {});
        setAudioReady(true);
      }
      document.removeEventListener("pointerdown", onInteraction);
    };
    document.addEventListener("pointerdown", onInteraction);
    const t = setTimeout(() => {
      tryFs();
      if (audioRef.current && !audioReady) {
        audioRef.current.volume = 0.15;
        audioRef.current.loop = true;
        audioRef.current.play().catch(() => {});
        setAudioReady(true);
      }
    }, 500);
    return () => { clearTimeout(t); document.removeEventListener("pointerdown", onInteraction); };
  }, [audioReady]);

  useEffect(() => {
    if (phase === "complete") {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      if (audioRef.current) {
        const fade = setInterval(() => {
          if (audioRef.current && audioRef.current.volume > 0.01) {
            audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.01);
          } else { clearInterval(fade); if (audioRef.current) audioRef.current.pause(); }
        }, 50);
      }
    }
  }, [phase]);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const onMove = () => showControls();
    el.addEventListener("pointermove", onMove);
    return () => { el.removeEventListener("pointermove", onMove); clearTimeout(controlsTimerRef.current); };
  }, [showControls]);

  const triggerHearts = useCallback(() => {
    const count = 30;
    const h = Array.from({ length: count }, () => ({
      id: heartIdRef.current++, x: Math.random() * 100, y: 8 + Math.random() * 78,
      delay: Math.random() * 1.4, duration: 2.2 + Math.random() * 1.6,
      size: 10 + Math.random() * 24, drift: -35 + Math.random() * 70,
      emoji: ["❤️", "💕", "💗", "💖", "💝"][Math.floor(Math.random() * 5)]
    }));
    setHearts(prev => [...prev, ...h]); setTimeout(() => setHearts([]), 4200);
  }, []);

  const triggerSparkles = useCallback(() => {
    const count = 20;
    const s = Array.from({ length: count }, () => ({
      id: heartIdRef.current++, x: Math.random() * 100, y: 5 + Math.random() * 80,
      delay: Math.random() * 1.2, duration: 2 + Math.random() * 1.5,
      size: 6 + Math.random() * 12, drift: -25 + Math.random() * 50
    }));
    setSparkles(prev => [...prev, ...s]); setTimeout(() => setSparkles([]), 3800);
  }, []);

  // ─── Phase progression ───
  useEffect(() => {
    switch (phase) {
      case "peek":
        setExpression("shy");
        { const t1 = setTimeout(() => setSubPhase(1), 900);
          const t2 = setTimeout(() => setSubPhase(2), 1800);
          const t3 = setTimeout(() => { setPhase("enter"); setSubPhase(0); setShowText(true); setTextContent("Um… hi…"); }, 3200);
          return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); }; }
      case "enter":
        { const t = setTimeout(() => { setPhase("wave"); setSubPhase(0); }, 2400); return () => clearTimeout(t); }
      case "wave":
        setExpression("guilty");
        { const t = setTimeout(() => { setShowText(true); setTextContent("Please don't be mad…"); }, 300);
          const t2 = setTimeout(() => { setPhase("stumble"); setSubPhase(0); setShowText(false); }, 3000);
          return () => { clearTimeout(t); clearTimeout(t2); }; }
      case "stumble":
        setExpression("surprised");
        { const t = setTimeout(() => { setPhase("present"); setSubPhase(0); }, 2800); return () => clearTimeout(t); }
      case "present":
        setExpression("shy");
        { const t = setTimeout(() => { setShowText(true); setTextContent("I… brought you something…"); }, 400);
          triggerHearts();
          const t2 = setTimeout(() => { setPhase("zoom-in"); setSubPhase(0); setShowText(false); }, 3200);
          return () => { clearTimeout(t); clearTimeout(t2); }; }
      case "zoom-in":
        { const t = setTimeout(() => { setPhase("read"); setSubPhase(0); setExpression("reading"); }, 2400); return () => clearTimeout(t); }
      case "read":
        { const t = setTimeout(() => { setPhase("letter-show"); setLetterVisible(true); }, 3000); return () => clearTimeout(t); }
      case "waiting": triggerHearts(); break;
      case "minimize":
        setExpression("surprised");
        {           const t = setTimeout(() => { setExpression("sad"); setPhase("bow"); setSubPhase(0); triggerHearts(); triggerSparkles(); }, 1400); return () => clearTimeout(t); }
      case "bow":
        { const t = setTimeout(() => { setShowText(true); setTextContent("Sorry…"); }, 600);
          const t2 = setTimeout(() => { setPhase("sorry"); setShowText(false); }, 2600);
          return () => { clearTimeout(t); clearTimeout(t2); }; }
      case "sorry":
        { const t = setTimeout(() => { setPhase("hopeful"); setSubPhase(0); triggerHearts(); }, 3000); return () => clearTimeout(t); }
      case "hopeful":
        setExpression("hopeful");
        { const t = setTimeout(() => { setShowText(true); setTextContent("Can you forgive me?"); }, 500);
          const t2 = setTimeout(() => { setPhase("complete"); }, 3800);
          return () => { clearTimeout(t); clearTimeout(t2); }; }
      case "complete":
        { const t = setTimeout(() => onComplete(), 800); return () => clearTimeout(t); }
    }
  }, [phase, onComplete, triggerHearts, triggerSparkles]);

  useEffect(() => {
    if (phase === "peek") { const i = setInterval(() => setSubPhase(p => p >= 2 ? 0 : p + 1), 900); return () => clearInterval(i); }
    if (["enter", "wave", "present", "hopeful"].includes(phase)) { const i = setInterval(() => setSubPhase(p => p >= 2 ? 0 : p + 1), 700); return () => clearInterval(i); }
    if (phase === "stumble") { const i = setInterval(() => setSubPhase(p => p >= 3 ? 0 : p + 1), 600); return () => clearInterval(i); }
    if (phase === "read") { const i = setInterval(() => setSubPhase(p => p >= 3 ? 0 : p + 1), 500); return () => clearInterval(i); }
    if (phase === "waiting") { const i = setInterval(() => setSubPhase(p => p >= 2 ? 0 : p + 1), 2500); return () => clearInterval(i); }
    if (phase === "bow") { const i = setInterval(() => setSubPhase(p => p >= 2 ? 0 : p + 1), 800); return () => clearInterval(i); }
  }, [phase]);

  const eyeY = expression === "guilty" || expression === "sad" ? 2 : expression === "surprised" ? -2 : 0;
  const eyeScaleY = expression === "hopeful" ? 1.1 : expression === "guilty" ? 0.65 : expression === "sad" ? 0.75 : expression === "reading" ? 0.9 : 1;
  const mouthType = expression === "shy" ? "w" : expression === "guilty" ? "pout" : expression === "surprised" ? "o" : expression === "reading" ? "line" : expression === "sad" ? "pout" : expression === "hopeful" ? "smile" : "w";
  const blushOp = expression === "shy" || expression === "guilty" || expression === "sad" ? 0.9 : 0.4;

  const handleDoneReading = useCallback(() => {
    setLetterVisible(false);
    setTimeout(() => { setPhase("minimize"); setSubPhase(0); setShowText(true); setTextContent("Ah!…"); }, 300);
  }, []);

  const handleShare = useCallback(async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  }, []);

  const isZoomed = ["zoom-in", "read", "letter-show", "waiting", "minimize"].includes(phase);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden select-none" style={{ fontFamily: "'Nunito Sans', system-ui, sans-serif", touchAction: "manipulation" }}>
      {/* Background */}
      <div className="absolute inset-0 transition-all duration-[2000ms] ease-in-out" style={{
        background: isZoomed
          ? "radial-gradient(ellipse at 50% 45%, #EBE0E6 0%, #D5C0D0 35%, #BDA5BB 65%, #9D88A5 100%)"
          : "radial-gradient(ellipse at 50% 75%, #F0E4E8 0%, #DEC8D5 30%, #C8ACBF 60%, #AD94AD 100%)",
      }}>
        <div className="absolute bottom-0 left-0 right-0 transition-all duration-[2000ms]" style={{ height: isZoomed ? "25%" : "30%", background: "linear-gradient(to top, rgba(173, 148, 173, 0.2) 0%, transparent 100%)" }} />
      </div>

      <audio ref={audioRef} preload="auto" src="/audio/kitty-apology-bg.mp3" />

      {hearts.map(h => (<div key={h.id} className="absolute pointer-events-none" style={{ left: `${h.x}%`, top: `${h.y}%`, fontSize: `${h.size}px`, animation: `hf ${h.duration}s ${h.delay}s ease-out both`, '--tx': `${h.drift}px` } as React.CSSProperties}>{h.emoji}</div>))}
      {sparkles.map(s => (<div key={s.id} className="absolute pointer-events-none" style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: `${s.size}px`, animation: `sf ${s.duration}s ${s.delay}s ease-out both`, '--tx': `${s.drift}px` } as React.CSSProperties}>✨</div>))}

      {/* ─── KITTY ─── */}
      <div className="relative transition-all duration-[2000ms] ease-in-out" style={{
        transform: isZoomed ? "scale(1.25) translateY(-6px)" : "scale(1) translateY(0)",
        transformOrigin: "center 50%",
      }}>
        <svg viewBox="0 0 200 260" className="overflow-visible w-[200px] h-[260px] sm:w-[250px] sm:h-[325px] md:w-[300px] md:h-[390px]" style={{ filter: "drop-shadow(0 12px 40px rgba(200, 140, 120, 0.35))" }}>
          <defs>
            <radialGradient id="fur" cx="48%" cy="30%" r="65%"><stop offset="0%" stopColor="#FFFAF2"/><stop offset="45%" stopColor="#FFF0E0"/><stop offset="100%" stopColor="#F0D5C0"/></radialGradient>
            <radialGradient id="earIn" cx="50%" cy="60%" r="55%"><stop offset="0%" stopColor="#FFD5D5"/><stop offset="100%" stopColor="#F0A8B0"/></radialGradient>
            <filter id="shadow"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/><feOffset dx="0" dy="2"/><feComponentTransfer><feFuncA type="linear" slope="0.12"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id="glow"><feGaussianBlur stdDeviation="2"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* ─── MAIN KITTY GROUP (moves together on enter/peek) ─── */}
          <g style={{
            transform: phase === "peek" ? "translateX(-50px)" : "translateX(0)",
            transition: "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
            animation: phase === "peek" ? "pkWobble 2s ease-in-out" : "none",
          }}>
            {/* ─── TAIL (emerges from body right side) ─── */}
            <g style={{
              transformOrigin: "152px 190px",
              animation: ["waiting"].includes(phase) ? "tw 3.5s ease-in-out infinite" : ["wave", "present", "bow", "sorry", "hopeful"].includes(phase) ? "tw 0.7s ease-in-out infinite" : "none",
            }}>
              <path d="M148,188 C165,180 178,168 180,152 C181,142 176,132 168,126" fill="none" stroke="url(#fur)" strokeWidth="13" strokeLinecap="round" filter="url(#shadow)" />
              <path d="M148,188 C165,180 178,168 180,152 C181,142 176,132 168,126" fill="none" stroke="#FFE0D0" strokeWidth="4" strokeLinecap="round" opacity="0.2" />
            </g>

            {/* ─── BODY (sitting, close to head) ─── */}
            <g filter="url(#shadow)" style={{
              transformOrigin: "100px 170px",
              animation: ["zoom-in", "read", "waiting"].includes(phase) ? "br 3.5s ease-in-out infinite" : phase === "stumble" ? subPhase === 0 ? "tr 0.35s ease-in-out" : subPhase === 1 ? "tl 0.35s ease-in-out" : subPhase === 2 ? "tr 0.35s ease-in-out" : "tl 0.35s ease-in-out" : phase === "bow" ? "bd 0.9s ease-in-out" : "none",
            }}>
              {/* Main body - wide sitting shape */}
              <ellipse cx="100" cy="162" rx="40" ry="38" fill="url(#fur)" />
              {/* Belly */}
              <ellipse cx="100" cy="168" rx="28" ry="30" fill="#FFF5E8" opacity="0.25" />
              {/* Bottom paws peeking below */}
              <ellipse cx="74" cy="198" rx="15" ry="9" fill="url(#fur)" transform="rotate(-18,74,198)" />
              <ellipse cx="126" cy="198" rx="15" ry="9" fill="url(#fur)" transform="rotate(18,126,198)" />
              <ellipse cx="74" cy="200" rx="8" ry="4" fill="#FFB5B5" opacity="0.2" transform="rotate(-18,74,200)" />
              <ellipse cx="126" cy="200" rx="8" ry="4" fill="#FFB5B5" opacity="0.2" transform="rotate(18,126,200)" />
            </g>

            {/* ─── FRONT PAWS (hands at chest level, holding letter) ─── */}
            <g filter="url(#shadow)" style={{
              transformOrigin: "100px 195px",
              animation: phase === "stumble" ? "stumblePaws 0.6s ease-in-out infinite" : "none",
            }}>
              {/* Left paw/hand */}
              <g style={{
                transformOrigin: "75px 148px",
                animation: phase === "wave" ? "pw 0.5s ease-in-out infinite" : phase === "waiting" ? "pw 3s ease-in-out infinite" : "none",
                transform: phase === "wave" ? "rotate(-25deg) translateY(-14px) translateX(-4px)" : phase === "present" ? "rotate(8deg) translateY(-6px)" : phase === "read" ? "rotate(6deg) translateY(-6px)" : "rotate(0)",
                transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}>
                <ellipse cx="75" cy="148" rx="12" ry="9" fill="url(#fur)" />
                <circle cx="75" cy="148" r="5" fill="#FFB5B5" opacity="0.2" />
              </g>
              {/* Right paw/hand */}
              <g style={{
                transformOrigin: "125px 148px",
                animation: phase === "waiting" ? "pw 3s ease-in-out infinite 0.15s" : "none",
                transform: phase === "present" ? "rotate(-8deg) translateY(-6px)" : phase === "read" ? "rotate(-6deg) translateY(-6px)" : "rotate(0)",
                transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}>
                <ellipse cx="125" cy="148" rx="12" ry="9" fill="url(#fur)" />
                <circle cx="125" cy="148" r="5" fill="#FFB5B5" opacity="0.2" />
              </g>
            </g>

            {/* ─── LETTER (held by paws at chest) ─── */}
            {(phase === "stumble" || phase === "present" || phase === "zoom-in" || phase === "read") && (
              <g style={{
                transformOrigin: "100px 148px",
                animation: "hl 1.3s ease-in-out infinite",
                transform: phase === "present" ? "translateY(-18px) scale(1.12)" : phase === "read" ? "translateY(-24px)" : "translateY(-6px)",
                transition: "transform 0.5s ease",
              }}>
                <rect x="84" y="134" width="32" height="22" rx="3" fill="#FFF8F1" stroke="#E0C8B4" strokeWidth="0.8" filter="url(#shadow)" />
                <line x1="89" y1="140" x2="111" y2="140" stroke="#D4C0A8" strokeWidth="0.6" opacity="0.5" />
                <line x1="89" y1="145" x2="108" y2="145" stroke="#D4C0A8" strokeWidth="0.6" opacity="0.5" />
                <line x1="89" y1="150" x2="104" y2="150" stroke="#D4C0A8" strokeWidth="0.6" opacity="0.5" />
                <circle cx="100" cy="136" r="3.5" fill="#FF8FA0" opacity="0.6" />
              </g>
            )}

            {/* ─── HEAD (attached to body - minimal gap) ─── */}
            <g filter="url(#shadow)" style={{
              transformOrigin: "100px 85px",
              transform: phase === "enter" ? subPhase === 0 ? "translateY(8px)" : subPhase === 1 ? "translateY(3px)" : "translateY(0)" : phase === "wave" ? "rotate(-3deg) translateY(2px)" : phase === "stumble" ? subPhase === 0 ? "rotate(-12deg) translateX(-5px)" : subPhase === 1 ? "rotate(12deg) translateX(5px)" : subPhase === 2 ? "rotate(-8deg) translateX(-3px)" : "rotate(8deg) translateX(3px)" : phase === "present" ? "rotate(-4deg) translateY(3px)" : phase === "read" ? subPhase === 0 ? "rotate(-3deg)" : subPhase === 1 ? "rotate(3deg)" : subPhase === 2 ? "rotate(-5deg)" : "rotate(4deg)" : phase === "bow" ? "translateY(14px) rotate(7deg)" : phase === "sorry" ? "translateY(6px)" : phase === "hopeful" ? subPhase === 0 ? "translateY(4px)" : "translateY(0)" : "translateX(0)",
              transition: ["enter", "wave", "zoom-in", "read", "bow", "hopeful"].includes(phase) ? "transform 0.45s ease-in-out" : "transform 0.3s ease-in-out",
            }}>
              {/* Face base */}
              <ellipse cx="100" cy="80" rx="45" ry="43" fill="url(#fur)" />
              {/* Face highlight */}
              <ellipse cx="95" cy="70" rx="32" ry="28" fill="#FFFAF2" opacity="0.15" />

              {/* EARS (attached at head edge) */}
              <g style={{ transformOrigin: "63px 43px", transition: "transform 0.3s ease", transform: expression === "guilty" || expression === "sad" ? "rotate(-8deg) translateY(4px)" : "rotate(0)" }}>
                <path d="M55,45 L48,14 L70,38Z" fill="url(#fur)" />
                <path d="M57,43 L53,22 L68,39Z" fill="url(#earIn)" opacity="0.55" />
              </g>
              <g style={{ transformOrigin: "137px 43px", transition: "transform 0.3s ease", transform: expression === "guilty" || expression === "sad" ? "rotate(5deg) translateY(3px)" : "rotate(0)" }}>
                <path d="M145,45 L152,14 L130,38Z" fill="url(#fur)" />
                <path d="M143,43 L147,22 L132,39Z" fill="url(#earIn)" opacity="0.55" />
              </g>

              {/* EYES */}
              <g style={{ transform: `translateY(${eyeY}px)`, transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
                {/* Left eye */}
                <g style={{ transformOrigin: "79px 78px", transform: `scale(1, ${eyeScaleY})`, transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
                  <ellipse cx="79" cy="78" rx="13" ry="14" fill="#1F1008" />
                  <ellipse cx="77" cy="74" rx="5" ry="6" fill="white" opacity="0.85" />
                  <circle cx="82" cy="82" r="2.5" fill="white" opacity="0.3" />
                  {(expression === "sad" || expression === "guilty") && <circle cx="75" cy="81" r="2" fill="white" opacity="0.2" />}
                </g>
                {/* Right eye */}
                <g style={{ transformOrigin: "121px 78px", transform: `scale(1, ${eyeScaleY})`, transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
                  <ellipse cx="121" cy="78" rx="13" ry="14" fill="#1F1008" />
                  <ellipse cx="119" cy="74" rx="5" ry="6" fill="white" opacity="0.85" />
                  <circle cx="124" cy="82" r="2.5" fill="white" opacity="0.3" />
                  {(expression === "sad" || expression === "guilty") && <circle cx="117" cy="81" r="2" fill="white" opacity="0.2" />}
                </g>
              </g>

              {/* Reading eye movement */}
              {phase === "read" && (
                <g>
                  <ellipse cx={79 + subPhase * 4 - 6} cy="78" rx="4.5" ry="5.5" fill="#1F1008" />
                  <ellipse cx={121 + subPhase * 4 - 6} cy="78" rx="4.5" ry="5.5" fill="#1F1008" />
                  <circle cx={82 + subPhase * 4 - 6} cy="82" r="1.8" fill="white" opacity="0.3" />
                  <circle cx={124 + subPhase * 4 - 6} cy="82" r="1.8" fill="white" opacity="0.3" />
                </g>
              )}

              {/* Blush */}
              <g style={{ opacity: blushOp, transition: "opacity 0.5s ease" }}>
                <ellipse cx="63" cy="96" rx="11" ry="7" fill="#FFC0C0" opacity="0.4" filter="url(#glow)" />
                <ellipse cx="137" cy="96" rx="11" ry="7" fill="#FFC0C0" opacity="0.4" filter="url(#glow)" />
              </g>

              {/* Eyebrows */}
              {expression === "guilty" && (
                <g opacity="0.45">
                  <path d="M66,60 Q76,56 88,60" fill="none" stroke="#C8A080" strokeWidth="2" strokeLinecap="round" />
                  <path d="M112,60 Q124,56 134,60" fill="none" stroke="#C8A080" strokeWidth="2" strokeLinecap="round" />
                </g>
              )}
              {expression === "sad" && (
                <g opacity="0.45">
                  <path d="M64,60 Q76,58 86,62" fill="none" stroke="#C8A080" strokeWidth="2" strokeLinecap="round" />
                  <path d="M114,62 Q124,58 136,60" fill="none" stroke="#C8A080" strokeWidth="2" strokeLinecap="round" />
                </g>
              )}
              {expression === "surprised" && (
                <g opacity="0.45">
                  <path d="M68,58 Q78,54 88,58" fill="none" stroke="#C8A080" strokeWidth="2" strokeLinecap="round" />
                  <path d="M112,58 Q122,54 132,58" fill="none" stroke="#C8A080" strokeWidth="2" strokeLinecap="round" />
                </g>
              )}
              {expression === "reading" && (
                <g opacity="0.3">
                  <path d="M66,59 Q78,57 88,60" fill="none" stroke="#C8A080" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M112,60 Q122,57 134,59" fill="none" stroke="#C8A080" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              )}

              {/* Nose */}
              <ellipse cx="100" cy="91" rx="3.5" ry="3" fill="#FFA8A8" opacity="0.75" />
              <ellipse cx="99" cy="90" rx="1.2" ry="0.8" fill="white" opacity="0.4" />

              {/* Mouth */}
              {mouthType === "w" && <><path d="M91,100 Q95,105 100,100" fill="none" stroke="#1F1008" strokeWidth="1.8" strokeLinecap="round"/><path d="M100,100 Q105,105 109,100" fill="none" stroke="#1F1008" strokeWidth="1.8" strokeLinecap="round"/></>}
              {mouthType === "o" && <ellipse cx="100" cy="101" rx="4.5" ry="5.5" fill="#1F1008" opacity="0.45"/>}
              {mouthType === "line" && <path d="M93,102 Q100,104 107,102" fill="none" stroke="#1F1008" strokeWidth="1.5" strokeLinecap="round"/>}
              {mouthType === "pout" && <path d="M92,103 Q100,108 108,103" fill="none" stroke="#1F1008" strokeWidth="2" strokeLinecap="round"/>}
              {mouthType === "smile" && <path d="M93,99 Q100,105 107,99" fill="none" stroke="#1F1008" strokeWidth="1.8" strokeLinecap="round"/>}
            </g>
          </g>
        </svg>
      </div>

      {/* ─── Speech bubble ─── */}
      {showText && textContent && phase !== "sorry" && (
        <div className="relative z-20 mt-2 sm:mt-3" style={{ animation: "fiu 0.5s cubic-bezier(0.22, 1, 0.36, 1) both" }}>
          <div className="rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 text-center text-sm sm:text-base font-bold" style={{ background: "rgba(255,255,255,0.95)", color: "#2D1B14", boxShadow: "0 4px 20px rgba(200,120,100,0.2)", maxWidth: "240px" }}>
            {textContent}
            <div className="absolute left-1/2 -top-2 h-3 w-3 -translate-x-1/2 rotate-45" style={{ background: "rgba(255,255,255,0.95)" }} />
          </div>
        </div>
      )}

      {/* ─── Zoom text ─── */}
      {phase === "zoom-in" && (
        <div className="relative z-20 mt-2 sm:mt-3" style={{ animation: "fiu 0.5s cubic-bezier(0.22, 1, 0.36, 1) both" }}>
          <div className="rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 text-center text-sm sm:text-base font-bold" style={{ background: "rgba(255,255,255,0.95)", color: "#2D1B14", boxShadow: "0 4px 20px rgba(200,120,100,0.2)", maxWidth: "240px" }}>
            I wrote this for you…
            <div className="absolute left-1/2 -top-2 h-3 w-3 -translate-x-1/2 rotate-45" style={{ background: "rgba(255,255,255,0.95)" }} />
          </div>
        </div>
      )}

      {/* ─── Letter popup ─── */}
      {(phase === "letter-show" || phase === "waiting") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
          <div className="relative w-full max-w-sm sm:max-w-md" style={{ animation: "lp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}>
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-[3px]" style={{ background: "linear-gradient(135deg,#E8C4B8,#D4A898,#C09888)", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
              <div className="rounded-2xl p-6 sm:p-8" style={{
                background: "#FDF6EE",
                backgroundImage: "radial-gradient(circle at 15% 25%, rgba(200, 140, 120, 0.06) 0%, transparent 50%), radial-gradient(circle at 85% 75%, rgba(180, 120, 100, 0.04) 0%, transparent 50%)",
              }}>
                {/* Tear/watermark mark for emotion */}
                <div className="absolute top-8 right-6 sm:top-10 sm:right-8 opacity-[0.07]" style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "48px", color: "#8A6A5A", transform: "rotate(-8deg)" }}>sorry</div>

                {/* Heart seal at top */}
                <div className="mb-4 sm:mb-5 flex justify-center">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center" style={{
                    background: "linear-gradient(135deg,#E0877A,#C86A60)",
                    borderRadius: "50% 50% 50% 0",
                    transform: "rotate(-45deg)",
                    boxShadow: "0 3px 10px rgba(200, 100, 80, 0.3)",
                  }}>
                    <div className="flex h-8 w-8 items-center justify-center" style={{ transform: "rotate(45deg)" }}>
                      <svg viewBox="0 0 20 18" className="h-4 w-4 sm:h-[18px] sm:w-[18px]"><path d="M10,17 C5,12 1,9 1,5.5 C1,3 3,1 5.5,1 C7,1 8.5,2 10,3.5 C11.5,2 13,1 14.5,1 C17,1 19,3 19,5.5 C19,9 15,12 10,17Z" fill="white" opacity="0.95"/></svg>
                    </div>
                  </div>
                </div>

                {/* Paper fold line */}
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(to right, transparent 10%, rgba(200,160,140,0.12) 30%, rgba(200,160,140,0.12) 70%, transparent 90%)" }} />

                {/* Message text */}
                <div className="space-y-3">
                  <p className="text-center whitespace-pre-line" style={{
                    color: "#3D2820",
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontWeight: 500,
                    fontSize: "15px",
                    lineHeight: 1.8,
                    letterSpacing: "0.01em",
                  }}>{letterMessage}</p>
                </div>

                {/* Decorative divider */}
                <div className="my-5 sm:my-6 flex items-center gap-3">
                  <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, #DCC0B0, transparent)" }} />
                  <span style={{ color: "#D0A898", fontSize: "12px", letterSpacing: "2px" }}>~ ~ ~</span>
                  <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, #DCC0B0, transparent)" }} />
                </div>

                {/* Done reading button */}
                <button onClick={handleDoneReading} className="group relative w-full overflow-hidden rounded-xl sm:rounded-2xl px-5 py-3 sm:py-3.5 text-center text-sm sm:text-base font-extrabold tracking-wide transition-all duration-300" style={{
                  background: "linear-gradient(135deg,#E0877A,#C86A60)",
                  color: "white",
                  boxShadow: "0 4px 16px rgba(200,100,80,0.3)",
                }}>
                  <span className="relative z-10">Done Reading</span>
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "linear-gradient(135deg,#CC7060,#B85A50)" }} />
                </button>
              </div>
            </div>
          </div>
          {/* Kitty corner idle */}
          {phase === "waiting" && (
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6" style={{ animation: "fiu 0.8s 0.3s cubic-bezier(0.22, 1, 0.36, 1) both" }}>
              <svg viewBox="0 0 50 70" className="w-10 h-[56px] sm:w-[52px] sm:h-[72px]" style={{ filter: "drop-shadow(0 4px 12px rgba(200,140,120,0.25))" }}>
                <defs><radialGradient id="cg2" cx="45%" cy="35%" r="60%"><stop offset="0%" stopColor="#FFFAF2"/><stop offset="60%" stopColor="#FFF0E0"/><stop offset="100%" stopColor="#F0D5C0"/></radialGradient></defs>
                <ellipse cx="25" cy="50" rx="11" ry="10" fill="url(#cg2)" />
                <ellipse cx="25" cy="18" rx="14" ry="13" fill="url(#cg2)" />
                <path d="M14,12 L12,2 L18,8Z" fill="url(#cg2)" />
                <path d="M36,12 L38,2 L32,8Z" fill="url(#cg2)" />
                <g style={{ animation: "bl 4s ease-in-out infinite" }}>
                  <ellipse cx="21" cy="17" rx="4" ry="4.5" fill="#1F1008" />
                  <ellipse cx="29" cy="17" rx="4" ry="4.5" fill="#1F1008" />
                </g>
                <ellipse cx="19" cy="24" rx="3" ry="2" fill="#FFC0C0" opacity="0.35" />
                <ellipse cx="31" cy="24" rx="3" ry="2" fill="#FFC0C0" opacity="0.35" />
                <ellipse cx="25" cy="23" rx="1" ry="0.8" fill="#FFA8A8" opacity="0.7" />
                <path d="M22,26 Q25,29 28,26" fill="none" stroke="#1F1008" strokeWidth="1" strokeLinecap="round" />
                <g style={{ transformOrigin: "25px 50px", animation: "tw 3.5s ease-in-out infinite" }}>
                  <path d="M40,48 Q44,44 45,40" fill="none" stroke="url(#cg2)" strokeWidth="4" strokeLinecap="round" />
                </g>
              </svg>
            </div>
          )}
        </div>
      )}

      {/* ─── Sorry text ─── */}
      {(phase === "sorry" || phase === "hopeful") && (
        <div className="relative z-20 mt-2 sm:mt-3" style={{ animation: "fiu 0.5s cubic-bezier(0.22, 1, 0.36, 1) both" }}>
          <div className="rounded-2xl px-5 py-3 sm:px-6 sm:py-4 text-center" style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 4px 20px rgba(200,120,100,0.2)" }}>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: "#FF8FA0", fontFamily: "'Fraunces', Georgia, serif", animation: phase === "sorry" ? "kso 1.5s ease-in-out infinite" : "none" }}>
              {phase === "sorry" ? "Sorry…" : textContent}
            </p>
            {phase === "hopeful" && textContent && <p className="mt-1.5 text-xs sm:text-sm" style={{ color: "#8A7A70" }}>I really mean it… sorry.</p>}
          </div>
          <div className="absolute -top-3 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45" style={{ background: "rgba(255,255,255,0.95)" }} />
        </div>
      )}

      {/* ─── Controls ─── */}
      <div className="absolute bottom-0 left-0 right-0 transition-all duration-500 ease-in-out pointer-events-none" style={{ opacity: controlsVisible ? 1 : 0, transform: controlsVisible ? "translateY(0)" : "translateY(20px)" }}>
        <div className="relative flex items-center justify-center gap-2 sm:gap-3 px-3 py-3 sm:px-5 sm:py-4" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)" }}>
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
            <button onClick={() => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); window.location.href = "/"; }} className="flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-white/80 transition-all hover:bg-white/15 hover:text-white" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
              <span className="hidden xs:inline">Home</span>
            </button>
            <a href="/create/kitty-apology" className="flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-white/80 transition-all hover:bg-white/15 hover:text-white" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
              <span className="hidden xs:inline">Edit</span>
            </a>
            <button onClick={handleShare} className="flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-white/80 transition-all hover:bg-white/15 hover:text-white" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"/></svg>
              <span className="hidden xs:inline">{copied ? "Copied!" : "Share"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Top close ─── */}
      <div className="absolute right-2 top-2 sm:right-4 sm:top-4 transition-all duration-500" style={{ opacity: controlsVisible ? 1 : 0 }}>
        <button onClick={() => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); window.location.href = "/"; }} className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full text-white/60 transition-all hover:bg-white/15 hover:text-white" style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)" }}>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <style>{`
        @keyframes pkWobble{0%{transform:translateX(-50px);opacity:0}20%{transform:translateX(-50px);opacity:1}40%{transform:translateX(-42px)}60%{transform:translateX(-50px)}80%{transform:translateX(-45px)}100%{transform:translateX(-50px);opacity:1}}
        @keyframes tw{0%,100%{transform:rotate(0deg)}50%{transform:rotate(16deg)}}
        @keyframes br{0%,100%{transform:scale(1)}50%{transform:scale(1.015)}}
        @keyframes tr{0%,100%{transform:rotate(0deg) translateX(0)}50%{transform:rotate(-15deg) translateX(-5px)}}
        @keyframes tl{0%,100%{transform:rotate(0deg) translateX(0)}50%{transform:rotate(15deg) translateX(5px)}}
        @keyframes bd{0%,100%{transform:rotate(0deg) translateY(0)}50%{transform:rotate(8deg) translateY(8px)}}
        @keyframes stumblePaws{0%,100%{transform:translateX(0)}50%{transform:translateX(4px)}}
        @keyframes pw{0%,100%{transform:rotate(-25deg) translateY(-14px) translateX(-4px)}50%{transform:rotate(-30deg) translateY(-18px) translateX(-6px)}}
        @keyframes hl{0%,100%{transform:translateY(-6px)}50%{transform:translateY(-9px)}}
        @keyframes bl{0%,90%,100%{transform:scaleY(1)}95%{transform:scaleY(0.12)}}
        @keyframes kso{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.05);opacity:0.85}}
        @keyframes lp{from{transform:scale(0.3) translateY(60px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
        @keyframes fiu{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes hf{0%{opacity:0;transform:translate(0,0) scale(0.15)}12%{opacity:1;transform:translate(calc(var(--tx)*0.25),-12px) scale(1)}65%{opacity:1;transform:translate(calc(var(--tx)*0.75),-65px) scale(1.08)}100%{opacity:0;transform:translate(var(--tx),-130px) scale(0.45)}}
        @keyframes sf{0%{opacity:0;transform:translate(0,0) scale(0.1)}15%{opacity:0.9;transform:translate(calc(var(--tx)*0.3),-10px) scale(1)}70%{opacity:0.7;transform:translate(calc(var(--tx)*0.8),-55px) scale(0.9)}100%{opacity:0;transform:translate(var(--tx),-110px) scale(0.3)}}
      `}</style>
    </div>
  );
}

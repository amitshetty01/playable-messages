"use client";

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";

export function FullscreenExperience({
  children,
  templateId,
  shareUrl,
}: {
  children: ReactNode;
  templateId: string;
  shareUrl?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const tryFs = () => { if (document.fullscreenElement) return; el.requestFullscreen?.().catch(() => {}); };
    const onInteraction = () => { tryFs(); document.removeEventListener("pointerdown", onInteraction); };
    document.addEventListener("pointerdown", onInteraction);
    const t = setTimeout(tryFs, 500);
    return () => { clearTimeout(t); document.removeEventListener("pointerdown", onInteraction); };
  }, []);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = () => showControls();
    el.addEventListener("pointermove", onMove);
    return () => { el.removeEventListener("pointermove", onMove); clearTimeout(controlsTimerRef.current); };
  }, [showControls]);

  const handleShare = useCallback(async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden select-none" style={{ touchAction: "manipulation" }}>
      {children}

      {/* Floating controls */}
      <div className="absolute bottom-0 left-0 right-0 transition-all duration-500 ease-in-out pointer-events-none" style={{ opacity: controlsVisible ? 1 : 0, transform: controlsVisible ? "translateY(0)" : "translateY(20px)" }}>
        <div className="relative flex items-center justify-center gap-2 sm:gap-3 px-3 py-3 sm:px-5 sm:py-4" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)" }}>
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
            <button onClick={() => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); window.history.back(); }} className="flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-white/80 transition-all hover:bg-white/15 hover:text-white" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
              <span className="hidden xs:inline">Back</span>
            </button>
            <a href={`/create/${templateId}`} className="flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-white/80 transition-all hover:bg-white/15 hover:text-white" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
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

      {/* Top close */}
      <div className="absolute right-2 top-2 sm:right-4 sm:top-4 transition-all duration-500" style={{ opacity: controlsVisible ? 1 : 0 }}>
        <button onClick={() => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); window.history.back(); }} className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full text-white/60 transition-all hover:bg-white/15 hover:text-white" style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)" }}>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  );
}

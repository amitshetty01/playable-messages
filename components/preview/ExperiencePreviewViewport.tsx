"use client";

import { useRef, useState, useEffect } from "react";

const PREVIEW_WIDTH = 390;
const PREVIEW_HEIGHT = 844;

interface ExperiencePreviewViewportProps {
  templateId: string;
  templateName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function ExperiencePreviewViewport({
  templateId,
  templateName,
  onLoad,
  onError,
}: ExperiencePreviewViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      if (cw === 0 || ch === 0) return;
      setScale(Math.min(cw / PREVIEW_WIDTH, ch / PREVIEW_HEIGHT));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleIframeLoad = () => {
    setLoadState("loaded");
    onLoad?.();
  };

  const handleIframeError = () => {
    setLoadState("error");
    onError?.();
  };

  useEffect(() => {
    setLoadState("loading");
  }, [templateId]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ isolation: "isolate", contain: "layout paint size style" }}
    >
      {loadState === "loading" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950 transition-opacity duration-300">
          <div className="flex flex-col items-center gap-3">
            <div className="spinner-ring" />
            <span className="text-[10px] font-medium tracking-wider text-white/30 uppercase">
              Loading preview
            </span>
          </div>
        </div>
      )}

      {loadState === "error" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950 p-6 text-center">
          <div>
            <p className="text-sm font-bold text-white/60">This preview could not load.</p>
            <a
              href={`/demo/${templateId}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white/70 transition-colors hover:bg-white/20"
            >
              Open full demo
            </a>
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: PREVIEW_WIDTH,
          height: PREVIEW_HEIGHT,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
          overflow: "hidden",
          opacity: loadState === "loaded" ? 1 : 0,
          transition: "opacity 0.3s ease",
          flexShrink: 0,
        }}
      >
        <iframe
          src={`/embed/demo/${templateId}`}
          title={templateName ? `${templateName} preview` : "Experience preview"}
          className="h-full w-full border-0"
          scrolling="no"
          allow="autoplay"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>
    </div>
  );
}

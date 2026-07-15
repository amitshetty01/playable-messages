"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { DemoProvider } from "@/components/DemoContext";

const DESIGN_WIDTH = 390;
const DESIGN_HEIGHT = 844;

export function ScaledPhonePreview({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      if (cw === 0 || ch === 0) return;
      setScale(Math.min(cw / DESIGN_WIDTH, ch / DESIGN_HEIGHT));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ isolation: "isolate" }}
    >
      <DemoProvider>
        <div
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            minWidth: DESIGN_WIDTH,
            minHeight: DESIGN_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      </DemoProvider>
      <div className="pointer-events-none absolute bottom-2 left-1/2 z-50 -translate-x-1/2">
        <span className="inline-block rounded-full border border-white/[0.06] bg-black/40 px-2.5 py-0.5 text-[9px] font-bold tracking-widest text-white/30 backdrop-blur-md uppercase">
          Sample Experience
        </span>
      </div>
    </div>
  );
}

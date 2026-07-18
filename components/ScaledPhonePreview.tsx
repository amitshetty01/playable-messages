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
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-50 -translate-x-1/2">
        <span className="inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-[0.14em] uppercase backdrop-blur-[12px]" style={{
          background: "var(--sample-badge-bg, rgba(50,28,58,0.08))",
          color: "var(--sample-badge-color, rgba(50,28,58,0.52))",
          border: "1px solid var(--sample-badge-border, rgba(50,28,58,0.08))",
        }}>
          Sample Experience
        </span>
      </div>
    </div>
  );
}

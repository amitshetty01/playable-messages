"use client";

import { useEffect, useRef } from "react";
import { useBlockedCountry } from "@/lib/useBlockedCountry";

const AD_SRC = "https://pl29827411.effectivecpmnetwork.com/7ac926808937b014ea818a1f0dceadf2/invoke.js";

export function NativeAd() {
  const blocked = useBlockedCountry();
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (blocked === null || blocked) return;
    if (loaded.current) return;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;
    loaded.current = true;

    const s = document.createElement("script");
    s.src = AD_SRC;
    s.async = true;
    s.dataset.cfasync = "false";
    containerRef.current?.appendChild(s);
  }, [blocked]);

  if (blocked === null) return null;

  return (
    <div ref={containerRef} className="flex min-h-[90px] w-full items-center justify-center">
      <div id="container-7ac926808937b014ea818a1f0dceadf2" />
    </div>
  );
}

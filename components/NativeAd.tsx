"use client";

import { useEffect, useRef } from "react";

const AD_CONTAINER_ID = "container-7ac926808937b014ea818a1f0dceadf2";
const AD_SRC = "https://pl29827411.effectivecpmnetwork.com/7ac926808937b014ea818a1f0dceadf2/invoke.js";

let scriptLoaded = false;

export function NativeAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;
    initialized.current = true;

    if (scriptLoaded) return;
    scriptLoaded = true;

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = AD_SRC;
    containerRef.current?.appendChild(script);
  }, []);

  return (
    <div ref={containerRef} className="flex min-h-[180px] w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4">
      <div id={AD_CONTAINER_ID} className="w-full" />
    </div>
  );
}

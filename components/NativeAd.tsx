"use client";

import { useEffect, useRef } from "react";
import { useBlockedCountry } from "@/lib/useBlockedCountry";

const AD_SRC = "https://pl29827411.effectivecpmnetwork.com/7ac926808937b014ea818a1f0dceadf2/invoke.js";

export function NativeAd() {
  const blocked = useBlockedCountry();
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (blocked === null || blocked) return;
    if (initialized.current) return;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;
    initialized.current = true;

    const f = document.createElement("iframe");
    f.setAttribute("sandbox", "allow-scripts");
    f.style.cssText = "border:0;overflow:hidden;display:block;width:100%;min-height:180px";
    containerRef.current?.appendChild(f);

    const html = `<!DOCTYPE html><html><head><script data-cfasync="false" src="${AD_SRC}" async><\/script></head><body style="margin:0;padding:0;overflow:hidden"><div id="container-7ac926808937b014ea818a1f0dceadf2"></div></body></html>`;
    const doc = f.contentDocument;
    if (doc) { doc.open(); doc.write(html); doc.close(); }
  }, [blocked]);

  if (blocked === null) return null;

  return (
    <div ref={containerRef} className="flex min-h-[180px] w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4" />
  );
}

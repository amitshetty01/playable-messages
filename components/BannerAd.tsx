"use client";

import { useEffect, useRef } from "react";

const AD_KEY = "0b5011ee65a3dd233687d2fd48d23fb5";
const AD_SRC = "https://www.highperformanceformat.com/0b5011ee65a3dd233687d2fd48d23fb5/invoke.js";

let scriptLoaded = false;

export function BannerAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (scriptLoaded) return;
    scriptLoaded = true;

    const boot = document.createElement("script");
    boot.textContent = `
      window.atOptions = {
        key: "${AD_KEY}",
        format: "iframe",
        height: 250,
        width: 300,
        params: {}
      };
      var s = document.createElement("script");
      s.src = "${AD_SRC}";
      s.async = true;
      document.currentScript.parentNode.appendChild(s);
    `;
    containerRef.current?.appendChild(boot);
  }, []);

  return (
    <div ref={containerRef} className="flex justify-center" />
  );
}

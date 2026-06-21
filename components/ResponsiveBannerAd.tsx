"use client";

import { useEffect, useRef, useState } from "react";

const MOBILE_KEY = "e3c30deb4664de4d59b562ebcbde57cd";
const MOBILE_SRC = "https://www.highperformanceformat.com/e3c30deb4664de4d59b562ebcbde57cd/invoke.js";
const DESKTOP_KEY = "4325688d299d71bc93ad520c92ef88c0";
const DESKTOP_SRC = "https://www.highperformanceformat.com/4325688d299d71bc93ad520c92ef88c0/invoke.js";

let scriptLoaded = false;

export function ResponsiveBannerAd() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    if (isDesktop === null || initialized.current || scriptLoaded) return;
    initialized.current = true;
    scriptLoaded = true;

    const src = isDesktop ? DESKTOP_SRC : MOBILE_SRC;

    const boot = document.createElement("script");
    boot.textContent = `
      window.atOptions = {
        key: "${isDesktop ? DESKTOP_KEY : MOBILE_KEY}",
        format: "iframe",
        height: ${isDesktop ? 90 : 50},
        width: ${isDesktop ? 728 : 320},
        params: {}
      };
      var s = document.createElement("script");
      s.src = "${src}";
      s.async = true;
      document.currentScript.parentNode.appendChild(s);
    `;
    containerRef.current?.appendChild(boot);
  }, [isDesktop]);

  if (isDesktop === null) return null;

  return (
    <div ref={containerRef} className="flex justify-center bg-white/[0.02] py-2" />
  );
}

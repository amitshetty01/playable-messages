"use client";

import { useEffect, useRef } from "react";
import { enqueueBannerAd } from "@/lib/adLoader";
import { useBlockedCountry } from "@/lib/useBlockedCountry";

const AD_KEYS = {
  square: {
    key: "0b5011ee65a3dd233687d2fd48d23fb5",
    src: "https://www.highperformanceformat.com/0b5011ee65a3dd233687d2fd48d23fb5/invoke.js",
  },
  rectangle: {
    key: "4325688d299d71bc93ad520c92ef88c0",
    src: "https://www.highperformanceformat.com/4325688d299d71bc93ad520c92ef88c0/invoke.js",
    mobileKey: "e3c30deb4664de4d59b562ebcbde57cd",
    mobileSrc: "https://www.highperformanceformat.com/e3c30deb4664de4d59b562ebcbde57cd/invoke.js",
  },
};

type AdType = "square" | "rectangle";

export function AdsterraAd({ type, className = "" }: { type: AdType; className?: string }) {
  const blocked = useBlockedCountry();
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (blocked === null || blocked) return;
    if (loaded.current || !ref.current) return;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;
    loaded.current = true;

    if (type === "rectangle") {
      const isDesktop = window.innerWidth >= 768;
      const cfg = AD_KEYS.rectangle;
      const key = isDesktop ? cfg.key : cfg.mobileKey;
      const src = isDesktop ? cfg.src : cfg.mobileSrc;
      const height = isDesktop ? 90 : 50;
      const width = isDesktop ? 728 : 320;
      enqueueBannerAd(key, src, height, width, ref.current);
    } else {
      const cfg = AD_KEYS.square;
      enqueueBannerAd(cfg.key, cfg.src, 250, 300, ref.current);
    }
  }, [type, blocked]);

  if (blocked === null) return null;

  return <div ref={ref} className={`flex justify-center ${className}`} />;
}

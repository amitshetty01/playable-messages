"use client";

import { useEffect, useRef, useState } from "react";
import { enqueueBannerAd } from "@/lib/adLoader";

const MOBILE_KEY = "e3c30deb4664de4d59b562ebcbde57cd";
const MOBILE_SRC = "https://www.highperformanceformat.com/e3c30deb4664de4d59b562ebcbde57cd/invoke.js";
const DESKTOP_KEY = "4325688d299d71bc93ad520c92ef88c0";
const DESKTOP_SRC = "https://www.highperformanceformat.com/4325688d299d71bc93ad520c92ef88c0/invoke.js";

export function ResponsiveBannerAd() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    if (isDesktop === null || loaded.current || !containerRef.current) return;
    loaded.current = true;
    const key = isDesktop ? DESKTOP_KEY : MOBILE_KEY;
    const src = isDesktop ? DESKTOP_SRC : MOBILE_SRC;
    const height = isDesktop ? 90 : 50;
    const width = isDesktop ? 728 : 320;
    enqueueBannerAd(key, src, height, width, containerRef.current);
  }, [isDesktop]);

  if (isDesktop === null) return null;

  return (
    <div ref={containerRef} className="flex justify-center bg-white/[0.02] py-2" />
  );
}

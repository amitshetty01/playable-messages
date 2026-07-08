"use client";

import { useEffect, useRef, useState } from "react";

type QRCodeDisplayProps = {
  url: string;
  size?: number;
};

export function QRCodeDisplay({ url, size = 140 }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function generate() {
      try {
        const QRCode = (await import("qrcode")).default;
        if (cancelled || !canvasRef.current) return;
        await QRCode.toCanvas(canvasRef.current, url, {
          width: size,
          margin: 2,
          color: {
            dark: "#f6b1c9",
            light: "transparent",
          },
        });
        if (!cancelled) setLoaded(true);
      } catch {
        // QR generation failed silently
      }
    }
    generate();
    return () => { cancelled = true; };
  }, [url, size]);

  return (
    <div className="relative inline-flex flex-col items-center gap-2">
      <div className="rounded-2xl bg-white p-3 shadow-lg">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="block"
          style={{ width: size, height: size }}
        />
      </div>
      {loaded && (
        <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
          Scan to open
        </p>
      )}
    </div>
  );
}

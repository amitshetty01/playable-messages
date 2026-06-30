"use client";

import { useEffect, useState } from "react";
import { OurMemoriesViewer } from "@/components/our-memories/OurMemoriesViewer";
import { MemoryDrawer } from "@/components/our-memories/MemoryDrawer";
import { encodeData, decodeData } from "@/lib/our-memories/types";
import type { OurMemoriesData } from "@/lib/our-memories/types";
import { defaultData } from "@/lib/our-memories/defaultData";

export default function OurMemoriesPage() {
  const [data, setData] = useState<OurMemoriesData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) { setError(true); return; }
    const decoded = decodeData(hash);
    if (decoded) setData(decoded);
    else setError(true);
  }, []);

  const handleSave = (d: OurMemoriesData) => {
    setData(d);
    const encoded = encodeData(d);
    const url = `${window.location.origin}/our-memories#${encoded}`;
    window.history.replaceState(null, "", `#${encoded}`);
    navigator.clipboard.writeText(url);
    setDrawerOpen(false);
  };

  const startFresh = () => {
    const d = defaultData;
    const encoded = encodeData(d);
    const url = `${window.location.origin}/our-memories#${encoded}`;
    window.location.href = url;
  };

  if (error) {
    return (
      <div style={{ background: "#faf5f0", color: "#3d2c2c" }} className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="text-6xl">♥</span>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>No memories found</h1>
        <p className="text-sm" style={{ color: "#8c7a7a" }}>This link doesn&apos;t contain any memory data.</p>
        <div className="flex gap-4">
          <button onClick={startFresh} className="rounded-full px-8 py-3 font-semibold text-white shadow-lg transition hover:scale-105" style={{ background: "#d4899e" }}>
            Create Your Own ♥
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#faf5f0" }}>
        <div className="h-10 w-10 animate-spin rounded-full border-4" style={{ borderColor: "#d4899e44", borderTopColor: "#d4899e" }} />
      </div>
    );
  }

  return (
    <div className="relative">
      <OurMemoriesViewer data={data} />

      {/* Customize button — always visible */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition hover:scale-110"
        style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(201,168,124,0.3)" }}
        title="Customize"
      >
        <svg className="h-5 w-5" style={{ color: "#8c7a7a" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Share button */}
      <button
        onClick={() => {
          const encoded = encodeData(data);
          const url = `${window.location.origin}/our-memories#${encoded}`;
          navigator.clipboard.writeText(url);
        }}
        className="fixed right-4 bottom-4 z-30 flex h-10 w-10 items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition hover:scale-110"
        style={{ background: "#d4899e", border: "1px solid rgba(255,255,255,0.3)" }}
        title="Copy share link"
      >
        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
        </svg>
      </button>

      {/* Drawer */}
      {drawerOpen && (
        <MemoryDrawer data={data} onSave={handleSave} onClose={() => setDrawerOpen(false)} />
      )}
    </div>
  );
}

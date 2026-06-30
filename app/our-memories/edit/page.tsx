"use client";

import { useState, useCallback } from "react";
import { MemoryEditor } from "@/components/our-memories/MemoryEditor";
import { OurMemoriesViewer } from "@/components/our-memories/OurMemoriesViewer";
import { encodeData } from "@/lib/our-memories/types";
import type { OurMemoriesData } from "@/lib/our-memories/types";

export default function EditPage() {
  const [generated, setGenerated] = useState<OurMemoriesData | null>(null);
  const [shareUrl, setShareUrl] = useState("");

  const handleGenerate = useCallback((data: OurMemoriesData) => {
    setGenerated(data);
    const encoded = encodeData(data);
    const url = `${window.location.origin}/our-memories#${encoded}`;
    setShareUrl(url);
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard! Share it with your special someone ❤️");
  };

  if (generated && shareUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-purple-50">
        {generated && <OurMemoriesViewer data={generated} />}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white/90 px-4 py-4 text-center backdrop-blur-lg">
          <div className="mx-auto flex max-w-lg flex-col items-center gap-3 sm:flex-row">
            <input type="text" readOnly value={shareUrl} className="input flex-1 truncate text-sm" onClick={(e) => e.currentTarget.select()} />
            <button onClick={copyLink} className="whitespace-nowrap rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-2.5 font-bold text-white shadow transition hover:scale-105">
              Copy Link
            </button>
            <button onClick={() => { setGenerated(null); setShareUrl(""); }} className="whitespace-nowrap rounded-full border px-6 py-2.5 text-sm font-semibold text-gray-500 transition hover:bg-gray-100">
              Edit Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-purple-50">
      <MemoryEditor onGenerate={handleGenerate} />
    </div>
  );
}

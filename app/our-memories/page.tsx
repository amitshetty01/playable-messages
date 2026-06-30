"use client";

import { useEffect, useState } from "react";
import { OurMemoriesViewer } from "@/components/our-memories/OurMemoriesViewer";
import { decodeData } from "@/lib/our-memories/types";
import type { OurMemoriesData } from "@/lib/our-memories/types";

export default function OurMemoriesPage() {
  const [data, setData] = useState<OurMemoriesData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) { setError(true); return; }
    const decoded = decodeData(hash);
    if (decoded) setData(decoded);
    else setError(true);
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-pink-50 via-rose-50 to-purple-50 px-4 text-center" style={{ color: "#374151" }}>
        <span className="text-6xl">💔</span>
        <h1 className="text-2xl font-bold text-gray-700">No memories found</h1>
        <p className="text-gray-500">This link doesn&apos;t contain any memory data.</p>
        <a href="/our-memories/edit" className="mt-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:scale-105">
          Create your own ❤️
        </a>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 via-rose-50 to-purple-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500" />
      </div>
    );
  }

  return <OurMemoriesViewer data={data} />;
}

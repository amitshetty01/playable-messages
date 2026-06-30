"use client";

import { useState, useRef, useCallback } from "react";
import type { OurMemoriesData, Memory } from "@/lib/our-memories/types";
import { generateId } from "@/lib/our-memories/types";
import { defaultData } from "@/lib/our-memories/defaultData";

type Props = {
  onGenerate: (data: OurMemoriesData) => void;
  initial?: OurMemoriesData;
};

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((res) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.readAsDataURL(file);
  });
}

export function MemoryEditor({ onGenerate, initial }: Props) {
  const [data, setData] = useState<OurMemoriesData>(() => initial ? { ...initial, memories: initial.memories.map(m => ({ ...m })), promises: initial.promises.map(p => ({ ...p })) } : JSON.parse(JSON.stringify(defaultData)));

  const update = useCallback((patch: Partial<OurMemoriesData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>, field: "heroGif" | "endingImage") => {
    const file = e.target.files?.[0];
    if (file) update({ [field]: await readFileAsDataURL(file) });
  };

  const handleMemoryImage = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await readFileAsDataURL(file);
    setData((prev) => ({ ...prev, memories: prev.memories.map((m) => (m.id === id ? { ...m, photo: url } : m)) }));
  };

  const addMemory = () => {
    setData((prev) => ({
      ...prev,
      memories: [...prev.memories, { id: generateId(), photo: "", title: "New Memory", description: "Add a description..." }],
    }));
  };

  const removeMemory = (id: string) => {
    setData((prev) => ({ ...prev, memories: prev.memories.filter((m) => m.id !== id) }));
  };

  const moveMemory = useCallback((from: number, to: number) => {
    setData((prev) => {
      const arr = [...prev.memories];
      const [removed] = arr.splice(from, 1);
      arr.splice(to, 0, removed);
      return { ...prev, memories: arr };
    });
  }, []);

  const addPromise = () => {
    setData((prev) => ({
      ...prev,
      promises: [...prev.promises, { id: generateId(), text: "New promise..." }],
    }));
  };

  const removePromise = (id: string) => {
    setData((prev) => ({ ...prev, promises: prev.promises.filter((p) => p.id !== id) }));
  };

  const movePromise = useCallback((from: number, to: number) => {
    setData((prev) => {
      const arr = [...prev.promises];
      const [removed] = arr.splice(from, 1);
      arr.splice(to, 0, removed);
      return { ...prev, promises: arr };
    });
  }, []);

  const [dragIdx, setDragIdx] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-10 pb-32">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Edit Your Memories</h1>
        <p className="mt-2 text-gray-500">Fill in each section below, then generate your shareable link.</p>
      </div>

      {/* ─── HERO ─── */}
      <Section title="Hero">
        <Field label="Heading">
          <input type="text" value={data.heroHeading} onChange={(e) => update({ heroHeading: e.target.value })} className="input" />
        </Field>
        <Field label="Subheading">
          <textarea value={data.heroSubheading} onChange={(e) => update({ heroSubheading: e.target.value })} rows={3} className="input" />
        </Field>
        <Field label="Hero GIF / Image">
          <input type="file" accept="image/*" onChange={(e) => handleImage(e, "heroGif")} className="text-sm text-gray-500" />
          {data.heroGif && <img src={data.heroGif} alt="" className="mt-2 h-24 w-24 rounded-lg object-cover" />}
        </Field>
      </Section>

      {/* ─── MEMORIES ─── */}
      <Section title={`Memories (${data.memories.length}/15)`}>
        <p className="mb-4 text-sm text-gray-400">Drag handles to reorder. You need at least 2 memories.</p>
        <div className="space-y-4">
          {data.memories.map((m, i) => (
            <MemoryCard
              key={m.id}
              memory={m}
              index={i}
              total={data.memories.length}
              dragIdx={dragIdx}
              onDragStart={setDragIdx}
              onDrop={(from, to) => { moveMemory(from, to); setDragIdx(null); }}
              onChange={(patch) => {
                setData((prev) => ({
                  ...prev,
                  memories: prev.memories.map((mm) => (mm.id === m.id ? { ...mm, ...patch } : mm)),
                }));
              }}
              onImage={(e) => handleMemoryImage(e, m.id)}
              onRemove={() => removeMemory(m.id)}
            />
          ))}
        </div>
        {data.memories.length < 15 && (
          <button onClick={addMemory} className="mt-4 w-full rounded-xl border-2 border-dashed border-pink-200 py-4 text-sm font-semibold text-pink-400 transition hover:border-pink-300 hover:bg-pink-50">
            + Add Memory
          </button>
        )}
      </Section>

      {/* ─── QUOTE ─── */}
      <Section title="Memory Quote">
        <Field label="Quote">
          <textarea value={data.quote} onChange={(e) => update({ quote: e.target.value })} rows={3} className="input" />
        </Field>
      </Section>

      {/* ─── PROMISES ─── */}
      <Section title={`Promises (${data.promises.length})`}>
        <p className="mb-4 text-sm text-gray-400">Drag handles to reorder.</p>
        <div className="space-y-3">
          {data.promises.map((p, i) => (
            <PromiseCard
              key={p.id}
              promise={p}
              index={i}
              dragIdx={dragIdx}
              onDragStart={setDragIdx}
              onDrop={(from, to) => { movePromise(from, to); setDragIdx(null); }}
              onChange={(val) => {
                setData((prev) => ({
                  ...prev,
                  promises: prev.promises.map((pp) => (pp.id === p.id ? { ...pp, text: val } : pp)),
                }));
              }}
              onRemove={() => removePromise(p.id)}
            />
          ))}
        </div>
        <button onClick={addPromise} className="mt-3 w-full rounded-xl border-2 border-dashed border-pink-200 py-3 text-sm font-semibold text-pink-400 transition hover:border-pink-300 hover:bg-pink-50">
          + Add Promise
        </button>
      </Section>

      {/* ─── FINAL MESSAGE ─── */}
      <Section title="Final Message">
        <Field label="Message">
          <textarea value={data.finalMessage} onChange={(e) => update({ finalMessage: e.target.value })} rows={4} className="input" />
        </Field>
        <Field label="Signature">
          <input type="text" value={data.signature} onChange={(e) => update({ signature: e.target.value })} className="input" />
        </Field>
        <Field label="Ending Image / GIF">
          <input type="file" accept="image/*" onChange={(e) => handleImage(e, "endingImage")} className="text-sm text-gray-500" />
          {data.endingImage && <img src={data.endingImage} alt="" className="mt-2 h-24 w-24 rounded-lg object-cover" />}
        </Field>
      </Section>

      {/* ─── THEME ─── */}
      <Section title="Theme">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Background">
            <select value={data.theme.background} onChange={(e) => update({ theme: { ...data.theme, background: e.target.value } })} className="input">
              <option value="from-pink-50 via-rose-50 to-purple-50">Pastel Pink</option>
              <option value="from-blue-50 via-indigo-50 to-purple-50">Pastel Blue</option>
              <option value="from-amber-50 via-orange-50 to-rose-50">Warm Sunset</option>
              <option value="from-emerald-50 via-teal-50 to-cyan-50">Fresh Mint</option>
              <option value="from-gray-50 via-slate-50 to-zinc-50">Neutral</option>
            </select>
          </Field>
          <Field label="Accent Color">
            <input type="color" value={data.theme.accent} onChange={(e) => update({ theme: { ...data.theme, accent: e.target.value } })} className="h-10 w-full cursor-pointer rounded-lg border" />
          </Field>
          <Field label="Heart Color">
            <input type="color" value={data.theme.heartColor} onChange={(e) => update({ theme: { ...data.theme, heartColor: e.target.value } })} className="h-10 w-full cursor-pointer rounded-lg border" />
          </Field>
          <Field label="Font">
            <select value={data.theme.font} onChange={(e) => update({ theme: { ...data.theme, font: e.target.value } })} className="input">
              <option value="serif">Serif (Georgia)</option>
              <option value="sans">Sans (Nunito)</option>
              <option value="display">Display (Fraunces)</option>
            </select>
          </Field>
          <Field label="Music URL (optional)">
            <input type="text" value={data.theme.musicUrl} onChange={(e) => update({ theme: { ...data.theme, musicUrl: e.target.value } })} placeholder="https://..." className="input" />
          </Field>
        </div>
      </Section>

      {/* ─── GENERATE ─── */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white/80 py-4 text-center backdrop-blur-lg">
        <button
          onClick={() => {
            if (data.memories.length < 2) { alert("Please add at least 2 memories."); return; }
            onGenerate(data);
          }}
          className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-10 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
        >
          Generate Shareable Link ✨
        </button>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-pink-100 bg-white/60 p-6 shadow-sm backdrop-blur-sm">
      <h2 className="mb-6 text-xl font-bold text-gray-700">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-sm font-semibold text-gray-500">{label}</span>
      {children}
    </label>
  );
}

function MemoryCard({
  memory, index, total, dragIdx, onDragStart, onDrop, onChange, onImage, onRemove,
}: {
  memory: Memory;
  index: number;
  total: number;
  dragIdx: number | null;
  onDragStart: (i: number | null) => void;
  onDrop: (from: number, to: number) => void;
  onChange: (patch: Partial<Memory>) => void;
  onImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => { e.preventDefault(); if (dragIdx !== null && dragIdx !== index) onDrop(dragIdx, index); }}
      onDragEnd={() => onDragStart(null)}
      className={`flex items-start gap-4 rounded-xl border bg-white p-4 shadow-sm transition ${dragIdx === index ? "opacity-40" : ""}`}
    >
      <span className="mt-1 cursor-grab text-gray-300 hover:text-gray-500" title="Drag to reorder">⠿</span>
      {memory.photo ? (
        <img src={memory.photo} alt="" className="h-20 w-20 flex-shrink-0 rounded-lg object-cover" />
      ) : (
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-pink-50 text-2xl text-pink-300">📷</div>
      )}
      <div className="min-w-0 flex-1 space-y-2">
        <input type="text" value={memory.title} onChange={(e) => onChange({ title: e.target.value })} className="input w-full text-sm font-bold" placeholder="Title" />
        <textarea value={memory.description} onChange={(e) => onChange({ description: e.target.value })} rows={2} className="input w-full text-sm" placeholder="Description" />
        <label className="cursor-pointer text-xs font-medium text-pink-400 hover:text-pink-500">
          Change photo
          <input type="file" accept="image/*" onChange={onImage} className="hidden" />
        </label>
      </div>
      {total > 2 && (
        <button onClick={onRemove} className="mt-1 flex-shrink-0 text-lg text-gray-300 hover:text-red-400" title="Remove">✕</button>
      )}
    </div>
  );
}

function PromiseCard({
  promise, index, dragIdx, onDragStart, onDrop, onChange, onRemove,
}: {
  promise: { id: string; text: string };
  index: number;
  dragIdx: number | null;
  onDragStart: (i: number | null) => void;
  onDrop: (from: number, to: number) => void;
  onChange: (val: string) => void;
  onRemove: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => { e.preventDefault(); if (dragIdx !== null && dragIdx !== index) onDrop(dragIdx, index); }}
      onDragEnd={() => onDragStart(null)}
      className={`flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm transition ${dragIdx === index ? "opacity-40" : ""}`}
    >
      <span className="cursor-grab text-gray-300 hover:text-gray-500" title="Drag to reorder">⠿</span>
      <input type="text" value={promise.text} onChange={(e) => onChange(e.target.value)} className="input flex-1 text-sm" />
      <button onClick={onRemove} className="flex-shrink-0 text-lg text-gray-300 hover:text-red-400" title="Remove">✕</button>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import type { OurMemoriesData, Memory } from "@/lib/our-memories/types";
import { generateId, THEME_PRESETS } from "@/lib/our-memories/types";

type Props = {
  data: OurMemoriesData;
  onSave: (data: OurMemoriesData) => void;
  onClose: () => void;
};

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((res) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.readAsDataURL(file);
  });
}

export function MemoryDrawer({ data: initial, onSave, onClose }: Props) {
  const [d, setD] = useState<OurMemoriesData>(() => ({
    ...initial,
    memories: initial.memories.map((m) => ({ ...m })),
    promises: initial.promises.map((p) => ({ ...p })),
  }));

  const set = (patch: Partial<OurMemoriesData>) => setD((prev) => ({ ...prev, ...patch }));

  /* ─── Image handlers ─── */
  const handleHeroImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) set({ heroGif: await readFileAsDataURL(f) });
  };
  const handleEndingImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) set({ endingImage: await readFileAsDataURL(f) });
  };
  const handleMemoryImg = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await readFileAsDataURL(f);
    setD((prev) => ({ ...prev, memories: prev.memories.map((m) => (m.id === id ? { ...m, photo: url } : m)) }));
  };

  /* ─── Memory CRUD ─── */
  const addMemory = () => {
    if (d.memories.length >= 15) return;
    setD((prev) => ({
      ...prev,
      memories: [...prev.memories, { id: generateId(), photo: "", title: "New Memory", caption: "Add a caption..." }],
    }));
  };
  const removeMemory = (id: string) => {
    if (d.memories.length <= 2) return;
    setD((prev) => ({ ...prev, memories: prev.memories.filter((m) => m.id !== id) }));
  };
  const moveMemory = (from: number, to: number) => {
    setD((prev) => {
      const arr = [...prev.memories];
      const [r] = arr.splice(from, 1);
      arr.splice(to, 0, r);
      return { ...prev, memories: arr };
    });
  };

  /* ─── Promise CRUD ─── */
  const addPromise = () => setD((prev) => ({ ...prev, promises: [...prev.promises, { id: generateId(), text: "New promise..." }] }));
  const removePromise = (id: string) => setD((prev) => ({ ...prev, promises: prev.promises.filter((p) => p.id !== id) }));
  const movePromise = (from: number, to: number) => {
    setD((prev) => {
      const arr = [...prev.promises];
      const [r] = arr.splice(from, 1);
      arr.splice(to, 0, r);
      return { ...prev, promises: arr };
    });
  };

  /* ─── Drag state ─── */
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative z-10 h-full w-full max-w-lg overflow-y-auto bg-white shadow-2xl" style={{ animation: "slideIn 0.3s ease-out" }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4 bg-white/95 backdrop-blur-sm" style={{ borderColor: "rgba(201, 168, 124, 0.2)" }}>
          <h2 className="text-lg font-bold" style={{ color: "#3d2c2c", fontFamily: "'Fraunces', Georgia, serif" }}>Customize</h2>
          <div className="flex items-center gap-3">
            <button onClick={() => onSave(d)} className="rounded-full bg-[#d4899e] px-5 py-2 text-sm font-bold text-white transition hover:opacity-90">
              Save & Close
            </button>
            <button onClick={onClose} className="text-lg text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>

        <div className="space-y-8 px-6 py-8 pb-32">

          {/* ─── HERO ─── */}
          <Section label="Hero">
            <Field label="Photo / GIF">
              <input type="file" accept="image/*" onChange={handleHeroImg} className="text-sm text-gray-500" />
              {d.heroGif && <img src={d.heroGif} alt="" className="mt-2 h-20 w-20 rounded-lg object-cover" />}
            </Field>
            <Field label="Heading">
              <input type="text" value={d.heroHeading} onChange={(e) => set({ heroHeading: e.target.value })} className="input" />
            </Field>
            <Field label="Subtext">
              <textarea value={d.heroSubtext} onChange={(e) => set({ heroSubtext: e.target.value })} rows={3} className="input" />
            </Field>
            <Field label="Intro Text">
              <textarea value={d.introText} onChange={(e) => set({ introText: e.target.value })} rows={2} className="input" />
            </Field>
          </Section>

          {/* ─── MEMORIES ─── */}
          <Section label={`Memories (${d.memories.length}/15)`}>
            <p className="mb-3 text-xs text-gray-400">Drag handles to reorder. Min 2, max 15.</p>
            {d.memories.map((m, i) => (
              <DraggableCard
                key={m.id}
                index={i}
                dragIdx={dragIdx}
                onDragStart={(idx) => { setDragIdx(idx); }}
                onDrop={(from, to) => { moveMemory(from, to); setDragIdx(null); }}
                onDragEnd={() => { setDragIdx(null); }}
                onRemove={() => removeMemory(m.id)}
                canRemove={d.memories.length > 2}
              >
                {m.photo ? (
                  <img src={m.photo} alt="" className="h-16 w-16 flex-shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-[#d4899e]20 text-lg text-[#d4899e]">♥</div>
                )}
                <div className="min-w-0 flex-1 space-y-1.5">
                  <input type="text" value={m.title} onChange={(e) => setD((prev) => ({ ...prev, memories: prev.memories.map((mm) => (mm.id === m.id ? { ...mm, title: e.target.value } : mm)) }))} className="input w-full text-sm font-bold" placeholder="Title" />
                  <textarea value={m.caption} onChange={(e) => setD((prev) => ({ ...prev, memories: prev.memories.map((mm) => (mm.id === m.id ? { ...mm, caption: e.target.value } : mm)) }))} rows={2} className="input w-full text-sm" placeholder="Caption" />
                  <label className="cursor-pointer text-xs font-medium text-[#d4899e]">
                    Change photo
                    <input type="file" accept="image/*" onChange={(e) => handleMemoryImg(e, m.id)} className="hidden" />
                  </label>
                </div>
              </DraggableCard>
            ))}
            {d.memories.length < 15 && (
              <button onClick={addMemory} className="mt-3 w-full rounded-xl border-2 border-dashed py-3 text-sm font-semibold transition" style={{ borderColor: "#d4899e44", color: "#d4899e" }}>+ Add Memory</button>
            )}
          </Section>

          {/* ─── SEPARATORS ─── */}
          <Section label="Text Separators (between memories)">
            {d.separators.map((s, i) => (
              <input key={i} type="text" value={s} onChange={(e) => setD((prev) => ({ ...prev, separators: prev.separators.map((x, j) => (j === i ? e.target.value : x)) }))} className="input mb-2 w-full text-sm" />
            ))}
          </Section>

          {/* ─── QUOTE ─── */}
          <Section label="Memory Quote">
            <textarea value={d.quote} onChange={(e) => set({ quote: e.target.value })} rows={3} className="input" />
          </Section>

          {/* ─── PROMISES ─── */}
          <Section label={`Promises (${d.promises.length})`}>
            {d.promises.map((p, i) => (
              <DraggableCard
                key={p.id}
                index={i}
                dragIdx={dragIdx}
                onDragStart={(idx) => { setDragIdx(idx); }}
                onDrop={(from, to) => { movePromise(from, to); setDragIdx(null); }}
                onDragEnd={() => { setDragIdx(null); }}
                onRemove={() => removePromise(p.id)}
                canRemove={true}
              >
                <input type="text" value={p.text} onChange={(e) => setD((prev) => ({ ...prev, promises: prev.promises.map((pp) => (pp.id === p.id ? { ...pp, text: e.target.value } : pp)) }))} className="input flex-1 text-sm" />
              </DraggableCard>
            ))}
            <button onClick={addPromise} className="mt-3 w-full rounded-xl border-2 border-dashed py-3 text-sm font-semibold transition" style={{ borderColor: "#d4899e44", color: "#d4899e" }}>+ Add Promise</button>
          </Section>

          {/* ─── FINAL MESSAGE ─── */}
          <Section label="Final Message">
            <Field label="Message">
              <textarea value={d.finalMessage} onChange={(e) => set({ finalMessage: e.target.value })} rows={4} className="input" />
            </Field>
            <Field label="Signature">
              <input type="text" value={d.signature} onChange={(e) => set({ signature: e.target.value })} className="input" />
            </Field>
            <Field label="Ending Image / GIF">
              <input type="file" accept="image/*" onChange={handleEndingImg} className="text-sm text-gray-500" />
              {d.endingImage && <img src={d.endingImage} alt="" className="mt-2 h-20 w-20 rounded-lg object-cover" />}
            </Field>
          </Section>

          {/* ─── THEME ─── */}
          <Section label="Theme">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {THEME_PRESETS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => set({ themeId: t.id })}
                  className="rounded-xl border-2 p-3 text-center transition hover:shadow-md"
                  style={{
                    background: t.bg,
                    borderColor: d.themeId === t.id ? t.accent : "transparent",
                    boxShadow: d.themeId === t.id ? `0 0 0 2px ${t.accent}44` : "none",
                  }}
                >
                  <div className="mx-auto mb-1.5 h-4 w-4 rounded-full" style={{ background: t.accent }} />
                  <span className="text-[10px] font-semibold" style={{ color: t.textPrimary }}>{t.name}</span>
                </button>
              ))}
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider" style={{ color: "#8c7a7a" }}>{label}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-xs font-semibold" style={{ color: "#8c7a7a" }}>{label}</span>
      {children}
    </label>
  );
}

function DraggableCard({
  index, dragIdx, onDragStart, onDrop, onDragEnd, onRemove, canRemove, children,
}: {
  index: number; dragIdx: number | null;
  onDragStart: (i: number) => void; onDrop: (from: number, to: number) => void; onDragEnd: () => void;
  onRemove: () => void; canRemove: boolean; children: React.ReactNode;
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => { e.preventDefault(); if (dragIdx !== null && dragIdx !== index) onDrop(dragIdx, index); }}
      onDragEnd={onDragEnd}
      className={`mb-3 flex items-start gap-3 rounded-xl border p-3 transition ${dragIdx === index ? "opacity-30" : ""}`}
      style={{ borderColor: "rgba(201, 168, 124, 0.2)", background: "#faf5f0" }}
    >
      <span className="mt-1 cursor-grab text-gray-300 hover:text-gray-500 text-lg" title="Drag to reorder">⠿</span>
      {children}
      {canRemove && (
        <button onClick={onRemove} className="mt-1 flex-shrink-0 text-gray-300 hover:text-red-400" title="Remove">✕</button>
      )}
    </div>
  );
}

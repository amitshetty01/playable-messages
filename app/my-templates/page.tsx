"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getUserTemplates, deleteUserTemplate } from "@/lib/user-templates";
import type { UserTemplate } from "@/lib/user-templates";

export default function MyTemplatesPage() {
  const [templates, setTemplates] = useState<UserTemplate[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(() => {
    setTemplates(getUserTemplates());
    setLoaded(true);
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleDelete(id: string) {
    deleteUserTemplate(id);
    load();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Your Library</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">My Templates</h1>
        <p className="mt-5 max-w-2xl text-white/70">
          Templates you have created are saved to this device. Edit, delete, or use them to create a new message.
        </p>
      </section>

      {loaded && templates.length === 0 && (
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center">
          <p className="text-2xl">🧩</p>
          <h2 className="mt-3 text-xl font-bold text-white">No templates yet</h2>
          <p className="mt-2 text-sm text-white/60">Create your first custom template to get started.</p>
          <Link href="/template-builder" className="premium-button mt-6 inline-flex">
            Create Template
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {templates.map((t) => {
          return (
            <div
              key={t.id}
              className="glass rounded-2xl border border-white/10 p-5 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-extrabold text-white truncate">{t.title}</h3>
                  {t.description && (
                    <p className="mt-1 text-sm text-white/60 line-clamp-2">{t.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[10px] font-bold text-white/50">
                      {t.steps.length} step{t.steps.length !== 1 ? 's' : ''}
                    </span>
                    <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[10px] font-bold text-white/50">
                      {t.tone}
                    </span>
                    <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[10px] font-bold text-white/50">
                      {t.theme}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/create/user-${t.id}`}
                  className="premium-button text-xs"
                >
                  Use for Creation
                </Link>
                <Link
                  href={`/template-builder?id=${t.id}`}
                  className="ghost-button text-xs"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
                  className="ghost-button text-xs text-rose-300/70 hover:text-rose-300"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {templates.length > 0 && (
        <div className="text-center">
          <Link href="/template-builder" className="premium-button">
            Create New Template
          </Link>
        </div>
      )}
    </div>
  );
}

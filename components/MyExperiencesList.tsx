"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getMyExperiences, removeExperience, type SavedExperience } from "@/lib/my-experiences";

export function MyExperiencesList() {
  const [experiences, setExperiences] = useState<SavedExperience[]>([]);

  const refresh = useCallback(() => setExperiences(getMyExperiences()), []);

  useEffect(() => { refresh(); }, [refresh]);

  function handleDelete(id: string) {
    removeExperience(id);
    refresh();
  }

  if (experiences.length === 0) {
    return (
      <div className="glass rounded-[2rem] p-8 text-center">
        <p className="text-lg font-bold text-white/70">No messages yet</p>
        <p className="mt-2 text-sm text-white/50">Messages you create will appear here automatically.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs font-bold tracking-[0.08em] text-white/50">{experiences.length} message{experiences.length !== 1 ? "s" : ""}</p>
      {experiences.map((exp) => (
        <div key={exp.id} className="glass flex items-center gap-4 rounded-[1.5rem] p-4 sm:gap-5 sm:p-5">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blush via-violet to-neon text-sm font-extrabold text-white">
            {exp.creatorName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-extrabold">{exp.receiverName} &mdash; {exp.templateTitle}</p>
            <p className="mt-0.5 text-sm text-white/50">{new Date(exp.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
            {exp.reaction ? <p className="mt-1 text-xs text-white/40">They reacted {exp.reaction}</p> : null}
          </div>
          <div className="flex shrink-0 gap-2">
            <Link className="ghost-button !min-h-10 !px-4 !py-2 text-sm" href={`/experience/${exp.id}`}>Open</Link>
            <Link className="ghost-button !min-h-10 !px-4 !py-2 text-sm" href={`/edit/${exp.id}`}>Edit</Link>
            <Link className="ghost-button !min-h-10 !px-4 !py-2 text-sm text-blush" href={`/my-experiences/${exp.id}`}>Journey</Link>
            <button className="ghost-button !min-h-10 !px-4 !py-2 text-sm text-rose-300" type="button" onClick={() => handleDelete(exp.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

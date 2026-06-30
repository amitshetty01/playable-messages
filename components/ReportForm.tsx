"use client";

import { useState } from "react";

export function ReportForm({ initialExperience }: { initialExperience: string }) {
  const [experience, setExperience] = useState(initialExperience);
  const [reason, setReason] = useState("Harassment or pressure");
  const [details, setDetails] = useState("");
  const [prepared, setPrepared] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = encodeURIComponent("Craft Your Message abuse report");
    const body = encodeURIComponent(`Experience: ${experience}\nReason: ${reason}\n\nDetails:\n${details}`);
    window.location.href = `mailto:abuse@craftyourmessage.com?subject=${subject}&body=${body}`;
    setPrepared(true);
  }

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(300px,0.5fr)]">
      <form className="glass min-w-0 rounded-[2rem] p-5 sm:p-8" onSubmit={submit}>
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Safety</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">Report abuse</h1>
        <p className="mt-5 text-white/70">Report experiences that contain harassment, threats, impersonation, private information, pressure, manipulation, or other harmful content.</p>
        <div className="mt-8 grid gap-5">
          <label className="grid gap-2"><span className="text-sm font-bold text-white/90">Experience ID or link</span><input className="input" value={experience} onChange={(event) => setExperience(event.target.value)} required /></label>
          <label className="grid gap-2"><span className="text-sm font-bold text-white/90">Reason</span><select className="input" value={reason} onChange={(event) => setReason(event.target.value)}><option className="bg-ink">Harassment or pressure</option><option className="bg-ink">Threats or safety concern</option><option className="bg-ink">Private information</option><option className="bg-ink">Impersonation</option><option className="bg-ink">Manipulation</option><option className="bg-ink">Other abuse</option></select></label>
          <label className="grid gap-2"><span className="text-sm font-bold text-white/90">Details</span><textarea className="input min-h-40 py-3" value={details} onChange={(event) => setDetails(event.target.value)} required /></label>
        </div>
        <button className="premium-button mt-7" type="submit">Prepare report</button>
        {prepared ? <p className="mt-4 text-sm font-bold text-white/60">Opening your email app with the report details.</p> : null}
      </form>
      <aside className="glass h-fit rounded-[2rem] p-5 sm:p-6">
        <p className="text-xs font-bold tracking-[0.08em] text-rose-100">Important</p>
        <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.03em]">If someone is in immediate danger, contact local emergency services.</h2>
        <p className="mt-4 text-white/70">A production deployment should connect this page to a moderation inbox or abuse handling endpoint. The MVP does not require login.</p>
      </aside>
    </div>
  );
}

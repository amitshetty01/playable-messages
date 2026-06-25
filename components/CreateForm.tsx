"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useUndoRedo } from "@/lib/useUndoRedo";
import { DynamicFieldEditor } from "@/components/DynamicFieldEditor";
import { ExperiencePlayer } from "@/components/ExperiencePlayer";
import { defaultCustomMessages, defaultFinalMessage, getTemplateCategory } from "@/lib/data";
import { saveExperience } from "@/lib/my-experiences";
import { compressImage } from "@/lib/compressImage";
import { Spinner } from "@/components/Spinner";
import { getTemplateConfig } from "@/lib/template-configs";
import type { ExperienceRecord, RelationshipTag, Template, ThemeName, Tone } from "@/lib/types";
import { RELATIONSHIP_TAGS, ANON_TONES } from "@/lib/types";

const EXPIRY_OPTIONS = [
  { label: "Never expires", value: "" },
  { label: "1 hour", value: "1h" },
  { label: "24 hours", value: "24h" },
  { label: "7 days", value: "7d" }
] as const;

const DRAFT_KEY = "craft-message-draft";

function computeExpiresAt(option: string): string | undefined {
  if (!option) return undefined;
  const ms = option === "1h" ? 3600000 : option === "24h" ? 86400000 : option === "7d" ? 604800000 : 0;
  if (!ms) return undefined;
  return new Date(Date.now() + ms).toISOString();
}

export function CreateForm({ templates, initialTemplate, existingExperience }: { templates: Template[]; initialTemplate: Template; existingExperience?: ExperienceRecord }) {
  const isEdit = Boolean(existingExperience);
  const getDefaultCategory = (t: Template) => getTemplateCategory(t).slug;
  const isAnonTone = ANON_TONES.includes(existingExperience?.tone ?? initialTemplate.tone);
  const initialFormState = {
    templateId: existingExperience?.templateId ?? initialTemplate.id,
    category: existingExperience?.category ?? getDefaultCategory(initialTemplate),
    creatorName: existingExperience?.creatorName ?? "Someone",
    receiverName: existingExperience?.receiverName ?? "You",
    relationshipTag: (existingExperience?.relationshipTag ?? "") as RelationshipTag,
    showCreatorName: existingExperience?.showCreatorName ?? !isAnonTone,
    tone: existingExperience?.tone ?? initialTemplate.tone as Tone,
    theme: existingExperience?.theme ?? initialTemplate.theme as ThemeName,
    landingText: existingExperience?.customMessages.landingText ?? initialTemplate.hook,
    buttonText: existingExperience?.customMessages.buttonText ?? "Begin",
    steps: (existingExperience?.customMessages.steps ?? defaultCustomMessages.steps).join("\n"),
    finalMessage: existingExperience?.finalMessage ?? defaultFinalMessage,
    ctaMessage: existingExperience?.customMessages.ctaMessage ?? defaultCustomMessages.ctaMessage,
    sceneTitles: (existingExperience?.customMessages.sceneTitles ?? []).join("\n"),
    expiryOption: "",
    customPassword: existingExperience?.customPassword ?? "",
    passwordQuestion: existingExperience?.passwordQuestion ?? "Only one person has the permission to go inside.",
    passwordAnswer: existingExperience?.passwordAnswer ?? "",
    togetherSince: existingExperience?.togetherSince ?? "",
  };

  const { state: form, setState: setForm, undo, redo, canUndo, canRedo } = useUndoRedo(initialFormState);

  const template = templates.find((item) => item.id === form.templateId) ?? initialTemplate;
  const templateConfig = getTemplateConfig(form.templateId);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [draftToast, setDraftToast] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(existingExperience?.images ?? []);
  const [templateData, setTemplateData] = useState<Record<string, any>>(() => {
    if (!existingExperience) return {};
    const td: Record<string, any> = {};
    if (existingExperience.images?.length) td.photos = existingExperience.images;
    if (existingExperience.customPassword) td.password = existingExperience.customPassword;
    if (existingExperience.passwordQuestion) td.passwordQuestion = existingExperience.passwordQuestion;
    if (existingExperience.togetherSince) td.startDate = existingExperience.togetherSince;
    return td;
  });
  const draftTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) { e.preventDefault(); redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") { e.preventDefault(); redo(); }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const saveDraft = useCallback(() => {
    if (isEdit) return;
    const draft = { ...form, images, templateData };
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch { /* storage full */ }
  }, [form, images, templateData, isEdit]);

  useEffect(() => {
    if (isEdit) return;
    draftTimer.current = setInterval(saveDraft, 30000);
    return () => { if (draftTimer.current) clearInterval(draftTimer.current); };
  }, [saveDraft, isEdit]);

  useEffect(() => {
    if (isEdit) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Record<string, string>;
      if (!draft.templateId) return;
      const restored = {
        templateId: draft.templateId ?? initialFormState.templateId,
        category: draft.category ?? initialFormState.category,
        creatorName: draft.creatorName ?? initialFormState.creatorName,
        receiverName: draft.receiverName ?? initialFormState.receiverName,
        tone: (draft.tone ?? initialFormState.tone) as Tone,
        theme: (draft.theme ?? initialFormState.theme) as ThemeName,
        landingText: draft.landingText ?? initialFormState.landingText,
        buttonText: draft.buttonText ?? initialFormState.buttonText,
        steps: draft.steps ?? initialFormState.steps,
        finalMessage: draft.finalMessage ?? initialFormState.finalMessage,
        ctaMessage: draft.ctaMessage ?? initialFormState.ctaMessage,
        sceneTitles: draft.sceneTitles ?? initialFormState.sceneTitles,
        expiryOption: draft.expiryOption ?? initialFormState.expiryOption,
        relationshipTag: (draft as any).relationshipTag ?? initialFormState.relationshipTag,
        showCreatorName: (draft as any).showCreatorName ?? initialFormState.showCreatorName,
        customPassword: (draft as any).customPassword ?? initialFormState.customPassword,
        passwordQuestion: (draft as any).passwordQuestion ?? initialFormState.passwordQuestion,
        passwordAnswer: (draft as any).passwordAnswer ?? initialFormState.passwordAnswer,
        togetherSince: (draft as any).togetherSince ?? initialFormState.togetherSince,
      };
      setForm(restored);
      if (Array.isArray(draft.images)) setImages(draft.images);
      if ((draft as any).templateData) setTemplateData((draft as any).templateData);
      setDraftToast(true);
      setTimeout(() => setDraftToast(false), 4000);
    } catch { /* invalid draft */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const experience = useMemo<ExperienceRecord & { expiresAt?: string }>(() => ({
    id: isEdit ? existingExperience!.id : "preview",
    templateId: template.id,
    category: form.category,
    creatorName: form.creatorName,
    receiverName: form.receiverName,
    relationshipTag: form.relationshipTag,
    showCreatorName: form.showCreatorName,
    tone: form.tone,
    theme: form.theme,
    customMessages: {
      landingText: form.landingText,
      buttonText: form.buttonText,
      steps: form.steps.split("\n").map((step: string) => step.trim()).filter(Boolean),
      ctaMessage: form.ctaMessage,
      sceneTitles: form.sceneTitles.split("\n").map((t: string) => t.trim()).filter(Boolean),
    },
    finalMessage: form.finalMessage,
    createdAt: existingExperience?.createdAt ?? new Date().toISOString(),
    expiresAt: computeExpiresAt(form.expiryOption),
    analytics: existingExperience?.analytics ?? {
      opened: 0,
      completed: 0,
      selectedChoices: {},
      finalCtaClicks: 0,
      templateUsed: template.id
    },
    images: templateData.photos || templateData.images || templateData.photo
      ? (Array.isArray(templateData.photos || templateData.images || templateData.photo)
        ? (templateData.photos || templateData.images || templateData.photo)
        : [templateData.photos || templateData.images || templateData.photo])
      : images,
    customPassword: templateData.password || form.customPassword || undefined,
    passwordQuestion: templateData.passwordQuestion || form.passwordQuestion || undefined,
    passwordAnswer: templateData.passwordAnswer || form.passwordAnswer || undefined,
    togetherSince: templateData.startDate || templateData.togetherSince || form.togetherSince || undefined,
    templateData,

  }), [form, existingExperience, isEdit, template.id, images, templateData]);

  const handleTemplateFieldChange = useCallback((key: string, value: any) => {
    setTemplateData((prev) => ({ ...prev, [key]: value }));
    if (key === "photos" || key === "images" || key === "photo") {
      setImages(Array.isArray(value) ? value : value ? [value] : []);
    }
  }, []);

  async function submit() {
    setIsSubmitting(true);
    setError("");
    setFieldErrors({});
    const errors: Record<string, string> = {};
    if (template.status !== "full") { setError("This template is not available yet."); setIsSubmitting(false); return; }
    if (!form.finalMessage.trim()) errors.finalMessage = "Your message can't be empty.";
    if (!form.receiverName.trim()) errors.receiverName = "Who's receiving this?";
    if (!form.creatorName.trim()) errors.creatorName = "Who's sending this?";
    const stepCount = form.steps.split("\n").filter(Boolean).length;
    if (!stepCount) errors.steps = "Add at least one step message.";
    for (const field of templateConfig.editableFields) {
      if (field.required) {
        const val = templateData[field.key];
        if (!val || (typeof val === "string" && !val.trim()) || (Array.isArray(val) && val.length === 0)) {
          errors[field.key] = `${field.label} is required.`;
        }
      }
    }
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setIsSubmitting(false);
      return;
    }
    try {
      const url = isEdit ? `/api/experiences/${existingExperience!.id}` : "/api/experiences";
      const method = isEdit ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(experience)
      });
      const json = await response.json() as { id?: string; error?: string };
      if (!response.ok || !json.id) {
        setError(json.error || "Could not generate the link. Check Supabase configuration.");
        return;
      }
      clearDraft();
      const targetId = json.id;
      saveExperience({ id: targetId, templateTitle: template.title, receiverName: form.receiverName, createdAt: new Date().toISOString(), creatorName: form.creatorName });
      setCreatedId(targetId);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong while generating the link.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  }

  if (createdId) {
    const shareUrl = `${window.location.origin}/experience/${createdId}`;
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="animate-section-fade rounded-[2rem] bg-gradient-to-b from-white/10 to-white/5 p-10 backdrop-blur-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/20 text-3xl">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-300"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 className="display-title text-4xl font-bold text-white">Your experience is ready!</h2>
          <p className="mt-3 text-white/60">Share this link:</p>
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-2">
            <input readOnly value={shareUrl} className="flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none" onClick={(e) => (e.target as HTMLInputElement).select()} />
            <button
              type="button"
              className="shrink-0 rounded-xl bg-white/15 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/25 active:scale-95"
              onClick={() => { navigator.clipboard.writeText(shareUrl); }}
            >
              Copy
            </button>
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <button type="button" className="ghost-button" onClick={() => window.open(shareUrl, "_blank")}>Preview it</button>
            <button type="button" className="premium-button" onClick={() => setCreatedId(null)}>Create another</button>
          </div>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="text-xs font-bold tracking-[0.08em] text-white/50">Preview</span>
          <button className="ghost-button text-sm" type="button" onClick={() => setShowPreview(false)}>
            Back to editing
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <ExperiencePlayer experience={experience} mode="preview" template={template} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <section className="glass min-w-0 rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Customization</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">{isEdit ? "Edit your version." : "Create your own version."}</h1>
        <p className="mt-4 max-w-2xl text-white/70">{isEdit ? "Update and save changes." : "Customize the words, pick a template, then generate a shareable link."}</p>

        <div className="mt-8 space-y-8">
          <Field label="Pick a template" full>
              <select value={form.templateId} onChange={(event) => {
              const next = templates.find((item) => item.id === event.target.value) ?? template;
              setForm((prev) => ({
                ...prev, templateId: next.id, category: getTemplateCategory(next).slug, tone: next.tone, theme: next.theme, landingText: next.hook, buttonText: "Begin",
                customPassword: "", passwordQuestion: "Only one person has the permission to go inside.", passwordAnswer: "", togetherSince: "",
              }));
              setImages([]);
              setTemplateData({});
            }} className="input">
              {templates.filter((item) => item.status === "full").sort((a, b) => a.title.localeCompare(b.title)).map((item) => <option className="bg-ink" key={item.id} value={item.id}>{item.title}</option>)}
            </select>
            <p className="mt-2 text-sm leading-5 text-white/50">{template.description}</p>
          </Field>

          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.08em] text-white/40">👤 People</p>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Your name (who's sending this?)">
                <input value={form.creatorName} onChange={(event) => { setFieldErrors((prev) => { const next = { ...prev }; delete next.creatorName; return next; }); setForm((prev) => ({ ...prev, creatorName: event.target.value })); }} maxLength={80} className={`input ${fieldErrors.creatorName ? "border-rose-400/50" : ""}`} placeholder="Your name" />
                {fieldErrors.creatorName && <p className="mt-1 text-xs font-bold text-rose-300">{fieldErrors.creatorName}</p>}
              </Field>
              <Field label="Their name (who's receiving?)">
                <input value={form.receiverName} onChange={(event) => { setFieldErrors((prev) => { const next = { ...prev }; delete next.receiverName; return next; }); setForm((prev) => ({ ...prev, receiverName: event.target.value })); }} maxLength={80} className={`input ${fieldErrors.receiverName ? "border-rose-400/50" : ""}`} placeholder="Their name" />
                {fieldErrors.receiverName && <p className="mt-1 text-xs font-bold text-rose-300">{fieldErrors.receiverName}</p>}
              </Field>
            </div>
            <div className="mt-4">
              <p className="mb-2 text-sm font-bold text-white/70">How do you know them? (optional)</p>
              <div className="flex flex-wrap gap-2">
                {RELATIONSHIP_TAGS.map((r) => (
                  <button key={r.value} type="button" onClick={() => setForm((prev) => ({ ...prev, relationshipTag: r.value }))}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                      form.relationshipTag === r.value ? "border-white/40 bg-white/15 text-white" : "border-white/10 bg-white/[0.04] text-white/50 hover:border-white/20 hover:text-white/70"
                    }`}>
                    {r.emoji} {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button type="button" onClick={() => setForm((prev) => ({ ...prev, showCreatorName: !prev.showCreatorName }))}
                className={`h-5 w-9 rounded-full transition-colors ${form.showCreatorName ? "bg-neon" : "bg-white/20"}`}>
                <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${form.showCreatorName ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
              </button>
              <span className="text-sm text-white/60">Reveal who sent this</span>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.08em] text-white/40">💬 Message</p>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="What's your real message?" full>
                <textarea value={form.finalMessage} onChange={(event) => { setFieldErrors((prev) => { const next = { ...prev }; delete next.finalMessage; return next; }); setForm((prev) => ({ ...prev, finalMessage: event.target.value })); }} maxLength={520} className={`input min-h-28 py-3 ${fieldErrors.finalMessage ? "border-rose-400/50" : ""}`} placeholder="I've been meaning to tell you..." aria-label="Your real message" />
                {fieldErrors.finalMessage && <p className="mt-1 text-xs font-bold text-rose-300">{fieldErrors.finalMessage}</p>}
              </Field>
              <Field label="Build-up steps (one per line)" full>
                <textarea value={form.steps} onChange={(event) => { setFieldErrors((prev) => { const next = { ...prev }; delete next.steps; return next; }); setForm((prev) => ({ ...prev, steps: event.target.value })); }} className={`input min-h-44 py-3 ${fieldErrors.steps ? "border-rose-400/50" : ""}`} placeholder="You mean a lot to me...&#10;I don't say it enough...&#10;So here's something special..." />
                {fieldErrors.steps && <p className="mt-1 text-xs font-bold text-rose-300">{fieldErrors.steps}</p>}
              </Field>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.08em] text-white/40">🔘 Buttons &amp; Labels</p>
            <div className="grid gap-5 md:grid-cols-3">
              <Field label="Hook / landing text">
                <textarea value={form.landingText} onChange={(event) => setForm((prev) => ({ ...prev, landingText: event.target.value }))} maxLength={180} className="input min-h-24 py-3" placeholder="I made something for you..." />
              </Field>
              <Field label="Button label">
                <input value={form.buttonText} onChange={(event) => setForm((prev) => ({ ...prev, buttonText: event.target.value }))} maxLength={48} className="input" placeholder="Begin" />
              </Field>
              <Field label="Ending CTA text">
                <input value={form.ctaMessage} onChange={(event) => setForm((prev) => ({ ...prev, ctaMessage: event.target.value }))} maxLength={140} className="input" placeholder="Create your own" />
              </Field>
            </div>
          </div>
        </div>

        {templateConfig.editableFields.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.08em] text-white/40">✨ Template Settings</p>
            <DynamicFieldEditor
              fields={templateConfig.editableFields}
              values={templateData}
              onChange={handleTemplateFieldChange}
              errors={fieldErrors}
            />
          </div>
        )}

        <div className="mt-6">
          <p className="mb-3 text-xs font-bold tracking-[0.08em] text-white/40">🔗 Link settings</p>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Link expiry">
              <select value={form.expiryOption} onChange={(event) => setForm((prev) => ({ ...prev, expiryOption: event.target.value }))} className="input">
                {EXPIRY_OPTIONS.map((opt) => <option className="bg-ink" key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </Field>
          </div>
        </div>

        {error ? <p className="mt-5 rounded-2xl border border-rose-200/30 bg-rose-300/10 p-4 text-sm font-bold text-rose-100" role="alert">{error}</p> : null}

        {draftToast ? <p className="mt-4 animate-section-fade rounded-2xl border border-emerald-200/30 bg-emerald-300/10 p-4 text-sm font-bold text-emerald-100" role="status">Draft restored — your unsaved work is back.</p> : null}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button className="ghost-button" type="button" onClick={() => setShowPreview(true)}>Preview</button>
          <button className="premium-button" type="button" disabled={isSubmitting} onClick={submit}>{isSubmitting ? <span className="inline-flex items-center gap-2"><Spinner className="h-4 w-4" /> Saving...</span> : isEdit ? "Save changes" : "Generate link"}</button>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={full ? "grid min-w-0 gap-2 md:col-span-2" : "grid min-w-0 gap-2"}><span className="text-sm font-bold text-white/90">{label}</span>{children}</label>;
}

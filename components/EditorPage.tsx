"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  Copy,
  Eye,
  Film,
  Image as ImageIcon,
  Loader2,
  Lock,
  Redo2,
  Share2,
  Sparkles,
  Type,
  Undo2,
  Upload,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ExperiencePlayer } from "@/components/ExperiencePlayer";
import { getCapability } from "@/lib/ai-template-capabilities";
import { getTemplateConfig } from "@/lib/template-configs";
import { absoluteUrl } from "@/lib/utils";
import type { ExperienceRecord, Template } from "@/lib/types";

type EditorStep = "scene" | "reveal" | "media" | "security";

type TimelineStep = {
  id: EditorStep;
  icon: LucideIcon;
  label: string;
};

type SaveStatus = "saved" | "unsaved" | "saving" | "error";

const MAX_PHOTOS = 15;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Unable to read image."));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject(new Error("Unable to read image."));
    };
    reader.readAsDataURL(file);
  });

const ASSIST_TONE_MAP: Record<string, string> = {
  Romantic: "Romantic",
  Funny: "Funny",
  Sorry: "Sorry",
  Savage: "Funny",
  Emotional: "Emotional",
  Mystery: "Premium",
  Birthday: "Cute",
  Friendship: "Cute",
};

const THEME_GRADIENTS: Record<string, string> = {
  "Dark Romantic": "from-purple-950 via-indigo-950 to-black",
  "Soft Pastel": "from-pink-200 via-purple-200 to-white",
  "Minimal Black": "from-neutral-800 via-neutral-950 to-black",
  "Cute Pink": "from-pink-400 via-rose-400 to-pink-600",
  "Neon Glitch": "from-cyan-500 via-fuchsia-500 to-black",
  "Cinematic Purple": "from-purple-950 via-fuchsia-950 to-black",
  "Clean White": "from-gray-100 via-white to-gray-200",
};

const THEME_OPTIONS: string[] = [
  "Dark Romantic",
  "Soft Pastel",
  "Minimal Black",
  "Cute Pink",
  "Neon Glitch",
  "Cinematic Purple",
  "Clean White",
];

export default function EditorPage({
  experience,
  template,
}: {
  experience: ExperienceRecord;
  template: Template;
}) {
  const router = useRouter();
  const templateConfig = useMemo(
    () => getTemplateConfig(template.id),
    [template.id],
  );
  const capability = useMemo(
    () => getCapability(template.id),
    [template.id],
  );

  const editableFields = useMemo(
    () => new Set(templateConfig.editableFields.map((f) => f.key)),
    [templateConfig],
  );

  const supportsPhotos = useMemo(
    () => capability?.supportsPhotos ?? editableFields.has("photos") ?? editableFields.has("images"),
    [capability, editableFields],
  );

  const supportsPassword = useMemo(
    () => capability?.supportsPassword ?? editableFields.has("password"),
    [capability, editableFields],
  );

  const availableTabs = useMemo((): EditorStep[] => {
    const tabs: EditorStep[] = ["scene", "reveal"];
    if (supportsPhotos) tabs.push("media");
    if (supportsPassword) tabs.push("security");
    return tabs;
  }, [supportsPhotos, supportsPassword]);

  const firstTab = availableTabs[0] ?? "scene";
  const [activeStep, setActiveStep] = useState<EditorStep>(firstTab);
  const [theme, setTheme] = useState<string>(experience.theme);
  const [messageText, setMessageText] = useState(experience.finalMessage);
  const [photos, setPhotos] = useState<string[]>(experience.images ?? []);
  const [hasPassword, setHasPassword] = useState(
    Boolean(experience.customPassword) || Boolean(experience.lockType),
  );
  const [password, setPassword] = useState("");
  const [startDate, setStartDate] = useState(experience.togetherSince ?? "");

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [history, setHistory] = useState<string[]>([experience.finalMessage]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const saveTimerRef = useRef<number | null>(null);
  const saveControllerRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const copyTimerRef = useRef<number | null>(null);
  const isDirtyRef = useRef(false);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const commitMessage = useCallback(
    (value: string) => {
      if (history[historyIndex] === value) return;
      const next = history.slice(0, historyIndex + 1);
      next.push(value);
      setHistory(next);
      setHistoryIndex(next.length - 1);
      setMessageText(value);
      isDirtyRef.current = true;
      setSaveStatus("unsaved");
    },
    [history, historyIndex],
  );

  const handleUndo = useCallback(() => {
    if (!canUndo) return;
    const idx = historyIndex - 1;
    setHistoryIndex(idx);
    setMessageText(history[idx]);
  }, [canUndo, historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (!canRedo) return;
    const idx = historyIndex + 1;
    setHistoryIndex(idx);
    setMessageText(history[idx]);
  }, [canRedo, historyIndex, history]);

  const doSave = useCallback(async () => {
    if (saveControllerRef.current) {
      saveControllerRef.current.abort();
    }
    const controller = new AbortController();
    saveControllerRef.current = controller;

    setSaveStatus("saving");

    const body: Record<string, unknown> = {
      id: experience.id,
      templateId: template.id,
      category: experience.category,
      creatorName: experience.creatorName,
      receiverName: experience.receiverName,
      relationshipTag: experience.relationshipTag,
      showCreatorName: experience.showCreatorName,
      tone: experience.tone,
      theme,
      customMessages: experience.customMessages,
      finalMessage: messageText,
      images: photos,
    };

    if (supportsPassword) {
      if (password) {
        body.customPassword = password;
      }
      if (startDate) {
        body.togetherSince = startDate;
      }
    }

    try {
      const res = await fetch(`/api/experiences/${experience.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Save failed");
      }

      if (!controller.signal.aborted) {
        setSaveStatus("saved");
        isDirtyRef.current = false;
      }
    } catch (err) {
      if (
        err instanceof DOMException &&
        err.name === "AbortError"
      )
        return;
      if (!controller.signal.aborted) {
        setSaveStatus("error");
      }
    }
  }, [
    experience,
    template,
    theme,
    messageText,
    photos,
    supportsPassword,
    password,
    startDate,
  ]);

  const scheduleSave = useCallback(
    (immediate = false) => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
      if (immediate) {
        doSave();
      } else {
        saveTimerRef.current = window.setTimeout(doSave, 2000);
      }
    },
    [doSave],
  );

  useEffect(() => {
    return () => {
      if (saveTimerRef.current)
        window.clearTimeout(saveTimerRef.current);
    };
  }, []);

  const flushSave = useCallback(async () => {
    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }
    if (isDirtyRef.current || saveStatus === "unsaved") {
      await doSave();
    }
  }, [doSave, saveStatus]);

  const handleAiRewrite = async () => {
    if (!messageText.trim()) {
      setError("Write a message before asking AI to improve it.");
      return;
    }
    setError(null);
    setIsRewriting(true);

    try {
      const assistTone = ASSIST_TONE_MAP[experience.tone] ?? "Emotional";
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "message_assist",
          roughPoints: messageText,
          tone: assistTone,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.data?.rewritten) {
        throw new Error(json.error ?? "AI rewrite failed");
      }

      commitMessage(json.data.rewritten);
    } catch {
      setError("The message could not be rewritten. Please try again.");
    } finally {
      setIsRewriting(false);
    }
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setError(null);
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const slots = MAX_PHOTOS - photos.length;
    if (slots <= 0) {
      setError(`You can upload up to ${MAX_PHOTOS} photos.`);
      event.target.value = "";
      return;
    }

    const batch = files.slice(0, slots);
    const invalid = batch.find((f) => !f.type.startsWith("image/"));
    if (invalid) {
      setError(`"${invalid.name}" is not a supported image file.`);
      event.target.value = "";
      return;
    }

    const oversized = batch.find((f) => f.size > MAX_PHOTO_SIZE);
    if (oversized) {
      setError(
        `"${oversized.name}" is larger than the 5 MB limit.`,
      );
      event.target.value = "";
      return;
    }

    try {
      const uploaded = await Promise.all(
        batch.map((f) => readFileAsDataUrl(f)),
      );
      setPhotos((prev) => [...prev, ...uploaded]);
      isDirtyRef.current = true;
      setSaveStatus("unsaved");

      if (files.length > slots) {
        setError(
          `Only ${slots} more photo${slots === 1 ? "" : "s"} could be added.`,
        );
      }
    } catch {
      setError("One or more photos could not be loaded.");
    } finally {
      event.target.value = "";
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    isDirtyRef.current = true;
    setSaveStatus("unsaved");
  };

  const validateBeforeSave = useCallback((): boolean => {
    if (!messageText.trim()) {
      setActiveStep("reveal");
      setError("Add a final message before saving.");
      return false;
    }
    if (hasPassword && !password && !experience.customPassword) {
      setActiveStep("security");
      setError("Password protection requires a PIN.");
      return false;
    }
    if (hasPassword && password && !/^\d{4}$/.test(password)) {
      setActiveStep("security");
      setError("Password must be a four-digit PIN.");
      return false;
    }
    return true;
  }, [messageText, hasPassword, password, experience.customPassword]);

  const handlePublish = async () => {
    if (!validateBeforeSave()) return;
    setError(null);
    setIsPublishing(true);

    try {
      await flushSave();

      const url = absoluteUrl(`/experience/${experience.id}`);
      setShareUrl(url);
      setIsPublished(true);
    } catch {
      setError(
        "Your experience could not be published. Please try again.",
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const fallbackCopy = (text: string) => {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.focus();
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    if (!ok) throw new Error("Copy failed");
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        fallbackCopy(shareUrl);
      }
      setCopied(true);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(
        () => setCopied(false),
        2000,
      );
    } catch {
      setError("Could not copy the link.");
    }
  };

  useEffect(() => {
    const open = isPreviewOpen || isPublished;
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (isPreviewOpen) setIsPreviewOpen(false);
      else if (isPublished) setIsPublished(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isPreviewOpen, isPublished]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key === "z" &&
        e.shiftKey
      ) {
        e.preventDefault();
        handleRedo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        handleRedo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        scheduleSave(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleUndo, handleRedo, scheduleSave]);

  const saveLabel = useMemo(() => {
    switch (saveStatus) {
      case "saving":
        return "Saving...";
      case "unsaved":
        return "Unsaved";
      case "error":
        return "Save failed";
      default:
        return "Saved";
    }
  }, [saveStatus]);

  const previewTemplate = useMemo(
    () => ({ ...template, fullscreen: false }),
    [template],
  );

  const previewExperience = useMemo<ExperienceRecord>(
    () => ({
      ...experience,
      theme: theme as ExperienceRecord["theme"],
      finalMessage: messageText,
      images: photos,
      customPassword: hasPassword ? (password || experience.customPassword) : undefined,
      togetherSince: startDate || experience.togetherSince,
    }),
    [experience, theme, messageText, photos, hasPassword, password, startDate],
  );

  const timelineSteps = useMemo((): TimelineStep[] => {
    const map: Record<EditorStep, TimelineStep> = {
      scene: { id: "scene", icon: Film, label: "Scene" },
      reveal: { id: "reveal", icon: Type, label: "Reveal" },
      media: { id: "media", icon: ImageIcon, label: "Photos" },
      security: { id: "security", icon: Lock, label: "Lock" },
    };
    return availableTabs.map((id) => map[id]);
  }, [availableTabs]);

  return (
    <main className="flex min-h-screen w-full flex-col bg-[#08080A] text-white">
      {/* TOP NAV */}
      <header className="sticky top-0 z-30 grid min-h-16 grid-cols-[1fr_auto_1fr] items-center border-b border-white/5 bg-[#08080A]/85 px-3 py-3 backdrop-blur-xl sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (isDirtyRef.current) {
                if (
                  !window.confirm(
                    "You have unsaved changes. Leave anyway?",
                  )
                )
                  return;
              }
              router.back();
            }}
            className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
            aria-label="Exit editor"
          >
            <ChevronLeft size={17} />
            <span className="hidden sm:inline">Exit</span>
          </button>
          <div className="hidden truncate font-serif text-base italic text-white/50 md:block">
            {template.title}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            className="rounded-lg p-2 text-white/50 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            aria-label="Undo"
          >
            <Undo2 size={17} />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={!canRedo}
            className="rounded-lg p-2 text-white/50 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            aria-label="Redo"
          >
            <Redo2 size={17} />
          </button>

          <div className="mx-1 h-6 w-px bg-white/10" />

          <span className="hidden text-[10px] uppercase tracking-wider text-white/30 sm:inline">
            {saveLabel}
          </span>

          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
            aria-label="Preview"
          >
            <Eye size={17} />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scheduleSave(true)}
            disabled={saveStatus === "saving"}
            className="hidden items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/50 transition hover:bg-white/5 hover:text-white sm:flex disabled:opacity-40"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:px-5"
          >
            {isPublishing ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span className="hidden sm:inline">Saving</span>
              </>
            ) : (
              <>
                <Share2 size={15} />
                <span className="hidden sm:inline">Publish</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ERROR BANNER */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-red-400/20 bg-red-400/10"
            role="alert"
          >
            <div className="mx-auto flex max-w-4xl items-center justify-center gap-2 px-4 py-2 text-sm text-red-200">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="ml-2 rounded p-1 text-red-100/60 transition hover:bg-white/5 hover:text-red-100"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN */}
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* PHONE PREVIEW */}
        <section className="relative flex min-h-[50vh] flex-1 items-center justify-center overflow-hidden bg-black/20 p-4 sm:p-8 md:min-h-0">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_55%)]" />

          <motion.div className="relative h-[540px] w-[270px] max-w-full overflow-hidden rounded-[2.6rem] border-[8px] border-[#1b1b1e] bg-black shadow-[0_35px_90px_rgba(0,0,0,0.65)] sm:h-[580px] sm:w-[290px]">
            <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black/90" />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden">
              <div className="flex h-full w-full items-center justify-center">
                <ExperiencePlayer
                  template={previewTemplate}
                  experience={previewExperience}
                  mode="preview"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* EDITOR CONTROLS */}
        <aside className="flex max-h-[50vh] flex-col border-t border-white/5 bg-[#0C0C0F] md:max-h-none md:w-[430px] md:border-l md:border-t-0">
          <div className="sticky top-0 z-10 flex shrink-0 border-b border-white/5 bg-[#0C0C0F]/95 backdrop-blur-xl">
            {timelineSteps.map((step) => {
              const StepIcon = step.icon;
              const isActive = activeStep === step.id;
              return (
                <button
                  type="button"
                  key={step.id}
                  onClick={() => {
                    setError(null);
                    setActiveStep(step.id);
                  }}
                  className={`relative flex flex-1 flex-col items-center gap-1 px-1 py-4 text-[10px] uppercase tracking-wider transition ${
                    isActive
                      ? "text-white"
                      : "text-white/30 hover:bg-white/[0.025] hover:text-white/65"
                  }`}
                  aria-label={`Edit ${step.label}`}
                  aria-pressed={isActive}
                >
                  <StepIcon size={18} />
                  <span>{step.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-editor-tab"
                      className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-white"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-6"
              >
                {activeStep === "scene" && (
                  <SceneTab
                    theme={theme}
                    setTheme={(t) => {
                      setTheme(t);
                      isDirtyRef.current = true;
                      setSaveStatus("unsaved");
                    }}
                  />
                )}
                {activeStep === "reveal" && (
                  <RevealTab
                    messageText={messageText}
                    setMessageText={(val) => {
                      setMessageText(val);
                      isDirtyRef.current = true;
                      setSaveStatus("unsaved");
                    }}
                    onBlur={commitMessage}
                    isRewriting={isRewriting}
                    onAiRewrite={handleAiRewrite}
                  />
                )}
                {activeStep === "media" && (
                  <MediaTab
                    photos={photos}
                    maxPhotos={MAX_PHOTOS}
                    fileInputRef={fileInputRef}
                    onUpload={handlePhotoUpload}
                    onRemove={handleRemovePhoto}
                  />
                )}
                {activeStep === "security" && (
                  <SecurityTab
                    hasPassword={hasPassword}
                    setHasPassword={(v) => {
                      setHasPassword(v);
                      isDirtyRef.current = true;
                      setSaveStatus("unsaved");
                    }}
                    password={password}
                    setPassword={(v) => {
                      setPassword(v);
                      isDirtyRef.current = true;
                      setSaveStatus("unsaved");
                    }}
                    startDate={startDate}
                    setStartDate={(v) => {
                      setStartDate(v);
                      isDirtyRef.current = true;
                      setSaveStatus("unsaved");
                    }}
                    supportsStartDate={editableFields.has("startDate")}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </aside>
      </div>

      {/* FULLSCREEN PREVIEW MODAL */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Experience preview"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget)
                setIsPreviewOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 28,
              }}
              className="relative h-[650px] max-h-[88vh] w-[325px] max-w-[92vw] overflow-hidden rounded-[2.8rem] border-[8px] border-[#1B1B1E] bg-black shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
            >
              <div className="flex h-full w-full items-center justify-center">
                <ExperiencePlayer
                  template={previewTemplate}
                  experience={previewExperience}
                  mode="preview"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-black/35 p-2 text-white/75 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
                aria-label="Close preview"
              >
                <X size={17} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PUBLISH SUCCESS MODAL */}
      <AnimatePresence>
        {isPublished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Experience published"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 22 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 18 }}
              className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0C0C0F] p-7 text-center shadow-[0_30px_100px_rgba(0,0,0,0.6)] sm:p-8"
            >
              <button
                type="button"
                onClick={() => setIsPublished(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X size={16} />
              </button>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-400/10 ring-1 ring-green-300/20">
                <Check className="text-green-300" size={31} />
              </div>
              <h2 className="font-serif text-3xl">It&apos;s ready.</h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/45">
                Your experience is ready. Share this link with the person
                you created it for.
              </p>
              <div className="mt-7 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  aria-label="Share link"
                  className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white/75 outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.03]"
                >
                  {copied ? (
                    <>
                      <Check size={15} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setIsPublished(false)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/65 transition hover:bg-white/5 hover:text-white"
                >
                  Keep editing
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
                >
                  Back to home
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function SceneTab({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (t: string) => void;
}) {
  return (
    <>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/35">
          Scene
        </p>
        <h2 className="mt-2 font-serif text-2xl">
          Visual atmosphere
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/45">
          Choose the visual mood surrounding the experience.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {THEME_OPTIONS.map((name) => {
          const selected = theme === name;
          return (
            <button
              type="button"
              key={name}
              onClick={() => setTheme(name)}
              className={`rounded-2xl border p-3 text-left transition ${
                selected
                  ? "border-white/60 bg-white/10"
                  : "border-white/10 bg-white/[0.025] hover:border-white/25 hover:bg-white/[0.05]"
              }`}
              aria-pressed={selected}
            >
              <div
                className={`mb-3 h-20 rounded-xl bg-gradient-to-b ${THEME_GRADIENTS[name] ?? THEME_GRADIENTS["Dark Romantic"]}`}
              />
              <span className="text-sm text-white/80">{name}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function RevealTab({
  messageText,
  setMessageText,
  onBlur,
  isRewriting,
  onAiRewrite,
}: {
  messageText: string;
  setMessageText: (v: string) => void;
  onBlur: (v: string) => void;
  isRewriting: boolean;
  onAiRewrite: () => void;
}) {
  return (
    <>
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/35">
              Reveal
            </p>
            <h2 className="mt-2 font-serif text-2xl">
              The final message
            </h2>
          </div>
          <button
            type="button"
            onClick={onAiRewrite}
            disabled={isRewriting}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-purple-300/20 bg-purple-400/10 px-3 py-1.5 text-xs text-purple-200 transition hover:bg-purple-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRewriting ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Rewriting
              </>
            ) : (
              <>
                <Sparkles size={13} />
                AI Rewrite
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-white/45">
          Keep it honest. The AI can improve clarity without changing
          what you mean.
        </p>
      </div>
      <label className="sr-only" htmlFor="editor-message">
        Final message
      </label>
      <textarea
        id="editor-message"
        value={messageText}
        maxLength={1500}
        onChange={(e) => setMessageText(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
        className="min-h-[220px] w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] p-4 font-serif leading-relaxed text-white outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.06]"
        placeholder="Write what you truly want them to know..."
      />
      <div className="flex justify-between text-xs text-white/30">
        <span>Changes appear instantly in the preview.</span>
        <span>{messageText.length}/1500</span>
      </div>
    </>
  );
}

function MediaTab({
  photos,
  maxPhotos,
  fileInputRef,
  onUpload,
  onRemove,
}: {
  photos: string[];
  maxPhotos: number;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/35">
          Photos
        </p>
        <h2 className="mt-2 font-serif text-2xl">Memory photos</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/45">
          Add only the moments that help tell the story.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((src, i) => (
          <div
            key={i}
            className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Photo ${i + 1}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/35" />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute right-1.5 top-1.5 rounded-full bg-black/65 p-1.5 text-white opacity-100 transition hover:bg-red-500 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label={`Remove photo ${i + 1}`}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-white/15 bg-white/[0.02] text-white/45 transition hover:border-white/35 hover:bg-white/[0.05] hover:text-white/75"
            aria-label="Upload photos"
          >
            <Upload size={21} />
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onUpload}
      />
      <div className="flex justify-between text-xs text-white/30">
        <span>JPG, PNG or WEBP. Maximum 5 MB each.</span>
        <span>
          {photos.length}/{maxPhotos}
        </span>
      </div>
    </>
  );
}

function SecurityTab({
  hasPassword,
  setHasPassword,
  password,
  setPassword,
  startDate,
  setStartDate,
  supportsStartDate,
}: {
  hasPassword: boolean;
  setHasPassword: (v: boolean) => void;
  password: string;
  setPassword: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  supportsStartDate: boolean;
}) {
  return (
    <>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/35">
          Privacy
        </p>
        <h2 className="mt-2 font-serif text-2xl">
          Protect the reveal
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/45">
          Add a four-digit PIN only when the moment should stay
          private.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-center gap-3">
          <Lock size={18} className="text-white/55" />
          <div>
            <p className="text-sm text-white/90">
              Password protection
            </p>
            <p className="mt-0.5 text-xs text-white/35">
              Require a PIN before opening
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={hasPassword}
          aria-label="Toggle password protection"
          onClick={() => {
            setHasPassword(!hasPassword);
            if (hasPassword) setPassword("");
          }}
          className={`relative h-7 w-[52px] rounded-full transition ${
            hasPassword ? "bg-green-500" : "bg-white/15"
          }`}
        >
          <motion.span
            className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
            animate={{ left: hasPassword ? 27 : 4 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 35,
            }}
          />
        </button>
      </div>

      <AnimatePresence>
        {hasPassword && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <label
              htmlFor="editor-pin"
              className="mb-2 block text-sm text-white/55"
            >
              Four-digit PIN
            </label>
            <input
              id="editor-pin"
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              value={password}
              maxLength={4}
              onChange={(e) => {
                setPassword(e.target.value.replace(/\D/g, "").slice(0, 4));
              }}
              placeholder="••••"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center text-xl tracking-[0.7em] text-white outline-none transition placeholder:text-white/20 focus:border-white/30"
            />
            <p className="mt-2 text-xs text-white/30">
              Do not use important banking or device PINs.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {supportsStartDate && (
        <div>
          <label
            htmlFor="editor-start-date"
            className="mb-2 block text-sm text-white/55"
          >
            Together since
          </label>
          <input
            id="editor-start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none transition focus:border-white/30"
          />
        </div>
      )}
    </>
  );
}

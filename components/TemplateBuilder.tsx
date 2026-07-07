"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useRouter } from "next/navigation";
import { saveUserTemplate } from "@/lib/user-templates";
import type { UserTemplate, UserTemplateStep } from "@/lib/user-templates";
import type { Tone, ThemeName } from "@/lib/types";

const STEP_TYPES = [
  { value: 'text' as const, label: 'Text Reveal', icon: '💬' },
  { value: 'tap' as const, label: 'Tap to Continue', icon: '👆' },
  { value: 'hold' as const, label: 'Hold Button', icon: '⏳' },
  { value: 'choice' as const, label: 'Choice', icon: '🔀' },
  { value: 'scratch' as const, label: 'Scratch Card', icon: '💳' },
  { value: 'type' as const, label: 'Type Response', icon: '⌨️' },
  { value: 'game' as const, label: 'Mini Game', icon: '🎮' },
];

const TONES: { value: Tone; label: string; emoji: string }[] = [
  { value: "Romantic", label: "Romantic", emoji: "💖" },
  { value: "Funny", label: "Funny", emoji: "😂" },
  { value: "Sorry", label: "Sorry", emoji: "🥺" },
  { value: "Savage", label: "Savage", emoji: "🔥" },
  { value: "Emotional", label: "Emotional", emoji: "💗" },
  { value: "Mystery", label: "Mystery", emoji: "🔮" },
  { value: "Birthday", label: "Birthday", emoji: "🎂" },
  { value: "Friendship", label: "Friendship", emoji: "🤝" },
];

const THEMES: { value: ThemeName; gradient: string }[] = [
  { value: "Dark Romantic", gradient: "from-[#2d1b3d] to-[#1a0a2e]" },
  { value: "Soft Pastel", gradient: "from-[#fce4ec] to-[#f3e5f5]" },
  { value: "Minimal Black", gradient: "from-[#1a1a1a] to-[#0d0d0d]" },
  { value: "Cute Pink", gradient: "from-[#ffb6c1] to-[#ff69b4]" },
  { value: "Neon Glitch", gradient: "from-[#00ffcc] to-[#ff00ff]" },
  { value: "Cinematic Purple", gradient: "from-[#4a0e4e] to-[#1a0033]" },
  { value: "Clean White", gradient: "from-[#f8f9fa] to-[#e9ecef]" },
];

let stepIdCounter = 0;
function nextStepId() { return `step-${++stepIdCounter}-${Date.now()}`; }

function createEmptyStep(): UserTemplateStep {
  return {
    id: nextStepId(),
    type: 'text',
    title: '',
    body: '',
    buttonLabel: 'Continue',
  };
}

export function TemplateBuilder() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hook, setHook] = useState('');
  const [tone, setTone] = useState<Tone>('Romantic');
  const [theme, setTheme] = useState<ThemeName>('Dark Romantic');
  const [steps, setSteps] = useState<UserTemplateStep[]>([createEmptyStep()]);
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  const addStep = useCallback(() => {
    setSteps(prev => [...prev, createEmptyStep()]);
  }, []);

  const removeStep = useCallback((id: string) => {
    setSteps(prev => prev.filter(s => s.id !== id));
  }, []);

  const updateStep = useCallback((id: string, field: keyof UserTemplateStep, value: any) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, [field]: value } as UserTemplateStep : s));
  }, []);

  const moveStep = useCallback((index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= steps.length) return;
    setSteps(prev => {
      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next;
    });
  }, [steps.length]);

  const handlePublish = useCallback(() => {
    if (!title.trim() || !hook.trim()) return;
    setSaving(true);
    const template: UserTemplate = {
      id: `ut-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      title: title.trim(),
      description: description.trim(),
      hook: hook.trim(),
      tone,
      theme,
      steps: steps.map(s => ({
        ...s,
        choices: s.type === 'choice' ? (s.choices?.filter(c => c.trim()) || []) : undefined,
        buttonLabel: s.buttonLabel || 'Continue',
      })),
      createdAt: new Date().toISOString(),
      published: true,
    };
    saveUserTemplate(template);
    setSaving(false);
    setPublished(true);
  }, [title, description, hook, tone, theme, steps]);

  if (published) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[2rem] bg-gradient-to-b from-white/10 to-white/5 p-10 backdrop-blur-xl"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/20 text-3xl">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-300"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 className="display-title text-3xl font-bold text-white">Template saved!</h2>
          <p className="mt-3 text-white/60">Your custom template is ready to use.</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button type="button" onClick={() => router.push('/my-templates')} className="premium-button">
              View My Templates
            </button>
            <button type="button" onClick={() => { setPublished(false); setStep(1); setTitle(''); setDescription(''); setHook(''); setSteps([createEmptyStep()]); }} className="ghost-button">
              Create Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <section className="glass min-w-0 rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Template Builder</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">
          Design Your Template
        </h1>
        <p className="mt-4 max-w-2xl text-white/70">Create your own interactive experience template.</p>

        <div className="mt-6 mb-8">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: 'Basic Info', icon: '📝' },
              { num: 2, label: 'Add Steps', icon: '🧩' },
              { num: 3, label: 'Publish', icon: '🚀' },
            ].map(s => (
              <div key={s.num} className="flex items-center gap-2">
                <motion.button
                  type="button"
                  onClick={() => setStep(s.num)}
                  className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all ${
                    step >= s.num
                      ? 'bg-gradient-to-br from-blush to-violet text-white shadow-lg shadow-blush/30'
                      : 'border border-white/15 bg-white/[0.04] text-white/40'
                  }`}
                  animate={step >= s.num ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {step > s.num ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : s.icon}
                </motion.button>
                <span className={`hidden sm:block text-xs font-bold ${step >= s.num ? 'text-white' : 'text-white/30'}`}>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blush via-violet to-neon"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid gap-2">
                  <span className="text-sm font-bold text-white/90">Template Title</span>
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="input"
                    placeholder="e.g. Love Confession"
                    maxLength={80}
                  />
                </div>
                <div className="grid gap-2">
                  <span className="text-sm font-bold text-white/90">Description</span>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="input min-h-20 py-3"
                    placeholder="Briefly describe what this template does..."
                    maxLength={240}
                  />
                </div>
                <div className="grid gap-2">
                  <span className="text-sm font-bold text-white/90">Hook / Landing Text</span>
                  <textarea
                    value={hook}
                    onChange={e => setHook(e.target.value)}
                    className="input min-h-20 py-3"
                    placeholder="I made something for you..."
                    maxLength={180}
                  />
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold text-white/40">Tone</p>
                  <div className="flex flex-wrap gap-2">
                    {TONES.map(t => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setTone(t.value)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                          tone === t.value
                            ? 'border-white/40 bg-white/15 text-white'
                            : 'border-white/10 bg-white/[0.04] text-white/50 hover:border-white/20 hover:text-white/70'
                        }`}
                      >
                        {t.emoji} {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold text-white/40">Theme</p>
                  <div className="flex flex-wrap gap-2">
                    {THEMES.map(th => (
                      <button
                        key={th.value}
                        type="button"
                        onClick={() => setTheme(th.value)}
                        className={`relative h-8 w-8 rounded-full bg-gradient-to-br ${th.gradient} transition-all duration-200 ${
                          theme === th.value
                            ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-[#15101f] scale-110'
                            : 'opacity-50 hover:opacity-100 hover:scale-105'
                        }`}
                        title={th.value}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-[0.08em] text-white/40">
                    Steps ({steps.length})
                  </p>
                  <button type="button" onClick={addStep} className="ghost-button text-xs">
                    + Add Step
                  </button>
                </div>
                {steps.length === 0 && (
                  <p className="py-8 text-center text-sm text-white/40">
                    No steps yet. Click "Add Step" to get started.
                  </p>
                )}
                <Reorder.Group axis="y" values={steps} onReorder={setSteps} className="space-y-3">
                  <AnimatePresence initial={false}>
                    {steps.map((s, i) => (
                      <Reorder.Item
                        key={s.id}
                        value={s}
                        as="div"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          layout
                          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-white/40">Step {i + 1}</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => moveStep(i, -1)}
                                disabled={i === 0}
                                className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/50 transition-all hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => moveStep(i, 1)}
                                disabled={i === steps.length - 1}
                                className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/50 transition-all hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                onClick={() => removeStep(s.id)}
                                disabled={steps.length === 1}
                                className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-rose-300/70 transition-all hover:bg-rose-500/20 hover:text-rose-300 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <select
                                value={s.type}
                                onChange={e => updateStep(s.id, 'type', e.target.value)}
                                className="input text-sm"
                              >
                                {STEP_TYPES.map(st => (
                                  <option key={st.value} value={st.value} className="bg-ink">
                                    {st.icon} {st.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <input
                                value={s.title}
                                onChange={e => updateStep(s.id, 'title', e.target.value)}
                                className="input"
                                placeholder="Step title (optional)"
                                maxLength={60}
                              />
                            </div>
                            <div>
                              <textarea
                                value={s.body}
                                onChange={e => updateStep(s.id, 'body', e.target.value)}
                                className="input min-h-16 py-2"
                                placeholder="Step content / instructions..."
                                maxLength={300}
                              />
                            </div>
                            <div className="flex gap-3">
                              <div className="flex-1">
                                <input
                                  value={s.buttonLabel || ''}
                                  onChange={e => updateStep(s.id, 'buttonLabel', e.target.value)}
                                  className="input"
                                  placeholder="Button label (default: Continue)"
                                  maxLength={40}
                                />
                              </div>
                            </div>
                            {s.type === 'choice' && (
                              <div>
                                <p className="mb-1 text-xs font-bold text-white/40">Choices (one per line)</p>
                                <textarea
                                  value={(s.choices || []).join('\n')}
                                  onChange={e => updateStep(s.id, 'choices', e.target.value.split('\n'))}
                                  className="input min-h-20 py-2"
                                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                                />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </Reorder.Item>
                    ))}
                  </AnimatePresence>
                </Reorder.Group>
              </div>
            )}

            {step === 3 && (
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blush/20 to-violet/20 text-3xl">
                  🚀
                </div>
                <h2 className="text-2xl font-bold text-white">Ready to publish!</h2>
                <p className="mt-2 text-white/60">Review your template and save it to your collection.</p>
                {title && (
                  <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
                    <p className="text-xs font-bold text-white/30 uppercase">Preview</p>
                    <h3 className="mt-2 text-xl font-extrabold text-white">{title}</h3>
                    {description && <p className="mt-1 text-sm text-white/60">{description}</p>}
                    <p className="mt-3 text-xs text-white/40">{steps.length} step{steps.length !== 1 ? 's' : ''} · {tone} · {theme}</p>
                  </div>
                )}
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="ghost-button"
                  >
                    ← Edit Steps
                  </button>
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={!title.trim() || !hook.trim() || saving}
                    className="premium-button"
                  >
                    {saving ? 'Saving...' : 'Save Template'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="ghost-button"
          >
            ← Back
          </button>
          {step < 3 && (
            <button
              type="button"
              onClick={() => setStep(s => Math.min(3, s + 1))}
              className="premium-button"
            >
              Continue →
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

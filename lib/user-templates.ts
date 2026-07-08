import type { Template, Tone, ThemeName } from "@/lib/types";

const USER_TEMPLATES_KEY = 'craft-user-templates';

export type UserTemplateStep = {
  id: string;
  type: 'text' | 'choice' | 'tap' | 'hold' | 'scratch' | 'type' | 'game';
  title: string;
  body: string;
  buttonLabel?: string;
  choices?: string[];
};

export type UserTemplate = {
  id: string;
  title: string;
  description: string;
  hook: string;
  tone: Tone;
  theme: ThemeName;
  steps: UserTemplateStep[];
  createdAt: string;
  published: boolean;
};

export function saveUserTemplate(template: UserTemplate): void {
  try {
    const all = getUserTemplates();
    const existing = all.findIndex(t => t.id === template.id);
    if (existing >= 0) all[existing] = template;
    else all.push(template);
    localStorage.setItem(USER_TEMPLATES_KEY, JSON.stringify(all));
  } catch { /* storage unavailable */ }
}

export function getUserTemplates(): UserTemplate[] {
  try {
    const raw = localStorage.getItem(USER_TEMPLATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function deleteUserTemplate(id: string): void {
  try {
    const all = getUserTemplates().filter(t => t.id !== id);
    localStorage.setItem(USER_TEMPLATES_KEY, JSON.stringify(all));
  } catch { /* storage unavailable */ }
}

export function userTemplateToTemplate(ut: UserTemplate): Template {
  return {
    id: `user-${ut.id}`,
    slug: `user-${ut.id}`,
    title: ut.title,
    hook: ut.hook,
    categorySlugs: ['user-created'],
    bestFor: 'Custom',
    length: `${ut.steps.length} steps`,
    tone: ut.tone,
    theme: ut.theme,
    status: 'full',
    formula: [],
    description: ut.description,
  };
}

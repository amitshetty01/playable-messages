"use client";

export type Snippet = {
  id: string;
  label: string;
  text: string;
  emoji: string;
  createdAt: string;
};

const STORAGE_KEY = "craft-message-snippets";

export function getSnippets(): Snippet[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Snippet[];
  } catch {
    return [];
  }
}

export function addSnippet(label: string, text: string, emoji = "💬"): Snippet[] {
  const snippets = getSnippets();
  const newSnippet: Snippet = {
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    label: label.slice(0, 80),
    text: text.slice(0, 500),
    emoji,
    createdAt: new Date().toISOString(),
  };
  const updated = [newSnippet, ...snippets];
  saveSnippets(updated);
  return updated;
}

export function updateSnippet(id: string, updates: Partial<Pick<Snippet, "label" | "text" | "emoji">>): Snippet[] {
  const snippets = getSnippets();
  const updated = snippets.map((s) =>
    s.id === id ? { ...s, ...updates } : s
  );
  saveSnippets(updated);
  return updated;
}

export function removeSnippet(id: string): Snippet[] {
  const snippets = getSnippets();
  const updated = snippets.filter((s) => s.id !== id);
  saveSnippets(updated);
  return updated;
}

function saveSnippets(snippets: Snippet[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
  } catch {
    /* storage full */
  }
}

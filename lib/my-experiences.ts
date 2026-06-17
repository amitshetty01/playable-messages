"use client";

const STORAGE_KEY = "cym_my_experiences";

export type SavedExperience = {
  id: string;
  templateTitle: string;
  receiverName: string;
  createdAt: string;
  creatorName: string;
  reaction?: string;
};

export function getMyExperiences(): SavedExperience[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedExperience[]) : [];
  } catch {
    return [];
  }
}

export function saveExperience(exp: SavedExperience) {
  const list = getMyExperiences();
  const existing = list.findIndex((e) => e.id === exp.id);
  if (existing >= 0) {
    list[existing] = exp;
  } else {
    list.unshift(exp);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
}

export function removeExperience(id: string) {
  const list = getMyExperiences().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function clearAllExperiences() {
  localStorage.removeItem(STORAGE_KEY);
}

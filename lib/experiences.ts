import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";
import { emptyAnalytics, generateExperienceId, normalizeExperiencePayload } from "@/lib/validation";
import type { AnalyticsPayload, ExperienceAnalytics, ExperienceRecord } from "@/lib/types";

type ExperienceRow = {
  id: string;
  template_id: string;
  category: string;
  creator_name: string;
  receiver_name: string;
  tone: ExperienceRecord["tone"];
  theme: ExperienceRecord["theme"];
  custom_messages: ExperienceRecord["customMessages"];
  final_message: string;
  created_at: string;
  expires_at?: string | null;
  analytics: ExperienceAnalytics;
  images?: string[];
};

const STORE_PATH = path.join(os.tmpdir(), "playable-messages-store.json");

async function readLocalStore(): Promise<Map<string, ExperienceRow>> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    const entries = JSON.parse(raw) as [string, ExperienceRow][];
    return new Map(entries);
  } catch {
    return new Map();
  }
}

async function writeLocalStore(map: Map<string, ExperienceRow>) {
  try {
    await fs.writeFile(STORE_PATH, JSON.stringify([...map.entries()]), "utf-8");
  } catch {
    /* temp dir write failure is non-critical */
  }
}

function toRecord(row: ExperienceRow): ExperienceRecord {
  return {
    id: row.id,
    templateId: row.template_id,
    category: row.category,
    creatorName: row.creator_name,
    receiverName: row.receiver_name,
    tone: row.tone,
    theme: row.theme,
    customMessages: row.custom_messages,
    finalMessage: row.final_message,
    createdAt: row.created_at,
    expiresAt: row.expires_at ?? undefined,
    analytics: row.analytics,
    images: row.images
  };
}

export async function createExperience(body: Record<string, unknown>) {
  const input = normalizeExperiencePayload(body);
  const id = generateExperienceId();

  if (!isSupabaseConfigured()) {
    const row: ExperienceRow = {
      id,
      template_id: input.templateId,
      category: input.category,
      creator_name: input.creatorName,
      receiver_name: input.receiverName,
      tone: input.tone,
      theme: input.theme,
      custom_messages: input.customMessages,
      final_message: input.finalMessage,
      created_at: new Date().toISOString(),
      expires_at: input.expiresAt ?? null,
      analytics: emptyAnalytics(input.templateId),
      images: input.images
    };
    const store = await readLocalStore();
    store.set(id, row);
    await writeLocalStore(store);
    return { data: toRecord(row), error: null };
  }

  const supabase = getSupabaseServerClient();
  const row: Record<string, unknown> = {
    id,
    template_id: input.templateId,
    category: input.category,
    creator_name: input.creatorName,
    receiver_name: input.receiverName,
    tone: input.tone,
    theme: input.theme,
    custom_messages: input.customMessages,
    final_message: input.finalMessage,
    analytics: emptyAnalytics(input.templateId),
    images: input.images
  };
  if (input.expiresAt) row.expires_at = input.expiresAt;

  const { data, error } = await supabase.from("generated_experiences").insert(row).select("*").single<ExperienceRow>();
  if (error) return { data: null, error: error.message };
  return { data: toRecord(data), error: null };
}

export async function getExperience(id: string) {
  if (!isSupabaseConfigured()) {
    const store = await readLocalStore();
    const row = store.get(id);
    if (!row) return { data: null, error: "Experience not found. It may have expired or been removed." };
    if (row.expires_at && new Date(row.expires_at).getTime() <= Date.now()) {
      store.delete(id);
      await writeLocalStore(store);
      return { data: null, error: "This link has expired." };
    }
    return { data: toRecord(row), error: null };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("generated_experiences").select("*").eq("id", id).single<ExperienceRow>();
  if (error) return { data: null, error: error.message };

  if (data.expires_at && new Date(data.expires_at).getTime() <= Date.now()) {
    return { data: null, error: "This link has expired." };
  }

  return { data: toRecord(data), error: null };
}

export async function updateExperience(body: Record<string, unknown>) {
  const input = normalizeExperiencePayload(body);
  const id = body.id as string;
  if (!id) return { data: null, error: "Missing experience ID." };

  if (!isSupabaseConfigured()) {
    const store = await readLocalStore();
    const existing = store.get(id);
    if (!existing) return { data: null, error: "Experience not found." };
    const updated: ExperienceRow = {
      ...existing,
      template_id: input.templateId,
      category: input.category,
      creator_name: input.creatorName,
      receiver_name: input.receiverName,
      tone: input.tone,
      theme: input.theme,
      custom_messages: input.customMessages,
      final_message: input.finalMessage,
      expires_at: input.expiresAt ?? existing.expires_at,
      images: input.images ?? existing.images
    };
    store.set(id, updated);
    await writeLocalStore(store);
    return { data: toRecord(updated), error: null };
  }

  const supabase = getSupabaseServerClient();
  const updateRow: Record<string, unknown> = {
    template_id: input.templateId,
    category: input.category,
    creator_name: input.creatorName,
    receiver_name: input.receiverName,
    tone: input.tone,
    theme: input.theme,
    custom_messages: input.customMessages,
    final_message: input.finalMessage,
    images: input.images
  };
  if (input.expiresAt) updateRow.expires_at = input.expiresAt;
  const { data, error } = await supabase
    .from("generated_experiences")
    .update(updateRow)
    .eq("id", id)
    .select("*")
    .single<ExperienceRow>();

  if (error) return { data: null, error: error.message };
  return { data: toRecord(data), error: null };
}

export async function trackExperienceEvent(id: string, payload: AnalyticsPayload) {
  if (!isSupabaseConfigured()) return { ok: false, error: "Supabase is not configured." };

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("generated_experiences").select("analytics, template_id").eq("id", id).single<Pick<ExperienceRow, "analytics" | "template_id">>();
  if (error) return { ok: false, error: error.message };

  const analytics = data.analytics ?? emptyAnalytics(data.template_id);
  if (payload.eventType === "experience_opened") analytics.opened += 1;
  if (payload.eventType === "experience_completed") analytics.completed += 1;
  if (payload.eventType === "final_cta_clicked") analytics.finalCtaClicks += 1;
  if (payload.eventType === "selected_mood_choice" && payload.choice) {
    analytics.selectedChoices[payload.choice] = (analytics.selectedChoices[payload.choice] ?? 0) + 1;
  }
  analytics.templateUsed = payload.templateId || data.template_id;

  await supabase.from("analytics_events").insert({
    experience_id: id,
    event_type: payload.eventType,
    template_id: payload.templateId || data.template_id,
    choice: payload.choice?.slice(0, 80) || null
  });

  const { error: updateError } = await supabase.from("generated_experiences").update({ analytics }).eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };
  return { ok: true, error: null };
}

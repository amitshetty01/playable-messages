import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";

type DraftRow = {
  id: string;
  resume_code: string;
  template_id: string;
  form_state: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

const ADJECTIVES = [
  "Lucky", "Soft", "Brave", "Wild", "Calm", "Bold", "Warm", "Cool",
  "Sweet", "Kind", "Pure", "Bright", "Quiet", "True", "Free", "Rare",
];

const NOUNS = [
  "Heart", "Soul", "Dream", "Spark", "Moon", "Star", "Tide", "Glow",
  "Song", "Breeze", "Flame", "Pulse", "Kiss", "Whisper", "Maze", "Key",
];

function generateResumeCode(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(10 + Math.random() * 89);
  return `${adj}-${noun}-${num}`;
}

export async function createDraft(payload: {
  templateId: string;
  formState: Record<string, unknown>;
}) {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Database not configured." };
  }

  const supabase = getSupabaseServerClient();
  const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  let resumeCode = generateResumeCode();

  // Ensure unique code
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: existing } = await supabase
      .from("drafts")
      .select("id")
      .eq("resume_code", resumeCode)
      .maybeSingle();
    if (!existing) break;
    resumeCode = generateResumeCode();
  }

  const { data, error } = await supabase
    .from("drafts")
    .insert({
      id,
      resume_code: resumeCode,
      template_id: payload.templateId,
      form_state: payload.formState,
    })
    .select("*")
    .single<DraftRow>();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function updateDraft(
  id: string,
  payload: { templateId?: string; formState?: Record<string, unknown> }
) {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Database not configured." };
  }

  const supabase = getSupabaseServerClient();
  const updateRow: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (payload.templateId) updateRow.template_id = payload.templateId;
  if (payload.formState) updateRow.form_state = payload.formState;

  const { data, error } = await supabase
    .from("drafts")
    .update(updateRow)
    .eq("id", id)
    .select("*")
    .single<DraftRow>();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function getDraftByCode(resumeCode: string) {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Database not configured." };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("drafts")
    .select("*")
    .eq("resume_code", resumeCode)
    .maybeSingle<DraftRow>();

  if (error) return { data: null, error: error.message };
  return { data: data ?? null, error: null };
}

export async function getDraftById(id: string) {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Database not configured." };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("drafts")
    .select("*")
    .eq("id", id)
    .maybeSingle<DraftRow>();

  if (error) return { data: null, error: error.message };
  return { data: data ?? null, error: null };
}

export async function deleteDraft(id: string) {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Database not configured." };
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("drafts").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}

export { generateResumeCode };

import bcrypt from "bcryptjs";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";
import { emptyAnalytics, generateExperienceId, normalizeExperiencePayload } from "@/lib/validation";
import type { AnalyticsPayload, ChainContribution, ExperienceAnalytics, ExperienceRecord, LockType } from "@/lib/types";

const SALT_ROUNDS = 10;

type ExperienceRow = {
  id: string;
  template_id: string;
  category: string;
  creator_name: string;
  receiver_name: string;
  relationship_tag: string;
  show_creator_name: boolean;
  tone: ExperienceRecord["tone"];
  theme: ExperienceRecord["theme"];
  custom_messages: ExperienceRecord["customMessages"];
  final_message: string;
  created_at: string;
  expires_at?: string | null;
  analytics: ExperienceAnalytics;
  images?: string[];
  reaction?: string;
  custom_password?: string | null;
  password_question?: string | null;
  password_answer?: string | null;
  together_since?: string | null;
  scheduled_at?: string | null;
  lock_type?: string | null;
  lock_value?: string | null;
  gift_song_url?: string | null;
  gift_song_title?: string | null;
  is_reply?: boolean | null;
  reply_to_id?: string | null;
  is_chain?: boolean | null;
  chain_target?: number | null;
  chain_completed?: boolean | null;
  view_once?: boolean | null;
  viewed_at?: string | null;
  vibe_emoji?: string | null;
  vibe_audio_url?: string | null;
};

function toRecord(row: ExperienceRow): ExperienceRecord {
  return {
    id: row.id,
    templateId: row.template_id,
    category: row.category,
    creatorName: row.creator_name,
    receiverName: row.receiver_name,
    relationshipTag: (row.relationship_tag ?? "") as ExperienceRecord["relationshipTag"],
    showCreatorName: row.show_creator_name ?? true,
    tone: row.tone,
    theme: row.theme,
    customMessages: row.custom_messages,
    finalMessage: row.final_message,
    createdAt: row.created_at,
    expiresAt: row.expires_at ?? undefined,
    analytics: row.analytics,
    images: row.images,
    customPassword: row.custom_password ?? undefined,
    passwordQuestion: row.password_question ?? undefined,
    passwordAnswer: row.password_answer ?? undefined,
    togetherSince: row.together_since ?? undefined,
    reaction: row.reaction ?? undefined,
    scheduledAt: row.scheduled_at ?? undefined,
    lockType: (["password", "nickname", "date", "puzzle"].includes(row.lock_type ?? "") ? row.lock_type : null) as LockType,
    lockValue: row.lock_value ?? undefined,
    giftSongUrl: row.gift_song_url ?? undefined,
    giftSongTitle: row.gift_song_title ?? undefined,
    isReply: row.is_reply ?? undefined,
    replyToId: row.reply_to_id ?? undefined,
    isChain: row.is_chain ?? undefined,
    chainTarget: row.chain_target ?? undefined,
    chainCompleted: row.chain_completed ?? undefined,
    viewOnce: row.view_once ?? undefined,
    viewedAt: row.viewed_at ?? undefined,
    vibeEmoji: row.vibe_emoji ?? undefined,
    vibeAudioUrl: row.vibe_audio_url ?? undefined,
  };
}

export async function createExperience(body: Record<string, unknown>) {
  const input = normalizeExperiencePayload(body);
  const id = generateExperienceId();

  const hashPassword = async (pw: string | undefined): Promise<string | null> => {
    if (!pw) return null;
    try { return await bcrypt.hash(pw, SALT_ROUNDS); } catch { return null; }
  };

  const [hashedPassword, hashedAnswer] = await Promise.all([
    hashPassword(input.customPassword),
    hashPassword(input.passwordAnswer),
  ]);

  if (!isSupabaseConfigured()) {
    return { data: null, error: "Database not configured. Add Supabase environment variables." };
  }

  const supabase = getSupabaseServerClient();
  const row: Record<string, unknown> = {
    id,
    template_id: input.templateId,
    category: input.category,
    creator_name: input.creatorName,
    receiver_name: input.receiverName,
    relationship_tag: input.relationshipTag,
    show_creator_name: input.showCreatorName,
    tone: input.tone,
    theme: input.theme,
    custom_messages: input.customMessages,
    final_message: input.finalMessage,
    analytics: emptyAnalytics(input.templateId),
    images: input.images,
  };
  if (hashedPassword) row.custom_password = hashedPassword;
  if (input.passwordQuestion) row.password_question = input.passwordQuestion;
  if (hashedAnswer) row.password_answer = hashedAnswer;
  if (input.togetherSince) row.together_since = input.togetherSince;
  if (input.expiresAt) row.expires_at = input.expiresAt;
  if (input.scheduledAt) row.scheduled_at = input.scheduledAt;
  if (input.lockType) row.lock_type = input.lockType;
  if (input.lockValue) row.lock_value = input.lockValue;
  if (input.giftSongUrl) row.gift_song_url = input.giftSongUrl;
  if (input.giftSongTitle) row.gift_song_title = input.giftSongTitle;
  if (input.isReply) row.is_reply = input.isReply;
  if (input.replyToId) row.reply_to_id = input.replyToId;
  if (input.isChain) row.is_chain = input.isChain;
  if (input.chainTarget) row.chain_target = input.chainTarget;
  if (input.viewOnce) row.view_once = input.viewOnce;
  if (input.vibeEmoji) row.vibe_emoji = input.vibeEmoji;
  if (input.vibeAudioUrl) row.vibe_audio_url = input.vibeAudioUrl;

  const { data, error } = await supabase.from("generated_experiences").insert(row).select("*").single<ExperienceRow>();
  if (error) return { data: null, error: error.message };
  return { data: toRecord(data), error: null };
}

export async function getExperience(id: string) {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Database not configured. Add Supabase environment variables." };
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
    return { data: null, error: "Database not configured. Add Supabase environment variables." };
  }

  const supabase = getSupabaseServerClient();
  const updateRow: Record<string, unknown> = {
    template_id: input.templateId,
    category: input.category,
    creator_name: input.creatorName,
    receiver_name: input.receiverName,
    relationship_tag: input.relationshipTag,
    show_creator_name: input.showCreatorName,
    tone: input.tone,
    theme: input.theme,
    custom_messages: input.customMessages,
    final_message: input.finalMessage,
    images: input.images,
  };
  if (input.customPassword) updateRow.custom_password = input.customPassword;
  if (input.passwordQuestion) updateRow.password_question = input.passwordQuestion;
  if (input.passwordAnswer) updateRow.password_answer = input.passwordAnswer;
  if (input.togetherSince) updateRow.together_since = input.togetherSince;
  if (input.expiresAt) updateRow.expires_at = input.expiresAt;
  if (input.scheduledAt) updateRow.scheduled_at = input.scheduledAt;
  if (input.lockType) updateRow.lock_type = input.lockType;
  if (input.lockValue) updateRow.lock_value = input.lockValue;
  if (input.giftSongUrl) updateRow.gift_song_url = input.giftSongUrl;
  if (input.giftSongTitle) updateRow.gift_song_title = input.giftSongTitle;
  if (input.isReply) updateRow.is_reply = input.isReply;
  if (input.replyToId) updateRow.reply_to_id = input.replyToId;
  if (input.isChain) updateRow.is_chain = input.isChain;
  if (input.chainTarget) updateRow.chain_target = input.chainTarget;
  if (input.viewOnce) updateRow.view_once = input.viewOnce;
  if (input.viewedAt) updateRow.viewed_at = input.viewedAt;
  if (input.vibeEmoji) updateRow.vibe_emoji = input.vibeEmoji;
  if (input.vibeAudioUrl) updateRow.vibe_audio_url = input.vibeAudioUrl;
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
    choice: payload.choice?.slice(0, 80) || null,
    metadata: payload.metadata ?? {},
    duration_ms: payload.durationMs ?? null
  });

  const { error: updateError } = await supabase.from("generated_experiences").update({ analytics }).eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };
  return { ok: true, error: null };
}

export async function setExperienceReaction(id: string, reaction: string) {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Database not configured." };
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("generated_experiences").update({ reaction: reaction.slice(0, 10) }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}

export async function markExperienceViewed(id: string) {
  if (!isSupabaseConfigured()) return { ok: false, error: "Database not configured." };
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("generated_experiences")
    .update({ viewed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}

export async function deleteExperience(id: string) {
  if (!isSupabaseConfigured()) return { ok: false, error: "Database not configured." };
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("generated_experiences").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}

export async function setExperienceVibe(id: string, vibeEmoji: string, audioUrl?: string) {
  if (!isSupabaseConfigured()) return { ok: false, error: "Database not configured." };
  const supabase = getSupabaseServerClient();
  const updateData: Record<string, string> = { vibe_emoji: vibeEmoji.slice(0, 10) };
  if (audioUrl) updateData.vibe_audio_url = audioUrl.slice(0, 500);
  const { error } = await supabase.from("generated_experiences").update(updateData).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}

export async function setExperienceReply(id: string, replyText: string, reactionEmoji?: string) {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Database not configured." };
  }

  const supabase = getSupabaseServerClient();
  const updateData: Record<string, string> = {
    reply_text: replyText.slice(0, 500),
  };
  if (reactionEmoji) {
    updateData.reply_reaction = reactionEmoji.slice(0, 10);
  }
  const { error } = await supabase.from("generated_experiences").update(updateData).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}

type ChainRow = {
  id: number;
  experience_id: string;
  contributor_name: string;
  message: string;
  contribution_type: string;
  sequence_number: number;
  created_at: string;
};

function toChainRecord(row: ChainRow): ChainContribution {
  return {
    id: row.id,
    experienceId: row.experience_id,
    contributorName: row.contributor_name,
    message: row.message,
    contributionType: row.contribution_type as ChainContribution["contributionType"],
    sequenceNumber: row.sequence_number,
    createdAt: row.created_at,
  };
}

export async function getChainContributions(experienceId: string) {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Database not configured." };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("chain_messages")
    .select("*")
    .eq("experience_id", experienceId)
    .order("sequence_number", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return { data: null, error: error.message };
  return { data: (data ?? []).map(toChainRecord), error: null };
}

export async function addChainContribution(
  experienceId: string,
  body: { contributorName: string; message: string; contributionType: string }
) {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Database not configured." };
  }

  const supabase = getSupabaseServerClient();

  const { data: exp, error: expError } = await supabase
    .from("generated_experiences")
    .select("chain_target, chain_completed")
    .eq("id", experienceId)
    .single<{ chain_target: number; chain_completed: boolean }>();

  if (expError || !exp) return { data: null, error: expError?.message ?? "Experience not found." };
  if (exp.chain_completed) return { data: null, error: "Chain is already complete." };

  const { data: countResult } = await supabase
    .from("chain_messages")
    .select("id", { count: "exact", head: true })
    .eq("experience_id", experienceId);

  const currentCount = countResult?.length ?? 0;

  const { data, error } = await supabase
    .from("chain_messages")
    .insert({
      experience_id: experienceId,
      contributor_name: body.contributorName.slice(0, 80),
      message: body.message.slice(0, 1000),
      contribution_type: body.contributionType || "text",
      sequence_number: currentCount,
    })
    .select("*")
    .single<ChainRow>();

  if (error) return { data: null, error: error.message };

  const newCount = currentCount + 1;
  const isComplete = newCount >= exp.chain_target;

  if (isComplete) {
    await supabase
      .from("generated_experiences")
      .update({ chain_completed: true })
      .eq("id", experienceId);
  }

  return { data: toChainRecord(data), isComplete, contributionsCount: newCount, error: null };
}

"use client";

import type {
  AIRequest,
  AIResponse,
  AIAssistantRequest,
  AIGameBuilderRequest,
  AIAssistantResponse,
  AIGameBuilderResponse,
  AISurpriseResponse,
  AIRegenerateResponse,
  AIConcept,
  FeedbackHint,
} from "./ai-types";
import { getWorstTemplateTypes, getTopTemplateTypes } from "./ai-feedback";

function buildFeedbackHint(): FeedbackHint | undefined {
  if (typeof window === "undefined") return undefined;
  const avoid = getWorstTemplateTypes(3);
  const preferred = getTopTemplateTypes(3);
  if (avoid.length === 0 && preferred.length === 0) return undefined;
  return { preferredTypes: preferred.length > 0 ? preferred : undefined, avoidTypes: avoid.length > 0 ? avoid : undefined };
}

async function callAI(request: AIRequest): Promise<AIResponse> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || `Request failed (${res.status})`);
  }

  if (!json.data) {
    throw new Error("Invalid response from server");
  }

  return json.data as AIResponse;
}

export async function messageAssist(
  roughPoints: string,
  tone: string
): Promise<AIAssistantResponse> {
  const req: AIAssistantRequest = {
    mode: "message_assist",
    roughPoints,
    tone: tone as AIAssistantRequest["tone"],
    feedbackHint: buildFeedbackHint(),
  };
  return callAI(req) as Promise<AIAssistantResponse>;
}

export async function gameBuilder(
  story: string,
  occasion: string,
  recipient: string,
  tone: string
): Promise<AIGameBuilderResponse> {
  const req: AIGameBuilderRequest = {
    mode: "game_builder",
    story,
    occasion: occasion as AIGameBuilderRequest["occasion"],
    recipient: recipient as AIGameBuilderRequest["recipient"],
    tone: tone as AIGameBuilderRequest["tone"],
    feedbackHint: buildFeedbackHint(),
  };
  return callAI(req) as Promise<AIGameBuilderResponse>;
}

export async function surpriseMe(): Promise<AISurpriseResponse> {
  return callAI({
    mode: "surprise_me",
    feedbackHint: buildFeedbackHint(),
  }) as Promise<AISurpriseResponse>;
}

export async function regenerateConcept(
  concept: AIConcept,
  instruction: string
): Promise<AIRegenerateResponse> {
  return callAI({
    mode: "regenerate_concept",
    concept,
    instruction,
    feedbackHint: buildFeedbackHint(),
  }) as Promise<AIRegenerateResponse>;
}

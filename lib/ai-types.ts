"use client";

export type AIMode = "message_assist" | "game_builder" | "surprise_me" | "regenerate_concept";

export type AssistTone = "Romantic" | "Sorry" | "Cute" | "Emotional" | "Funny" | "Premium";

export type GameOccasion =
  | "Confession"
  | "Apology"
  | "Birthday"
  | "Anniversary"
  | "Proposal"
  | "Just Because";

export type GameRecipient = "Partner" | "Crush" | "Friend" | "Family";

export type GameTone = "Romantic" | "Cute" | "Emotional" | "Funny" | "Premium";

export interface AIConceptScene {
  heading: string;
  message: string;
  interaction: string;
}

export interface AIMediaSlot {
  label: string;
  type: "image";
  description: string;
}

export interface AIConcept {
  id: string;
  title: string;
  vibe: string;
  templateType: string;
  visualStyle: string;
  shortDescription: string;
  scenes: AIConceptScene[];
  finalMessage: string;
  mediaSlots: AIMediaSlot[];
}

export interface AIAssistantRequest {
  mode: "message_assist";
  roughPoints: string;
  tone: AssistTone;
}

export interface AIGameBuilderRequest {
  mode: "game_builder";
  story: string;
  occasion: GameOccasion;
  recipient: GameRecipient;
  tone: GameTone;
}

export interface AISurpriseRequest {
  mode: "surprise_me";
}

export interface AIRegenerateRequest {
  mode: "regenerate_concept";
  concept: AIConcept;
  instruction: string;
}

export type AIRequest = AIAssistantRequest | AIGameBuilderRequest | AISurpriseRequest | AIRegenerateRequest;

export interface AIAssistantResponse {
  rewritten: string;
}

export interface AIGameBuilderResponse {
  concepts: AIConcept[];
}

export interface AISurpriseResponse {
  concepts: AIConcept[];
}

export interface AIRegenerateResponse {
  concept: AIConcept;
}

export type AIResponse = AIAssistantResponse | AIGameBuilderResponse | AISurpriseResponse | AIRegenerateResponse;

export type AIStatus = "idle" | "loading" | "success" | "error";

export interface AIState {
  status: AIStatus;
  error: string | null;
  result: AIResponse | null;
}

export function isGameBuilderResponse(r: AIResponse): r is AIGameBuilderResponse {
  return "concepts" in r;
}

export function isAssistantResponse(r: AIResponse): r is AIAssistantResponse {
  return "rewritten" in r;
}

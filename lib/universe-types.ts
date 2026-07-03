/**
 * Our Story Universe - Type Definitions
 * Comprehensive TypeScript interfaces for the interactive storybook platform
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum UniverseTheme {
  CLASSIC_ROMANCE = 'classic-romance',
  DARK_FANTASY = 'dark-fantasy',
  MANGA = 'manga',
  COMEDY = 'comedy',
  ROYAL_KINGDOM = 'royal-kingdom',
  SCI_FI = 'sci-fi',
  CYBERPUNK = 'cyberpunk',
  HORROR = 'horror',
  MYSTERY = 'mystery',
  PIRATE_ADVENTURE = 'pirate-adventure',
  SLICE_OF_LIFE = 'slice-of-life',
  TIME_TRAVEL = 'time-travel',
}

export enum StoryTone {
  ROMANTIC = 'romantic',
  EMOTIONAL = 'emotional',
  FUNNY = 'funny',
  DRAMATIC = 'dramatic',
  MYSTERIOUS = 'mysterious',
  CUTE = 'cute',
  DARK_COMEDY = 'dark-comedy',
}

export enum ChapterType {
  COVER = 'cover',
  DEDICATION = 'dedication',
  CHAPTER_1 = 'chapter-1',
  CHAPTER_2 = 'chapter-2',
  CHAPTER_3 = 'chapter-3',
  CHAPTER_4 = 'chapter-4',
  CHAPTER_5 = 'chapter-5',
  FINAL = 'final',
}

export enum InteractiveElementType {
  TAP_REVEAL = 'tap-reveal',
  HOLD_REVEAL = 'hold-reveal',
  SCRATCH = 'scratch',
  DOUBLE_TAP = 'double-tap',
  DRAG = 'drag',
  SWIPE = 'swipe',
}

export enum AnimationType {
  PAGE_TURN = 'page-turn',
  FADE = 'fade',
  SLIDE = 'slide',
  ZOOM = 'zoom',
  GLOW = 'glow',
  PARTICLE = 'particle',
  FLOATING = 'floating',
}

export enum ParticleEffect {
  PETALS = 'petals',
  RAIN = 'rain',
  STARS = 'stars',
  FIREFLIES = 'fireflies',
  SNOWFLAKES = 'snowflakes',
  SPARKLES = 'sparkles',
  CONFETTI = 'confetti',
  NONE = 'none',
}

// ============================================================================
// MAIN DATA MODELS
// ============================================================================

export interface Hero {
  name: string;
  photoUrl?: string;
  photoBlob?: Blob;
}

export interface Partner {
  name: string;
  photoUrl?: string;
  photoBlob?: Blob;
}

export interface UniverseMetadata {
  userId: string;
  title: string;
  theme: UniverseTheme;
  tone: StoryTone;
  hero: Hero;
  partner: Partner;
  favoriteMemory: string;
  partnerTraits: string;
  promise: string;
  createdAt: Date;
  updatedAt: Date;
  playCount: number;
  isPublished: boolean;
  isShared: boolean;
  shareCode?: string;
}

export interface InteractiveElement {
  id: string;
  type: InteractiveElementType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  hiddenContent: string;
  icon?: string;
  instruction?: string;
  delay?: number;
}

export interface PageChoice {
  id: string;
  text: string;
  consequence: string;
  emoji?: string;
  nextPageVariation?: string;
}

export interface PageContent {
  id: string;
  pageNumber: number;
  title?: string;
  mainText: string;
  voiceOver?: string;
  animation: AnimationType;
  particleEffect: ParticleEffect;
  backgroundTheme: string;
  textColor: string;
  music?: string;
  musicIntensity: 'soft' | 'medium' | 'intense';
  interactiveElements: InteractiveElement[];
  choices?: PageChoice[];
  duration: number;
  imageUrl?: string;
  gradient?: { from: string; to: string };
}

export interface Chapter {
  id: string;
  universeId: string;
  type: ChapterType;
  title: string;
  subtitle?: string;
  pages: PageContent[];
  generatedContent?: {
    timestamp: Date;
    model: string;
    prompt: string;
  };
}

export interface UniverseVariant {
  id: string;
  parentUniverseId: string;
  variantType:
    | 'manga'
    | 'comedy'
    | 'what-if'
    | 'future'
    | 'royal'
    | 'alternate-ending';
  isLocked: boolean;
  preview?: string;
  description: string;
}

export interface Universe {
  id: string;
  metadata: UniverseMetadata;
  chapters: Chapter[];
  variants: UniverseVariant[];
  userChoices: Record<string, string>;
  currentChapterIndex: number;
  currentPageIndex: number;
  isPlaying: boolean;
  playProgress: number;
  settings: UniverseSettings;
}

export interface UniverseSettings {
  animationIntensity: 'low' | 'medium' | 'high';
  musicEnabled: boolean;
  soundEffectsEnabled: boolean;
  autoAdvance: boolean;
  autoAdvanceDelay: number;
  textSize: 'small' | 'medium' | 'large';
  enableVoiceOver: boolean;
  enableSubtitles: boolean;
}

// ============================================================================
// ONBOARDING & FLOW
// ============================================================================

export interface OnboardingStep {
  stepNumber: number;
  question: string;
  questionEmoji?: string;
  type:
    | 'text-input'
    | 'photo-upload'
    | 'multi-select'
    | 'single-select'
    | 'textarea';
  placeholder?: string;
  options?: { label: string; value: string; emoji?: string }[];
  required: boolean;
  magical?: boolean;
  animation?: AnimationType;
}

export interface OnboardingData {
  heroName: string;
  partnerName: string;
  heroPhoto?: Blob;
  partnerPhoto?: Blob;
  theme: UniverseTheme;
  tone: StoryTone;
  favoriteMemory: string;
  partnerTraits: string;
  promise: string;
}

// ============================================================================
// AI SERVICE INTERFACES
// ============================================================================

export interface AIStoryGenerationRequest {
  universeId: string;
  hero: Hero;
  partner: Partner;
  theme: UniverseTheme;
  tone: StoryTone;
  favoriteMemory: string;
  partnerTraits: string;
  promise: string;
  chapterType: ChapterType;
}

export interface AIStoryGenerationResponse {
  success: boolean;
  chapterId: string;
  pages: PageContent[];
  interactiveElements: InteractiveElement[];
  choices?: PageChoice[];
  error?: string;
  generationTime: number;
  tokenUsage?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export interface AIVariantRequest {
  parentUniverseId: string;
  variantType: UniverseVariant['variantType'];
  hero: Hero;
  partner: Partner;
  theme: UniverseTheme;
  tone: StoryTone;
}

export interface AIVariantResponse {
  success: boolean;
  variantId: string;
  chapters: Chapter[];
  preview: string;
  error?: string;
}

// ============================================================================
// PLAYER STATE
// ============================================================================

export interface PlayerState {
  currentUniverseId: string;
  currentChapterIndex: number;
  currentPageIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  playbackPosition: number;
  visitedPages: Set<string>;
  interactedElements: Record<string, boolean>;
  choicesMade: Record<string, string>;
  settings: UniverseSettings;
  startTime: Date;
  totalPlayTime: number;
}

// ============================================================================
// EXPORT & SHARING
// ============================================================================

export interface ExportOptions {
  format: 'pdf' | 'epub' | 'mp4' | 'gif' | 'json';
  includePhotos: boolean;
  includeMusic: boolean;
  quality: 'low' | 'medium' | 'high';
  pageRange?: { start: number; end: number };
}

export interface ShareData {
  universeId: string;
  recipientEmail?: string;
  message?: string;
  expiresIn?: number;
  allowEditing: boolean;
  shareCode: string;
}

// ============================================================================
// EDITOR
// ============================================================================

export interface EditableField {
  fieldName: keyof Universe['metadata'] | keyof Chapter | keyof PageContent;
  currentValue: any;
  newValue?: any;
  type:
    | 'text'
    | 'textarea'
    | 'photo'
    | 'select'
    | 'number'
    | 'color'
    | 'toggle';
  options?: any[];
  validation?: (value: any) => boolean;
}

// ============================================================================
// ANALYTICS
// ============================================================================

export interface PlayEvent {
  universeId: string;
  userId: string;
  eventType:
    | 'play-start'
    | 'page-viewed'
    | 'choice-made'
    | 'element-interacted'
    | 'play-end'
    | 'variant-created';
  chapterIndex?: number;
  pageIndex?: number;
  elementId?: string;
  choiceId?: string;
  timestamp: Date;
  duration?: number;
}

export interface UniverseAnalytics {
  universeId: string;
  totalPlays: number;
  uniquePlayers: number;
  averagePlaytime: number;
  completionRate: number;
  favoriteChapter: string;
  mostInteractedElements: Record<string, number>;
  choiceDistribution: Record<string, number>;
  variantsCreated: number;
}

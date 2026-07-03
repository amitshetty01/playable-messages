// Book Builder Type Definitions
export type BookStatus = 'draft' | 'editing' | 'review' | 'published' | 'archived';
export type BookGenre = 'fiction' | 'romance' | 'mystery' | 'sci-fi' | 'fantasy' | 'thriller' | 'literary' | 'memoir' | 'business' | 'self-help' | 'other';
export type WritingStyle = 'literary' | 'commercial' | 'young-adult' | 'children' | 'technical' | 'casual';

export interface Character {
  id: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  description: string;
  traits: string[];
  motivations: string[];
  arc: string; // Character development arc
  voiceProfile: {
    vocabulary: 'simple' | 'moderate' | 'complex';
    tone: 'formal' | 'casual' | 'sarcastic' | 'poetic';
    speechPatterns: string[];
  };
  relationships: Array<{
    characterId: string;
    type: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Scene {
  id: string;
  chapterId: string;
  title: string;
  type: 'action' | 'dialogue' | 'introspection' | 'description' | 'plot-twist';
  content: string;
  wordCount: number;
  pov: string; // Point of view character
  setting: string;
  timeline: {
    timeOfDay: string;
    date: string;
    duration: string; // How long scene takes place
  };
  charactersInvolved: string[];
  emotionalTone: string;
  pacing: 'slow' | 'normal' | 'fast';
  aiSuggestions?: {
    improvements: string[];
    toneMatches: boolean;
    plotConsistency: number; // 0-100
    generatedAlternatives?: string[];
  };
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id: string;
  bookId: string;
  title: string;
  description: string;
  scenes: Scene[];
  wordCount: number;
  order: number;
  status: 'outline' | 'draft' | 'revision' | 'final';
  plotPoints: string[];
  themes: string[];
  emotionalArc: string[];
  suggestedLength: number; // Recommended word count
  createdAt: Date;
  updatedAt: Date;
}

export interface BookOutline {
  id: string;
  bookId: string;
  plotStructure: 'heros-journey' | 'three-act' | 'save-the-cat' | 'five-act' | 'custom';
  acts: Array<{
    name: string;
    description: string;
    chapters: number;
    keyPoints: string[];
  }>;
  themes: string[];
  conflicts: {
    internal: string[];
    external: string[];
  };
  climax: string;
  resolution: string;
}

export interface BranchPoint {
  id: string;
  chapterId: string;
  sceneId: string;
  decision: string;
  branches: Array<{
    id: string;
    title: string;
    consequence: string;
    targetChapterId: string;
  }>;
}

export interface Template {
  id: string;
  name: string;
  genre: BookGenre;
  structure: string; // e.g., "hero's journey"
  description: string;
  chapters: Array<{
    title: string;
    description: string;
    suggestedLength: number;
    keyPoints: string[];
  }>;
  characters: Array<{
    name: string;
    archetype: string;
    description: string;
  }>;
  themes: string[];
  writingStyle: WritingStyle;
  pacing: {
    riseOfAction: number; // % of book
    climax: number;
    resolution: number;
  };
  tonePresets: {
    vocabulary: 'simple' | 'moderate' | 'complex';
    descriptiveness: number; // 1-10
    dialogueRatio: number; // % of book
  };
}

export interface Book {
  id: string;
  userId: string;
  title: string;
  description: string;
  genre: BookGenre;
  writingStyle: WritingStyle;
  status: BookStatus;
  templateId?: string;
  targetWordCount: number;
  currentWordCount: number;
  chapters: Chapter[];
  characters: Character[];
  outline: BookOutline;
  branchPoints: BranchPoint[];
  settings: Array<{
    name: string;
    description: string;
    significance: string;
  }>;
  aiContext: {
    tone: string;
    voiceGuidelines: string;
    contentWarnings: string[];
    targetAudience: string;
  };
  metadata: {
    coverImageUrl?: string;
    subtitle?: string;
    series?: string;
    seriesNumber?: number;
    keywords: string[];
  };
  collaboration?: {
    editors: string[]; // user IDs
    betaReaders: string[];
  };
  stats: {
    readingTime: number; // minutes
    chapterCount: number;
    sceneCount: number;
    averageChapterLength: number;
    completionPercentage: number;
  };
  versions: Array<{
    version: number;
    date: Date;
    changes: string;
  }>;
  publishingStatus?: {
    publishedAt?: Date;
    publisher?: string;
    isbn?: string;
    platforms: Array<'amazon-kdp' | 'smashwords' | 'draft2digital' | 'web'>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AIAssistantRequest {
  type: 'generate-chapter' | 'suggest-improvements' | 'fix-tone' | 'expand-scene' | 'character-check' | 'plot-consistency' | 'dialogue-generation' | 'scene-suggestion' | 'batch-plot-analysis';
  context: {
    book: Partial<Book>;
    chapter?: Partial<Chapter>;
    scene?: Partial<Scene>;
    character?: Partial<Character>;
    instruction: string;
  };
  parameters?: {
    temperature?: number;
    maxTokens?: number;
    style?: string;
  };
}

export interface AIAssistantResponse {
  success: boolean;
  data?: {
    content?: string;
    suggestions?: string[];
    alternatives?: string[];
    analysis?: Record<string, any>;
    metrics?: {
      toneConsistency: number;
      plotAlignment: number;
      characterVoiceMatch: number;
    };
  };
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

export interface ExportOptions {
  format: 'pdf' | 'epub' | 'mobi' | 'html' | 'txt' | 'docx';
  includeMetadata: boolean;
  includeCover: boolean;
  paperSize?: 'a4' | 'letter' | 'trade';
  fontSize?: number;
  lineHeight?: number;
  margin?: number;
}

export interface PublishingConfig {
  title: string;
  description: string;
  author: string;
  isbn?: string;
  keywords: string[];
  targetAudience: string;
  rating?: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
  price?: number;
  currency?: string;
}

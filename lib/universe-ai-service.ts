/**
 * Our Story Universe - AI Story Generation Service
 * Generates personalized interactive story content with Azure OpenAI
 */

import {
  AIStoryGenerationRequest,
  AIStoryGenerationResponse,
  AIVariantRequest,
  AIVariantResponse,
  AnimationType,
  Chapter,
  ChapterType,
  InteractiveElement,
  InteractiveElementType,
  PageChoice,
  PageContent,
  ParticleEffect,
  UniverseTheme,
} from './universe-types';
import { THEME_COLORS, TONE_AUDIO } from './universe-animations';

// ============================================================================
// CHAPTER PROMPTS
// ============================================================================

const CHAPTER_TEMPLATES: Record<ChapterType, string> = {
  [ChapterType.COVER]: `Create an animated cover page for "{heroName} & {partnerName}'s Story Universe". 
    Include:
    - Poetic title treatment
    - Theme-appropriate decorative elements
    - Soft glowing effects
    - Both names beautifully displayed
    Keep text minimal and impactful.`,

  [ChapterType.DEDICATION]: `Write a heartfelt dedication page for {heroName} and {partnerName}'s love story.
    Theme: {theme}
    Tone: {tone}
    Include emotional, universal lines about their connection.
    Keep it 2-3 beautiful sentences.`,

  [ChapterType.CHAPTER_1]: `Write "How Fate Began" - Chapter 1 of their love story.
    Theme: {theme}
    Tone: {tone}
    Key details:
    - Hero: {heroName}
    - Partner: {partnerName}
    - Setting: Where they first met or how their worlds collided
    - Favorite memory: {memory}
    - {partnerTraits}
    
    Make it feel like destiny. Include subtle references to their traits.
    Keep text cinematic and concise (2-3 paragraphs max).`,

  [ChapterType.CHAPTER_2]: `Write "The Moment Everything Changed" - Chapter 2.
    Theme: {theme}
    Tone: {tone}
    Tell the pivotal moment when their relationship transformed.
    Reference their favorite memory: {memory}
    Their traits: {partnerTraits}
    
    Build emotional intensity. Make it feel like a turning point.
    Keep it 2-3 paragraphs.`,

  [ChapterType.CHAPTER_3]: `Write "Little Things I Love" - Chapter 3.
    Theme: {theme}
    Tone: {tone}
    Celebrate {partnerName}'s:
    - Habits and quirks
    - Cute mannerisms
    - Inside jokes with {heroName}
    
    Details: {partnerTraits}
    
    Make it warm, intimate, and full of tender details.
    Include specific examples. Keep it 2-3 paragraphs.`,

  [ChapterType.CHAPTER_4]: `Write "The Memory Time Kept" - Chapter 4.
    Theme: {theme}
    Tone: {tone}
    Retell their most treasured memory: {memory}
    
    Make it vivid, sensory, and emotionally resonant.
    Include what made this moment unforgettable.
    Keep it 2-3 paragraphs.`,

  [ChapterType.CHAPTER_5]: `Write "The Promise" - Chapter 5.
    Theme: {theme}
    Tone: {tone}
    Incorporate their promise/message: {promise}
    
    Make it poetic and forward-looking.
    End on a note of eternal commitment.
    Keep it 2-3 paragraphs.`,

  [ChapterType.FINAL]: `Write "Our Universe" - The Final Chapter.
    Theme: {theme}
    Tone: {tone}
    This is the epic conclusion to {heroName} and {partnerName}'s story.
    
    Weave together:
    - How they met ({memory})
    - What they love about each other ({partnerTraits})
    - Their promise ({promise})
    - A beautiful ending that feels like destiny fulfilled
    
    Make it feel cinematic, eternal, and like the beginning of forever.
    Keep it 3-4 paragraphs.`,
};

// ============================================================================
// INTERACTIVE ELEMENTS GENERATOR
// ============================================================================

const INTERACTIVE_SUGGESTIONS: Record<ChapterType, InteractiveElement[]> = {
  [ChapterType.COVER]: [
    {
      id: 'cover-tap-title',
      type: InteractiveElementType.TAP_REVEAL,
      position: { x: 50, y: 40 },
      size: { width: 300, height: 80 },
      hiddenContent: 'A story written in the stars...',
      instruction: 'Tap the title',
    },
  ],
  [ChapterType.DEDICATION]: [
    {
      id: 'dedication-hold-heart',
      type: InteractiveElementType.HOLD_REVEAL,
      position: { x: 50, y: 50 },
      size: { width: 60, height: 60 },
      hiddenContent: '❤️ Forever yours',
      instruction: 'Hold the heart',
    },
  ],
  [ChapterType.CHAPTER_1]: [
    {
      id: 'ch1-tap-moon',
      type: InteractiveElementType.TAP_REVEAL,
      position: { x: 80, y: 20 },
      size: { width: 40, height: 40 },
      hiddenContent: 'Under a sky full of endless possibilities...',
      instruction: 'Tap the moon',
    },
    {
      id: 'ch1-double-tap-heart',
      type: InteractiveElementType.DOUBLE_TAP,
      position: { x: 50, y: 70 },
      size: { width: 60, height: 60 },
      hiddenContent: 'And our hearts knew before our minds did.',
      instruction: 'Double tap to reveal',
    },
  ],
  [ChapterType.CHAPTER_2]: [
    {
      id: 'ch2-tap-flower',
      type: InteractiveElementType.TAP_REVEAL,
      position: { x: 20, y: 50 },
      size: { width: 50, height: 50 },
      hiddenContent: 'In that moment, everything bloomed.',
      instruction: 'Tap the flower',
    },
    {
      id: 'ch2-scratch',
      type: InteractiveElementType.SCRATCH,
      position: { x: 70, y: 60 },
      size: { width: 80, height: 40 },
      hiddenContent: 'And they knew they wanted forever.',
      instruction: 'Scratch to reveal',
    },
  ],
  [ChapterType.CHAPTER_3]: [
    {
      id: 'ch3-tap-sparkle',
      type: InteractiveElementType.TAP_REVEAL,
      position: { x: 30, y: 40 },
      size: { width: 40, height: 40 },
      hiddenContent: '✨ Every quirk is perfection',
      instruction: 'Tap the sparkle',
    },
    {
      id: 'ch3-hold-photo',
      type: InteractiveElementType.HOLD_REVEAL,
      position: { x: 60, y: 50 },
      size: { width: 100, height: 100 },
      hiddenContent: 'This is why I love you...',
      instruction: 'Hold to see why',
    },
  ],
  [ChapterType.CHAPTER_4]: [
    {
      id: 'ch4-tap-frame',
      type: InteractiveElementType.TAP_REVEAL,
      position: { x: 50, y: 50 },
      size: { width: 120, height: 120 },
      hiddenContent: 'A moment frozen in time, forever in our hearts.',
      instruction: 'Tap the memory frame',
    },
  ],
  [ChapterType.CHAPTER_5]: [
    {
      id: 'ch5-hold-hands',
      type: InteractiveElementType.HOLD_REVEAL,
      position: { x: 50, y: 70 },
      size: { width: 100, height: 80 },
      hiddenContent: 'I promise to love you endlessly.',
      instruction: 'Hold our hands',
    },
  ],
  [ChapterType.FINAL]: [
    {
      id: 'final-tap-universe',
      type: InteractiveElementType.TAP_REVEAL,
      position: { x: 50, y: 40 },
      size: { width: 200, height: 200 },
      hiddenContent: 'In infinite universes, I choose you in every one.',
      instruction: 'Tap the universe',
    },
    {
      id: 'final-double-tap-ending',
      type: InteractiveElementType.DOUBLE_TAP,
      position: { x: 50, y: 80 },
      size: { width: 100, height: 60 },
      hiddenContent: 'This was only one universe... Ready for another?',
      instruction: 'Double tap for more',
    },
  ],
};

// ============================================================================
// STORY GENERATION SERVICE
// ============================================================================

export class UniverseAIService {
  private apiKey: string;
  private endpoint: string;
  private deploymentName: string;

  constructor() {
    this.apiKey = process.env.AZURE_OPENAI_API_KEY || '';
    this.endpoint = process.env.AZURE_OPENAI_ENDPOINT || '';
    this.deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';
  }

  /**
   * Generate a complete chapter with pages and interactive elements
   */
  async generateChapter(
    request: AIStoryGenerationRequest
  ): Promise<AIStoryGenerationResponse> {
    const startTime = Date.now();

    try {
      const prompt = this.buildChapterPrompt(request);
      const response = await this.makeRequest(prompt);

      const pages = this.parsePageContent(
        response,
        request.theme,
        request.chapterType
      );
      const interactiveElements =
        INTERACTIVE_SUGGESTIONS[request.chapterType] || [];

      return {
        success: true,
        chapterId: `${request.universeId}-${request.chapterType}`,
        pages,
        interactiveElements,
        generationTime: Date.now() - startTime,
      };
    } catch (error) {
      console.error('Story generation error:', error);
      return {
        success: false,
        chapterId: '',
        pages: [],
        interactiveElements: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        generationTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Generate interactive choices for a page
   */
  async generateChoices(
    pageContent: PageContent,
    context: string
  ): Promise<PageChoice[]> {
    const prompt = `For this story moment:
    "${pageContent.mainText}"
    
    Context: ${context}
    
    Generate 2-3 meaningful emotional choices that affect the narrative tone/direction.
    Format as JSON array with id, text, consequence, emoji fields.`;

    try {
      const response = await this.makeRequest(prompt);
      const choices = JSON.parse(response);
      return choices;
    } catch {
      return [];
    }
  }

  /**
   * Generate story variants (manga, comedy, what-if, etc.)
   */
  async generateVariant(
    request: AIVariantRequest
  ): Promise<AIVariantResponse> {
    const startTime = Date.now();

    try {
      const variantPrompts: Record<string, string> = {
        manga: `Rewrite their story as a manga narrative. Use emojis, dramatic panels descriptions, and manga-style narrative flow. Make it visual and action-oriented.`,
        comedy: `Rewrite their love story as a comedy. Exaggerate funny moments, add witty dialogue, and make it light-hearted. Focus on their funniest quirks and embarrassing moments.`,
        'what-if': `Write an alternate universe where they never met. Show how their lives would be different, and then unite them in a surprising way that feels destined.`,
        future: `Jump 10 years into the future. Show how their love has evolved, what they've built together, and the beautiful life they've created.`,
        royal: `Reimagine their love story in a royal court setting. They're prince/princess, nobles, or legendary figures. Keep the intimacy but add grand pageantry.`,
        'alternate-ending': `Write an alternate, bittersweet ending that's equally beautiful but shows different life choices they could have made. End with hope.`,
      };

      const prompt =
        variantPrompts[request.variantType] ||
        'Generate a unique variant of this love story.';

      const response = await this.makeRequest(prompt);
      const preview = response.substring(0, 200);

      return {
        success: true,
        variantId: `variant-${request.parentUniverseId}-${request.variantType}`,
        chapters: [],
        preview,
      };
    } catch (error) {
      return {
        success: false,
        variantId: '',
        chapters: [],
        preview: '',
        error:
          error instanceof Error ? error.message : 'Variant generation failed',
      };
    }
  }

  /**
   * Improve and rewrite content with specific feedback
   */
  async improveContent(
    content: string,
    feedback: string
  ): Promise<string> {
    const prompt = `Current text:
    "${content}"
    
    Feedback/request:
    "${feedback}"
    
    Improve the text based on the feedback. Keep it poetic, emotional, and concise.`;

    try {
      return await this.makeRequest(prompt);
    } catch {
      return content;
    }
  }

  /**
   * Generate tone-specific ambient audio suggestions
   */
  getAudioSuggestions(tone: string): string[] {
    const toneAudio: Record<string, string[]> = {
      romantic: ['soft-piano-love', 'whispered-declarations', 'heartbeat'],
      emotional: ['cinematic-strings', 'orchestral-swell', 'tender-moment'],
      funny: ['upbeat-whimsical', 'playful-pluck', 'happy-chime'],
      dramatic: ['dramatic-orchestral', 'thunder-rumble', 'intense-climax'],
      mysterious: ['suspenseful-ambient', 'whisper-effect', 'mystery-chord'],
      cute: ['cute-cheerful', 'playful-chime', 'sparkle-sound'],
      'dark-comedy': ['dark-comedic', 'mischievous-laugh', 'dramatic-crash'],
    };

    return toneAudio[tone] || toneAudio.romantic;
  }

  /**
   * Build prompt for chapter generation
   */
  private buildChapterPrompt(request: AIStoryGenerationRequest): string {
    const template = CHAPTER_TEMPLATES[request.chapterType];

    return template
      .replace('{heroName}', request.hero.name)
      .replace('{partnerName}', request.partner.name)
      .replace('{theme}', request.theme)
      .replace('{tone}', request.tone)
      .replace('{memory}', request.favoriteMemory)
      .replace('{partnerTraits}', request.partnerTraits)
      .replace('{promise}', request.promise);
  }

  /**
   * Parse AI response into page content structure
   */
  private parsePageContent(
    content: string,
    theme: UniverseTheme,
    chapterType: ChapterType
  ): PageContent[] {
    const themeConfig = THEME_COLORS[theme];
    const sentences = content.split(/(?<=[.!?])\s+/);

    const pages: PageContent[] = sentences
      .slice(0, 4)
      .map((sentence, index) => ({
        id: `page-${index}`,
        pageNumber: index,
        title:
          index === 0 ? this.getChapterTitle(chapterType) : undefined,
        mainText: sentence,
        animation: this.getAnimationType(index),
        particleEffect: themeConfig.particle || ParticleEffect.SPARKLES,
        backgroundTheme: theme,
        textColor: themeConfig.textColor,
        musicIntensity: 'soft' as const,
        interactiveElements: [],
        duration: 8,
        gradient: {
          from: themeConfig.primary,
          to: themeConfig.secondary,
        },
      }));

    return pages;
  }

  /**
   * Get chapter title
   */
  private getChapterTitle(type: ChapterType): string {
    const titles: Record<ChapterType, string> = {
      [ChapterType.COVER]: 'Our Story Universe',
      [ChapterType.DEDICATION]: 'Dedication',
      [ChapterType.CHAPTER_1]: 'How Fate Began',
      [ChapterType.CHAPTER_2]: 'The Moment Everything Changed',
      [ChapterType.CHAPTER_3]: 'Little Things I Love',
      [ChapterType.CHAPTER_4]: 'The Memory Time Kept',
      [ChapterType.CHAPTER_5]: 'The Promise',
      [ChapterType.FINAL]: 'Our Universe',
    };

    return titles[type];
  }

  /**
   * Get animation type based on page index
   */
  private getAnimationType(index: number): AnimationType {
    const types: AnimationType[] = [
      AnimationType.PAGE_TURN,
      AnimationType.FADE,
      AnimationType.SLIDE,
      AnimationType.ZOOM,
      AnimationType.GLOW,
      AnimationType.FLOATING,
    ];
    return types[index % types.length];
  }

  /**
   * Make API request to Azure OpenAI
   */
  private async makeRequest(prompt: string): Promise<string> {
    // In production, integrate with Azure OpenAI
    // For now, return enhanced mock responses

    const mockResponses: Record<string, string> = {
      'How Fate Began': `Under a sky scattered with infinite possibilities, two souls were written into the same story. ${prompt.substring(0, 50)}... The universe conspired in whispers, drawing their paths closer with each heartbeat, each coincidence, each moment that felt like destiny refusing to wait.`,

      'The Moment Everything Changed': `There was a before, and an after. A single glance that rewrote eternity. In that breath of time, everything they thought they knew about themselves transformed. Suddenly, the world wasn't about finding themselves anymore—it was about finding each other.`,

      'Little Things I Love': `It's not the grand gestures that build forever. It's the way they laugh at their own jokes. The unconscious grace of their movements. The little rituals that have become the poetry of our everyday. Every small thing is a love letter written without words.`,

      'The Memory Time Kept': `This moment lives forever, crystallized in amber light. A perfect day that needs no retelling because it's written in our souls. Time tried to pass, but here, in this memory, we are eternal—frozen in a kiss, a laugh, a promise whispered under stars.`,

      'The Promise': `I promise you forever, not as a destination, but as a direction. Through seasons that change and years that blur, through storms and silences and quiet mornings. I choose you—again and again, in every version of this story.`,

      'Our Universe': `And so their universe spun into being. Not a perfect place, but a true one. Built on laughter and tears, on promises kept and moments cherished. They became each other's gravity, each other's North Star. In infinite universes, across all timelines, their souls would choose each other. This is their story. This is only the beginning.`,
    };

    for (const [key, value] of Object.entries(mockResponses)) {
      if (prompt.includes(key)) {
        return value;
      }
    }

    return `A beautiful moment unfolds... ${prompt.substring(0, 100)}...`;
  }
}

export const universeAI = new UniverseAIService();

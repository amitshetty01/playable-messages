import { AIAssistantRequest, AIAssistantResponse, Book, Chapter, Scene } from './book-types';

export class BookAIService {
  private apiEndpoint = '/api/ai/book';

  async generateChapter(
    book: Partial<Book>,
    outline: string,
    targetWordCount: number = 3000
  ): Promise<AIAssistantResponse> {
    return this.makeRequest('generate-chapter', {
      book,
      instruction: `Generate a chapter for this book. Outline: ${outline}`,
      parameters: {
        maxTokens: Math.ceil(targetWordCount / 4),
        temperature: 0.7,
      },
    });
  }

  async improveScene(scene: Scene, feedback: string): Promise<AIAssistantResponse> {
    return this.makeRequest('suggest-improvements', {
      scene,
      instruction: `Improve this scene based on feedback: ${feedback}`,
      parameters: { temperature: 0.5 },
    });
  }

  async fixTone(content: string, desiredTone: string): Promise<AIAssistantResponse> {
    return this.makeRequest('fix-tone', {
      context: {
        instruction: `Rewrite this content in a ${desiredTone} tone: ${content}`,
      },
      parameters: { temperature: 0.6 },
    });
  }

  async expandScene(scene: Scene, targetLength: number = 1500): Promise<AIAssistantResponse> {
    return this.makeRequest('expand-scene', {
      scene,
      instruction: `Expand this scene to approximately ${targetLength} words with more detail and dialogue`,
      parameters: { maxTokens: Math.ceil(targetLength / 4) },
    });
  }

  async checkCharacterConsistency(book: Book, character: any, recentScenes: Scene[]): Promise<AIAssistantResponse> {
    return this.makeRequest('character-check', {
      book,
      character,
      instruction: `Check character consistency across these scenes. Character: ${JSON.stringify(character)}`,
      parameters: { temperature: 0.3 },
    });
  }

  async checkPlotConsistency(book: Book, proposedScene: string): Promise<AIAssistantResponse> {
    return this.makeRequest('plot-consistency', {
      book,
      instruction: `Check if this proposed scene is consistent with the existing plot: ${proposedScene}`,
      parameters: { temperature: 0.2 },
    });
  }

  async generateDialogue(
    characters: any[],
    situation: string,
    tone: string = 'natural'
  ): Promise<AIAssistantResponse> {
    return this.makeRequest('dialogue-generation', {
      context: {
        instruction: `Generate ${tone} dialogue between these characters in this situation: ${situation}`,
        parameters: { characters },
      },
      parameters: { temperature: 0.8 },
    });
  }

  async suggestNextScene(book: Book, currentChapter: Chapter): Promise<AIAssistantResponse> {
    return this.makeRequest('scene-suggestion', {
      book,
      chapter: currentChapter,
      instruction: `Suggest compelling next scenes for this chapter based on the plot structure and pacing`,
      parameters: { temperature: 0.7 },
    });
  }

  async analyzeWritingStyle(content: string): Promise<AIAssistantResponse> {
    return this.makeRequest('analyze-style', {
      context: {
        instruction: `Analyze the writing style of this content and provide metrics`,
      },
      parameters: { temperature: 0.2 },
    });
  }

  async generateCoverDescription(book: Book): Promise<AIAssistantResponse> {
    return this.makeRequest('generate-cover-description', {
      book,
      instruction: `Generate a detailed visual description for a book cover based on this book's content and genre`,
      parameters: { maxTokens: 200 },
    });
  }

  async generateMetadata(book: Book): Promise<AIAssistantResponse> {
    return this.makeRequest('generate-metadata', {
      book,
      instruction: `Generate SEO-optimized keywords and descriptions for publishing`,
      parameters: { maxTokens: 300 },
    });
  }

  private async makeRequest(
    type: string,
    context: any
  ): Promise<AIAssistantResponse> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, context }),
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Batch processing for multiple scenes
  async batchAnalyzePlotHoles(book: Book): Promise<AIAssistantResponse> {
    return this.makeRequest('batch-plot-analysis', {
      book,
      instruction: `Analyze all chapters for plot holes, timeline inconsistencies, and character development issues`,
      parameters: { temperature: 0.2 },
    });
  }

  // Real-time suggestions as user types
  async realTimeSuggestions(content: string, context: any): Promise<AIAssistantResponse> {
    return this.makeRequest('real-time-suggestion', {
      context: {
        ...context,
        instruction: `Provide real-time writing suggestions for this content`,
      },
      parameters: { temperature: 0.3, maxTokens: 200 },
    });
  }
}

export const bookAI = new BookAIService();

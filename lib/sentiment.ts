import type { Tone, ThemeName } from "@/lib/types";

type SentimentResult = {
  tone: Tone;
  theme: ThemeName;
  confidence: number;
};

const POSITIVE_WORDS = ['love', 'happy', 'beautiful', 'wonderful', 'amazing', 'great', 'joy', 'smile', 'laugh', 'fun', 'best', 'gift', 'celebrate', 'party', 'surprise', 'thank', 'blessed', 'grateful', 'cherish', 'adore'];
const SORRY_WORDS = ['sorry', 'apologize', 'regret', 'forgive', 'mistake', 'wrong', 'fault', 'miss', 'wish', 'if only', 'please', 'forgive me', 'pardon', 'remorse', 'guilty'];
const SAVAGE_WORDS = ['roast', 'burn', 'savage', 'brutal', 'truth', 'fact', 'real talk', 'straight up', 'no cap', 'dead', 'cry', 'lmao', 'lol'];
const SAD_WORDS = ['miss', 'sad', 'cry', 'tears', 'alone', 'hurts', 'pain', 'broken', 'heart', 'ache', 'goodbye', 'farewell', 'remember', 'past', 'memory'];
const FRIENDSHIP_WORDS = ['friend', 'bestie', 'bro', 'sis', 'buddy', 'pal', 'partner in crime', 'ride or die', 'forever', 'always', 'together', 'squad', 'crew'];
const BIRTHDAY_WORDS = ['birthday', 'happy birthday', 'bday', 'cake', 'candle', 'wish', 'celebrate', 'year older', 'special day', 'born', 'anniversary'];

function countMatches(text: string, words: string[]): number {
  const lower = text.toLowerCase();
  return words.filter(w => lower.includes(w)).length;
}

export function analyzeSentiment(text: string): SentimentResult {
  const lower = text.toLowerCase();
  
  const scores = {
    Romantic: countMatches(lower, POSITIVE_WORDS) * 1.5 + (lower.includes('love') ? 3 : 0) + (lower.includes('heart') ? 2 : 0),
    Sorry: countMatches(lower, SORRY_WORDS) * 2 + (lower.includes('sorry') ? 4 : 0),
    Savage: countMatches(lower, SAVAGE_WORDS) * 2,
    Emotional: countMatches(lower, SAD_WORDS) * 1.5 + (lower.includes('miss') ? 3 : 0),
    Friendship: countMatches(lower, FRIENDSHIP_WORDS) * 2,
    Birthday: countMatches(lower, BIRTHDAY_WORDS) * 2.5,
    Funny: lower.includes('\uD83D\uDE02') || lower.includes('lol') || lower.includes('haha') ? 3 : 0,
    Mystery: lower.includes('secret') || lower.includes('surprise') || lower.includes('guess') ? 2 : 0,
  };

  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const top = sorted[0];
  
  const toneMap: Record<string, Tone> = {
    Romantic: 'Romantic',
    Sorry: 'Sorry',
    Savage: 'Savage',
    Emotional: 'Emotional',
    Friendship: 'Friendship',
    Birthday: 'Birthday',
    Funny: 'Funny',
    Mystery: 'Mystery',
  };

  const themeMap: Record<string, ThemeName> = {
    Romantic: 'Dark Romantic',
    Sorry: 'Cinematic Purple',
    Savage: 'Minimal Black',
    Emotional: 'Cinematic Purple',
    Friendship: 'Soft Pastel',
    Birthday: 'Cute Pink',
    Funny: 'Neon Glitch',
    Mystery: 'Cinematic Purple',
  };

  return {
    tone: toneMap[top[0]] || 'Romantic',
    theme: themeMap[top[0]] || 'Dark Romantic',
    confidence: top[1] > 0 ? Math.min(top[1] / 10, 1) : 0,
  };
}

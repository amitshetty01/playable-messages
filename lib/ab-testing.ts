// Simple A/B testing utility using deterministic bucketing
const STORAGE_KEY = 'craft-ab-tests';

type ABTest = {
  id: string;
  variants: string[];
};

const ACTIVE_TESTS: ABTest[] = [
  { id: 'hero-cta-text', variants: ['Create an Experience', 'Make Something Beautiful', 'Start Your Surprise'] },
  { id: 'create-button-style', variants: ['premium-button', 'ghost-button'] },
];

function getBucket(userId: string, testId: string, variantsCount: number): number {
  let hash = 0;
  const str = userId + testId;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % variantsCount;
}

function getUserId(): string {
  try {
    if (typeof window === "undefined") return "ssr-fallback";
    let id = localStorage.getItem('craft-user-id');
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
      localStorage.setItem('craft-user-id', id);
    }
    return id;
  } catch {
    return "ssr-fallback";
  }
}

export function getVariant(testId: string): string {
  const test = ACTIVE_TESTS.find(t => t.id === testId);
  if (!test) return '';
  const userId = getUserId();
  const bucket = getBucket(userId, testId, test.variants.length);
  return test.variants[bucket];
}

export function getVariantIndex(testId: string): number {
  const test = ACTIVE_TESTS.find(t => t.id === testId);
  if (!test) return 0;
  const userId = getUserId();
  return getBucket(userId, testId, test.variants.length);
}

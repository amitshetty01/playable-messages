export function detectBrowserLanguage(): string {
  if (typeof window === 'undefined') return 'en';
  return navigator.language?.split('-')[0] || 'en';
}

export async function translateText(text: string, targetLang: string): Promise<string> {
  if (targetLang === 'en' || !text.trim()) return text;
  
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
    const data = await response.json();
    return data.responseData?.translatedText || text;
  } catch {
    return text;
  }
}

export function shouldTranslate(creatorLang: string, recipientLang: string): boolean {
  return creatorLang !== recipientLang && recipientLang !== 'en';
}

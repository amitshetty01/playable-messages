export function pickTemplate(text: string): string {
  const lower = text.toLowerCase();
  if (/sorry|apolog|forgive|regret|mistake|wrong|miss you/i.test(lower)) return "kitty-apology";
  if (/love|crush|like.*you|heart|beautiful|gorgeous|cute|sweet/i.test(lower)) return "love-chase";
  if (/lol|haha|funny|joke|roast|laugh/i.test(lower)) return "roast-to-respect";
  if (/friend|bestie|bff|buddy|pal/i.test(lower)) return "memory-journey";
  if (/birthday|happy.*day|celebrate/i.test(lower)) return "birthday-surprise-journey";
  if (/miss|memory|remember|nostalgia/i.test(lower)) return "memory-journey";
  if (/secret|hidden|confess|admit/i.test(lower)) return "secret-letter";
  return "love-chase";
}

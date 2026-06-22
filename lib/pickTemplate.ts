export function pickTemplate(text: string): string {
  const lower = text.toLowerCase();
  if (/sorry|apolog|forgive|regret|mistake|wrong|miss you/i.test(lower)) return "kitty-apology";
  if (/love|crush|like.*you|heart|beautiful|gorgeous|cute|sweet/i.test(lower)) return "love-chase";
  if (/prank|come closer|gotcha|fool|trick|got you/i.test(lower)) return "come-closer";
  if (/lol|haha|funny|joke|roast|laugh/i.test(lower)) return "come-closer";
  if (/friend|bestie|bff|buddy|pal/i.test(lower)) return "memory-maze";
  if (/birthday|happy.*day|celebrate/i.test(lower)) return "birthday-surprise-journey";
  if (/miss|memory|remember|nostalgia/i.test(lower)) return "memory-maze";
  if (/secret|hidden|confess|admit/i.test(lower)) return "escape-me";
  return "love-chase";
}

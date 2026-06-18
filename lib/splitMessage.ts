export function splitMessage(message: string, targetCount: number): string[] {
  const sentences = message.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length >= targetCount) {
    return sentences.slice(0, targetCount);
  }
  const words = message.split(/\s+/).filter(Boolean);
  if (words.length === 0) return Array(targetCount).fill("");
  const perChunk = Math.ceil(words.length / targetCount);
  const result: string[] = [];
  for (let i = 0; i < targetCount; i++) {
    const chunk = words.slice(i * perChunk, (i + 1) * perChunk).join(" ");
    result.push(chunk || "");
  }
  return result;
}

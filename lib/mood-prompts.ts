import type { Tone } from "@/lib/types";

type MoodPrompt = {
  id: string;
  title: string;
  description: string;
  tone: Tone;
  prompt: string;
  emoji: string;
  dayOfYear: number;
};

const MOOD_PROMPTS: Omit<MoodPrompt, "dayOfYear">[] = [
  { id: "grateful", title: "Feeling Grateful?", description: "Send a thank-you to someone who helped you this week.", tone: "Emotional", prompt: "I've been thinking about how much you mean to me...", emoji: "🙏" },
  { id: "miss-you", title: "Missing Someone?", description: "Let them know they're on your mind.", tone: "Romantic", prompt: "I was just thinking about you and had to say something...", emoji: "💗" },
  { id: "sorry", title: "Need to Apologize?", description: "A sincere apology is braver than silence.", tone: "Sorry", prompt: "I've been wanting to say this... I'm sorry.", emoji: "🥺" },
  { id: "roast", title: "Feeling Playful?", description: "A friendly roast is the new 'I love you'.", tone: "Savage", prompt: "Okay, I have some thoughts about you... 🔥", emoji: "😏" },
  { id: "birthday", title: "Someone's Birthday?", description: "Don't let the day pass without a smile.", tone: "Birthday", prompt: "It's your special day and I couldn't let it pass without saying...", emoji: "🎂" },
  { id: "laugh", title: "Need a Laugh?", description: "Share a funny thought with a friend.", tone: "Funny", prompt: "I was trying to be serious but then I remembered you exist...", emoji: "😂" },
  { id: "friendship", title: "Best Friend Check-in?", description: "A quick 'I see you' can change someone's day.", tone: "Friendship", prompt: "Just wanted to remind you that you're stuck with me...", emoji: "🤝" },
  { id: "mystery", title: "Feeling Mysterious?", description: "Send a puzzle only they can solve.", tone: "Mystery", prompt: "Some messages aren't meant to be read. But you should read this one.", emoji: "🔮" },
  { id: "love", title: "Heart Full of Love?", description: "Tell them before the moment passes.", tone: "Romantic", prompt: "I don't say this enough, but you're the best part of my days.", emoji: "💖" },
  { id: "forgive", title: "Ready to Forgive?", description: "Let go of the weight and reach out.", tone: "Emotional", prompt: "Life is too short for grudges. I forgive you. I miss you.", emoji: "🕊️" },
  { id: "surprise", title: "Random Surprise?", description: "The best messages are the unexpected ones.", tone: "Funny", prompt: "Surprise! You didn't expect to hear from me today, did you?", emoji: "🎉" },
  { id: "proud", title: "Feeling Proud?", description: "Tell someone you're proud of them.", tone: "Emotional", prompt: "I just wanted to say — I'm so incredibly proud of you.", emoji: "🌟" },
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function getDailyPrompt(): MoodPrompt {
  const dayOfYear = getDayOfYear();
  const index = Math.floor(seededRandom(dayOfYear * 7) * MOOD_PROMPTS.length);
  return { ...MOOD_PROMPTS[index], dayOfYear };
}

export function getAllPrompts() {
  return MOOD_PROMPTS;
}

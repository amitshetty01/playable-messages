import type { Category, Template, ThemeName, Tone } from "@/lib/types";

export const tones: Tone[] = ["Romantic", "Funny", "Sorry", "Savage", "Emotional", "Mystery", "Birthday", "Friendship"];

export const themes: ThemeName[] = [
  "Dark Romantic",
  "Soft Pastel",
  "Minimal Black",
  "Cute Pink",
  "Neon Glitch",
  "Cinematic Purple",
  "Clean White"
];

export const categories: Category[] = [
  {
    slug: "love-crush",
    name: "Love & Crush",
    icon: "LC",
    accent: "#ff5fb7",
    description: "For romantic, crush, confession, missing someone, or relationship messages."
  },
  {
    slug: "apology-fight-repair",
    name: "Apology & Fight Repair",
    icon: "AF",
    accent: "#7c5cff",
    description: "For saying sorry, fixing mood, calming anger, or restarting a conversation."
  },
  {
    slug: "friendship-best-friend",
    name: "Friendship & Best Friend",
    icon: "BF",
    accent: "#23d3ee",
    description: "For best friends, inside jokes, teasing, appreciation, emotional friendship messages, and funny moments."
  },
  {
    slug: "birthday-special-days",
    name: "Birthday & Special Days",
    icon: "BD",
    accent: "#ffd166",
    description: "For birthdays, anniversaries, congratulations, achievements, and special memories."
  },
  {
    slug: "mystery-confession",
    name: "Mystery & Confession",
    icon: "MC",
    accent: "#a070ff",
    description: "For suspenseful reveals, hidden messages, emotional secrets, and dramatic storytelling."
  },
  {
    slug: "funny-roast",
    name: "Funny & Roast",
    icon: "FR",
    accent: "#ff6b8a",
    description: "For playful roasts, attitude jokes, dramatic reactions, and shareable fun."
  }
];

export const templates: Template[] = [
  {
    id: "the-final-button",
    slug: "moving-button",
    title: "Moving Button",
    hook: "Catch the button if you can.",
    categorySlugs: ["love-crush", "mystery-confession"],
    bestFor: "love, crush, mystery, playful dares",
    length: "1 minute",
    tone: "Emotional",
    theme: "Dark Romantic",
    status: "full",
    formula: ["Chase the button", "Catch the words", "Final reveal"],
    description: "Write a short secret message. The button runs away — they have to catch it to read what you said."
  },
  {
    id: "the-last-deleted-message",
    slug: "the-last-deleted-message",
    title: "The Last Deleted Message",
    hook: "I typed something for you... then deleted it.",
    categorySlugs: ["mystery-confession"],
    bestFor: "friendship, apology, crush, birthday, regret",
    length: "2 minutes",
    tone: "Emotional",
    theme: "Minimal Black",
    status: "full",
    formula: ["Deleted chat", "Version choices", "Soft unlock", "Honest reveal", "Create your own"],
    description: "Type what you almost said but deleted. Each restored version gets closer to the real truth you wanted to share."
  },
  {
    id: "the-risk-button",
    slug: "the-risk-button",
    title: "The Risk Button",
    hook: "Every button below reveals something. Choose your risk.",
    categorySlugs: ["mystery-confession", "love-crush", "friendship-best-friend"],
    bestFor: "mystery, crush, friendship",
    length: "1 minute",
    tone: "Mystery",
    theme: "Cinematic Purple",
    status: "full",
    formula: ["Choice ladder", "Bolder buttons", "Surprise choice", "Truth reveal", "Share"],
    description: "Write something bold. The reader picks buttons that get riskier — your message lands harder the deeper they go."
  },
  {
    id: "glitch-truth",
    slug: "glitch-truth",
    title: "Glitch Truth",
    hook: "This is just a normal page.",
    categorySlugs: ["mystery-confession"],
    bestFor: "mystery, confession, hidden truth",
    length: "1 minute",
    tone: "Mystery",
    theme: "Neon Glitch",
    status: "full",
    formula: ["Normal text", "Glitch", "Truth override", "System fixed", "Create"],
    description: "Write a secret you've been hiding. The page glitches and breaks until the real truth appears."
  },
  {
    id: "dont-smile-challenge",
    slug: "dont-smile-challenge",
    title: "Don't Smile Challenge",
    hook: "Your challenge is simple. Don't smile.",
    categorySlugs: ["friendship-best-friend", "funny-roast", "love-crush"],
    bestFor: "friendship, funny, love",
    length: "1 minute",
    tone: "Funny",
    theme: "Soft Pastel",
    status: "full",
    formula: ["Challenge", "Defiance", "Escalation", "Smile reveal", "Share"],
    description: "Write something sweet or funny. They'll try not to smile — but your words will crack them."
  },
  {
    id: "choose-my-punishment",
    slug: "choose-my-punishment",
    title: "Choose My Apology",
    hook: "I messed up. Pick how I make it up to you.",
    categorySlugs: ["apology-fight-repair", "funny-roast"],
    bestFor: "apology, fight repair, funny",
    length: "1 minute",
    tone: "Sorry",
    theme: "Cinematic Purple",
    status: "full",
    formula: ["Funny repair", "Playful choice", "Real apology", "Sincere ending", "Create"],
    description: "Write your real apology. They pick your punishment first — then your sincere message unlocks."
  },
  {
    id: "mood-repair-machine",
    slug: "mood-repair-machine",
    title: "Mood Repair Machine",
    hook: "Mood repair machine started.",
    categorySlugs: ["apology-fight-repair", "friendship-best-friend", "funny-roast"],
    bestFor: "apology, friendship, funny",
    length: "1 minute",
    tone: "Funny",
    theme: "Clean White",
    status: "full",
    formula: ["Mood select", "Fake scan", "Playful result", "Human attention", "Share"],
    description: "Write a message to fix their mood. They pick how they feel — your words become the cure."
  },
  {
    id: "the-secret-room",
    slug: "the-secret-room",
    title: "The Secret Room",
    hook: "There is a secret room here. But you need the right password.",
    categorySlugs: ["mystery-confession", "love-crush", "friendship-best-friend", "birthday-special-days"],
    bestFor: "mystery, love, friendship, birthday",
    length: "2 minutes",
    tone: "Mystery",
    theme: "Cinematic Purple",
    status: "full",
    formula: ["Password door", "Wrong reactions", "Three boxes", "Secret reveal", "Create"],
    description: "Write three little hints and one big reveal. They unlock boxes one by one until your final message appears."
  },
  {
    id: "memory-maze",
    slug: "memory-maze",
    title: "Memory Maze",
    hook: "You are inside a memory. Find the exit.",
    categorySlugs: ["friendship-best-friend", "birthday-special-days", "love-crush"],
    bestFor: "friendship, birthday, love, missing someone",
    length: "2 minutes",
    tone: "Emotional",
    theme: "Dark Romantic",
    status: "full",
    formula: ["Memory doors", "Custom moments", "Unsaid thing", "Exit reveal", "Share"],
    description: "Write a few memories you shared. Each door they open reveals one moment leading to your final message."
  },
  {
    id: "roast-to-respect",
    slug: "roast-to-respect",
    title: "Roast-to-Respect",
    hook: "I will roast you first. Then say the truth.",
    categorySlugs: ["funny-roast", "friendship-best-friend"],
    bestFor: "funny, friendship, appreciation",
    length: "1 minute",
    tone: "Savage",
    theme: "Minimal Black",
    status: "full",
    formula: ["Mild roast", "Escalating joke", "Emotional pivot", "Respect reveal", "Create"],
    description: "Write a funny jab and a sincere message. They get roasted first — then hit with the real feels."
  },
  {
    id: "birthday-surprise-journey",
    slug: "birthday-surprise-journey",
    title: "Birthday Surprise Journey",
    hook: "Start in darkness, end with a celebration.",
    categorySlugs: ["birthday-special-days", "friendship-best-friend"],
    bestFor: "birthday, celebration, surprise",
    length: "2 minutes",
    tone: "Birthday",
    theme: "Cute Pink",
    status: "full",
    formula: ["Dark room", "Turn on lights", "Balloons release", "Cake reveal", "Final message"],
    description: "A cinematic birthday journey from a dark room to a full celebration with lights, balloons, cake, and a personal message."
  },
  {
    id: "memory-journey",
    slug: "memory-journey",
    title: "Memory Journey",
    hook: "A scrapbook of moments we shared.",
    categorySlugs: ["friendship-best-friend", "love-crush", "birthday-special-days"],
    bestFor: "friendship, memory, love, missing someone",
    length: "2 minutes",
    tone: "Emotional",
    theme: "Dark Romantic",
    status: "full",
    formula: ["Start journey", "Memory card 1", "Funny moment", "Special moment", "Final letter"],
    description: "A visual scrapbook timeline where each step reveals a memory card that builds up to a final emotional letter."
  },
  {
    id: "secret-letter",
    slug: "secret-letter",
    title: "Secret Letter",
    hook: "A sealed letter with three locks.",
    categorySlugs: ["love-crush", "mystery-confession"],
    bestFor: "confession, love, mystery, secret",
    length: "2 minutes",
    tone: "Mystery",
    theme: "Cinematic Purple",
    status: "full",
    formula: ["Tap envelope", "Break seal 1", "Break seal 2", "Break seal 3", "Letter opens"],
    description: "A sealed letter experience where each broken seal reveals a small message before the final letter opens with animation."
  },
  {
    id: "surprise-room",
    slug: "surprise-room",
    title: "Surprise Room",
    hook: "Four boxes. One truth.",
    categorySlugs: ["mystery-confession", "love-crush", "friendship-best-friend"],
    bestFor: "mystery, surprise, love, friendship",
    length: "2 minutes",
    tone: "Mystery",
    theme: "Cinematic Purple",
    status: "full",
    formula: ["Enter room", "Open memory box", "Open compliment box", "Open secret box", "Final surprise"],
    description: "A private room with four locked boxes. Each box reveals a part of the message. The last box unlocks the final surprise."
  },
  {
    id: "type-or-else",
    slug: "type-or-else",
    title: "Type or Else",
    hook: "The message only reveals itself one keystroke at a time.",
    categorySlugs: ["mystery-confession", "love-crush"],
    bestFor: "mystery, crush, hidden truth",
    length: "2 minutes",
    tone: "Mystery",
    theme: "Minimal Black",
    status: "full",
    formula: ["Typing challenge", "Character match", "Idle fade", "Full reveal", "Share"],
    description: "A typing-based reveal where every correct keystroke advances the message. Stop for 5 seconds and it fades."
  },
  {
    id: "the-trust-scale",
    slug: "the-trust-scale",
    title: "The Trust Scale",
    hook: "How much do you trust this? Drag to find out.",
    categorySlugs: ["love-crush", "apology-fight-repair", "mystery-confession"],
    bestFor: "trust, love, apology, mystery",
    length: "2 minutes",
    tone: "Emotional",
    theme: "Cinematic Purple",
    status: "full",
    formula: ["Slider reveal", "Proportional text", "Creep-back tension", "Full trust unlock", "Share"],
    description: "A slider-based reveal where text appears proportionally to trust level. Release and it slowly fades back."
  },
  {
    id: "inkblot",
    slug: "inkblot",
    title: "Inkblot",
    hook: "The message is hidden in the ink. Develop it with your touch.",
    categorySlugs: ["mystery-confession", "love-crush", "friendship-best-friend"],
    bestFor: "mystery, love, friendship, birthday",
    length: "1 minute",
    tone: "Mystery",
    theme: "Dark Romantic",
    status: "full",
    formula: ["Hidden canvas", "Drag to develop", "Incremental reveal", "Full ink unlock", "Share"],
    description: "A canvas-based reveal where the hidden message develops under the user's touch like Polaroid ink."
  },
  {
    id: "two-lies-one-truth",
    slug: "two-lies-one-truth",
    title: "Two Lies, One Truth",
    hook: "Two are lies. One is the truth. Pick wisely.",
    categorySlugs: ["friendship-best-friend", "funny-roast", "mystery-confession"],
    bestFor: "friendship, funny, mystery, confession",
    length: "1 minute",
    tone: "Funny",
    theme: "Soft Pastel",
    status: "full",
    formula: ["Three statements", "Truth guessing", "Wrong shake", "Right reveal", "Share"],
    description: "A guessing game where the recipient must pick the one true statement among three."
  },
  {
    id: "the-closer-you-get",
    slug: "the-closer-you-get",
    title: "The Closer You Get",
    hook: "The message is hidden in plain sight. Zoom in to read it.",
    categorySlugs: ["mystery-confession", "love-crush", "friendship-best-friend"],
    bestFor: "mystery, love, friendship, birthday",
    length: "1 minute",
    tone: "Mystery",
    theme: "Dark Romantic",
    status: "full",
    formula: ["Zoom interface", "Blur to clarity", "Scale up", "Full reveal", "Share"],
    description: "A zoom-based reveal where the hidden message becomes clear the closer you get."
  },
  {
    id: "spin-to-reveal",
    slug: "spin-to-reveal",
    title: "Spin to Reveal",
    hook: "Spin the wheel to find out what fate has in store.",
    categorySlugs: ["mystery-confession", "love-crush", "friendship-best-friend", "birthday-special-days"],
    bestFor: "mystery, love, friendship, birthday",
    length: "1 minute",
    tone: "Mystery",
    theme: "Cinematic Purple",
    status: "full",
    formula: ["Spin wheel", "Segment land", "Themed prompt", "Final reveal", "Share"],
    description: "A wheel-of-fortune style spinner that lands on a themed segment before revealing the real message."
  },
  {
    id: "love-chase",
    slug: "love-chase",
    title: "Catch My Heart",
    hook: "Two buttons. One truth. The other runs forever.",
    categorySlugs: ["love-crush"],
    bestFor: "love confessions, crushes, romantic dares",
    length: "1 minute",
    tone: "Romantic",
    theme: "Cute Pink",
    status: "full",
    formula: ["Love chase", "Truth or dodge", "Final reveal"],
    description: "Two buttons appear. One says 'You love me'. The other runs away forever. Catch the truth."
  },
  {
    id: "heartbeat-sync",
    slug: "heartbeat-sync",
    title: "Heartbeat Sync",
    hook: "Find my heartbeat. The message follows its rhythm.",
    categorySlugs: ["love-crush"],
    bestFor: "love confessions, romantic messages, missing someone",
    length: "30 seconds",
    tone: "Romantic",
    theme: "Cute Pink",
    status: "full",
    formula: ["Pick a petal", "Sync the heartbeat", "Words arrive in rhythm", "Final message"],
    description: "Tap to find the sender's heartbeat rhythm. Once synced, their message arrives word by word, pulsing in time with your heartbeat."
  },
  {
    id: "polaroid-stack",
    slug: "polaroid-stack",
    title: "Polaroid Stack",
    hook: "Lift each photo. One memory at a time.",
    categorySlugs: ["friendship-best-friend", "love-crush", "birthday-special-days"],
    bestFor: "memories, nostalgia, emotional messages, friendship",
    length: "30 seconds",
    tone: "Emotional",
    theme: "Soft Pastel",
    status: "full",
    formula: ["Developing photos", "Choose which to lift", "Memories revealed", "Handwritten finale"],
    description: "A stack of polaroid photos hides your message. The recipient lifts each photo to reveal a memory, ending with a handwritten final message on the back of the last photo."
  },
  {
    id: "scratch-card",
    slug: "scratch-card",
    title: "Scratch Card",
    hook: "Scratch the surface. Your message is underneath.",
    categorySlugs: ["mystery-confession", "friendship-best-friend"],
    bestFor: "mystery, friendship, love, surprises",
    length: "30 seconds",
    tone: "Mystery",
    theme: "Dark Romantic",
    status: "full",
    formula: ["Metallic layer", "Scratch to reveal", "Words emerge", "Final message"],
    description: "A metallic scratch card hiding your message. They scratch the surface to reveal what you wrote underneath."
  },
  {
    id: "tilt-maze",
    slug: "tilt-maze",
    title: "Tilt Maze",
    hook: "Guide the ball through the maze. The message waits at the end.",
    categorySlugs: ["mystery-confession", "love-crush"],
    bestFor: "mystery, love, playful challenges",
    length: "45 seconds",
    tone: "Mystery",
    theme: "Cinematic Purple",
    status: "full",
    formula: ["Enter maze", "Navigate tunnels", "Reach the goal", "Message unlocked"],
    description: "A simple maze with a hidden message at the exit. Navigate the ball through walls to reach your words."
  },
  {
    id: "morse-code",
    slug: "morse-code",
    title: "Morse Code",
    hook: "Tap the rhythm. Decode the message.",
    categorySlugs: ["love-crush", "mystery-confession"],
    bestFor: "love, mystery, emotional confessions",
    length: "30 seconds",
    tone: "Romantic",
    theme: "Dark Romantic",
    status: "full",
    formula: ["Watch the pattern", "Tap dot or dash", "Match the code", "Words unlocked"],
    description: "A rhythmic code-breaking experience. Match dot and dash patterns to decode each word of your message."
  },
  {
    id: "dissolve-wall",
    slug: "dissolve-wall",
    title: "Dissolve Wall",
    hook: "Press through the ice. Warmth reveals the truth.",
    categorySlugs: ["apology-fight-repair", "love-crush"],
    bestFor: "apology, love, emotional repair",
    length: "30 seconds",
    tone: "Sorry",
    theme: "Minimal Black",
    status: "full",
    formula: ["Frost wall", "Touch to melt", "Words thaw", "Full message"],
    description: "An icy wall covers your words. The recipient melts it with their touch, revealing your message gradually like thawing frost."
  },
  {
    id: "lock-pick",
    slug: "lock-pick",
    title: "Lock Pick",
    hook: "Three locks. One message. Find each sweet spot.",
    categorySlugs: ["mystery-confession", "funny-roast"],
    bestFor: "mystery, savage, playful dares",
    length: "45 seconds",
    tone: "Savage",
    theme: "Neon Glitch",
    status: "full",
    formula: ["Lock 1", "Find the tension", "Lock 2", "Lock 3", "Chest opens"],
    description: "A tension-based lockpicking game. Drag the pick to find three hidden sweet spots and unlock your message."
  },
  {
    id: "gravity-flip",
    slug: "gravity-flip",
    title: "Gravity Flip",
    hook: "Words are floating. Bring them back to earth.",
    categorySlugs: ["funny-roast", "friendship-best-friend"],
    bestFor: "funny, friendship, playful messages",
    length: "20 seconds",
    tone: "Funny",
    theme: "Soft Pastel",
    status: "full",
    formula: ["Floating words", "Flip gravity", "Words fall", "Message assembled"],
    description: "Your message is scattered in zero gravity. Each flip pulls the words back down until they form your full message."
  },
  {
    id: "echo-chamber",
    slug: "echo-chamber",
    title: "Echo Chamber",
    hook: "Type each word back. Watch it echo.",
    categorySlugs: ["funny-roast", "friendship-best-friend", "love-crush"],
    bestFor: "funny, friendship, love, interactive",
    length: "30 seconds",
    tone: "Funny",
    theme: "Clean White",
    status: "full",
    formula: ["Word prompt", "Type it back", "Echo animation", "Message built"],
    description: "Each word of your message must be echoed back. Type what you see and watch it grow into a full message."
  },
  {
    id: "balance-scale",
    slug: "balance-scale",
    title: "Balance Scale",
    hook: "Balance the scale. The truth is in the equilibrium.",
    categorySlugs: ["apology-fight-repair", "love-crush", "mystery-confession"],
    bestFor: "apology, trust, love, emotional messages",
    length: "45 seconds",
    tone: "Emotional",
    theme: "Cinematic Purple",
    status: "full",
    formula: ["See the weight", "Drag word tokens", "Balance the scale", "Message unlocks"],
    description: "A balance scale with word-weights. Drag the right words onto the pan to match the weight and unlock the message."
  },
  {
    id: "candle-countdown",
    slug: "candle-countdown",
    title: "Candle Countdown",
    hook: "Blow out each candle. Each one holds a word.",
    categorySlugs: ["birthday-special-days", "friendship-best-friend"],
    bestFor: "birthdays, celebrations, achievements",
    length: "20 seconds",
    tone: "Birthday",
    theme: "Cute Pink",
    status: "full",
    formula: ["Lighting candles", "Make a wish", "Blow them out", "Message revealed"],
    description: "A birthday cake with candles. Each candle holds a word of the message. Blow them out one by one to read the full birthday wish."
  },
];

const templateRouteAliases: Record<string, string> = {
  "secret-room": "the-secret-room"
};

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getTemplate(idOrSlug: string) {
  const normalized = templateRouteAliases[idOrSlug] || idOrSlug;
  return templates.find((template) => template.id === normalized || template.slug === normalized);
}

export function getTemplateSeoSlug(template: Template) {
  return template.id === "the-secret-room" ? "secret-room" : template.slug;
}

export function getTemplatesByCategory(slug: string) {
  return templates.filter((template) => template.categorySlugs.includes(slug));
}

export function getTemplateCategory(template: Template) {
  return categories.find((category) => template.categorySlugs.includes(category.slug)) ?? categories[0];
}

export const defaultCustomMessages = {
  landingText: "There is one button I made for you to press.",
  buttonText: "Start the reveal",
  steps: [
    "I made this because a normal text felt too easy to ignore.",
    "I don't always know how to say this directly.",
    "But this moment deserves better than a plain message.",
    "Some things are better said than typed.",
    "And some feelings need more than words.",
    "This is my way of making sure you know."
  ],
  ctaMessage: "Create your own interactive message."
};

export const defaultFinalMessage = "Here is the real message: you matter more than I usually know how to say.";

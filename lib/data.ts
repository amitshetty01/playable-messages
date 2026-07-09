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
    categorySlugs: ["love-crush"],
    bestFor: "love, crush, mystery, playful dares",
    length: "1 minute",
    tone: "Emotional",
    theme: "Dark Romantic",
    status: "full",
    formula: ["Chase the button", "Catch the words", "Final reveal"],
    description: "Write a short secret message. The button runs away — they have to catch it to read what you said."
  },
  {
    id: "memory-maze",
    slug: "memory-maze",
    title: "Heart Vault",
    hook: "Touch the beating heart. Speak the password. Enter a world of memories.",
    categorySlugs: ["friendship-best-friend"],
    bestFor: "friendship, memories, nostalgia",
    length: "2 minutes",
    tone: "Emotional",
    theme: "Dark Romantic",
    status: "full",
    formula: ["Touch the heart", "Knock knock", "Enter the password", "Blackout", "Memory world", "Final words"],
    description: "A beating heart waits to be touched. Once you knock, a password screen appears — prove who you are to unlock a world of memories with photos, messages, and a final love note."
  },
  {
    id: "birthday-surprise-journey",
    slug: "birthday-surprise-journey",
    title: "Blow Out the Candles",
    hook: "Blow out each candle. The message appears in icing.",
    categorySlugs: ["birthday-special-days", "friendship-best-friend"],
    bestFor: "birthday, celebration, surprise",
    length: "2 minutes",
    tone: "Birthday",
    theme: "Cute Pink",
    status: "full",
    formula: ["Candle 1", "Candle 2", "Candle 3", "Candle 4", "Message in icing"],
    description: "Click or hold to blow out candles on a cake one by one, and the message appears in icing once the last one's out."
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
    id: "kitty-apology",
    slug: "kitty-apology",
    title: "Kitty Apology",
    hook: "A tiny kitty brought a letter. Please don't be mad…",
    categorySlugs: ["apology-fight-repair"],
    bestFor: "apologies, fight repair, making amends, cute sorry",
    length: "30 seconds",
    tone: "Sorry",
    theme: "Cute Pink",
    status: "full",
    formula: ["Kitty enters", "Cute comedy", "Letter appears", "Adorable sorry"],
    description: "A cute kitty appears, does funny little actions, then reveals an apology letter in the most adorable way possible."
  },
  {
    id: "come-closer",
    slug: "come-closer",
    title: "Come Closer Prank",
    hook: "i want to show u something only see it if u are alone and in a dark room",
    categorySlugs: ["funny-roast", "friendship-best-friend"],
    bestFor: "funny pranks, teasing, playful roasts, meme-worthy moments",
    length: "15 seconds",
    tone: "Funny",
    theme: "Minimal Black",
    status: "full",
    formula: ["Dark room setup", "Countdown 3-2-1", "BOOM flash", "Prank reveal"],
    description: "Tricks them into going to a dark room, then a sudden 3-2-1 countdown leads to a full-screen brightness blast and a hilarious reveal."
  },
  {
    id: "birthday-journey",
    slug: "birthday-journey",
    title: "Birthday Journey",
    hook: "A dark room. Balloons rise. A candle-lit cake waits.",
    categorySlugs: ["birthday-special-days"],
    bestFor: "birthday wishes, celebrations",
    length: "45 seconds",
    tone: "Birthday",
    theme: "Cute Pink",
    status: "full",
    formula: ["Dark room", "Balloons", "Blow candles", "Message revealed"],
    description: "Step into a dark room. Pop balloons. Blow out the candles A birthday message awaits in the light."
  },
  {
    id: "escape-me",
    slug: "escape-me",
    title: "Escape Me",
    hook: "Tap the arrows. Clear the heart Unlock what's hidden inside.",
    categorySlugs: ["love-crush", "funny-roast"],
    bestFor: "mystery, funny, suspense, hidden messages, puzzles",
    length: "30 seconds",
    tone: "Mystery",
    theme: "Dark Romantic",
    status: "full",
    formula: ["Heart of arrows", "Tap to remove", "Clear the path", "Message revealed"],
    description: "A heart made of arrow pieces Tap each arrow in the right order to clear the walls and unlock a hidden personal message inside."
  },
  {
    id: "sorry-maze",
    slug: "sorry-maze",
    title: "Sorry Maze",
    hook: "Find your way back through the maze",
    categorySlugs: ["funny-roast"],
    bestFor: "funny apologies, playful mazes, emotional puzzles",
    length: "30 seconds",
    tone: "Funny",
    theme: "Cinematic Purple",
    status: "full",
    formula: ["Enter maze", "Navigate walls", "Collect gems", "Reach the heart"],
    description: "Navigate a glowing maze to find your way back. Collect gems, avoid dead ends, and unlock a heartfelt message at the center."
  },
  {
    id: "our-memories",
    slug: "our-memories",
    title: "Our Memories",
    hook: "A beautiful scrapbook of your favorite memories together.",
    categorySlugs: ["friendship-best-friend", "love-crush"],
    bestFor: "love, memories, anniversaries, couples",
    length: "2 minutes",
    tone: "Romantic",
    theme: "Soft Pastel",
    status: "full",
    formula: ["Share your first memory", "Recall the little moments", "Make promises", "End with a heartfelt message"],
    description: "A beautiful interactive scrapbook where you can share your favorite memories, make promises, and create a lasting keepsake for someone special."
  },
  {
    id: "love-contract",
    slug: "love-contract",
    title: "Love Contract",
    hook: "A funny + emotional relationship contract with promises, rules, penalties, and signatures.",
    categorySlugs: ["love-crush", "funny-roast"],
    bestFor: "couples, anniversaries, proposals, funny relationship goals",
    length: "5 minutes",
    tone: "Romantic",
    theme: "Dark Romantic",
    status: "full",
    formula: ["Parchment opening", "Partner details", "Funny rules", "Heartfelt promises", "Penalties clause", "Secret wax seal", "Signatures", "Certificate"],
    description: "An interactive relationship contract between two partners with funny rules, heartfelt promises, playful penalties, a secret wax seal clause, and a beautiful signed certificate."
  },
];

export const comingSoonTemplates: Template[] = [
  { id: "the-last-deleted-message", slug: "the-last-deleted-message", title: "Static Frequency", hook: "Turn the dial through the static until the right frequency locks in", categorySlugs: ["love-crush"], bestFor: "regret, missing someone, apology", length: "2 minutes", tone: "Emotional", theme: "Minimal Black", status: "coming-soon", formula: ["Static hiss", "Tune the dial", "Frequency locks", "Message comes through"], description: "Like finding an old radio station that's been playing the whole time." },
  { id: "the-risk-button", slug: "the-risk-button", title: "Fate Cards", hook: "Three face-down cards. Each flip raises the stakes", categorySlugs: ["love-crush", "friendship-best-friend"], bestFor: "mystery, surprise, suspense", length: "1 minute", tone: "Mystery", theme: "Cinematic Purple", status: "coming-soon", formula: ["Card 1", "Card 2", "Card 3", "Final reveal"], description: "Three face-down cards — each flip reveals more until the last card holds the real message." },
  { id: "glitch-truth", slug: "glitch-truth", title: "Frozen in Ice", hook: "Break through the ice to set the message free", categorySlugs: ["love-crush"], bestFor: "confession, hidden truth, emotional", length: "1 minute", tone: "Mystery", theme: "Neon Glitch", status: "coming-soon", formula: ["Frozen block", "Chip the ice", "Deep cracks", "Shatter and reveal"], description: "Chip away the ice until it shatters and the words break free." },
  { id: "dont-smile-challenge", slug: "dont-smile-challenge", title: "Shake for an Answer", hook: "Shake the ball. Get an answer", categorySlugs: ["friendship-best-friend", "funny-roast", "love-crush"], bestFor: "friendship, funny, playful", length: "1 minute", tone: "Funny", theme: "Soft Pastel", status: "coming-soon", formula: ["Shake once", "Shake again", "One more", "Real answer"], description: "A fortune ball gives cheeky non-answers before landing on the real one." },
  { id: "choose-my-punishment", slug: "choose-my-punishment", title: "Calm the Storm", hook: "Breathe through the storm", categorySlugs: ["apology-fight-repair", "funny-roast"], bestFor: "apology, fight repair", length: "1 minute", tone: "Sorry", theme: "Cinematic Purple", status: "coming-soon", formula: ["Storm rises", "Breathe in", "Hold", "Release", "Message clear"], description: "Breathe through an on-screen guide until the apology becomes legible." },
  { id: "mood-repair-machine", slug: "mood-repair-machine", title: "Tug of War", hook: "Pull steadily. Earn the message back", categorySlugs: ["apology-fight-repair", "friendship-best-friend", "funny-roast"], bestFor: "apology, earning it back", length: "1 minute", tone: "Funny", theme: "Clean White", status: "coming-soon", formula: ["Grab the rope", "Pull hard", "Keep pulling", "Message won"], description: "A rope with real resistance — pull until you win the message back." },
  { id: "the-secret-room", slug: "the-secret-room", title: "Treasure Map", hook: "Drag the compass until it locks onto X", categorySlugs: ["love-crush", "friendship-best-friend", "birthday-special-days"], bestFor: "mystery, discovery", length: "2 minutes", tone: "Mystery", theme: "Cinematic Purple", status: "coming-soon", formula: ["Unfold map", "Drag compass", "Find the X", "Buried treasure"], description: "A hand-drawn map — drag the compass until it locks onto X." },
  { id: "roast-to-respect", slug: "roast-to-respect", title: "Climb the Mountain", hook: "Teasing checkpoints on the way up", categorySlugs: ["funny-roast", "friendship-best-friend"], bestFor: "funny, friendship", length: "1 minute", tone: "Savage", theme: "Minimal Black", status: "coming-soon", formula: ["Base camp", "Steep climb", "Teasing stop", "Near the top", "Summit reveal"], description: "Teasing checkpoints on the way up, something sincere at the summit." },
  { id: "memory-journey", slug: "memory-journey", title: "Braid a Bracelet", hook: "Weave three strands together", categorySlugs: ["friendship-best-friend", "love-crush", "birthday-special-days"], bestFor: "friendship, handmade", length: "2 minutes", tone: "Emotional", theme: "Dark Romantic", status: "coming-soon", formula: ["Strand 1", "Strand 2", "Strand 3", "Weave together", "Charm reveals"], description: "Drag three strands to weave a bracelet — the charm reveals the message." },
  { id: "secret-letter", slug: "secret-letter", title: "Snow Globe", hook: "Shake it. Let the snow settle", categorySlugs: ["love-crush"], bestFor: "confession, love, mystery", length: "2 minutes", tone: "Mystery", theme: "Cinematic Purple", status: "coming-soon", formula: ["Shake the globe", "Snow swirls", "Settling", "Message etched"], description: "Shake the snow globe — the message is etched into the glass." },
  { id: "surprise-room", slug: "surprise-room", title: "Scratch Card", hook: "Scratch off the silver coating", categorySlugs: ["love-crush", "friendship-best-friend"], bestFor: "mystery, surprise", length: "2 minutes", tone: "Mystery", theme: "Cinematic Purple", status: "coming-soon", formula: ["Silver coating", "Scratch here", "Keep going", "Message revealed"], description: "Scratch off a silver coating like a lottery ticket." },
  { id: "type-or-else", slug: "type-or-else", title: "Domino Chain", hook: "Tap the first domino", categorySlugs: ["love-crush"], bestFor: "mystery, suspense", length: "2 minutes", tone: "Mystery", theme: "Minimal Black", status: "coming-soon", formula: ["First domino", "Chain reaction", "Words fall", "Message complete"], description: "Tap the first domino — each fallen piece reveals the next word." },
  { id: "the-trust-scale", slug: "the-trust-scale", title: "Paper Airplane", hook: "Fold it. Fling it", categorySlugs: ["love-crush", "apology-fight-repair"], bestFor: "lighthearted, love", length: "2 minutes", tone: "Emotional", theme: "Cinematic Purple", status: "coming-soon", formula: ["Fold the paper", "Aim", "Fling", "Landing spot", "Message unfolds"], description: "Fold it fling it — wherever it lands the message unfolds." },
  { id: "inkblot", slug: "inkblot", title: "Photo Booth", hook: "Countdown. Flash. Four times", categorySlugs: ["love-crush", "friendship-best-friend"], bestFor: "mystery, love", length: "1 minute", tone: "Mystery", theme: "Dark Romantic", status: "coming-soon", formula: ["First flash", "Second flash", "Third flash", "Final flash", "Strip prints"], description: "Four flashes like an old photo booth — each flash captures one line." },
  { id: "two-lies-one-truth", slug: "two-lies-one-truth", title: "Fortune Cookie", hook: "Crack one open. The third holds the truth", categorySlugs: ["friendship-best-friend", "funny-roast", "love-crush"], bestFor: "friendship, funny", length: "1 minute", tone: "Funny", theme: "Soft Pastel", status: "coming-soon", formula: ["Cookie 1", "Cookie 2", "Cookie 3", "Real fortune"], description: "Crack three cookies — the last one holds the real message." },
  { id: "the-closer-you-get", slug: "the-closer-you-get", title: "Message in the Sand", hook: "Trace before the tide washes it away", categorySlugs: ["love-crush", "friendship-best-friend"], bestFor: "memory, missing someone", length: "1 minute", tone: "Mystery", theme: "Dark Romantic", status: "coming-soon", formula: ["Waves recede", "Trace the words", "Tide returns", "Fleeting message"], description: "Trace words in the sand before the tide erases them." },
  { id: "spin-to-reveal", slug: "spin-to-reveal", title: "Party Popper", hook: "Pull the string. Confetti explodes", categorySlugs: ["love-crush", "friendship-best-friend", "birthday-special-days"], bestFor: "celebration", length: "1 minute", tone: "Mystery", theme: "Cinematic Purple", status: "coming-soon", formula: ["Grab the string", "Pull", "Confetti burst", "Banner reveals"], description: "Pull the string — confetti goes off and a banner unfurls." },
  { id: "love-beats", slug: "love-beats", title: "Scratch Card", hook: "Scratch off the heart to reveal the message", categorySlugs: ["love-crush"], bestFor: "love confessions", length: "20 seconds", tone: "Romantic", theme: "Cute Pink", status: "coming-soon", formula: ["Scratch card", "Message reveal", "Reaction"], description: "A heart-shaped scratch card — drag across it to reveal the message." },
  { id: "sorry-puzzle", slug: "sorry-puzzle", title: "Puzzle Pieces", hook: "Help put this back together", categorySlugs: ["apology-fight-repair"], bestFor: "apologies", length: "30 seconds", tone: "Sorry", theme: "Cinematic Purple", status: "coming-soon", formula: ["Scattered pieces", "Drag to assemble", "Message revealed"], description: "Drag scattered puzzle pieces into place to reveal the message." },
  { id: "funny-slots", slug: "funny-slots", title: "Slot Machine", hook: "Pull the lever", categorySlugs: ["funny-roast"], bestFor: "funny messages", length: "15 seconds", tone: "Funny", theme: "Soft Pastel", status: "coming-soon", formula: ["Pull lever", "Reels spin", "Jackpot", "Message"], description: "A rigged slot machine - pull the lever and get your message with confetti." },
  { id: "secret-decoder", slug: "secret-decoder", title: "Redacted Decoder", hook: "Drag the lens to decode", categorySlugs: ["love-crush"], bestFor: "secrets, confessions", length: "20 seconds", tone: "Mystery", theme: "Minimal Black", status: "coming-soon", formula: ["Blacked-out text", "Decoder lens", "Full reveal"], description: "Drag a decoder lens across classified black bars to read what's underneath." },
  { id: "birthday-cake", slug: "birthday-cake", title: "Cut the Cake", hook: "Time to cut the cake", categorySlugs: ["birthday-special-days", "friendship-best-friend"], bestFor: "birthdays", length: "15 seconds", tone: "Birthday", theme: "Cute Pink", status: "coming-soon", formula: ["Cake", "Cut it open", "Message inside"], description: "Drag a knife across a 3D cake to split it open revealing the message." },
  { id: "roast-wheel", slug: "roast-wheel", title: "Spin the Wheel", hook: "Spin to see what fate has in store", categorySlugs: ["funny-roast"], bestFor: "roasts", length: "15 seconds", tone: "Savage", theme: "Minimal Black", status: "coming-soon", formula: ["Spin wheel", "Land on category", "Roast revealed"], description: "A carnival wheel spins through roast categories." },
  { id: "memory-flip", slug: "memory-flip", title: "Flip & Match", hook: "Find the matching pair", categorySlugs: ["friendship-best-friend", "love-crush", "birthday-special-days"], bestFor: "memories", length: "30 seconds", tone: "Emotional", theme: "Soft Pastel", status: "coming-soon", formula: ["Flip cards", "Find match", "Message revealed"], description: "Flip cards to find matching pairs — the last pair triggers your message." },
  { id: "mystery-fog", slug: "mystery-fog", title: "Flashlight in the Fog", hook: "Shine a light on what's hidden", categorySlugs: ["love-crush"], bestFor: "mystery", length: "20 seconds", tone: "Mystery", theme: "Minimal Black", status: "coming-soon", formula: ["Foggy screen", "Flashlight sweep", "Message revealed"], description: "Drag a flashlight cone through the fog until the hidden message emerges." },
  { id: "heartbeat-sync", slug: "heartbeat-sync", title: "Heartbeat Sync", hook: "Find my heartbeat", categorySlugs: ["love-crush"], bestFor: "love confessions", length: "30 seconds", tone: "Romantic", theme: "Cute Pink", status: "coming-soon", formula: ["Pick a petal", "Sync the heartbeat", "Words arrive in rhythm", "Final message"], description: "Sync heartbeats and words arrive pulsing in time." },
  { id: "polaroid-stack", slug: "polaroid-stack", title: "Polaroid Stack", hook: "Lift each photo", categorySlugs: ["friendship-best-friend", "love-crush", "birthday-special-days"], bestFor: "memories", length: "30 seconds", tone: "Emotional", theme: "Soft Pastel", status: "coming-soon", formula: ["Developing photos", "Choose which to lift", "Memories revealed", "Handwritten finale"], description: "Lift polaroid photos to reveal memories ending with a handwritten finale." },
  { id: "scratch-card", slug: "scratch-card", title: "Scratch Card", hook: "Scratch the surface", categorySlugs: ["love-crush", "friendship-best-friend"], bestFor: "mystery", length: "30 seconds", tone: "Mystery", theme: "Dark Romantic", status: "coming-soon", formula: ["Metallic layer", "Scratch to reveal", "Words emerge", "Final message"], description: "A metallic scratch card hiding your message underneath." },
  { id: "tilt-maze", slug: "tilt-maze", title: "Tilt Maze", hook: "Guide the ball through the maze", categorySlugs: ["love-crush"], bestFor: "mystery", length: "45 seconds", tone: "Mystery", theme: "Cinematic Purple", status: "coming-soon", formula: ["Enter maze", "Navigate tunnels", "Reach the goal", "Message unlocked"], description: "Navigate a ball through walls to reach your words at the exit." },
  { id: "morse-code", slug: "morse-code", title: "Morse Code", hook: "Tap the rhythm", categorySlugs: ["love-crush"], bestFor: "love, mystery", length: "30 seconds", tone: "Romantic", theme: "Dark Romantic", status: "coming-soon", formula: ["Watch the pattern", "Tap dot or dash", "Match the code", "Words unlocked"], description: "Match dot and dash patterns to decode each word." },
  { id: "dissolve-wall", slug: "dissolve-wall", title: "Dissolve Wall", hook: "Warmth reveals the truth", categorySlugs: ["apology-fight-repair", "love-crush"], bestFor: "apology", length: "30 seconds", tone: "Sorry", theme: "Minimal Black", status: "coming-soon", formula: ["Frost wall", "Touch to melt", "Words thaw", "Full message"], description: "Melt an icy wall with your touch revealing the message gradually." },
  { id: "lock-pick", slug: "lock-pick", title: "Lock Pick", hook: "Find each sweet spot", categorySlugs: ["love-crush", "funny-roast"], bestFor: "mystery", length: "45 seconds", tone: "Savage", theme: "Neon Glitch", status: "coming-soon", formula: ["Lock 1", "Find the tension", "Lock 2", "Lock 3", "Chest opens"], description: "Drag the pick to find three hidden sweet spots and unlock your message." },
  { id: "gravity-flip", slug: "gravity-flip", title: "Gravity Flip", hook: "Bring floating words back to earth", categorySlugs: ["funny-roast", "friendship-best-friend"], bestFor: "funny", length: "20 seconds", tone: "Funny", theme: "Soft Pastel", status: "coming-soon", formula: ["Floating words", "Flip gravity", "Words fall", "Message assembled"], description: "Flip gravity to pull floating words back down into a message." },
  { id: "echo-chamber", slug: "echo-chamber", title: "Echo Chamber", hook: "Type each word back. Watch it echo", categorySlugs: ["funny-roast", "friendship-best-friend", "love-crush"], bestFor: "funny", length: "30 seconds", tone: "Funny", theme: "Clean White", status: "coming-soon", formula: ["Word prompt", "Type it back", "Echo animation", "Message built"], description: "Echo each word back and watch it grow into a full message." },
  { id: "balance-scale", slug: "balance-scale", title: "Balance Scale", hook: "Balance the scale", categorySlugs: ["apology-fight-repair", "love-crush"], bestFor: "apology", length: "45 seconds", tone: "Emotional", theme: "Cinematic Purple", status: "coming-soon", formula: ["See the weight", "Drag word tokens", "Balance the scale", "Message unlocks"], description: "Drag the right word-weights onto the scale to unlock the message." },
  { id: "candle-countdown", slug: "candle-countdown", title: "Candle Countdown", hook: "Blow out each candle", categorySlugs: ["birthday-special-days", "friendship-best-friend"], bestFor: "birthdays", length: "20 seconds", tone: "Birthday", theme: "Cute Pink", status: "coming-soon", formula: ["Lighting candles", "Make a wish", "Blow them out", "Message revealed"], description: "Each candle holds a word — blow them out to read the wish." },
  { id: "dont-smile-scenes", slug: "dont-smile-scenes", title: "Don't You Smile", hook: "Don't crack a smile", categorySlugs: ["friendship-best-friend", "funny-roast"], bestFor: "dares", length: "30 seconds", tone: "Funny", theme: "Soft Pastel", status: "coming-soon", formula: ["Challenge accepted", "Smash emojis", "Final round", "Message revealed"], description: "Smash emojis through rounds without breaking your poker face." },
  { id: "deleted-drafts", slug: "deleted-drafts", title: "Deleted Drafts", hook: "I typed something. Deleted it.", categorySlugs: ["love-crush", "apology-fight-repair"], bestFor: "confessions", length: "40 seconds", tone: "Emotional", theme: "Minimal Black", status: "coming-soon", formula: ["Typing", "Funny draft", "Safe draft", "Risky draft", "Real message"], description: "Four drafts — only the last one was honest. Restore each to uncover the real words." },
  { id: "memory-scenes", slug: "memory-scenes", title: "Memory Lane", hook: "Every memory starts somewhere", categorySlugs: ["love-crush", "friendship-best-friend"], bestFor: "nostalgia", length: "1 minute", tone: "Emotional", theme: "Dark Romantic", status: "coming-soon", formula: ["Begin journey", "Scratch memories", "Final letter"], description: "Scratch each polaroid to relive the moment — the final letter says what words couldn't." },
  { id: "roast-scenes", slug: "roast-scenes", title: "Roast to Respect", hook: "I'll roast you first", categorySlugs: ["friendship-best-friend", "funny-roast"], bestFor: "roasts", length: "30 seconds", tone: "Funny", theme: "Neon Glitch", status: "coming-soon", formula: ["Roast mode", "Mild", "Medium", "Spicy", "Truth"], description: "Three rounds of roasting — flip coins to advance. The final message hits different." },
  { id: "secret-letter-scenes", slug: "secret-letter-scenes", title: "Secret Letter", hook: "Three seals guard the words inside", categorySlugs: ["love-crush"], bestFor: "mystery", length: "40 seconds", tone: "Mystery", theme: "Cinematic Purple", status: "coming-soon", formula: ["Sealed letter", "Break seal x3", "Letter opens", "Message revealed"], description: "Break three wax seals to unlock the message hidden inside." },
  { id: "surprise-room-scenes", slug: "surprise-room-scenes", title: "Surprise Room", hook: "Four boxes. Choose one", categorySlugs: ["love-crush", "birthday-special-days"], bestFor: "surprises", length: "45 seconds", tone: "Mystery", theme: "Dark Romantic", status: "coming-soon", formula: ["Enter room", "Pick a box", "Drag to open", "Final surprise"], description: "Pick from four boxes — drag it open to find the surprise inside." },
];

templates.sort((a, b) => {
  if (a.status === "full" && b.status !== "full") return -1;
  if (a.status !== "full" && b.status === "full") return 1;
  return a.title.localeCompare(b.title);
});

const templateRouteAliases: Record<string, string> = {
  "secret-room": "the-secret-room"
};

export type Mood = {
  slug: string;
  name: string;
  emoji: string;
  tones: Tone[];
  categorySlugs: string[];
  description: string;
};

export const moods: Mood[] = [
  { slug: "love", name: "Love", emoji: "💖", tones: ["Romantic"], categorySlugs: ["love-crush"], description: "Romantic, crush, confession, missing someone, or relationship messages." },
  { slug: "sorry", name: "Sorry", emoji: "💔", tones: ["Sorry"], categorySlugs: ["apology-fight-repair"], description: "For saying sorry, fixing mood, calming anger, or restarting a conversation." },
  { slug: "funny", name: "Funny", emoji: "😂", tones: ["Funny"], categorySlugs: ["funny-roast"], description: "For playful roasts, attitude jokes, dramatic reactions, and shareable fun." },
  { slug: "birthday", name: "Birthday", emoji: "🎂", tones: ["Birthday"], categorySlugs: ["birthday-special-days"], description: "For birthdays, anniversaries, congratulations, achievements, and special memories." },
  { slug: "roast", name: "Roast", emoji: "🏆", tones: ["Savage"], categorySlugs: ["funny-roast"], description: "For playful roasts, attitude jokes, and savage comebacks." },
  { slug: "memory", name: "Memory", emoji: "💓", tones: ["Emotional", "Friendship"], categorySlugs: ["friendship-best-friend"], description: "For best friends, inside jokes, emotional friendship messages, and appreciation." },
  { slug: "mystery", name: "Mystery", emoji: "🔥", tones: ["Mystery"], categorySlugs: ["love-crush", "friendship-best-friend"], description: "For suspenseful reveals, hidden messages, emotional secrets, and dramatic storytelling." },
];

export function getMood(slug: string) {
  return moods.find((m) => m.slug === slug);
}

export function getTemplatesByMood(moodSlug: string) {
  const mood = getMood(moodSlug);
  if (!mood) return [];
  const result = templates.filter(
    (t) => t.status === "full" && (mood.tones.includes(t.tone) || t.categorySlugs.some((cs) => mood.categorySlugs.includes(cs)))
  );
  result.sort((a, b) => {
    if (a.id === "our-memories") return -1;
    if (b.id === "our-memories") return 1;
    return a.title.localeCompare(b.title);
  });
  return result;
}

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

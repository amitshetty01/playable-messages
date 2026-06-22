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
    title: "Static Frequency",
    hook: "Turn the dial through the static until the right frequency locks in.",
    categorySlugs: ["mystery-confession"],
    bestFor: "regret, missing someone, apology",
    length: "2 minutes",
    tone: "Emotional",
    theme: "Minimal Black",
    status: "coming-soon",
    formula: ["Static hiss", "Tune the dial", "Frequency locks", "Message comes through"],
    description: "Like finding an old radio station that's been playing the whole time. Good for regret, missing someone, or anything that took a while to find the words for."
  },
  {
    id: "the-risk-button",
    slug: "the-risk-button",
    title: "Fate Cards",
    hook: "Three face-down cards. Each flip raises the stakes.",
    categorySlugs: ["mystery-confession", "love-crush", "friendship-best-friend"],
    bestFor: "mystery, surprise, suspense",
    length: "1 minute",
    tone: "Mystery",
    theme: "Cinematic Purple",
    status: "coming-soon",
    formula: ["Card 1", "Card 2", "Card 3", "Final reveal"],
    description: "Three face-down cards on the table, each flip revealing a little more and raising the stakes, until the last card holds the real message."
  },
  {
    id: "glitch-truth",
    slug: "glitch-truth",
    title: "Frozen in Ice",
    hook: "The message sits behind a block of ice. Break through to set it free.",
    categorySlugs: ["mystery-confession"],
    bestFor: "confession, hidden truth, emotional",
    length: "1 minute",
    tone: "Mystery",
    theme: "Neon Glitch",
    status: "coming-soon",
    formula: ["Frozen block", "Chip the ice", "Deep cracks", "Shatter and reveal"],
    description: "Tap or drag chips real cracks into the ice until it shatters and the words break free. Same truth fighting to get out, just colder and more physical."
  },
  {
    id: "dont-smile-challenge",
    slug: "dont-smile-challenge",
    title: "Shake for an Answer",
    hook: "Shake the ball. Get an answer. Eventually the real one.",
    categorySlugs: ["friendship-best-friend", "funny-roast", "love-crush"],
    bestFor: "friendship, funny, playful",
    length: "1 minute",
    tone: "Funny",
    theme: "Soft Pastel",
    status: "coming-soon",
    formula: ["Shake once", "Shake again", "One more", "Real answer"],
    description: "A fortune ball gets shaken for a few cheeky non-answers before it finally lands on the real one."
  },
  {
    id: "choose-my-punishment",
    slug: "choose-my-punishment",
    title: "Calm the Storm",
    hook: "Breathe through the storm until the apology becomes clear.",
    categorySlugs: ["apology-fight-repair", "funny-roast"],
    bestFor: "apology, fight repair, emotional repair",
    length: "1 minute",
    tone: "Sorry",
    theme: "Cinematic Purple",
    status: "coming-soon",
    formula: ["Storm rises", "Breathe in", "Hold", "Release", "Message clear"],
    description: "A stormy scene the recipient has to breathe through with an on-screen guide. Hold and release until it settles and the apology becomes legible."
  },
  {
    id: "mood-repair-machine",
    slug: "mood-repair-machine",
    title: "Tug of War",
    hook: "Pull steadily. Earn the message back.",
    categorySlugs: ["apology-fight-repair", "friendship-best-friend", "funny-roast"],
    bestFor: "apology, earning it back, friendship",
    length: "1 minute",
    tone: "Funny",
    theme: "Clean White",
    status: "coming-soon",
    formula: ["Grab the rope", "Pull hard", "Keep pulling", "Message won"],
    description: "A rope with real resistance on the other end. They have to actually work for it, pulling steadily until they win the message back."
  },
  {
    id: "the-secret-room",
    slug: "the-secret-room",
    title: "Treasure Map",
    hook: "A hand-drawn map. Drag the compass until it locks onto X.",
    categorySlugs: ["mystery-confession", "love-crush", "friendship-best-friend", "birthday-special-days"],
    bestFor: "mystery, discovery, adventure",
    length: "2 minutes",
    tone: "Mystery",
    theme: "Cinematic Purple",
    status: "coming-soon",
    formula: ["Unfold map", "Drag compass", "Find the X", "Buried treasure"],
    description: "A hand-drawn map with a compass they drag around until it locks onto an X, and the ground opens to show what's buried."
  },
  {
    id: "memory-maze",
    slug: "memory-maze",
    title: "Heart Vault",
    hook: "Touch the beating heart. Speak the password. Enter a world of memories.",
    categorySlugs: ["friendship-best-friend", "birthday-special-days", "love-crush"],
    bestFor: "friendship, birthday, memories, nostalgia, love",
    length: "2 minutes",
    tone: "Emotional",
    theme: "Dark Romantic",
    status: "full",
    formula: ["Touch the heart", "Knock knock", "Enter the password", "Blackout", "Memory world", "Final words"],
    description: "A beating heart waits to be touched. Once you knock, a password screen appears — prove who you are to unlock a world of memories with photos, messages, and a final love note."
  },
  {
    id: "roast-to-respect",
    slug: "roast-to-respect",
    title: "Climb the Mountain",
    hook: "Teasing checkpoints on the way up. Something quiet at the summit.",
    categorySlugs: ["funny-roast", "friendship-best-friend"],
    bestFor: "funny, friendship, appreciation",
    length: "1 minute",
    tone: "Savage",
    theme: "Minimal Black",
    status: "coming-soon",
    formula: ["Base camp", "Steep climb", "Teasing stop", "Near the top", "Summit reveal"],
    description: "A few teasing checkpoint comments on the way up, then something quiet and sincere waiting at the summit beside a little planted flag."
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
    id: "memory-journey",
    slug: "memory-journey",
    title: "Braid a Bracelet",
    hook: "Weave three strands together. The charm holds the message.",
    categorySlugs: ["friendship-best-friend", "love-crush", "birthday-special-days"],
    bestFor: "friendship, memory, handmade, love",
    length: "2 minutes",
    tone: "Emotional",
    theme: "Dark Romantic",
    status: "coming-soon",
    formula: ["Strand 1", "Strand 2", "Strand 3", "Weave together", "Charm reveals"],
    description: "Drag three colored strands over each other to weave a friendship bracelet, with the finished charm revealing the message."
  },
  {
    id: "secret-letter",
    slug: "secret-letter",
    title: "Snow Globe",
    hook: "Shake it. Let the snow settle. The message is inside.",
    categorySlugs: ["love-crush", "mystery-confession"],
    bestFor: "confession, love, mystery, nostalgia",
    length: "2 minutes",
    tone: "Mystery",
    theme: "Cinematic Purple",
    status: "coming-soon",
    formula: ["Shake the globe", "Snow swirls", "Settling", "Message etched"],
    description: "Shake the snow globe, let the snow settle, and the message is etched into the glass like it's always been waiting there."
  },
  {
    id: "surprise-room",
    slug: "surprise-room",
    title: "Scratch Card",
    hook: "Scratch off the silver coating. Your message is underneath.",
    categorySlugs: ["mystery-confession", "love-crush", "friendship-best-friend"],
    bestFor: "mystery, surprise, love, friendship",
    length: "2 minutes",
    tone: "Mystery",
    theme: "Cinematic Purple",
    status: "coming-soon",
    formula: ["Silver coating", "Scratch here", "Keep going", "Message revealed"],
    description: "Drag to scratch off a silver coating like a lottery ticket, uncovering the message stroke by stroke."
  },
  {
    id: "type-or-else",
    slug: "type-or-else",
    title: "Domino Chain",
    hook: "Tap the first domino. Watch the chain react.",
    categorySlugs: ["mystery-confession", "love-crush"],
    bestFor: "mystery, suspense, hidden truth",
    length: "2 minutes",
    tone: "Mystery",
    theme: "Minimal Black",
    status: "coming-soon",
    formula: ["First domino", "Chain reaction", "Words fall", "Message complete"],
    description: "Tap the first domino and watch the chain react across the screen, each fallen piece revealing the next word until the sentence has toppled into place."
  },
  {
    id: "the-trust-scale",
    slug: "the-trust-scale",
    title: "Paper Airplane",
    hook: "Fold it. Fling it. Wherever it lands, the message unfolds.",
    categorySlugs: ["love-crush", "apology-fight-repair", "mystery-confession"],
    bestFor: "lighthearted, love, apology, playful",
    length: "2 minutes",
    tone: "Emotional",
    theme: "Cinematic Purple",
    status: "coming-soon",
    formula: ["Fold the paper", "Aim", "Fling", "Landing spot", "Message unfolds"],
    description: "Fold it, fling it across the screen, and wherever it lands, it unfolds to show the message."
  },
  {
    id: "inkblot",
    slug: "inkblot",
    title: "Photo Booth",
    hook: "Countdown. Flash. Four times. The strip prints your message.",
    categorySlugs: ["mystery-confession", "love-crush", "friendship-best-friend"],
    bestFor: "mystery, love, friendship, birthday",
    length: "1 minute",
    tone: "Mystery",
    theme: "Dark Romantic",
    status: "coming-soon",
    formula: ["First flash", "Second flash", "Third flash", "Final flash", "Strip prints"],
    description: "A countdown and a flash, four times over, like an old photo booth strip, with each flash capturing one line until the full strip prints out."
  },
  {
    id: "two-lies-one-truth",
    slug: "two-lies-one-truth",
    title: "Fortune Cookie",
    hook: "Crack one open. A joke. Another. A tease. The third holds the truth.",
    categorySlugs: ["friendship-best-friend", "funny-roast", "mystery-confession"],
    bestFor: "friendship, funny, mystery, confession",
    length: "1 minute",
    tone: "Funny",
    theme: "Soft Pastel",
    status: "coming-soon",
    formula: ["Cookie 1", "Cookie 2", "Cookie 3", "Real fortune"],
    description: "Crack one open for a joke fortune, then another, then a third — the real message is folded inside the last one."
  },
  {
    id: "the-closer-you-get",
    slug: "the-closer-you-get",
    title: "Message in the Sand",
    hook: "Trace the message before the tide washes it away.",
    categorySlugs: ["mystery-confession", "love-crush", "friendship-best-friend"],
    bestFor: "memory, missing someone, fleeting moments",
    length: "1 minute",
    tone: "Mystery",
    theme: "Dark Romantic",
    status: "coming-soon",
    formula: ["Waves recede", "Trace the words", "Tide returns", "Fleeting message"],
    description: "Waves wash over a beach, and they have to trace the message in the sand with a finger before the tide comes back and erases it."
  },
  {
    id: "spin-to-reveal",
    slug: "spin-to-reveal",
    title: "Party Popper",
    hook: "Pull the string. Confetti explodes. Banner unfurls.",
    categorySlugs: ["mystery-confession", "love-crush", "friendship-best-friend", "birthday-special-days"],
    bestFor: "celebration, surprise, festive",
    length: "1 minute",
    tone: "Mystery",
    theme: "Cinematic Purple",
    status: "coming-soon",
    formula: ["Grab the string", "Pull", "Confetti burst", "Banner reveals"],
    description: "Pull the string, confetti goes off, and a little banner unfurls with your words on it."
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
    id: "love-beats",
    slug: "love-beats",
    title: "Scratch Card",
    hook: "Scratch off the heart to reveal the message.",
    categorySlugs: ["love-crush"],
    bestFor: "love confessions, romantic surprises, sweet gestures",
    length: "20 seconds",
    tone: "Romantic",
    theme: "Cute Pink",
    status: "coming-soon",
    formula: ["Scratch card", "Message reveal", "Reaction"],
    description: "A heart-shaped scratch card hides your message. They drag their finger across it like a lottery ticket to reveal what you wrote."
  },
  {
    id: "sorry-puzzle",
    slug: "sorry-puzzle",
    title: "Puzzle Pieces",
    hook: "Help put this back together.",
    categorySlugs: ["apology-fight-repair"],
    bestFor: "apologies, fight repair, making amends",
    length: "30 seconds",
    tone: "Sorry",
    theme: "Cinematic Purple",
    status: "coming-soon",
    formula: ["Scattered pieces", "Drag to assemble", "Message revealed"],
    description: "Your message is broken into draggable fragments. They drag each piece into place until the message is whole again."
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
    id: "funny-slots",
    slug: "funny-slots",
    title: "Slot Machine",
    hook: "Pull the lever and see what hits \u{1F60F}",
    categorySlugs: ["funny-roast"],
    bestFor: "funny messages, jokes, playful roasts",
    length: "15 seconds",
    tone: "Funny",
    theme: "Soft Pastel",
    status: "coming-soon",
    formula: ["Pull lever", "Reels spin", "Jackpot", "Message"],
    description: "A rigged slot machine that always hits jackpot. Pull the lever, watch the reels land, and get your message delivered with confetti."
  },
  {
    id: "secret-decoder",
    slug: "secret-decoder",
    title: "Redacted Decoder",
    hook: "Classified. Drag the lens to decode.",
    categorySlugs: ["mystery-confession"],
    bestFor: "secrets, confessions, hidden messages",
    length: "20 seconds",
    tone: "Mystery",
    theme: "Minimal Black",
    status: "coming-soon",
    formula: ["Blacked-out text", "Decoder lens", "Full reveal"],
    description: "Your message appears as a classified document with black bars. They drag a decoder lens across the bars to read what's underneath."
  },
  {
    id: "birthday-cake",
    slug: "birthday-cake",
    title: "Cut the Cake",
    hook: "Time to cut the cake! 🎉",
    categorySlugs: ["birthday-special-days", "friendship-best-friend"],
    bestFor: "birthdays, celebrations, special days",
    length: "15 seconds",
    tone: "Birthday",
    theme: "Cute Pink",
    status: "full",
    formula: ["Cake", "Cut it open", "Message inside"],
    description: "A 3D cake with real-time lighting and frosting that catches the light. They drag a knife across it — the cake splits open in perspective with falling crumbs."
  },
  {
    id: "roast-wheel",
    slug: "roast-wheel",
    title: "Spin the Wheel",
    hook: "Spin to see what roast fate has in store 🔥",
    categorySlugs: ["funny-roast"],
    bestFor: "roasts, savage jokes, playful insults",
    length: "15 seconds",
    tone: "Savage",
    theme: "Minimal Black",
    status: "coming-soon",
    formula: ["Spin wheel", "Land on category", "Roast revealed"],
    description: "A carnival wheel spins through roast categories. It always lands on the one that triggers your custom roast with comedic timing."
  },
  {
    id: "memory-flip",
    slug: "memory-flip",
    title: "Flip & Match",
    hook: "Find the matching pair.",
    categorySlugs: ["friendship-best-friend", "love-crush", "birthday-special-days"],
    bestFor: "memories, nostalgia, emotional messages",
    length: "30 seconds",
    tone: "Emotional",
    theme: "Soft Pastel",
    status: "coming-soon",
    formula: ["Flip cards", "Find match", "Message revealed"],
    description: "A classic memory matching game. Flip cards to find matching pairs — finding the last pair triggers your message."
  },
  {
    id: "mystery-fog",
    slug: "mystery-fog",
    title: "Flashlight in the Fog",
    hook: "Shine a light on what's hidden...",
    categorySlugs: ["mystery-confession"],
    bestFor: "mystery, suspense, dramatic reveals",
    length: "20 seconds",
    tone: "Mystery",
    theme: "Minimal Black",
    status: "coming-soon",
    formula: ["Foggy screen", "Flashlight sweep", "Message revealed"],
    description: "The screen starts fogged over. They drag to move a flashlight cone — exploring the darkness until the hidden message emerges."
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
    status: "coming-soon",
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
    status: "coming-soon",
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
    status: "coming-soon",
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
    status: "coming-soon",
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
    status: "coming-soon",
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
    status: "coming-soon",
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
    status: "coming-soon",
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
    status: "coming-soon",
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
    status: "coming-soon",
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
    status: "coming-soon",
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
    status: "coming-soon",
    formula: ["Lighting candles", "Make a wish", "Blow them out", "Message revealed"],
    description: "A birthday cake with candles. Each candle holds a word of the message. Blow them out one by one to read the full birthday wish."
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
    description: "Step into a dark room. Pop balloons. Blow out the candles. A birthday message awaits in the light."
  },
  {
    id: "dont-smile-scenes",
    slug: "dont-smile-scenes",
    title: "Don't You Smile",
    hook: "I dare you to get through this without cracking a smile.",
    categorySlugs: ["friendship-best-friend", "funny-roast"],
    bestFor: "dares, fun, teasing friends",
    length: "30 seconds",
    tone: "Funny",
    theme: "Soft Pastel",
    status: "full",
    formula: ["Challenge accepted", "Smash emojis", "Final round", "Message revealed"],
    description: "A smile challenge. Smash emojis through increasingly tough rounds without breaking your poker face."
  },
  {
    id: "deleted-drafts",
    slug: "deleted-drafts",
    title: "Deleted Drafts",
    hook: "I typed something. Deleted it. Then typed it again.",
    categorySlugs: ["love-crush", "apology-fight-repair"],
    bestFor: "confessions, apologies, things left unsaid",
    length: "40 seconds",
    tone: "Emotional",
    theme: "Minimal Black",
    status: "coming-soon",
    formula: ["Typing", "Funny draft", "Safe draft", "Risky draft", "Real message"],
    description: "Four drafts of a message. Only the last one was honest. Restore each draft to uncover the real words."
  },
  {
    id: "memory-scenes",
    slug: "memory-scenes",
    title: "Memory Lane",
    hook: "Every memory starts somewhere. This one starts with you.",
    categorySlugs: ["love-crush", "friendship-best-friend"],
    bestFor: "nostalgia, looking back, appreciation",
    length: "1 minute",
    tone: "Emotional",
    theme: "Dark Romantic",
    status: "coming-soon",
    formula: ["Begin journey", "Scratch memories", "Final letter"],
    description: "A journey through shared memories. Scratch each polaroid to relive the moment. The final letter says what words alone couldn't."
  },
  {
    id: "roast-scenes",
    slug: "roast-scenes",
    title: "Roast to Respect",
    hook: "I'll roast you first. Then say the truth.",
    categorySlugs: ["friendship-best-friend", "funny-roast"],
    bestFor: "roasts, jokes, friendship banter",
    length: "30 seconds",
    tone: "Funny",
    theme: "Neon Glitch",
    status: "coming-soon",
    formula: ["Roast mode", "Mild", "Medium", "Spicy", "Truth"],
    description: "Three rounds of roasting. Flip coins to advance. The final message hits different."
  },
  {
    id: "secret-letter-scenes",
    slug: "secret-letter-scenes",
    title: "Secret Letter",
    hook: "Three seals guard the words inside.",
    categorySlugs: ["mystery-confession", "love-crush"],
    bestFor: "mystery reveals, secret confessions",
    length: "40 seconds",
    tone: "Mystery",
    theme: "Cinematic Purple",
    status: "coming-soon",
    formula: ["Sealed letter", "Break seal x3", "Letter opens", "Message revealed"],
    description: "A sealed letter with three wax seals. Break each seal to unlock a piece of the message hidden inside."
  },
  {
    id: "surprise-room-scenes",
    slug: "surprise-room-scenes",
    title: "Surprise Room",
    hook: "Four boxes. Choose which one to open first.",
    categorySlugs: ["mystery-confession", "birthday-special-days"],
    bestFor: "surprises, mystery, gift reveals",
    length: "45 seconds",
    tone: "Mystery",
    theme: "Dark Romantic",
    status: "coming-soon",
    formula: ["Enter room", "Pick a box", "Drag to open", "Final surprise"],
    description: "Step into a private room with four boxes. Pick one, drag it open. Each box holds something different."
  },
  {
    id: "escape-me",
    slug: "escape-me",
    title: "Escape Me",
    hook: "Tap the arrows. Clear the heart. Unlock what's hidden inside.",
    categorySlugs: ["love-crush", "mystery-confession", "friendship-best-friend"],
    bestFor: "love, mystery, friendship, emotional reveals",
    length: "30 seconds",
    tone: "Romantic",
    theme: "Dark Romantic",
    status: "full",
    formula: ["Heart of arrows", "Tap to remove", "Clear the path", "Message revealed"],
    description: "A heart made of arrow pieces. Tap each arrow in the right order to clear the walls and unlock a hidden personal message inside."
  },
];

templates.sort((a, b) => {
  if (a.status === "full" && b.status !== "full") return -1;
  if (a.status !== "full" && b.status === "full") return 1;
  return 0;
});

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

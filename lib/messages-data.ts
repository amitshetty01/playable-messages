export type MessageCategory = {
  slug: string;
  name: string;
  description: string;
  subcategories: MessageSubcategory[];
};

export type MessageSubcategory = {
  slug: string;
  name: string;
  description: string;
  audienceTags: string[];
  messages: MessageItem[];
};

export type MessageFaq = { question: string; answer: string };

export type MessageItem = {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  categorySlug: string;
  subcategorySlug: string;
  tags: string[];
  tone: string;
  audience: string;
  copyPrompt: string;
  usageTips: string[];
  faqs: MessageFaq[];
  bestTiming: string;
  relatedTemplateId: string | null;
};

export type GeneratorItem = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  description: string;
  prompts: string[];
  relatedGeneratorSlugs: string[];
  tone: string;
  audience: string;
  faqs: Array<{ question: string; answer: string }>;
};

export type CollectionItem = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  description: string;
  count: number;
  categorySlug: string;
  tone: string;
  faqs: Array<{ question: string; answer: string }>;
  relatedCollectionSlugs: string[];
};

export type SeasonalItem = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  description: string;
  date: string;
  relatedSeasonalSlugs: string[];
  faqs: Array<{ question: string; answer: string }>;
  messageTypes: string[];
};

export type GameSeoItem = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  description: string;
  longDescription: string;
  howToPlay: string[];
  category: string;
  tone: string;
  relatedGameSlugs: string[];
  faqs: Array<{ question: string; answer: string }>;
  templateId?: string;
};

function messagesForAudience(audience: string, baseMessages: string[]): string[] {
  return baseMessages.map((m) => m.replace(/{audience}/g, audience));
}

const audienceLabel: Record<string, string> = {
  girlfriend: "Girlfriend",
  boyfriend: "Boyfriend",
  wife: "Wife",
  husband: "Husband",
  crush: "Crush",
  bestfriend: "Best Friend",
  friend: "Friend",
  mother: "Mother",
  father: "Father",
  sister: "Sister",
  brother: "Brother",
  colleague: "Colleague",
  partner: "Partner",
};

export const messageTemplates: Record<string, { title: string; content: string; copyPrompt: string }[]> = {
  romantic: [
    { title: "Romantic {audience} Message", content: "Every moment with you feels like a dream I never want to wake up from. You make my world brighter just by being in it.", copyPrompt: "Write a romantic love message for {audience}" },
    { title: "I Love You More Than Words Can Say", content: "I love you not just for who you are, but for who I become when I'm with you. You bring out the best in me.", copyPrompt: "Write an 'I love you' message for {audience}" },
    { title: "You Mean the World to Me", content: "In a world full of billions, my heart chose you. And it chooses you again, every single day.", copyPrompt: "Write a 'you mean the world to me' message for {audience}" },
    { title: "Forever With You", content: "I don't know where I'd be without you. You're my anchor, my sunshine, my everything.", copyPrompt: "Write a forever love message for {audience}" },
    { title: "Every Day I Love You More", content: "Some people search their whole lives for what we have. I found you, and I'll never let go.", copyPrompt: "Write a growing love message for {audience}" },
    { title: "Thinking of You Today", content: "I caught myself smiling today for no reason. Then I realized — I was thinking of you.", copyPrompt: "Write a 'thinking of you' message for {audience}" },
    { title: "You're My Home", content: "Home isn't a place. It's the feeling I get when I'm wrapped in your arms.", copyPrompt: "Write a 'you're my home' message for {audience}" },
    { title: "The Best Part of My Day", content: "The best part of my day is any moment I get to spend with you. Even the quiet ones.", copyPrompt: "Write a 'best part of my day' message for {audience}" },
    { title: "My Heart Belongs to You", content: "If I had to choose between breathing and loving you, I would use my last breath to say I love you.", copyPrompt: "Write a 'my heart belongs to you' message for {audience}" },
    { title: "Just Because I Love You", content: "This is a random reminder that you are loved, appreciated, and deeply cherished. Just because.", copyPrompt: "Write a 'just because' love message for {audience}" },
  ],
  birthday: [
    { title: "Happy Birthday {audience}", content: "Happy birthday to someone who makes the world a better place just by existing. Today is all about celebrating you!", copyPrompt: "Write a happy birthday message for {audience}" },
    { title: "Birthday Wishes for {audience}", content: "Another year around the sun, and you only get more amazing. May your day be as beautiful as you are.", copyPrompt: "Write birthday wishes for {audience}" },
    { title: "Special Birthday Message", content: "On your birthday, I want you to know how much you mean to me. You're not just special — you're irreplaceable.", copyPrompt: "Write a special birthday message for {audience}" },
    { title: "Birthday Love Letter", content: "Your birthday is a reminder of how lucky I am to have you in my life. Thank you for being you.", copyPrompt: "Write a birthday love letter for {audience}" },
    { title: "Sweet Birthday Note", content: "May your birthday be filled with laughter, joy, and all the happiness you bring to everyone around you.", copyPrompt: "Write a sweet birthday note for {audience}" },
    { title: "Birthday Gratitude Message", content: "I'm so grateful for every moment we've shared. Watching you grow each year is my greatest joy.", copyPrompt: "Write a birthday gratitude message for {audience}" },
    { title: "Funny Birthday Wish", content: "You're not getting older, you're upgrading. Happy birthday to my favorite person to annoy!", copyPrompt: "Write a funny birthday wish for {audience}" },
    { title: "Heartfelt Birthday Message", content: "Some people brighten every room they walk into. You're one of them. Happy birthday, beautiful soul.", copyPrompt: "Write a heartfelt birthday message for {audience}" },
  ],
  anniversary: [
    { title: "Anniversary Message for {audience}", content: "Every day with you feels like a gift. Happy anniversary to the person who made my life complete.", copyPrompt: "Write an anniversary message for {audience}" },
    { title: "Happy Anniversary Love", content: "We've built something beautiful together. Here's to many more years of love, laughter, and growing together.", copyPrompt: "Write a happy anniversary love message for {audience}" },
    { title: "Years Together Anniversary Note", content: "Every moment with you has been a treasure. Thank you for choosing me, every single day.", copyPrompt: "Write an anniversary note for {audience}" },
    { title: "Anniversary Love Letter", content: "I'd choose you in every lifetime. Happy anniversary, my love. You're still the best decision I ever made.", copyPrompt: "Write an anniversary love letter for {audience}" },
  ],
  apology: [
    { title: "I'm Sorry {audience}", content: "I was wrong, and I own it. You deserve better, and I'm going to do better. Please forgive me.", copyPrompt: "Write an apology message for {audience}" },
    { title: "Apology Letter for {audience}", content: "Words can't express how sorry I am. I hurt you, and that's the last thing I ever wanted. Please give me a chance to make it right.", copyPrompt: "Write an apology letter for {audience}" },
    { title: "Forgive Me Message", content: "I know I messed up. I'm not asking for instant forgiveness — I'm asking for a chance to earn it back.", copyPrompt: "Write a 'forgive me' message for {audience}" },
    { title: "Sorry for Hurting You", content: "Seeing you hurt because of me breaks my heart. I will do everything to never let that happen again.", copyPrompt: "Write a sorry for hurting you message for {audience}" },
  ],
  goodmorning: [
    { title: "Good Morning {audience}", content: "Good morning, beautiful! I hope your day is as wonderful as you are. Thinking of you always.", copyPrompt: "Write a good morning message for {audience}" },
    { title: "Sweet Morning Message", content: "Rise and shine! The world is better because you're in it. Have an amazing day.", copyPrompt: "Write a sweet morning message for {audience}" },
    { title: "Morning Love Note", content: "Before you start your day, I wanted to remind you that you're loved, appreciated, and never far from my thoughts.", copyPrompt: "Write a morning love note for {audience}" },
    { title: "Good Morning Sunshine", content: "You're the first thought on my mind every morning and the last one before I sleep. Good morning, sunshine.", copyPrompt: "Write a good morning sunshine message for {audience}" },
  ],
  goodnight: [
    { title: "Good Night {audience}", content: "Sweet dreams, my love. I'll be dreaming of you until we meet again in the morning.", copyPrompt: "Write a good night message for {audience}" },
    { title: "Sweet Dreams Message", content: "Close your eyes and drift away. Tomorrow is a new day, and I'll be here waiting for you.", copyPrompt: "Write a sweet dreams message for {audience}" },
    { title: "Night Love Note", content: "I wish I could hold you close tonight. Until then, know that you're wrapped in my love, always.", copyPrompt: "Write a night love note for {audience}" },
  ],
  friendship: [
    { title: "Thank You for Being My Friend", content: "Life is better with you in it. Thank you for all the laughs, the support, and the memories.", copyPrompt: "Write a thank you friendship message for {audience}" },
    { title: "Best Friend Message", content: "You're not just a friend — you're family. I don't know what I'd do without you.", copyPrompt: "Write a best friend message for {audience}" },
    { title: "Missing You Friend", content: "Thinking of you today and missing all the good times. We need to catch up soon!", copyPrompt: "Write a missing you message for friend" },
    { title: "Friendship Appreciation Note", content: "Just wanted to say I appreciate you more than words can express. You're a rare gem.", copyPrompt: "Write a friendship appreciation note" },
  ],
  loveletter: [
    { title: "Love Letter for {audience}", content: "My dearest, I've been meaning to write this for a while. You are the most beautiful part of my life, and every day I'm grateful for you.", copyPrompt: "Write a love letter for {audience}" },
    { title: "Deep Love Letter", content: "There are not enough words in any language to describe what you mean to me. You are my past, present, and future.", copyPrompt: "Write a deep love letter for {audience}" },
    { title: "Romantic Letter to {audience}", content: "From the moment we met, something in me changed. You awakened parts of my heart I didn't know existed.", copyPrompt: "Write a romantic letter for {audience}" },
  ],
  sorry: [
    { title: "Sorry Message for {audience}", content: "I deeply regret what happened. You mean too much to me to let this come between us.", copyPrompt: "Write a sorry message for {audience}" },
    { title: "Apology Text for {audience}", content: "I can't stop thinking about what I did. I'm truly sorry and I hope we can move past this.", copyPrompt: "Write an apology text for {audience}" },
  ],
  farewell: [
    { title: "Farewell Message for {audience}", content: "Saying goodbye is never easy. Thank you for all the memories. You'll be missed more than you know.", copyPrompt: "Write a farewell message for {audience}" },
    { title: "Goodbye Letter", content: "This isn't the end — it's just a new beginning. Thank you for being part of my journey.", copyPrompt: "Write a goodbye letter for {audience}" },
  ],
  proposal: [
    { title: "Proposal Message for {audience}", content: "I've imagined this moment a thousand times. You are my everything. Will you spend the rest of your life with me?", copyPrompt: "Write a proposal message for {audience}" },
    { title: "Will You Marry Me?", content: "Life before you was gray. Life with you is a masterpiece. I want to paint the rest of it by your side. Will you marry me?", copyPrompt: "Write a 'will you marry me' message for {audience}" },
  ],
  longdistance: [
    { title: "Long Distance Love Letter", content: "The miles between us hurt, but loving you makes every kilometer worth it. Distance means so little when someone means so much.", copyPrompt: "Write a long distance love letter for {audience}" },
    { title: "Missing You Long Distance", content: "I miss your laugh, your touch, your presence. But I hold onto the hope of seeing you again soon.", copyPrompt: "Write a missing you long distance message" },
  ],
  breakup: [
    { title: "Breakup Message for {audience}", content: "This is the hardest thing I've ever had to write. You deserve honesty, and I owe you that much.", copyPrompt: "Write a breakup message for {audience}" },
  ],
  thankYou: [
    { title: "Thank You Message for {audience}", content: "From the bottom of my heart, thank you. Your kindness and generosity mean more than you'll ever know.", copyPrompt: "Write a thank you message for {audience}" },
    { title: "Gratitude Letter", content: "I've been reflecting on everything you've done for me, and I'm overwhelmed with gratitude. Thank you for being you.", copyPrompt: "Write a gratitude letter for {audience}" },
  ],
};

const audiences = [
  "girlfriend", "boyfriend", "wife", "husband", "crush",
  "bestfriend", "friend", "mother", "father", "sister", "brother", "colleague", "partner"
];

const toneSlugMap: Record<string, string[]> = {
  romantic: ["girlfriend", "boyfriend", "wife", "husband", "crush", "partner"],
  birthday: ["girlfriend", "boyfriend", "wife", "husband", "crush", "bestfriend", "friend", "mother", "father", "sister", "brother", "colleague", "partner"],
  anniversary: ["girlfriend", "boyfriend", "wife", "husband", "partner"],
  apology: ["girlfriend", "boyfriend", "wife", "husband", "bestfriend", "friend", "mother", "father", "sister", "brother", "partner"],
  goodmorning: ["girlfriend", "boyfriend", "wife", "husband", "crush", "partner"],
  goodnight: ["girlfriend", "boyfriend", "wife", "husband", "crush", "partner"],
  friendship: ["bestfriend", "friend", "colleague"],
  loveletter: ["girlfriend", "boyfriend", "wife", "husband", "crush", "partner"],
  sorry: ["girlfriend", "boyfriend", "wife", "husband", "bestfriend", "friend", "partner"],
  farewell: ["girlfriend", "boyfriend", "wife", "husband", "bestfriend", "friend", "colleague", "partner"],
  proposal: ["girlfriend", "boyfriend", "partner"],
  longdistance: ["girlfriend", "boyfriend", "wife", "husband", "partner"],
  breakup: ["girlfriend", "boyfriend", "partner"],
  thankYou: ["girlfriend", "boyfriend", "wife", "husband", "bestfriend", "friend", "mother", "father", "sister", "brother", "colleague", "partner"],
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function buildMessageSlug(categorySlug: string, audience: string, title: string): string {
  const base = `${title}-for-${audience}-${categorySlug}`;
  return slugify(base);
}

const generatorSlugByCategory: Record<string, string> = {
  romantic: "romance-message-generator",
  birthday: "birthday-wish-generator",
  anniversary: "anniversary-letter-generator",
  apology: "apology-generator",
  goodmorning: "good-morning-generator",
  goodnight: "good-night-generator",
  friendship: "friendship-message-generator",
  loveletter: "love-letter-generator",
  sorry: "apology-generator",
  farewell: "farewell-message-generator",
  proposal: "proposal-message-generator",
  longdistance: "love-letter-generator",
  breakup: "apology-generator",
  thankYou: "thank-you-generator",
};

function buildMessageMetaTitle(title: string, audience: string): string {
  return title.replace(/{audience}/g, audienceLabel[audience] || audience);
}

function buildMessageMetaDescription(tone: string, audience: string, categorySlug: string): string {
  const label = audienceLabel[audience] || audience;
  if (categorySlug === "romantic") return `Send the perfect romantic message to ${label}. Express your love with words that touch the heart.`;
  if (categorySlug === "birthday") return `Find the best birthday wishes for ${label}. Make their special day even more memorable.`;
  if (categorySlug === "anniversary") return `Celebrate your love with anniversary messages for ${label}. Make your partner feel cherished.`;
  if (categorySlug === "apology") return `Write a sincere apology message for ${label}. Make things right with words from the heart.`;
  if (categorySlug === "goodmorning") return `Start ${label}'s day right with sweet good morning messages. Make them smile from the first moment.`;
  if (categorySlug === "goodnight") return `Send loving good night messages to ${label}. End their day with warmth and care.`;
  if (categorySlug === "friendship") return `Show ${label} how much their friendship means with heartfelt appreciation messages.`;
  if (categorySlug === "loveletter") return `Write a beautiful love letter for ${label}. Pour your heart out with romantic words.`;
  if (categorySlug === "sorry") return `Write a sincere sorry message for ${label}. Express your regret and ask for forgiveness.`;
  if (categorySlug === "farewell") return `Say goodbye to ${label} with a heartfelt farewell message. Express your gratitude and best wishes.`;
  if (categorySlug === "proposal") return `Plan the perfect proposal message for ${label}. Ask the biggest question with beautiful words.`;
  if (categorySlug === "longdistance") return `Send loving long distance messages to ${label}. Close the miles with heartfelt words.`;
  if (categorySlug === "breakup") return `Write a respectful breakup message for ${label}. End things with honesty and care.`;
  if (categorySlug === "thankYou") return `Write a heartfelt thank you message for ${label}. Express your gratitude beautifully.`;
  return `The perfect message for ${label}. Express your feelings with words that matter.`;
}

const toneContent: Record<string, {
  usageTips: string[];
  faqs: MessageFaq[];
  bestTiming: string;
  relatedTemplateId: string | null;
}> = {
  romantic: {
    usageTips: [
      "Personalize with specific memories or inside jokes to make it truly special.",
      "Read it aloud before sending — the rhythm of your words matters.",
      "Pair with a photo or a song link for a multi-sensory experience.",
      "Handwrite it if you really want to make an impact.",
    ],
    faqs: [
      { question: "How do I make my romantic message more personal?", answer: "Include specific details — a shared memory, their unique qualities, or a moment that changed everything for you." },
      { question: "Should I send romantic messages during the day or night?", answer: "Both work! Morning messages start their day with love. Night messages end it with warmth." },
      { question: "Can I use these for my partner every day?", answer: "Absolutely. Rotating different messages keeps the romance fresh and shows consistent effort." },
    ],
    bestTiming: "Send in the morning to start their day with love, or at night as a warm message before sleep.",
    relatedTemplateId: "love-chase",
  },
  birthday: {
    usageTips: [
      "Mention their age playfully — or avoid it entirely, depending on their sense of humor.",
      "Add a birthday memory you both share for a personal touch.",
      "Pair with a digital birthday card or an interactive birthday game.",
      "Send it right at midnight for maximum impact.",
    ],
    faqs: [
      { question: "What if I'm not good with words?", answer: "That's okay! Our AI generator helps you craft the perfect birthday message in seconds." },
      { question: "Should I keep it short or long?", answer: "Either works. Short messages are punchy and sweet. Long messages feel more heartfelt." },
      { question: "Can I add humor to a birthday message?", answer: "Yes! Humor makes birthday wishes memorable. Just keep it appropriate for your relationship." },
    ],
    bestTiming: "Send at midnight for a birthday surprise, or first thing in the morning to start their day with a smile.",
    relatedTemplateId: "birthday-surprise-journey",
  },
  anniversary: {
    usageTips: [
      "Mention the number of years and what each year has taught you.",
      "Reference a specific memory from your journey together.",
      "Look forward — share what you're excited about for the future.",
      "Keep it between the two of you with an inside reference.",
    ],
    faqs: [
      { question: "How do I write an anniversary message that stands out?", answer: "Focus on specific moments rather than general statements. 'Remember when we...' beats 'I love everything about you.'" },
      { question: "Should I mention challenges we've overcome?", answer: "Yes — it shows growth and strength. Frame it as 'we got through this together.'" },
      { question: "Can I use the same message every year?", answer: "You can, but fresh messages each year show you're still paying attention and putting in effort." },
    ],
    bestTiming: "Send on the morning of your anniversary, or recreate the moment you first said 'I love you.'",
    relatedTemplateId: "love-contract",
  },
  apology: {
    usageTips: [
      "Own the mistake fully — no 'but' or 'if only you had' statements.",
      "Be specific about what you're sorry for, not just 'I'm sorry.'",
      "Offer a concrete plan to make it right and prevent it from happening again.",
      "Give them space to respond. Don't demand forgiveness immediately.",
    ],
    faqs: [
      { question: "How do I make my apology sound sincere?", answer: "Avoid excuses. Acknowledge the hurt caused, express genuine regret, and state what you'll do differently." },
      { question: "What if they don't accept my apology?", answer: "Respect their feelings. Sometimes people need time. Let them know you'll be there when they're ready." },
      { question: "Should I apologize in person or in writing?", answer: "Written apologies give you time to choose your words carefully. Follow up in person when possible." },
    ],
    bestTiming: "Send as soon as you've calmed down and can think clearly. A rushed apology can feel insincere.",
    relatedTemplateId: "kitty-apology",
  },
  goodmorning: {
    usageTips: [
      "Keep it light and warm — a good morning message should feel like a gentle hug.",
      "Mention something about their day ahead to show you're thinking of them.",
      "Add an emoji or two to set the tone.",
      "Send it early — before they start their routine — for maximum impact.",
    ],
    faqs: [
      { question: "Should I send good morning messages every day?", answer: "If it feels natural, yes. Daily morning messages become a cherished ritual for many couples." },
      { question: "What if we're in a long-distance relationship?", answer: "Morning messages are even more important! They bridge the distance and make your partner feel close." },
      { question: "Can I make good morning messages creative?", answer: "Absolutely! Use inside jokes, memories of dreams, or plans for the future to keep them fresh." },
    ],
    bestTiming: "Send early in the morning before they start their day — ideally right after they wake up.",
    relatedTemplateId: "love-chase",
  },
  goodnight: {
    usageTips: [
      "Keep it soothing — aim for a warm, calming tone that helps them drift off.",
      "Reference your day together or wish them well for tomorrow.",
      "Avoid heavy topics or arguments right before bed.",
      "A simple 'sweet dreams' with a personal touch goes a long way.",
    ],
    faqs: [
      { question: "What's the best time to send a good night message?", answer: "Right before their usual bedtime, so it's the last thing they read before sleeping." },
      { question: "Can I send good night messages to a friend?", answer: "Of course! Close friends appreciate knowing someone is thinking of them before bed." },
      { question: "Should I include hopes for their dreams?", answer: "Yes — mentioning peaceful dreams or sweet thoughts makes the message feel more caring." },
    ],
    bestTiming: "Send 15-30 minutes before their usual bedtime so it's the last thing they read.",
    relatedTemplateId: "love-chase",
  },
  friendship: {
    usageTips: [
      "Reference a shared memory or inside joke to make it feel genuine.",
      "Keep the tone natural — like you're talking to them in person.",
      "Acknowledge something specific they've done for you lately.",
      "Don't overthink it. True friendship messages come from the heart.",
    ],
    faqs: [
      { question: "How do I write a message for a best friend?", answer: "Speak from the heart. Reference shared experiences, express gratitude, and remind them why they matter to you." },
      { question: "Should friendship messages be funny or serious?", answer: "Both work! A mix of humor and sincerity captures the essence of true friendship." },
      { question: "Can I send this to a friend I haven't spoken to in a while?", answer: "Absolutely. A thoughtful message can rekindle even old friendships." },
    ],
    bestTiming: "Send when you're genuinely thinking of them — spontaneity makes friendship messages feel authentic.",
    relatedTemplateId: "escape-me",
  },
  loveletter: {
    usageTips: [
      "Write like you're speaking directly to them — use their name, reference your story.",
      "Don't worry about perfection. Raw, honest words beat polished poetry.",
      "Include a specific memory that only the two of you share.",
      "End with a look toward the future — where you see yourselves together.",
    ],
    faqs: [
      { question: "How long should a love letter be?", answer: "As long as it needs to be. Some of the most powerful love letters are just a few sentences. Others are pages long." },
      { question: "Should I handwrite or type a love letter?", answer: "Handwritten letters feel more personal and timeless. Typed letters are easier to share digitally." },
      { question: "Can I send a love letter digitally?", answer: "Yes! A digital love letter can be just as meaningful, especially with interactive elements." },
    ],
    bestTiming: "Send on a regular day — not just on special occasions. Unexpected love letters hit differently.",
    relatedTemplateId: "our-memories",
  },
  sorry: {
    usageTips: [
      "Be specific about what you're sorry for — general apologies feel hollow.",
      "Acknowledge how your actions affected them, not just your own regret.",
      "Offer a genuine commitment to change.",
      "Give them time. A sincere apology doesn't demand an immediate response.",
    ],
    faqs: [
      { question: "How is a sorry message different from an apology message?", answer: "Sorry messages are usually shorter and more direct. Apologies are more detailed with explanation and amends." },
      { question: "What if I've apologized before for the same thing?", answer: "Acknowledge the pattern. Show them you understand why trust is broken and what's different this time." },
      { question: "Can a sorry message fix a serious fight?", answer: "It's a crucial first step. A sincere message opens the door for conversation and healing." },
    ],
    bestTiming: "Send after you've both had time to cool down, but before the distance grows too wide.",
    relatedTemplateId: "sorry-maze",
  },
  farewell: {
    usageTips: [
      "Focus on gratitude — thank them for the memories and impact they've had.",
      "Keep it warm and positive, even if the circumstances are difficult.",
      "Leave the door open for future connection if appropriate.",
      "End with genuine well-wishes for their journey ahead.",
    ],
    faqs: [
      { question: "How do I write a farewell message without making it too sad?", answer: "Focus on gratitude and positive memories. Celebrate the time you had together rather than mourning the goodbye." },
      { question: "Should I send a farewell message in person or in writing?", answer: "Both is ideal. A written message gives them something to keep and revisit later." },
      { question: "What if I'm the one leaving?", answer: "Express your gratitude, explain what the relationship meant to you, and share your hopes for their future." },
    ],
    bestTiming: "Send a day or two before the farewell — early enough to be meaningful, close enough to feel timely.",
    relatedTemplateId: "our-memories",
  },
  proposal: {
    usageTips: [
      "Build up to the question — let your words create anticipation.",
      "Reference your unique love story and what led to this moment.",
      "Be clear and direct when you finally ask.",
      "Practice reading it aloud. The rhythm matters.",
    ],
    faqs: [
      { question: "How do I make my proposal message unforgettable?", answer: "Share your journey — where you started, how you grew, and why you're certain about forever." },
      { question: "Should the proposal message be a surprise?", answer: "The message itself can be the surprise! An unexpected love declaration leading to the question is incredibly romantic." },
      { question: "Can I use a proposal message with an interactive template?", answer: "Yes! An interactive proposal makes the moment even more memorable and shareable." },
    ],
    bestTiming: "Choose a meaningful date — anniversary, the day you met, or a place that's special to both of you.",
    relatedTemplateId: "love-contract",
  },
  longdistance: {
    usageTips: [
      "Acknowledge the distance, but focus on the strength of your connection.",
      "Reference future plans to create anticipation for your next meeting.",
      "Use sensory details — describe what you'd do if you were together.",
      "Keep it consistent. Regular long-distance messages build trust and intimacy.",
    ],
    faqs: [
      { question: "How do I keep long-distance messages from feeling repetitive?", answer: "Share daily moments, photos, voice notes, and future plans. Variety keeps the connection fresh." },
      { question: "What's the best way to end a long-distance message?", answer: "End with hope — countdown to your next visit, or a sweet wish for their day ahead." },
      { question: "Should I send long messages or short ones?", answer: "Both! Sometimes a short 'thinking of you' matters as much as a long letter." },
    ],
    bestTiming: "Send when you know they have a quiet moment — mornings or evenings work best for meaningful connection.",
    relatedTemplateId: "our-memories",
  },
  breakup: {
    usageTips: [
      "Be honest but kind. Respect the relationship you had by ending it with dignity.",
      "Avoid blame — use 'I' statements about your own feelings.",
      "Don't leave false hope if you're certain about your decision.",
      "Give them space to process. A breakup message is the start of closure, not a conversation.",
    ],
    faqs: [
      { question: "Is it okay to break up via message?", answer: "For serious relationships, in-person is better. For casual or long-distance situations, a thoughtful message can be appropriate." },
      { question: "How do I end a relationship without being cruel?", answer: "Focus on your feelings and needs rather than their flaws. Be honest but compassionate." },
      { question: "Should I stay friends after a breakup?", answer: "Give it time. Space helps both people heal before considering a friendship." },
    ],
    bestTiming: "Choose a time when they have support available — not right before a major event or late at night.",
    relatedTemplateId: "the-final-button",
  },
  thankYou: {
    usageTips: [
      "Be specific about what you're thankful for — it shows genuine attention.",
      "Explain how their action or presence impacted you.",
      "Keep the focus on them, not on how their kindness made you look.",
      "A handwritten thank you message carries extra weight.",
    ],
    faqs: [
      { question: "How do I write a thank you message that feels genuine?", answer: "Be specific. Instead of 'thanks for everything,' say 'thank you for staying late to help me with...'" },
      { question: "Should I send a thank you message immediately?", answer: "Within 24-48 hours is ideal. The sooner, the more impact it has." },
      { question: "Can a thank you message be short?", answer: "Absolutely. A brief, sincere thank you often means more than a long, generic one." },
    ],
    bestTiming: "Send within 24 hours of the kind act or gesture for maximum impact and sincerity.",
    relatedTemplateId: "the-final-button",
  },
};

export function generateAllMessages(): MessageItem[] {
  const allMessages: MessageItem[] = [];
  let msgIndex = 0;

  for (const [toneSlug, templates] of Object.entries(messageTemplates)) {
    const validAudiences = toneSlugMap[toneSlug] || [];
    const toneData = toneContent[toneSlug];

    for (const template of templates) {
      for (const audience of validAudiences) {
        const label = audienceLabel[audience] || audience;
        const content = template.content.replace(/{audience}/g, label);
        const title = buildMessageMetaTitle(template.title, audience);
        const slug = buildMessageSlug(toneSlug, audience, template.title);
        const copyPrompt = template.copyPrompt.replace(/{audience}/g, label);

        allMessages.push({
          id: `msg-${msgIndex++}`,
          slug,
          title,
          metaTitle: `${title} | Craft Your Message`,
          metaDescription: buildMessageMetaDescription(toneSlug, audience, toneSlug),
          content,
          categorySlug: toneSlug,
          subcategorySlug: `${toneSlug}-${audience}`,
          tags: [toneSlug, audience, "message", "love", "relationship"],
          tone: toneSlug,
          audience,
          copyPrompt,
          usageTips: toneData?.usageTips ?? [],
          faqs: toneData?.faqs ?? [],
          bestTiming: toneData?.bestTiming ?? "",
          relatedTemplateId: toneData?.relatedTemplateId ?? null,
        });
      }
    }
  }

  return allMessages;
}

export const allMessagesCache: MessageItem[] = generateAllMessages();

export function getMessageBySlug(slug: string): MessageItem | undefined {
  return allMessagesCache.find((m) => m.slug === slug);
}

export function getMessagesByCategory(categorySlug: string): MessageItem[] {
  return allMessagesCache.filter((m) => m.categorySlug === categorySlug);
}

export function getMessagesByAudience(audience: string): MessageItem[] {
  return allMessagesCache.filter((m) => m.audience === audience);
}

export const categoryDisplay: Record<string, { name: string; description: string; icon: string; color: string }> = {
  romantic: { name: "Romantic Messages", description: "Express your love with heartfelt romantic words.", icon: "💖", color: "#ff5fb7" },
  birthday: { name: "Birthday Wishes", description: "Make birthdays special with personalized wishes.", icon: "🎂", color: "#ffd166" },
  anniversary: { name: "Anniversary Messages", description: "Celebrate your journey together with love.", icon: "💍", color: "#ff6b8a" },
  apology: { name: "Apology Messages", description: "Say sorry from the heart and make things right.", icon: "💔", color: "#7c5cff" },
  goodmorning: { name: "Good Morning Messages", description: "Start someone's day with warmth and love.", icon: "🌅", color: "#f9a825" },
  goodnight: { name: "Good Night Messages", description: "End the day with sweet dreams and love.", icon: "🌙", color: "#5c5cff" },
  friendship: { name: "Friendship Messages", description: "Celebrate the bond of true friendship.", icon: "🤝", color: "#23d3ee" },
  loveletter: { name: "Love Letters", description: "Pour your heart out in a beautiful love letter.", icon: "💌", color: "#ff5fb7" },
  sorry: { name: "Sorry Messages", description: "Express your regret with sincere words.", icon: "😢", color: "#7c5cff" },
  farewell: { name: "Farewell Messages", description: "Say goodbye with grace and gratitude.", icon: "👋", color: "#888" },
  proposal: { name: "Proposal Messages", description: "Ask the biggest question with beautiful words.", icon: "💍", color: "#ff6b8a" },
  longdistance: { name: "Long Distance Messages", description: "Close the distance with heartfelt words.", icon: "🌍", color: "#5c5cff" },
  breakup: { name: "Breakup Messages", description: "End things honestly and with respect.", icon: "💔", color: "#888" },
  thankYou: { name: "Thank You Messages", description: "Show your gratitude with thoughtful words.", icon: "🙏", color: "#23d3ee" },
};

export const generators: GeneratorItem[] = [
  {
    slug: "love-letter-generator",
    title: "AI Love Letter Generator",
    metaTitle: "AI Love Letter Generator - Write Beautiful Love Letters | Craft Your Message",
    metaDescription: "Generate beautiful, personalized love letters with AI. Express your deepest feelings in words that touch the heart.",
    h1: "AI Love Letter Generator",
    description: "Create heartfelt love letters with the help of AI. Whether you're writing to your partner, crush, or spouse, our generator helps you find the perfect words to express your love.",
    prompts: ["Write a romantic love letter", "Write a deep emotional love letter", "Write a short sweet love note", "Write a long distance love letter", "Write an anniversary love letter"],
    relatedGeneratorSlugs: ["romance-message-generator", "valentine-day-generator"],
    tone: "romantic",
    audience: "partner",
    faqs: [
      { question: "How does the AI love letter generator work?", answer: "Simply select your relationship, choose a tone, and our AI generates a personalized love letter you can customize further." },
      { question: "Can I edit the generated love letter?", answer: "Yes. After generation, you can edit any part of the letter before sharing or copying it." },
      { question: "Is this free to use?", answer: "Yes, the AI love letter generator is completely free. No hidden charges." },
    ],
  },
  {
    slug: "apology-generator",
    title: "AI Apology Message Generator",
    metaTitle: "AI Apology Generator - Write Sincere Apologies | Craft Your Message",
    metaDescription: "Generate sincere apology messages with AI. Make things right with heartfelt words that show you truly care.",
    h1: "AI Apology Generator",
    description: "Finding the right words to say sorry can be hard. Our AI apology generator helps you craft a sincere, personalized apology that shows you truly understand and care.",
    prompts: ["Write a sincere apology", "Write an apology for hurting someone", "Write an apology for a mistake", "Write an apology to a friend", "Write an apology to a partner"],
    relatedGeneratorSlugs: ["love-letter-generator", "relationship-repair-generator"],
    tone: "apology",
    audience: "partner",
    faqs: [
      { question: "How does the AI apology generator work?", answer: "Select the situation, choose your tone, and AI generates a personalized apology message you can customize." },
      { question: "Can I make the apology sound more serious?", answer: "Yes. Choose a serious tone and the AI will generate a more solemn and sincere apology." },
    ],
  },
  {
    slug: "birthday-wish-generator",
    title: "AI Birthday Wish Generator",
    metaTitle: "AI Birthday Wish Generator - Happy Birthday Messages | Craft Your Message",
    metaDescription: "Generate the perfect birthday wishes with AI. Make their special day unforgettable with personalized messages.",
    h1: "AI Birthday Wish Generator",
    description: "Create memorable birthday wishes with our AI generator. From funny to heartfelt, find the perfect words for anyone celebrating their special day.",
    prompts: ["Write a happy birthday message", "Write a funny birthday wish", "Write a heartfelt birthday message", "Write a birthday wish for a friend", "Write a birthday love message"],
    relatedGeneratorSlugs: ["love-letter-generator", "anniversary-letter-generator"],
    tone: "birthday",
    audience: "friend",
    faqs: [
      { question: "Can I generate birthday wishes for different relationships?", answer: "Yes. Select the relationship — friend, partner, family, or colleague — for a personalized message." },
      { question: "Can I make it funny?", answer: "Yes. Choose the funny tone for a lighthearted birthday wish." },
    ],
  },
  {
    slug: "anniversary-letter-generator",
    title: "AI Anniversary Letter Generator",
    metaTitle: "AI Anniversary Letter Generator - Celebrate Your Love | Craft Your Message",
    metaDescription: "Generate beautiful anniversary letters with AI. Celebrate your journey together with heartfelt words.",
    h1: "AI Anniversary Letter Generator",
    description: "Celebrate your love with a personalized anniversary letter. Our AI helps you express years of love, memories, and gratitude in beautiful words.",
    prompts: ["Write an anniversary love letter", "Write a wedding anniversary message", "Write a dating anniversary note", "Write a milestone anniversary letter"],
    relatedGeneratorSlugs: ["love-letter-generator", "romance-message-generator"],
    tone: "anniversary",
    audience: "partner",
    faqs: [
      { question: "Can I write for any anniversary year?", answer: "Yes. Mention the year in your prompt and the AI will tailor the message accordingly." },
    ],
  },
  {
    slug: "wedding-speech-generator",
    title: "AI Wedding Speech Generator",
    metaTitle: "AI Wedding Speech Generator - Memorable Wedding Speeches | Craft Your Message",
    metaDescription: "Generate a memorable wedding speech with AI. Whether best man, maid of honor, or groom — find the perfect words.",
    h1: "AI Wedding Speech Generator",
    description: "Writing a wedding speech is nerve-wracking. Our AI helps you craft a heartfelt, funny, and memorable speech for any role — best man, maid of honor, groom, bride, or parent.",
    prompts: ["Write a best man speech", "Write a maid of honor speech", "Write a groom's speech", "Write a parent of the bride speech"],
    relatedGeneratorSlugs: ["love-letter-generator", "anniversary-letter-generator"],
    tone: "romantic",
    audience: "partner",
    faqs: [
      { question: "Can I customize the speech length?", answer: "Yes. You can specify short, medium, or long and edit the generated speech." },
      { question: "Can I add personal stories?", answer: "Yes. The generator creates a base you can personalize with your own stories." },
    ],
  },
  {
    slug: "romance-message-generator",
    title: "AI Romance Message Generator",
    metaTitle: "AI Romance Message Generator - Romantic Texts & Notes | Craft Your Message",
    metaDescription: "Generate romantic messages with AI. Sweep them off their feet with words that spark love and passion.",
    h1: "AI Romance Message Generator",
    description: "Keep the romance alive with our AI romance message generator. From sweet texts to passionate declarations, find the words to make their heart skip a beat.",
    prompts: ["Write a romantic text message", "Write a sweet good morning text", "Write a flirty message", "Write a passionate love note"],
    relatedGeneratorSlugs: ["love-letter-generator", "date-idea-generator"],
    tone: "romantic",
    audience: "partner",
    faqs: [
      { question: "Can I send romantic messages daily?", answer: "Yes. Generate fresh romantic messages anytime to keep the spark alive." },
    ],
  },
  {
    slug: "good-morning-generator",
    title: "AI Good Morning Message Generator",
    metaTitle: "AI Good Morning Message Generator - Sweet Morning Texts | Craft Your Message",
    metaDescription: "Generate sweet good morning messages with AI. Start their day with love, warmth, and a smile.",
    h1: "AI Good Morning Message Generator",
    description: "Make every morning special with our AI good morning message generator. Start their day with love and positive energy.",
    prompts: ["Write a sweet good morning text", "Write a romantic good morning message", "Write a cute good morning note"],
    relatedGeneratorSlugs: ["love-letter-generator", "good-night-generator"],
    tone: "romantic",
    audience: "partner",
    faqs: [
      { question: "Can I schedule good morning messages?", answer: "The generator creates messages you can copy and send anytime." },
    ],
  },
  {
    slug: "good-night-generator",
    title: "AI Good Night Message Generator",
    metaTitle: "AI Good Night Message Generator - Sweet Dreams Messages | Craft Your Message",
    metaDescription: "Generate sweet good night messages with AI. End their day with love, warmth, and beautiful dreams.",
    h1: "AI Good Night Message Generator",
    description: "End their day perfectly with our AI good night message generator. From sweet to romantic, find the perfect words to send them off to dreamland.",
    prompts: ["Write a sweet good night text", "Write a romantic good night message", "Write a cute good night note"],
    relatedGeneratorSlugs: ["good-morning-generator", "love-letter-generator"],
    tone: "romantic",
    audience: "partner",
    faqs: [
      { question: "Can I make it romantic?", answer: "Yes. Choose romantic tone for heartwarming good night messages." },
    ],
  },
  {
    slug: "friendship-message-generator",
    title: "AI Friendship Message Generator",
    metaTitle: "AI Friendship Message Generator - Best Friend Texts | Craft Your Message",
    metaDescription: "Generate heartfelt friendship messages with AI. Show your best friend how much they mean to you.",
    h1: "AI Friendship Message Generator",
    description: "Celebrate your friendships with AI-generated messages. From appreciation to inside jokes, find the perfect words for your best friend.",
    prompts: ["Write a thank you message to a friend", "Write a best friend appreciation note", "Write a missing you message to a friend"],
    relatedGeneratorSlugs: ["love-letter-generator", "birthday-wish-generator"],
    tone: "friendship",
    audience: "friend",
    faqs: [
      { question: "Can I make it funny?", answer: "Yes. Choose the funny tone for playful friendship messages." },
    ],
  },
  {
    slug: "farewell-message-generator",
    title: "AI Farewell Message Generator",
    metaTitle: "AI Farewell Message Generator - Goodbye Messages | Craft Your Message",
    metaDescription: "Generate heartfelt farewell messages with AI. Say goodbye with grace, gratitude, and beautiful words.",
    h1: "AI Farewell Message Generator",
    description: "Saying goodbye is never easy. Our AI farewell message generator helps you find the right words to express gratitude, share memories, and wish them well.",
    prompts: ["Write a farewell message to a colleague", "Write a goodbye message to a friend", "Write a farewell note to a team"],
    relatedGeneratorSlugs: ["friendship-message-generator", "thank-you-generator"],
    tone: "farewell",
    audience: "friend",
    faqs: [
      { question: "Can I use it for work colleagues?", answer: "Yes. Specify the relationship for a professional or personal tone." },
    ],
  },
  {
    slug: "thank-you-generator",
    title: "AI Thank You Message Generator",
    metaTitle: "AI Thank You Message Generator - Gratitude Notes | Craft Your Message",
    metaDescription: "Generate heartfelt thank you messages with AI. Show your gratitude with beautiful, personalized words.",
    h1: "AI Thank You Message Generator",
    description: "Express your gratitude with our AI thank you message generator. Whether for a gift, help, or just because — find the perfect words to say thank you.",
    prompts: ["Write a thank you note for a gift", "Write a thank you message for help", "Write a gratitude letter", "Write a thank you to a friend"],
    relatedGeneratorSlugs: ["friendship-message-generator", "farewell-message-generator"],
    tone: "thankYou",
    audience: "friend",
    faqs: [
      { question: "Can I write a professional thank you?", answer: "Yes. Choose a formal tone for professional thank you messages." },
    ],
  },
  {
    slug: "proposal-message-generator",
    title: "AI Proposal Message Generator",
    metaTitle: "AI Proposal Message Generator - Will You Marry Me? | Craft Your Message",
    metaDescription: "Generate the perfect proposal message with AI. Ask the biggest question with beautiful, heartfelt words.",
    h1: "AI Proposal Message Generator",
    description: "Planning to propose? Our AI proposal message generator helps you craft the perfect words to ask the biggest question of your life.",
    prompts: ["Write a marriage proposal message", "Write a will you marry me speech", "Write a romantic proposal letter"],
    relatedGeneratorSlugs: ["love-letter-generator", "anniversary-letter-generator"],
    tone: "romantic",
    audience: "partner",
    faqs: [
      { question: "Can I personalize the proposal message?", answer: "Yes. The AI creates a base you can customize with your own story and details." },
      { question: "Is it suitable for any proposal style?", answer: "Yes. Whether public, private, or surprise, describe your plan and the AI will match the tone." },
    ],
  },
];

export const collections: CollectionItem[] = [
  {
    slug: "100-romantic-messages",
    title: "100 Romantic Messages for Every Occasion",
    metaTitle: "100 Romantic Messages - Perfect Love Texts & Notes | Craft Your Message",
    metaDescription: "Browse 100 romantic messages for every occasion. From sweet good mornings to passionate love notes, find the perfect words.",
    h1: "100 Romantic Messages for Every Occasion",
    description: "A curated collection of 100 romantic messages covering every moment — from first dates to anniversaries, from good morning texts to passionate love letters.",
    count: 100,
    categorySlug: "romantic",
    tone: "romantic",
    faqs: [
      { question: "Are these messages free to use?", answer: "Yes, all 100 romantic messages are completely free to use and share." },
      { question: "Can I customize these messages?", answer: "Absolutely. Use them as inspiration or copy and personalize them." },
    ],
    relatedCollectionSlugs: ["250-birthday-wishes", "500-good-night-texts"],
  },
  {
    slug: "250-birthday-wishes",
    title: "250 Birthday Wishes for Everyone",
    metaTitle: "250 Birthday Wishes - Happy Birthday Messages Collection | Craft Your Message",
    metaDescription: "Find the perfect birthday wishes from our collection of 250 messages. For friends, family, partners, and colleagues.",
    h1: "250 Birthday Wishes for Everyone",
    description: "The ultimate collection of 250 birthday wishes. Find the perfect message for any relationship — from romantic partners to colleagues.",
    count: 250,
    categorySlug: "birthday",
    tone: "birthday",
    faqs: [
      { question: "Can I find birthday wishes for any relationship?", answer: "Yes. The collection covers messages for partners, friends, family, and colleagues." },
    ],
    relatedCollectionSlugs: ["100-romantic-messages", "75-apology-messages"],
  },
  {
    slug: "500-good-night-texts",
    title: "500 Good Night Texts for Loved Ones",
    metaTitle: "500 Good Night Texts - Sweet Dreams Messages Collection | Craft Your Message",
    metaDescription: "Browse 500 sweet good night texts. Send your loved ones to sleep with warmth, love, and beautiful dreams.",
    h1: "500 Good Night Texts for Loved Ones",
    description: "A massive collection of 500 good night texts. Never run out of sweet ways to say good night to someone you love.",
    count: 500,
    categorySlug: "goodnight",
    tone: "romantic",
    faqs: [
      { question: "Can I send these on any platform?", answer: "Yes. Copy and share on WhatsApp, Instagram, SMS, or any messaging app." },
    ],
    relatedCollectionSlugs: ["100-romantic-messages", "250-birthday-wishes"],
  },
  {
    slug: "75-apology-messages",
    title: "75 Apology Messages to Make Things Right",
    metaTitle: "75 Apology Messages - Sincere Sorry Texts & Notes | Craft Your Message",
    metaDescription: "A collection of 75 sincere apology messages. Find the right words to say sorry and make things right.",
    h1: "75 Apology Messages to Make Things Right",
    description: "75 carefully written apology messages for when you need to say sorry. From small misunderstandings to serious conflicts.",
    count: 75,
    categorySlug: "apology",
    tone: "apology",
    faqs: [
      { question: "Can I use these for serious apologies?", answer: "Yes. The collection includes messages for all levels of seriousness." },
    ],
    relatedCollectionSlugs: ["100-romantic-messages", "200-love-letters"],
  },
  {
    slug: "200-love-letters",
    title: "200 Love Letters to Express Your Heart",
    metaTitle: "200 Love Letters - Beautiful Love Notes Collection | Craft Your Message",
    metaDescription: "Browse 200 beautiful love letters. Express your deepest feelings with words that touch the soul.",
    h1: "200 Love Letters to Express Your Heart",
    description: "200 love letters covering every emotion — from new love to lifelong commitment. Find the words your heart needs to say.",
    count: 200,
    categorySlug: "loveletter",
    tone: "romantic",
    faqs: [
      { question: "Can I find letters for different stages of love?", answer: "Yes. The collection includes letters for new relationships, long-term love, and everything in between." },
    ],
    relatedCollectionSlugs: ["100-romantic-messages", "500-good-night-texts"],
  },
  {
    slug: "300-good-morning-messages",
    title: "300 Good Morning Messages to Start Their Day",
    metaTitle: "300 Good Morning Messages - Sweet Morning Texts Collection | Craft Your Message",
    metaDescription: "A collection of 300 good morning messages. Start their day with love, warmth, and a smile.",
    h1: "300 Good Morning Messages to Start Their Day",
    description: "300 sweet good morning messages to make their mornings special. From romantic to cute, find the perfect way to say good morning.",
    count: 300,
    categorySlug: "goodmorning",
    tone: "romantic",
    faqs: [
      { question: "Can I send one every day?", answer: "Yes. With 300 messages, you have a different one for every day of the year." },
    ],
    relatedCollectionSlugs: ["500-good-night-texts", "100-romantic-messages"],
  },
  {
    slug: "50-proposal-messages",
    title: "50 Proposal Messages to Ask the Big Question",
    metaTitle: "50 Proposal Messages - Will You Marry Me? | Craft Your Message",
    metaDescription: "Find the perfect proposal message from 50 heartfelt options. Ask 'Will you marry me?' with beautiful words.",
    h1: "50 Proposal Messages to Ask the Big Question",
    description: "50 beautiful proposal messages for the biggest moment of your life. Find the perfect words to ask the love of your life to marry you.",
    count: 50,
    categorySlug: "proposal",
    tone: "romantic",
    faqs: [
      { question: "Can I customize these proposals?", answer: "Yes. Use them as inspiration and add your personal touch." },
    ],
    relatedCollectionSlugs: ["100-romantic-messages", "200-love-letters"],
  },
  {
    slug: "100-friendship-messages",
    title: "100 Friendship Messages for Best Friends",
    metaTitle: "100 Friendship Messages - Best Friend Texts & Notes | Craft Your Message",
    metaDescription: "Browse 100 friendship messages. Show your best friend how much they mean with heartfelt words.",
    h1: "100 Friendship Messages for Best Friends",
    description: "A collection of 100 friendship messages celebrating the bond of true friendship. From appreciation to funny inside jokes.",
    count: 100,
    categorySlug: "friendship",
    tone: "friendship",
    faqs: [
      { question: "Can I find messages for long-distance friends?", answer: "Yes. Many messages are perfect for friends you miss." },
    ],
    relatedCollectionSlugs: ["75-apology-messages", "300-good-morning-messages"],
  },
];

export const seasonalPages: SeasonalItem[] = [
  {
    slug: "valentines-day-messages",
    title: "Valentine's Day Messages",
    metaTitle: "Valentine's Day Messages - Romantic Love Notes & Texts | Craft Your Message",
    metaDescription: "Find the perfect Valentine's Day messages for your loved one. Romantic, sweet, and heartfelt words for February 14th.",
    h1: "Valentine's Day Messages",
    description: "Make this Valentine's Day unforgettable with our collection of romantic messages. From sweet love notes to passionate declarations, find the perfect words for February 14th.",
    date: "February 14",
    relatedSeasonalSlugs: ["anniversary-messages", "proposal-messages"],
    messageTypes: ["romantic", "loveletter", "goodmorning"],
    faqs: [
      { question: "What if I'm in a new relationship?", answer: "We have messages for every stage, including sweet and simple options for new relationships." },
      { question: "Can I use these for Valentine's Day cards?", answer: "Yes. Copy them into cards, texts, or social media posts." },
    ],
  },
  {
    slug: "mothers-day-messages",
    title: "Mother's Day Messages",
    metaTitle: "Mother's Day Messages - Thank You Mom Texts & Notes | Craft Your Message",
    metaDescription: "Find heartfelt Mother's Day messages. Show your mom how much she means with beautiful words of gratitude and love.",
    h1: "Mother's Day Messages",
    description: "Celebrate Mother's Day with heartfelt messages that express your love and gratitude. From emotional thank-you notes to sweet wishes.",
    date: "Second Sunday of May",
    relatedSeasonalSlugs: ["fathers-day-messages", "valentines-day-messages"],
    messageTypes: ["thankYou", "romantic"],
    faqs: [
      { question: "Can I find messages for grandmothers too?", answer: "Yes. Many messages can be adapted for any mother figure." },
    ],
  },
  {
    slug: "fathers-day-messages",
    title: "Father's Day Messages",
    metaTitle: "Father's Day Messages - Thank You Dad Texts & Notes | Craft Your Message",
    metaDescription: "Find the perfect Father's Day messages. Express your love and gratitude to Dad with heartfelt words.",
    h1: "Father's Day Messages",
    description: "Celebrate Father's Day with messages that show your dad how much he means to you. From appreciation to love, find the right words.",
    date: "Third Sunday of June",
    relatedSeasonalSlugs: ["mothers-day-messages", "valentines-day-messages"],
    messageTypes: ["thankYou", "friendship"],
    faqs: [
      { question: "Can I use these for stepfathers?", answer: "Yes. Our messages work for any father figure." },
    ],
  },
  {
    slug: "christmas-messages",
    title: "Christmas Messages & Wishes",
    metaTitle: "Christmas Messages - Merry Christmas Wishes & Greetings | Craft Your Message",
    metaDescription: "Find the perfect Christmas messages. Send warm holiday wishes to family, friends, and loved ones.",
    h1: "Christmas Messages & Wishes",
    description: "Spread holiday cheer with our collection of Christmas messages. From religious to funny, find the perfect words for your holiday greetings.",
    date: "December 25",
    relatedSeasonalSlugs: ["new-year-messages", "valentines-day-messages"],
    messageTypes: ["friendship", "birthday"],
    faqs: [
      { question: "Can I find religious Christmas messages?", answer: "Yes. The collection includes both religious and secular options." },
    ],
  },
  {
    slug: "new-year-messages",
    title: "New Year Messages & Wishes",
    metaTitle: "New Year Messages - Happy New Year Wishes & Greetings | Craft Your Message",
    metaDescription: "Find the perfect New Year messages. Send warm wishes for the new year to everyone you care about.",
    h1: "New Year Messages & Wishes",
    description: "Ring in the new year with heartfelt messages. From reflective to optimistic, find the perfect words for your New Year wishes.",
    date: "January 1",
    relatedSeasonalSlugs: ["christmas-messages", "valentines-day-messages"],
    messageTypes: ["friendship", "birthday", "thankYou"],
    faqs: [
      { question: "Can I send these on New Year's Eve?", answer: "Yes. They're perfect for both New Year's Eve and New Year's Day." },
    ],
  },
  {
    slug: "friendship-day-messages",
    title: "Friendship Day Messages",
    metaTitle: "Friendship Day Messages - Best Friend Wishes & Texts | Craft Your Message",
    metaDescription: "Celebrate Friendship Day with heartfelt messages for your best friends. Show them how much they mean to you.",
    h1: "Friendship Day Messages",
    description: "Celebrate the beautiful bond of friendship on Friendship Day. Find heartfelt messages for your best friends, old friends, and new friends.",
    date: "First Sunday of August",
    relatedSeasonalSlugs: ["christmas-messages", "new-year-messages"],
    messageTypes: ["friendship", "thankYou"],
    faqs: [
      { question: "Can I send these to a group of friends?", answer: "Yes. Many messages work perfectly for group chats or social media." },
    ],
  },
  {
    slug: "diwali-messages",
    title: "Diwali Messages & Wishes",
    metaTitle: "Diwali Messages - Festival of Lights Wishes & Greetings | Craft Your Message",
    metaDescription: "Find the perfect Diwali messages. Send warm festival of lights wishes to family, friends, and loved ones.",
    h1: "Diwali Messages & Wishes",
    description: "Celebrate the festival of lights with beautiful Diwali messages. From traditional to modern, find the perfect words for your loved ones.",
    date: "October-November (varies)",
    relatedSeasonalSlugs: ["christmas-messages", "new-year-messages"],
    messageTypes: ["friendship", "thankYou"],
    faqs: [
      { question: "Can I find traditional Diwali greetings?", answer: "Yes. Both traditional and contemporary messages are included." },
    ],
  },
  {
    slug: "raksha-bandhan-messages",
    title: "Raksha Bandhan Messages",
    metaTitle: "Raksha Bandhan Messages - Brother Sister Wishes | Craft Your Message",
    metaDescription: "Find the perfect Raksha Bandhan messages. Celebrate the bond between brothers and sisters with heartfelt words.",
    h1: "Raksha Bandhan Messages",
    description: "Celebrate the special bond between siblings this Raksha Bandhan. Find heartfelt messages for your brother or sister.",
    date: "August (varies)",
    relatedSeasonalSlugs: ["diwali-messages", "mothers-day-messages"],
    messageTypes: ["friendship", "thankYou"],
    faqs: [
      { question: "Can I send these to my brother?", answer: "Yes. Find messages specifically for brothers." },
      { question: "Can I send these to my sister?", answer: "Yes. Messages for sisters are also included." },
    ],
  },
  {
    slug: "eid-messages",
    title: "Eid Messages & Wishes",
    metaTitle: "Eid Messages - Eid Mubarak Wishes & Greetings | Craft Your Message",
    metaDescription: "Find the perfect Eid messages. Send warm Eid Mubarak wishes to family, friends, and community.",
    h1: "Eid Messages & Wishes",
    description: "Celebrate Eid with heartfelt messages. From Eid-ul-Fitr to Eid-ul-Adha, find the perfect words for your loved ones.",
    date: "Varies (Islamic calendar)",
    relatedSeasonalSlugs: ["diwali-messages", "christmas-messages"],
    messageTypes: ["friendship", "thankYou"],
    faqs: [
      { question: "Can I use these for both Eids?", answer: "Yes. Messages work for both Eid-ul-Fitr and Eid-ul-Adha." },
    ],
  },
];

export const gameSeoPages: GameSeoItem[] = [
  {
    slug: "hidden-love-letter",
    title: "Hidden Love Letter Game",
    metaTitle: "Hidden Love Letter - Interactive Mystery Message Game | Craft Your Message",
    metaDescription: "Play the Hidden Love Letter game. Hide your message behind puzzles and reveals in this romantic interactive experience.",
    h1: "Hidden Love Letter Game",
    description: "A romantic interactive game where you hide your love letter behind a series of puzzles and reveals.",
    longDescription: "The Hidden Love Letter game transforms your message into a mystery. Hide your heartfelt words behind puzzles, clues, and reveals. Your recipient must solve each challenge to unlock the next piece of your love letter, making the final reveal even more meaningful.",
    howToPlay: [
      "Choose your love letter or write a new one",
      "Set the difficulty of puzzles",
      "Customize the theme and colors",
      "Share the link with your special someone",
      "They solve puzzles to unlock your letter piece by piece",
    ],
    category: "Romantic",
    tone: "romantic",
    relatedGameSlugs: ["memory-garden", "star-message", "heart-chase"],
    faqs: [
      { question: "How long does the game take?", answer: "Typically 3-5 minutes depending on puzzle difficulty." },
      { question: "Can I customize the puzzles?", answer: "Yes. Choose from different puzzle types and difficulty levels." },
    ],
    templateId: "the-secret-room",
  },
  {
    slug: "memory-garden",
    title: "Memory Garden Game",
    metaTitle: "Memory Garden - Interactive Memory Flower Game | Craft Your Message",
    metaDescription: "Play the Memory Garden game. Plant flowers of memories and watch your love story bloom in this interactive experience.",
    h1: "Memory Garden Game",
    description: "A beautiful interactive game where memories bloom like flowers in a garden of love.",
    longDescription: "The Memory Garden game lets you plant and grow memories like flowers. Each memory you share blooms into a beautiful flower in a shared garden. Your recipient explores the garden, discovering each memory one flower at a time.",
    howToPlay: [
      "Write down your favorite memories",
      "Each memory becomes a seed in the garden",
      "Customize flower colors and garden theme",
      "Share the garden link with your loved one",
      "They explore blooming flowers to read each memory",
    ],
    category: "Romantic",
    tone: "romantic",
    relatedGameSlugs: ["hidden-love-letter", "star-message", "heart-chase"],
    faqs: [
      { question: "How many memories can I plant?", answer: "You can plant up to 20 memories in one garden." },
      { question: "Can two people add memories?", answer: "Yes. Both people can contribute to the same garden." },
    ],
    templateId: "memory-maze",
  },
  {
    slug: "star-message",
    title: "Star Message Game",
    metaTitle: "Star Message - Interactive Constellation Message Game | Craft Your Message",
    metaDescription: "Play the Star Message game. Hide your message in the stars and let your loved one discover it constellation by constellation.",
    h1: "Star Message Game",
    description: "A magical game where your message is hidden among the stars, waiting to be discovered.",
    longDescription: "The Star Message game turns your love note into a constellation. Each word is a star waiting to be connected. Your recipient draws lines between stars to reveal your message, one constellation at a time, under a beautiful night sky.",
    howToPlay: [
      "Write your message in the message composer",
      "The system turns each word into a star",
      "Customize the night sky background",
      "Share the star map with your loved one",
      "They connect the stars to read your hidden message",
    ],
    category: "Romantic",
    tone: "romantic",
    relatedGameSlugs: ["hidden-love-letter", "memory-garden", "heart-chase"],
    faqs: [
      { question: "Is it suitable for long messages?", answer: "Yes. Longer messages create more constellations to discover." },
      { question: "Can I add music?", answer: "Yes. You can add ambient music to enhance the experience." },
    ],
    templateId: "glitch-truth",
  },
  {
    slug: "heart-chase",
    title: "Heart Chase Game",
    metaTitle: "Heart Chase - Catch the Moving Heart Game | Craft Your Message",
    metaDescription: "Play the Heart Chase game. Catch the moving heart to reveal your love message in this playful interactive game.",
    h1: "Heart Chase Game",
    description: "A playful game where hearts run away and you catch them to unlock your love message.",
    longDescription: "The Heart Chase game adds playfulness to romance. Hearts scatter across the screen, and your recipient must catch each one to unlock a piece of your message. Each caught heart reveals more of your love note until the final heart delivers your complete message.",
    howToPlay: [
      "Write your love message",
      "The system hides each word in a heart",
      "Hearts move playfully across the screen",
      "Share the game link",
      "They catch hearts to read your message word by word",
    ],
    category: "Playful",
    tone: "romantic",
    relatedGameSlugs: ["hidden-love-letter", "memory-garden", "star-message"],
    faqs: [
      { question: "Is it challenging?", answer: "Hearts move at a comfortable pace so it's fun, not frustrating." },
      { question: "Can I change the heart colors?", answer: "Yes. Customize colors to match your theme." },
    ],
    templateId: "love-chase",
  },
  {
    slug: "apology-puzzle",
    title: "Apology Puzzle Game",
    metaTitle: "Apology Puzzle - Rebuild Your Apology Game | Craft Your Message",
    metaDescription: "Play the Apology Puzzle game. Rebuild your apology piece by piece in this interactive puzzle experience.",
    h1: "Apology Puzzle Game",
    description: "A thoughtful puzzle game where you rebuild your apology message piece by piece.",
    longDescription: "The Apology Puzzle game turns saying sorry into a meaningful experience. Your apology is broken into puzzle pieces. Your recipient must assemble the pieces to read your complete message, giving them time to process and understand your feelings.",
    howToPlay: [
      "Write your apology message",
      "The system breaks it into puzzle pieces",
      "Choose the puzzle difficulty",
      "Share the puzzle link",
      "They assemble pieces to read your apology",
    ],
    category: "Apology",
    tone: "apology",
    relatedGameSlugs: ["hidden-love-letter", "memory-garden"],
    faqs: [
      { question: "How many puzzle pieces are there?", answer: "Choose from 6, 12, or 24 pieces depending on difficulty." },
      { question: "Can I include images too?", answer: "Yes. You can add photos as puzzle images." },
    ],
    templateId: "sorry-puzzle",
  },
  {
    slug: "roast-wheel-game",
    title: "Roast Wheel Game",
    metaTitle: "Roast Wheel - Spin the Roast Game | Craft Your Message",
    metaDescription: "Play the Roast Wheel game. Spin the wheel and deliver the perfect roast with style and humor.",
    h1: "Roast Wheel Game",
    description: "A carnival-style wheel game that delivers hilarious roasts with perfect comedic timing.",
    longDescription: "The Roast Wheel game adds carnival flair to your roasts. Spin a colorful wheel that always lands on the perfect roast. Each segment holds a different level of burn, building up to the ultimate punchline.",
    howToPlay: [
      "Write your roast categories and punchlines",
      "Customize the wheel colors and theme",
      "Share the wheel link with your friend",
      "They spin the wheel to receive their roast",
      "The wheel always lands on the best one",
    ],
    category: "Funny",
    tone: "funny",
    relatedGameSlugs: ["heart-chase", "apology-puzzle"],
    faqs: [
      { question: "Is the wheel actually random?", answer: "It's rigged to always land on your best roast for perfect timing." },
      { question: "Can I use it for nice messages?", answer: "Yes. Choose a kind tone instead of roast." },
    ],
    templateId: "roast-wheel",
  },
  {
    slug: "scratch-love-card",
    title: "Scratch Love Card Game",
    metaTitle: "Scratch Love Card - Digital Scratch Card Love Game | Craft Your Message",
    metaDescription: "Play the Scratch Love Card game. Scratch off the digital surface to reveal your hidden love message.",
    h1: "Scratch Love Card Game",
    description: "A digital scratch card that reveals your love message as they scratch off the surface.",
    longDescription: "The Scratch Love Card game turns your love note into a lottery-style reveal. A metallic heart-shaped surface hides your message. Your recipient scratches off the surface with their finger, slowly revealing your words underneath. Each scratch unveils more of your message, building anticipation.",
    howToPlay: [
      "Write your love message",
      "The system hides it under a scratch layer",
      "Customize the scratch surface design",
      "Share the scratch card link",
      "They scratch to reveal your message",
    ],
    category: "Romantic",
    tone: "romantic",
    relatedGameSlugs: ["hidden-love-letter", "heart-chase", "star-message"],
    faqs: [
      { question: "Does it work on mobile?", answer: "Yes. Touch input works perfectly for scratching." },
      { question: "Can I change the scratch color?", answer: "Yes. Choose from metallic gold, silver, rose gold, or heart patterns." },
    ],
    templateId: "scratch-card",
  },
  {
    slug: "candle-birthday-game",
    title: "Candle Birthday Game",
    metaTitle: "Candle Birthday - Blow Out Candles Birthday Game | Craft Your Message",
    metaDescription: "Play the Candle Birthday game. Blow out virtual candles to reveal your birthday wish in this fun interactive game.",
    h1: "Candle Birthday Game",
    description: "A fun birthday game where blowing out candles reveals your birthday message.",
    longDescription: "The Candle Birthday game makes birthday wishes interactive. A beautiful cake with lit candles appears on screen. Your recipient blows out each candle (by tapping or blowing into the mic). Each extinguished candle reveals a word of your birthday message until the full wish is visible.",
    howToPlay: [
      "Write your birthday message",
      "The system places each word behind a candle",
      "Choose the cake design and candle colors",
      "Share the birthday game link",
      "They blow out candles to read your message",
    ],
    category: "Birthday",
    tone: "birthday",
    relatedGameSlugs: ["memory-garden", "heart-chase"],
    faqs: [
      { question: "Can I use mic blowing?", answer: "Yes. The game supports mic input for realistic candle blowing." },
      { question: "How many candles are there?", answer: "Up to 10 candles, one for each word of your message." },
    ],
    templateId: "birthday-cake",
  },
  {
    slug: "decoder-message-game",
    title: "Decoder Message Game",
    metaTitle: "Decoder Message - Secret Agent Message Game | Craft Your Message",
    metaDescription: "Play the Decoder Message game. Use a special lens to decode hidden messages in this spy-themed game.",
    h1: "Decoder Message Game",
    description: "A spy-themed game where messages are hidden behind classified black bars.",
    longDescription: "The Decoder Message game makes your recipient feel like a secret agent. Your message appears as a classified document with black bars covering the text. They drag a special decoder lens across the bars to read what's hidden underneath. Word by word, your secret message is revealed.",
    howToPlay: [
      "Write your secret message",
      "The system redacts it with classified bars",
      "Choose the document style and colors",
      "Share the classified document link",
      "They drag the decoder lens to read your message",
    ],
    category: "Mystery",
    tone: "romantic",
    relatedGameSlugs: ["hidden-love-letter", "star-message", "scratch-love-card"],
    faqs: [
      { question: "Can I make it look like a real document?", answer: "Yes. Choose from different document templates and styles." },
      { question: "Is it good for confessions?", answer: "Yes. The secret agent theme works perfectly for confessions and secrets." },
    ],
    templateId: "secret-decoder",
  },
  {
    slug: "slot-machine-game",
    title: "Slot Message Machine Game",
    metaTitle: "Slot Message Machine - Jackpot Message Game | Craft Your Message",
    metaDescription: "Play the Slot Message Machine game. Pull the lever and win the jackpot — your message delivered with confetti.",
    h1: "Slot Message Machine Game",
    description: "A carnival slot machine that always hits jackpot with your message.",
    longDescription: "The Slot Message Machine turns message delivery into a casino-worthy event. Pull the lever, watch the reels spin, and celebrate the guaranteed jackpot. Your message arrives with confetti, flashing lights, and perfect comedic timing.",
    howToPlay: [
      "Write your funny or sweet message",
      "Customize the slot machine theme",
      "Choose the jackpot animation style",
      "Share the slot machine link",
      "They pull the lever and win your message",
    ],
    category: "Funny",
    tone: "funny",
    relatedGameSlugs: ["roast-wheel-game", "heart-chase"],
    faqs: [
      { question: "Is it actually random?", answer: "No — it's rigged to always hit jackpot so your message delivers perfectly." },
      { question: "Does it make sound?", answer: "Yes, with optional sound effects for the full arcade experience." },
    ],
    templateId: "funny-slots",
  },
  {
    slug: "fog-love-letter",
    title: "Fog Love Letter Game",
    metaTitle: "Fog Love Letter - Flashlight in the Dark Game | Craft Your Message",
    metaDescription: "Play the Fog Love Letter game. Use a flashlight to find hidden love messages in the fog.",
    h1: "Fog Love Letter Game",
    description: "A romantic mystery game where love letters are hidden in fog, waiting to be discovered with a flashlight.",
    longDescription: "The Fog Love Letter game creates atmospheric romance. Your message is hidden behind layers of digital fog. Your recipient moves a flashlight beam across the screen, revealing your words through the mist. Each sweep of light uncovers more of your message, building mystery and intimacy.",
    howToPlay: [
      "Write your romantic message",
      "The system hides it behind fog layers",
      "Choose the fog density and atmosphere",
      "Share the foggy link",
      "They use a flashlight to reveal your words",
    ],
    category: "Romantic",
    tone: "romantic",
    relatedGameSlugs: ["hidden-love-letter", "star-message", "decoder-message-game"],
    faqs: [
      { question: "Can I add background music?", answer: "Yes. Add ambient music for a more immersive experience." },
      { question: "Does it work on mobile?", answer: "Yes. Touch input moves the flashlight naturally." },
    ],
    templateId: "mystery-fog",
  },
  {
    slug: "memory-flip-game",
    title: "Memory Flip Love Game",
    metaTitle: "Memory Flip - Match Cards Love Game | Craft Your Message",
    metaDescription: "Play the Memory Flip game. Match cards to unlock a hidden love message in this nostalgic memory game.",
    h1: "Memory Flip Love Game",
    description: "A nostalgic memory card game where matching pairs unlocks your hidden message.",
    longDescription: "The Memory Flip game combines the classic card matching game with romance. Cards are laid face down — each hiding a piece of your message. Your recipient flips cards to find matching pairs. Each successful match reveals more of your message. The final pair unlocks your complete love note.",
    howToPlay: [
      "Write your message — it gets split across card pairs",
      "Choose the card design and theme",
      "Set the grid size (easy to hard)",
      "Share the memory game link",
      "They match pairs to reveal your full message",
    ],
    category: "Playful",
    tone: "romantic",
    relatedGameSlugs: ["memory-garden", "hidden-love-letter", "heart-chase"],
    faqs: [
      { question: "How many cards are in the game?", answer: "Choose from 12, 16, or 20 cards depending on difficulty." },
      { question: "Can I customize the card back design?", answer: "Yes. Choose from various romantic patterns and colors." },
    ],
    templateId: "memory-flip",
  },
];

export type ImageSeoItem = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  description: string;
  categorySlug: string;
  tone: string;
  keywords: string[];
  relatedImageSlugs: string[];
};

export const imageSeoPages: ImageSeoItem[] = [
  { slug: "love-quotes-images", title: "Love Quotes Images", metaTitle: "Love Quotes Images - Beautiful Love Quote Pictures | Craft Your Message", metaDescription: "Beautiful love quotes images with romantic backgrounds. Download and share stunning love quote pictures.", h1: "Love Quotes Images", description: "Beautiful love quotes images with romantic backgrounds. Perfect for sharing on social media, Pinterest, or as wallpapers.", categorySlug: "romantic", tone: "romantic", keywords: ["love quotes", "love images", "romantic quotes", "love pictures"], relatedImageSlugs: ["birthday-wishes-images", "good-morning-images"] },
  { slug: "birthday-wishes-images", title: "Birthday Wishes Images", metaTitle: "Birthday Wishes Images - Happy Birthday Pictures | Craft Your Message", metaDescription: "Beautiful birthday wishes images with celebratory designs. Download and share happy birthday pictures.", h1: "Birthday Wishes Images", description: "Celebrate birthdays with beautiful birthday wishes images. Perfect for social media, cards, and messages.", categorySlug: "birthday", tone: "birthday", keywords: ["birthday wishes", "birthday images", "happy birthday pictures", "birthday quotes"], relatedImageSlugs: ["love-quotes-images", "good-morning-images"] },
  { slug: "good-morning-images", title: "Good Morning Images", metaTitle: "Good Morning Images - Beautiful Morning Pictures | Craft Your Message", metaDescription: "Beautiful good morning images with sunrise backgrounds. Download and share stunning morning pictures.", h1: "Good Morning Images", description: "Start someone's day right with beautiful good morning images. Featuring sunrise, nature, and romantic designs.", categorySlug: "goodmorning", tone: "romantic", keywords: ["good morning", "morning images", "good morning quotes", "sunrise pictures"], relatedImageSlugs: ["good-night-images", "love-quotes-images"] },
  { slug: "good-night-images", title: "Good Night Images", metaTitle: "Good Night Images - Sweet Dreams Pictures | Craft Your Message", metaDescription: "Beautiful good night images with moonlit scenes. Download and share sweet dreams pictures.", h1: "Good Night Images", description: "End the day beautifully with good night images. Moonlit scenes, starry skies, and romantic designs.", categorySlug: "goodnight", tone: "romantic", keywords: ["good night", "night images", "good night quotes", "sweet dreams pictures"], relatedImageSlugs: ["good-morning-images", "love-quotes-images"] },
  { slug: "sorry-images", title: "Sorry Images - Apology Pictures", metaTitle: "Sorry Images - Apology Pictures & Sorry Quotes | Craft Your Message", metaDescription: "Beautiful sorry images with apology messages. Download and share sincere sorry pictures.", h1: "Sorry Images", description: "Say sorry with beautiful apology images. Perfect for when words alone aren't enough.", categorySlug: "apology", tone: "apology", keywords: ["sorry images", "apology pictures", "sorry quotes", "forgive me images"], relatedImageSlugs: ["love-quotes-images", "friendship-images"] },
  { slug: "anniversary-images", title: "Anniversary Images", metaTitle: "Anniversary Images - Happy Anniversary Pictures | Craft Your Message", metaDescription: "Beautiful anniversary images with romantic designs. Download and share happy anniversary pictures.", h1: "Anniversary Images", description: "Celebrate your love with beautiful anniversary images. Perfect for social media and cards.", categorySlug: "anniversary", tone: "romantic", keywords: ["anniversary images", "anniversary pictures", "happy anniversary", "love anniversary"], relatedImageSlugs: ["love-quotes-images", "proposal-images"] },
  { slug: "proposal-images", title: "Proposal Images - Will You Marry Me Pictures", metaTitle: "Proposal Images - Will You Marry Me Pictures | Craft Your Message", metaDescription: "Beautiful proposal images with romantic designs. Download and share will you marry me pictures.", h1: "Proposal Images", description: "Ask the big question with beautiful proposal images. Perfect for social media announcements.", categorySlug: "proposal", tone: "romantic", keywords: ["proposal images", "will you marry me", "engagement pictures", "proposal quotes"], relatedImageSlugs: ["anniversary-images", "love-quotes-images"] },
  { slug: "friendship-images", title: "Friendship Images - Best Friend Pictures", metaTitle: "Friendship Images - Best Friend Pictures & Quotes | Craft Your Message", metaDescription: "Beautiful friendship images with heartfelt messages. Download and share best friend pictures.", h1: "Friendship Images", description: "Celebrate friendship with beautiful images. Perfect for best friends and special bonds.", categorySlug: "friendship", tone: "friendship", keywords: ["friendship images", "best friend pictures", "friendship quotes", "friend photos"], relatedImageSlugs: ["love-quotes-images", "sorry-images"] },
  { slug: "valentines-day-images", title: "Valentine's Day Images", metaTitle: "Valentine's Day Images - Romantic Pictures | Craft Your Message", metaDescription: "Beautiful Valentine's Day images with romantic designs. Download and share love pictures.", h1: "Valentine's Day Images", description: "Celebrate Valentine's Day with stunning romantic images. Perfect for cards and social media.", categorySlug: "romantic", tone: "romantic", keywords: ["valentine images", "valentines day pictures", "romantic images", "love day photos"], relatedImageSlugs: ["love-quotes-images", "anniversary-images"] },
  { slug: "mothers-day-images", title: "Mother's Day Images", metaTitle: "Mother's Day Images - Thank You Mom Pictures | Craft Your Message", metaDescription: "Beautiful Mother's Day images with heartfelt messages. Download and share thank you mom pictures.", h1: "Mother's Day Images", description: "Show your mom how much she means with beautiful Mother's Day images.", categorySlug: "romantic", tone: "thankYou", keywords: ["mothers day images", "mom pictures", "mothers day quotes", "thank you mom"], relatedImageSlugs: ["fathers-day-images", "love-quotes-images"] },
  { slug: "fathers-day-images", title: "Father's Day Images", metaTitle: "Father's Day Images - Thank You Dad Pictures | Craft Your Message", metaDescription: "Beautiful Father's Day images with heartfelt messages. Download and share thank you dad pictures.", h1: "Father's Day Images", description: "Show your dad how much he means with beautiful Father's Day images.", categorySlug: "friendship", tone: "thankYou", keywords: ["fathers day images", "dad pictures", "fathers day quotes", "thank you dad"], relatedImageSlugs: ["mothers-day-images", "friendship-images"] },
  { slug: "christmas-images", title: "Christmas Images - Merry Christmas Pictures", metaTitle: "Christmas Images - Merry Christmas Pictures & Quotes | Craft Your Message", metaDescription: "Beautiful Christmas images with festive designs. Download and share merry Christmas pictures.", h1: "Christmas Images", description: "Spread holiday cheer with beautiful Christmas images. Perfect for greetings and social media.", categorySlug: "friendship", tone: "friendship", keywords: ["christmas images", "merry christmas pictures", "christmas quotes", "holiday photos"], relatedImageSlugs: ["new-year-images", "love-quotes-images"] },
  { slug: "new-year-images", title: "New Year Images - Happy New Year Pictures", metaTitle: "New Year Images - Happy New Year Pictures & Quotes | Craft Your Message", metaDescription: "Beautiful New Year images with celebratory designs. Download and share happy new year pictures.", h1: "New Year Images", description: "Ring in the new year with beautiful images. Perfect for greetings and celebrations.", categorySlug: "friendship", tone: "friendship", keywords: ["new year images", "happy new year pictures", "new year quotes", "celebration photos"], relatedImageSlugs: ["christmas-images", "love-quotes-images"] },
];

export function getCollectionBySlug(slug: string): CollectionItem | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getSeasonalBySlug(slug: string): SeasonalItem | undefined {
  return seasonalPages.find((s) => s.slug === slug);
}

export function getGeneratorBySlug(slug: string): GeneratorItem | undefined {
  return generators.find((g) => g.slug === slug);
}

export function getGeneratorSlugForMessage(message: MessageItem): string {
  return generatorSlugByCategory[message.categorySlug] || "love-letter-generator";
}

export function getGameSeoBySlug(slug: string): GameSeoItem | undefined {
  return gameSeoPages.find((g) => g.slug === slug);
}

export function getImageSeoBySlug(slug: string): ImageSeoItem | undefined {
  return imageSeoPages.find((i) => i.slug === slug);
}

export function getRelatedMessages(message: MessageItem, count: number = 6): MessageItem[] {
  return allMessagesCache
    .filter((m) => m.slug !== message.slug && (m.categorySlug === message.categorySlug || m.audience === message.audience))
    .slice(0, count);
}

export function getRelatedGenerators(generator: GeneratorItem, count: number = 4): GeneratorItem[] {
  const slugs = generator.relatedGeneratorSlugs;
  return slugs.map((s) => generators.find((g) => g.slug === s)).filter((g): g is GeneratorItem => Boolean(g)).slice(0, count);
}

export function getRelatedCollections(collection: CollectionItem, count: number = 4): CollectionItem[] {
  return collection.relatedCollectionSlugs.map((s) => collections.find((c) => c.slug === s)).filter((c): c is CollectionItem => Boolean(c)).slice(0, count);
}

export function getRelatedSeasonals(item: SeasonalItem, count: number = 4): SeasonalItem[] {
  return item.relatedSeasonalSlugs.map((s) => seasonalPages.find((sp) => sp.slug === s)).filter((sp): sp is SeasonalItem => Boolean(sp)).slice(0, count);
}

export function getRelatedGames(game: GameSeoItem, count: number = 4): GameSeoItem[] {
  return game.relatedGameSlugs.map((s) => gameSeoPages.find((g) => g.slug === s)).filter((g): g is GameSeoItem => Boolean(g)).slice(0, count);
}

export function getRelatedImages(item: ImageSeoItem, count: number = 4): ImageSeoItem[] {
  return item.relatedImageSlugs.map((s) => imageSeoPages.find((i) => i.slug === s)).filter((i): i is ImageSeoItem => Boolean(i)).slice(0, count);
}

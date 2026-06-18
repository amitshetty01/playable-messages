export type FaqItem = {
  question: string;
  answer: string;
};

export type UseCaseContent = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  examples: string[];
  relatedTemplateIds: string[];
  faqs: FaqItem[];
};

export type TemplateSeoContent = {
  templateId: string;
  title: string;
  description: string;
  intro: string[];
  examples: string[];
  relatedUseCases: string[];
  faqs: FaqItem[];
};

export const useCasePages: UseCaseContent[] = [
  {
    slug: "apology-messages",
    title: "Interactive Apology Messages That Feel Personal",
    description: "Create apology messages with interactive choices, soft reveals, and shareable links that make saying sorry feel more thoughtful.",
    h1: "Interactive apology messages for making things right",
    intro: [
      "A plain sorry text can feel rushed. Craft Your Message helps you turn an apology into a small interactive moment with tone, pacing, and a sincere final reveal.",
      "Use it for fight repair, missed birthdays, late replies, misunderstandings, or any moment where you want your apology to feel more intentional."
    ],
    examples: [
      "I know I made the moment heavier than it needed to be. Tap through this, because I want to say sorry properly.",
      "I cannot undo what happened, but I can show you that I care enough to make this right.",
      "Choose my apology level. Funny first, honest after, and the real message at the end.",
      "I am not here to pressure you. I just wanted to say this with a little more care than a normal text."
    ],
    relatedTemplateIds: ["choose-my-punishment", "mood-repair-machine", "the-final-button"],
    faqs: [
      { question: "Can I write a serious apology?", answer: "Yes. You can keep the interaction playful or make every step gentle and sincere." },
      { question: "Will this pressure someone to forgive me?", answer: "No. The best apology messages avoid pressure and focus on ownership, care, and respect." },
      { question: "Can I preview before sharing?", answer: "Yes. Use the preview before generating a public link." }
    ]
  },
  {
    slug: "birthday-messages",
    title: "Unique Birthday Messages as Shareable Links",
    description: "Make birthday messages more memorable with interactive reveals, memory paths, funny challenges, and personalized shareable links.",
    h1: "Birthday messages that feel like a tiny surprise",
    intro: [
      "Turn a birthday wish into an interactive link with memories, jokes, reveals, and a final message that feels made for one person.",
      "It works for best friends, partners, siblings, classmates, coworkers, and anyone who deserves more than a copied birthday caption."
    ],
    examples: [
      "Your birthday unlocks three memories, one joke, and one message I actually mean.",
      "Before the wish appears, you have to survive this tiny birthday challenge.",
      "I made this because a normal happy birthday felt too small for you.",
      "Open the doors. Each one has one reason today matters."
    ],
    relatedTemplateIds: ["memory-maze", "the-secret-room", "dont-smile-challenge"],
    faqs: [
      { question: "Can I add inside jokes?", answer: "Yes. Add custom steps, funny lines, and a personal final birthday reveal." },
      { question: "Can I send it on WhatsApp?", answer: "Yes. Generated links can be copied or shared through messaging apps." },
      { question: "Does the recipient need an account?", answer: "No. They can open the public link directly." }
    ]
  },
  {
    slug: "friendship-messages",
    title: "Interactive Friendship Messages for Best Friends",
    description: "Create friendship messages, best friend notes, appreciation reveals, and inside-joke links that are easy to personalize and share.",
    h1: "Friendship messages that feel personal, funny, and real",
    intro: [
      "Best friend messages work better when they feel like your actual friendship. Use interactive templates to mix appreciation, teasing, memories, and honest reveals.",
      "Create a link for friendship anniversaries, thank-you notes, missing-you messages, birthday wishes, or just a random day when your friend deserves a smile."
    ],
    examples: [
      "I am going to roast you first, then say something dangerously nice.",
      "Pick a door. Every door has one memory I still think about.",
      "This is your official reminder that I am glad you exist.",
      "You have been promoted from friend to emotional support chaos partner."
    ],
    relatedTemplateIds: ["roast-to-respect", "memory-maze", "dont-smile-challenge"],
    faqs: [
      { question: "Can friendship messages be funny and emotional?", answer: "Yes. You can build a playful start and end with a sincere reveal." },
      { question: "Is this only for romantic messages?", answer: "No. Many templates are built for friendship, birthdays, jokes, and appreciation." },
      { question: "Can I use nicknames?", answer: "Yes. Add nicknames, inside jokes, and custom wording throughout the flow." }
    ]
  },
  {
    slug: "confession-messages",
    title: "Confession Messages With Interactive Reveals",
    description: "Create confession messages with suspense, hidden truths, deleted-message effects, and personal final reveals as shareable links.",
    h1: "Confession messages that reveal the truth slowly",
    intro: [
      "Some messages need a little suspense. Craft Your Message lets you build a confession that opens step by step instead of dropping everything in one text.",
      "Use it for crush confessions, emotional truths, hidden messages, mystery notes, or anything that needs a softer landing."
    ],
    examples: [
      "I typed this many times. This version finally says what I meant.",
      "There is a truth hidden behind this page. Tap carefully, but keep going.",
      "I made this because saying it directly felt impossible.",
      "The last reveal is the part I was scared to send."
    ],
    relatedTemplateIds: ["the-last-deleted-message", "glitch-truth", "the-final-button"],
    faqs: [
      { question: "Can I make a crush confession?", answer: "Yes. Use a mystery or deleted-message style template and write the final reveal in your own words." },
      { question: "Can I keep it subtle?", answer: "Yes. You control the wording, tone, and final message." },
      { question: "Can I preview the confession first?", answer: "Yes. Preview before generating the shareable link." }
    ]
  },
  {
    slug: "funny-roast-messages",
    title: "Funny Roast Messages That End With Respect",
    description: "Create funny roast messages, playful best friend jokes, and roast-to-respect reveals with interactive shareable links.",
    h1: "Funny roast messages with a playful reveal",
    intro: [
      "A good roast should feel playful, not mean. Use interactive templates to build a funny setup, a few jokes, and a final message that brings it back to respect.",
      "Great for best friends, group chats, siblings, classmates, and anyone who enjoys a little friendly chaos."
    ],
    examples: [
      "Your reply speed belongs in a museum, but somehow I still like talking to you.",
      "This roast has three levels. Survive them and you unlock the nice part.",
      "You are dramatic, suspiciously loud, and still one of my favorite people.",
      "I came here to roast you, but unfortunately the truth is that you matter."
    ],
    relatedTemplateIds: ["roast-to-respect", "dont-smile-challenge", "mood-repair-machine"],
    faqs: [
      { question: "Can I keep roasts friendly?", answer: "Yes. The best roast messages are playful, specific, and end with warmth." },
      { question: "Can I write my own jokes?", answer: "Yes. Replace every step with your own inside jokes and lines." },
      { question: "Is this good for best friends?", answer: "Yes. It works especially well for best friend jokes and playful appreciation." }
    ]
  },
  {
    slug: "interactive-message-generator",
    title: "Interactive Message Generator for Shareable Links",
    description: "Use an interactive message generator to create personalized apology, birthday, friendship, confession, and funny message links.",
    h1: "Interactive message generator for unique shareable links",
    intro: [
      "Craft Your Message turns a normal note into a small playable experience. Pick a template, customize the wording, preview it, and generate a link.",
      "Use it when you want a message to feel surprising, personal, and easy to open on mobile."
    ],
    examples: [
      "Open this when you have one minute. I made it instead of sending a boring text.",
      "This link has a small challenge, a few choices, and one final message.",
      "I wanted to say something properly, so I made it interactive.",
      "Tap through this. The last screen is the real reason I sent it."
    ],
    relatedTemplateIds: ["the-final-button", "the-risk-button", "the-secret-room"],
    faqs: [
      { question: "What is an interactive message?", answer: "It is a message that opens like a small experience with taps, choices, and a final reveal." },
      { question: "Can I make a link without coding?", answer: "Yes. Choose a template, customize the text, and generate a link." },
      { question: "Does it work on mobile?", answer: "Yes. The templates are built for mobile-first sharing." }
    ]
  },
  {
    slug: "thank-you-messages",
    title: "Creative Thank You Messages as Interactive Links",
    description: "Create thank you messages, appreciation notes, friendship thanks, and heartfelt reveal links that feel more personal than plain text.",
    h1: "Thank you messages that feel thoughtful and memorable",
    intro: [
      "A thank-you message can be simple, but it should still feel sincere. Use a tiny interactive flow to show appreciation in a way that feels intentional.",
      "Great for friends, partners, mentors, siblings, teammates, coworkers, or anyone who helped you through something."
    ],
    examples: [
      "I do not say this enough, but I noticed what you did for me.",
      "Open each box. Every one has a small reason I am grateful for you.",
      "This is not a huge speech. It is just a proper thank you, made with care.",
      "You made something easier for me, and I wanted you to know it mattered."
    ],
    relatedTemplateIds: ["the-secret-room", "memory-maze", "roast-to-respect"],
    faqs: [
      { question: "Can I use this for appreciation messages?", answer: "Yes. Thank-you and appreciation messages work well with reveal and memory templates." },
      { question: "Can I make it simple?", answer: "Yes. Use fewer steps and keep the final message short and sincere." },
      { question: "Can I share it publicly?", answer: "Generated links are public to anyone who has the URL, so avoid private details unless you have permission." }
    ]
  },
  {
    slug: "surprise-message-links",
    title: "Surprise Message Links for Personal Reveals",
    description: "Create surprise message links with interactive reveals, hidden notes, memory doors, and playful templates for any occasion.",
    h1: "Surprise message links people want to finish",
    intro: [
      "A surprise message link gives the recipient a reason to tap, smile, and keep going. It feels more personal than a plain message because the reveal unfolds slowly.",
      "Use it for apologies, birthdays, friendship notes, crush confessions, thank-you messages, or just a fun moment in chat."
    ],
    examples: [
      "This link is tiny, but the last screen is for you.",
      "I hid the real message behind three small choices.",
      "Open this when you want a little surprise from me.",
      "You are one tap away from the part I actually wanted to say."
    ],
    relatedTemplateIds: ["the-final-button", "the-secret-room", "glitch-truth"],
    faqs: [
      { question: "What can I use surprise links for?", answer: "Use them for any personal message that benefits from curiosity, pacing, and a reveal." },
      { question: "Can the link be shared on WhatsApp or Instagram?", answer: "Yes. Copy the generated link and share it wherever links are supported." },
      { question: "Can I edit the message after creating it?", answer: "The current MVP generates a public link from the submitted version, so preview carefully before sharing." }
    ]
  }
];

export const templateSeoPages: TemplateSeoContent[] = [
  {
    templateId: "the-final-button",
    title: "The Final Button Interactive Message Template",
    description: "Use The Final Button to create a playful interactive message with mood choices, tiny games, and a personal final reveal.",
    intro: ["The Final Button is built for curiosity. It starts with one tap, moves through a few choices, and ends with the message you really wanted to send."],
    examples: ["I made one button for you. Tap it when you are ready.", "This starts playful, but the final screen is the real message.", "Choose your mood and I will show you what I meant."],
    relatedUseCases: ["interactive-message-generator", "confession-messages", "surprise-message-links"],
    faqs: [
      { question: "What is The Final Button best for?", answer: "It works well for confessions, apologies, crush messages, and surprise reveals." },
      { question: "Is it fully playable?", answer: "Yes. This is the main fully playable template in the MVP." },
      { question: "Can I change the button text?", answer: "Yes. You can customize the landing text, button text, steps, and final reveal." }
    ]
  },
  {
    templateId: "the-last-deleted-message",
    title: "The Last Deleted Message Template",
    description: "Create a deleted-message style reveal for confessions, apologies, regrets, friendship notes, and emotional messages.",
    intro: ["The Last Deleted Message creates the feeling of restoring a message that was almost sent. It is useful when the final truth needs a little suspense."],
    examples: ["I typed this, deleted it, then realized you should still know.", "The safe version is easy. The deleted one is honest.", "This is the message I was scared to send."],
    relatedUseCases: ["confession-messages", "apology-messages", "friendship-messages"],
    faqs: [
      { question: "Is this good for emotional messages?", answer: "Yes. It is designed for careful reveals and honest final messages." },
      { question: "Can it be funny too?", answer: "Yes. You can add funny restored versions before the serious reveal." },
      { question: "Can I preview it first?", answer: "Yes. Preview the flow before creating your shareable link." }
    ]
  },
  {
    templateId: "the-risk-button",
    title: "The Risk Button Interactive Reveal Template",
    description: "Create a choice-based interactive message where every tap feels a little bolder before the final reveal.",
    intro: ["The Risk Button is for messages that should feel like a choice. Each button builds curiosity until the final reveal feels earned."],
    examples: ["Choose low key, medium, bold, or surprise me.", "Every button reveals a little more than the last.", "If you came this far, here is the truth."],
    relatedUseCases: ["interactive-message-generator", "confession-messages", "surprise-message-links"],
    faqs: [
      { question: "Can I make the choices softer?", answer: "Yes. You can rewrite labels and steps to match your tone." },
      { question: "Is it good for crush messages?", answer: "Yes. It works well for mystery, crush, and friendship reveals." },
      { question: "Does the recipient need to sign in?", answer: "No. They open the generated link directly." }
    ]
  },
  {
    templateId: "glitch-truth",
    title: "Glitch Truth Hidden Message Template",
    description: "Use Glitch Truth to create a hidden-message reveal where normal text breaks into the truth you want to share.",
    intro: ["Glitch Truth uses a broken-page feeling to reveal what is really underneath. It is best for mystery notes, confessions, and dramatic reveals."],
    examples: ["This page says everything is normal. It is lying.", "The glitch keeps replacing the safe version with the truth.", "System fixed. Truth recovered."],
    relatedUseCases: ["confession-messages", "surprise-message-links", "interactive-message-generator"],
    faqs: [
      { question: "Is Glitch Truth readable on mobile?", answer: "Yes. The layout is built to stay readable on small screens." },
      { question: "Can I make it less dramatic?", answer: "Yes. Replace the copy with softer lines." },
      { question: "What messages fit this template?", answer: "Hidden truths, confessions, mystery notes, and dramatic reveals work best." }
    ]
  },
  {
    templateId: "dont-smile-challenge",
    title: "Don't Smile Challenge Message Template",
    description: "Create a playful don't-smile challenge for friends, crushes, birthdays, funny roasts, and lighthearted message links.",
    intro: ["Don't Smile Challenge turns a message into a small game. It is playful, easy to personalize, and great for inside jokes."],
    examples: ["Your challenge is simple. Do not smile.", "Still not smiling? Fine, I have stronger material.", "If you smiled, the final message unlocks."],
    relatedUseCases: ["funny-roast-messages", "friendship-messages", "birthday-messages"],
    faqs: [
      { question: "Can I add inside jokes?", answer: "Yes. This template is built for custom funny lines." },
      { question: "Is it romantic or friendly?", answer: "It can be either, depending on your wording." },
      { question: "Can I use it for birthdays?", answer: "Yes. Add birthday jokes and end with a personal birthday wish." }
    ]
  },
  {
    templateId: "choose-my-punishment",
    title: "Choose My Apology Interactive Template",
    description: "Create a playful apology selector with funny choices, a repair moment, and a sincere final apology reveal.",
    intro: ["Choose My Apology gives a difficult message a lighter opening. The playful choices lead into a real apology that feels more thoughtful."],
    examples: ["Pick how I make it up to you.", "Funny repair choice saved. Now the real apology unlocks.", "Jokes aside, I am sorry."],
    relatedUseCases: ["apology-messages", "funny-roast-messages", "interactive-message-generator"],
    faqs: [
      { question: "Why is the URL choose-my-punishment?", answer: "The template keeps its original URL for compatibility, but the visible experience is now framed as a softer apology." },
      { question: "Can I remove the jokes?", answer: "Yes. You can write a fully sincere version." },
      { question: "Is this for serious conflicts?", answer: "Use respectful wording and avoid pressure. Serious situations may need a direct conversation too." }
    ]
  },
  {
    templateId: "mood-repair-machine",
    title: "Mood Repair Machine Message Template",
    description: "Create a playful mood repair message with scanner-style steps, funny diagnosis text, and a human final reveal.",
    intro: ["Mood Repair Machine is for light apology, friendship, and funny messages. It pretends to scan the mood, then reveals the human message underneath."],
    examples: ["Mood repair machine started.", "Detected: needs snacks, attention, and one sincere message.", "Machine failed. Human care required."],
    relatedUseCases: ["apology-messages", "friendship-messages", "funny-roast-messages"],
    faqs: [
      { question: "Is this template funny?", answer: "Yes. It is designed for playful diagnosis-style messages." },
      { question: "Can it be an apology?", answer: "Yes. Use the scanner as a soft opening before the apology." },
      { question: "Does it work on mobile?", answer: "Yes. The layout is responsive and button contrast is tuned for every theme." }
    ]
  },
  {
    templateId: "the-secret-room",
    title: "Secret Room Message Reveal Template",
    description: "Create a secret room message link with password-style choices, reveal boxes, and a personal final message.",
    intro: ["The Secret Room turns your message into a locked-room reveal. Each box can hold a memory, reason, joke, or truth before the final note."],
    examples: ["There is a secret room here. The right password opens it.", "Box 1: what I noticed. Box 2: what I never said.", "The room is open. Here is the real message."],
    relatedUseCases: ["birthday-messages", "thank-you-messages", "surprise-message-links"],
    faqs: [
      { question: "Why is the SEO URL /templates/secret-room?", answer: "It is cleaner for search and sharing, while the internal template ID remains stable." },
      { question: "Can I use it for birthdays?", answer: "Yes. Each box can reveal a birthday memory or wish." },
      { question: "Can I use it for thank-you messages?", answer: "Yes. The boxes work well for appreciation notes." }
    ]
  },
  {
    templateId: "memory-maze",
    title: "Memory Maze Message Template",
    description: "Create a memory-based message link where doors reveal moments, jokes, and the final personal message.",
    intro: ["Memory Maze is built for messages that depend on shared moments. Each door can reveal a memory, inside joke, or unsaid thought."],
    examples: ["You are inside a memory. Find the exit.", "Open the funny moment before the honest one.", "You found the exit, but this memory stayed."],
    relatedUseCases: ["birthday-messages", "friendship-messages", "thank-you-messages"],
    faqs: [
      { question: "What should I put in the doors?", answer: "Use shared memories, small details, jokes, or reasons you appreciate the person." },
      { question: "Is it good for birthdays?", answer: "Yes. It works well for birthday memories and milestone messages." },
      { question: "Can it be romantic?", answer: "Yes. Choose a romantic tone and write personal memories." }
    ]
  },
  {
    templateId: "roast-to-respect",
    title: "Roast-to-Respect Funny Message Template",
    description: "Create a funny roast message that flips into sincere respect, appreciation, or friendship at the end.",
    intro: ["Roast-to-Respect starts with jokes and ends with warmth. It is built for friends who can handle teasing and still appreciate the sincere part."],
    examples: ["Your attitude needs a software update.", "Enough roasting. Here is the actual truth.", "You are one of the people I am genuinely glad I know."],
    relatedUseCases: ["funny-roast-messages", "friendship-messages", "thank-you-messages"],
    faqs: [
      { question: "Can I keep it kind?", answer: "Yes. Keep jokes specific, playful, and avoid anything that would genuinely hurt." },
      { question: "Can I end with appreciation?", answer: "Yes. The final reveal is perfect for respect or gratitude." },
      { question: "Is it good for group chats?", answer: "Yes. It is easy to share as a funny link." }
    ]
  },
  {
    templateId: "love-beats",
    title: "Scratch Card Love Message Template",
    description: "Use the Scratch Card template to hide a love confession under a heart-shaped scratch-off layer that reveals your message touch by touch.",
    intro: ["Scratch Card turns a love message into a tactile reveal. The recipient drags across the surface like a lottery ticket, uncovering your words beneath a heart-shaped metallic layer."],
    examples: ["Scratch the heart to find out what I have been too shy to say.", "You earned this scratch. Every swipe reveals one more reason I care.", "This is the part I could not say out loud. Scratch to read it."],
    relatedUseCases: ["confession-messages", "surprise-message-links", "interactive-message-generator"],
    faqs: [
      { question: "What is a scratch card message?", answer: "It is a digital scratch-off layer that hides your message. The recipient drags their finger to uncover the text underneath." },
      { question: "Is it good for love confessions?", answer: "Yes. The playful reveal makes romantic confessions feel lighter and more memorable." },
      { question: "Can I change the scratch-off color?", answer: "You can customize the template message and theme to match your tone." }
    ]
  },
  {
    templateId: "sorry-puzzle",
    title: "Puzzle Pieces Apology Message Template",
    description: "Use the Puzzle Pieces template to turn an apology into a reassembly game where scattered fragments form your message when dragged into place.",
    intro: ["Puzzle Pieces gives an apology a physical feel. Your message breaks into fragments that the recipient drags back into position — each piece restoring one part of what you meant to say."],
    examples: ["I know things fell apart. Let me help put this back together.", "Each piece is part of what I should have said sooner.", "Drag the pieces. The full picture is my real apology."],
    relatedUseCases: ["apology-messages", "friendship-messages", "interactive-message-generator"],
    faqs: [
      { question: "How does the puzzle work?", answer: "Your message is split into draggable fragments. The recipient drags each piece to the correct spot to rebuild the full text." },
      { question: "Is this only for apologies?", answer: "It works for any message, but the reassembly metaphor fits apologies and fight repair especially well." },
      { question: "How many pieces are there?", answer: "The template uses a small grid so the puzzle stays quick and satisfying." }
    ]
  },
  {
    templateId: "funny-slots",
    title: "Slot Machine Funny Message Template",
    description: "Use the Slot Machine template to deliver a funny message through a rigged slot reel that always hits jackpot with confetti and laughs.",
    intro: ["Slot Machine turns a funny message into a carnival moment. Pull the lever, watch the reels spin, and enjoy the guaranteed jackpot — your message arrives with confetti and comic timing."],
    examples: ["Pull the lever. I rigged it so you always win.", "Jackpot. The prize is a message that will make you laugh.", "Spin to unlock a joke that landed better than any text could."],
    relatedUseCases: ["funny-roast-messages", "friendship-messages", "surprise-message-links"],
    faqs: [
      { question: "Is the slot machine actually random?", answer: "No — it is rigged to always hit jackpot so the message always delivers perfectly." },
      { question: "Can I use it for non-funny messages?", answer: "You can, but the carnival theme works best for playful and funny content." },
      { question: "Does it include sound effects?", answer: "The visual spin and confetti create the experience without requiring audio." }
    ]
  },
  {
    templateId: "secret-decoder",
    title: "Redacted Decoder Secret Message Template",
    description: "Use the Redacted Decoder template to hide a secret message behind classified black bars that reveal text under a movable decoder lens.",
    intro: ["Redacted Decoder makes a message feel classified. Black bars cover the text until the recipient drags a decoder lens across them — reading your secret one strip at a time."],
    examples: ["This document is classified. Drag the lens to decode the truth.", "Redacted: the part I was too scared to say. Lens required.", "Everything below is classified. Your job: decode what I actually meant."],
    relatedUseCases: ["confession-messages", "surprise-message-links", "mystery-confession"],
    faqs: [
      { question: "How does the decoder lens work?", answer: "A circular lens follows the pointer and reveals the text under the black bars within its radius." },
      { question: "Is it good for confessions?", answer: "Yes. The classified-document feel builds suspense for emotional or secret reveals." },
      { question: "Can I customize the redacted text?", answer: "Yes. Write any message and it will appear as blacked-out text until decoded." }
    ]
  },
  {
    templateId: "birthday-cake",
    title: "Cut the Cake Birthday Message Template",
    description: "Use the Cut the Cake template to hide a birthday wish inside a 3D cake that splits open when the recipient drags a knife through it.",
    intro: ["Cut the Cake turns a birthday wish into a 3D celebration. A realistic cake with frosting and a lit candle waits on screen. Dragging a knife across it splits the cake open, releasing falling crumbs and your hidden message."],
    examples: ["Make a wish before you cut — the message inside is from me.", "This cake has one candle and one secret. Cut it open.", "Happy birthday. Now cut the cake to find out what I really wished for."],
    relatedUseCases: ["birthday-messages", "surprise-message-links", "friendship-messages"],
    faqs: [
      { question: "Is the cake 3D?", answer: "Yes. It uses real-time 3D rendering with lighting, frosting material, and a candle flame animation." },
      { question: "Does it work on mobile?", answer: "Yes. The 3D scene is optimized and the knife follows touch input." },
      { question: "Can I reuse it for different birthdays?", answer: "Yes. Customize the message for each person and generate a new link." }
    ]
  },
  {
    templateId: "roast-wheel",
    title: "Spin the Wheel Roast Message Template",
    description: "Use the Spin the Wheel template to deliver a roast through a carnival wheel that always lands on the category holding your custom funny message.",
    intro: ["Spin the Wheel delivers a roast with theatrical timing. A colorful carnival wheel spins through roast categories and always lands on the one with your custom message — making the delivery feel like fate."],
    examples: ["Spin the wheel of misfortune. It is rigged in your favor.", "The wheel knows what you deserve. Spoiler: it is a roast.", "Landing on... the truth. Read your custom roast below."],
    relatedUseCases: ["funny-roast-messages", "friendship-messages", "surprise-message-links"],
    faqs: [
      { question: "Is the wheel random?", answer: "It looks random but always lands on your custom roast category for perfect timing." },
      { question: "Can I write a nice message instead of a roast?", answer: "Yes. The wheel works for any message, though the carnival theme suits playful content." },
      { question: "How many wheel segments are there?", answer: "The wheel has multiple colorful segments but always stops on your chosen one." }
    ]
  },
  {
    templateId: "memory-flip",
    title: "Flip & Match Memory Message Template",
    description: "Use the Flip & Match template to hide a message behind a memory card game — finding the last matching pair triggers the final reveal.",
    intro: ["Flip & Match turns your message into a memory game. Cards are laid face-down and the recipient flips them to find matching pairs. Finding the final pair unlocks the message you wrote."],
    examples: ["Flip the cards. Every match brings you closer to what I wanted to say.", "Match the pairs to unlock the message I hid for you.", "This game has a prize at the end — the words I have been meaning to share."],
    relatedUseCases: ["friendship-messages", "birthday-messages", "surprise-message-links"],
    faqs: [
      { question: "How many cards are in the game?", answer: "The game uses a grid of face-down cards that the recipient flips to find matching pairs." },
      { question: "Is it good for emotional messages?", answer: "Yes. The nostalgic feel of a memory game pairs well with heartfelt reveals." },
      { question: "Can the recipient skip the game?", answer: "The game is designed to be quick so the message feels earned without being frustrating." }
    ]
  },
  {
    templateId: "mystery-fog",
    title: "Flashlight in the Fog Message Template",
    description: "Use the Flashlight in the Fog template to hide a message behind darkness — the recipient drags a flashlight cone to explore and uncover hidden text.",
    intro: ["Flashlight in the Fog creates suspense through darkness. The screen is covered in fog and the recipient moves a flashlight beam to reveal the hidden message piece by piece."],
    examples: ["The screen is fogged over. Move the light to find what I hid.", "Some messages are clearer when you search for them. Start shining.", "Darkness, one flashlight, and the words I needed you to find."],
    relatedUseCases: ["mystery-confession", "surprise-message-links", "confession-messages"],
    faqs: [
      { question: "How does the flashlight work?", answer: "A radial gradient follows the pointer or touch, revealing the text beneath the fog layer within its radius." },
      { question: "Is this good for dramatic reveals?", answer: "Yes. The darkness metaphor works well for confessions, secrets, and emotional messages." },
      { question: "Does it work on mobile?", answer: "Yes. Touch drag moves the flashlight naturally." }
    ]
  }
];

export const faqItems: FaqItem[] = [
  { question: "What is Craft Your Message?", answer: "Craft Your Message is an interactive message generator for creating personalized shareable links with small games, choices, and final reveals." },
  { question: "What can I create?", answer: "You can create apology messages, birthday messages, friendship notes, confession reveals, funny roast messages, thank-you messages, and surprise links." },
  { question: "Do recipients need an account?", answer: "No. Recipients can open generated public links directly in their browser." },
  { question: "Can I preview before sharing?", answer: "Yes. Preview your message flow before generating a public link." },
  { question: "Are generated links private?", answer: "Generated links are public to anyone who has the URL. Do not include sensitive information unless you have permission and understand the link can be shared." },
  { question: "Is this relationship advice?", answer: "No. This website is for fun and entertainment only. It does not provide relationship advice, psychological assessment, or proof of anyone's feelings." }
];

export function getUseCase(slug: string) {
  return useCasePages.find((page) => page.slug === slug);
}

export function getTemplateSeoContent(templateId: string) {
  return templateSeoPages.find((page) => page.templateId === templateId);
}

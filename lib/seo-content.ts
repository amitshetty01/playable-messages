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
    intro: [
      "The Final Button turns a simple message into a chase. The recipient sees a button on screen — but every time they try to tap it, it moves away. They have to actually catch it to read what you wrote.",
      "This template is perfect for love confessions, playful dares, or any message where you want a moment of suspense before the reveal. The button darts around the screen, building anticipation with each near-miss.",
      "Best for: telling a crush how you feel, sending a flirty dare, or surprising someone with a message they won't forget. It keeps things light and fun while making the final words land harder.",
      "Customize the landing text, the button label, the chase steps, and the final reveal message. Preview it before sharing to make sure the pacing feels right."
    ],
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
    intro: [
      "Memory Maze (Heart Vault) creates a secret vault of shared memories. A beating heart waits to be touched, then a password screen appears — the recipient proves they know you before unlocking a world of photos and a final message.",
      "Each memory door can hold a photo, an inside joke, or a moment you've shared. The recipient moves through these doors one by one, building emotion until the final reveal hits.",
      "Best for: best friends, anniversary messages, nostalgia-filled birthday wishes, or reconnecting with someone you've known for years.",
      "Upload your own photos, write custom messages for each memory, and set a password that only they would know. It feels personal because it is."
    ],
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
    relatedUseCases: ["confession-messages", "surprise-message-links"],
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
    relatedUseCases: ["surprise-message-links", "confession-messages"],
    faqs: [
      { question: "How does the flashlight work?", answer: "A radial gradient follows the pointer or touch, revealing the text beneath the fog layer within its radius." },
      { question: "Is this good for dramatic reveals?", answer: "Yes. The darkness metaphor works well for confessions, secrets, and emotional messages." },
      { question: "Does it work on mobile?", answer: "Yes. Touch drag moves the flashlight naturally." }
    ]
  },
  {
    templateId: "birthday-surprise-journey",
    title: "Blow Out the Candles Birthday Message Template",
    description: "Create a birthday message with virtual candles that the recipient blows out one by one to reveal their wish hidden in icing.",
    intro: [
      "Blow Out the Candles turns a birthday greeting into an interactive cake moment. The recipient sees a beautifully decorated cake with lit candles. Each candle must be blown out by holding a click or tap, and with every extinguished flame, one more piece of the birthday message appears in frosting.",
      "The anticipation builds with each candle, making the final reveal feel earned and celebratory. It is perfect for birthdays where you want the wish itself to feel like a small ceremony rather than just another text.",
      "This template works especially well for milestone birthdays, close friends, partners, siblings, and anyone who deserves more than a standard happy birthday. The icing-style message is fully customizable, so you can write inside jokes, heartfelt wishes, or funny birthday notes.",
      "Customize the number of candles, the message that appears in icing, the cake color, and the celebratory final screen. Preview the experience before generating a shareable link.",
      "What makes this template unique is the candle-by-candle reveal mechanic that transforms a simple birthday wish into an interactive ceremony. Each blown-out flame reveals another word of your message in frosting, creating anticipation with every step. The tactile hold-to-blow interaction makes the recipient feel like they are actively participating in unwrapping their gift.",
      "To customize this template, start by writing your birthday message in short segments that appear one per candle. Choose the cake color and icing style to match the recipient's personality. Adjust the candle count based on how long you want the experience to last, and write a celebratory message for the final screen after all candles are blown."
    ],
    examples: ["Blow out candle one. The first word appears in icing.", "Three down, one to go. Each flame carries a part of your wish.", "Your birthday message is baking in the icing. Just blow out the candles.", "Every candle you blow out brings the real message closer."],
    relatedUseCases: ["birthday-messages", "surprise-message-links", "friendship-messages"],
    faqs: [
      { question: "How do you blow out the candles?", answer: "Tap or click and hold on each candle. The flame flickers and goes out after a short hold." },
      { question: "Can I add my own birthday message?", answer: "Yes. The full message is customizable — everything from the icing text to the final screen." },
      { question: "Does it work on mobile?", answer: "Yes. Tap-and-hold works naturally on touch screens." },
      { question: "Can I use this for someone who does not celebrate birthdays?", answer: "You can customize the template text to work for any celebration or milestone, not just birthdays." },
      { question: "How long does each candle take to blow out?", answer: "Each candle requires about 1-2 seconds of holding, so a 5-candle experience takes roughly 10-15 seconds total." }
    ]
  },
  {
    templateId: "birthday-journey",
    title: "Birthday Journey Interactive Message Template",
    description: "Create a birthday surprise that starts in a dark room and reveals a candle-lit cake with balloons, candles, and a personal message.",
    intro: [
      "Birthday Journey drops the recipient into a dark room where the only light comes from rising balloons and a single candle-lit cake waiting in the center. They pop balloons to reveal clues, blow out the candles, and a birthday message appears in the glow.",
      "This template turns a birthday greeting into an atmospheric experience. The dark-to-light progression mirrors the feeling of being surprised — starting in anticipation and ending in warmth.",
      "Great for milestone birthdays, surprise wishes, long-distance celebrations, and anyone who loves the feeling of walking into a room decorated just for them. The final message can be heartfelt, funny, or nostalgic depending on the tone you choose.",
      "Customize the number of balloons, the candle count, the reveal message, and the background mood. Preview the full journey before sharing your birthday link.",
      "What makes this template unique is the atmospheric dark-to-light progression that mirrors the feeling of walking into a surprise party. Starting in darkness with only floating balloons and a candle-lit cake creates genuine curiosity and wonder. Each popped balloon releases a clue or memory, building a narrative that culminates in a warm, illuminated birthday message.",
      "To customize this template, decide how many balloons you want and what each one reveals — memories, jokes, or hints. Choose the background mood and cake appearance to match the celebration. Write a birthday message that appears after the candles are blown out. Preview the full journey to ensure the pacing feels right before sharing."
    ],
    examples: ["The room is dark. Balloons rise from the floor. Pop them one by one.", "Each popped balloon releases a memory from the past year.", "Blow out the candles and the birthday wish appears in candlelight.", "Step into the dark and let the celebration unfold around you."],
    relatedUseCases: ["birthday-messages", "surprise-message-links", "friendship-messages"],
    faqs: [
      { question: "How many balloons can I add?", answer: "You can customize the number of balloons and what each one reveals." },
      { question: "Can I make it romantic?", answer: "Yes. The dark-room setting works well for romantic birthday messages." },
      { question: "How long does the experience take?", answer: "About 45 seconds depending on how fast they pop balloons and blow out candles." },
      { question: "Can the recipient skip the balloon popping?", answer: "The balloons are designed to be quick to pop, so the experience stays engaging without feeling like a chore." },
      { question: "What kind of messages work best in the balloons?", answer: "Short memories, personal jokes, reasons you appreciate them, or hints about the final birthday wish." }
    ]
  },
  {
    templateId: "candle-countdown",
    title: "Candle Countdown Birthday Message Template",
    description: "Create a birthday message where each candle on the cake holds one word — blow them out to read the full birthday wish.",
    intro: [
      "Candle Countdown turns words into flames. Each candle on the cake holds a single word of the birthday message. The recipient blows out candles one by one, and with each extinguished flame, the next word of the wish is revealed until the full message is readable.",
      "This word-by-word reveal builds anticipation and makes the birthday wish feel like unwrapping a gift in slow motion. It is simple, intuitive, and works across all devices.",
      "Perfect for birthday wishes, anniversary messages, celebration notes, and any occasion where you want the words themselves to feel like a countdown. The slower they blow, the longer the suspense lasts.",
      "Customize the number of candles, each word on each flame, the final birthday message, and the cake appearance. Preview before generating a link.",
      "What makes this template unique is the word-by-word candle reveal that transforms a birthday message into a suspenseful countdown. Each candle holds exactly one word, turning the simple act of blowing out flames into an act of discovery. The recipient experiences the message not as a block of text but as a sequence of reveals, making every word feel significant and earned.",
      "To customize this template, decide how many words your birthday message contains and assign one word per candle. Choose the cake design and color scheme to match the celebration. Set the blowing animation speed and the final reveal screen where the complete message is displayed. Preview the candle-by-candle flow before sharing your birthday link."
    ],
    examples: ["Candle one holds 'Happy'. Candle two holds 'Birthday'. Each flame is one word closer.", "Blow out each candle to unlock the next word of your birthday surprise.", "The full message hides behind seven flames. Start blowing.", "Every candle carries a piece of what I wanted to say."],
    relatedUseCases: ["birthday-messages", "friendship-messages"],
    faqs: [
      { question: "Can I control how many candles appear?", answer: "Yes. Choose how many words you want and the template creates that many candles." },
      { question: "Is this only for birthdays?", answer: "It works for any celebration, but the cake theme pairs naturally with birthdays." },
      { question: "Can I customize the cake color?", answer: "Yes. The cake appearance and theme are customizable." },
      { question: "Can I use this for non-birthday messages?", answer: "Yes. While the cake theme pairs naturally with birthdays, you can customize the text for anniversaries, milestones, or any celebration." },
      { question: "Does the recipient have to blow out all candles to read the message?", answer: "Yes. Each candle holds one word, so all candles must be extinguished to reveal the complete message. This ensures the full reveal is earned." }
    ]
  },
  {
    templateId: "love-chase",
    title: "Catch My Heart Love Message Template",
    description: "Create a playful love confession where the recipient must catch the truth — one button says 'You love me' and the other runs away forever.",
    intro: [
      "Catch My Heart turns a love confession into a chase. The recipient sees two buttons on screen. One says 'You love me' and the other darts away every time they try to tap it. The only way to read the message is to catch the truth.",
      "This playful mechanic mirrors the nervousness of a real confession. The recipient has to commit to the chase, and by the time they catch the button, the final message lands with more emotional weight than a simple text ever could.",
      "Perfect for crush confessions, playful romantic dares, Valentine's Day surprises, or any moment where you want to confess feelings with a smile. The chase builds anticipation, and the reveal feels earned.",
      "Customize the button labels, the chase text, the dodging speed, and the final love confession message. Preview the experience before generating your link.",
      "What makes this template unique is the real-time button dodging mechanic that turns a love confession into an actual chase. The button physically evades the cursor or touch, mirroring the nervous hesitation of a real confession. The recipient has to genuinely try to catch it, and by the time they succeed, the emotional payoff of the reveal is amplified by the effort they invested.",
      "To customize this template, write the button labels — one that runs and one that stays. Set the dodging speed to match how playful or persistent you want the chase to feel. Write the final confession message that appears when they catch the truth. Preview the chase to ensure the difficulty feels right before sharing."
    ],
    examples: ["Two buttons. One truth. The other runs away. Catch it.", "Every time you reach for the truth, it moves. Keep trying.", "The button knows what you want to hear. It just wants you to work for it.", "You caught it. Now here is what I have been meaning to say."],
    relatedUseCases: ["confession-messages", "surprise-message-links", "interactive-message-generator"],
    faqs: [
      { question: "Is this good for crush confessions?", answer: "Yes. The playful chase makes confessing feel lighter and more memorable." },
      { question: "Can I change the button text?", answer: "Yes. Customize both buttons and the dodging behavior." },
      { question: "Does the button actually move?", answer: "Yes. It dodges the cursor or touch in real time, making the chase feel real." },
      { question: "Can the button be too hard to catch?", answer: "The dodging speed is adjustable, so you can make the chase easy or challenging depending on the tone you want." },
      { question: "What if the recipient gives up chasing?", answer: "The button becomes easier to catch after several attempts, ensuring the message is always reachable." }
    ]
  },
  {
    templateId: "escape-me",
    title: "Escape Me Hidden Puzzle Message Template",
    description: "Create a puzzle-based message where the recipient taps arrow pieces in the right order to clear a heart and unlock a hidden personal message.",
    intro: [
      "Escape Me presents a heart made entirely of arrow pieces pointing in different directions. The recipient must tap each arrow in the correct order to remove it from the heart. Clearing every arrow reveals a hidden personal message waiting inside.",
      "This puzzle-with-a-payoff structure keeps the recipient engaged. Each successful tap removes a piece of the wall, and the anticipation grows as the heart slowly disappears to reveal what is underneath.",
      "Great for love confessions, apology notes, mystery messages, or any situation where you want the recipient to earn the reveal. The puzzle feels satisfying to solve, and the final message hits harder because they worked for it.",
      "Customize the number of arrow pieces, the puzzle order, the heart appearance, and the final reveal message. Preview the flow before sharing.",
      "What makes this template unique is the heart-shaped arrow puzzle that the recipient must dismantle piece by piece to reach the hidden message. Each arrow removed reveals more of what lies beneath, creating a powerful visual metaphor for breaking down walls to find the truth. The satisfying puzzle mechanic makes the final reveal feel genuinely earned.",
      "To customize this template, choose the number of arrow pieces and the sequence order to control difficulty. Select the heart appearance and colors to match your tone. Write the reveal message that appears once all arrows are cleared. Preview the puzzle to make sure the sequence is solvable before sharing."
    ],
    examples: ["A heart made of arrows. Tap each one in the right order to clear the path.", "Every arrow you remove is one wall closer to the truth.", "The puzzle is simple. The final message is not.", "Clear the heart. Find what is hidden inside."],
    relatedUseCases: ["confession-messages", "surprise-message-links", "interactive-message-generator"],
    faqs: [
      { question: "How does the puzzle work?", answer: "Arrows point in directions on a heart-shaped grid. Tap the matching arrow sequence to remove pieces." },
      { question: "Can I customize the difficulty?", answer: "Yes. You control the number of arrows and the sequence order." },
      { question: "Is it good for apology messages?", answer: "Yes. The puzzle mechanic works for light apologies where earning the reveal feels appropriate." },
      { question: "What happens if the recipient taps the wrong arrow?", answer: "Nothing breaks — the wrong arrow simply does not remove, guiding them to try the correct one." },
      { question: "Can I add hints for harder puzzles?", answer: "Yes. You can include subtle hints in the surrounding text to help the recipient without giving away the solution." }
    ]
  },
  {
    templateId: "our-memories",
    title: "Our Memories Interactive Scrapbook Template",
    description: "Create a beautiful interactive scrapbook where you share memories, make promises, and create a lasting keepsake for someone special.",
    intro: [
      "Our Memories is a full interactive scrapbook experience. The recipient flips through pages filled with shared memories, photos, inside jokes, promises, and a final heartfelt message. Each page builds on the last, creating a narrative of your relationship.",
      "Unlike a single-message template, Our Memories is designed for depth. You can add multiple memories, each with its own text and visual style. The scrapbook feel makes it perfect for anniversaries, long-distance relationships, friendship milestones, or any moment that deserves more than a few sentences.",
      "The recipient moves through the scrapbook at their own pace, flipping pages, tapping photos, and reading personal notes. The final page holds a letter that summarizes everything — a closing moment that ties the whole experience together.",
      "Customize every page with your own memories, photos, promises, and the closing letter. Preview the full scrapbook before generating a shareable link.",
      "What makes this template unique is its multi-page scrapbook format that allows you to build a complete narrative of your relationship or friendship. Unlike single-message templates, Our Memories lets you dedicate entire pages to different moments, creating a story that unfolds as the recipient flips through. The final letter page ties everything together, making it feel like a handmade gift.",
      "To customize this template, plan your pages in chronological or emotional order. Write a memory for each page, add inside jokes or significant details, and craft a closing letter that summarizes your feelings. Choose visual styles that match the tone of each memory. Preview the full scrapbook to ensure the flow feels natural before generating a link."
    ],
    examples: ["Page one: the day we met. Page two: the first time you made me laugh.", "Each memory is a page in this scrapbook. Flip through to find the one that matters most.", "I wrote down every memory I could fit. The last page is the only one you really need.", "Open the scrapbook. Every page has a piece of us."],
    relatedUseCases: ["friendship-messages", "thank-you-messages", "surprise-message-links"],
    faqs: [
      { question: "How many memories can I add?", answer: "You can add multiple memories, each with its own page in the scrapbook." },
      { question: "Can I add photos?", answer: "Yes. Each memory page supports custom text and imagery." },
      { question: "Is this good for proposals?", answer: "Yes. The scrapbook format works beautifully for proposal messages and anniversary surprises." },
      { question: "Can the recipient go back to previous pages?", answer: "Yes. The scrapbook supports flipping back and forth so they can revisit memories at their own pace." },
      { question: "How long should the closing letter be?", answer: "Aim for a paragraph that summarizes your feelings — long enough to feel meaningful, short enough to fit on one page." }
    ]
  },
  {
    templateId: "love-contract",
    title: "Love Contract Relationship Message Template",
    description: "Create a funny and emotional relationship contract with promises, rules, penalties, and signatures for couples and partners.",
    intro: [
      "Love Contract turns your relationship into a beautifully designed document with funny rules, heartfelt promises, playful penalties, a secret wax seal clause, and a signed certificate. The recipient reads through each section, from the preamble to the signatures, experiencing the full contract as an interactive document.",
      "This template blends humor and sincerity. The funny rules section lets you add inside jokes and playful agreements, while the heartfelt promises section carries the real emotional weight. The penalties clause adds a lighthearted consequence system, and the wax seal moment creates a ceremonial reveal.",
      "Perfect for couples celebrating anniversaries, newlyweds, long-term partners, or anyone who wants to create a playful yet meaningful relationship document. The certificate at the end can be screenshotted and kept as a digital keepsake.",
      "Customize every section — partner names, funny rules, serious promises, penalty ideas, the secret clause, and the final signed certificate. Preview before generating a link.",
      "What makes this template unique is its complete document-style format with multiple sections that blend humor and heartfelt sincerity. From funny rules and serious promises to playful penalties and a secret wax seal clause, the contract feels like a real document while being entirely romantic. The signature certificate at the end creates a memorable keepsake that couples can screenshot and treasure.",
      "To customize this template, start with your partner's name and yours. Write 3-5 funny rules that reflect your inside jokes, then 2-3 serious promises that carry emotional weight. Add creative penalties that are playful rather than punishing. The secret clause is your chance to reveal something deeply personal. Sign the certificate with a custom message and date."
    ],
    examples: ["Article 1: You must send a good morning text every day.", "Article 2: Penalty for forgetting our anniversary — one extravagant date.", "The secret wax seal reveals the one thing I could not put in writing.", "Signed, sealed, and delivered. This contract is official."],
    relatedUseCases: ["surprise-message-links", "interactive-message-generator", "birthday-messages"],
    faqs: [
      { question: "Is this legally binding?", answer: "No. It is a fun and emotional keepsake, not a legal document." },
      { question: "Can I customize every rule?", answer: "Yes. Every rule, promise, and penalty is fully customizable." },
      { question: "How long does it take to create?", answer: "About 5 minutes to fill in all sections and preview." },
      { question: "Can I add more than one secret clause?", answer: "The template is designed for one secret wax seal reveal, but you can combine multiple thoughts into that single section." },
      { question: "Can we both sign the certificate?", answer: "The certificate displays both names and the message you write, creating a shared keepsake for both of you." }
    ]
  },
  {
    templateId: "kitty-apology",
    title: "Kitty Apology Cute Sorry Message Template",
    description: "Create an adorable apology message where a cute kitty does funny actions before revealing an apology letter in the sweetest way possible.",
    intro: [
      "Kitty Apology disarms tension with cuteness. A tiny animated kitten appears on screen and performs a series of funny, adorable actions — batting at things, tilting its head, giving pleading eyes — before finally presenting an apology letter. The cuteness makes it nearly impossible to stay upset.",
      "This template is designed for light apologies where you want to show remorse without making the situation heavier. The kitty's antics soften the mood, and the apology letter that follows feels sincere because the playful setup shows you put thought into the delivery.",
      "Perfect for minor arguments, forgotten plans, late replies, or any situation where you need to say sorry to someone who appreciates cute things. Works especially well for partners, best friends, and anyone who loves animals.",
      "Customize the kitty's actions, the comedy timing, the apology letter text, and the final resolution screen. Preview the experience before sharing.",
      "What makes this template unique is its use of cuteness as an emotional icebreaker. The animated kitty performs adorable actions that naturally disarm tension before the sincere apology letter appears. The contrast between the playful kitty and the heartfelt letter creates a gentle emotional journey that makes saying sorry feel lighter without losing sincerity.",
      "To customize this template, choose the kitty's sequence of actions — batting, head-tilting, pleading eyes, or spins. Set the comedy timing to control how long each action plays. Write the apology letter that the kitty delivers at the end. Preview the experience to make sure the transition from playful to sincere feels natural."
    ],
    examples: ["A tiny kitty appears with big eyes. You cannot stay mad at that face.", "The kitty bats at the screen, does a little spin, and then — the apology letter.", "Sorry looks better when a kitten delivers it. Read the letter when you are ready.", "The kitty did its part. Now the real apology is in this letter."],
    relatedUseCases: ["apology-messages", "friendship-messages", "interactive-message-generator"],
    faqs: [
      { question: "Is this for serious apologies?", answer: "It works best for light-to-moderate apologies. Serious situations may need a direct conversation." },
      { question: "Can I customize the kitty?", answer: "You can customize the actions, timing, and the apology letter text." },
      { question: "Does the kitty have sound?", answer: "The kitty actions are visual. Sound effects are optional." },
      { question: "Can I use a different animal instead of a kitty?", answer: "The template is designed around the kitty character, but you can customize the visual theme to match your preference." },
      { question: "Will the kitty animation work slowly on older phones?", answer: "The animations are lightweight and optimized to run smoothly on most devices, including older smartphones." }
    ]
  },
  {
    templateId: "sorry-maze",
    title: "Sorry Maze Apology Game Template",
    description: "Create a glowing apology maze where the recipient navigates through twists and turns to reach a heartfelt message waiting at the center.",
    intro: [
      "Sorry Maze turns an apology into a journey. The recipient navigates a glowing neon maze, collecting gems and avoiding dead ends, until they reach a pulsing heart at the center that holds the apology message. The maze represents the complexity of saying sorry — the path is not always straight, but the destination is worth it.",
      "This template works well for apologies that need a little humility. The recipient has to actively engage with the experience, and by the time they reach the center, the apology feels earned rather than demanded.",
      "Great for best friends, partners, siblings, or anyone where a playful approach to apologizing fits your relationship. The maze is simple enough to complete quickly but feels satisfying to solve.",
      "Customize the maze layout, the gem collectibles, the heart animation, and the final apology message. Preview the maze before generating a link.",
      "What makes this template unique is the neon maze metaphor that turns an apology into a journey of persistence. The winding paths and dead ends represent the complexity of saying sorry, while the gems collected along the way symbolize the reasons behind the apology. Reaching the pulsing heart at the center feels like finding emotional clarity after navigating through confusion.",
      "To customize this template, design the maze layout to be easy or slightly challenging depending on the tone. Place gems along the path that each reveal a reason for the apology. Write the final message that appears at the heart. Preview the maze to ensure the path is clear and the experience feels satisfying before generating a link."
    ],
    examples: ["Find your way through the maze. Every twist brings you closer to the sorry.", "Collect the gems. Each one represents a reason I am sorry.", "The heart at the center holds what I should have said directly.", "The maze is winding, but the destination is honest."],
    relatedUseCases: ["apology-messages", "friendship-messages", "interactive-message-generator"],
    faqs: [
      { question: "Is the maze hard to solve?", answer: "The maze is designed to be solvable in under a minute with a clear path to the center." },
      { question: "Can I create my own maze layout?", answer: "Yes. The maze structure and gem placements are customizable." },
      { question: "Does it work on mobile?", answer: "Yes. Touch-based navigation works naturally on phones." },
      { question: "What happens if the recipient gets stuck in the maze?", answer: "Optional hints can be enabled to guide them toward the correct path without spoiling the experience." },
      { question: "Can I add multiple apology messages in the maze?", answer: "Each gem can hold a short text, allowing you to spread your apology across multiple discoveries before the final heart message." }
    ]
  },
  {
    templateId: "come-closer",
    title: "Come Closer Prank Message Template",
    description: "Create a funny prank message that tricks friends into thinking something serious is happening before a hilarious full-screen surprise reveal.",
    intro: [
      "Come Closer Prank builds suspense with a dark room setup and a serious countdown — 3, 2, 1 — before hitting the recipient with a full-screen brightness blast and a hilarious reveal message. The contrast between the serious buildup and the silly payoff makes the laugh land hard.",
      "This template is designed purely for fun. It works best for close friends who enjoy playful pranks, sibling teasing, and group chat chaos. The recipient will groan, laugh, and immediately want to send it to someone else.",
      "Perfect for best friends, siblings, classmates, and anyone with a good sense of humor. The reveal message can be a funny roast, an inside joke, a meme reference, or a silly confession.",
      "Customize the countdown duration, the buildup text, the brightness intensity, and the final prank reveal message. Preview to test the timing before sharing.",
      "What makes this template unique is the dramatic contrast between its serious, suspenseful buildup and its hilariously unexpected payoff. The dark room setup and countdown create genuine tension, making the sudden brightness blast and funny reveal hit with maximum comedic impact. It is the only template designed specifically to prank the recipient, making it perfect for playful relationships.",
      "To customize this template, write a convincing buildup that makes the recipient believe something important is about to happen. Set the countdown duration to control how long the suspense lasts. Choose the brightness intensity for the surprise blast. Write the prank reveal message — a roast, inside joke, or silly confession. Preview to test the timing before sharing."
    ],
    examples: ["Go to a dark room. I need to show you something serious.", "3... 2... 1... SURPRISE! You just got pranked.", "The buildup is intense. The payoff is ridiculous. Send it to your best friend.", "You fell for it. Now read the roast I prepared."],
    relatedUseCases: ["funny-roast-messages", "friendship-messages"],
    faqs: [
      { question: "Is this harmful to eyes?", answer: "No. The brightness increase is within safe display ranges, just surprising." },
      { question: "Can I customize the prank text?", answer: "Yes. Everything from the countdown to the reveal message is customizable." },
      { question: "Can I use it for group chats?", answer: "Yes. Share the link in any chat and watch the reactions roll in." },
      { question: "Can I make the prank less intense for sensitive friends?", answer: "Yes. You can reduce the brightness intensity and soften the reveal message for a gentler prank experience." },
      { question: "Can the recipient replay the prank?", answer: "Yes. The prank can be replayed so they can show friends how it works or experience it again." }
    ]
  },
  {
    templateId: "memory-journey",
    title: "Braid a Bracelet Friendship Message Template",
    description: "Create a memory-based message where the recipient weaves three colored strands into a friendship bracelet, revealing a charm with your hidden message.",
    intro: [
      "Braid a Bracelet turns a message into a craft. Three colored strands appear on screen, and the recipient drags them over each other in a weaving motion to braid a friendship bracelet. When the braid is complete, a charm at the center opens to reveal the hidden message.",
      "The act of braiding creates a tactile, meditative experience. Each strand can represent a different memory, person, or feeling, making the final reveal feel connected to the effort of creation.",
      "Perfect for friendship messages, long-distance best friends, memory sharing, and appreciation notes. The bracelet metaphor works beautifully for relationships built over time — the braid is stronger because multiple strands are woven together.",
      "Customize the strand colors, the number of weaves required, the charm appearance, and the final message revealed inside the charm.",
      "What makes this template unique is the braiding mechanic that turns message delivery into a craft activity. The recipient physically weaves strands together, each one representing a different memory or feeling, making the final reveal feel connected to their own effort. The bracelet metaphor creates a meaningful keepsake that symbolizes how relationships are built strand by strand.",
      "To customize this template, choose three strand colors that represent different aspects of your relationship — inside jokes, shared memories, or personality traits. Write the message that appears inside the charm at the center. Adjust the number of weaves required to control the experience length. Preview the braiding flow to ensure it feels satisfying before sharing."
    ],
    examples: ["Three strands. Each one is a year of friendship. Weave them together.", "Strand one: shared secrets. Strand two: inside jokes. Strand three: the truth.", "Drag each strand over the next. The charm at the end holds my message.", "Friendship is braided, not tied. Weave these strands to find what I kept for you."],
    relatedUseCases: ["friendship-messages", "birthday-messages", "thank-you-messages"],
    faqs: [
      { question: "How does the braiding work?", answer: "Drag each colored strand over the next in sequence to create a braided pattern." },
      { question: "Can I customize strand colors?", answer: "Yes. Each strand color is fully customizable." },
      { question: "Is this good for anniversaries?", answer: "Yes. The braiding metaphor works well for relationship milestones." },
      { question: "Can I add more than three strands?", answer: "The template is designed around three strands for the classic braid structure, but you can customize the visual experience to suit your needs." },
      { question: "Can the recipient replay the braiding experience?", answer: "Yes. If they want to experience the braiding again or show someone else, they can replay the entire flow." }
    ]
  },
  {
    templateId: "polaroid-stack",
    title: "Polaroid Stack Memory Message Template",
    description: "Create a nostalgic message where the recipient lifts polaroid photos one by one to reveal memories, ending with a handwritten final note.",
    intro: [
      "Polaroid Stack presents a stack of polaroid photos. The recipient lifts each photo to reveal a memory written on the back. The photos develop slowly as they appear, adding to the nostalgic feel. The final photo has a handwritten message on the back — the real reason you sent the link.",
      "Each photo can hold a different memory, inside joke, appreciation point, or reason. The stack format creates a narrative arc — each lifted photo adds context, and the final message lands with the weight of everything that came before.",
      "Perfect for friendship appreciation messages, anniversary reflections, birthday memory walks, farewell notes, or any moment where you want to acknowledge shared history.",
      "Customize the number of photos, the memory text on each photo, the photo appearance delay, and the final handwritten message.",
      "What makes this template unique is the nostalgic polaroid format that presents memories as physical photos waiting to be lifted. Each photo develops slowly on screen, creating anticipation before the recipient flips it to read the memory on the back. The stack structure builds a natural narrative where each revealed photo adds context, making the final handwritten message land with cumulative emotional weight.",
      "To customize this template, arrange your memories in narrative order so each photo builds on the last. Write the back-of-photo text for each memory and choose the photo development speed. The final photo should carry the most important message — the real reason you sent the link. Preview the stack to ensure the pacing and emotional arc feel right before sharing."
    ],
    examples: ["Lift the first photo. A memory from the year we met.", "The second photo holds that inside joke we still laugh about.", "Each photo develops a little more of the story I wanted to tell.", "The last photo is not a memory. It is the message I actually needed to send."],
    relatedUseCases: ["friendship-messages", "birthday-messages", "thank-you-messages"],
    faqs: [
      { question: "How many photos can I add?", answer: "You can add as many photos as you want, each with its own memory text." },
      { question: "Can I add actual images?", answer: "The template uses visual polaroid cards with text on the back for memories." },
      { question: "Does it work on mobile?", answer: "Yes. Lift and tap gestures work naturally on touch screens." },
      { question: "Can I add real photos instead of text?", answer: "The template uses text-based memories on the back of each polaroid, but you can describe real photos in vivid detail through the memory text." },
      { question: "Can the recipient flip back to previous photos?", answer: "Yes. The stack allows the recipient to revisit previous photos before reaching the final message." }
    ]
  },
  {
    templateId: "memory-scenes",
    title: "Memory Lane Nostalgic Message Template",
    description: "Create a nostalgic journey through shared memories where the recipient scratches polaroid scenes to relive moments before reading a final letter.",
    intro: [
      "Memory Lane takes the recipient on a journey through your shared history. Each step reveals a polaroid-style memory scene that they scratch to reveal. As they progress through the memories, the emotional weight builds until the final letter arrives — saying what words alone could not.",
      "The scratch-to-reveal mechanic makes each memory feel like uncovering a treasure. The recipient actively participates in remembering, which makes the experience more emotional than passively reading a list.",
      "Perfect for long-term friends, couples celebrating anniversaries, siblings, or anyone with years of shared history. The journey format works well for milestone moments and reconnection messages.",
      "Customize the number of memory scenes, each memory's text and visual, the scratch mechanic, and the final heartfelt letter.",
      "What makes this template unique is the scratch-to-reveal mechanic that turns each memory into an active discovery. Instead of passively reading a list, the recipient uncovers each scene by physically scratching the surface, making the experience feel like unearthing buried treasures. The polaroid-style visuals add a nostalgic warmth that amplifies the emotional impact of each memory.",
      "To customize this template, choose the number of memory scenes and order them chronologically or emotionally. Write each memory's text to include specific details that only the two of you would know. Adjust the scratch mechanic sensitivity and write the final letter that summarizes everything. Preview the full journey to ensure the emotional buildup flows naturally."
    ],
    examples: ["Scene one: the first time we met. Scratch to remember.", "Scene two: the trip where everything went wrong and we laughed anyway.", "Each memory is a polaroid waiting to be uncovered.", "The final scene is not a memory. It is a letter from me to you."],
    relatedUseCases: ["friendship-messages", "birthday-messages", "thank-you-messages"],
    faqs: [
      { question: "How does the scratch effect work?", answer: "The recipient drags across each polaroid to scratch away a surface layer, revealing the memory beneath." },
      { question: "Can I add real photos?", answer: "The template uses visual scenes with customizable memory text." },
      { question: "Is this good for long-distance friends?", answer: "Yes. Memory Lane is designed for people who miss someone and want to share why." },
      { question: "Can I add real photos to the memory scenes?", answer: "The template uses visual polaroid-style scenes with customizable memory text, creating a nostalgic aesthetic without requiring actual images." },
      { question: "How long does the full journey take?", answer: "Depending on the number of scenes and the scratch speed, the experience typically takes 1-2 minutes for a complete journey through all memories." }
    ]
  },
  {
    templateId: "dissolve-wall",
    title: "Dissolve Wall Apology Message Template",
    description: "Create an apology message hidden behind an icy wall that melts away with the recipient's touch, revealing your words gradually like thawing frost.",
    intro: [
      "Dissolve Wall presents a frosted wall of ice covering your message. The recipient touches the screen to melt the frost, revealing your words gradually as if warmth is breaking through cold. The slower they touch, the slower the message appears — creating a patient, gentle reveal.",
      "The melting ice metaphor works beautifully for apologies and emotional repair. It suggests that coldness is temporary and warmth returns with effort. The recipient controls the pace of the reveal, making the experience feel considerate rather than pushy.",
      "Excellent for apologies where you want to show patience, love messages for someone going through a tough time, or emotional repair after a disagreement. The melting effect is visually soothing and emotionally resonant.",
      "Customize the frost density, the melting speed, the hidden message, and the final warm reveal screen.",
      "What makes this template unique is the melting ice metaphor that visually represents emotional thawing. The frosted wall covering the message requires patient touch to dissolve, making the recipient an active participant in the reveal. The slower they warm the ice, the more deliberate the experience becomes — perfectly mirroring the patience required in real-life emotional repair.",
      "To customize this template, set the frost density to control how much effort is needed to reveal the message. Write the hidden message that emerges as the ice melts, and choose the final warm reveal screen that appears once the wall is fully dissolved. Adjust the melting speed to match the tone — slower for more deliberate apologies, faster for lighter messages."
    ],
    examples: ["The wall is thick. But warmth melts it. Start touching.", "Every touch melts a little more of the frost away. Keep going.", "Under all that ice is what I should have said from the start.", "The cold melts. The truth remains. Read it when the wall is gone."],
    relatedUseCases: ["apology-messages", "confession-messages", "interactive-message-generator"],
    faqs: [
      { question: "How does the melting work?", answer: "Touch or click on the frost to generate warmth that melts the ice around your touch point." },
      { question: "Can I control the melting speed?", answer: "Yes. You can set how fast the frost melts with each touch." },
      { question: "Is this only for apologies?", answer: "It works for love messages, emotional repair, and any message about warming up to someone." },
      { question: "Can I make the message appear faster?", answer: "Yes. You can adjust the melting speed and frost density to control how quickly the message is revealed." },
      { question: "Is this template suitable for non-apology messages?", answer: "Absolutely. The melting ice metaphor works beautifully for love messages, emotional repair, forgiveness, or any message about warmth returning after coldness." }
    ]
  },
  {
    templateId: "balance-scale",
    title: "Balance Scale Love and Apology Message Template",
    description: "Create a balancing act where the recipient drags word tokens onto a scale to match the weight and unlock your hidden message.",
    intro: [
      "Balance Scale presents a classic justice scale with word-weights. The recipient sees a scale with a target weight on one side and must drag the right word tokens onto the opposite pan to achieve balance. When the scale tips to equilibrium, the message unlocks.",
      "The balance metaphor works for apologies, love confessions, and emotional truths. It suggests that the right words carry the right weight — and finding balance takes thought and care.",
      "Perfect for apology messages where you want to find the right words, love confessions that need thoughtful delivery, or emotional messages where precision matters.",
      "Customize the word tokens, the target weight, the scale appearance, and the final unlocked message. Preview to ensure the word choices create meaningful gameplay.",
      "What makes this template unique is the literal balance metaphor that turns message delivery into a physics puzzle. The recipient must find the right combination of words to achieve equilibrium, symbolizing how the right words carry the right weight in relationships. Each word token becomes a meaningful choice rather than filler, making the final unlocked message feel precisely earned.",
      "To customize this template, choose the word tokens that the recipient must balance. Include both relevant and decoy words to adjust difficulty. Write the target weight and the final message that unlocks when balance is achieved. Preview the puzzle to ensure the word choices create an engaging challenge without being frustrating."
    ],
    examples: ["The scale is tipped. Drag the right words onto the other side to balance it.", "Each word has a weight. Choose wisely to unlock the message.", "Balance is not automatic. It takes the right words in the right place.", "When the scale evens out, the truth appears."],
    relatedUseCases: ["apology-messages", "confession-messages", "friendship-messages"],
    faqs: [
      { question: "How does the scale work?", answer: "Drag word tokens onto the scale pan. When the weight matches the target, the message unlocks." },
      { question: "Can I customize the words?", answer: "Yes. Every word token and the final message are fully customizable." },
      { question: "Is this hard to solve?", answer: "The difficulty is adjustable based on how many word tokens you provide." },
      { question: "What happens if the recipient cannot find the right word combination?", answer: "Optional hints can be enabled to guide them toward the correct combination without revealing the solution." },
      { question: "Can I make the puzzle very easy?", answer: "Yes. By providing fewer word tokens and making the target weight obvious, you can create a quick and satisfying puzzle." }
    ]
  },
  {
    templateId: "deleted-drafts",
    title: "Deleted Drafts Confession Message Template",
    description: "Create a message that restores four progressively honest drafts, from funny to safe to risky to the real message that was almost never sent.",
    intro: [
      "Deleted Drafts shows the recipient four drafts of a message, each one more honest than the last. The first draft is funny and avoids the real topic. The second is safe. The third takes a risk. The fourth — the real message — is what was almost deleted forever.",
      "This template captures the feeling of typing and retyping a difficult message. Each restored draft builds context and emotional momentum, making the final reveal land with the weight of everything that was almost left unsaid.",
      "Perfect for love confessions, difficult apologies, emotional truths, and any message that took courage to write. The draft format makes the sender feel vulnerable and the recipient feel trusted.",
      "Customize each draft's text, the restoration animation, and the final message. Set the tone from funny to serious across the drafts.",
      "What makes this template unique is the draft-by-draft reveal that shows the evolution of a difficult message. Each restored draft represents a layer of emotional armor being stripped away — from the safe joke to the vulnerable truth. The recipient witnesses the sender's hesitation and courage simultaneously, making the final message feel like a privileged confession rather than a simple text.",
      "To customize this template, write four progressively honest versions of your message. Draft one should be the most surface-level or funny. Draft two adds a layer of sincerity. Draft three takes a risk. Draft four is the unfiltered truth you almost deleted. Preview the progression to ensure each draft feels like a natural step toward the final reveal."
    ],
    examples: ["Draft one: a joke. Draft two: polite. Draft three: honest. The last one is real.", "I wrote this. Deleted it. Wrote it again. Here are all the versions.", "The first three drafts are what I wanted to say. The last one is what I needed to say.", "Restore each draft. The final one is the only one that matters."],
    relatedUseCases: ["confession-messages", "apology-messages", "surprise-message-links"],
    faqs: [
      { question: "How many drafts are there?", answer: "Four drafts by default — funny, safe, risky, and real. You can customize each." },
      { question: "Can I make all drafts serious?", answer: "Yes. Choose any tone for each draft." },
      { question: "Can I add more drafts?", answer: "The template supports four drafts, but you can adjust the content of each." },
      { question: "Can I add more than four drafts?", answer: "The template is designed around four drafts for the ideal emotional progression, but you can adjust the content of each to create more granularity." },
      { question: "Can I preview all drafts before sharing?", answer: "Yes. Preview the full progression to ensure each draft builds naturally toward the final reveal." }
    ]
  },
  {
    templateId: "heartbeat-sync",
    title: "Heartbeat Sync Romantic Message Template",
    description: "Create a romantic message where the recipient must find and sync with a heartbeat rhythm before words arrive pulsing in time.",
    intro: [
      "Heartbeat Sync starts with a pulsing heartbeat on screen. The recipient must tap along to find and match the rhythm. Once synced, the message arrives word by word, each one pulsing in time with the heartbeat they matched.",
      "The rhythm-matching mechanic creates an intimate connection. The recipient is not just reading a message — they are feeling its pulse. Each word arrives with the timing of a heartbeat, making the experience feel alive.",
      "Perfect for love confessions, romantic surprises, missing someone, or any message where you want the delivery to feel as emotional as the content. The heartbeat visual is both soothing and thrilling.",
      "Customize the heartbeat speed, the words that arrive in rhythm, the visual heartbeat design, and the final message.",
      "What makes this template unique is the rhythm-matching mechanic that creates an intimate physiological connection. The recipient must sync their tapping with a pulsing heartbeat before the message arrives word by word in time with the matched rhythm. The experience literally makes the recipient feel the message's pulse, creating an emotional resonance that plain text cannot achieve.",
      "To customize this template, set the heartbeat speed to match the emotional tone — slower for calm, romantic messages, faster for exciting confessions. Write the words that pulse in with each beat, and choose the visual heartbeat design. Adjust the rhythm-matching difficulty so the sync feels achievable but rewarding. Preview to ensure the timing feels natural."
    ],
    examples: ["Find my heartbeat. Tap until you match its rhythm.", "Every beat carries a word. Sync your heart to read the full message.", "The words arrive with each pulse. Stay in rhythm to the end.", "Your heartbeat and my words. That is the whole message."],
    relatedUseCases: ["confession-messages", "surprise-message-links", "interactive-message-generator"],
    faqs: [
      { question: "How do I sync the heartbeat?", answer: "Tap in rhythm with the pulsing heart. The template guides you toward the correct tempo." },
      { question: "What if I cannot find the rhythm?", answer: "The template provides visual cues to help you match the pulse." },
      { question: "Does it work on mobile?", answer: "Yes. Tap gestures work perfectly on touch screens." },
      { question: "What if the recipient cannot match the rhythm?", answer: "Visual cues and an auto-sync fallback ensure the message eventually reveals even if the recipient struggles with the rhythm." },
      { question: "Can I use a different visual instead of a heartbeat?", answer: "The heartbeat visual is central to the metaphor, but you can customize its design and color to match your message's tone." }
    ]
  },
  {
    templateId: "morse-code",
    title: "Morse Code Secret Message Template",
    description: "Create a rhythmic code-breaking message where the recipient matches dot and dash patterns to decode each word of your secret message.",
    intro: [
      "Morse Code transforms your message into a decoding experience. The recipient watches a pattern of dots and dashes flash on screen, then taps the matching sequence to unlock each word. Word by word, the full message emerges from the code.",
      "The code-breaking mechanic creates a sense of discovery. Each decoded word feels like progress, and by the time the full message is revealed, the recipient has invested enough attention to truly absorb it.",
      "Perfect for mystery messages, love confessions with a dramatic flair, secret apologies, or any message where you want the recipient to earn the reveal through attention and care.",
      "Customize the dot-dash patterns, the message words, the visual code style, and the final decoded message.",
      "What makes this template unique is the code-breaking mechanic that turns message delivery into a cognitive challenge. Each word must be decoded by matching dot-dash patterns, making the recipient actively work for every piece of the message. The sense of accomplishment that comes with each decoded word makes the complete message feel like a treasure won through effort and attention.",
      "To customize this template, write each word of your message and assign dot-dash patterns for the recipient to match. Adjust the flash speed of the patterns to control difficulty. Choose the visual code style and the final decoded message presentation. Preview the decoding experience to ensure the patterns are clear and the progression feels satisfying."
    ],
    examples: ["Dot dot dash. That spells the first word of what I need to tell you.", "Watch the pattern. Tap it back. Decode the message one word at a time.", "Some things are easier to say in code. Decode this.", "Each decoded word brings you closer to the truth."],
    relatedUseCases: ["confession-messages", "surprise-message-links"],
    faqs: [
      { question: "Do I need to know Morse code?", answer: "No. The pattern is shown visually and you tap to match what you see." },
      { question: "Can I customize the codes?", answer: "Yes. You set the dot-dash patterns for each word." },
      { question: "Is this good for romantic messages?", answer: "Yes. The decoding process adds romantic tension to the reveal." },
      { question: "Can the recipient skip the decoding?", answer: "The decoding is the core mechanic, but the patterns are designed to be simple enough that each word can be decoded in seconds." },
      { question: "Can I use this for long messages?", answer: "Yes. Each word is decoded individually, so longer messages work well by breaking them into manageable single-word decodes." }
    ]
  },
  {
    templateId: "gravity-flip",
    title: "Gravity Flip Funny Message Template",
    description: "Create a funny message where words float in zero gravity — each flip of gravity pulls them back down to form your full message.",
    intro: [
      "Gravity Flip scatters your message in zero gravity. Words float across the screen in random directions. The recipient taps to flip gravity, pulling all the words back down to earth where they assemble into the full message.",
      "The physics-based mechanic is playful and satisfying. Each gravity flip sends words floating in a new direction, and watching them settle into place creates a small moment of satisfaction.",
      "Great for funny messages, playful roasts, friendship notes, or lighthearted love confessions. The zero-gravity theme makes even serious messages feel playful.",
      "Customize the floating words, the gravity direction controls, the assembly animation, and the final message layout.",
      "What makes this template unique is the physics-based zero-gravity mechanic that turns message assembly into a playful experiment. Words float chaotically across the screen, and each gravity flip pulls them in a new direction until they settle into place. Watching random motion transform into a coherent message creates a satisfying moment of order emerging from chaos.",
      "To customize this template, choose the floating words and their initial positions. Set the number of gravity flips required to assemble the full message. Adjust the gravity strength and direction controls. Preview the zero-gravity experience to ensure the words settle into a readable layout after the final flip."
    ],
    examples: ["My words are floating away. Help me bring them back down.", "Flip gravity. Watch the words fall into place.", "The message is scattered across space. Each flip brings it closer to earth.", "Zero gravity is fun until you need to read something important."],
    relatedUseCases: ["funny-roast-messages", "friendship-messages", "surprise-message-links"],
    faqs: [
      { question: "How many gravity flips are there?", answer: "You can customize how many flips it takes to assemble the full message." },
      { question: "Can I control which words float where?", answer: "Yes. You set the word positions and the gravity behavior." },
      { question: "Does it work well on mobile?", answer: "Yes. Tapping to flip gravity works naturally with touch." },
      { question: "Can the recipient get stuck with words in unreachable positions?", answer: "The gravity flip mechanic always pulls words toward a readable layout, so they always assemble into the message eventually." },
      { question: "Can I use this for serious messages?", answer: "The zero-gravity theme makes even serious messages feel playful, so it is best suited for lighthearted content." }
    ]
  },
  {
    templateId: "echo-chamber",
    title: "Echo Chamber Interactive Word Message Template",
    description: "Create an echo-style message where each word must be typed back by the recipient before the next word appears, building the full message word by word.",
    intro: [
      "Echo Chamber shows one word at a time. The recipient must type that word back before the next word appears. Each echoed word triggers an animation, and the message builds one word at a time until the full sentence is revealed.",
      "The typing mechanic forces the recipient to engage with every single word. They cannot skim or skip — each word must be acknowledged and repeated. This makes the message impossible to ignore and ensures every word lands.",
      "Perfect for funny messages, romantic confessions where you want every word to count, apology messages where attention matters, or any message where you need the recipient to slow down and really read.",
      "Customize each word in the sequence, the typing prompt style, the echo animation, and the final complete message.",
      "What makes this template unique is the typing mechanic that forces complete attention to every single word. The recipient cannot skim or skip — each word must be echoed back before the next appears, creating a meditative, word-by-word reading experience. This ensures the message is fully absorbed rather than quickly scanned, making it ideal for messages where every word carries weight.",
      "To customize this template, write each word of your message in sequence. Set the typing prompt style and the echo animation for each word. Choose whether to allow typos or require exact matches. Preview the echoing experience to ensure the pacing feels natural and the full message builds with satisfying momentum."
    ],
    examples: ["Type each word back to me. Start with the first one.", "Echo this: every word you type builds the message I need to send.", "Word by word. Type what you see. The full picture appears at the end.", "You cannot skip ahead. Every word matters here."],
    relatedUseCases: ["funny-roast-messages", "friendship-messages", "interactive-message-generator"],
    faqs: [
      { question: "What happens if I type the wrong word?", answer: "The template prompts you to try again until the correct word is entered." },
      { question: "Can I customize each echoed word?", answer: "Yes. Every word in the sequence is fully customizable." },
      { question: "Is this good for serious messages?", answer: "Yes. The word-by-word focus works well for emotional or important messages." },
      { question: "Is case-sensitive typing required?", answer: "You can choose whether the typing requires exact case matching or accepts case-insensitive input." },
      { question: "Can the recipient see all previously typed words?", answer: "Yes. Previously echoed words remain visible, building the complete message as new words are added." }
    ]
  },
  {
    templateId: "lock-pick",
    title: "Lock Pick Mystery Message Template",
    description: "Create a tension-based lockpicking game where the recipient finds hidden sweet spots across three locks to unlock a chest holding your message.",
    intro: [
      "Lock Pick challenges the recipient to pick three locks, each hiding behind a tension-based sweet spot. They drag a pick tool until they feel the right resistance, then twist. Each opened lock brings them closer to the chest that holds the real message.",
      "The lockpicking mechanic is tactile and satisfying. Each lock has a unique sweet spot, and finding it requires patience and attention. The three-lock progression builds anticipation toward the final chest opening.",
      "Great for mystery messages, playful dares, love confessions with dramatic flair, or funny messages where you want the recipient to earn the punchline.",
      "Customize the number of locks, the difficulty of each sweet spot, the chest appearance, and the final revealed message.",
      "What makes this template unique is the tactile lockpicking mechanic that requires patience and precision. Each lock has a hidden sweet spot that the recipient must find by feeling for resistance, creating a genuinely engaging puzzle. The three-lock progression builds anticipation toward the final chest opening, making the revealed message feel like a hard-won treasure.",
      "To customize this template, set the number of locks and adjust each lock's sweet spot width for difficulty control. Choose the chest appearance and the final message inside. Adjust the pick tool sensitivity for a satisfying tactile feel. Preview the lockpicking sequence to ensure each lock provides the right level of challenge before sharing."
    ],
    examples: ["Three locks guard the message. Find the sweet spot in each one.", "Lock one: easy. Lock two: trickier. Lock three: the real test.", "The pick knows where to go. You just need to feel for it.", "Every lock you pick is one step closer to what I hid in the chest."],
    relatedUseCases: ["surprise-message-links", "confession-messages", "funny-roast-messages"],
    faqs: [
      { question: "How does the lockpicking work?", answer: "Drag the pick tool across the lock mechanism until you feel resistance, then twist to open." },
      { question: "Can I adjust the difficulty?", answer: "Yes. Each lock's sweet spot width and sensitivity are adjustable." },
      { question: "How long does it take to pick all locks?", answer: "About 45 seconds depending on difficulty settings." },
      { question: "Can I add more than three locks?", answer: "The template supports multiple locks, and you can adjust the number to control the overall experience length." },
      { question: "What happens if the recipient cannot find a sweet spot?", answer: "Visual feedback guides the pick toward the sweet spot, and the difficulty is adjustable during setup." }
    ]
  },
  {
    templateId: "secret-letter",
    title: "Snow Globe Secret Message Template",
    description: "Create a message hidden inside a snow globe that the recipient shakes to swirl the snow, then waits for it to settle and reveal words etched in glass.",
    intro: [
      "Snow Globe presents a beautiful glass globe filled with floating snow. The recipient shakes it, watches the snow swirl and dance, then waits as it slowly settles. When the snow clears, your message is revealed etched into the glass as if it has always been waiting there.",
      "The shake-and-settle mechanic creates a calm, anticipatory moment. The swirling snow is visually mesmerizing, and the slow reveal as it clears gives the recipient time to wonder what the message will say.",
      "Perfect for love confessions, mystery messages, nostalgic notes, or any message that benefits from a soft, beautiful reveal. The snow globe aesthetic works year-round and pairs well with romantic or emotional content.",
      "Customize the snow globe design, the snowfall density, the settling speed, and the etched message text.",
      "What makes this template unique is the shake-and-settle mechanic that creates a calm, meditative reveal. The swirling snow and slow clearing effect give the recipient time to wonder and anticipate before the message emerges etched in glass. The snow globe aesthetic transforms a simple message into a beautiful, contained moment — like a memory preserved in glass.",
      "To customize this template, choose the snow globe design and snowfall density. Write the message that appears etched in the glass after the snow settles. Adjust the settling speed to control how long the anticipation lasts. Preview the shake-and-settle experience to ensure the reveal timing feels magical before sharing."
    ],
    examples: ["Shake the globe. Watch the snow dance. Wait for it to settle.", "The message has always been inside. The snow was just hiding it.", "Every flake of snow is a thought I could not say directly.", "When the snow settles, the truth is visible in the glass."],
    relatedUseCases: ["confession-messages", "surprise-message-links", "interactive-message-generator"],
    faqs: [
      { question: "How do I shake the snow globe?", answer: "Tap, click, or physically shake your device to agitate the snow inside." },
      { question: "Can I customize the message?", answer: "Yes. The full message that appears in the glass is customizable." },
      { question: "Does it work without a gyroscope?", answer: "Yes. Tap or click substitutes for physical shaking on devices without motion sensors." },
      { question: "Can I customize the snow globe appearance?", answer: "Yes. The snow globe design, glass color, and snowflake shape are all customizable." },
      { question: "What if the recipient shakes too vigorously?", answer: "The snow always settles given enough time, ensuring the message is always eventually revealed regardless of how aggressively it is shaken." }
    ]
  },
  {
    templateId: "secret-letter-scenes",
    title: "Secret Letter Wax Seal Message Template",
    description: "Create a message hidden inside a sealed letter with three wax seals that must be broken one by one to reveal the words inside.",
    intro: [
      "Secret Letter presents a vintage sealed letter with three wax seals. Each seal must be broken by tapping or clicking, releasing a piece of the message hidden inside. The third seal reveals the final, most important part of the letter.",
      "The three-seal structure creates a natural narrative arc. Seal one holds context. Seal two deepens the emotion. Seal three delivers the core message. The recipient experiences the letter the way you would open a real sealed envelope — with care and anticipation.",
      "Perfect for love confessions, emotional apologies, friendship appreciation, or any message that benefits from a ceremonial, old-world feel.",
      "Customize the letter appearance, each seal's reveal text, the wax seal colors, and the final message.",
      "What makes this template unique is the three-seal structure that creates a ceremonial, old-world feel. Each seal break releases a portion of the message, building a natural narrative arc where context leads to emotion and emotion leads to the core truth. The vintage letter aesthetic makes the recipient feel like they are opening something precious and deliberate.",
      "To customize this template, write three layers of your message — one per seal. The first seal should set context, the second should deepen the emotion, and the third should deliver the core message. Choose the wax seal colors and the letter appearance. Preview the seal-breaking sequence to ensure the pacing builds toward a satisfying final reveal."
    ],
    examples: ["Break the first seal. A confession begins to form.", "The second seal holds more than you expect. Keep going.", "The third seal is the one I almost kept sealed forever.", "Three seals. One letter. Everything I needed to put in writing."],
    relatedUseCases: ["confession-messages", "apology-messages", "surprise-message-links"],
    faqs: [
      { question: "How do I break the seals?", answer: "Tap each wax seal to crack it open and reveal the text beneath." },
      { question: "Can I customize the seal colors?", answer: "Yes. Each wax seal color is customizable." },
      { question: "Is this good for proposals?", answer: "Yes. The ceremonial letter format works beautifully for proposal messages." },
      { question: "Can I add more than three seals?", answer: "The template uses three seals for the classic narrative arc, but each seal can hold layered content." },
      { question: "Can the recipient re-read messages from earlier seals?", answer: "Yes. After all seals are broken, the recipient can review the full letter including all previously revealed sections." }
    ]
  },
  {
    templateId: "surprise-room",
    title: "Scratch Card Surprise Message Template",
    description: "Create a lottery-style scratch card message where the recipient drags to scratch off a silver coating and uncover the hidden message underneath.",
    intro: [
      "Scratch Card transforms your message into a digital lottery ticket. A metallic silver coating covers your words. The recipient drags their finger across the surface to scratch it off, stroke by stroke, until the full message is revealed underneath.",
      "The scratch-off mechanic is instantly familiar and satisfying. Everyone knows how a lottery ticket works, and uncovering a personal message beneath the silver layer creates a small moment of thrill.",
      "Perfect for love confessions, birthday surprises, friendship messages, or any playful reveal. The metallic scratch layer adds a tactile quality to a digital experience.",
      "Customize the scratch layer color and texture, the message underneath, the confetti or reaction on completion, and the final screen.",
      "What makes this template unique is the lottery-ticket familiarity that makes the reveal instantly intuitive and exciting. Everyone knows how to scratch a ticket, and the metallic silver coating creates a tactile anticipation as it wears away stroke by stroke. The reveal feels like winning a prize, which makes the hidden message feel more valuable than if it were simply displayed.",
      "To customize this template, choose the scratch layer color and finish — silver, gold, or custom metallic shades. Write the message hidden beneath the coating. Add confetti or celebratory effects for when the scratch is complete. Preview the scratching experience to ensure the coating wears away at a satisfying pace."
    ],
    examples: ["Scratch off the silver. Your message is waiting underneath.", "Every stroke of the scratch reveals a little more of what I wanted to say.", "It looks like a lottery ticket. The prize is my message.", "Keep scratching. The best part is still hidden."],
    relatedUseCases: ["surprise-message-links", "confession-messages", "birthday-messages"],
    faqs: [
      { question: "How long does it take to scratch off?", answer: "About 10-15 seconds of continuous scratching to fully reveal the message." },
      { question: "Can I change the scratch color?", answer: "Yes. The scratch layer color and finish are customizable." },
      { question: "Does it work on mobile?", answer: "Yes. Drag-to-scratch works naturally with touch input." },
      { question: "Can the recipient scratch too slowly?", answer: "There is no time limit, so they can scratch at their own pace and savor the reveal." },
      { question: "Is this template suitable for professional or formal messages?", answer: "The lottery-ticket format is best suited for playful, celebratory, or romantic messages rather than formal communication." }
    ]
  },
  {
    templateId: "scratch-card",
    title: "Scratch Card Metallic Message Template",
    description: "Create a metallic scratch card that hides your message beneath a reflective surface — the recipient scratches to reveal what you wrote underneath.",
    intro: [
      "Scratch Card uses a reflective metallic layer to hide your message. The recipient scratches the surface with their finger, and as the metallic coating wears away, your words emerge from beneath. The reflective sheen catches light as they scratch, adding visual feedback to the reveal.",
      "The metallic scratch effect creates a premium, tactile feel. Unlike the lottery-style scratch card, this version emphasizes the reflective quality of the coating, making the reveal feel like uncovering a polished surface.",
      "Great for love messages, birthday notes, friendship surprises, or any message where presentation matters. The metallic sheen works especially well with romantic and celebratory themes.",
      "Customize the metallic color, the scratch resistance, the hidden message, and the final reveal animation.",
      "What makes this template unique is its emphasis on reflective metallic sheen that makes the scratch experience feel premium and luxurious. Unlike the lottery-style scratch card, this version focuses on the visual beauty of the metallic surface, and the words emerging from beneath the reflective coating create a polished, sophisticated reveal.",
      "To customize this template, select the metallic color — silver, gold, rose gold, or custom. Adjust the scratch resistance to control how many strokes are needed to fully reveal the message. Write the hidden message and choose the final reveal animation. Preview the effect to ensure the metallic sheen looks polished before sharing."
    ],
    examples: ["A metallic surface hides what I wrote. Scratch it open.", "The reflection hides my words. Scratch until you can read them clearly.", "Under all that shine is the message I actually wanted to send.", "Scratch the surface. The truth is more valuable than silver."],
    relatedUseCases: ["surprise-message-links", "confession-messages", "friendship-messages"],
    faqs: [
      { question: "What makes this different from the other Scratch Card?", answer: "This version emphasizes the reflective metallic coating for a premium visual feel." },
      { question: "Can I customize the metallic color?", answer: "Yes. Choose from silver, gold, rose gold, or custom metallic colors." },
      { question: "How long does the scratch effect take?", answer: "About 15-20 seconds of continuous scratching to fully reveal the message." },
      { question: "What metallic colors are available?", answer: "You can choose from silver, gold, rose gold, bronze, and custom metallic shades to match your message's tone." },
      { question: "Can I combine this with other effects?", answer: "Yes. You can add confetti, sparkle effects, or a final animation after the message is fully revealed." }
    ]
  },
  {
    templateId: "tilt-maze",
    title: "Tilt Maze Love Message Template",
    description: "Create a maze-based message where the recipient tilts their device to guide a ball through tunnels and reach the hidden message at the exit.",
    intro: [
      "Tilt Maze uses the device's gyroscope to create a physical challenge. The recipient tilts their phone to roll a ball through a maze of tunnels toward the exit where your message waits. Each wrong turn adds a moment of suspense, and reaching the exit feels like an accomplishment.",
      "The physical tilting mechanic makes this template uniquely engaging. Unlike tap-based interactions, the recipient moves their whole device, creating a more immersive experience.",
      "Perfect for love messages where you want a playful challenge, mystery reveals, or any message where the journey to the words matters as much as the destination.",
      "Customize the maze layout, the ball appearance, the tunnel colors, the difficulty level, and the final message at the exit.",
      "What makes this template unique is the gyroscope-based control that transforms message reading into a physical activity. The recipient literally tilts their device to navigate a ball through tunnels, creating an immersive experience that engages the body as well as the mind. The physical effort required to reach the message makes the destination feel genuinely earned.",
      "To customize this template, design the maze layout and difficulty level. Choose the ball appearance and tunnel colors. Write the message that appears at the exit. Set the gyroscope sensitivity to match the desired challenge. Preview the maze to ensure the path is navigable and the experience feels rewarding. Desktop fallback controls are also available."
    ],
    examples: ["Guide the ball through the maze. Your message waits at the exit.", "Every twist and turn brings you closer to what I need to say.", "Tilt carefully. The maze is designed to make you work for it.", "The ball finds its way. So will you. The message is worth the journey."],
    relatedUseCases: ["surprise-message-links", "confession-messages", "interactive-message-generator"],
    faqs: [
      { question: "Do I need to tilt my device?", answer: "Yes. The maze uses the gyroscope for control, though on-screen buttons are available as a fallback." },
      { question: "Is the maze difficult?", answer: "The difficulty is adjustable. By default it is designed to be solvable in under a minute." },
      { question: "Does it work on desktop?", answer: "Yes. Keyboard arrow keys or mouse drag are available as alternative controls." },
      { question: "What if my device does not have a gyroscope?", answer: "On-screen buttons and keyboard arrow keys are available as fallback controls for devices without motion sensors." },
      { question: "Can I create multiple maze levels?", answer: "The template uses a single maze, but you can customize its complexity to create a longer or shorter experience." }
    ]
  },
  {
    templateId: "inkblot",
    title: "Photo Booth Mystery Message Template",
    description: "Create a photo booth-style message with four flashes and a countdown — each capture reveals one line until the full strip prints your message.",
    intro: [
      "Photo Booth recreates the experience of a vintage photo booth. A countdown starts, a flash goes off, and the first line of your message appears as if captured on film. Three more flashes follow, each one revealing the next line, until a four-panel strip prints with the complete message.",
      "The flash-and-capture mechanic creates a nostalgic, theatrical feeling. Each flash is a small surprise, and the final strip feels like a physical keepsake even though it is digital.",
      "Perfect for mystery messages, love confessions, birthday wishes, or any message where you want a dramatic, memorable reveal. The photo strip format makes the final message feel permanent and treasured.",
      "Customize the countdown duration, the flash effect intensity, each captured line of text, the strip design, and the final printed message.",
      "What makes this template unique is the vintage photo booth format that turns a message into a theatrical performance. Each flash captures one line of text as if it were a photograph, building anticipation with every countdown. The final four-panel strip feels like a physical keepsake, making the message feel permanent and treasured even in digital form.",
      "To customize this template, write four lines of your message — one per flash. Set the countdown duration and flash intensity to control the dramatic pacing. Choose the strip design and colors. Preview the full photo booth experience to ensure each flash lands with the right emotional weight before sharing."
    ],
    examples: ["Flash one: the first thing I noticed about you.", "Flash two: the moment I knew this was different.", "Flash three: what I should have said weeks ago.", "Flash four: the full truth, captured and printed."],
    relatedUseCases: ["confession-messages", "surprise-message-links", "friendship-messages"],
    faqs: [
      { question: "How does the photo booth work?", answer: "A countdown leads to a flash effect, and each flash reveals one line of your message on a film strip." },
      { question: "Can I skip the countdown?", answer: "The countdown is part of the experience, but its duration is customizable." },
      { question: "How many lines can I add?", answer: "Four lines by default — one per flash — matching the classic photo booth strip format." },
      { question: "Can I change the flash count from four?", answer: "The template uses four flashes to match the classic photo booth strip format, but you can adjust the content of each frame." },
      { question: "Does the photo strip look good on mobile?", answer: "Yes. The strip is designed to display beautifully on any screen size, with each panel clearly readable." }
    ]
  },
  {
    templateId: "spin-to-reveal",
    title: "Party Popper Celebration Message Template",
    description: "Create a festive message where the recipient pulls a string to trigger confetti and a banner that unfurls with your celebration message.",
    intro: [
      "Party Popper captures the feeling of a celebration in one gesture. The recipient sees a party popper with a string. They pull it, confetti explodes across the screen, and a colorful banner unfurls with your celebration message written across it.",
      "The single-action reveal is instant and satisfying. The confetti burst creates visual excitement, and the banner format makes the message feel official and celebratory.",
      "Perfect for birthday wishes, achievement congratulations, anniversary celebrations, good news announcements, or any moment worth celebrating. The festive visuals work for any happy occasion.",
      "Customize the party popper appearance, the confetti colors and density, the banner design, and the celebration message text.",
      "What makes this template unique is the single-action celebration mechanic that delivers instant joy. One pull triggers confetti, a banner unfurls, and the message appears — all in one satisfying gesture. The party popper format captures the essence of celebration in a way that feels immediate and exciting, making even small achievements feel worthy of confetti.",
      "To customize this template, choose the party popper design and the confetti colors and density. Write the celebration message that appears on the unfurling banner. Add optional sound effects for extra festivity. Preview the popper-pulling experience to ensure the confetti burst feels celebratory before sharing."
    ],
    examples: ["Pull the string. Confetti explodes. Your celebration starts here.", "Happy everything. Pull the popper and read what I prepared.", "This is your moment. Pull the string and claim it.", "Confetti, banner, message. Three things that mean I am celebrating you."],
    relatedUseCases: ["birthday-messages", "surprise-message-links", "friendship-messages"],
    faqs: [
      { question: "How does the party popper work?", answer: "Tap or click the string to pull it. Confetti bursts out and a banner unfurls." },
      { question: "Can I customize the confetti colors?", answer: "Yes. Confetti color palette and density are fully customizable." },
      { question: "Is there sound?", answer: "Sound effects are optional and can be enabled or disabled." },
      { question: "Can I use this for serious messages?", answer: "The party popper format is inherently celebratory, so it works best for happy occasions rather than serious or emotional messages." },
      { question: "Can I customize the banner font and style?", answer: "Yes. The banner design, font, and colors are all customizable to match the celebration theme." }
    ]
  },
  {
    templateId: "the-closer-you-get",
    title: "Message in the Sand Ephemeral Message Template",
    description: "Create a fleeting beach message where the recipient traces your words in the sand with their finger before the tide comes back and washes them away.",
    intro: [
      "Message in the Sand places your words on a virtual beach at low tide. The recipient must trace the message in the sand with their finger before the tide returns and erases it. The countdown creates urgency, and the act of tracing makes the message feel physical and temporary.",
      "The ephemeral nature of the message adds emotional weight. Like real words written in sand, they are only visible for a moment — which makes the act of reading them feel more precious.",
      "Perfect for messages about fleeting moments, missing someone, temporary goodbyes, or any sentiment where impermanence is part of the meaning.",
      "Customize the beach scene, the message text, the tide timer, the wave animation, and the final message that remains after the tide.",
      "What makes this template unique is the ephemeral beach metaphor that gives the message emotional weight through impermanence. The recipient must trace words in the sand before the tide washes them away, creating urgency and preciousness. The physical act of tracing letters with a finger makes the message feel tangible and fleeting — like a moment that cannot be held but can be felt.",
      "To customize this template, write the message that appears in the sand and set the tide timer to control how long it remains visible. Choose the beach scene and wave animation style. You can also disable the tide mechanic if you prefer a permanent reveal. Preview the full experience to ensure the timing feels right before sharing."
    ],
    examples: ["The words are in the sand. Trace them before the tide comes.", "Some messages are meant to be temporary. This is one of them.", "The tide is coming. Read it before it washes away.", "Trace every letter. The waves will take the rest."],
    relatedUseCases: ["confession-messages", "apology-messages", "surprise-message-links"],
    faqs: [
      { question: "How long do I have to read the message?", answer: "The tide timer is customizable, but defaults to about 15 seconds." },
      { question: "Can I make the message permanent?", answer: "Yes. You can disable the tide mechanic if you prefer a lasting reveal." },
      { question: "Does it work on mobile?", answer: "Yes. Finger tracing works naturally on touch screens." },
      { question: "Can I extend the time before the tide comes in?", answer: "Yes. The tide timer is fully customizable so you can give the recipient more or less time to read the message." },
      { question: "What if the recipient does not finish tracing in time?", answer: "The message can be re-triggered, so they can try again if the tide washes it away before they finish reading." }
    ]
  },
  {
    templateId: "two-lies-one-truth",
    title: "Fortune Cookie Truth Message Template",
    description: "Create a fun three-cookie message where the first two hold joke fortunes and the third cookie cracks open to reveal the real truth.",
    intro: [
      "Fortune Cookie presents three cookies. The recipient cracks the first — a joke fortune that makes them laugh. The second — a teasing fortune that keeps the game going. The third — the real message, hidden inside like a genuine fortune.",
      "The three-cookie structure sets up a playful expectation. By the time they reach the third cookie, they expect another joke — which makes the sincere message hit with surprise and impact.",
      "Great for funny messages with a sincere twist, love confessions disguised as jokes, friendship notes that start with teasing and end with appreciation.",
      "Customize each fortune's text, the cracking animation, the cookie appearance, and the final real message.",
      "What makes this template unique is the three-cookie structure that sets up a playful misdirection before the sincere reveal. The first two cookies deliver jokes that lower the recipient's guard, making the third cookie's genuine message hit with surprise and emotional impact. The fortune cookie format turns a simple message into a game of expectation and truth.",
      "To customize this template, write two playful fortunes for the first two cookies and the real message for the third. Choose the cracking animation style and cookie appearance. Adjust the pacing between cookies to control the comedic timing. Preview the three-cookie experience to ensure the shift from funny to sincere feels natural."
    ],
    examples: ["Cookie one: you will get a funny text today. (That was the funny text.)", "Cookie two: someone is thinking about you. (Still me.)", "Cookie three: the truth I hid between two jokes.", "Crack all three. The last one is the only one I actually wrote for you."],
    relatedUseCases: ["funny-roast-messages", "friendship-messages", "confession-messages"],
    faqs: [
      { question: "Can all three fortunes be serious?", answer: "Yes. You can set any tone for each of the three fortunes." },
      { question: "How do I crack a cookie?", answer: "Tap each cookie to crack it open and read the fortune inside." },
      { question: "Can I add more than three cookies?", answer: "The template is designed around three for the two-lies-one-truth structure." },
      { question: "Can I make all three cookies sincere?", answer: "Yes. You can choose any tone for each fortune, including making all three genuine messages." },
      { question: "Can the recipient re-crack a cookie?", answer: "Yes. Each cookie can be re-cracked to re-read its fortune at any time during the experience." }
    ]
  },
  {
    templateId: "type-or-else",
    title: "Domino Chain Suspense Message Template",
    description: "Create a suspenseful domino chain where the recipient taps the first domino and watches the chain reaction reveal your message word by word.",
    intro: [
      "Domino Chain starts with a single domino. The recipient taps it, and a chain reaction cascades across the screen, each falling domino revealing the next word of the message until the full sentence has toppled into place.",
      "The chain reaction is visually satisfying. Each domino falls with perfect timing, creating a rhythm that carries the recipient from start to finish. The inevitability of the cascade mirrors the feeling of a truth that cannot be stopped once it starts.",
      "Perfect for love confessions, emotional messages, mystery reveals, or any message where you want the delivery to feel inevitable and unstoppable.",
      "Customize the domino arrangement, the number of dominoes, the word on each domino, the cascade speed, and the final standing message.",
      "What makes this template unique is the domino chain reaction that visually represents an unstoppable truth. Once the recipient taps the first domino, the cascade cannot be stopped — each falling domino reveals one more word until the full message has toppled into place. The inevitability of the cascade mirrors the feeling of a truth that must eventually be spoken.",
      "To customize this template, arrange the dominoes in order with one word on each. Set the cascade speed to control the rhythm of the reveal — faster for excitement, slower for suspense. Choose the domino colors and the final standing message. Preview the chain reaction to ensure each domino falls with satisfying timing."
    ],
    examples: ["Tap the first domino. Watch the truth fall into place.", "Each domino carries one word. The cascade carries the message.", "Once it starts, it cannot stop. Just like this message.", "The first domino was the hardest to place. The rest fell naturally."],
    relatedUseCases: ["confession-messages", "surprise-message-links", "interactive-message-generator"],
    faqs: [
      { question: "How many dominoes are there?", answer: "The number is customizable, typically 6-12 dominoes for a satisfying cascade." },
      { question: "Can I control the falling speed?", answer: "Yes. The cascade timing is adjustable." },
      { question: "Can I restart the chain?", answer: "Yes. The recipient can replay the domino fall animation." },
      { question: "What happens if the recipient misses a word?", answer: "The cascade continues regardless — each domino falls automatically, so the full message always reveals." },
      { question: "Can the recipient pause the cascade?", answer: "The cascade is designed to play through automatically once triggered, but the animation speed is adjustable during customization." }
    ]
  },
  {
    templateId: "the-trust-scale",
    title: "Paper Airplane Lighthearted Message Template",
    description: "Create a playful message where the recipient folds a paper airplane, flings it across the screen, and wherever it lands, the message unfolds.",
    intro: [
      "Paper Airplane turns a message into a simple game of aim and release. The recipient folds a virtual paper airplane, aims it, and flings it across the screen. Wherever it lands, it unfolds to reveal your message in that spot.",
      "The random landing element adds a lighthearted surprise. The message could land anywhere, and the unfolding animation always feels satisfying regardless of where it stops.",
      "Great for lighthearted love messages, playful apologies, friendship notes, or any message where you want the delivery to feel casual and fun.",
      "Customize the airplane design, the fling physics, the landing animation, and the message that unfolds.",
      "What makes this template unique is the physics-based flight mechanic that adds an element of playful randomness to the reveal. The recipient folds, aims, and flings a paper airplane, and wherever it lands, the message unfolds. The uncertainty of the landing spot makes the experience feel casual and spontaneous, perfect for lighthearted messages that should not feel too heavy.",
      "To customize this template, adjust the airplane design and the fling physics to control how far and fast it travels. Write the message that unfolds at the landing spot. Choose the folding animation style to match the playful tone. Preview the flight to ensure the physics feel natural and the landing animation is satisfying."
    ],
    examples: ["Fold the paper. Aim it. Fling it. The message unfolds where it lands.", "I put my words in a paper airplane. Wherever it lands, read it.", "Some messages travel better through the air. Fling this one.", "The landing spot is random. The message is not."],
    relatedUseCases: ["surprise-message-links", "friendship-messages", "confession-messages"],
    faqs: [
      { question: "How does the airplane fly?", answer: "Drag to aim and release to fling. The airplane follows a physics-based arc." },
      { question: "Can I control where it lands?", answer: "The landing is physics-based, adding a fun random element to the reveal." },
      { question: "Does it work on mobile?", answer: "Yes. Drag-and-release gestures work naturally on touch screens." },
      { question: "Can I make the airplane land in a specific spot?", answer: "The landing is physics-based and intentionally random to add fun, but you can adjust the physics to influence the typical landing zone." },
      { question: "Does the airplane fold animation play on mobile?", answer: "Yes. The folding animation is optimized for touch screens and plays smoothly on mobile devices." }
    ]
  },
  {
    templateId: "surprise-room-scenes",
    title: "Surprise Room Gift Box Message Template",
    description: "Create a mystery room with four gift boxes where the recipient picks one to open and discovers your surprise message inside.",
    intro: [
      "Surprise Room drops the recipient into a private room with four beautifully wrapped gift boxes. They must pick one, drag to open it, and discover the surprise message inside. Each box could hold something different, but the choice determines what they see first.",
      "The choose-your-own-gift mechanic creates a moment of decision. The recipient feels ownership over the reveal because they chose which box to open. The other boxes are still there, creating optional depth if they want to explore further.",
      "Perfect for birthday surprises, love confessions, mystery messages, or any occasion where you want to give the recipient a sense of discovery and choice.",
      "Customize the number of boxes, each box's appearance, what each box reveals, and the final surprise message.",
      "What makes this template unique is the choose-your-own-gift mechanic that gives the recipient agency over the reveal. By choosing which gift box to open, they become active participants rather than passive readers. The element of choice creates a sense of ownership over the experience, and the other unopened boxes add optional depth for further exploration.",
      "To customize this template, decide how many gift boxes appear and what each one reveals. You can put different messages in different boxes or make one box hold the real message while the others contain decoys or jokes. Choose each box's wrapping design and the opening animation. Preview the room to ensure the visual presentation feels exciting before sharing."
    ],
    examples: ["Four boxes. One holds the message I meant for you. Choose wisely.", "Each box has a different surprise. Only one has the real message.", "Pick a box. Drag it open. See what I prepared for you.", "The room is yours. The boxes are waiting. One of them has my words."],
    relatedUseCases: ["birthday-messages", "surprise-message-links", "confession-messages"],
    faqs: [
      { question: "Can I put different messages in each box?", answer: "Yes. Each box can have unique text for the recipient to discover." },
      { question: "How many boxes can I add?", answer: "The template supports up to four boxes by default, customizable." },
      { question: "Is this good for birthdays?", answer: "Yes. The gift box theme pairs naturally with birthday surprises." },
      { question: "Can the recipient open all boxes?", answer: "Yes. After opening the first box, they can choose to open the remaining boxes to discover additional messages." },
      { question: "Can I make one box empty as a prank?", answer: "Yes. You can assign different content to each box, including playful empty boxes with an 'oops, try another' message." }
    ]
  },
  {
    templateId: "dont-smile-scenes",
    title: "Don't You Smile Challenge Message Template",
    description: "Create a smile challenge where the recipient smashes emojis through increasingly tough rounds without breaking their poker face.",
    intro: [
      "Don't You Smile challenges the recipient to keep a straight face while playing an emoji-smashing game. Emojis appear on screen with increasingly funny expressions, and the recipient must smash them before the timer runs out. If they smile, they lose — but the message still unlocks at the end.",
      "The challenge creates a playful competitive moment. Even though the game is rigged so the message always reveals, the recipient will still try to keep a straight face, making the experience fun for both sender and receiver.",
      "Perfect for friendship messages, funny roasts, playful dares, or lighthearted birthday wishes. The challenge format works well for best friends who enjoy teasing each other.",
      "Customize the emoji types, the round difficulty progression, the timer settings, and the final message that appears after the challenge.",
      "What makes this template unique is the smashing challenge that combines gameplay with message delivery. The recipient must smash emojis with increasingly funny expressions while trying to keep a straight face. Even though the message always reveals regardless of whether they smile, the challenge creates a playful competitive moment that makes the final message feel like a reward.",
      "To customize this template, choose the emoji types and expressions for each round. Set the round progression difficulty and the timer for each round. Write the message that appears after the challenge. Preview the smashing gameplay to ensure the difficulty curve feels fun and the emoji choices are entertaining."
    ],
    examples: ["Smash the emojis. Do not smile. The message appears either way.", "Round one: easy. Round two: tricky. Round three: try not to laugh.", "I dare you to finish this without smiling. The message is your reward.", "Even if you crack a smile, the message is still waiting at the end."],
    relatedUseCases: ["funny-roast-messages", "friendship-messages", "surprise-message-links"],
    faqs: [
      { question: "What happens if I smile?", answer: "Nothing bad — the message still reveals. The challenge is for fun." },
      { question: "Can I add custom emojis?", answer: "Yes. The emoji selection for each round is customizable." },
      { question: "How many rounds are there?", answer: "Three rounds by default, each progressively harder." },
      { question: "Can I add my own emoji images?", answer: "Yes. The emoji selection is customizable, so you can add custom images or inside-joke visuals." },
      { question: "What happens if the timer runs out?", answer: "The message still reveals, but with a playful 'you lost, but here is your prize anyway' animation." }
    ]
  },
  {
    templateId: "roast-scenes",
    title: "Roast to Respect Flip Coin Template",
    description: "Create a three-round roast game where the recipient flips coins to advance through mild, medium, and spicy roasts before reaching a sincere final truth.",
    intro: [
      "Roast to Respect uses a coin-flip mechanic to progress through escalating roast levels. Each round presents a funnier or more daring roast, and the recipient flips a coin to unlock the next level. By the time they reach the final round, the tone shifts — the last message is not a roast but the truth beneath the jokes.",
      "The coin flip adds an element of chance and progression. Each flip feels like a gamble, and the recipient becomes invested in seeing what the next level holds. The final sincere message lands with extra impact after the playful buildup.",
      "Perfect for best friends, siblings, and anyone whose love language is playful insults. The roast-to-respect arc lets you tease first and appreciate after.",
      "Customize the number of roast rounds, each roast's content, the coin animation, and the final sincere message.",
      "What makes this template unique is the coin-flip mechanic that gamifies the roast progression. Each flip determines the next roast level, adding an element of chance that keeps the recipient engaged. The three-round structure ensures a satisfying arc from playful teasing to sincere appreciation, and the coin's unpredictability makes each experience feel different.",
      "To customize this template, write roasts for each round — mild, medium, and spicy. The coin flip decides which roast the recipient gets for the first two rounds. Write the final sincere message that appears regardless of coin outcomes. Choose the coin animation style and preview the full progression to ensure the roast-to-respect arc feels balanced."
    ],
    examples: ["Flip the coin. Heads — a mild roast. Tails — a medium roast. Either way, keep going.", "Level one: playful. Level two: spicy. Level three: the truth.", "The coin decides how deep the roast goes. The final round needs no coin.", "After all the roasting, here is what I actually think."],
    relatedUseCases: ["funny-roast-messages", "friendship-messages", "birthday-messages"],
    faqs: [
      { question: "How many roast rounds are there?", answer: "Three rounds by default — mild, medium, and spicy." },
      { question: "Can I skip the roasting?", answer: "Yes. You can write any content for each round." },
      { question: "Does the coin flip affect the outcome?", answer: "The coin decides the roast level for the first two rounds, but the final message is always sincere." },
      { question: "Can I have more than three rounds?", answer: "The template uses three rounds for the classic roast arc, but you can adjust the content density within each round." },
      { question: "Can the recipient re-flip the coin?", answer: "Yes. If they want to see the other roast option, they can re-flip and experience the alternate content." }
    ]
  },
];

export const faqItems: FaqItem[] = [
  { question: "What is Craft Your Message?", answer: "Craft Your Message is an interactive message generator for creating personalized shareable links with small games, choices, and final reveals. It is designed for love confessions, birthday surprises, apology messages, friendship notes, funny roasts, and any moment that deserves more than a plain text." },
  { question: "How is this different from a normal text message?", answer: "Instead of sending a plain text, you create an interactive link that the recipient opens in their browser. They experience taps, choices, animations, mini-games, and a final reveal — turning your message into a moment they actually feel." },
  { question: "What can I create?", answer: "You can create apology messages, birthday wishes, love confessions, anniversary surprises, proposal messages, good morning texts, good night notes, long-distance love letters, friendship appreciation, farewell messages, thank-you notes, funny roasts, and more. Each can be customized with names, tone, and a personal reveal." },
  { question: "Can I send birthday messages?", answer: "Yes. Birthday templates like Blow Out the Candles, Cut the Cake, and Birthday Journey let you hide your wishes behind candle-blowing, cake-cutting, or a memory path reveal. Perfect for making their day unforgettable." },
  { question: "Can I send apology messages?", answer: "Yes. Apology templates like Kitty Apology, Sorry Maze, and Calm the Storm help you say sorry in a way that feels thoughtful and sincere — not rushed or copied." },
  { question: "Can I send love messages and confessions?", answer: "Absolutely. Love templates like Catch My Heart, Love Contract, Our Memories, and Escape Me help you confess feelings, celebrate your relationship, or create a romantic surprise." },
  { question: "Can I share on WhatsApp?", answer: "Yes. Every message generates a unique link you can copy and paste into WhatsApp, Instagram, SMS, email, or any messaging app. The recipient just taps the link to open it in their browser — no app download needed." },
  { question: "Is it free to use?", answer: "Yes, Craft Your Message is completely free. There are no hidden charges, subscriptions, or paywalls. You can create and share as many messages as you like." },
  { question: "Do recipients need an account?", answer: "No. Recipients open the link directly in their browser. No sign-up, no app download, no friction." },
  { question: "Can I preview before sharing?", answer: "Yes. You can preview the full experience flow before generating a public link to make sure every step looks and feels perfect." },
  { question: "Can I edit my message after creating it?", answer: "Yes. Every created message includes an edit link. You can update the text, change settings, or customize further even after sharing." },
  { question: "Are my messages private?", answer: "Yes. Every link is unique and unguessable — like a private room only you and your recipient know about. You control who receives the link. Only share it with the person you intend to see it." },
  { question: "How long does the link work?", answer: "Links work indefinitely by default. You can optionally set an expiration date during creation if you want the message to auto-delete after a certain time." },
  { question: "Can I see if someone opened my message?", answer: "Yes. The message dashboard shows analytics including how many times the link was opened, whether it was completed, and how recipients interacted with choices along the way." },
  { question: "Is this relationship advice?", answer: "No. This website is for entertainment and creative expression only. It does not provide professional relationship advice, psychological assessment, or proof of anyone's feelings." }
];

export function getUseCase(slug: string) {
  return useCasePages.find((page) => page.slug === slug);
}

export function getTemplateSeoContent(templateId: string) {
  return templateSeoPages.find((page) => page.templateId === templateId);
}

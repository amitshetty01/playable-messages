import { StoryData, GeneratedChapter, TONE_ADJECTIVES, WORLD_VISUALS } from "./types"

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function e(prompt: string, fallback: string): string {
  return prompt.trim() ? prompt : fallback
}

export function generateStory(data: StoryData): GeneratedChapter[] {
  const { userName: u, partnerName: p, favoriteMemory: fm, habits: hb, promise: pr, tone, storyWorld } = data
  const adjList = TONE_ADJECTIVES[tone] || TONE_ADJECTIVES.Romantic
  const adj = () => pick(adjList)
  const world = WORLD_VISUALS[storyWorld] || WORLD_VISUALS["Classic Romance"]

  const memoryText = e(fm, `The moment the universe held its breath. ${u} remembers every detail — the way the light fell, the sound of ${p}'s voice, the feeling that everything had led to this.`)
  const habitsText = e(hb, `The way ${p} ${pick(["laughs at things only they understand", "hums while making tea", "talks to plants like they're friends", "falls asleep in the middle of movies", "leaves little notes everywhere"])} — ${u} notices. And treasures every single one.`)
  const promiseText = e(pr, `Under ${pick(["the same sky that watched them meet", "every constellation that guided them home", "a million stars that witnessed it all"])}, ${u} promises ${p}: ${pick(["I will love you in every timeline.", "you are my home, forever and always.", "every version of me will find every version of you.", "this story will never end."])}`)

  return [
    {
      chapter: "Cover",
      title: `${u} & ${p}`,
      text: `A ${adj()} ${storyWorld.toLowerCase()} love story written in the stars`,
      scene: "An ornate cover embossed with gold, two names intertwined forever",
      atmosphere: ["stars", "glow"],
      illustration: "cover",
    },
    {
      chapter: "Dedication",
      title: "For You",
      text: `To ${p} — the one who changed ${u}'s world without even trying. This is our story, carved in light and memory.`,
      scene: "A handwritten letter on aged paper, sealed with wax and love",
      atmosphere: ["hearts", "candle", "glow"],
      illustration: "dedication",
    },
    {
      chapter: "Chapter 1",
      title: "How Fate Began",
      text: `The universe has a way of bringing souls together. On a ${pick(["quiet evening", "golden afternoon", "starry night", "rainy morning"])}, fate ${pick(["pulled them into the same orbit", "whispered their names at the same moment", "crossed their paths and smiled"])}. ${u} met ${p}, and the world — for just a second — stopped spinning. And in that pause, something began. Something eternal.`,
      scene: world.scene,
      atmosphere: ["moonlight", "stars", pick(["petals", "fireflies", "wind"])],
      illustration: "fate",
      interactive: { type: "tap-moon", label: "Tap the moon", message: `Under this same moon, the universe decided ${u} and ${p} were meant to meet.` },
    },
    {
      chapter: "Chapter 2",
      title: "The Moment Everything Changed",
      text: memoryText,
      scene: "A quiet moment frozen in time — laughter, warmth, the world falling away",
      atmosphere: ["glow", "hearts", pick(["fireflies", "stars", "petals"])],
      illustration: "changed",
      interactive: { type: "hold-photo", label: "Hold the portrait", message: `${p} looked at ${u} like they were the only person in existence. And in that moment, ${u} knew.` },
    },
    {
      chapter: "Chapter 3",
      title: "Little Things I Love",
      text: habitsText,
      scene: "Little things. The way they exist in the world. The details that paint a portrait of someone unforgettable.",
      atmosphere: ["hearts", pick(["candle", "glow", "fireflies"]), "sparkles"],
      illustration: "little",
      interactive: { type: "tap-flower", label: "Tap the flower", message: `Every petal is a moment ${u} fell a little deeper. There aren't enough flowers in the world.` },
    },
    {
      chapter: "Chapter 4",
      title: "The Memory Time Kept",
      text: `Some memories aren't just remembered. They're carried. ${u} carries ${p} in every quiet moment, every glance at the stars, every time the world feels right. Because ${p} is not just a memory — ${p} is a feeling ${u} never wants to end.`,
      scene: "A photograph tucked inside a book, worn soft from being held too many times",
      atmosphere: ["candle", "glow", pick(["stars", "petals", "fog"])],
      illustration: "treasure",
      interactive: { type: "scratch", label: "Scratch the page", message: `Scratch away the dust of time... beneath it, the truth: some moments are forever.` },
    },
    {
      chapter: "Chapter 5",
      title: "The Promise",
      text: promiseText,
      scene: "Two silhouettes under a vast night sky, hands almost touching, the universe holding its breath",
      atmosphere: ["moonlight", "stars", "glow"],
      illustration: "promise",
      interactive: { type: "tap-heart", label: "Double-tap the heart", message: `In every universe, in every life, in every timeline — ${u} will always find ${p}.` },
    },
    {
      chapter: "Final Chapter",
      title: "Our Universe",
      text: `This is not the end. This is the beginning of every story they'll ever write together. ${u} and ${p} — two souls, one universe, infinite possibilities.\n\nAnd so their story continues — not as a finished book, but as an endless journey. ${u} and ${p}, together, through every page yet unwritten.`,
      scene: "A swirling galaxy of memories, two stars orbiting each other, forever",
      atmosphere: ["stars", "glow", "moonlight", "sparkles"],
      illustration: "universe",
      interactive: { type: "tap-window", label: "Tap the window", message: `Look out at the stars. Every one of them is a memory ${u} and ${p} created together.` },
    },
  ]
}

export function generateChoiceText(data: StoryData, choiceIndex: number): string {
  const { userName: u, partnerName: p } = data
  const options = [
    [`${u} took ${p}'s hand. The path ahead glowed warmly as they walked forward together, the weight of the world lifting with every step.`,
     `${u} and ${p} found a bench under the vast canopy of stars. They talked until the sky began to lighten, learning each other all over again.`,
     `${u} grabbed ${p}'s hand and pulled them into the rain. They ran laughing through the downpour, carefree and breathless and perfectly alive.`],
    [`${u} smiled, and the whole world felt warmer. ${p} knew in that moment — this was home.`,
     `${p} whispered something only ${u} could hear. The words hung in the air like starlight.`,
     `They stood in comfortable silence, watching the world go by. Some moments don't need words.`],
    [`"I love you," ${u} said. And it was the truest thing they'd ever spoken.`,
     `${p} reached out, and ${u} met them halfway. Some connections need no explanation.`,
     `They laughed until it hurt. And in that laughter, they found everything.`],
  ]
  const group = options[choiceIndex % options.length]
  return pick(group)
}

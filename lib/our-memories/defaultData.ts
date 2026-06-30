import type { OurMemoriesData } from "./types";
import { generateId } from "./types";

export const defaultData: OurMemoriesData = {
  heroGif: "",
  heroHeading: "Hey Cutie ❤️",
  heroSubheading:
    "Every moment with you feels like a beautiful dream. Some memories deserve to be remembered forever, so I collected a few of my favorite moments just for us. Scroll slowly and relive them with me.",
  memories: [
    {
      id: generateId(),
      photo: "",
      title: "Our First Adventure",
      description: "The day we decided to explore the world together. Every step felt like magic.",
    },
    {
      id: generateId(),
      photo: "",
      title: "That Perfect Sunset",
      description: "We watched the sun go down and talked about everything and nothing at all.",
    },
    {
      id: generateId(),
      photo: "",
      title: "Just Us",
      description: "A quiet moment that meant more than a thousand words ever could.",
    },
  ],
  quote: "Our best memories aren't behind us.\nWe're still creating them.",
  promises: [
    { id: generateId(), text: "I'll always make you smile." },
    { id: generateId(), text: "I'll stay beside you." },
    { id: generateId(), text: "I'll support your dreams." },
    { id: generateId(), text: "I'll create beautiful memories with you." },
    { id: generateId(), text: "I'll love every little thing about you." },
  ],
  finalMessage:
    "Thank you for every smile, every laugh, every memory. I can't wait to create thousands more with you. ❤️",
  endingImage: "",
  signature: "Forever Yours",
  theme: {
    background: "from-pink-50 via-rose-50 to-purple-50",
    accent: "#ec4899",
    font: "serif",
    heartColor: "#f472b6",
    musicUrl: "",
  },
};

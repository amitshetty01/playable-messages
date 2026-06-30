export type Memory = {
  id: string;
  photo: string;
  title: string;
  description: string;
};

export type OurMemoriesData = {
  heroGif: string;
  heroHeading: string;
  heroSubheading: string;
  memories: Memory[];
  quote: string;
  promises: { id: string; text: string }[];
  finalMessage: string;
  endingImage: string;
  signature: string;
  theme: {
    background: string;
    accent: string;
    font: string;
    heartColor: string;
    musicUrl: string;
  };
};

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function encodeData(data: OurMemoriesData): string {
  try {
    const json = JSON.stringify(data);
    return btoa(encodeURIComponent(json));
  } catch {
    return "";
  }
}

export function decodeData(hash: string): OurMemoriesData | null {
  try {
    const json = decodeURIComponent(atob(hash));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

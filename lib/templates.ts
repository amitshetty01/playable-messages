import { Template, BookGenre, WritingStyle } from './book-types';

export const STORY_TEMPLATES: Record<string, Template> = {
  'heros-journey': {
    id: 'heros-journey',
    name: "Hero's Journey",
    genre: 'fiction',
    structure: "Campbell's Hero's Journey",
    description: 'The classic monomyth structure with 12 stages of hero transformation',
    chapters: [
      {
        title: 'The Ordinary World',
        description: "Introduce the hero in their normal life before the adventure",
        suggestedLength: 2000,
        keyPoints: ['Character backstory', 'Normal world setup', 'Character motivation'],
      },
      {
        title: 'The Call to Adventure',
        description: 'The hero receives a challenge or quest',
        suggestedLength: 1500,
        keyPoints: ['Inciting incident', 'Challenge presentation', 'Reluctance'],
      },
      {
        title: 'Crossing the Threshold',
        description: 'Hero commits to the adventure',
        suggestedLength: 1800,
        keyPoints: ['Decision point', 'Point of no return', 'First action'],
      },
      {
        title: 'Tests, Allies, Enemies',
        description: 'Hero learns rules and meets key characters',
        suggestedLength: 3000,
        keyPoints: ['Ally introduction', 'Antagonist reveal', 'Skill building'],
      },
      {
        title: 'Approach to the Inmost Cave',
        description: 'Preparation for major challenge',
        suggestedLength: 2000,
        keyPoints: ['Planning', 'Final preparations', 'Rising tension'],
      },
      {
        title: 'The Ordeal',
        description: 'Major crisis or climax of the story',
        suggestedLength: 2500,
        keyPoints: ['Highest stakes', 'Hero at their lowest', 'Major revelation'],
      },
      {
        title: 'The Reward',
        description: 'Hero achieves their goal',
        suggestedLength: 1500,
        keyPoints: ['Victory celebration', 'New knowledge gained', 'Brief reprieve'],
      },
      {
        title: 'The Road Back',
        description: 'Hero begins return journey',
        suggestedLength: 1800,
        keyPoints: ['New challenge emerges', 'Chase sequence', 'Escalation'],
      },
      {
        title: 'The Resurrection',
        description: 'Final test and transformation',
        suggestedLength: 2500,
        keyPoints: ['Final battle', 'Hero fully transformed', 'Ultimate sacrifice'],
      },
      {
        title: 'Return with the Elixir',
        description: 'Hero returns to ordinary world changed',
        suggestedLength: 2000,
        keyPoints: ['Resolution', 'New normal', 'Lessons learned'],
      },
    ],
    characters: [
      { name: 'Hero', archetype: 'Protagonist', description: 'The main character undertaking the journey' },
      { name: 'Mentor', archetype: 'Guide', description: 'Provides wisdom and training' },
      { name: 'Shadow', archetype: 'Antagonist', description: 'Represents the opposition' },
      { name: 'Ally', archetype: 'Supporting', description: 'Helps the hero in their quest' },
    ],
    themes: ['Transformation', 'Courage', 'Growth', 'Overcoming adversity'],
    writingStyle: 'commercial',
    pacing: { riseOfAction: 50, climax: 25, resolution: 25 },
    tonePresets: { vocabulary: 'moderate', descriptiveness: 7, dialogueRatio: 0.3 },
  },

  'three-act': {
    id: 'three-act',
    name: 'Three-Act Structure',
    genre: 'fiction',
    structure: 'Classic three-act play structure',
    description: 'Setup, Confrontation, Resolution - the most fundamental story structure',
    chapters: [
      {
        title: 'Act I - Setup',
        description: 'Establish characters, world, and conflict',
        suggestedLength: 8000,
        keyPoints: ['Character introduction', 'World building', 'Inciting incident', 'Catalyst'],
      },
      {
        title: 'Act II - Confrontation',
        description: 'Hero faces obstacles and complications',
        suggestedLength: 16000,
        keyPoints: ['Rising action', 'Complications', 'Subplot development', 'Dark moment'],
      },
      {
        title: 'Act III - Resolution',
        description: 'Climax and resolution',
        suggestedLength: 8000,
        keyPoints: ['Climax', 'Falling action', 'Resolution', 'Denouement'],
      },
    ],
    characters: [
      { name: 'Protagonist', archetype: 'Hero', description: 'Main character' },
      { name: 'Antagonist', archetype: 'Opposition', description: 'Main opposition' },
    ],
    themes: ['Conflict', 'Resolution', 'Character growth'],
    writingStyle: 'commercial',
    pacing: { riseOfAction: 40, climax: 20, resolution: 40 },
    tonePresets: { vocabulary: 'moderate', descriptiveness: 6, dialogueRatio: 0.35 },
  },

  'save-the-cat': {
    id: 'save-the-cat',
    name: 'Save the Cat',
    genre: 'fiction',
    structure: "Blake Snyder's Save the Cat beat sheet",
    description: '15 story beats that work for any genre',
    chapters: [
      {
        title: 'Opening Image',
        description: 'Show the before world',
        suggestedLength: 500,
        keyPoints: ['Status quo', 'Problem introduction'],
      },
      {
        title: 'Theme Stated',
        description: 'Pose the central question',
        suggestedLength: 800,
        keyPoints: ['Question raised', 'Theme introduction'],
      },
      {
        title: 'Set-Up',
        description: 'Show why change is needed',
        suggestedLength: 2000,
        keyPoints: ['Stagnation', 'Desire', 'Problem emphasized'],
      },
      {
        title: 'Catalyst',
        description: 'Inciting incident that changes everything',
        suggestedLength: 1000,
        keyPoints: ['Call to action', 'Opportunity', 'Debate begins'],
      },
      {
        title: 'Debate',
        description: 'Hero hesitates - should they act?',
        suggestedLength: 1500,
        keyPoints: ['Resistance', 'Fear', 'Uncertainty'],
      },
      {
        title: 'Break into Two',
        description: 'Hero commits - no turning back',
        suggestedLength: 500,
        keyPoints: ['Decision', 'Commitment', 'New world entered'],
      },
      {
        title: 'B Story',
        description: 'Introduce relationship that tests theme',
        suggestedLength: 1000,
        keyPoints: ['New character', 'Emotional anchor', 'Theme reflection'],
      },
      {
        title: 'Fun and Games',
        description: "The 'promise of the premise'",
        suggestedLength: 3000,
        keyPoints: ['Enjoyable scenes', 'Promise delivery', 'Reader entertainment'],
      },
      {
        title: 'Midpoint',
        description: 'Raised stakes, false victory or defeat',
        suggestedLength: 1500,
        keyPoints: ['Stakes raised', 'Clock starts ticking', 'New goal emerges'],
      },
      {
        title: 'Bad Guys Close In',
        description: 'External and internal pressure increases',
        suggestedLength: 2000,
        keyPoints: ['Pressure builds', 'Team falls apart', 'Self-doubt grows'],
      },
      {
        title: 'All Is Lost',
        description: 'The darkest moment',
        suggestedLength: 1000,
        keyPoints: ['Lowest point', 'Loss', 'Change of plans needed'],
      },
      {
        title: 'Dark Night of the Soul',
        description: 'Moment of despair before breakthrough',
        suggestedLength: 1000,
        keyPoints: ['Mourning', 'Reflection', 'Acceptance'],
      },
      {
        title: 'Break into Three',
        description: 'New inspiration, new plan',
        suggestedLength: 500,
        keyPoints: ['Realization', 'New idea', 'Hope returns'],
      },
      {
        title: 'Finale',
        description: 'Final battle to win or lose',
        suggestedLength: 2500,
        keyPoints: ['Final test', 'All stakes on table', 'Climax'],
      },
      {
        title: 'Final Image',
        description: 'Mirror of opening image - show change',
        suggestedLength: 500,
        keyPoints: ['Transformation shown', 'Resolution', 'Theme answered'],
      },
    ],
    characters: [
      { name: 'Cat', archetype: 'Hero', description: 'Character who saves the day' },
      { name: 'Stakes', archetype: 'Relationship', description: 'What the hero cares about' },
    ],
    themes: ['Transformation', 'Theme exploration', 'Redemption'],
    writingStyle: 'commercial',
    pacing: { riseOfAction: 45, climax: 20, resolution: 35 },
    tonePresets: { vocabulary: 'moderate', descriptiveness: 7, dialogueRatio: 0.4 },
  },
};

export const GENRE_TEMPLATES: Record<BookGenre, Partial<Template>> = {
  romance: {
    themes: ['Love', 'Connection', 'Vulnerability', 'Trust'],
    tonePresets: { vocabulary: 'moderate', descriptiveness: 8, dialogueRatio: 0.5 },
    pacing: { riseOfAction: 40, climax: 15, resolution: 45 },
  },
  'sci-fi': {
    themes: ['Technology', 'Humanity', 'Survival', 'Discovery'],
    tonePresets: { vocabulary: 'complex', descriptiveness: 8, dialogueRatio: 0.3 },
    pacing: { riseOfAction: 50, climax: 20, resolution: 30 },
  },
  fantasy: {
    themes: ['Magic', 'Good vs Evil', 'Destiny', 'Adventure'],
    tonePresets: { vocabulary: 'complex', descriptiveness: 9, dialogueRatio: 0.35 },
    pacing: { riseOfAction: 45, climax: 25, resolution: 30 },
  },
  mystery: {
    themes: ['Discovery', 'Deception', 'Truth', 'Investigation'],
    tonePresets: { vocabulary: 'moderate', descriptiveness: 6, dialogueRatio: 0.4 },
    pacing: { riseOfAction: 50, climax: 15, resolution: 35 },
  },
  literary: {
    themes: ['Human condition', 'Reflection', 'Emotion', 'Meaning'],
    tonePresets: { vocabulary: 'complex', descriptiveness: 9, dialogueRatio: 0.45 },
    pacing: { riseOfAction: 30, climax: 20, resolution: 50 },
  },
  memoir: {
    themes: ['Identity', 'Growth', 'Reflection', 'Truth'],
    tonePresets: { vocabulary: 'moderate', descriptiveness: 7, dialogueRatio: 0.3 },
    pacing: { riseOfAction: 40, climax: 20, resolution: 40 },
  },
  'self-help': {
    themes: ['Improvement', 'Practical knowledge', 'Empowerment', 'Change'],
    tonePresets: { vocabulary: 'simple', descriptiveness: 4, dialogueRatio: 0.2 },
    pacing: { riseOfAction: 20, climax: 10, resolution: 70 },
  },
  business: {
    themes: ['Strategy', 'Leadership', 'Innovation', 'Success'],
    tonePresets: { vocabulary: 'complex', descriptiveness: 5, dialogueRatio: 0.15 },
    pacing: { riseOfAction: 15, climax: 10, resolution: 75 },
  },
  fiction: {
    themes: ['Plot', 'Character', 'Conflict', 'Resolution'],
    tonePresets: { vocabulary: 'moderate', descriptiveness: 7, dialogueRatio: 0.4 },
    pacing: { riseOfAction: 45, climax: 20, resolution: 35 },
  },
  thriller: {
    themes: ['Danger', 'Tension', 'Survival', 'Betrayal'],
    tonePresets: { vocabulary: 'moderate', descriptiveness: 7, dialogueRatio: 0.25 },
    pacing: { riseOfAction: 55, climax: 20, resolution: 25 },
  },
  other: {
    themes: ['Custom', 'Unique', 'Original', 'Creative'],
    tonePresets: { vocabulary: 'moderate', descriptiveness: 7, dialogueRatio: 0.35 },
    pacing: { riseOfAction: 40, climax: 20, resolution: 40 },
  },
};

export const WRITING_STYLE_PRESETS: Record<WritingStyle, any> = {
  literary: {
    vocabulary: 'complex',
    descriptiveness: 9,
    sentenceVariety: 'high',
    dialogueRatio: 0.45,
    symbolism: 'high',
  },
  commercial: {
    vocabulary: 'moderate',
    descriptiveness: 7,
    sentenceVariety: 'medium',
    dialogueRatio: 0.4,
    symbolism: 'medium',
  },
  'young-adult': {
    vocabulary: 'simple',
    descriptiveness: 6,
    sentenceVariety: 'medium',
    dialogueRatio: 0.5,
    symbolism: 'low',
  },
  children: {
    vocabulary: 'simple',
    descriptiveness: 5,
    sentenceVariety: 'low',
    dialogueRatio: 0.6,
    symbolism: 'low',
  },
  technical: {
    vocabulary: 'complex',
    descriptiveness: 4,
    sentenceVariety: 'low',
    dialogueRatio: 0.1,
    symbolism: 'none',
  },
  casual: {
    vocabulary: 'simple',
    descriptiveness: 6,
    sentenceVariety: 'high',
    dialogueRatio: 0.55,
    symbolism: 'low',
  },
};

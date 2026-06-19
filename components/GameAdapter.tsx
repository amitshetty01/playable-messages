"use client";

import type { ExperienceRecord, Template } from "@/lib/types";
import { GamePlayer } from "@/components/GamePlayer";
import { ScratchCardGame } from "@/components/games/ScratchCardGame";
import { PuzzlePiecesGame } from "@/components/games/PuzzlePiecesGame";
import { KittyApologyGame } from "@/components/games/KittyApologyGame";
import { RedactedDecoderGame } from "@/components/games/RedactedDecoderGame";
import { CutTheCakeGame } from "@/components/games/CutTheCakeGame";
import { FlipMatchGame } from "@/components/games/FlipMatchGame";
import { FlashlightFogGame } from "@/components/games/FlashlightFogGame";
import { ComeCloserPrank } from "@/components/games/ComeCloserPrank";
import { RatingRoastGame } from "@/components/games/RatingRoastGame";

const GAME_MAP: Record<string, React.FC<any>> = {
  "love-beats": ScratchCardGame,
  "sorry-puzzle": PuzzlePiecesGame,
  "kitty-apology": KittyApologyGame,
  "come-closer": ComeCloserPrank,
  "funny-slots": RatingRoastGame,
  "secret-decoder": RedactedDecoderGame,
  "birthday-cake": CutTheCakeGame,
  "roast-wheel": RatingRoastGame,
  "memory-flip": FlipMatchGame,
  "mystery-fog": FlashlightFogGame,
};

export function GameAdapter({
  experience,
  template,
  mode,
  shareUrl,
}: {
  experience: ExperienceRecord;
  template: Template;
  mode: "demo" | "generated" | "preview";
  shareUrl?: string;
}) {
  const GameComponent = GAME_MAP[template.id] || ScratchCardGame;

  return (
    <GamePlayer experience={experience} template={template} mode={mode} shareUrl={shareUrl}>
      {({ onComplete }) => (
        <GameComponent
          message={experience.finalMessage}
          tone={experience.tone}
          onComplete={onComplete}
        />
      )}
    </GamePlayer>
  );
}

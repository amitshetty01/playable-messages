"use client";

import type { ExperienceRecord, Template } from "@/lib/types";
import { GamePlayer } from "@/components/GamePlayer";
import { ScratchCardGame } from "@/components/games/ScratchCardGame";
import { PuzzlePiecesGame } from "@/components/games/PuzzlePiecesGame";
import { KittyApologyGame } from "@/components/games/KittyApologyGame";
import { SlotMachineGame } from "@/components/games/SlotMachineGame";
import { RedactedDecoderGame } from "@/components/games/RedactedDecoderGame";
import { CutTheCakeGame } from "@/components/games/CutTheCakeGame";
import { SpinWheelGame } from "@/components/games/SpinWheelGame";
import { FlipMatchGame } from "@/components/games/FlipMatchGame";
import { FlashlightFogGame } from "@/components/games/FlashlightFogGame";

const GAME_MAP: Record<string, React.FC<any>> = {
  "love-beats": ScratchCardGame,
  "sorry-puzzle": PuzzlePiecesGame,
  "kitty-apology": KittyApologyGame,
  "funny-slots": SlotMachineGame,
  "secret-decoder": RedactedDecoderGame,
  "birthday-cake": CutTheCakeGame,
  "roast-wheel": SpinWheelGame,
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

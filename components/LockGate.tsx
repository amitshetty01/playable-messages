"use client";

import { useState } from "react";
import type { LockType } from "@/lib/types";

type LockGateProps = {
  lockType: LockType;
  lockValue?: string;
  receiverName?: string;
  creatorName?: string;
  togetherSince?: string;
  onUnlock: () => void;
};

export function LockGate({ lockType, lockValue, receiverName, creatorName, togetherSince, onUnlock }: LockGateProps) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [puzzleAnswer, setPuzzleAnswer] = useState("");

  if (!lockType) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (lockType === "password") {
      if (answer.toLowerCase() === lockValue?.toLowerCase()) {
        onUnlock();
      } else {
        setError("Wrong password. Try again.");
      }
    } else if (lockType === "nickname") {
      if (answer.toLowerCase() === lockValue?.toLowerCase()) {
        onUnlock();
      } else {
        setError("That's not the right nickname.");
      }
    } else if (lockType === "date") {
      if (answer === lockValue) {
        onUnlock();
      } else {
        setError("That date doesn't match.");
      }
    } else if (lockType === "puzzle") {
      if (puzzleSolved) {
        onUnlock();
      } else {
        setError("Solve the puzzle first.");
      }
    }
  };

  const renderPuzzle = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;

    return (
      <div className="space-y-3">
        <p className="text-white/70">Solve: {num1} + {num2} = ?</p>
        <input
          value={puzzleAnswer}
          onChange={(e) => {
            setPuzzleAnswer(e.target.value);
            if (Number(e.target.value) === num1 + num2) setPuzzleSolved(true);
          }}
          className="input text-center"
          placeholder="Answer"
          type="number"
        />
        {puzzleSolved && <p className="text-green-400 text-sm font-bold">✓ Correct!</p>}
      </div>
    );
  };

  const prompts: Record<NonNullable<LockType>, { title: string; description: string; placeholder: string }> = {
    password: {
      title: "🔒 This message is locked",
      description: creatorName ? `${creatorName} set a password for this message.` : "Enter the password to unlock.",
      placeholder: "Enter password",
    },
    nickname: {
      title: "💕 What does they call you?",
      description: creatorName ? `${creatorName} wants to make sure it's you.` : "Enter your special nickname to unlock.",
      placeholder: "Enter your nickname",
    },
    date: {
      title: "📅 What's the special date?",
      description: "Enter the date (MM/DD/YYYY) that means something to both of you.",
      placeholder: "MM/DD/YYYY",
    },
    puzzle: {
      title: "🧩 Solve this puzzle",
      description: "Solve this tiny puzzle to unlock the message.",
      placeholder: "",
    },
  };

  const prompt = prompts[lockType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#15101f]/95 backdrop-blur-sm">
      <div className="glass mx-4 w-full max-w-md rounded-[2rem] p-6 sm:p-8 text-center">
        <p className="text-4xl mb-3">
          {lockType === "password" ? "🔒" : lockType === "nickname" ? "💕" : lockType === "date" ? "📅" : "🧩"}
        </p>
        <h2 className="text-2xl font-bold text-white">{prompt.title}</h2>
        <p className="mt-2 text-white/60">{prompt.description}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {lockType === "puzzle" ? (
            renderPuzzle()
          ) : (
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="input text-center"
              placeholder={prompt.placeholder}
              autoFocus
            />
          )}

          {error && <p className="text-rose-400 text-sm font-bold">{error}</p>}

          <button type="submit" className="premium-button w-full">
            {lockType === "puzzle" && !puzzleSolved ? "Solve first" : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

type QualityScoreProps = {
  message: string;
  receiverName?: string;
  creatorName?: string;
};

export function QualityScore({ message, receiverName, creatorName }: QualityScoreProps) {
  const wordCount = message.split(/\s+/).filter(Boolean).length;
  const hasName = Boolean(receiverName || creatorName);
  const hasPersonal = message.includes("you") || message.includes("your") || message.includes("we") || message.includes("our");
  const hasEmotion = /love|sorry|miss|care|heart|thank|grateful|blessed|happy|proud/i.test(message);
  const hasSpecific = /remember|when|that time|the day|first|last|always|never/i.test(message);
  const lengthScore = Math.min(wordCount / 3, 100);
  const personalScore = hasName ? 30 : 0;
  const emotionScore = hasEmotion ? 25 : hasPersonal ? 15 : 0;
  const specificScore = hasSpecific ? 20 : 0;
  const totalScore = Math.min(Math.round(lengthScore + personalScore + emotionScore + specificScore), 100);

  const getLabel = (score: number) => {
    if (score >= 80) return { label: "💎 Excellent", color: "text-emerald-400" };
    if (score >= 60) return { label: "👍 Good", color: "text-blue-400" };
    if (score >= 40) return { label: "📝 Needs work", color: "text-yellow-400" };
    return { label: "✏️ Keep going", color: "text-rose-400" };
  };

  const { label, color } = getLabel(totalScore);

  return (
    <div className="glass rounded-[1.4rem] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-white/50">Quality score</p>
        <p className={`text-lg font-extrabold ${color}`}>{label}</p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-400 via-fuchsia-400 to-emerald-400 transition-all duration-500"
          style={{ width: `${totalScore}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-white/50">
        <div>Length: {Math.min(wordCount, 30)}/30 words</div>
        <div>Personal: {hasName ? "✓ Included" : "— Add name"}</div>
        <div>Emotion: {hasEmotion ? "✓ Detected" : "— Add feeling"}</div>
        <div>Specific: {hasSpecific ? "✓ Good" : "— Add memory"}</div>
      </div>
    </div>
  );
}

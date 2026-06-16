export function MoodScanner({ result = "Detected: 64% anger, 22% drama, 14% needs attention." }: { result?: string }) {
  return (
    <div className="relative mx-auto my-6 max-w-xl overflow-hidden rounded-[1.5rem] border border-emerald-200/25 bg-emerald-300/10 p-6 text-center">
      <div className="scan-line absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-emerald-200/25 to-transparent" />
      <p className="relative z-10 text-sm font-bold tracking-[0.08em] text-emerald-50/75">Scanning mood...</p>
      <p className="relative z-10 mt-3 font-bold text-white/80">{result}</p>
    </div>
  );
}

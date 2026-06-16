export function GlitchText({ normal, truth }: { normal: string; truth: string }) {
  return (
    <div className="mx-auto my-6 max-w-lg rounded-[1.5rem] border border-cyan-300/25 bg-black/35 p-5 font-mono">
      <p className="text-white/35 line-through">{normal}</p>
      <p className="glitch-text mt-3 text-xl font-extrabold text-white">{truth}</p>
    </div>
  );
}

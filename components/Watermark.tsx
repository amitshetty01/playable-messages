export function Watermark() {
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <span className="inline-block rounded-full border border-white/[0.06] bg-black/40 px-3 py-1 text-[10px] font-bold tracking-widest text-white/30 backdrop-blur-md uppercase">
        Sample Experience
      </span>
    </div>
  );
}

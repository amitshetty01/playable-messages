export function PasswordRoom({ boxes }: { boxes: string[] }) {
  return (
    <div className="mx-auto my-6 grid max-w-xl gap-3 sm:grid-cols-3">
      {boxes.map((box, index) => (
        <div className="rounded-[1.2rem] border border-violet-200/25 bg-violet-300/10 p-4 text-center" key={box}>
          <p className="text-xs font-bold tracking-[0.08em] text-white/50">Box {index + 1}</p>
          <p className="mt-3 break-words text-sm font-bold text-white/75">{box}</p>
        </div>
      ))}
    </div>
  );
}

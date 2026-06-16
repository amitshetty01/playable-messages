export function MemoryDoor({ doors }: { doors: string[] }) {
  return (
    <div className="mx-auto my-6 grid max-w-xl gap-3 sm:grid-cols-2">
      {doors.map((door) => <div className="break-words rounded-t-[1.5rem] rounded-b-lg border border-white/15 bg-white/10 p-4 text-center font-extrabold text-white/75 sm:p-5" key={door}>{door}</div>)}
    </div>
  );
}

export function FakeChatScreen({ lines }: { lines: string[] }) {
  return (
    <div className="mx-auto my-6 grid max-w-lg gap-3 rounded-[1.5rem] border border-white/15 bg-black/25 p-3 text-left sm:p-4">
      {lines.map((line, index) => (
        <p className="max-w-[92%] break-words rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/75 even:ml-auto even:bg-cyan-200/10 sm:max-w-[86%]" key={`${line}-${index}`}>{line}</p>
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8">
      <div className="glass animate-pulse rounded-[2rem] p-5 sm:p-8">
        <div className="mb-3 h-3 w-28 rounded-full bg-white/10" />
        <div className="mt-4 h-10 w-3/4 rounded-xl bg-white/10 sm:h-14" />
        <div className="mt-3 h-4 w-full rounded-lg bg-white/10" />
        <div className="mt-2 h-4 w-5/6 rounded-lg bg-white/10" />
      </div>
      <div className="grid animate-pulse gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass rounded-[2rem] p-5">
            <div className="mb-3 h-3 w-20 rounded-full bg-white/10" />
            <div className="h-6 w-3/4 rounded-lg bg-white/10" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-4/5 rounded bg-white/10" />
            </div>
            <div className="mt-5 flex gap-3">
              <div className="h-10 flex-1 rounded-full bg-white/10" />
              <div className="h-10 w-20 rounded-full bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

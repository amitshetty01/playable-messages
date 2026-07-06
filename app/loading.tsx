export default function Loading() {
  return (
    <div className="page-enter mx-auto w-full max-w-7xl space-y-6 px-3 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8">
      <div className="glass rounded-[2rem] p-5 sm:p-8">
        <div className="skeleton mb-3 h-3 w-28 rounded-full" />
        <div className="skeleton mt-4 h-10 w-3/4 rounded-xl sm:h-14" />
        <div className="skeleton mt-3 h-4 w-full rounded-lg" />
        <div className="skeleton mt-2 h-4 w-5/6 rounded-lg" />
        <div className="mt-6 flex gap-3">
          <div className="skeleton h-12 w-40 rounded-full" />
          <div className="skeleton h-12 w-32 rounded-full" />
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass rounded-[2rem] p-5" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center gap-3">
              <div className="skeleton h-12 w-12 rounded-xl" />
              <div className="flex-1">
                <div className="skeleton h-4 w-3/4 rounded-lg" />
                <div className="skeleton mt-2 h-3 w-20 rounded-full" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-4/5 rounded" />
            </div>
            <div className="mt-5 flex gap-3">
              <div className="skeleton h-10 flex-1 rounded-full" />
              <div className="skeleton h-10 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
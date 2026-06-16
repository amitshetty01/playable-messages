"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto grid min-h-[50vh] max-w-2xl place-items-center text-center">
      <div className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-sm font-bold tracking-[0.08em] text-rose-100">Something broke</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">This page could not finish loading.</h1>
        <p className="mt-4 text-white/70">An unexpected error occurred. Please try again.</p>
        <button className="premium-button mt-6" type="button" onClick={reset}>Try again</button>
      </div>
    </div>
  );
}

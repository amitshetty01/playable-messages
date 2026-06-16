import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 mx-auto mt-2 flex w-[min(calc(100%-16px),80rem)] items-center justify-between gap-4 rounded-full border border-white/15 bg-ink/75 p-3 shadow-glow backdrop-blur-2xl sm:mt-3 sm:w-[min(calc(100%-24px),80rem)] max-sm:flex-col max-sm:items-stretch max-sm:gap-3 max-sm:rounded-[1.6rem]">
      <Link className="flex min-w-0 items-center gap-3 max-sm:w-full" href="/" aria-label="Craft Your Message home">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-blush to-violet text-sm font-extrabold tracking-tight text-white shadow-soft">CY</span>
        <span className="min-w-0 leading-none">
          <strong className="block truncate text-[0.95rem] font-extrabold tracking-[-0.02em]">Craft Your Message</strong>
          <small className="mt-1 block text-[0.72rem] font-semibold text-white/50 max-sm:hidden">Interactive links</small>
        </span>
      </Link>
      <nav className="flex flex-wrap items-center justify-center gap-1 text-center text-[0.82rem] font-bold text-white/70 sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:text-sm max-sm:mt-1 max-sm:w-full" aria-label="Main navigation">
        <Link className="rounded-full px-2 py-1.5 transition hover:bg-white/10 hover:text-white sm:px-3" href="/categories">Categories</Link>
        <Link className="rounded-full px-2 py-1.5 transition hover:bg-white/10 hover:text-white sm:px-3" href="/templates">Templates</Link>
        <Link className="rounded-full px-2 py-1.5 transition hover:bg-white/10 hover:text-white sm:px-3" href="/create">Create</Link>
        <Link className="rounded-full px-2 py-1.5 transition hover:bg-white/10 hover:text-white sm:px-3" href="/my-experiences">My messages</Link>
        <Link className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-ink transition hover:bg-white/90 sm:px-4 sm:py-2" href="/create">Start creating</Link>
      </nav>
    </header>
  );
}

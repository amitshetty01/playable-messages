import Link from "next/link";

export function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 pb-8 pt-6 text-sm leading-6 text-white/60 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
      <p className="max-w-3xl">
        This website is for fun and entertainment only. It does not provide relationship advice, psychological assessment, or proof of anyone&rsquo;s feelings.
      </p>
      <div className="flex flex-wrap gap-4 font-bold text-white/75 max-sm:w-full max-sm:justify-between">
        <Link href="/about">About</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/report">Report abuse</Link>
      </div>
    </footer>
  );
}

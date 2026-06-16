import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { MyExperiencesList } from "@/components/MyExperiencesList";

export const metadata: Metadata = buildMetadata({
  title: "My Created Messages",
  description: "View and manage your created interactive messages.",
  path: "/my-experiences",
  noIndex: true
});

export default function MyExperiencesPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Dashboard</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">My messages</h1>
        <p className="mt-5 max-w-2xl text-white/70">Messages you have created are saved to this device. Open a link to see how many people have viewed it, or delete messages when you are done.</p>
      </section>
      <MyExperiencesList />
      <div className="text-center">
        <Link className="premium-button" href="/create">Create a new message</Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BoardPostForm } from "@/components/forms/BoardPostForm";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Post to the Last-Minute Board",
  description:
    "Post what you need or the space you have open for Boulder's festival window. Posting is free.",
  path: "/board/new",
});

export default function NewBoardPostPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-[var(--space-section)]">
      <SectionHeader
        eyebrow="New post"
        title="Post to the board"
        intro="Tell the other side what you are looking for or what you have open. Keep it free of personal contact details. You connect privately once there is a match."
      />
      <div className="mt-10 rounded-card border border-charcoal/10 p-6 shadow-sm md:p-8">
        <BoardPostForm />
      </div>
      <p className="mt-6 text-sm text-charcoal/60">
        Looking for a full season listing instead? See{" "}
        <Link href="/list-your-home" className="text-mountain underline">
          List Your Home
        </Link>
        .
      </p>
    </section>
  );
}

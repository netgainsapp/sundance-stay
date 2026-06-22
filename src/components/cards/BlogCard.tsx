import Link from "next/link";
import { BlogCover } from "@/components/blog/BlogCover";
import type { BlogPost } from "@/content/types";

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-charcoal/10 transition-colors hover:border-mountain"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <BlogCover
          seed={post.slug}
          className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-copper">
          {post.category}
        </p>
        <h3 className="mt-3 font-heading text-xl text-charcoal">{post.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/70">
          {post.excerpt}
        </p>
        <p className="mt-4 text-xs text-charcoal/50">{formatDate(post.publishedAt)}</p>
      </div>
    </Link>
  );
}

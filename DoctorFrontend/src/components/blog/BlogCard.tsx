import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types/post";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const date = new Date(post.publishedAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-[var(--radius-xl)] overflow-hidden transition-all duration-[var(--duration-normal)] hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
      style={{
        backgroundColor: "var(--color-white)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Cover image */}
      <div
        className="relative overflow-hidden"
        style={{ height: featured ? "220px" : "180px" }}
      >
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-105"
          sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
        />
        {/* Subtle overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.28) 100%)" }}
          aria-hidden
        />
        {/* Category badge */}
        <span
          className="absolute top-4 left-4 px-3 py-1 rounded-[var(--radius-full)] text-xs font-semibold"
          style={{ backgroundColor: "var(--color-primary)", color: "white" }}
        >
          {post.category}
        </span>
        {/* Reading time */}
        <span
          className="absolute top-4 right-4 px-3 py-1 rounded-[var(--radius-full)] text-xs"
          style={{
            backgroundColor: "rgba(250,250,247,0.9)",
            backdropFilter: "blur(8px)",
            color: "var(--color-text-secondary)",
          }}
        >
          {post.readingTime} phút đọc
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-6 flex-1">
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {date}
        </p>
        <h3
          className="font-display font-semibold text-balance leading-snug transition-colors duration-[var(--duration-fast)] group-hover:text-[var(--color-primary)]"
          style={{ fontSize: featured ? "var(--text-xl)" : "var(--text-base)", color: "var(--color-text)" }}
        >
          {post.title}
        </h3>
        <p
          className="text-sm leading-relaxed line-clamp-3"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {post.excerpt}
        </p>

        <div
          className="mt-auto pt-4 flex items-center gap-2 text-sm font-medium"
          style={{ color: "var(--color-primary)" }}
        >
          Đọc thêm
          <ArrowRight size={16} className="transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1" aria-hidden />
        </div>
      </div>
    </Link>
  );
}

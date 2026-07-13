import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { BlogCard } from "@/components/blog/BlogCard";
import { MOCK_POSTS } from "@/constants/posts";

export function BlogPreviewSection() {
  const featured = MOCK_POSTS.find((p) => p.featured) ?? MOCK_POSTS[0];
  const others = MOCK_POSTS.filter((p) => !p.featured).slice(0, 3);

  return (
    <section className="py-[var(--space-section)]" style={{ backgroundColor: "var(--color-surface-alt)" }}>
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionTitle
            eyebrow="Bài viết mới nhất"
            title="Kiến thức y khoa dành cho cha mẹ"
            subtitle="Cập nhật thông tin chính xác về sức khỏe, dinh dưỡng và sự phát triển của trẻ."
            className="max-w-lg"
          />
          <Link
            href="/blog"
            className="text-sm font-medium shrink-0 transition-colors hover:text-[var(--color-primary-hover)] flex items-center gap-1"
            style={{ color: "var(--color-primary)" }}
          >
            Xem tất cả bài viết <ArrowRight size={15} aria-hidden />
          </Link>
        </div>

        {/* Featured post — full width */}
        <div className="mb-6">
          <BlogCard post={featured} featured />
        </div>

        {/* 3 smaller posts in a row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {others.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

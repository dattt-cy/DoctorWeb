import { BlogCard } from "@/components/blog/BlogCard";
import { API_BASE_URL } from "@/lib/blog-api";
import type { BlogPost } from "@/types/post";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

async function getLatestPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/public/blogs?size=4&sort=publishedAt,desc`,
      { next: { revalidate: 60 } },
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.content || [];
  } catch {
    return [];
  }
}

export async function BlogPreviewSection() {
  const posts = await getLatestPosts();
  const featured = posts[0];
  const others = posts.slice(1, 4);

  return (
    <section className="border-y border-cyan-100 bg-gradient-to-b from-cyan-50/70 to-white py-[var(--space-section)]">
      <div className="container">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">Góc kiến thức</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Kiến thức y khoa dành cho cha mẹ
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Thông tin sức khỏe chính xác, dễ hiểu và có thể áp dụng trong quá trình chăm sóc trẻ mỗi ngày.
            </p>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-700 transition hover:text-cyan-900">
            Xem tất cả bài viết <ArrowRight size={16} />
          </Link>
        </div>

        {featured ? (
          <>
            <BlogCard post={featured} featured />
            {others.length > 0 && (
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {others.map((post) => <BlogCard key={post.slug} post={post} />)}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-cyan-200 bg-white py-16 text-center">
            <BookOpen className="mx-auto text-cyan-300" size={40} />
            <p className="mt-4 font-semibold text-slate-700">Các bài viết sức khỏe đang được cập nhật</p>
            <Link href="/blog" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-cyan-700">
              Đến trang kiến thức <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

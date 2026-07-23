"use client";

import type { BlogPost } from "@/types/post";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { BlogCard } from "./BlogCard";

interface BlogListingProps {
  posts: BlogPost[];
}

export function BlogListing({ posts }: BlogListingProps) {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => ["Tất cả", ...Array.from(new Set(posts.map((post) => post.category).filter(Boolean)))],
    [posts],
  );

  const filtered = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("vi-VN");
    return posts.filter((post) => {
      const categoryMatches = activeCategory === "Tất cả" || post.category === activeCategory;
      const queryMatches =
        !keyword ||
        post.title.toLocaleLowerCase("vi-VN").includes(keyword) ||
        post.excerpt.toLocaleLowerCase("vi-VN").includes(keyword);
      return categoryMatches && queryMatches;
    });
  }, [activeCategory, posts, query]);

  const featured = filtered[0];
  const remaining = filtered.slice(1);

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">Thư viện sức khỏe</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Bài viết mới nhất</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
            Tìm câu trả lời đáng tin cậy cho những băn khoăn thường gặp trong quá trình chăm sóc trẻ.
          </p>
        </div>
        <p className="text-sm text-slate-500">
          <strong className="text-slate-900">{filtered.length}</strong> bài viết
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm kiếm bài viết…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:max-w-[62%] lg:pb-0">
            <SlidersHorizontal size={17} className="ml-1 flex-none text-slate-400" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-none rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeCategory === category
                    ? "bg-cyan-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <Search className="mx-auto text-slate-300" size={38} />
          <p className="mt-4 font-semibold text-slate-700">Không tìm thấy bài viết phù hợp</p>
          <button
            onClick={() => { setQuery(""); setActiveCategory("Tất cả"); }}
            className="mt-2 text-sm font-semibold text-cyan-700 hover:text-cyan-900"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {featured && <BlogCard post={featured} featured />}
          {remaining.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {remaining.map((post) => <BlogCard key={post.slug} post={post} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { BlogCard } from "./BlogCard";
import type { BlogPost } from "@/types/post";
import { POST_CATEGORIES } from "@/constants/posts";

interface BlogListingProps {
  posts: BlogPost[];
}

export function BlogListing({ posts }: BlogListingProps) {
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const filtered =
    activeCategory === "Tất cả"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="flex flex-col gap-10">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {POST_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-2 rounded-[var(--radius-full)] text-sm font-medium transition-all duration-[var(--duration-fast)]"
            style={{
              backgroundColor: activeCategory === cat ? "var(--color-primary)" : "var(--color-surface)",
              color: activeCategory === cat ? "white" : "var(--color-text-secondary)",
              border: `1px solid ${activeCategory === cat ? "var(--color-primary)" : "var(--color-border)"}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center py-16" style={{ color: "var(--color-text-muted)" }}>
          Chưa có bài viết trong danh mục này.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

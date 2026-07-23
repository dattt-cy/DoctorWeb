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
      <div className="flex flex-wrap gap-3">
        {POST_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-5 py-2 rounded-full text-sm font-bold transition-all duration-300"
            style={{
              backgroundColor: activeCategory === cat ? "#17a2b8" : "transparent",
              color: activeCategory === cat ? "white" : "#6c757d",
              border: `1px solid ${activeCategory === cat ? "#17a2b8" : "#dee2e6"}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center py-16 text-gray-500">
          Chưa có bài viết trong danh mục này.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

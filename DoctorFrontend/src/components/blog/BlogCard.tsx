import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types/post";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const date = new Date(post.publishedAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "numeric",
    year: "numeric",
  }).replace(/\//g, '.'); // Format as YYYY.MM.DD or DD.MM.YYYY

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
    >
      {/* Cover image */}
      <div
        className="relative overflow-hidden w-full bg-gray-50"
        style={{ height: featured ? "240px" : "190px" }}
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <span className="font-bold text-2xl opacity-20">{post.title.substring(0, 2).toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col p-6 flex-1">
        <h3
          className="font-bold text-gray-900 leading-snug transition-colors duration-200 group-hover:text-[#17a2b8] mb-3"
          style={{ fontSize: featured ? "1.25rem" : "1.125rem" }}
        >
          {post.title}
        </h3>
        
        <p
          className="text-sm leading-relaxed line-clamp-3 text-gray-500 mb-6"
        >
          {post.excerpt}
        </p>

        {/* Footer info */}
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
          <span className="font-medium tracking-wide">
            {date}
          </span>
          <div className="flex gap-2 items-center flex-wrap">
             <span className="border border-[#17a2b8] text-[#17a2b8] px-2.5 py-0.5 rounded-sm font-medium">
                {post.category}
             </span>
             {/* If we want to show tags on the card, we could split and map them here, but category is enough to match Raccoon style */}
          </div>
        </div>
      </div>
    </Link>
  );
}

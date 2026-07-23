import type { BlogPost } from "@/types/post";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const date = post.publishedAt
    ? new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(post.publishedAt))
    : "Mới cập nhật";

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 lg:grid-cols-[1.08fr_.92fr]"
      >
        <Cover post={post} className="aspect-[16/10] lg:aspect-auto lg:min-h-[390px]" sizes="(max-width: 1024px) 100vw, 55vw" />
        <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-11">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800">{post.category}</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nổi bật</span>
          </div>
          <h3 className="mt-5 text-2xl font-bold leading-snug tracking-tight text-slate-950 transition group-hover:text-cyan-800 sm:text-3xl">
            {post.title}
          </h3>
          <p className="mt-4 line-clamp-3 text-base leading-7 text-slate-600">{post.excerpt}</p>
          <CardMeta date={date} readingTime={post.readingTime} />
          <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-cyan-700">
            Đọc bài viết <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-slate-200/70"
    >
      <Cover post={post} className="aspect-[16/10]" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
      <div className="flex flex-1 flex-col p-6">
        <span className="w-fit rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800">{post.category}</span>
        <h3 className="mt-4 line-clamp-2 text-xl font-bold leading-snug text-slate-950 transition group-hover:text-cyan-800">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{post.excerpt}</p>
        <CardMeta date={date} readingTime={post.readingTime} />
      </div>
    </Link>
  );
}

function Cover({ post, className, sizes }: { post: BlogPost; className: string; sizes: string }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-100 ${className}`}>
      {post.coverImage ? (
        <Image src={post.coverImage} alt={post.title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes={sizes} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-5xl font-black text-cyan-700/15">{post.title.slice(0, 2).toUpperCase()}</div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/10 to-transparent" />
    </div>
  );
}

function CardMeta({ date, readingTime }: { date: string; readingTime: number }) {
  return (
    <div className="mt-auto flex items-center gap-4 border-t border-slate-100 pt-5 text-xs font-medium text-slate-400">
      <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {date}</span>
      <span className="flex items-center gap-1.5"><Clock3 size={14} /> {readingTime || 1} phút đọc</span>
    </div>
  );
}

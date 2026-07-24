import { BlogCard } from "@/components/blog/BlogCard";
import { ChatbotButton } from "@/components/chatbot/ChatbotButton";
import { Footer } from "@/components/layout/Footer";
import { DOCTOR_INFO } from "@/constants/doctor";
import { API_BASE_URL } from "@/lib/blog-api";
import { SITE, absoluteUrl } from "@/lib/site";
import type { BlogPost } from "@/types/post";
import { ArrowLeft, ArrowRight, BadgeCheck, CalendarDays, Clock3, Eye, Stethoscope } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: { slug: string };
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/public/blogs/${slug}`, { next: { revalidate: 60 } });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

async function getRelatedPosts(excludeSlug: string): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/public/blogs?size=6&sort=publishedAt,desc`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const data = await response.json();
    return (data.content || []).filter((post: BlogPost) => post.slug !== excludeSlug).slice(0, 3);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      publishedTime: post.publishedAt,
      authors: [SITE.doctor],
      images: post.coverImage ? [{ url: post.coverImage, alt: post.coverImageAlt || post.title }] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const post = await getPost(params.slug);
  if (!post) notFound();
  const related = await getRelatedPosts(post.slug);
  const { html: articleContent, headings } = buildTableOfContents(post.content || "");
  const date = post.publishedAt
    ? new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(post.publishedAt))
    : "Mới cập nhật";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    inLanguage: "vi-VN",
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
    author: { "@type": "Person", name: DOCTOR_INFO.name },
    publisher: { "@type": "Organization", name: SITE.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <main className="min-h-screen bg-white">
        <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-cyan-50/80 to-white">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-5 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-cyan-800">
              <ArrowLeft size={17} /> Tất cả bài viết
            </Link>

            <div className="mt-10 text-center">
              <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1.5 text-xs font-bold text-cyan-800">{post.category}</span>
              <h1 className="mx-auto mt-5 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              {post.excerpt && <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{post.excerpt}</p>}

              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-500">
                <span className="flex items-center gap-2"><CalendarDays size={16} /> {date}</span>
                <span className="flex items-center gap-2"><Clock3 size={16} /> {post.readingTime || 1} phút đọc</span>
                <span className="flex items-center gap-2"><Eye size={16} /> {(post.viewCount || 0).toLocaleString("vi-VN")} lượt xem</span>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          {post.coverImage && (
            <div className="relative -mt-1 aspect-[16/8] overflow-hidden rounded-2xl bg-slate-100 shadow-xl shadow-slate-200/60 sm:rounded-3xl">
              <Image
                src={post.coverImage}
                alt={post.coverImageAlt || post.title}
                fill
                priority
                className="object-cover"
                style={{ objectPosition: `${post.coverPositionX ?? 50}% ${post.coverPositionY ?? 50}%` }}
                sizes="(max-width: 1280px) 100vw, 1152px"
              />
            </div>
          )}

          <div className="mx-auto grid max-w-5xl gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_240px] lg:py-16">
            <div className="min-w-0">
              {headings.length >= 2 && (
                <nav aria-label="Mục lục bài viết" className="mb-10 rounded-2xl border border-cyan-100 bg-cyan-50/60 p-5 sm:p-6">
                  <p className="font-bold text-slate-900">Nội dung bài viết</p>
                  <ol className="mt-3 space-y-2 text-sm">
                    {headings.map((heading) => (
                      <li key={heading.id} className={heading.level === 3 ? "ml-5" : ""}>
                        <a href={`#${heading.id}`} className="text-cyan-800 hover:underline">{heading.text}</a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              <article
                className="prose prose-lg prose-slate max-w-none
                  prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-950
                  prose-h2:mt-12 prose-h2:border-l-4 prose-h2:border-cyan-600 prose-h2:pl-4 prose-h2:text-2xl
                  prose-h3:mt-9 prose-h3:text-xl
                  prose-p:leading-8 prose-p:text-slate-700
                  prose-a:font-semibold prose-a:text-cyan-700 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-slate-900
                  prose-li:my-1.5 prose-li:text-slate-700
                  prose-img:rounded-2xl prose-img:border prose-img:border-slate-100 prose-img:shadow-lg
                  prose-blockquote:rounded-r-xl prose-blockquote:border-cyan-500 prose-blockquote:bg-cyan-50 prose-blockquote:px-6 prose-blockquote:py-3 prose-blockquote:not-italic prose-blockquote:text-slate-700
                  prose-table:overflow-hidden prose-table:rounded-xl prose-table:border prose-table:border-slate-200
                  prose-th:bg-slate-50 prose-th:px-4 prose-th:py-3 prose-td:px-4 prose-td:py-3"
                dangerouslySetInnerHTML={{ __html: articleContent }}
              />

              {post.tags && (
                <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-7">
                  {post.tags.split(",").filter(Boolean).map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">#{tag.trim().replace(/^#/, "")}</span>
                  ))}
                </div>
              )}

              <div className="mt-12 overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-amber-50 to-cyan-50 p-7 shadow-lg shadow-orange-100/50 sm:p-9">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-orange-600">Cần tư vấn riêng cho bé?</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">Đặt lịch trao đổi cùng bác sĩ</h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Mỗi trẻ có thể trạng khác nhau. Bác sĩ sẽ thăm khám và đưa ra hướng chăm sóc phù hợp.</p>
                  </div>
                  <Link href="/#dat-lich" className="inline-flex flex-none items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600">
                    Đặt lịch ngay <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-800"><Stethoscope size={22} /></div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-cyan-700">Người biên soạn</p>
                <p className="mt-2 font-bold leading-6 text-slate-900">{DOCTOR_INFO.name}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">Bác sĩ Nhi khoa</p>
                <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-4 text-xs font-semibold text-slate-500">
                  <BadgeCheck size={16} className="text-cyan-700" /> Nội dung chuyên môn
                </div>
              </div>
            </aside>
          </div>
        </div>

        {related.length > 0 && (
          <section className="border-t border-slate-200 bg-slate-50 py-16">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-cyan-700">Đọc thêm</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Bài viết liên quan</h2>
                </div>
                <Link href="/blog" className="hidden items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-900 sm:flex">Xem tất cả <ArrowRight size={16} /></Link>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => <BlogCard key={item.slug} post={item} />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <ChatbotButton />
    </>
  );
}

function buildTableOfContents(content: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  const used = new Map<string, number>();
  const html = content.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (_match, level, attributes, innerHtml) => {
    const text = innerHtml.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
    let base = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      .replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "noi-dung";
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    if (count) base = `${base}-${count + 1}`;
    headings.push({ id: base, text, level: Number(level) });
    const cleanAttributes = String(attributes).replace(/\s+id=(["']).*?\1/i, "");
    return `<h${level}${cleanAttributes} id="${base}">${innerHtml}</h${level}>`;
  });
  return { html, headings };
}

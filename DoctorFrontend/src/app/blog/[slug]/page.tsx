import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { ChatbotButton } from "@/components/chatbot/ChatbotButton";
import { MOCK_POSTS } from "@/constants/posts";
import { DOCTOR_INFO } from "@/constants/doctor";
import { SITE, absoluteUrl } from "@/lib/site";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return MOCK_POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = MOCK_POSTS.find((p) => p.slug === params.slug);
  if (!post) return {};
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [SITE.doctor],
      images: [{ url: post.coverImage, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default function BlogDetailPage({ params }: PageProps) {
  const post = MOCK_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: "vi-VN",
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
    author: { "@type": "Person", name: DOCTOR_INFO.name },
    publisher: { "@type": "Organization", name: SITE.name },
  };

  const related = MOCK_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);
  const date = new Date(post.publishedAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Navbar />
      <main>
        {/* Article hero */}
        <section className="pt-12 pb-12" style={{ backgroundColor: "var(--color-surface)" }}>
          <div className="container max-w-4xl">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 flex-wrap">
                <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm hover:underline" style={{ color: "var(--color-text-secondary)" }}>
                  <ArrowLeft size={15} aria-hidden /> Tất cả bài viết
                </Link>
                <span style={{ color: "var(--color-border)" }}>·</span>
                <span
                  className="px-3 py-1 rounded-[var(--radius-full)] text-xs font-semibold"
                  style={{ backgroundColor: "var(--color-primary)", color: "white" }}
                >
                  {post.category}
                </span>
              </div>

              <h1
                className="font-display font-bold text-balance"
                style={{ fontSize: "var(--text-3xl)", color: "var(--color-text)", lineHeight: 1.15 }}
              >
                {post.title}
              </h1>

              {/* Author bar */}
              <div className="flex items-center gap-4 pt-2">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  BS
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                    {DOCTOR_INFO.name}
                  </span>
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {date} · {post.readingTime} phút đọc
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cover image placeholder */}
        <div
          className="w-full"
          style={{
            height: "320px",
            background: "linear-gradient(135deg, var(--color-surface) 0%, var(--color-primary-light) 60%, rgba(201,168,76,0.12) 100%)",
          }}
        />

        {/* Article content */}
        <section className="py-16" style={{ backgroundColor: "var(--color-bg)" }}>
          <div className="container max-w-3xl">
            <p
              className="text-lg leading-relaxed mb-8 font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {post.excerpt}
            </p>

            <div
              className="prose-content flex flex-col gap-6"
              style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-base)", lineHeight: 1.8 }}
            >
              {post.content.trim().split("\n\n").map((block, i) => {
                if (block.startsWith("## ")) {
                  return (
                    <h2
                      key={i}
                      className="font-display font-bold mt-6"
                      style={{ fontSize: "var(--text-2xl)", color: "var(--color-text)" }}
                    >
                      {block.replace("## ", "")}
                    </h2>
                  );
                }
                if (block.startsWith("### ")) {
                  return (
                    <h3
                      key={i}
                      className="font-display font-semibold mt-4"
                      style={{ fontSize: "var(--text-xl)", color: "var(--color-text)" }}
                    >
                      {block.replace("### ", "")}
                    </h3>
                  );
                }
                if (block.startsWith("- ")) {
                  const items = block.split("\n").filter((l) => l.startsWith("- "));
                  return (
                    <ul key={i} className="flex flex-col gap-2 pl-5">
                      {items.map((item, j) => (
                        <li key={j} className="text-sm list-disc" style={{ color: "var(--color-text-secondary)" }}>
                          {item.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "$1")}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (block.match(/^\d\./)) {
                  const items = block.split("\n").filter((l) => l.match(/^\d/));
                  return (
                    <ol key={i} className="flex flex-col gap-2 pl-5">
                      {items.map((item, j) => (
                        <li key={j} className="text-sm list-decimal" style={{ color: "var(--color-text-secondary)" }}>
                          {item.replace(/^\d\. /, "").replace(/\*\*(.*?)\*\*/g, "$1")}
                        </li>
                      ))}
                    </ol>
                  );
                }
                return block.trim() ? (
                  <p key={i} className="text-sm leading-relaxed">
                    {block.trim()}
                  </p>
                ) : null;
              })}
            </div>

            {/* CTA */}
            <div
              className="mt-12 rounded-[var(--radius-xl)] p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
              style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <div>
                <p className="font-display font-semibold" style={{ color: "var(--color-text)" }}>
                  Cần tư vấn thêm?
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                  Đặt lịch khám trực tiếp để được tư vấn cụ thể cho bé.
                </p>
              </div>
              <Link
                href="/#dat-lich"
                className="shrink-0 inline-flex items-center gap-1.5 px-6 py-3 rounded-[var(--radius-full)] text-sm font-medium transition-all duration-[var(--duration-normal)]"
                style={{ backgroundColor: "var(--color-primary)", color: "white" }}
              >
                Đặt lịch khám <ArrowRight size={15} aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="pb-20" style={{ backgroundColor: "var(--color-bg)" }}>
            <div className="container max-w-4xl">
              <h2
                className="font-display font-bold mb-8"
                style={{ fontSize: "var(--text-2xl)", color: "var(--color-text)" }}
              >
                Bài viết liên quan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {related.map((p) => (
                  <BlogCard key={p.slug} post={p} />
                ))}
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

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { ChatbotButton } from "@/components/chatbot/ChatbotButton";
import { DOCTOR_INFO } from "@/constants/doctor";
import { SITE, absoluteUrl } from "@/lib/site";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

async function getPost(slug: string) {
  try {
    const res = await fetch(`http://localhost:8080/api/public/blogs/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}

async function getRelatedPosts(excludeSlug: string) {
  try {
    const res = await fetch("http://localhost:8080/api/public/blogs", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const posts = data.content || [];
    return posts.filter((p: any) => p.slug !== excludeSlug).slice(0, 3); // Tăng lên 3 bài
  } catch (error) {
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
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.slug);
  
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

  const date = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "numeric",
        year: "numeric",
      }).replace(/\//g, '.')
    : "";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <main className="bg-white min-h-screen">
        
        {/* Breadcrumb & Article Header */}
        <section className="pt-12 pb-6 max-w-[1000px] mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#17a2b8] transition-colors font-medium">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#17a2b8] transition-colors font-medium">
              Blog Kiến thức Y khoa
            </Link>
            <span>/</span>
            <span className="text-gray-400 truncate max-w-[200px] md:max-w-[400px]">{post.title}</span>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="text-gray-400">{date}</span>
              <span className="px-3 py-0.5 border border-[#17a2b8] text-[#17a2b8] rounded-sm">
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-[2.5rem] font-bold text-gray-900 leading-[1.3]">
              {post.title}
            </h1>

            {/* Gradient Line */}
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-purple-400 to-[#17a2b8] my-2"></div>

            {/* Author Info */}
            <div className="flex items-center gap-4 py-4 mt-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-600 font-bold text-lg">
                BS
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900">{DOCTOR_INFO.name}</span>
                <span className="text-sm text-gray-500">
                  {post.readingTime || 5} phút đọc · {post.viewCount || 0} lượt xem
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Cover image (optional for this minimal style, but we'll show it if exists) */}
        {post.coverImage && (
          <section className="max-w-[1000px] mx-auto px-6 lg:px-8 mb-12">
            <div
              className="w-full bg-cover bg-center rounded-xl overflow-hidden shadow-sm border border-gray-100"
              style={{
                height: "400px",
                backgroundImage: `url(${post.coverImage})`,
              }}
            />
          </section>
        )}

        {/* Article content */}
        <section className="pb-16 max-w-[1000px] mx-auto px-6 lg:px-8">
          {post.excerpt && (
            <p className="text-lg leading-relaxed mb-10 text-gray-600 font-medium">
              {post.excerpt}
            </p>
          )}

          <article
            className="prose prose-lg max-w-none 
              prose-headings:font-bold prose-headings:text-gray-900 
              prose-p:text-gray-700 prose-p:leading-[1.7] prose-p:mb-4
              prose-a:text-[#17a2b8] prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-sm prose-img:border prose-img:border-gray-100 prose-img:my-8
              prose-ul:my-4 prose-li:text-gray-700 prose-li:my-1
              /* Raccoon Tech Blog Styles */
              prose-h2:bg-[#17a2b8] prose-h2:text-white prose-h2:px-5 prose-h2:py-3 prose-h2:mt-10 prose-h2:mb-5 prose-h2:rounded-sm prose-h2:text-2xl
              prose-h3:border-l-4 prose-h3:border-[#17a2b8] prose-h3:pl-4 prose-h3:py-1 prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-xl
              prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:bg-gray-50 prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:not-italic prose-blockquote:text-gray-600
            "
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />

          {/* Tags */}
          {post.tags && (
            <div className="mt-16 flex items-center flex-wrap gap-2 pt-6 border-t border-gray-100">
              <span className="font-semibold text-gray-900 mr-2">Tags:</span>
              {post.tags.split(",").map((tag: string, idx: number) => (
                <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-sm text-sm hover:bg-gray-200 transition-colors cursor-pointer">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 bg-gray-50 border border-gray-100 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-bold text-xl text-gray-900">
                Cần tư vấn thêm cho bé?
              </p>
              <p className="text-gray-600 mt-2">
                Hãy đặt lịch khám trực tiếp với ThS.BS Phương Thảo để được chẩn đoán và tư vấn phác đồ điều trị hiệu quả nhất.
              </p>
            </div>
            <Link
              href="/#dat-lich"
              className="shrink-0 bg-[#17a2b8] hover:bg-[#138496] text-white px-8 py-3.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-2"
            >
              Đặt lịch ngay <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="py-20 bg-gray-50 border-t border-gray-100">
            <div className="container max-w-7xl px-6 lg:px-8">
              <h2 className="text-2xl font-bold mb-10 text-center text-gray-900">
                Bài viết liên quan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((p: any) => (
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

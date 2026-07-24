import { BlogListing } from "@/components/blog/BlogListing";
import { ChatbotButton } from "@/components/chatbot/ChatbotButton";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { API_BASE_URL } from "@/lib/blog-api";
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Kiến thức chăm sóc trẻ — Bác sĩ Nhi Đà Nẵng",
  description:
    "Bài viết về dinh dưỡng, tiêm chủng, hô hấp và chăm sóc sức khỏe trẻ em được biên soạn bởi bác sĩ Nhi khoa.",
  alternates: { canonical: "/blog" },
};

async function getPosts() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/public/blogs?size=30&sort=publishedAt,desc`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.content || [];
  } catch {
    return [];
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const posts = await getPosts();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">
        <section className="relative overflow-hidden border-b border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-orange-50">
          <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />

          <div className="mx-auto max-w-7xl px-5 pb-14 pt-6 sm:px-6 lg:px-8 lg:pb-20">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-cyan-700"
            >
              <ArrowLeft size={17} /> Về trang chủ
            </Link>

            <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
              <div className="relative z-10">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1.5 text-sm font-semibold text-cyan-800 shadow-sm backdrop-blur">
                  <BadgeCheck size={16} /> Kiến thức được bác sĩ biên soạn
                </div>
                <h1 className="max-w-3xl text-4xl font-bold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  Kiến thức y khoa
                  <span className="mt-2 block text-cyan-700">dễ hiểu cho cha mẹ</span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  Thông tin chăm sóc trẻ chính xác, thực tế và dễ áp dụng, giúp cha mẹ tự tin đồng hành cùng con mỗi ngày.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#bai-viet"
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-700/20 transition hover:-translate-y-0.5 hover:bg-cyan-800"
                  >
                    Khám phá bài viết <ArrowRight size={17} />
                  </a>
                  <Link
                    href="/#dat-lich"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-800"
                  >
                    Đặt lịch khám
                  </Link>
                </div>

                <div className="mt-9 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
                  <TrustItem icon={<ShieldCheck size={18} />} text="Thông tin tin cậy" />
                  <TrustItem icon={<BookOpen size={18} />} text={`${posts.length} bài hữu ích`} />
                  <div className="hidden sm:block">
                    <TrustItem icon={<BadgeCheck size={18} />} text="Dễ áp dụng" />
                  </div>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xl">
                <div className="absolute inset-8 rounded-[2.5rem] bg-cyan-200/50 blur-2xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-4 shadow-2xl shadow-cyan-900/10 backdrop-blur">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-cyan-100">
                    <Image
                      src="/hero-illustration.png"
                      alt="Bác sĩ tư vấn chăm sóc sức khỏe cho trẻ"
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 90vw, 42vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="bai-viet" className="scroll-mt-8 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <BlogListing posts={posts} initialQuery={searchParams?.q || ""} />
          </div>
        </section>
      </main>
      <Footer />
      <ChatbotButton />
    </>
  );
}

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white bg-white/70 px-3 py-2.5 text-xs font-semibold text-slate-600 shadow-sm">
      <span className="text-cyan-700">{icon}</span>
      {text}
    </div>
  );
}

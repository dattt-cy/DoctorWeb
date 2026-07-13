import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogListing } from "@/components/blog/BlogListing";
import { ChatbotButton } from "@/components/chatbot/ChatbotButton";
import { MOCK_POSTS } from "@/constants/posts";

export const metadata = {
  title: "Kiến thức chăm sóc trẻ — Bác sĩ Nhi Đà Nẵng",
  description:
    "Bài viết về dinh dưỡng, tiêm chủng, hô hấp và chăm sóc sức khỏe trẻ em từ ThS.BS. Nguyễn Thị Phương Thảo — Bác sĩ Nhi khoa tại Đà Nẵng.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Mini hero */}
        <section
          className="pt-12 pb-16"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <div className="container">
            <div className="flex flex-col gap-4 max-w-2xl">
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: "var(--color-accent)" }}
              >
                Kiến thức y khoa
              </span>
              <h1
                className="font-display font-bold text-balance"
                style={{ fontSize: "var(--text-3xl)", color: "var(--color-text)", lineHeight: 1.2 }}
              >
                Bài viết về sức khỏe trẻ em
              </h1>
              <p className="text-balance" style={{ fontSize: "var(--text-lg)", color: "var(--color-text-secondary)" }}>
                Những thông tin y khoa chính xác, dễ hiểu — giúp cha mẹ đồng hành tốt hơn cùng sự phát triển của con.
              </p>
            </div>
          </div>
        </section>

        {/* Listing */}
        <section className="py-16" style={{ backgroundColor: "var(--color-bg)" }}>
          <div className="container">
            <BlogListing posts={MOCK_POSTS} />
          </div>
        </section>
      </main>
      <Footer />
      <ChatbotButton />
    </>
  );
}

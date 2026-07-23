import { Footer } from "@/components/layout/Footer";
import { BlogListing } from "@/components/blog/BlogListing";
import { ChatbotButton } from "@/components/chatbot/ChatbotButton";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Kiến thức chăm sóc trẻ — Bác sĩ Nhi Đà Nẵng",
  description:
    "Bài viết về dinh dưỡng, tiêm chủng, hô hấp và chăm sóc sức khỏe trẻ em từ ThS.BS. Nguyễn Thị Phương Thảo — Bác sĩ Nhi khoa tại Đà Nẵng.",
  alternates: { canonical: "/blog" },
};

async function getPosts() {
  try {
    const res = await fetch("http://localhost:8080/api/public/blogs", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.content || [];
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <main className="bg-gray-50 min-h-screen">
        {/* Raccoon Tech Blog Style Hero */}
        <section className="bg-[#17a2b8] pt-8 pb-0 overflow-hidden relative font-sans">
          
          {/* Nút trở về trang chủ */}
          <Link 
            href="/" 
            className="absolute top-4 left-6 md:left-10 text-white/80 hover:text-white flex items-center gap-2 text-sm font-semibold z-30 transition-colors"
          >
            <span className="text-lg leading-none mb-1">&larr;</span> Trở về Trang chủ
          </Link>

          <div className="container max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between mt-6">
            {/* Left Content */}
            <div className="md:w-1/2 py-6 md:py-8 z-10">
              <h1 className="text-white font-black text-5xl md:text-6xl tracking-tighter mb-4 uppercase leading-[1.05] drop-shadow-sm">
                Kiến thức<br />Y Khoa
              </h1>
              <p className="text-white text-lg md:text-lg opacity-95 max-w-lg mb-6 leading-relaxed font-medium drop-shadow-sm">
                Những thông tin y khoa chính xác, dễ hiểu — được đội ngũ Bác sĩ biên soạn nhằm giúp cha mẹ đồng hành tốt hơn cùng con.
              </p>
              {/* Optional CTA Banner area similar to Raccoon */}
              <div className="inline-flex flex-col bg-white/15 hover:bg-white/25 transition-colors border border-white/30 rounded-md px-6 py-3 cursor-pointer backdrop-blur-sm shadow-sm">
                <span className="text-white text-xs opacity-90 font-bold tracking-wider uppercase mb-1">Cần tư vấn trực tiếp?</span>
                <span className="text-white text-base font-bold">Đặt lịch khám ngay &gt;</span>
              </div>
            </div>
            
            {/* Right Illustration */}
            <div className="md:w-1/2 flex justify-end relative h-[250px] md:h-[320px] w-full mt-4 md:mt-0 opacity-95">
              <Image 
                src="/hero-illustration.png" 
                alt="Medical Illustration" 
                fill
                className="object-contain object-right-bottom drop-shadow-xl"
                priority
              />
            </div>
          </div>
          
          {/* Black Sub-Nav Bar (Visual matching Raccoon) */}
          <div className="bg-[#222222] py-4 text-white w-full border-t border-white/10 relative z-20">
            <div className="container max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between text-sm font-medium">
               <div className="flex gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                 <span className="cursor-pointer text-[#17a2b8] font-bold">Tất cả bài viết</span>
                 <span className="cursor-pointer hover:text-[#17a2b8] text-gray-300 transition-colors">Dinh dưỡng</span>
                 <span className="cursor-pointer hover:text-[#17a2b8] text-gray-300 transition-colors">Tiêm chủng</span>
                 <span className="cursor-pointer hover:text-[#17a2b8] text-gray-300 transition-colors">Hô hấp</span>
                 <span className="cursor-pointer hover:text-[#17a2b8] text-gray-300 transition-colors flex items-center gap-1">
                   <span className="text-xs">⛶</span> Danh mục khác
                 </span>
               </div>
               <div className="hidden md:flex relative ml-8 shrink-0">
                 <input 
                    type="text" 
                    placeholder="Tìm kiếm..."
                    className="rounded-full bg-[#333333] px-4 py-1.5 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-[#17a2b8] w-56 border-none" 
                 />
                 <span className="absolute right-3 top-1.5 text-gray-400 text-sm">🔍</span>
               </div>
            </div>
          </div>
        </section>

        {/* Listing */}
        <section className="py-16">
          <div className="container max-w-7xl">
            <BlogListing posts={posts} />
          </div>
        </section>
      </main>
      <Footer />
      <ChatbotButton />
    </>
  );
}

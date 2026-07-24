import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactSection } from "@/components/sections/ContactSection";
import { ChatbotButton } from "@/components/chatbot/ChatbotButton";
import { AppointmentForm } from "@/components/appointment/AppointmentForm";

export const metadata = {
  title: "Liên hệ & Đặt lịch — ThS.BS. Nguyễn Thị Phương Thảo",
  description: "Đặt lịch khám hoặc gửi câu hỏi cho ThS.BS. Nguyễn Thị Phương Thảo, Bác sĩ Nhi khoa — Phòng khám 522 Phạm Hùng, Hòa Xuân, Cẩm Lệ, Đà Nẵng.",
  alternates: { canonical: "/lien-he" },
};

export default function LienHePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Mini hero */}
        <section className="pt-12 pb-0" style={{ backgroundColor: "var(--color-surface)" }}>
          <div className="container pb-16">
            <div className="flex flex-col gap-4 max-w-xl">
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: "var(--color-accent)" }}
              >
                Liên hệ
              </span>
              <h1
                className="font-display font-bold text-balance"
                style={{ fontSize: "var(--text-3xl)", color: "var(--color-text)", lineHeight: 1.2 }}
              >
                Đặt lịch khám hoặc gửi câu hỏi
              </h1>
              <p className="text-balance" style={{ fontSize: "var(--text-lg)", color: "var(--color-text-secondary)" }}>
                Tôi sẽ phản hồi trong vòng 24 giờ. Không có câu hỏi nào là nhỏ khi liên quan đến sức khỏe của con bạn.
              </p>
            </div>
          </div>
        </section>
        <AppointmentForm />
        <ContactSection />
      </main>
      <Footer />
      <ChatbotButton />
    </>
  );
}

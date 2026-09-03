import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { CredentialStrip } from "@/components/sections/CredentialStrip";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { BlogPreviewSection } from "@/components/sections/BlogPreviewSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ChatbotButton } from "@/components/chatbot/ChatbotButton";
import { ClinicJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: { absolute: "NhiVita – Bác sĩ Nhi Hòa Xuân, Đà Nẵng" },
  description:
    "Khám Nhi tại 522 Phạm Hùng, Hòa Xuân, Cẩm Lệ, Đà Nẵng cùng ThS.BS. Nguyễn Thị Phương Thảo. Đặt lịch tư vấn hô hấp, tiêu hóa, dinh dưỡng: 0919.083.332.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <ClinicJsonLd />
      <Navbar />
      <main>
        <HeroSection />
        <CredentialStrip />
        <AboutSection />
        <ServicesSection />
        <BlogPreviewSection />
        <ContactSection />
      </main>
      <Footer />
      <ChatbotButton />
    </>
  );
}

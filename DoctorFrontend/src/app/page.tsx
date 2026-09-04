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
  title: { absolute: "Phòng khám Nhi Hòa Xuân, Cẩm Lệ | NhiVita" },
  description:
    "Phòng khám Nhi ngoài giờ tại 522 Phạm Hùng, Hòa Xuân, Cẩm Lệ, Đà Nẵng. ThS.BS. Nguyễn Thị Phương Thảo khám hô hấp, tiêu hóa, da liễu, dị ứng, tai mũi họng và dinh dưỡng trẻ em.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Phòng khám Nhi Hòa Xuân, Cẩm Lệ | NhiVita",
    description: "Khám Nhi ngoài giờ tại 522 Phạm Hùng, Hòa Xuân, Cẩm Lệ, Đà Nẵng cùng ThS.BS. Nguyễn Thị Phương Thảo.",
    url: "/",
    type: "website",
  },
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

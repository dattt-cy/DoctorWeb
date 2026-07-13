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

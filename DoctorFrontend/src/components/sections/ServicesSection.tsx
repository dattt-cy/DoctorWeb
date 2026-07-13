import { ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SERVICES } from "@/constants/services";
import type { Service } from "@/types/service";

const ServiceIcon = ({ type }: { type: string }) => {
  const icons: Record<string, React.ReactNode> = {
    stethoscope: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
      </svg>
    ),
    nutrition: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
        <path d="M12 2a10 10 0 0 1 10 10" />
        <path d="M12 12 2.1 12.4" />
      </svg>
    ),
    vaccine: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 2 4 4" />
        <path d="m17 7 3-3" />
        <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
        <path d="m9 11 4 4" />
        <path d="m5 19-3 3" />
        <path d="m14 4 6 6" />
      </svg>
    ),
    lungs: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.081 20C4.154 20 2.5 18.33 2.5 16.4v-4.7C2.5 8.83 4.43 6.3 7 5l4-1.5" />
        <path d="M17.919 20C19.845 20 21.5 18.33 21.5 16.4v-4.7C21.5 8.83 19.569 6.3 17 5l-4-1.5" />
        <path d="M12 3.5v11" />
        <path d="M6 20v-8a6 6 0 0 1 6-6" />
        <path d="M18 20v-8a6 6 0 0 0-6-6" />
      </svg>
    ),
    brain: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
      </svg>
    ),
    growth: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  };
  return <>{icons[type] ?? icons.stethoscope}</>;
};

interface ServiceCardProps {
  service: Service;
}

function ServiceCard({ service }: ServiceCardProps) {
  const isFeatured = service.featured;
  const isWide = service.size === "wide";

  return (
    <div
      className={`
        group relative flex flex-col gap-5 p-7 rounded-[var(--radius-xl)]
        transition-all duration-[var(--duration-normal)]
        hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] cursor-default
        ${isFeatured ? "col-span-1 md:col-span-2 row-span-2" : ""}
        ${isWide ? "col-span-1 md:col-span-2" : ""}
      `}
      style={{
        backgroundColor: isFeatured ? "var(--color-primary)" : "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center"
        style={{
          backgroundColor: isFeatured ? "rgba(255,255,255,0.15)" : "var(--color-primary-light)",
          color: isFeatured ? "white" : "var(--color-primary)",
        }}
      >
        <ServiceIcon type={service.icon} />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-2">
        <h3
          className="font-display font-semibold"
          style={{
            fontSize: isFeatured ? "var(--text-2xl)" : "var(--text-lg)",
            color: isFeatured ? "white" : "var(--color-text)",
          }}
        >
          {service.title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: isFeatured ? "rgba(255,255,255,0.75)" : "var(--color-text-secondary)" }}
        >
          {service.description}
        </p>
      </div>

      {/* Hover arrow */}
      <div
        className="absolute bottom-7 right-7 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-fast)]"
        style={{ color: isFeatured ? "rgba(255,255,255,0.7)" : "var(--color-primary)" }}
      >
        <ArrowRight size={20} aria-hidden />
      </div>

      {/* Accent bar for featured */}
      {isFeatured && (
        <div
          className="absolute top-7 right-7 w-8 h-8 rounded-full opacity-30"
          style={{ backgroundColor: "var(--color-accent)" }}
          aria-hidden
        />
      )}
    </div>
  );
}

export function ServicesSection() {
  return (
    <section
      id="chuyen-mon"
      className="py-[var(--space-section)]"
      style={{ backgroundColor: "var(--color-surface-alt)" }}
    >
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <SectionTitle
            eyebrow="Chuyên môn"
            title="Lĩnh vực tôi có thể giúp bé"
            subtitle="Từ khám tổng quát đến các vấn đề chuyên sâu, tôi đồng hành cùng gia đình bạn ở mỗi bước."
            className="max-w-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-auto">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

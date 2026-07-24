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
  index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
  const isFeatured = service.featured;

  return (
    <div
      className={`
        group relative flex min-h-[260px] flex-col overflow-hidden rounded-3xl p-7
        transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-hover)]
        ${isFeatured ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white" : "bg-white"}
      `}
      style={{
        border: isFeatured ? "1px solid rgba(255,255,255,.18)" : "1px solid var(--color-border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
            isFeatured ? "bg-white/15 text-white" : "bg-orange-50 text-orange-600"
          }`}
        >
          <ServiceIcon type={service.icon} />
        </div>
        <span className={`text-xs font-bold tracking-[0.16em] ${isFeatured ? "text-white/55" : "text-slate-300"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-7 flex flex-1 flex-col">
        <h3 className={`text-xl font-bold ${isFeatured ? "text-white" : "text-slate-950"}`}>
          {service.title}
        </h3>
        <p className={`mt-3 text-sm leading-6 ${isFeatured ? "text-white/80" : "text-slate-500"}`}>
          {service.description}
        </p>
        <div className={`mt-auto flex items-center justify-between pt-6 text-sm font-bold ${
          isFeatured ? "text-white" : "text-orange-600"
        }`}>
          <span>Tìm hiểu dịch vụ</span>
          <span className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1 ${
            isFeatured ? "bg-white/15" : "bg-orange-50"
          }`}>
            <ArrowRight size={17} aria-hidden />
          </span>
        </div>
      </div>

      {isFeatured && (
        <>
          <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full border-[28px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-20 -left-12 h-44 w-44 rounded-full bg-white/5" />
        </>
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
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            eyebrow="Chuyên môn"
            title="Lĩnh vực tôi có thể giúp bé"
            subtitle="Từ khám tổng quát đến các vấn đề chuyên sâu, tôi đồng hành cùng gia đình bạn ở mỗi bước."
            className="max-w-lg"
          />
          <div className="hidden max-w-xs rounded-2xl border border-orange-100 bg-white px-5 py-4 text-sm leading-6 text-slate-500 shadow-sm md:block">
            Mỗi trẻ có một thể trạng riêng. Bác sĩ sẽ tư vấn hướng chăm sóc phù hợp sau khi thăm khám.
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

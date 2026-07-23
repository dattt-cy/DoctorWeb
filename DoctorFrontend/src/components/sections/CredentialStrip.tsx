"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, GraduationCap, School, Building2 } from "lucide-react";
import { DOCTOR_INFO } from "@/constants/doctor";

const credentials = [
  {
    Icon: Clock,
    value: `${DOCTOR_INFO.yearsExperience}+`,
    label: "Năm kinh nghiệm",
    sub: "Thực hành lâm sàng nhi khoa",
  },
  {
    Icon: GraduationCap,
    value: "ThS.BS",
    label: "Học vị",
    sub: "Thạc sĩ – Bác sĩ Y khoa",
  },
  {
    Icon: School,
    value: "ĐH Y Dược Huế",
    label: "Tốt nghiệp",
    sub: "Đại học Y Dược Huế",
  },
  {
    Icon: Building2,
    value: "BV Phụ Sản–Nhi ĐN",
    label: "Nơi công tác",
    sub: "Bệnh viện Phụ Sản – Nhi Đà Nẵng",
  },
];

export function CredentialStrip() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Thành tích và chứng nhận"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      {/* top border */}
      <div style={{ height: 1, backgroundColor: "var(--color-border)" }} />

      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {credentials.map(({ Icon, value, label, sub }, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center text-center gap-2 px-6 py-10"
              style={{
                borderRight: i < credentials.length - 1
                  ? "1px solid var(--color-border)"
                  : "none",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(14px)",
                transition: `opacity 0.45s ease ${i * 0.08}s, transform 0.45s ease ${i * 0.08}s`,
              }}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center w-9 h-9 rounded-lg mb-1"
                style={{
                  backgroundColor: "var(--color-primary-light)",
                }}
              >
                <Icon size={17} style={{ color: "var(--color-primary)" }} aria-hidden />
              </div>

              {/* Big value */}
              <span
                className="font-display font-bold leading-none"
                style={{
                  fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)",
                  color: "var(--color-text)",
                  letterSpacing: "-0.02em",
                }}
              >
                {value}
              </span>

              {/* Label */}
              <span
                className="text-[11px] font-bold uppercase tracking-widest"
                style={{ color: "var(--color-primary)", letterSpacing: "0.14em" }}
              >
                {label}
              </span>

              {/* Sub */}
              <span
                className="text-xs leading-snug"
                style={{ color: "var(--color-text-muted)", maxWidth: "16ch" }}
              >
                {sub}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* bottom border */}
      <div style={{ height: 1, backgroundColor: "var(--color-border)" }} />
    </section>
  );
}

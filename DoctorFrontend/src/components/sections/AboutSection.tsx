import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Phone } from "lucide-react";
import { DOCTOR_INFO } from "@/constants/doctor";

const clinicalPhotos = [
  {
    src: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=80&auto=format&fit=crop",
    alt: "Bác sĩ thăm khám trẻ em",
  },
  {
    src: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600&q=80&auto=format&fit=crop",
    alt: "Hội thảo chuyên môn Nhi khoa",
  },
  {
    src: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80&auto=format&fit=crop",
    alt: "Phòng khám Nhi hiện đại",
  },
];

export function AboutSection() {
  return (
    <section id="ve-toi" className="py-[var(--space-section)]" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="container">

        {/* Top label */}
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase mb-8"
          style={{ color: "var(--color-accent)" }}
        >
          Giới thiệu bác sĩ
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-12 lg:gap-20 items-start">

          {/* Left: Main portrait */}
          <div className="flex flex-col gap-5">
            <div
              className="relative w-full rounded-[var(--radius-xl)] overflow-hidden"
              style={{
                aspectRatio: "3 / 4",
                border: "1px solid var(--color-border)",
                boxShadow: "0 20px 60px rgba(232,112,42,0.15)",
              }}
            >
              <Image
                src={DOCTOR_INFO.photoAbout}
                alt={DOCTOR_INFO.photoAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 420px"
                priority
              />
              {/* Accent bottom bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
            </div>

            {/* 3 clinical photos strip */}
            <div className="grid grid-cols-3 gap-3">
              {clinicalPhotos.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] rounded-[var(--radius-md)] overflow-hidden"
                  style={{ border: "1px solid var(--color-border)" }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="140px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Bio content */}
          <div className="flex flex-col gap-8">

            {/* Name + credentials */}
            <div className="flex flex-col gap-2">
              <h2
                className="font-display font-bold"
                style={{ fontSize: "var(--text-3xl)", color: "var(--color-text)", lineHeight: 1.15 }}
              >
                {DOCTOR_INFO.name}
              </h2>
              <p
                className="font-semibold"
                style={{ fontSize: "var(--text-lg)", color: "var(--color-primary)" }}
              >
                {DOCTOR_INFO.specialty} — {DOCTOR_INFO.title}
              </p>
            </div>

            {/* Current positions */}
            <div className="flex flex-col gap-3">
              <p
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--color-text-muted)" }}
              >
                Chức vụ hiện tại
              </p>
              <ul className="flex flex-col gap-2.5">
                {DOCTOR_INFO.currentPositions.map((pos, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle
                      size={16}
                      className="shrink-0 mt-0.5"
                      style={{ color: "var(--color-primary)" }}
                      aria-hidden
                    />
                    <span className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                      {pos}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bio */}
            <div
              className="rounded-[var(--radius-lg)] p-6"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <p
                className="text-sm leading-[1.9]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {DOCTOR_INFO.bio}
              </p>
              <p
                className="text-sm leading-[1.9] mt-4"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Tốt nghiệp Tiến sĩ Y khoa tại Đại học Y Hà Nội năm 2008, tôi đã dành hơn 15 năm nghiên cứu và điều trị chuyên sâu về các bệnh lý Nhi khoa. Ngoài công tác khám chữa bệnh, tôi còn tích cực tham gia giảng dạy và nghiên cứu khoa học, góp phần nâng cao chất lượng y tế nhi khoa tại Việt Nam.
              </p>
            </div>

            {/* Education timeline */}
            <div className="flex flex-col gap-1">
              <p
                className="text-xs font-semibold uppercase tracking-[0.15em] mb-3"
                style={{ color: "var(--color-text-muted)" }}
              >
                Quá trình đào tạo & công tác
              </p>
              {DOCTOR_INFO.education.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-5 py-3.5"
                  style={{
                    borderBottom: i < DOCTOR_INFO.education.length - 1 ? "1px solid var(--color-border)" : "none",
                  }}
                >
                  <span
                    className="text-xs font-bold shrink-0 w-24"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {item.year}
                  </span>
                  <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    {item.description}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA row */}
            <div className="flex items-center gap-4 flex-wrap pt-2">
              <Link
                href="/#dat-lich"
                className="inline-flex items-center justify-center px-6 py-3 rounded-[var(--radius-md)] text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Đặt lịch khám
              </Link>
              <a
                href={`tel:${DOCTOR_INFO.phone}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                <Phone size={15} aria-hidden /> {DOCTOR_INFO.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

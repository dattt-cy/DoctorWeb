import Link from "next/link";
import { DOCTOR_INFO } from "@/constants/doctor";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { VitaLogo } from "@/components/ui/VitaLogo";

const footerNav = [
  { label: "Về tôi", href: "/#ve-toi" },
  { label: "Dịch vụ phòng khám", href: "/#chuyen-mon" },
  { label: "Blog sức khoẻ", href: "/blog" },
  { label: "Liên hệ", href: "/#lien-he" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#1a1612", color: "#fff" }}>
      {/* Orange top accent bar */}
      <div style={{ height: "4px", backgroundColor: "var(--color-primary)" }} />

      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">

          {/* Col 1: Logo + tagline + social */}
          <div className="flex flex-col gap-5">
            {/* VITA Logo */}
            <VitaLogo theme="dark" />

            <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              {DOCTOR_INFO.tagline}
            </p>

            <div>
              <SocialIcons links={DOCTOR_INFO.socialLinks} size="md" theme="dark" />
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="flex flex-col gap-4">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase pb-2"
              style={{
                color: "var(--color-accent)",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Điều hướng
            </p>
            <nav className="flex flex-col gap-3">
              {footerNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base transition-colors duration-150 hover:text-white flex items-center gap-2 group"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  <span
                    className="w-4 h-px transition-all duration-200 group-hover:w-6"
                    style={{ backgroundColor: "var(--color-primary)", display: "inline-block" }}
                  />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: Contact + hours */}
          <div className="flex flex-col gap-4">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase pb-2"
              style={{
                color: "var(--color-accent)",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Liên hệ
            </p>
            <div className="flex flex-col gap-3 text-base">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.6)" }}>Địa chỉ</span>
                <span style={{ color: "rgba(255,255,255,0.85)" }}>{DOCTOR_INFO.address}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.6)" }}>Hotline</span>
                <a
                  href={`tel:${DOCTOR_INFO.phone}`}
                  className="hover:text-white transition-colors font-semibold"
                  style={{ color: "var(--color-accent)" }}
                >
                  {DOCTOR_INFO.phone}
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.6)" }}>Zalo</span>
                <a
                  href={DOCTOR_INFO.socialLinks.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors font-semibold"
                  style={{ color: "var(--color-accent)" }}
                >
                  {DOCTOR_INFO.phone}
                </a>
              </div>
            </div>

            {/* Giờ khám */}
            <div
              className="mt-1 rounded-xl px-4 py-3 flex flex-col gap-2"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-xs font-bold tracking-wider uppercase" style={{ color: "var(--color-accent)" }}>
                Giờ khám bệnh
              </p>
              <div className="flex flex-col gap-1.5 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                <div className="flex justify-between">
                  <span>Thứ 2 – Thứ 6</span>
                  <span className="font-semibold text-white">17:30 – 19:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Thứ 7 – CN (sáng)</span>
                  <span className="font-semibold text-white">9:00 – 11:30</span>
                </div>
                <div className="flex justify-between">
                  <span>Thứ 7 – CN (chiều)</span>
                  <span className="font-semibold text-white">15:00 – 18:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
        >
          <p>© {currentYear} {DOCTOR_INFO.clinicName ?? DOCTOR_INFO.name}. Bảo lưu mọi quyền.</p>
          <p>Website dành cho mục đích thông tin — không thay thế chẩn đoán y khoa.</p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { DOCTOR_INFO } from "@/constants/doctor";
import { SocialIcons } from "@/components/ui/SocialIcons";

const footerNav = [
  { label: "Về tôi", href: "#ve-toi" },
  { label: "Chuyên môn", href: "#chuyen-mon" },
  { label: "Blog", href: "/blog" },
  { label: "Liên hệ", href: "#lien-he" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)" }}>
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {/* Col 1: Logo + tagline */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                BS
              </div>
              <div>
                <p className="font-display font-semibold text-sm leading-tight">{DOCTOR_INFO.name}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {DOCTOR_INFO.specialty}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
              {DOCTOR_INFO.tagline}
            </p>
            <div className="pt-1">
              <SocialIcons links={DOCTOR_INFO.socialLinks} size="md" theme="dark" />
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
              Điều hướng
            </p>
            <nav className="flex flex-col gap-2">
              {footerNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm transition-colors duration-[var(--duration-fast)] hover:text-white"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: Contact + hours */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
              Liên hệ
            </p>
            <div className="flex flex-col gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              <p>{DOCTOR_INFO.address}</p>
              <p>Hotline: {DOCTOR_INFO.phone}</p>
              <p>Zalo: {DOCTOR_INFO.phone}</p>
            </div>
            <div className="pt-2 flex flex-col gap-1 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Giờ khám</p>
              <p>{DOCTOR_INFO.workingHours.weekdays}</p>
              <p>{DOCTOR_INFO.workingHours.saturday}</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.45)" }}
        >
          <p>© {currentYear} {DOCTOR_INFO.name}. Bảo lưu mọi quyền.</p>
          <p>Website dành cho mục đích thông tin — không thay thế chẩn đoán y khoa.</p>
        </div>
      </div>
    </footer>
  );
}

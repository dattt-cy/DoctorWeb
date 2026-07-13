import { MapPin, Phone, MessageCircle, Clock } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DOCTOR_INFO } from "@/constants/doctor";

const contactItems = [
  {
    Icon: MapPin,
    label: "Địa chỉ",
    value: DOCTOR_INFO.address,
    href: `https://maps.google.com/?q=${encodeURIComponent(DOCTOR_INFO.address)}`,
  },
  {
    Icon: Phone,
    label: "Điện thoại",
    value: DOCTOR_INFO.phone,
    href: `tel:${DOCTOR_INFO.phone}`,
  },
  {
    Icon: MessageCircle,
    label: "Zalo",
    value: DOCTOR_INFO.phone,
    href: DOCTOR_INFO.socialLinks.zalo,
  },
];

export function ContactSection() {
  return (
    <section
      id="lien-he"
      className="py-[var(--space-section)]"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="container">
        <SectionTitle
          eyebrow="Liên hệ"
          title="Thông tin phòng khám"
          subtitle="Đặt lịch qua form bên trên hoặc liên hệ trực tiếp theo thông tin dưới đây."
          className="mb-10"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Trái: Google Maps (3/5) */}
          <div
            className="lg:col-span-3 rounded-[var(--radius-xl)] overflow-hidden"
            style={{
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-card)",
              height: "420px",
            }}
          >
            <iframe
              title="Bản đồ vị trí phòng khám"
              src="https://www.google.com/maps?q=522+Pham+Hung+Hoa+Xuan+Da+Nang&hl=vi&z=16&output=embed"
              width="100%"
              height="420"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Phải: Contact details (2/5) */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Contact items */}
            <div
              className="rounded-[var(--radius-xl)] overflow-hidden"
              style={{
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-card)",
                backgroundColor: "var(--color-white)",
              }}
            >
              {contactItems.map(({ Icon, label, value, href }, i) => (
                <a
                  key={label}
                  href={href}
                  target={label === "Địa chỉ" || label === "Zalo" ? "_blank" : undefined}
                  rel={label === "Địa chỉ" || label === "Zalo" ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-4 px-6 py-5 transition-colors hover:bg-[var(--color-surface)] group"
                  style={{
                    borderBottom: i < contactItems.length - 1 ? "1px solid var(--color-border)" : "none",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 mt-0.5 transition-colors group-hover:bg-[var(--color-primary)]"
                    style={{ backgroundColor: "var(--color-primary-light)" }}
                  >
                    <Icon
                      size={18}
                      className="transition-colors group-hover:text-white"
                      style={{ color: "var(--color-primary)" }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {label}
                    </p>
                    <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Giờ khám */}
            <div
              className="rounded-[var(--radius-xl)] p-6"
              style={{
                backgroundColor: "var(--color-white)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} style={{ color: "var(--color-primary)" }} aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
                  Giờ khám bệnh
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { day: "Thứ 2 – Thứ 6", hours: "8:00 – 17:00", open: true },
                  { day: "Thứ 7", hours: "8:00 – 12:00", open: true },
                  { day: "Chủ nhật", hours: "Nghỉ", open: false },
                ].map(({ day, hours, open }, i, arr) => (
                  <div key={day}>
                    <div className="flex justify-between items-center text-sm">
                      <span style={{ color: "var(--color-text-secondary)" }}>{day}</span>
                      <span
                        className="font-medium"
                        style={{ color: open ? "var(--color-text)" : "var(--color-text-muted)" }}
                      >
                        {hours}
                      </span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="h-px mt-3" style={{ backgroundColor: "var(--color-border)" }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quote */}
            <blockquote
              className="px-5 py-4 rounded-[var(--radius-lg)]"
              style={{
                borderLeft: "3px solid var(--color-accent)",
                backgroundColor: "var(--color-white)",
                border: "1px solid var(--color-border)",
                borderLeftWidth: "3px",
                borderLeftColor: "var(--color-accent)",
              }}
            >
              <p className="text-sm italic leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                &ldquo;Đừng ngần ngại hỏi — không có câu hỏi nào là nhỏ khi liên quan đến sức khỏe của con bạn.&rdquo;
              </p>
              <footer className="mt-2 text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
                — {DOCTOR_INFO.name}
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

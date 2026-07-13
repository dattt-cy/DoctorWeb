import { Clock, GraduationCap, School, Building2 } from "lucide-react";
import { DOCTOR_INFO } from "@/constants/doctor";

const credentials = [
  { Icon: Clock, value: `${DOCTOR_INFO.yearsExperience}+`, label: "Năm kinh nghiệm" },
  { Icon: GraduationCap, value: "ThS.BS", label: "Học vị" },
  { Icon: School, value: "ĐH Y Dược Huế", label: "Tốt nghiệp" },
  { Icon: Building2, value: "BV Phụ Sản–Nhi ĐN", label: "Nơi công tác" },
];

export function CredentialStrip() {
  return (
    <section
      className="py-10"
      style={{ backgroundColor: "var(--color-primary)" }}
      aria-label="Thành tích và chứng nhận"
    >
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {credentials.map(({ Icon, value, label }, i) => (
            <div
              key={i}
              className="group flex flex-col items-center text-center gap-2 px-4 py-5 rounded-[var(--radius-lg)] transition-all duration-[var(--duration-normal)] hover:-translate-y-1"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <span
                className="flex items-center justify-center w-11 h-11 rounded-[var(--radius-md)] transition-colors"
                style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
              >
                <Icon size={20} className="text-white" aria-hidden />
              </span>
              <span
                className="font-display font-bold leading-tight"
                style={{ fontSize: "var(--text-lg)", color: "var(--color-white)" }}
              >
                {value}
              </span>
              <span
                className="text-[11px] uppercase tracking-[0.14em] leading-snug"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

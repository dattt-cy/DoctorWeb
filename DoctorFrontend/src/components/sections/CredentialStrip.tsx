import { Building2, Clock3, GraduationCap, School } from "lucide-react";

const credentials = [
  {
    Icon: Clock3,
    value: "10+ năm",
    label: "Kinh nghiệm Nhi khoa",
  },
  {
    Icon: GraduationCap,
    value: "Thạc sĩ – Bác sĩ",
    label: "Học vị chuyên môn",
  },
  {
    Icon: School,
    value: "Đại học Y Dược Huế",
    label: "Nơi đào tạo",
  },
  {
    Icon: Building2,
    value: "BV Phụ Sản – Nhi Đà Nẵng",
    label: "Nơi công tác",
  },
];

export function CredentialStrip() {
  return (
    <section
      aria-label="Kinh nghiệm và chuyên môn của bác sĩ"
      className="border-y border-stone-200 bg-[#faf7f4]"
    >
      <div className="container">
        <div className="grid grid-cols-2 py-7 lg:grid-cols-4 lg:py-8">
          {credentials.map(({ Icon, value, label }, index) => (
            <div
              key={value}
              className={`flex min-h-28 items-start gap-3 px-3 py-4 sm:px-6 lg:min-h-24 lg:items-center lg:py-0 ${
                index % 2 === 1 ? "border-l border-stone-200" : ""
              } ${index >= 2 ? "border-t border-stone-200 lg:border-t-0" : ""} ${
                index > 0 ? "lg:border-l lg:border-stone-200" : "lg:pl-0"
              }`}
            >
              <Icon className="mt-1 shrink-0 text-orange-600" size={19} strokeWidth={1.8} aria-hidden />
              <div className="min-w-0">
                <p className="text-base font-bold leading-6 tracking-[-0.02em] text-slate-950 sm:text-lg">
                  {value}
                </p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.1em] text-orange-700 sm:text-xs">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

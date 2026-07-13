"use client";

import { useState } from "react";
import Image from "next/image";
import { Hospital, Check } from "lucide-react";
import { DOCTOR_INFO } from "@/constants/doctor";

const stats = [
  { value: "10+", label: "Năm kinh nghiệm" },
  { value: "ThS.BS", label: "Học vị" },
  { value: "Hòa Xuân", label: "Đà Nẵng" },
];

interface AppointmentForm {
  name: string;
  phone: string;
  date: string;
  time: string;
  symptoms: string;
}

const INITIAL_FORM: AppointmentForm = {
  name: "",
  phone: "",
  date: "",
  time: "",
  symptoms: "",
};

export function HeroSection() {
  const [form, setForm] = useState<AppointmentForm>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const set = (field: keyof AppointmentForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const inputClass =
    "w-full px-3 py-2.5 text-base rounded-[var(--radius-sm)] transition-all duration-150 bg-white";
  const inputStyle = {
    border: "1px solid #d1d5db",
    color: "var(--color-text)",
    outline: "none",
  };
  const labelClass = "text-sm font-semibold";
  const labelStyle = { color: "var(--color-text)" };
  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "var(--color-primary)");
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "#d1d5db");

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "calc(100vh - 120px)" }}>
      {/* Background banner */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=85&auto=format&fit=crop"
          alt="Phòng khám Nhi Vita"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(184,71,20,0.7) 0%, rgba(207,95,31,0.5) 40%, rgba(232,112,42,0.22) 70%, rgba(232,112,42,0.05) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 container flex flex-col lg:flex-row items-stretch min-h-[calc(100vh-120px)]">
        {/* Left: Clinic info overlay */}
        <div className="flex-1 flex flex-col justify-center py-16 pr-0 lg:pr-10 gap-6">
          <div className="flex items-center gap-2">
            <span className="w-8 h-0.5 rounded-full" style={{ backgroundColor: "var(--color-accent)" }} />
            <span
              className="text-xs font-semibold tracking-[0.18em] uppercase"
              style={{ color: "#fff4e0" }}
            >
              {DOCTOR_INFO.specialty}
            </span>
          </div>

          <div>
            <h1
              className="font-display font-bold text-white leading-[1.1] text-balance"
              style={{ fontSize: "clamp(2.2rem, 1.6rem + 3vw, 4rem)" }}
            >
              PHÒNG KHÁM<br />
              <span style={{ color: "#ffe9b8" }}>NHI VITA</span>
            </h1>
            <p className="mt-3 text-sm font-semibold text-white/80 tracking-wider">
              {DOCTOR_INFO.name}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-white/75 max-w-[42ch]">
            {DOCTOR_INFO.tagline}. Đồng hành cùng cha mẹ trong từng giai đoạn phát triển của con.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-0 mt-2">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-0">
                <div className="flex flex-col gap-0.5 pr-6">
                  <span
                    className="font-display font-bold tabular-nums"
                    style={{ fontSize: "var(--text-2xl)", color: "#ffffff", lineHeight: 1.1 }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs text-white/65">{stat.label}</span>
                </div>
                {i < stats.length - 1 && (
                  <div className="w-px h-10 mr-6 shrink-0 bg-white/20" />
                )}
              </div>
            ))}
          </div>

          {/* Credentials badge */}
          <div
            className="inline-flex items-center gap-3 self-start px-4 py-2.5 rounded-[var(--radius-lg)]"
            style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <div
              className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              <Hospital size={18} className="text-white" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">{DOCTOR_INFO.hospital}</p>
              <p className="text-xs text-white/65">{DOCTOR_INFO.degree}</p>
            </div>
          </div>
        </div>

        {/* Right: Appointment form */}
        <div
          id="dat-lich"
          className="w-full lg:w-[360px] xl:w-[400px] self-stretch flex flex-col scroll-mt-[120px]"
          style={{ minHeight: "100%" }}
        >
          <div
            className="flex flex-col h-full overflow-y-auto"
            style={{
              backgroundColor: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Form header */}
            <div
              className="px-6 py-4 text-white shrink-0"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <h2 className="font-display font-bold text-lg tracking-wide">ĐĂNG KÝ KHÁM</h2>
              <p className="text-xs text-white/75 mt-0.5">
                Vui lòng điền thông tin vào form bên dưới để đăng ký khám bệnh theo yêu cầu
              </p>
            </div>

            {/* Form body */}
            <div className="px-5 py-5 flex-1">
              {submitted ? (
                <div className="flex flex-col items-center gap-4 py-10 text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--color-primary-light)" }}
                  >
                    <Check size={28} style={{ color: "var(--color-primary)" }} aria-hidden />
                  </div>
                  <p className="font-display font-semibold" style={{ color: "var(--color-primary)" }}>
                    Đăng ký thành công!
                  </p>
                  <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    Chúng tôi sẽ liên hệ xác nhận lịch hẹn trong thời gian sớm nhất.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm(INITIAL_FORM); }}
                    className="text-sm underline underline-offset-4 transition-opacity hover:opacity-70"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Đăng ký lịch khám khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Họ và tên */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="ap-name" className={labelClass} style={labelStyle}>
                      Họ và tên <span style={{ color: "var(--color-primary)" }}>*</span>
                    </label>
                    <input
                      id="ap-name"
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={form.name}
                      onChange={set("name")}
                      className={inputClass}
                      style={inputStyle}
                      onFocus={focusBorder}
                      onBlur={blurBorder}
                    />
                  </div>

                  {/* Số điện thoại */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="ap-phone" className={labelClass} style={labelStyle}>
                      Số điện thoại <span style={{ color: "var(--color-primary)" }}>*</span>
                    </label>
                    <input
                      id="ap-phone"
                      type="tel"
                      required
                      placeholder="0912 345 678"
                      value={form.phone}
                      onChange={set("phone")}
                      className={inputClass}
                      style={inputStyle}
                      onFocus={focusBorder}
                      onBlur={blurBorder}
                    />
                  </div>

                  {/* Ngày khám + Giờ khám */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ap-date" className={labelClass} style={labelStyle}>
                        Ngày khám <span style={{ color: "var(--color-primary)" }}>*</span>
                      </label>
                      <input
                        id="ap-date"
                        type="date"
                        required
                        value={form.date}
                        onChange={set("date")}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={focusBorder}
                        onBlur={blurBorder}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ap-time" className={labelClass} style={labelStyle}>
                        Giờ khám <span style={{ color: "var(--color-primary)" }}>*</span>
                      </label>
                      <input
                        id="ap-time"
                        type="time"
                        required
                        value={form.time}
                        onChange={set("time")}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={focusBorder}
                        onBlur={blurBorder}
                      />
                    </div>
                  </div>

                  {/* Mô tả triệu chứng (không bắt buộc) */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="ap-symptoms" className={labelClass} style={labelStyle}>
                      Mô tả triệu chứng{" "}
                      <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>
                        (không bắt buộc)
                      </span>
                    </label>
                    <textarea
                      id="ap-symptoms"
                      rows={3}
                      placeholder="Ví dụ: bé sốt 2 ngày, ho nhiều về đêm…"
                      value={form.symptoms}
                      onChange={set("symptoms")}
                      className="w-full px-3 py-2.5 text-base rounded-[var(--radius-sm)] resize-none transition-all duration-150 bg-white"
                      style={inputStyle}
                      onFocus={focusBorder}
                      onBlur={blurBorder}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-[var(--radius-md)] text-white text-base font-bold tracking-widest transition-opacity hover:opacity-90 mt-1"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    ĐĂNG KÝ
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

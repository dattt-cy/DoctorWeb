"use client";

import { useState, useEffect, useRef } from "react";
import { Hospital, Check, BadgeCheck, ShieldCheck, Clock3 } from "lucide-react";
import { DOCTOR_INFO } from "@/constants/doctor";
import { createAppointment, getAvailability } from "@/features/appointments/api";
import type { AppointmentSlot } from "@/features/appointments/types";
import { Button } from "@/components/ui/Button";

const stats = [
  { value: "Hơn 10", label: "Năm kinh nghiệm" },
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



// Khung giờ được tải từ backend theo lịch làm việc của phòng khám.
const today = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

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
  const [timeOpen, setTimeOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState<AppointmentSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const timeRef = useRef<HTMLDivElement>(null);

  // Click-away đóng dropdown
  useEffect(() => {
    if (!timeOpen) return;
    const handler = (e: MouseEvent) => {
      if (timeRef.current && !timeRef.current.contains(e.target as Node)) {
        setTimeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [timeOpen]);

  useEffect(() => {
    if (!form.date) {
      setTimeSlots([]);
      return;
    }
    let active = true;
    setLoadingSlots(true);
    setForm((previous) => ({ ...previous, time: "" }));
    getAvailability(form.date)
      .then((slots) => active && setTimeSlots(slots))
      .catch((error) => active && setFormError(error.message))
      .finally(() => active && setLoadingSlots(false));
    return () => { active = false; };
  }, [form.date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    let phone = form.phone.replace(/[^\d+]/g, "");
    if (phone.startsWith("+84")) phone = `0${phone.slice(3)}`;
    else if (phone.startsWith("84") && phone.length === 11) phone = `0${phone.slice(2)}`;
    if (!/^0[35789]\d{8}$/.test(phone)) {
      return setFormError("Số điện thoại phải là số di động Việt Nam gồm 10 chữ số.");
    }
    if (!form.date || !form.time || new Date(`${form.date}T${form.time}`).getTime() <= Date.now()) {
      return setFormError("Ngày và giờ khám phải ở trong tương lai.");
    }
    setSubmitting(true);
    try {
      await createAppointment({
        patientName: form.name,
        phone,
        appointmentDate: form.date,
        appointmentTime: form.time,
        reasonForVisit: form.symptoms || null,
      });
      setSubmitted(true);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Không thể đăng ký lịch khám.");
      setTimeSlots(await getAvailability(form.date).catch(() => timeSlots));
    } finally {
      setSubmitting(false);
    }
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
    <section className="relative w-full border-b border-stone-200 bg-[#fffdfb]">
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[42%] border-r border-orange-100 bg-[#faf7f4] lg:block" aria-hidden />

      <div className="relative z-10 container flex min-h-[650px] flex-col items-stretch gap-12 py-12 lg:flex-row lg:items-center lg:py-16">
        {/* Left: Clinic info overlay */}
        <div className="flex flex-1 flex-col justify-center gap-6 py-4 pr-0 lg:pr-8">
          <div className="inline-flex w-fit items-center gap-2 border-l-2 border-orange-500 pl-3 text-sm font-semibold text-slate-700">
            <BadgeCheck size={17} />
            Bác sĩ Nhi khoa đồng hành cùng gia đình
          </div>

          <div>
            <h1
              className="font-display text-balance font-bold leading-[1.08] text-slate-950"
              style={{ fontSize: "clamp(2rem, 1.5rem + 2vw, 3.25rem)" }}
            >
              Bác sĩ Nhi Hòa Xuân, Đà Nẵng<br />
              <span className="text-orange-600">Chăm sóc đúng cách, con khỏe mỗi ngày</span>
            </h1>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-orange-600">
              {DOCTOR_INFO.name} · {DOCTOR_INFO.specialty}
            </p>
          </div>

          <p className="max-w-[62ch] text-base leading-8 text-slate-600 sm:text-lg">
            Phòng khám Nhi ngoài giờ tại 522 Phạm Hùng, Hòa Xuân, Cẩm Lệ. Thăm khám hô hấp, tiêu hóa, da liễu, dị ứng, tai mũi họng và tư vấn dinh dưỡng trẻ em.
          </p>

          {/* Stats row */}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-[125px] border-l border-stone-300 px-4 py-2 first:border-l-0 first:pl-0">
                <div className="flex flex-col gap-0.5">
                  <span
                    className="font-display font-bold tabular-nums"
                    style={{ fontSize: "var(--text-xl)", color: "var(--color-primary)", lineHeight: 1.1 }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-orange-600" /> Thông tin bảo mật</span>
            <span className="flex items-center gap-2"><Clock3 size={16} className="text-orange-600" /> Xác nhận lịch nhanh</span>
            <span className="flex items-center gap-2"><Hospital size={16} className="text-orange-600" /> {DOCTOR_INFO.hospital}</span>
          </div>
        </div>

        {/* Right: Appointment form */}
        <div
          id="dat-lich"
          className="w-full self-center scroll-mt-[120px] lg:w-[390px] xl:w-[420px]"
        >
          <div
            className="flex h-full flex-col overflow-visible rounded-xl border border-stone-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.09)]"
            style={{
              minHeight: "590px",
            }}
          >
            {/* Form header */}
            <div
              className="shrink-0 rounded-t-xl border-b border-stone-200 border-t-4 border-t-orange-500 bg-stone-50 px-6 py-5"
            >
              <h2 className="font-display text-xl font-bold tracking-wide text-slate-950">Đăng ký lịch khám</h2>
              <p className="mt-0.5 text-xs text-slate-600">
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
                      pattern="(?:0[35789](?:[ .]?\d){8}|\+84[35789](?:[ .]?\d){8})"
                      title="Nhập số di động Việt Nam, ví dụ 0912 345 678"
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
                        min={today()}
                        value={form.date}
                        onChange={set("date")}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={focusBorder}
                        onBlur={blurBorder}
                      />
                    </div>
                    {/* Giờ khám — dropdown absolute, không bị clip */}
                    <div className="flex flex-col gap-1.5" ref={timeRef} style={{ position: "relative" }}>
                      <label className={labelClass} style={labelStyle}>
                        Giờ khám <span style={{ color: "var(--color-primary)" }}>*</span>
                      </label>

                      {/* Trigger */}
                      <button
                        type="button"
                        disabled={loadingSlots || !form.date}
                        onClick={() => setTimeOpen((v) => !v)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "9px 12px",
                          borderRadius: "var(--radius-sm)",
                          border: timeOpen
                            ? "1px solid var(--color-primary)"
                            : "1px solid #d1d5db",
                          backgroundColor: "#fff",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          color: form.time ? "var(--color-text)" : "#9ca3af",
                          fontWeight: form.time ? 600 : 400,
                          transition: "border-color 150ms",
                          textAlign: "left",
                        }}
                      >
                        <span>{loadingSlots ? "Đang tải..." : form.time || "-- Chọn giờ --"}</span>
                        <svg
                          width="14" height="14" viewBox="0 0 24 24" fill="none"
                          style={{ flexShrink: 0, transform: timeOpen ? "rotate(180deg)" : "none", transition: "transform 200ms" }}
                        >
                          <path d="M6 9l6 6 6-6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      {/* Dropdown panel — absolute, overlay lên nội dung bên dưới */}
                      {timeOpen && (
                        <div
                          style={{
                            position: "absolute",
                            top: "calc(100% + 4px)",
                            left: 0,
                            right: 0,
                            zIndex: 200,
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            padding: "10px",
                            border: "1px solid #e5e7eb",
                            borderRadius: 10,
                            backgroundColor: "#fff",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                            maxHeight: "280px",
                            overflowY: "auto",
                            overscrollBehavior: "contain",
                            scrollbarGutter: "stable",
                            WebkitOverflowScrolling: "touch",
                          }}
                        >
                          {/* Header */}
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", paddingBottom: "6px", borderBottom: "1px solid #f3f4f6", marginBottom: "2px" }}>
                            <span>Giờ khám</span>
                            <span>Trạng thái</span>
                          </div>
                          {timeSlots.map((slot) => {
                            const isFull = !slot.available;
                            const sel = form.time === slot.time;
                            return (
                              <button
                                key={slot.time}
                                type="button"
                                disabled={isFull}
                                onClick={() => { if (!isFull) { setForm((p) => ({ ...p, time: slot.time })); setTimeOpen(false); } }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "8px 10px",
                                  borderRadius: 7,
                                  fontSize: "0.78rem",
                                  fontWeight: sel ? 700 : 500,
                                  border: sel ? "1.5px solid var(--color-primary)" : "1.5px solid transparent",
                                  backgroundColor: sel ? "var(--color-primary)" : isFull ? "#fafafa" : "#f9f9f9",
                                  color: sel ? "#fff" : isFull ? "#c0bebe" : "#374151",
                                  cursor: isFull ? "not-allowed" : "pointer",
                                  transition: "all 120ms ease",
                                  gap: "8px",
                                }}
                                onMouseEnter={(e) => { if (!sel && !isFull) e.currentTarget.style.backgroundColor = "#fdeadd"; }}
                                onMouseLeave={(e) => { if (!sel && !isFull) e.currentTarget.style.backgroundColor = "#f9f9f9"; }}
                              >
                                {/* Time label */}
                                <span style={{ fontVariantNumeric: "tabular-nums", minWidth: 38 }}>{slot.time}</span>

                                <span style={{ fontSize: "0.7rem", fontWeight: 600, textAlign: "right", color: sel ? "#fff" : "#ef4444" }}>
                                  {isFull ? "Hết chỗ" : ""}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <input type="text" required readOnly value={form.time}
                        style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1 }}
                        tabIndex={-1}
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

                  {formError && (
                    <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                      {formError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    size="lg"
                    className="mt-1 w-full tracking-[0.08em]"
                  >
                    {submitting ? "ĐANG ĐĂNG KÝ..." : "ĐĂNG KÝ"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

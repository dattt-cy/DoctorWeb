"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createAppointment, getAvailability, Slot } from "@/lib/appointment-api";

const today = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

export function AppointmentForm() {
  const [date, setDate] = useState(today);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [time, setTime] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    setLoadingSlots(true);
    setTime("");
    setError("");
    getAvailability(date)
      .then((data) => active && setSlots(data))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoadingSlots(false));
    return () => { active = false; };
  }, [date]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!time) return setError("Vui lòng chọn giờ khám.");
    setSubmitting(true);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const rawPhone = String(form.get("phone") || "");
    let normalizedPhone = rawPhone.replace(/[^\d+]/g, "");
    if (normalizedPhone.startsWith("+84")) normalizedPhone = `0${normalizedPhone.slice(3)}`;
    else if (normalizedPhone.startsWith("84") && normalizedPhone.length === 11) normalizedPhone = `0${normalizedPhone.slice(2)}`;
    if (!/^0[35789]\d{8}$/.test(normalizedPhone)) {
      setSubmitting(false);
      return setError("Số điện thoại phải là số di động Việt Nam gồm 10 chữ số.");
    }
    const selectedDateTime = new Date(`${date}T${time}`);
    if (Number.isNaN(selectedDateTime.getTime()) || selectedDateTime.getTime() <= Date.now()) {
      setSubmitting(false);
      setTime("");
      return setError("Ngày và giờ khám phải ở trong tương lai.");
    }
    try {
      const result = await createAppointment({
        patientName: form.get("patientName"),
        phone: normalizedPhone,
        appointmentDate: date,
        appointmentTime: time,
        reasonForVisit: form.get("reasonForVisit") || null,
      });
      setSuccess(`${result.message} Mã bệnh nhân: ${result.patientCode}`);
      formElement.reset();
      setTime("");
      setSlots(await getAvailability(date));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thể đặt lịch.");
      setSlots(await getAvailability(date).catch(() => slots));
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-4 text-base outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  return (
    <section className="py-14" style={{ backgroundColor: "var(--color-surface)" }}>
      <div className="container">
        <div className="mx-auto max-w-xl overflow-hidden rounded-[30px] bg-white shadow-xl shadow-orange-100/60">
          <header className="border-b border-orange-100 bg-gradient-to-r from-orange-100 via-amber-50 to-white px-7 py-7 md:px-8">
            <h2 className="text-2xl font-bold text-slate-950">Đăng ký lịch khám</h2>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-600">
              Vui lòng điền thông tin vào form bên dưới để đăng ký khám bệnh theo yêu cầu
            </p>
          </header>

          <form onSubmit={submit} className="grid gap-5 p-7 md:grid-cols-2 md:p-8">
            <label className="text-base font-semibold text-slate-800 md:col-span-2">
              Họ và tên <span className="text-orange-500">*</span>
              <input
                required
                maxLength={150}
                name="patientName"
                autoComplete="name"
                placeholder="Nguyễn Văn A"
                className={inputClass}
              />
            </label>

            <label className="text-base font-semibold text-slate-800 md:col-span-2">
              Số điện thoại <span className="text-orange-500">*</span>
              <input
                required
                inputMode="tel"
                autoComplete="tel"
                minLength={10}
                maxLength={16}
                name="phone"
                placeholder="0912 345 678"
                pattern="(?:0[35789](?:[ .]?\d){8}|\+84[35789](?:[ .]?\d){8})"
                title="Nhập số di động Việt Nam, ví dụ 0912 345 678"
                className={inputClass}
              />
            </label>

            <label className="text-base font-semibold text-slate-800">
              Ngày khám <span className="text-orange-500">*</span>
              <input
                required
                min={today()}
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className={inputClass}
              />
            </label>

            <div>
              <p className="text-base font-semibold text-slate-800">
                Giờ khám <span className="text-orange-500">*</span>
              </p>
              <div className="relative mt-2">
                <select
                  required
                  value={time}
                  disabled={loadingSlots || slots.length === 0}
                  onChange={(event) => setTime(event.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-4 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-50"
                >
                  <option value="">{loadingSlots ? "Đang tải..." : "-- Chọn giờ --"}</option>
                  {slots.map((slot) => (
                    <option key={slot.time} value={slot.available ? slot.time : ""} disabled={!slot.available}>
                      {slot.time.slice(0, 5)}{slot.available ? "" : " — Hết chỗ"}
                    </option>
                  ))}
                </select>
                {loadingSlots && <Loader2 size={18} className="absolute right-10 top-5 animate-spin text-orange-500" />}
              </div>
              {!loadingSlots && slots.length === 0 && (
                <p className="mt-2 text-xs text-slate-500">Phòng khám nghỉ ngày này.</p>
              )}
            </div>

            <label className="text-base font-semibold text-slate-800 md:col-span-2">
              Mô tả triệu chứng <span className="font-normal text-slate-400">(không bắt buộc)</span>
              <textarea
                maxLength={500}
                rows={4}
                name="reasonForVisit"
                placeholder="Ví dụ: bé sốt 2 ngày, ho nhiều về đêm..."
                className={`${inputClass} resize-none`}
              />
            </label>

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">{error}</p>
            )}
            {success && (
              <p className="flex gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 md:col-span-2">
                <CheckCircle2 size={18} className="shrink-0" />{success}
              </p>
            )}

            <button
              disabled={submitting || !time}
              className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 text-base font-bold uppercase tracking-[0.14em] text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2"
            >
              {submitting && <Loader2 size={19} className="animate-spin" />}
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

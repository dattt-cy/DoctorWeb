"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarClock, Check, FileText, Loader2, Save, X } from "lucide-react";
import { apiRequest } from "@/shared/api/client";
import type { Appointment, AppointmentSlot, VisitNote } from "@/features/appointments/types";

type Props = {
  appointment: Appointment;
  onClose: () => void;
  onSaved: (note: VisitNote, completed: boolean) => void;
};

const emptyNote = (appointment: Appointment): VisitNote => ({
  appointmentId: appointment.id,
  patientId: appointment.patient.id,
  symptoms: appointment.reasonForVisit || "",
  examination: "",
  assessment: "",
  treatmentPlan: "",
  followUpDate: "",
  followUpTime: "",
  status: "DRAFT",
});

export default function VisitNoteDialog({ appointment, onClose, onSaved }: Props) {
  const [note, setNote] = useState<VisitNote>(() => emptyNote(appointment));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [followUpSlots, setFollowUpSlots] = useState<AppointmentSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const ready = useRef(false);
  const requestVersion = useRef(0);
  const saveTimer = useRef<number | null>(null);
  const saveQueue = useRef<Promise<VisitNote | undefined>>(Promise.resolve(undefined));

  useEffect(() => {
    ready.current = false;
    setLoading(true);
    apiRequest<VisitNote>(`/api/admin/appointments/${appointment.id}/visit-note`)
      .then((value) => {
        setNote({ ...emptyNote(appointment), ...value });
        ready.current = true;
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Không tải được phiếu khám"))
      .finally(() => setLoading(false));
  }, [appointment]);

  useEffect(() => {
    if (!note.followUpDate || note.followUpAppointmentId) {
      setFollowUpSlots([]);
      return;
    }
    setLoadingSlots(true);
    apiRequest<AppointmentSlot[]>(`/api/public/appointments/availability?date=${note.followUpDate}`)
      .then((slots) => setFollowUpSlots(slots.filter((slot) => slot.available)))
      .catch((e) => setError(e instanceof Error ? e.message : "Không tải được giờ tái khám"))
      .finally(() => setLoadingSlots(false));
  }, [note.followUpDate, note.followUpAppointmentId]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  async function persist(next: VisitNote, completeAppointment = false, createFollowUpAppointment = false) {
    const version = ++requestVersion.current;
    setSaving(true);
    try {
      const saved = await apiRequest<VisitNote>(`/api/admin/appointments/${appointment.id}/visit-note`, {
        method: "PUT",
        body: JSON.stringify({
          symptoms: next.symptoms || null,
          examination: next.examination || null,
          assessment: next.assessment || null,
          treatmentPlan: next.treatmentPlan || null,
          followUpDate: next.followUpDate || null,
          followUpTime: next.followUpTime || null,
          status: next.status,
          completeAppointment,
          releaseCapacity: completeAppointment,
          createFollowUpAppointment: createFollowUpAppointment
            && Boolean(next.followUpDate && next.followUpTime && !next.followUpAppointmentId),
        }),
      });
      if (version === requestVersion.current) {
        setNote(saved);
        setSavedAt(new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }));
        setError("");
      }
      return saved;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không lưu được phiếu khám");
      throw e;
    } finally {
      if (version === requestVersion.current) setSaving(false);
    }
  }

  function queuePersist(next: VisitNote, completeAppointment = false, createFollowUpAppointment = false) {
    const queued = saveQueue.current
      .catch(() => undefined)
      .then(() => persist(next, completeAppointment, createFollowUpAppointment));
    saveQueue.current = queued;
    return queued;
  }

  useEffect(() => {
    if (!ready.current || loading) return;
    saveTimer.current = window.setTimeout(() => void queuePersist(note).catch(() => undefined), 900);
    return () => {
      if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
    };
    // Persist is deliberately driven only by draft changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.symptoms, note.examination, note.assessment, note.treatmentPlan, note.followUpDate, note.followUpTime]);

  function field(name: keyof VisitNote, value: string) {
    setNote((current) => ({ ...current, [name]: value }));
  }

  async function finish() {
    const completed = appointment.status !== "COMPLETED";
    const finalized = { ...note, status: "FINALIZED" as const };
    const shouldCreateFollowUp = Boolean(note.followUpDate && note.followUpTime && !note.followUpAppointmentId);
    try {
      if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
      const saved = await queuePersist(finalized, completed, shouldCreateFollowUp);
      if (!saved) return;
      onSaved(saved, completed);
      onClose();
    } catch {
      // Error is displayed inside the dialog.
    }
  }

  const dialog = (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="visit-note-title"
        className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-slate-50 shadow-2xl">
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b bg-white/95 px-5 py-4 backdrop-blur md:px-7">
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700"><FileText size={22} /></div>
            <div>
              <h2 id="visit-note-title" className="text-xl font-bold text-slate-950">Phiếu khám · {appointment.patient.fullName}</h2>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })}
                {saving ? " · Đang tự lưu…" : savedAt ? ` · Đã lưu ${savedAt}` : " · Tự động lưu bản nháp"}
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Đóng" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X /></button>
        </header>

        {loading ? <div className="flex min-h-80 items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div> : (
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 md:p-7">
            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <section className="grid gap-4 rounded-2xl border bg-white p-5 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700 md:col-span-2">Triệu chứng và diễn biến
                <textarea autoFocus value={note.symptoms || ""} onChange={(e) => field("symptoms", e.target.value)} rows={3}
                  placeholder="Đã tự điền từ lý do đặt lịch, bác sĩ chỉ cần bổ sung…"
                  className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500" />
              </label>
              <label className="text-sm font-semibold text-slate-700">Kết quả thăm khám
                <textarea value={note.examination || ""} onChange={(e) => field("examination", e.target.value)} rows={5}
                  placeholder="Dấu hiệu, chỉ số, kết quả khám…"
                  className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500" />
              </label>
              <label className="text-sm font-semibold text-slate-700">Đánh giá
                <textarea value={note.assessment || ""} onChange={(e) => field("assessment", e.target.value)} rows={5}
                  placeholder="Nhận định của bác sĩ…"
                  className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500" />
              </label>
              <label className="text-sm font-semibold text-slate-700 md:col-span-2">Hướng xử lý và dặn dò
                <textarea value={note.treatmentPlan || ""} onChange={(e) => field("treatmentPlan", e.target.value)} rows={4}
                  placeholder="Điều trị, theo dõi và những điều bệnh nhân cần lưu ý…"
                  className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500" />
              </label>
              <label className="text-sm font-semibold text-slate-700"><span className="flex items-center gap-2"><CalendarClock size={16} />Ngày tái khám (nếu cần)</span>
                <input type="date" min={new Date().toISOString().slice(0, 10)} value={note.followUpDate || ""}
                  disabled={Boolean(note.followUpAppointmentId)}
                  onChange={(e) => setNote((current) => ({ ...current, followUpDate: e.target.value, followUpTime: "" }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500" />
              </label>
              {note.followUpDate && (
                <label className="text-sm font-semibold text-slate-700"><span className="flex items-center gap-2"><CalendarClock size={16} />Giờ tái khám</span>
                  {note.followUpAppointmentId ? (
                    <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-medium text-emerald-700">
                      Đã tạo lịch lúc {note.followUpTime?.slice(0, 5)}
                    </div>
                  ) : (
                    <select value={note.followUpTime || ""} onChange={(e) => field("followUpTime", e.target.value)} disabled={loadingSlots}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-blue-500 disabled:opacity-60">
                      <option value="">{loadingSlots ? "Đang tải giờ trống…" : "Chỉ nhắc, chưa tạo lịch"}</option>
                      {followUpSlots.map((slot) => <option key={slot.time} value={slot.time}>{slot.time.slice(0, 5)}</option>)}
                    </select>
                  )}
                </label>
              )}
            </section>

            <footer className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
              <p className="flex items-center gap-2 text-xs text-slate-500"><Save size={14} />Nội dung được tự lưu khi bạn ngừng nhập.</p>
              <button onClick={finish} disabled={saving}
                className="inline-flex items-center justify-center gap-1.5 self-end rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {note.followUpDate && note.followUpTime && !note.followUpAppointmentId
                  ? appointment.status === "COMPLETED" ? "Lưu & tạo lịch tái khám" : "Hoàn tất & tạo lịch tái khám"
                  : appointment.status === "COMPLETED" ? "Lưu thay đổi" : "Lưu & hoàn tất lượt khám"}
              </button>
            </footer>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}

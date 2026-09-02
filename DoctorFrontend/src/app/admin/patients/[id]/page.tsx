"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertCircle, ArrowLeft, CalendarDays, Edit3, FilePlus2, Loader2, Phone, Save, UserRound } from "lucide-react";
import VisitNoteDialog from "@/components/admin/VisitNoteDialog";
import { apiRequest } from "@/shared/api/client";
import type { Appointment, Patient, PatientRecord, VisitNote } from "@/features/appointments/types";

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PatientRecord | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [noteTarget, setNoteTarget] = useState<Appointment | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<PatientRecord>(`/api/admin/patients/${id}`).then(setData).catch((e) => setError(e.message));
  }, [id]);

  const notesByAppointment = new Map(
    (data?.visitNotes || []).map((note) => [note.appointmentId, note]),
  );

  async function updatePatient(payload: Record<string, FormDataEntryValue | null>) {
    setSaving(true);
    try {
      const patient = await apiRequest<Patient>(`/api/admin/patients/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setData((old) => old ? { ...old, patient } : old);
      setEditing(false);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không lưu được hồ sơ");
    } finally {
      setSaving(false);
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await updatePatient({
      fullName: form.get("fullName"), phone: form.get("phone"),
      dateOfBirth: form.get("dateOfBirth") || null, gender: form.get("gender") || null,
      guardianName: form.get("guardianName") || null, address: form.get("address") || null,
      notes: data?.patient.notes || null,
    });
  }

  async function saveImportantNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await updatePatient({
      fullName: data!.patient.fullName, phone: data!.patient.phone,
      dateOfBirth: data!.patient.dateOfBirth || null, gender: data!.patient.gender || null,
      guardianName: data!.patient.guardianName || null, address: data!.patient.address || null,
      notes: form.get("notes") || null,
    });
  }

  function receiveNote(note: VisitNote, completed: boolean) {
    setData((current) => {
      if (!current) return current;
      const exists = current.visitNotes.some((item) => item.appointmentId === note.appointmentId);
      return {
        ...current,
        visitNotes: exists ? current.visitNotes.map((item) => item.appointmentId === note.appointmentId ? note : item) : [note, ...current.visitNotes],
        appointments: completed ? current.appointments.map((item) => item.id === note.appointmentId
          ? { ...item, status: "COMPLETED", consumesCapacity: false, completedAt: new Date().toISOString() } : item) : current.appointments,
      };
    });
  }

  if (!data) return <div>{error || <Loader2 className="animate-spin text-blue-600" />}</div>;
  const patient = data.patient;

  return (
    <div className="mx-auto max-w-7xl">
      <Link href="/admin/patients" className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600"><ArrowLeft size={16} /> Danh sách bệnh nhân</Link>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700"><UserRound size={28} /></div>
          <div><h1 className="text-3xl font-bold text-slate-950">{patient.fullName}</h1><p className="mt-1 font-mono text-sm text-blue-600">{patient.patientCode}</p></div>
        </div>
        <div className="flex gap-2">
          <a href={`tel:${patient.phone}`} className="inline-flex h-10 items-center gap-2 rounded-xl border bg-white px-4 text-sm font-semibold text-slate-700"><Phone size={16} /> Gọi</a>
          <button onClick={() => setEditing((value) => !value)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white"><Edit3 size={16} /> {editing ? "Đóng chỉnh sửa" : "Sửa hồ sơ"}</button>
        </div>
      </header>
      {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <main>
          <div className="mb-4"><h2 className="text-xl font-bold text-slate-950">Lịch sử khám</h2><p className="text-sm text-slate-500">{data.appointments.length} lượt hẹn · {data.visitNotes.length} phiếu khám</p></div>
          <div className="space-y-3">
            {data.appointments.length === 0 ? <div className="rounded-2xl border bg-white p-10 text-center text-slate-500"><CalendarDays className="mx-auto mb-2" />Chưa có lịch hẹn.</div> : data.appointments.map((appointment) => {
              const note = notesByAppointment.get(appointment.id);
              const completed = appointment.status === "COMPLETED" || !appointment.consumesCapacity;
              return (
                <article key={appointment.id} className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <strong>{new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })}</strong>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${completed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{completed ? "Đã khám" : "Chưa khám"}</span>
                        {note?.status === "DRAFT" && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">Bản nháp</span>}
                      </div>
                      <p className="mt-2 text-sm text-slate-600"><span className="font-medium text-slate-800">Lý do:</span> {appointment.reasonForVisit || "Chưa ghi nhận"}</p>
                    </div>
                    <button onClick={() => setNoteTarget(appointment)} className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100">{note ? <Edit3 size={15} /> : <FilePlus2 size={15} />}{note ? "Mở phiếu khám" : "Ghi phiếu khám"}</button>
                  </div>
                  {note && <div className="mt-4 grid gap-3 border-t pt-4 text-sm sm:grid-cols-2">
                    {note.assessment && <p><span className="block text-xs font-semibold uppercase text-slate-400">Đánh giá</span><span className="mt-1 block whitespace-pre-line text-slate-700">{note.assessment}</span></p>}
                    {note.treatmentPlan && <p><span className="block text-xs font-semibold uppercase text-slate-400">Dặn dò</span><span className="mt-1 block whitespace-pre-line text-slate-700">{note.treatmentPlan}</span></p>}
                    {note.followUpDate && <p className="sm:col-span-2 text-blue-700"><strong>Tái khám:</strong> {new Date(`${note.followUpDate}T00:00:00`).toLocaleDateString("vi-VN")}</p>}
                  </div>}
                </article>
              );
            })}
          </div>
        </main>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <form key={`${patient.id}-${editing}`} onSubmit={saveProfile} className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-bold text-slate-950">Thông tin bệnh nhân</h2>
            <div className="grid gap-3">
              <Field label="Họ và tên"><input disabled={!editing} required name="fullName" defaultValue={patient.fullName} className={inputClass} /></Field>
              <Field label="Số điện thoại"><input disabled={!editing} required name="phone" type="tel" defaultValue={patient.phone} className={inputClass} /></Field>
              <Field label="Ngày sinh"><input disabled={!editing} name="dateOfBirth" type="date" defaultValue={patient.dateOfBirth || ""} className={inputClass} /></Field>
              <Field label="Giới tính"><select disabled={!editing} name="gender" defaultValue={patient.gender || ""} className={inputClass}><option value="">Chưa cập nhật</option><option value="MALE">Nam</option><option value="FEMALE">Nữ</option><option value="OTHER">Khác</option></select></Field>
              <Field label="Người giám hộ"><input disabled={!editing} name="guardianName" defaultValue={patient.guardianName || ""} className={inputClass} /></Field>
              <Field label="Địa chỉ"><input disabled={!editing} name="address" defaultValue={patient.address || ""} className={inputClass} /></Field>
            </div>
            {editing && <button disabled={saving} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-60">{saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}Lưu hồ sơ</button>}
          </form>
          <form onSubmit={saveImportantNote} className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h2 className="flex items-center gap-2 font-bold text-amber-950"><AlertCircle size={18} /> Lưu ý quan trọng</h2>
            <p className="mt-1 text-xs leading-5 text-amber-700">Dị ứng, bệnh nền, thuốc đang dùng hoặc điều cần thấy ở mọi lần khám.</p>
            <textarea name="notes" defaultValue={patient.notes || ""} rows={6} placeholder="Chưa có lưu ý…" className="mt-3 w-full resize-y rounded-xl border border-amber-200 bg-white px-3 py-3 text-sm outline-none focus:border-amber-500" />
            <button disabled={saving} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"><Save size={16} />Lưu lưu ý</button>
          </form>
        </aside>
      </div>
      {noteTarget && <VisitNoteDialog appointment={noteTarget} onClose={() => setNoteTarget(null)} onSaved={receiveNote} />}
    </div>
  );
}

const inputClass = "mt-1 w-full rounded-lg border px-3 py-2 text-sm disabled:border-transparent disabled:bg-slate-50 disabled:text-slate-700";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="text-xs font-medium text-slate-500">{label}{children}</label>;
}

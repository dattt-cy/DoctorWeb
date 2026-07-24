"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/blog-api";
import { Appointment, Patient } from "@/lib/appointment-api";

type Detail = { patient: Patient; appointments: Appointment[] };

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Detail | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<Detail>(`/api/admin/patients/${params.id}`).then(setData).catch((e) => setError(e.message));
  }, [params.id]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const patient = await apiRequest<Patient>(`/api/admin/patients/${params.id}`, {
        method: "PUT",
        body: JSON.stringify({
          fullName: form.get("fullName"),
          phone: form.get("phone"),
          dateOfBirth: data?.patient.dateOfBirth ?? null,
          gender: data?.patient.gender ?? null,
          guardianName: data?.patient.guardianName ?? null,
          address: data?.patient.address ?? null,
          notes: data?.patient.notes ?? null,
        }),
      });
      setData((old) => old ? { ...old, patient } : old);
      setEditing(false);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không lưu được");
    }
  }

  if (!data) return <div>{error || <Loader2 className="animate-spin" />}</div>;
  const patient = data.patient;

  return (
    <div>
      <Link href="/admin/patients" className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500">
        <ArrowLeft size={16} />Danh sách bệnh nhân
      </Link>
      <div className="mb-6 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">{patient.fullName}</h1>
          <p className="mt-1 font-mono text-sm text-blue-600">{patient.patientCode}</p>
        </div>
        <button onClick={() => setEditing(!editing)} className="h-10 rounded-xl border bg-white px-4 text-sm font-semibold">
          {editing ? "Hủy" : "Sửa thông tin"}
        </button>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}

      <form onSubmit={save} className="mb-7 grid gap-4 rounded-xl border bg-white p-5 md:grid-cols-2">
        <label className="text-sm text-slate-600">
          Tên bệnh nhân
          <input disabled={!editing} required name="fullName" defaultValue={patient.fullName}
            className="mt-1 block w-full rounded-lg border px-3 py-2 disabled:bg-slate-50" />
        </label>
        <label className="text-sm text-slate-600">
          Số điện thoại
          <input disabled={!editing} required name="phone" type="tel" defaultValue={patient.phone}
            pattern="(?:0[35789](?:[ .]?\d){8}|\+84[35789](?:[ .]?\d){8})"
            className="mt-1 block w-full rounded-lg border px-3 py-2 disabled:bg-slate-50" />
        </label>
        {editing && (
          <button className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white md:col-span-2">
            Lưu hồ sơ
          </button>
        )}
      </form>

      <h2 className="mb-3 text-xl font-bold">Lịch sử lịch hẹn ({data.appointments.length})</h2>
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="p-4">Ngày giờ</th><th className="p-4">Triệu chứng</th><th className="p-4">Trạng thái</th><th className="p-4">Suất</th></tr>
          </thead>
          <tbody>
            {data.appointments.map((appointment) => (
              <tr key={appointment.id} className="border-t">
                <td className="p-4 font-semibold">
                  {new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}
                </td>
                <td className="p-4">{appointment.reasonForVisit || "—"}</td>
                <td className="p-4">{appointment.status === "COMPLETED" || !appointment.consumesCapacity ? "Đã khám" : "Chưa khám"}</td>
                <td className="p-4">{appointment.consumesCapacity ? "Đang giữ" : "Đã giải phóng"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

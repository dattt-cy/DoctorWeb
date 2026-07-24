"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarDays, Loader2, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/blog-api";
import { Appointment } from "@/lib/appointment-api";

function isoDate(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

export default function AdminAppointmentsPage() {
  const [from, setFrom] = useState(isoDate());
  const [to, setTo] = useState(isoDate(7));
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completionTarget, setCompletionTarget] = useState<Appointment | null>(null);
  const [reopenTarget, setReopenTarget] = useState<Appointment | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await apiRequest(`/api/admin/appointments?from=${from}&to=${to}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được lịch hẹn");
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => { load(); }, [load]);

  async function update(item: Appointment, status: "PENDING" | "COMPLETED", releaseCapacity = false) {
    try {
      const updated = await apiRequest<Appointment>(`/api/admin/appointments/${item.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, releaseCapacity, adminNote: item.adminNote || null }),
      });
      setItems((old) => old.map((appointment) => appointment.id === updated.id ? updated : appointment));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cập nhật thất bại");
    }
  }

  function changeStatus(item: Appointment, value: string) {
    if (value === "COMPLETED") {
      setCompletionTarget(item);
      return;
    }
    setReopenTarget(item);
  }

  async function completeAppointment(releaseCapacity: boolean) {
    if (!completionTarget) return;
    const target = completionTarget;
    setCompletionTarget(null);
    await update(target, "COMPLETED", releaseCapacity);
  }

  async function reopenAppointment() {
    if (!reopenTarget) return;
    const target = reopenTarget;
    setReopenTarget(null);
    await update(target, "PENDING");
  }

  const dates = Array.from(new Set(items.map((item) => item.appointmentDate)));
  const occupied = (item: Appointment) => items.filter((appointment) =>
    appointment.appointmentDate === item.appointmentDate &&
    appointment.appointmentTime === item.appointmentTime &&
    appointment.consumesCapacity
  ).length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Lịch hẹn</h1>
          <p className="mt-1 text-sm text-slate-500">Quản lý trạng thái khám và giải phóng suất.</p>
        </div>
        <div className="flex items-end gap-2">
          <label className="text-xs text-slate-500">Từ ngày
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
              className="mt-1 block rounded-lg border px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-slate-500">Đến ngày
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
              className="mt-1 block rounded-lg border px-3 py-2 text-sm" />
          </label>
          <button onClick={load} className="rounded-lg border bg-white p-2.5" aria-label="Tải lại">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {loading ? <Loader2 className="animate-spin text-blue-600" /> : items.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
          <CalendarDays className="mx-auto mb-3" />Không có lịch hẹn.
        </div>
      ) : (
        <div className="space-y-6">
          {dates.map((date) => (
            <section key={date}>
              <h2 className="mb-2 text-sm font-bold text-slate-600">
                {new Date(`${date}T00:00:00`).toLocaleDateString("vi-VN", {
                  weekday: "long", day: "2-digit", month: "2-digit", year: "numeric",
                })}
              </h2>
              <div className="overflow-x-auto rounded-xl border bg-white">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="p-4">Giờ</th>
                      <th className="p-4">Bệnh nhân</th>
                      <th className="p-4">Liên hệ</th>
                      <th className="p-4">Triệu chứng</th>
                      <th className="p-4">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.filter((item) => item.appointmentDate === date).map((item) => (
                      <tr key={item.id} className="border-t align-top">
                        <td className="p-4 font-bold text-blue-700">
                          {item.appointmentTime.slice(0, 5)}
                          <span className="block text-[10px] text-slate-500">{occupied(item)}/6 suất</span>
                          {!item.consumesCapacity && <span className="block text-[10px] text-emerald-600">Đã giải phóng</span>}
                        </td>
                        <td className="p-4">
                          <p className="font-semibold">{item.patient.fullName}</p>
                          <p className="text-xs text-slate-500">{item.patient.patientCode}</p>
                        </td>
                        <td className="p-4">
                          <a className="text-blue-600" href={`tel:${item.patient.phone}`}>{item.patient.phone}</a>
                        </td>
                        <td className="max-w-56 p-4 text-slate-600">{item.reasonForVisit || "—"}</td>
                        <td className="p-4">
                          <select
                            value={item.status === "COMPLETED" || !item.consumesCapacity ? "COMPLETED" : "PENDING"}
                            onChange={(e) => changeStatus(item, e.target.value)}
                            className="rounded-lg border px-3 py-2 text-sm font-medium"
                          >
                            <option value="PENDING">Chưa khám</option>
                            <option value="COMPLETED">Đã khám</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}

      {completionTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCompletionTarget(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="complete-title"
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700">
                ✓
              </div>
              <h2 id="complete-title" className="text-xl font-bold text-slate-900">Xác nhận đã khám</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Bệnh nhân <strong className="text-slate-800">{completionTarget.patient.fullName}</strong> đã khám xong
                lịch lúc <strong className="text-slate-800">{completionTarget.appointmentTime.slice(0, 5)}</strong>.
              </p>
            </div>

            <div className="space-y-3 px-6 py-5">
              <p className="text-sm font-semibold text-slate-700">Bạn muốn xử lý suất này thế nào?</p>
              <button
                onClick={() => completeAppointment(true)}
                className="w-full rounded-2xl bg-orange-500 px-5 py-3.5 text-left text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Giải phóng suất
                <span className="mt-1 block text-xs font-normal text-orange-100">Cho phép bệnh nhân khác đặt vào khung giờ này.</span>
              </button>
              <button
                onClick={() => completeAppointment(false)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Vẫn giữ suất
                <span className="mt-1 block text-xs font-normal text-slate-500">Đánh dấu đã khám nhưng không mở lại suất.</span>
              </button>
              <button
                onClick={() => setCompletionTarget(null)}
                className="w-full px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800"
              >
                Hủy, chưa thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {reopenTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setReopenTarget(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reopen-title"
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl text-blue-700">
                ↶
              </div>
              <h2 id="reopen-title" className="text-xl font-bold text-slate-900">Hoàn tác về chưa khám?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Lịch của <strong className="text-slate-800">{reopenTarget.patient.fullName}</strong> lúc{" "}
                <strong className="text-slate-800">{reopenTarget.appointmentTime.slice(0, 5)}</strong> sẽ chuyển về chưa khám.
              </p>
              {!reopenTarget.consumesCapacity && (
                <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-5 text-amber-800">
                  Suất này đã được giải phóng. Hoàn tác sẽ giữ lại 1 suất trong khung giờ này.
                </p>
              )}
            </div>
            <div className="flex gap-3 px-6 py-5">
              <button
                onClick={() => setReopenTarget(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={reopenAppointment}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Hoàn tác và giữ suất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

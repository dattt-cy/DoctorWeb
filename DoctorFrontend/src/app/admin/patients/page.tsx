"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Users } from "lucide-react";
import { apiRequest } from "@/shared/api/client";
import type { Patient } from "@/features/appointments/types";

type PatientPage = { content: Patient[]; totalElements: number; totalPages: number; number: number; first: boolean; last: boolean };

export default function PatientsPage() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PatientPage>({ content: [], totalElements: 0, totalPages: 0, number: 0, first: true, last: true });
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => { setPage(0); setActiveQuery(query.trim()); }, 350);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    apiRequest<PatientPage>(`/api/admin/patients?query=${encodeURIComponent(activeQuery)}&page=${page}&size=20&sort=createdAt,desc`)
      .then(setData).catch((e) => setError(e.message));
  }, [activeQuery, page]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bệnh nhân</h1>
        <p className="mt-1 text-sm text-slate-500">{data.totalElements} hồ sơ</p>
      </div>
      <div className="mb-5 max-w-xl">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Tên, số điện thoại hoặc mã"
            className="w-full rounded-xl border py-2.5 pl-10 pr-4" />
        </div>
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
      <div className="overflow-hidden rounded-xl border bg-white">
        {data.content.length === 0 ? (
          <div className="p-10 text-center text-slate-500"><Users className="mx-auto mb-2" />Chưa có bệnh nhân.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr><th className="p-4">Mã</th><th className="p-4">Bệnh nhân</th><th className="p-4">Điện thoại</th><th></th></tr>
            </thead>
            <tbody>
              {data.content.map((patient) => (
                <tr key={patient.id} className="border-t">
                  <td className="p-4 font-mono text-xs text-blue-700">{patient.patientCode}</td>
                  <td className="p-4 font-semibold">{patient.fullName}</td>
                  <td className="p-4">{patient.phone}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/patients/${patient.id}`} className="font-semibold text-blue-600">Xem hồ sơ →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <button disabled={data.first} onClick={() => setPage((value) => Math.max(0, value - 1))} className="rounded-lg border bg-white px-4 py-2 font-semibold disabled:opacity-40">Trang trước</button>
          <span className="text-slate-500">Trang {data.number + 1}/{data.totalPages}</span>
          <button disabled={data.last} onClick={() => setPage((value) => value + 1)} className="rounded-lg border bg-white px-4 py-2 font-semibold disabled:opacity-40">Trang sau</button>
        </div>
      )}
    </div>
  );
}

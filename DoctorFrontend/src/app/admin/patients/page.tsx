"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Search, Users } from "lucide-react";
import { apiRequest } from "@/lib/blog-api";
import { Patient } from "@/lib/appointment-api";

type PatientPage = { content: Patient[]; totalElements: number };

export default function PatientsPage() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [data, setData] = useState<PatientPage>({ content: [], totalElements: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<PatientPage>(`/api/admin/patients?query=${encodeURIComponent(activeQuery)}&size=100&sort=createdAt,desc`)
      .then(setData).catch((e) => setError(e.message));
  }, [activeQuery]);

  function search(event: FormEvent) {
    event.preventDefault();
    setActiveQuery(query);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bệnh nhân</h1>
        <p className="mt-1 text-sm text-slate-500">{data.totalElements} hồ sơ</p>
      </div>
      <form onSubmit={search} className="mb-5 flex max-w-xl gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Tên, số điện thoại hoặc mã"
            className="w-full rounded-xl border py-2.5 pl-10 pr-4" />
        </div>
        <button className="rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white">Tìm</button>
      </form>
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
    </div>
  );
}

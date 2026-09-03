"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Users } from "lucide-react";
import { apiRequest } from "@/shared/api/client";
import type { Patient } from "@/features/appointments/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
        <h1 className="text-2xl font-semibold tracking-tight">Bệnh nhân</h1>
        <p className="mt-1 text-sm text-slate-500">{data.totalElements} hồ sơ</p>
      </div>
      <div className="mb-5 max-w-xl">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Tên, số điện thoại hoặc mã"
            className="pl-10" />
        </div>
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
      <Card className="overflow-hidden shadow-none">
        {data.content.length === 0 ? (
          <div className="p-10 text-center text-slate-500"><Users className="mx-auto mb-2" />Chưa có bệnh nhân.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-medium text-slate-500">
              <tr><th className="p-4">Mã</th><th className="p-4">Bệnh nhân</th><th className="p-4">Điện thoại</th><th></th></tr>
            </thead>
            <tbody>
              {data.content.map((patient) => (
                <tr key={patient.id} className="border-t hover:bg-slate-50/60">
                  <td className="p-4 font-mono text-xs text-slate-600">{patient.patientCode}</td>
                  <td className="p-4 font-semibold">{patient.fullName}</td>
                  <td className="p-4">{patient.phone}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/patients/${patient.id}`} className="font-medium text-slate-700 hover:text-slate-950 hover:underline">Xem hồ sơ</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <Button disabled={data.first} onClick={() => setPage((value) => Math.max(0, value - 1))} variant="outline" size="sm">Trang trước</Button>
          <span className="text-slate-500">Trang {data.number + 1}/{data.totalPages}</span>
          <Button disabled={data.last} onClick={() => setPage((value) => value + 1)} variant="outline" size="sm">Trang sau</Button>
        </div>
      )}
    </div>
  );
}

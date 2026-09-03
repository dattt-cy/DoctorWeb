"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity, AlertTriangle, CalendarCheck, CalendarClock, CalendarDays, Clock3,
  Loader2, RefreshCw, RotateCcw, UsersRound,
} from "lucide-react";
import { getStatistics } from "@/features/statistics/api";
import type { StatisticsDashboard } from "@/features/statistics/types";
import type { FollowUpReminder } from "@/features/appointments/types";
import { apiRequest } from "@/shared/api/client";

function localIso(date: Date) {
  const copy = new Date(date);
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
  return copy.toISOString().slice(0, 10);
}

function monthRange() {
  const now = new Date();
  return {
    from: localIso(new Date(now.getFullYear(), now.getMonth(), 1)),
    to: localIso(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  };
}

const number = new Intl.NumberFormat("vi-VN");
const shortDate = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" });
const longDate = new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });

export default function AdminDashboardPage() {
  const [from, setFrom] = useState(() => monthRange().from);
  const [to, setTo] = useState(() => monthRange().to);
  const [data, setData] = useState<StatisticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!from || !to) return;
    if (to < from) {
      setError("Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      setData(await getStatistics(from, to));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được thống kê.");
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => { load(); }, [load]);

  function setPreset(kind: "today" | "week" | "month" | "last30") {
    const now = new Date();
    if (kind === "today") {
      const date = localIso(now);
      setFrom(date); setTo(date);
    } else if (kind === "week") {
      const end = new Date(now); end.setDate(end.getDate() + 6);
      setFrom(localIso(now)); setTo(localIso(end));
    } else if (kind === "last30") {
      const start = new Date(now); start.setDate(start.getDate() - 29);
      setFrom(localIso(start)); setTo(localIso(now));
    } else {
      const range = monthRange();
      setFrom(range.from); setTo(range.to);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">Tổng quan vận hành</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Thống kê phòng khám</h1>
          <p className="mt-1 text-sm text-slate-500">Theo dõi lịch khám, bệnh nhân và mức sử dụng suất.</p>
        </div>
        <button onClick={load} disabled={loading}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />Làm mới
        </button>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-wrap gap-2">
            <PresetButton onClick={() => setPreset("today")}>Hôm nay</PresetButton>
            <PresetButton onClick={() => setPreset("week")}>7 ngày tới</PresetButton>
            <PresetButton onClick={() => setPreset("month")}>Tháng này</PresetButton>
            <PresetButton onClick={() => setPreset("last30")}>30 ngày qua</PresetButton>
          </div>
          <div className="ml-auto flex flex-wrap items-end gap-2">
            <label className="text-xs font-medium text-slate-500">Từ ngày
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
                className="mt-1 block rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700" />
            </label>
            <label className="text-xs font-medium text-slate-500">Đến ngày
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
                className="mt-1 block rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700" />
            </label>
          </div>
        </div>
      </section>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading && !data ? (
        <div className="flex min-h-80 items-center justify-center rounded-lg border bg-white">
          <Loader2 className="animate-spin text-blue-600" size={30} />
        </div>
      ) : data ? <DashboardContent data={data} /> : null}
    </div>
  );
}

function FollowUpReminders() {
  const [items, setItems] = useState<FollowUpReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const today = new Date();
    const from = new Date(today); from.setDate(from.getDate() - 30);
    const to = new Date(today); to.setDate(to.getDate() + 14);
    apiRequest<FollowUpReminder[]>(`/api/admin/follow-ups?from=${localIso(from)}&to=${localIso(to)}`)
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : "Không tải được lịch tái khám."))
      .finally(() => setLoading(false));
  }, []);

  const today = localIso(new Date());
  const overdue = items.filter((item) => item.followUpDate < today && !item.followUpAppointmentId).length;

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div>
          <h2 className="flex items-center gap-2 font-bold text-slate-900"><CalendarClock size={19} className="text-blue-600" />Nhắc tái khám</h2>
          <p className="mt-1 text-xs text-slate-500">Quá hạn 30 ngày và các lịch trong 14 ngày tới</p>
        </div>
        {overdue > 0 && <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700"><AlertTriangle size={14} />{overdue} ca quá hạn</span>}
      </div>
      {loading ? (
        <div className="flex h-28 items-center justify-center"><Loader2 size={22} className="animate-spin text-blue-600" /></div>
      ) : error ? (
        <p className="px-5 py-6 text-sm text-red-600">{error}</p>
      ) : items.length === 0 ? (
        <p className="px-5 py-7 text-center text-sm text-slate-500">Chưa có bệnh nhân cần tái khám trong khoảng này.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {items.slice(0, 8).map((item) => {
            const isOverdue = item.followUpDate < today && !item.followUpAppointmentId;
            return (
              <Link key={item.noteId} href={`/admin/patients/${item.patient.id}`}
                className="flex min-w-0 items-center gap-3 px-5 py-3 transition hover:bg-slate-50">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${isOverdue ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                  {new Date(`${item.followUpDate}T00:00:00`).getDate()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{item.patient.fullName}</p>
                  <p className="text-xs text-slate-500">{new Date(`${item.followUpDate}T00:00:00`).toLocaleDateString("vi-VN")}{item.followUpTime ? ` · ${item.followUpTime.slice(0, 5)}` : " · Chưa chọn giờ"}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.followUpAppointmentId ? "bg-emerald-100 text-emerald-700" : isOverdue ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                  {item.followUpAppointmentId ? "Đã tạo lịch" : isOverdue ? "Quá hạn" : "Cần theo dõi"}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

function DashboardContent({ data }: { data: StatisticsDashboard }) {
  const { summary } = data;
  const cards = [
    { label: "Tổng lịch hẹn", value: summary.totalAppointments, note: "Trong khoảng đã chọn", icon: CalendarDays, color: "blue" },
    { label: "Đã khám", value: summary.completedAppointments, note: `${summary.completionRate}% tổng lịch`, icon: CalendarCheck, color: "emerald" },
    { label: "Chưa khám", value: summary.pendingAppointments, note: "Cần tiếp tục xử lý", icon: CalendarClock, color: "orange" },
    { label: "Bệnh nhân", value: summary.uniquePatients, note: `${summary.newPatients} mới · ${summary.returningPatients} quay lại`, icon: UsersRound, color: "violet" },
    { label: "Suất đang giữ", value: summary.occupiedSlots, note: `${summary.occupancyRate}% tổng công suất`, icon: Activity, color: "cyan" },
    { label: "Đã giải phóng", value: summary.releasedAppointments, note: "Lịch sử vẫn được giữ", icon: RotateCcw, color: "rose" },
  ];

  return (
    <>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 min-[1450px]:grid-cols-6">
        {cards.map((card) => <MetricCard key={card.label} {...card} />)}
      </section>

      <FollowUpReminders />

      <section className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-5">
          <SectionHeading title="Lịch hẹn theo ngày" subtitle="Màu xanh: đã khám · Màu cam: chưa khám" />
          <DailyChart data={data.daily} />
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <SectionHeading title="Bệnh nhân" subtitle="Bệnh nhân duy nhất trong kỳ" />
          <PatientBreakdown data={data} />
        </div>
      </section>

      <section className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-5">
          <SectionHeading title="Mức độ đặt theo khung giờ" subtitle="Tổng lượt đặt, đã khám và số lượt giải phóng" />
          <HourlyChart data={data.hourly} />
        </div>
        <div className="space-y-6">
          <CapacityCard data={data} />
          <HighlightsCard data={data} />
        </div>
      </section>
    </>
  );
}

function PresetButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700">{children}</button>;
}

const colors: Record<string, string> = {
  blue: "bg-slate-100 text-slate-600", emerald: "bg-slate-100 text-slate-600",
  orange: "bg-slate-100 text-slate-600", violet: "bg-slate-100 text-slate-600",
  cyan: "bg-slate-100 text-slate-600", rose: "bg-slate-100 text-slate-600",
};

function MetricCard({ label, value, note, icon: Icon, color }: {
  label: string; value: number; note: string; icon: React.ElementType; color: string;
}) {
  return (
    <article className="min-w-0 rounded-lg border border-slate-200 bg-white p-4">
      <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-md ${colors[color]}`}><Icon size={16} /></div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-950">{number.format(value)}</p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </article>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="mb-5"><h2 className="font-bold text-slate-900">{title}</h2><p className="mt-0.5 text-xs text-slate-500">{subtitle}</p></div>;
}

function DailyChart({ data }: { data: StatisticsDashboard["daily"] }) {
  const total = data.reduce((sum, point) => sum + point.appointments, 0);
  if (total === 0) {
    return <ChartEmpty icon={CalendarDays} message="Chưa có lịch hẹn trong khoảng thời gian này." />;
  }
  const max = Math.max(1, ...data.map((point) => point.appointments));
  const visibleLabels = data.length <= 14 ? 1 : Math.ceil(data.length / 10);
  return (
    <div className="w-full">
      <div className="relative flex h-56 w-full items-stretch gap-1 px-1 after:absolute after:inset-x-1 after:bottom-6 after:border-b after:border-slate-200">
        {data.map((point, index) => {
          const totalHeight = point.appointments ? Math.max(12, point.appointments / max * 190) : 2;
          const completedHeight = point.appointments ? totalHeight * point.completed / point.appointments : 0;
          const pendingHeight = totalHeight - completedHeight;
          return (
            <div key={point.date} className="group relative z-[1] flex min-w-0 flex-1 flex-col items-center justify-end">
              <div className="pointer-events-none absolute bottom-full z-10 mb-2 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] text-white group-hover:block">
                {shortDate.format(new Date(`${point.date}T00:00:00`))}: {point.appointments} lịch
              </div>
              <div className="flex w-full max-w-8 flex-col-reverse overflow-hidden rounded-t-md" style={{ height: totalHeight }}>
                <div className="bg-emerald-500" style={{ height: completedHeight }} />
                <div className="bg-orange-400" style={{ height: pendingHeight }} />
              </div>
              <span className="mt-2 h-4 whitespace-nowrap text-[9px] text-slate-400">
                {index % visibleLabels === 0 ? shortDate.format(new Date(`${point.date}T00:00:00`)) : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PatientBreakdown({ data }: { data: StatisticsDashboard }) {
  const { summary } = data;
  const newPercent = summary.uniquePatients ? summary.newPatients / summary.uniquePatients * 100 : 0;
  const returningPercent = summary.uniquePatients ? 100 - newPercent : 0;

  if (summary.uniquePatients === 0) {
    return <ChartEmpty icon={UsersRound} message="Chưa có bệnh nhân trong khoảng thời gian này." />;
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-3xl font-semibold tabular-nums text-slate-950">{number.format(summary.uniquePatients)}</p>
        <p className="mt-1 text-xs text-slate-500">Tổng bệnh nhân duy nhất</p>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-slate-100" aria-label={`${newPercent.toFixed(0)}% bệnh nhân mới, ${returningPercent.toFixed(0)}% quay lại`}>
        <span className="bg-orange-500" style={{ width: `${newPercent}%` }} />
        <span className="bg-slate-400" style={{ width: `${returningPercent}%` }} />
      </div>
      <div className="grid grid-cols-2 divide-x divide-slate-200 rounded-md border border-slate-200">
        <BreakdownItem color="bg-orange-500" label="Bệnh nhân mới" value={summary.newPatients} />
        <BreakdownItem color="bg-slate-400" label="Quay lại" value={summary.returningPatients} />
      </div>
      <p className="text-xs leading-5 text-slate-400">Bệnh nhân được nhận diện theo tên và số điện thoại.</p>
    </div>
  );
}

function BreakdownItem({ color, label, value }: { color: string; label: string; value: number }) {
  return <div className="p-3"><p className="flex items-center gap-2 text-xs text-slate-500"><span className={`h-2 w-2 rounded-full ${color}`} />{label}</p><p className="mt-1 text-xl font-semibold tabular-nums">{value}</p></div>;
}

function HourlyChart({ data }: { data: StatisticsDashboard["hourly"] }) {
  if (data.every((point) => point.appointments === 0)) {
    return <ChartEmpty icon={Clock3} message="Chưa có lượt đặt theo khung giờ." />;
  }
  const max = Math.max(1, ...data.map((point) => point.appointments));
  return (
    <div className="space-y-3">
      {data.map((point) => (
        <div key={point.time} className="grid grid-cols-[48px_minmax(60px,1fr)_155px] items-center gap-3 text-xs">
          <span className="font-bold tabular-nums text-slate-700">{point.time.slice(0, 5)}</span>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${point.appointments / max * 100}%` }} />
          </div>
          <span className="whitespace-nowrap text-right tabular-nums text-slate-500">
            <strong className="text-slate-800">{point.appointments}</strong> đặt · {point.completed} khám · {point.released} trả
          </span>
        </div>
      ))}
    </div>
  );
}

function ChartEmpty({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="flex min-h-36 flex-col items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50/50 px-4 text-center">
      <Icon size={22} className="mb-2 text-slate-400" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

function CapacityCard({ data }: { data: StatisticsDashboard }) {
  const { summary } = data;
  const width = Math.min(100, summary.occupancyRate);
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <SectionHeading title="Công suất đang sử dụng" subtitle="Suất hiện đang giữ trên tổng công suất" />
      <div className="flex items-end justify-between">
        <p className="text-4xl font-bold text-slate-950">{summary.occupancyRate}%</p>
        <p className="text-xs text-slate-500">{summary.occupiedSlots}/{summary.totalCapacity} suất</p>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-slate-700" style={{ width: `${width}%` }} />
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-400">Suất đã giải phóng không tính là đang sử dụng nhưng lịch sử đặt vẫn được giữ.</p>
    </div>
  );
}

function HighlightsCard({ data }: { data: StatisticsDashboard }) {
  const { highlights } = data;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <SectionHeading title="Điểm nổi bật" subtitle="Trong khoảng thời gian đã chọn" />
      <div className="space-y-3">
        <div className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
          <CalendarDays size={18} className="mt-0.5 shrink-0 text-slate-500" />
          <div><p className="text-xs text-slate-500">Ngày nhiều lịch nhất</p><p className="mt-1 text-sm font-semibold text-slate-800">{highlights.busiestDate ? longDate.format(new Date(`${highlights.busiestDate}T00:00:00`)) : "Chưa có dữ liệu"}</p>{highlights.busiestDate && <p className="text-xs text-slate-500">{highlights.busiestDateAppointments} lịch hẹn</p>}</div>
        </div>
        <div className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
          <Clock3 size={18} className="mt-0.5 shrink-0 text-slate-500" />
          <div><p className="text-xs text-slate-500">Khung giờ được đặt nhiều nhất</p><p className="mt-1 text-sm font-semibold text-slate-800">{highlights.busiestTime ? highlights.busiestTime.slice(0, 5) : "Chưa có dữ liệu"}</p>{highlights.busiestTime && <p className="text-xs text-slate-500">{highlights.busiestTimeAppointments} lượt đặt</p>}</div>
        </div>
      </div>
    </div>
  );
}

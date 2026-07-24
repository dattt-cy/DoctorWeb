"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity, CalendarCheck, CalendarClock, CalendarDays, Clock3,
  Loader2, RefreshCw, RotateCcw, UsersRound,
} from "lucide-react";
import { getStatistics, StatisticsDashboard } from "@/lib/statistics-api";

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
  const initial = useMemo(monthRange, []);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
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
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Tổng quan vận hành</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Thống kê phòng khám</h1>
          <p className="mt-1 text-sm text-slate-500">Theo dõi lịch khám, bệnh nhân và mức sử dụng suất.</p>
        </div>
        <button onClick={load} disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50">
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />Làm mới
        </button>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
        <div className="flex min-h-80 items-center justify-center rounded-2xl border bg-white">
          <Loader2 className="animate-spin text-blue-600" size={30} />
        </div>
      ) : data ? <DashboardContent data={data} /> : null}
    </div>
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
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {cards.map((card) => <MetricCard key={card.label} {...card} />)}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <SectionHeading title="Lịch hẹn theo ngày" subtitle="Màu xanh: đã khám · Màu cam: chưa khám" />
          <DailyChart data={data.daily} />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeading title="Bệnh nhân" subtitle="Bệnh nhân duy nhất trong kỳ" />
          <PatientBreakdown data={data} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
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
  blue: "bg-blue-50 text-blue-700", emerald: "bg-emerald-50 text-emerald-700",
  orange: "bg-orange-50 text-orange-700", violet: "bg-violet-50 text-violet-700",
  cyan: "bg-cyan-50 text-cyan-700", rose: "bg-rose-50 text-rose-700",
};

function MetricCard({ label, value, note, icon: Icon, color }: {
  label: string; value: number; note: string; icon: React.ElementType; color: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}><Icon size={20} /></div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums text-slate-950">{number.format(value)}</p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </article>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="mb-5"><h2 className="font-bold text-slate-900">{title}</h2><p className="mt-0.5 text-xs text-slate-500">{subtitle}</p></div>;
}

function DailyChart({ data }: { data: StatisticsDashboard["daily"] }) {
  const max = Math.max(1, ...data.map((point) => point.appointments));
  const visibleLabels = data.length <= 14 ? 1 : Math.ceil(data.length / 10);
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex h-64 min-w-[620px] items-end gap-2 border-b border-slate-200 px-1">
        {data.map((point, index) => {
          const totalHeight = point.appointments ? Math.max(12, point.appointments / max * 190) : 2;
          const completedHeight = point.appointments ? totalHeight * point.completed / point.appointments : 0;
          const pendingHeight = totalHeight - completedHeight;
          return (
            <div key={point.date} className="group flex min-w-4 flex-1 flex-col items-center justify-end">
              <div className="pointer-events-none mb-2 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] text-white group-hover:block">
                {shortDate.format(new Date(`${point.date}T00:00:00`))}: {point.appointments} lịch
              </div>
              <div className="flex w-full max-w-8 flex-col-reverse overflow-hidden rounded-t-md" style={{ height: totalHeight }}>
                <div className="bg-emerald-500" style={{ height: completedHeight }} />
                <div className="bg-orange-400" style={{ height: pendingHeight }} />
              </div>
              <span className="mt-2 h-4 text-[9px] text-slate-400">
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
  return (
    <div>
      <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full"
        style={{ background: `conic-gradient(#2563eb 0 ${newPercent}%, #8b5cf6 ${newPercent}% 100%)` }}>
        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
          <UsersRound size={22} className="text-slate-400" />
          <span className="mt-1 text-3xl font-bold">{summary.uniquePatients}</span>
          <span className="text-[10px] uppercase text-slate-400">bệnh nhân</span>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <BreakdownItem color="bg-blue-600" label="Bệnh nhân mới" value={summary.newPatients} />
        <BreakdownItem color="bg-violet-500" label="Quay lại" value={summary.returningPatients} />
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-400">Bệnh nhân được nhận diện theo tên và số điện thoại.</p>
    </div>
  );
}

function BreakdownItem({ color, label, value }: { color: string; label: string; value: number }) {
  return <div className="rounded-xl bg-slate-50 p-3"><p className="flex items-center gap-2 text-xs text-slate-500"><span className={`h-2 w-2 rounded-full ${color}`} />{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>;
}

function HourlyChart({ data }: { data: StatisticsDashboard["hourly"] }) {
  const max = Math.max(1, ...data.map((point) => point.appointments));
  return (
    <div className="space-y-3">
      {data.map((point) => (
        <div key={point.time} className="grid grid-cols-[48px_1fr_155px] items-center gap-3 text-xs">
          <span className="font-bold tabular-nums text-slate-700">{point.time.slice(0, 5)}</span>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${point.appointments / max * 100}%` }} />
          </div>
          <span className="text-right tabular-nums text-slate-500">
            <strong className="text-slate-800">{point.appointments}</strong> đặt · {point.completed} khám · {point.released} trả
          </span>
        </div>
      ))}
    </div>
  );
}

function CapacityCard({ data }: { data: StatisticsDashboard }) {
  const { summary } = data;
  const width = Math.min(100, summary.occupancyRate);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeading title="Công suất đang sử dụng" subtitle="Suất hiện đang giữ trên tổng công suất" />
      <div className="flex items-end justify-between">
        <p className="text-4xl font-bold text-slate-950">{summary.occupancyRate}%</p>
        <p className="text-xs text-slate-500">{summary.occupiedSlots}/{summary.totalCapacity} suất</p>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: `${width}%` }} />
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-400">Suất đã giải phóng không tính là đang sử dụng nhưng lịch sử đặt vẫn được giữ.</p>
    </div>
  );
}

function HighlightsCard({ data }: { data: StatisticsDashboard }) {
  const { highlights } = data;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeading title="Điểm nổi bật" subtitle="Trong khoảng thời gian đã chọn" />
      <div className="space-y-3">
        <div className="flex gap-3 rounded-xl bg-blue-50 p-3">
          <CalendarDays size={18} className="mt-0.5 shrink-0 text-blue-600" />
          <div><p className="text-xs text-blue-600">Ngày nhiều lịch nhất</p><p className="mt-1 text-sm font-bold text-slate-800">{highlights.busiestDate ? longDate.format(new Date(`${highlights.busiestDate}T00:00:00`)) : "Chưa có dữ liệu"}</p>{highlights.busiestDate && <p className="text-xs text-slate-500">{highlights.busiestDateAppointments} lịch hẹn</p>}</div>
        </div>
        <div className="flex gap-3 rounded-xl bg-orange-50 p-3">
          <Clock3 size={18} className="mt-0.5 shrink-0 text-orange-600" />
          <div><p className="text-xs text-orange-600">Khung giờ được đặt nhiều nhất</p><p className="mt-1 text-sm font-bold text-slate-800">{highlights.busiestTime ? highlights.busiestTime.slice(0, 5) : "Chưa có dữ liệu"}</p>{highlights.busiestTime && <p className="text-xs text-slate-500">{highlights.busiestTimeAppointments} lượt đặt</p>}</div>
        </div>
      </div>
    </div>
  );
}

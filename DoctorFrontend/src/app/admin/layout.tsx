import { FileText, Home, LayoutDashboard, Stethoscope } from "lucide-react";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Quản trị nội dung - DoctorWeb",
};

const navigation = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/blog", label: "Bài viết", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Stethoscope size={20} />
          </span>
          <div>
            <p className="font-bold leading-tight text-slate-950">Doctor Admin</p>
            <p className="text-xs text-slate-400">Quản trị nội dung</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Không gian làm việc</p>
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700">
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900">
            <Home size={18} /> Về trang chủ
          </Link>
        </div>
      </aside>

      <div className="lg:pl-64">
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-slate-950"><Stethoscope size={20} className="text-blue-600" /> Doctor Admin</Link>
          <div className="flex items-center gap-1">
            <Link href="/admin" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Tổng quan"><LayoutDashboard size={19} /></Link>
            <Link href="/admin/blog" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Bài viết"><FileText size={19} /></Link>
          </div>
        </div>
        <main className="mx-auto max-w-[1600px] p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

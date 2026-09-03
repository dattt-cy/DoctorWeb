"use client";

import { CalendarDays, ExternalLink, FileText, LayoutDashboard, LogOut, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/shared/api/client";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { href: "/admin/appointments", label: "Lịch hẹn", icon: CalendarDays },
  { href: "/admin/patients", label: "Bệnh nhân", icon: Users },
  { href: "/admin/blog", label: "Bài viết", icon: FileText },
];

const pageNames = [
  { prefix: "/admin/blog/create", title: "Viết bài mới" },
  { prefix: "/admin/blog/", title: "Chỉnh sửa bài viết" },
  { prefix: "/admin/appointments", title: "Lịch hẹn" },
  { prefix: "/admin/patients/", title: "Hồ sơ bệnh nhân" },
  { prefix: "/admin/patients", title: "Bệnh nhân" },
  { prefix: "/admin/blog", title: "Bài viết" },
  { prefix: "/admin", title: "Tổng quan" },
];

export default function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const redirectToLogin = () => router.replace("/admin/login");
    window.addEventListener("doctorweb:unauthorized", redirectToLogin);
    return () => window.removeEventListener("doctorweb:unauthorized", redirectToLogin);
  }, [router]);

  if (pathname === "/admin/login") return <>{children}</>;

  async function logout() {
    await apiRequest<void>("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const currentTitle = pageNames.find(({ prefix }) => pathname.startsWith(prefix))?.title ?? "Quản trị";

  return (
    <div className="admin-ui min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-16 items-center gap-3 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-600 text-xs font-bold tracking-tight text-white">NV</span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Nhi Vita</p>
            <p className="text-xs text-slate-500">Quản trị phòng khám</p>
          </div>
        </div>
        <Separator />
        <nav className="space-y-1 p-3" aria-label="Điều hướng quản trị">
          {navigation.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={cn("flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950", active && "bg-slate-100 text-slate-950")}>
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />{label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute inset-x-0 bottom-0 p-3">
          <Separator className="mb-3" />
          <Button asChild variant="ghost" className="w-full justify-start font-medium"><Link href="/" target="_blank"><ExternalLink size={16} />Xem website</Link></Button>
          <Button variant="ghost" onClick={logout} className="mt-1 w-full justify-start font-medium text-slate-600 hover:text-red-700"><LogOut size={16} />Đăng xuất</Button>
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div><p className="text-xs text-slate-500">Nhi Vita / Quản trị</p><h1 className="text-sm font-semibold text-slate-900">{currentTitle}</h1></div>
            <div className="flex items-center gap-1 lg:hidden">
              <Button asChild variant="ghost" size="icon" aria-label="Xem website"><Link href="/"><ExternalLink size={17} /></Link></Button>
              <Button variant="ghost" size="icon" onClick={logout} aria-label="Đăng xuất"><LogOut size={17} /></Button>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 lg:hidden" aria-label="Điều hướng quản trị trên di động">
            {navigation.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return <Link key={href} href={href} className={cn("flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-slate-600", active && "bg-slate-100 text-slate-950")}><Icon size={15} />{label}</Link>;
            })}
          </nav>
        </header>
        <main className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

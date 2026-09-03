"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Loader2 } from "lucide-react";
import { apiRequest } from "@/shared/api/client";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiRequest<{ username: string }>("/api/admin/auth/login", { method: "POST", body: JSON.stringify({ username, password }) });
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Tên đăng nhập hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-orange-600 text-xs font-bold text-white">NV</span>
          <div><p className="font-semibold text-slate-950">Nhi Vita</p><p className="text-xs text-slate-500">Hệ thống quản trị phòng khám</p></div>
        </div>
        <Card className="shadow-none">
          <CardHeader className="space-y-2 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600"><LockKeyhole size={17} /></div>
            <div><h1 className="text-lg font-semibold tracking-tight">Đăng nhập</h1><p className="mt-1 text-sm text-slate-500">Nhập thông tin quản trị để tiếp tục.</p></div>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>}
              <div className="space-y-2"><Label htmlFor="username">Tên đăng nhập</Label><Input id="username" autoFocus autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="password">Mật khẩu</Label><Input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
              <Button disabled={loading} className="w-full">{loading && <Loader2 size={16} className="animate-spin" />}Đăng nhập</Button>
            </form>
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-xs text-slate-400">Khu vực dành riêng cho nhân sự phòng khám.</p>
      </div>
    </main>
  );
}

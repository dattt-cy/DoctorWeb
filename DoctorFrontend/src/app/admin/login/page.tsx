"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/blog-api";
import { Loader2, Stethoscope } from "lucide-react";

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
      await apiRequest<{ username: string }>("/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      router.replace("/admin/blog");
      router.refresh();
    } catch {
      setError("Tên đăng nhập hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-xl bg-blue-600 p-2.5 text-white"><Stethoscope /></span>
          <div><h1 className="font-bold text-slate-950">Doctor Admin</h1><p className="text-sm text-slate-500">Đăng nhập quản trị nội dung</p></div>
        </div>
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <label className="text-sm font-medium text-slate-700">Tên đăng nhập</label>
        <input autoFocus value={username} onChange={(e) => setUsername(e.target.value)} className="mb-4 mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500" />
        <label className="text-sm font-medium text-slate-700">Mật khẩu</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500" />
        <button disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white disabled:opacity-60">
          {loading && <Loader2 size={17} className="animate-spin" />} Đăng nhập
        </button>
      </form>
    </div>
  );
}

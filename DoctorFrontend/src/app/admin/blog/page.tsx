"use client";

import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  FileText,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminBlogPost, apiRequest, BlogPage, BlogStatus } from "@/lib/blog-api";

const EMPTY_PAGE: BlogPage = {
  content: [],
  number: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
};

export default function AdminBlogList() {
  const [data, setData] = useState<BlogPage>(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | BlogStatus>("ALL");
  const [page, setPage] = useState(0);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest<BlogPage>(
        `/api/admin/blogs?page=${page}&size=10&sort=updatedAt,desc`,
      );
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách bài viết.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => setPage(0), [query, status]);

  const visiblePosts = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("vi-VN");
    return data.content.filter((post) => {
      const matchesStatus = status === "ALL" || post.status === status;
      const matchesQuery =
        !keyword ||
        post.title.toLocaleLowerCase("vi-VN").includes(keyword) ||
        (post.category || "").toLocaleLowerCase("vi-VN").includes(keyword);
      return matchesStatus && matchesQuery;
    });
  }, [data.content, query, status]);

  const deletePost = async (post: AdminBlogPost) => {
    if (!window.confirm(`Xóa bài viết “${post.title}”? Thao tác này không thể hoàn tác.`)) return;
    try {
      await apiRequest<void>(`/api/admin/blogs/${post.id}`, { method: "DELETE" });
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xóa bài viết.");
    }
  };

  const publishedOnPage = data.content.filter((post) => post.status === "PUBLISHED").length;
  const draftsOnPage = data.content.filter((post) => post.status === "DRAFT").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Bài viết</h1>
          <p className="mt-1 text-sm text-slate-500">Soạn thảo và quản lý nội dung sức khỏe.</p>
        </div>
        <Link href="/admin/blog/create" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          <Plus size={18} /> Viết bài mới
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Tổng bài viết" value={data.totalElements} icon={<FileText size={18} />} tone="blue" />
        <Stat label="Đã xuất bản (trang này)" value={publishedOnPage} icon={<Eye size={18} />} tone="green" />
        <Stat label="Bản nháp (trang này)" value={draftsOnPage} icon={<Edit3 size={18} />} tone="amber" />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center">
          <label className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tiêu đề hoặc chuyên mục…" className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value as "ALL" | BlogStatus)} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500">
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PUBLISHED">Đã xuất bản</option>
            <option value="DRAFT">Bản nháp</option>
          </select>
        </div>

        {error && <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Bài viết</th>
                <th className="px-5 py-3">Chuyên mục</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3">Cập nhật</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="h-52 text-center text-sm text-slate-500"><Loader2 className="mx-auto mb-2 animate-spin" />Đang tải bài viết…</td></tr>
              ) : visiblePosts.length === 0 ? (
                <tr><td colSpan={5} className="h-52 text-center"><FileText className="mx-auto mb-3 text-slate-300" size={36} /><p className="font-medium text-slate-700">Không tìm thấy bài viết</p><p className="mt-1 text-sm text-slate-400">Thử thay đổi từ khóa hoặc bộ lọc.</p></td></tr>
              ) : visiblePosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 flex-none overflow-hidden rounded-lg bg-slate-100">
                        {post.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
                        ) : <FileText className="m-auto mt-3 text-slate-300" size={22} />}
                      </div>
                      <div className="min-w-0"><p className="max-w-md truncate font-semibold text-slate-900">{post.title}</p><p className="mt-1 max-w-md truncate text-xs text-slate-400">/{post.slug}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{post.category || "Chưa phân loại"}</td>
                  <td className="px-5 py-4"><StatusBadge status={post.status} /></td>
                  <td className="px-5 py-4 text-sm text-slate-500">{formatDate(post.updatedAt || post.publishedAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      {post.status === "PUBLISHED" && <Link href={`/blog/${post.slug}`} target="_blank" aria-label="Xem bài viết" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600"><Eye size={17} /></Link>}
                      <Link href={`/admin/blog/${post.id}/edit`} aria-label="Sửa bài viết" className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"><Edit3 size={17} /></Link>
                      <button onClick={() => deletePost(post)} aria-label="Xóa bài viết" className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm text-slate-500">
          <span>Trang {data.totalPages ? data.number + 1 : 0}/{data.totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((value) => Math.max(0, value - 1))} disabled={page === 0 || loading} className="rounded-lg border border-slate-300 p-2 hover:bg-slate-50 disabled:opacity-40" aria-label="Trang trước"><ChevronLeft size={17} /></button>
            <button onClick={() => setPage((value) => value + 1)} disabled={page + 1 >= data.totalPages || loading} className="rounded-lg border border-slate-300 p-2 hover:bg-slate-50 disabled:opacity-40" aria-label="Trang sau"><ChevronRight size={17} /></button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const published = status === "PUBLISHED";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{published ? "Đã xuất bản" : "Bản nháp"}</span>;
}

function Stat({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone: "blue" | "green" | "amber" }) {
  const colors = { blue: "bg-blue-50 text-blue-700", green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700" };
  return <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><span className={`rounded-lg p-2.5 ${colors[tone]}`}>{icon}</span><div><p className="text-2xl font-bold text-slate-950">{value}</p><p className="text-xs text-slate-500">{label}</p></div></div>;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

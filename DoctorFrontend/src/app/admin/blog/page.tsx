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
import type { AdminBlogPost, BlogPage, BlogStatus } from "@/features/blog/types";
import { apiRequest } from "@/shared/api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Bài viết</h1>
          <p className="mt-1 text-sm text-slate-500">Soạn thảo và quản lý nội dung sức khỏe.</p>
        </div>
        <Button asChild><Link href="/admin/blog/create"><Plus size={17} />Viết bài mới</Link></Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Tổng bài viết" value={data.totalElements} icon={<FileText size={18} />} tone="blue" />
        <Stat label="Đã xuất bản (trang này)" value={publishedOnPage} icon={<Eye size={18} />} tone="green" />
        <Stat label="Bản nháp (trang này)" value={draftsOnPage} icon={<Edit3 size={18} />} tone="amber" />
      </div>

      <Card className="overflow-hidden shadow-none">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center">
          <label className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tiêu đề hoặc chuyên mục…" className="pl-10" />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value as "ALL" | BlogStatus)} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-200">
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PUBLISHED">Đã xuất bản</option>
            <option value="DRAFT">Bản nháp</option>
          </select>
        </div>

        {error && <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 text-xs font-medium text-slate-500">
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
                      {post.status === "PUBLISHED" && <Button asChild variant="ghost" size="icon"><Link href={`/blog/${post.slug}`} target="_blank" aria-label="Xem bài viết"><Eye size={16} /></Link></Button>}
                      <Button asChild variant="ghost" size="icon"><Link href={`/admin/blog/${post.id}/edit`} aria-label="Sửa bài viết"><Edit3 size={16} /></Link></Button>
                      <Button onClick={() => deletePost(post)} variant="ghost" size="icon" aria-label="Xóa bài viết" className="hover:text-red-700"><Trash2 size={16} /></Button>
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
            <Button onClick={() => setPage((value) => Math.max(0, value - 1))} disabled={page === 0 || loading} variant="outline" size="icon" aria-label="Trang trước"><ChevronLeft size={17} /></Button>
            <Button onClick={() => setPage((value) => value + 1)} disabled={page + 1 >= data.totalPages || loading} variant="outline" size="icon" aria-label="Trang sau"><ChevronRight size={17} /></Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const published = status === "PUBLISHED";
  return <Badge variant={published ? "success" : "warning"}>{published ? "Đã xuất bản" : "Bản nháp"}</Badge>;
}

function Stat({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone: "blue" | "green" | "amber" }) {
  const colors = { blue: "bg-blue-50 text-blue-700", green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700" };
  return <Card className="flex items-center gap-3 p-4 shadow-none"><span className={`rounded-md p-2 ${colors[tone]}`}>{icon}</span><div><p className="text-xl font-semibold tabular-nums text-slate-950">{value}</p><p className="text-xs text-slate-500">{label}</p></div></Card>;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

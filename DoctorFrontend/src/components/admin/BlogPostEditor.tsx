"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Eye,
  ImagePlus,
  Loader2,
  Save,
  Send,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import RichTextEditor from "./RichTextEditor";
import {
  AdminBlogPost,
  BlogRevision,
  apiRequest,
  BlogPostPayload,
  BlogStatus,
  uploadBlogImage,
} from "@/lib/blog-api";

const CATEGORIES = ["Dinh dưỡng", "Tiêm chủng", "Hô hấp", "Phát triển", "Phòng bệnh"];

const EMPTY_POST: BlogPostPayload = {
  title: "",
  category: CATEGORIES[0],
  excerpt: "",
  coverImage: "",
  coverImageAlt: "",
  coverPositionX: 50,
  coverPositionY: 50,
  content: "",
  status: "DRAFT",
  seoTitle: "",
  seoDescription: "",
  primaryKeyword: "",
  tags: "",
};

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

export default function BlogPostEditor({ postId }: { postId?: string }) {
  const router = useRouter();
  const storageKey = `doctor-blog-draft-${postId || "new"}`;
  const [post, setPost] = useState<BlogPostPayload>(EMPTY_POST);
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(Boolean(postId));
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showPublish, setShowPublish] = useState(false);
  const [revisions, setRevisions] = useState<BlogRevision[]>([]);
  const [loadingRevisions, setLoadingRevisions] = useState(false);
  const initialized = useRef(false);

  const update = <K extends keyof BlogPostPayload>(key: K, value: BlogPostPayload[K]) => {
    setPost((current) => ({ ...current, [key]: value }));
    setSaveState("dirty");
    setError("");
  };

  useEffect(() => {
    const load = async () => {
      try {
        if (postId) {
          const data = await apiRequest<AdminBlogPost>(`/api/admin/blogs/${postId}`);
          setSlug(data.slug || "");
          setPost({
            title: data.title || "",
            category: data.category || CATEGORIES[0],
            excerpt: data.excerpt || "",
            coverImage: data.coverImage || "",
            coverImageAlt: data.coverImageAlt || "",
            coverPositionX: data.coverPositionX ?? 50,
            coverPositionY: data.coverPositionY ?? 50,
            content: data.content || "",
            status: data.status || "DRAFT",
            seoTitle: data.seoTitle || "",
            seoDescription: data.seoDescription || "",
            primaryKeyword: data.primaryKeyword || "",
            tags: data.tags || "",
          });
        } else {
          const cached = localStorage.getItem(storageKey);
          if (cached) setPost({ ...EMPTY_POST, ...JSON.parse(cached) });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải bài viết.");
      } finally {
        initialized.current = true;
        setLoading(false);
      }
    };
    load();
  }, [postId, storageKey]);

  useEffect(() => {
    if (!initialized.current || saveState !== "dirty") return;
    const timer = window.setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(post));
      setLastSavedAt(new Date());
      setSaveState("saved");
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [post, saveState, storageKey]);

  useEffect(() => {
    if (!postId || !initialized.current) return;
    const timer = window.setTimeout(async () => {
      try {
        await apiRequest(`/api/admin/blogs/${postId}/autosave`, {
          method: "PUT",
          body: JSON.stringify(post),
        });
        setLastSavedAt(new Date());
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    }, 30000);
    return () => window.clearTimeout(timer);
  }, [post, postId]);

  const loadRevisions = async () => {
    if (!postId) return;
    setLoadingRevisions(true);
    try {
      setRevisions(await apiRequest<BlogRevision[]>(`/api/admin/blogs/${postId}/revisions`));
    } finally {
      setLoadingRevisions(false);
    }
  };

  const restoreRevision = async (revisionId: number) => {
    if (!postId || !window.confirm("Khôi phục phiên bản này? Nội dung hiện tại vẫn được lưu vào lịch sử.")) return;
    await apiRequest(`/api/admin/blogs/${postId}/revisions/${revisionId}/restore`, { method: "POST" });
    window.location.reload();
  };

  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => {
      if (saveState === "dirty" || saveState === "saving") event.preventDefault();
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [saveState]);

  const plainText = useMemo(
    () => post.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
    [post.content],
  );
  const wordCount = plainText ? plainText.split(" ").length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 220));
  const tags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const autoSeoTitle = post.seoTitle.trim() || truncateAtWord(post.title, 60);
  const autoSeoDescription = post.seoDescription.trim() || truncateAtWord(post.excerpt || plainText, 160);
  const autoKeyword = post.primaryKeyword.trim() || deriveKeyword(post.title);
  const autoImageAlt = post.coverImageAlt.trim() || post.title.trim();

  const validate = useCallback(
    (status: BlogStatus) => {
      if (!post.title.trim()) return "Vui lòng nhập tiêu đề bài viết.";
      if (status === "PUBLISHED" && plainText.length < 50)
        return "Nội dung quá ngắn để xuất bản.";
      if (status === "PUBLISHED" && !post.excerpt.trim())
        return "Vui lòng thêm đoạn mô tả ngắn.";
      return "";
    },
    [plainText.length, post.excerpt, post.title],
  );

  const save = async (status: BlogStatus) => {
    const validationError = validate(status);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaveState("saving");
    setError("");
    try {
      const saved = await apiRequest<AdminBlogPost>(
        postId ? `/api/admin/blogs/${postId}` : "/api/admin/blogs",
        {
          method: postId ? "PUT" : "POST",
          body: JSON.stringify({
            ...post,
            status,
            seoTitle: autoSeoTitle,
            seoDescription: autoSeoDescription,
            primaryKeyword: autoKeyword,
            coverImageAlt: autoImageAlt,
          }),
        },
      );
      localStorage.removeItem(storageKey);
      setPost((current) => ({ ...current, status }));
      setLastSavedAt(new Date());
      setSaveState("saved");
      setShowPublish(false);
      if (!postId) router.replace(`/admin/blog/${saved.id}/edit`);
    } catch (err) {
      setSaveState("error");
      setError(err instanceof Error ? err.message : "Không thể lưu bài viết.");
    }
  };

  const uploadCover = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn một tệp ảnh.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Ảnh bìa không được lớn hơn 5 MB.");
      return;
    }
    setUploading(true);
    try {
      update("coverImage", await uploadBlogImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tải ảnh thất bại.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-3 animate-spin" /> Đang tải bài viết…
      </div>
    );
  }

  return (
    <div className="-m-4 min-h-screen bg-slate-50 md:-m-8">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-3">
          <Link
            href="/admin/blog"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Quay lại danh sách"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {post.title || (postId ? "Chỉnh sửa bài viết" : "Bài viết mới")}
            </p>
            <p className="flex items-center gap-1 text-xs text-slate-500">
              {saveState === "saving" && <><Loader2 size={12} className="animate-spin" /> Đang lưu…</>}
              {saveState === "dirty" && "Có thay đổi chưa lưu"}
              {saveState === "error" && "Lưu chưa thành công"}
              {(saveState === "saved" || saveState === "idle") && (
                <><Check size={12} /> {lastSavedAt ? `Đã lưu lúc ${lastSavedAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}` : "Sẵn sàng soạn thảo"}</>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => save("DRAFT")}
            disabled={saveState === "saving"}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <Save size={16} /> Lưu nháp
          </button>
          {postId && (
            <Link
              href={slug ? `/blog/${slug}` : "#"}
              target="_blank"
              aria-disabled={!slug}
              className={`hidden items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 lg:inline-flex ${!slug ? "pointer-events-none opacity-50" : ""}`}
            >
              <Eye size={16} /> Xem trang
            </Link>
          )}
          <button
            type="button"
            onClick={() => setShowPublish(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Send size={16} /> {post.status === "PUBLISHED" ? "Cập nhật" : "Xuất bản"}
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1440px] gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:p-8">
        <section className="min-w-0 space-y-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6 md:p-8">
              <input
                value={post.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder="Tiêu đề bài viết"
                className="w-full border-0 bg-transparent text-3xl font-bold tracking-tight text-slate-950 outline-none placeholder:text-slate-300 md:text-4xl"
                maxLength={255}
              />
              <textarea
                value={post.excerpt}
                onChange={(event) => update("excerpt", event.target.value)}
                placeholder="Viết 1–2 câu giúp người đọc hiểu bài viết nói về điều gì…"
                rows={2}
                maxLength={500}
                className="mt-4 w-full resize-none border-0 bg-transparent text-base leading-7 text-slate-600 outline-none placeholder:text-slate-400"
              />
              <div className="mt-2 text-right text-xs text-slate-400">{post.excerpt.length}/500</div>
            </div>
            <ContentTools
              hasContent={Boolean(plainText)}
              onInsert={(html) => update("content", `${post.content}${html}`)}
              onTemplate={(html) => {
                if (!plainText || window.confirm("Thay nội dung hiện tại bằng mẫu đã chọn?")) update("content", html);
              }}
            />
            <RichTextEditor content={post.content} onChange={(value) => update("content", value)} />
            <div className="flex gap-4 border-t border-slate-100 px-6 py-3 text-xs text-slate-500">
              <span>{wordCount.toLocaleString("vi-VN")} từ</span>
              <span>Khoảng {readingTime} phút đọc</span>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <Panel title="Xuất bản" defaultOpen>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Trạng thái</span><strong>{post.status === "PUBLISHED" ? "Đã xuất bản" : "Bản nháp"}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Số từ</span><strong>{wordCount}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Thời gian đọc</span><strong>{readingTime} phút</strong></div>
            </div>
          </Panel>

          <Panel title="Phân loại" defaultOpen>
            <label className="mb-2 block text-sm font-medium text-slate-700">Chuyên mục</label>
            <select value={post.category} onChange={(event) => update("category", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
            </select>
            <label className="mb-2 mt-4 block text-sm font-medium text-slate-700">Thẻ</label>
            <input value={post.tags} onChange={(event) => update("tags", event.target.value)} placeholder="dinh dưỡng, trẻ em" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            {tags.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{tags.map((tag) => <span key={tag} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700">{tag}</span>)}</div>}
          </Panel>

          <Panel title="Ảnh đại diện" defaultOpen>
            {post.coverImage ? (
              <CoverPositionEditor
                src={post.coverImage}
                x={post.coverPositionX}
                y={post.coverPositionY}
                onChange={(x, y) => {
                  setPost((current) => ({ ...current, coverPositionX: x, coverPositionY: y }));
                  setSaveState("dirty");
                }}
                onRemove={() => update("coverImage", "")}
              />
            ) : (
              <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 p-7 text-center hover:border-blue-400 hover:bg-blue-50/50">
                {uploading ? <Loader2 className="mb-2 animate-spin text-blue-600" /> : <ImagePlus className="mb-2 text-slate-400" />}
                <span className="text-sm font-medium text-slate-700">{uploading ? "Đang tải ảnh…" : "Chọn hoặc kéo ảnh vào đây"}</span>
                <span className="mt-1 text-xs text-slate-400">JPG, PNG, WEBP · tối đa 5 MB</span>
                <input type="file" accept="image/*" disabled={uploading} onChange={(event) => uploadCover(event.target.files?.[0])} className="sr-only" />
              </label>
            )}
            {post.coverImage && <p className="mt-3 text-xs text-emerald-700">Mô tả ảnh SEO được tạo tự động từ tiêu đề bài viết.</p>}
          </Panel>

          <Panel title="Tối ưu tìm kiếm (SEO)">
            <div className="rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-800">
              SEO đang được tạo tự động từ tiêu đề, mô tả ngắn và nội dung bài viết.
            </div>
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <p className="truncate text-sm text-emerald-700">doctorweb.vn › blog › {slug || "duong-dan-bai-viet"}</p>
              <p className="mt-1 line-clamp-1 text-lg text-blue-700">{autoSeoTitle || "Tiêu đề bài viết trên Google"}</p>
              <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">{autoSeoDescription || "Mô tả bài viết sẽ xuất hiện tại đây."}</p>
            </div>
          </Panel>
          {postId && (
            <Panel title="Lịch sử phiên bản">
              <button type="button" onClick={loadRevisions} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                {loadingRevisions ? "Đang tải…" : "Xem các phiên bản đã lưu"}
              </button>
              {revisions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {revisions.map((revision) => (
                    <div key={revision.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 p-3 text-xs">
                      <div className="min-w-0"><p className="truncate font-semibold text-slate-700">{revision.title}</p><p className="text-slate-400">{new Date(revision.createdAt).toLocaleString("vi-VN")}</p></div>
                      <button type="button" onClick={() => restoreRevision(revision.id)} className="font-semibold text-blue-600">Khôi phục</button>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          )}
        </aside>
      </main>

      {showPublish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={() => setShowPublish(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <h2 className="text-xl font-bold text-slate-950">{post.status === "PUBLISHED" ? "Cập nhật bài viết?" : "Sẵn sàng xuất bản?"}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Bài viết sẽ hiển thị công khai. Hãy kiểm tra tiêu đề, mô tả và nội dung trước khi tiếp tục.</p>
            <div className="mt-5 space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
              <CheckItem ok={Boolean(post.title.trim())} label="Có tiêu đề" />
              <CheckItem ok={plainText.length >= 50} label="Nội dung đủ dài" />
              <CheckItem ok={Boolean(post.excerpt.trim())} label="Có mô tả ngắn" />
              <CheckItem ok={Boolean(post.coverImage)} label="Có ảnh đại diện (khuyến nghị)" optional />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowPublish(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Quay lại</button>
              <button onClick={() => save("PUBLISHED")} disabled={saveState === "saving"} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                {saveState === "saving" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Xác nhận {post.status === "PUBLISHED" ? "cập nhật" : "xuất bản"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Panel({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group rounded-2xl border border-slate-200 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-semibold text-slate-900">
        {title}<ChevronDown size={18} className="text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-slate-100 px-5 py-4">{children}</div>
    </details>
  );
}

function CheckItem({ ok, label, optional = false }: { ok: boolean; label: string; optional?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`flex h-5 w-5 items-center justify-center rounded-full ${ok ? "bg-emerald-100 text-emerald-700" : optional ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{ok ? <Check size={13} /> : "!"}</span>
      <span className="text-slate-700">{label}</span>
    </div>
  );
}

function CoverPositionEditor({
  src, x, y, onChange, onRemove,
}: {
  src: string;
  x: number;
  y: number;
  onChange: (x: number, y: number) => void;
  onRemove: () => void;
}) {
  const frame = useRef<HTMLDivElement>(null);

  const move = (clientX: number, clientY: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    const nextX = Math.round(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
    const nextY = Math.round(Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)));
    onChange(nextX, nextY);
  };

  return (
    <div>
      <div
        ref={frame}
        className="group relative aspect-[16/9] touch-none select-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100 cursor-grab active:cursor-grabbing"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          move(event.clientX, event.clientY);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) move(event.clientX, event.clientY);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="Ảnh đại diện bài viết" draggable={false} className="h-full w-full object-cover pointer-events-none" style={{ objectPosition: `${x}% ${y}%` }} />
        <span className="pointer-events-none absolute inset-x-0 bottom-2 mx-auto w-fit rounded-full bg-slate-950/65 px-3 py-1 text-xs text-white">Kéo để chọn vùng hiển thị</span>
        <button onPointerDown={(event) => event.stopPropagation()} onClick={onRemove} className="absolute right-2 top-2 rounded-lg bg-white/95 p-2 text-red-600 shadow hover:bg-white" aria-label="Xóa ảnh"><Trash2 size={16} /></button>
      </div>
      <button type="button" onClick={() => onChange(50, 50)} className="mt-2 text-xs font-medium text-slate-500 hover:text-blue-600">Đưa ảnh về chính giữa</button>
    </div>
  );
}

const BLOG_TEMPLATES = {
  "Bệnh thường gặp": `<h2>Tổng quan</h2><p></p><h2>Nguyên nhân</h2><p></p><h2>Dấu hiệu thường gặp</h2><p></p><h2>Cách chăm sóc tại nhà</h2><p></p><h2>Khi nào cần đưa trẻ đi khám?</h2><p></p><h2>Cách phòng ngừa</h2><p></p>`,
  "Dinh dưỡng": `<h2>Vì sao vấn đề này quan trọng?</h2><p></p><h2>Nhu cầu theo độ tuổi</h2><p></p><h2>Thực phẩm nên lựa chọn</h2><p></p><h2>Thực phẩm cần hạn chế</h2><p></p><h2>Gợi ý thực đơn</h2><p></p><h2>Lưu ý từ bác sĩ</h2><p></p>`,
  "Khi nào cần đi khám": `<h2>Dấu hiệu có thể theo dõi tại nhà</h2><p></p><h2>Dấu hiệu cần đặt lịch khám</h2><p></p><h2>Dấu hiệu nguy hiểm cần cấp cứu</h2><p></p><h2>Cha mẹ cần chuẩn bị gì?</h2><p></p>`,
};

function ContentTools({ hasContent, onInsert, onTemplate }: { hasContent: boolean; onInsert: (html: string) => void; onTemplate: (html: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3">
      <select
        defaultValue=""
        onChange={(event) => {
          const html = BLOG_TEMPLATES[event.target.value as keyof typeof BLOG_TEMPLATES];
          if (html) onTemplate(html);
          event.target.value = "";
        }}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
      >
        <option value="">Chọn mẫu bài viết…</option>
        {Object.keys(BLOG_TEMPLATES).map((name) => <option key={name}>{name}</option>)}
      </select>
      <span className="hidden text-xs text-slate-400 sm:inline">{hasContent ? "Chèn thêm khối:" : "Chọn mẫu để bắt đầu nhanh"}</span>
      <button type="button" onClick={() => onInsert(`<div class="medical-note"><h3>Lưu ý từ bác sĩ</h3><p></p></div>`)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold">Lưu ý</button>
      <button type="button" onClick={() => onInsert(`<div class="medical-warning"><h3>Khi nào cần đi khám?</h3><p></p></div>`)} className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">Khi nào đi khám</button>
      <button type="button" onClick={() => onInsert(`<h2>Câu hỏi thường gặp</h2><h3>Câu hỏi</h3><p>Trả lời: </p>`)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold">FAQ</button>
    </div>
  );
}

function truncateAtWord(value: string, maxLength: number) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  const shortened = clean.slice(0, maxLength + 1).replace(/\s+\S*$/, "").trim();
  return shortened || clean.slice(0, maxLength).trim();
}

function deriveKeyword(title: string) {
  return truncateAtWord(
    title
      .replace(/^\d+\s*/, "")
      .replace(/^(cách|điều|dấu hiệu|bí quyết)\s+/i, "")
      .replace(/[?!:–—|].*$/, "")
      .trim(),
    70,
  );
}

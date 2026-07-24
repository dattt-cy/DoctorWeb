export default function Loading() {
  return (
    <div className="min-h-[70vh] bg-white" role="status" aria-label="Đang tải trang">
      <div className="mx-auto max-w-7xl animate-pulse px-5 py-12 sm:px-6 lg:px-8">
        <div className="h-4 w-28 rounded-full bg-slate-200" />
        <div className="mt-10 h-12 max-w-2xl rounded-xl bg-slate-200" />
        <div className="mt-4 h-5 max-w-xl rounded-lg bg-slate-100" />
        <div className="mt-10 aspect-[16/5] rounded-3xl bg-slate-100" />
      </div>
      <span className="sr-only">Đang tải…</span>
    </div>
  );
}

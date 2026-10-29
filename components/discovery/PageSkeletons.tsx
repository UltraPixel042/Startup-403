function Shimmer({ className }: { className: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-xl bg-white/10 ${className}`} />;
}

export function DiscoverPageSkeleton() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8" aria-label="กำลังโหลดหน้าค้นหาร้าน">
      <div className="mb-7 max-w-3xl space-y-3">
        <Shimmer className="h-4 w-28" />
        <Shimmer className="h-10 w-3/4" />
        <Shimmer className="h-5 w-full max-w-xl" />
      </div>
      <Shimmer className="mb-6 h-20 w-full" />
      <div className="rounded-3xl border border-white/10 p-5">
        <Shimmer className="h-7 w-48" />
        <div className="mt-5 flex flex-wrap gap-3"><Shimmer className="h-12 w-32" /><Shimmer className="h-12 w-36" /><Shimmer className="h-12 w-28" /></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3"><Shimmer className="h-16" /><Shimmer className="h-16" /><Shimmer className="h-16" /></div>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => <CafeCardSkeleton key={item} />)}
      </div>
    </main>
  );
}

export function CafeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-3"><Shimmer className="h-12 w-12 rounded-2xl" /><div className="flex-1 space-y-2"><Shimmer className="h-3 w-16" /><Shimmer className="h-6 w-3/4" /></div></div>
      <div className="mt-5 space-y-2"><Shimmer className="h-4 w-full" /><Shimmer className="h-4 w-5/6" /></div>
      <Shimmer className="mt-5 h-24 w-full" />
      <div className="mt-5 flex gap-2"><Shimmer className="h-11 flex-1" /><Shimmer className="h-11 w-28" /></div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8" aria-label="กำลังโหลดข้อมูลร้าน">
      <Shimmer className="h-4 w-24" />
      <Shimmer className="mt-3 h-10 w-3/4" />
      <Shimmer className="mt-6 h-44 w-full" />
      <div className="mt-5 grid gap-5 md:grid-cols-2"><Shimmer className="h-48" /><Shimmer className="h-48" /></div>
    </main>
  );
}

export function FormPageSkeleton() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8" aria-label="กำลังโหลดแบบฟอร์ม">
      <Shimmer className="h-4 w-32" />
      <Shimmer className="mt-3 h-10 w-2/3" />
      <div className="mt-7 space-y-5 rounded-2xl border border-white/10 p-6"><Shimmer className="h-11 w-full" /><Shimmer className="h-28 w-full" /><Shimmer className="h-11 w-40" /></div>
    </main>
  );
}

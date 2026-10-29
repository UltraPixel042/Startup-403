import { CafeCardSkeleton } from '@/components/discovery/PageSkeletons';

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8" aria-label="กำลังโหลดรายการที่บันทึก">
      <div className="h-10 w-64 animate-pulse rounded-xl bg-white/10" />
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3"><CafeCardSkeleton /><CafeCardSkeleton /></div>
    </main>
  );
}

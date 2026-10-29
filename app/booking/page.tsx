import { Suspense } from "react";

import { BookingExperience } from "@/components/booking/BookingExperience";

export default function BookingPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-7xl px-4 py-8 text-sm text-stone-400 sm:px-6 lg:px-8">กำลังเปิดผังร้าน…</main>}>
      <BookingExperience />
    </Suspense>
  );
}

import { Suspense } from "react";

import { BookingExperience } from "../../../components/legacy/BookingExperience";

export default function LegacyBookingPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#1a0f0a] p-8 text-stone-100">กำลังโหลดผังร้าน…</main>}><BookingExperience /></Suspense>;
}

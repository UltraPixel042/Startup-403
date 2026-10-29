import Link from 'next/link';
import { ArrowRight, CalendarRange, Search, ShieldCheck } from 'lucide-react';

const useCases = [
  ['หลังประชุม', 'หาร้านที่นั่งสบายสำหรับคุยต่อเป็นกลุ่ม'],
  ['ทำงานกลุ่ม', 'เปรียบเทียบโต๊ะ ความจุ ปลั๊ก และ Wi-Fi'],
  ['อ่านหนังสือ', 'เลือกมุมที่เหมาะกับการอยู่คนเดียวหรืออยู่ยาว'],
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 pb-16 pt-16 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-6xl gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-24">
        <div>
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-200/10 px-3 py-1 text-sm text-amber-100"><ShieldCheck size={15} /> Sample data / Discovery-first prototype</p>
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl" style={{ fontFamily: 'var(--font-heading)' }}>
            เลือกคาเฟ่ที่เหมาะกับ <span className="gradient-text">ช่วงเวลาของคุณ</span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-slate-300">BrewBook ช่วยเปรียบเทียบข้อมูลพื้นที่จริงในรูปแบบที่อ่านง่าย เช่น ขนาดโต๊ะ ความเหมาะกับจำนวนคน ปลั๊กไฟ Wi‑Fi และข้อสังเกตสำหรับแต่ละกิจกรรม</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/discover" className="btn-primary px-6 py-3 no-underline"><Search size={17} /> ค้นหาร้านตามบริบท</Link>
            <Link href="/booking?cafe=leaf-lab-cafe" className="btn-secondary px-6 py-3 no-underline"><CalendarRange size={17} /> เลือกโต๊ะจากผัง</Link>
          </div>
        </div>
        <aside className="card glow-purple space-y-4">
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-100"><ArrowRight size={15} /> เริ่มจากสิ่งที่ต้องการทำ</p>
          {useCases.map(([title, description]) => (
            <div key={title} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h2 className="font-semibold text-slate-100">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{description}</p>
            </div>
          ))}
        </aside>
      </section>
    </main>
  );
}

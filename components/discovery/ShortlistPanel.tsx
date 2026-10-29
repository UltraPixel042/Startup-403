'use client';

import { Bookmark, Search } from 'lucide-react';

import { type CafePresentation } from '../../lib/discovery-presentation';
import { CafeVisualIcon } from './DiscoveryIcons';
import { PrototypeDataNotice } from './PrototypeDataNotice';

interface ShortlistPanelProps {
  cafes: CafePresentation[];
  onRemove?: (cafe: CafePresentation) => void | Promise<void>;
  onClear?: () => void | Promise<void>;
  className?: string;
}

export function ShortlistPanel({ cafes, onRemove, onClear, className = '' }: ShortlistPanelProps) {
  if (cafes.length === 0) {
    return (
      <section className={`card text-center ${className}`} aria-labelledby="shortlist-heading">
        <Bookmark className="mx-auto text-amber-100" aria-hidden="true" size={38} />
        <h1 id="shortlist-heading" className="mt-3 text-2xl font-bold text-stone-50">ยังไม่มีร้านที่บันทึกไว้</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-400">เลือกร้านจากหน้า Discover เพื่อเปรียบเทียบข้อมูลก่อนตัดสินใจไปจริง</p>
        <a href="/discover" className="btn-primary mt-5 no-underline"><Search size={16} /> ไปค้นหาคาเฟ่</a>
      </section>
    );
  }

  return (
    <section className={`space-y-5 ${className}`} aria-labelledby="shortlist-heading">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">My shortlist</p>
          <h1 id="shortlist-heading" className="mt-1 text-3xl font-bold text-stone-50">ร้านที่บันทึกไว้</h1>
          <p className="mt-2 text-sm text-stone-400">เปรียบเทียบ {cafes.length} ร้านจากข้อมูล prototype ก่อนตัดสินใจ</p>
        </div>
        {onClear ? <button type="button" onClick={() => onClear()} className="text-sm text-stone-400 underline decoration-stone-600 underline-offset-4 hover:text-stone-100">ล้างรายการ</button> : null}
      </header>

      <PrototypeDataNotice compact />

      <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
        <table className="min-w-[720px] w-full border-collapse text-left text-sm">
          <thead className="bg-white/[0.05] text-stone-300">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">ร้าน</th>
              <th scope="col" className="px-4 py-3 font-medium">เหมาะกับ</th>
              <th scope="col" className="px-4 py-3 font-medium">ปลั๊ก / Wi‑Fi</th>
              <th scope="col" className="px-4 py-3 font-medium">เวลาเปิด</th>
              <th scope="col" className="px-4 py-3 font-medium"><span className="sr-only">จัดการรายการ</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.08]">
            {cafes.map((cafe) => (
              <tr key={cafe.id} className="bg-black/10 text-stone-300">
                <td className="px-4 py-4"><a href={`/cafes/${cafe.slug}`} className="inline-flex items-center gap-2 font-semibold text-stone-50 hover:text-amber-100"><CafeVisualIcon cafeSlug={cafe.slug} size={16} />{cafe.name}</a><span className="mt-1 block text-xs text-stone-500">{cafe.area}</span></td>
                <td className="px-4 py-4">{cafe.attributes.recommendedGroup}<span className="mt-1 block text-xs text-stone-500">ความจุตัวอย่าง {cafe.attributes.capacity} คน</span></td>
                <td className="px-4 py-4">{cafe.attributes.outlets === 'many' ? 'มีหลายจุด' : cafe.attributes.outlets === 'some' ? 'มีบางโต๊ะ' : 'จำกัด'}<span className="mt-1 block text-xs text-stone-500">{cafe.attributes.wifi === 'strong' ? 'Wi‑Fi เหมาะทำงาน' : cafe.attributes.wifi === 'available' ? 'มี Wi‑Fi' : 'ยังไม่ยืนยัน Wi‑Fi'}</span></td>
                <td className="px-4 py-4">{cafe.attributes.hours}</td>
                <td className="px-4 py-4 text-right">{onRemove ? <button type="button" onClick={() => onRemove(cafe)} className="text-xs text-rose-200 hover:text-rose-100">ลบ</button> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

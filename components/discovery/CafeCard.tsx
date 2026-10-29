'use client';

import {
  DISCOVERY_CONTEXTS,
  OUTLET_LABELS,
  WIFI_LABELS,
  type CafePresentation,
} from '../../lib/discovery-presentation';
import { CafeVisualIcon } from './DiscoveryIcons';
import { PrototypeDataNotice } from './PrototypeDataNotice';

interface CafeCardProps {
  cafe: CafePresentation;
  href?: string;
  isSaved?: boolean;
  onSave?: (cafe: CafePresentation) => void | Promise<void>;
  onOpen?: (cafe: CafePresentation) => void | Promise<void>;
  className?: string;
}

export function CafeCard({ cafe, href = `/cafes/${cafe.slug}`, isSaved = false, onSave, onOpen, className = '' }: CafeCardProps) {
  const contextLabels = cafe.contexts.map((context) => DISCOVERY_CONTEXTS.find((item) => item.value === context)?.label).filter(Boolean);

  return (
    <article className={`card flex h-full flex-col gap-4 p-5 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-200/10 text-amber-100" aria-hidden="true"><CafeVisualIcon cafeSlug={cafe.slug} /></span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-amber-200">{cafe.area}</p>
            <h3 className="truncate text-lg font-bold text-stone-50">{cafe.name}</h3>
            <p className="mt-1 text-sm text-stone-400">เหมาะกับ {cafe.attributes.recommendedGroup}</p>
          </div>
        </div>
        {cafe.isSampleData && <span className="shrink-0 rounded-full bg-amber-200/15 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-amber-100">Sample</span>}
      </div>

      <p className="text-sm leading-6 text-stone-300">{cafe.description}</p>

      <div className="flex flex-wrap gap-2 text-xs">
        {contextLabels.map((label) => <span key={label} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-stone-200">{label}</span>)}
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl bg-black/15 p-3 text-xs text-stone-300">
        <div><dt className="text-stone-500">ความจุ</dt><dd className="font-semibold text-stone-100">{cafe.attributes.capacity} คน</dd></div>
        <div><dt className="text-stone-500">เวลาเปิด</dt><dd className="font-semibold text-stone-100">{cafe.attributes.hours}</dd></div>
        <div><dt className="text-stone-500">ปลั๊กไฟ</dt><dd className="font-semibold text-stone-100">{OUTLET_LABELS[cafe.attributes.outlets]}</dd></div>
        <div><dt className="text-stone-500">อินเทอร์เน็ต</dt><dd className="font-semibold text-stone-100">{WIFI_LABELS[cafe.attributes.wifi]}</dd></div>
      </dl>

      <PrototypeDataNotice compact lastUpdated={cafe.lastVerifiedAt} />

      <div className="mt-auto flex gap-2 pt-1">
        <a href={href} onClick={() => onOpen?.(cafe)} className="btn-primary flex-1 text-center">
          ดูโปรไฟล์
        </a>
        <button
          type="button"
          onClick={() => onSave?.(cafe)}
          aria-pressed={isSaved}
          className={`rounded-xl border px-3 text-sm transition ${
            isSaved ? 'border-emerald-300/60 bg-emerald-400/15 text-emerald-100' : 'border-white/15 text-stone-200 hover:border-amber-100/50'
          }`}
        >
          {isSaved ? 'บันทึกแล้ว' : 'บันทึกร้าน'}
        </button>
      </div>
    </article>
  );
}

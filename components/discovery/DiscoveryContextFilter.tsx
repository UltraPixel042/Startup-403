'use client';

import type { ReactNode } from 'react';
import { PlugZap, Sparkles, UtensilsCrossed, Wifi } from 'lucide-react';
import { DISCOVERY_CONTEXTS, type DiscoveryFilters } from '../../lib/discovery-presentation';
import { DiscoveryContextIcon } from './DiscoveryIcons';

interface DiscoveryContextFilterProps {
  value: DiscoveryFilters;
  onChange: (next: DiscoveryFilters) => void;
  resultCount?: number;
  className?: string;
}

const partySizes = [1, 2, 3, 4, 5, 6, 8];

export function DiscoveryContextFilter({
  value,
  onChange,
  resultCount,
  className = '',
}: DiscoveryContextFilterProps) {
  const update = (patch: Partial<DiscoveryFilters>) => onChange({ ...value, ...patch });

  return (
    <section className={`card space-y-6 ${className}`} aria-labelledby="discovery-filter-heading">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">Discover cafés</p>
          <h2 id="discovery-filter-heading" className="mt-1 text-xl font-bold text-stone-50">
            วันนี้อยากไปคาเฟ่แบบไหน?
          </h2>
        </div>
        {typeof resultCount === 'number' && (
          <p className="text-sm text-stone-300" aria-live="polite">พบ <strong className="text-amber-200">{resultCount}</strong> ร้านตัวอย่าง</p>
        )}
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-stone-200">เลือกบริบทการใช้งาน</legend>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => update({ context: 'all' })}
            aria-pressed={value.context === 'all'}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition ${
              value.context === 'all'
                ? 'border-amber-200 bg-amber-200/20 text-amber-50'
                : 'border-white/10 bg-white/[0.03] text-stone-300 hover:border-amber-100/40'
            }`}
          >
            <Sparkles size={16} /> ทั้งหมด
          </button>
          {DISCOVERY_CONTEXTS.map((context) => (
            <button
              key={context.value}
              type="button"
              onClick={() => update({ context: context.value })}
              aria-pressed={value.context === context.value}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition ${
                value.context === context.value
                  ? 'border-amber-200 bg-amber-200/20 text-amber-50'
                  : 'border-white/10 bg-white/[0.03] text-stone-300 hover:border-amber-100/40'
              }`}
            >
              <DiscoveryContextIcon context={context.value} />{context.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 md:grid-cols-[minmax(0,0.75fr)_1fr] md:items-end">
        <label className="block text-sm font-medium text-stone-200">
          ไปกี่คน
          <select
            value={value.partySize ?? ''}
            onChange={(event) => update({ partySize: event.target.value ? Number(event.target.value) : null })}
            className="mt-2 block w-full rounded-xl border border-white/10 bg-stone-950/50 px-3 py-2.5 text-sm text-stone-100 outline-none transition focus:border-amber-200"
          >
            <option value="">ยังไม่ระบุ</option>
            {partySizes.map((size) => <option key={size} value={size}>{size} คน</option>)}
          </select>
        </label>
        <div className="flex flex-wrap gap-2" aria-label="สิ่งอำนวยความสะดวกที่ต้องการ">
          <ToggleButton active={value.requiresOutlets} onClick={() => update({ requiresOutlets: !value.requiresOutlets })}>
            <PlugZap size={16} /> ต้องมีปลั๊ก
          </ToggleButton>
          <ToggleButton active={value.requiresWifi} onClick={() => update({ requiresWifi: !value.requiresWifi })}>
            <Wifi size={16} /> ต้องมี Wi‑Fi
          </ToggleButton>
          <ToggleButton active={value.servesFood} onClick={() => update({ servesFood: !value.servesFood })}>
            <UtensilsCrossed size={16} /> มีอาหาร
          </ToggleButton>
        </div>
      </div>
    </section>
  );
}

function ToggleButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm transition ${
        active
          ? 'border-emerald-300/70 bg-emerald-400/15 text-emerald-100'
          : 'border-white/10 bg-white/[0.03] text-stone-300 hover:border-emerald-200/40'
      }`}
    >
      {children}
    </button>
  );
}

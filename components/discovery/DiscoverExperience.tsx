'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  DEFAULT_DISCOVERY_FILTERS,
  matchesDiscoveryFilters,
  type CafePresentation,
  type DiscoveryFilters,
} from '@/lib/discovery-presentation';
import { CafeCard } from './CafeCard';
import { DiscoveryContextFilter } from './DiscoveryContextFilter';
import { PrototypeDataNotice } from './PrototypeDataNotice';

interface DiscoverExperienceProps {
  cafes: CafePresentation[];
}

export function DiscoverExperience({ cafes }: DiscoverExperienceProps) {
  const [filters, setFilters] = useState<DiscoveryFilters>(DEFAULT_DISCOVERY_FILTERS);
  const [savedCafeIds, setSavedCafeIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadSavedCafes() {
      const response = await fetch('/api/shortlist');
      if (!response.ok) return;
      const payload: unknown = await response.json();
      if (isShortlistResponse(payload)) setSavedCafeIds(payload.cafeIds);
    }
    void loadSavedCafes();
  }, []);
  const visibleCafes = useMemo(() => cafes.filter((cafe) => matchesDiscoveryFilters(cafe, filters)), [cafes, filters]);

  async function saveCafe(cafe: CafePresentation) {
    if (savedCafeIds.includes(cafe.id)) return;
    setSavedCafeIds((current) => [...current, cafe.id]);
    await Promise.allSettled([
      postJson('/api/events', { cafeId: cafe.id, eventType: 'save' }),
      postJson('/api/shortlist', { cafeId: cafe.id }),
    ]);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-7 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">Discovery-first</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-50 sm:text-4xl">เลือกคาเฟ่จากสิ่งที่คุณกำลังจะทำ</h1>
        <p className="mt-3 leading-7 text-stone-300">เริ่มจากบริบท จำนวนคน และสิ่งอำนวยความสะดวก แล้วค่อยเปรียบเทียบข้อมูลในโปรไฟล์ร้าน</p>
      </header>

      <PrototypeDataNotice className="mb-6" />
      <DiscoveryContextFilter value={filters} onChange={setFilters} resultCount={visibleCafes.length} />

      <section className="mt-8" aria-label="ผลการค้นหาคาเฟ่">
        {visibleCafes.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleCafes.map((cafe) => (
              <CafeCard
                key={cafe.id}
                cafe={cafe}
                isSaved={savedCafeIds.includes(cafe.id)}
                onSave={saveCafe}
                onOpen={(openedCafe) => postJson('/api/events', { cafeId: openedCafe.id, eventType: 'profile_view' })}
              />
            ))}
          </div>
        ) : (
          <div className="card py-12 text-center">
            <p className="text-lg font-semibold text-stone-100">ยังไม่พบร้านตามเงื่อนไขนี้</p>
            <p className="mt-2 text-sm text-stone-400">ลองลดจำนวนคนหรือปิดตัวเลือกปลั๊กไฟ / Wi‑Fi เพื่อดูข้อมูลตัวอย่างเพิ่มเติม</p>
          </div>
        )}
      </section>
    </main>
  );
}

async function postJson(url: string, body: unknown) {
  await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function isShortlistResponse(value: unknown): value is { cafeIds: string[] } {
  return Boolean(value) && typeof value === 'object'
    && Array.isArray((value as { cafeIds?: unknown }).cafeIds)
    && (value as { cafeIds: unknown[] }).cafeIds.every((id) => typeof id === 'string');
}

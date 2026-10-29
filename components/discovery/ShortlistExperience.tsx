'use client';

import { useEffect, useMemo, useState } from 'react';

import type { CafePresentation } from '@/lib/discovery-presentation';
import { CafeCardSkeleton } from './PageSkeletons';
import { ShortlistPanel } from './ShortlistPanel';

interface ShortlistExperienceProps {
  cafes: CafePresentation[];
}

export function ShortlistExperience({ cafes }: ShortlistExperienceProps) {
  const [savedCafeIds, setSavedCafeIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadShortlist() {
      try {
        const response = await fetch('/api/shortlist');
        if (response.ok) {
          const payload: unknown = await response.json();
          if (isShortlistResponse(payload)) setSavedCafeIds(payload.cafeIds);
        }
      } finally {
        setIsLoading(false);
      }
    }
    void loadShortlist();
  }, []);

  const savedCafes = useMemo(() => cafes.filter((cafe) => savedCafeIds.includes(cafe.id)), [cafes, savedCafeIds]);

  if (isLoading) {
    return <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="กำลังโหลดรายการที่บันทึก"><CafeCardSkeleton /><CafeCardSkeleton /></div>;
  }

  async function removeCafe(cafe: CafePresentation) {
    setSavedCafeIds((current) => current.filter((id) => id !== cafe.id));
    await fetch(`/api/shortlist?cafeId=${encodeURIComponent(cafe.id)}`, { method: 'DELETE' });
  }

  async function clearCafes() {
    setSavedCafeIds([]);
    await fetch('/api/shortlist', { method: 'DELETE' });
  }

  return <ShortlistPanel cafes={savedCafes} onRemove={removeCafe} onClear={clearCafes} />;
}

function isShortlistResponse(value: unknown): value is { cafeIds: string[] } {
  return Boolean(value) && typeof value === 'object'
    && Array.isArray((value as { cafeIds?: unknown }).cafeIds)
    && (value as { cafeIds: unknown[] }).cafeIds.every((id) => typeof id === 'string');
}

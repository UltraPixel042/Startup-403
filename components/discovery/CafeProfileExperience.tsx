'use client';

import { useEffect, useState } from 'react';

import type { CafeActionPayload, CafePresentation } from '@/lib/discovery-presentation';
import { CafeProfileDetails } from './CafeProfileDetails';

interface CafeProfileExperienceProps {
  cafe: CafePresentation;
}

export function CafeProfileExperience({ cafe }: CafeProfileExperienceProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    void postJson('/api/events', { cafeId: cafe.id, eventType: 'profile_view' });
  }, [cafe.id]);

  useEffect(() => {
    async function loadSavedState() {
      const response = await fetch('/api/shortlist');
      if (!response.ok) return;
      const payload: unknown = await response.json();
      if (isShortlistResponse(payload)) setIsSaved(payload.cafeIds.includes(cafe.id));
    }
    void loadSavedState();
  }, [cafe.id]);

  async function handleAction(payload: CafeActionPayload) {
    await postJson('/api/events', { cafeId: payload.cafe.id, eventType: payload.event });
  }

  async function handleSavedChange(savedCafe: CafePresentation, nextSaved: boolean) {
    setIsSaved(nextSaved);
    if (nextSaved) {
      await postJson('/api/shortlist', { cafeId: savedCafe.id });
      return;
    }
    await fetch(`/api/shortlist?cafeId=${encodeURIComponent(savedCafe.id)}`, { method: 'DELETE' });
  }

  return <CafeProfileDetails cafe={cafe} isSaved={isSaved} onAction={handleAction} onSavedChange={handleSavedChange} />;
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

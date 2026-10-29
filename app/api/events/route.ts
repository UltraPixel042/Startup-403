import { NextRequest, NextResponse } from 'next/server';

import { createDatabase } from '@/src/db/client';
import { events } from '@/src/db/schema';
import { attachAnonymousSessionCookie, resolveAnonymousSession } from '@/src/server/anonymous-session';
import { hasDatabaseConfiguration } from '@/src/server/cafe-repository';

const EVENT_TYPES = new Set(['profile_view', 'save', 'share', 'map_click', 'contact_click']);

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  if (!isEventPayload(payload)) {
    return NextResponse.json({ error: 'Invalid event payload.' }, { status: 400 });
  }

  const session = resolveAnonymousSession(request.cookies);

  if (!hasDatabaseConfiguration()) return createEventResponse({ recorded: false, mode: 'prototype' }, session, 202);

  const { client, db } = createDatabase();
  try {
    await db.insert(events).values({
      anonymousSessionId: session.id,
      cafeId: payload.cafeId,
      eventType: payload.eventType,
      metadata: { source: 'web-discovery' },
    });
    return createEventResponse({ recorded: true, mode: 'database' }, session);
  } catch {
    return createEventResponse({ recorded: false, mode: 'prototype' }, session, 202);
  } finally {
    await client.end();
  }
}

function createEventResponse(
  body: { recorded: boolean; mode: 'prototype' | 'database' },
  session: ReturnType<typeof resolveAnonymousSession>,
  status = 200,
) {
  const response = NextResponse.json(body, { status });
  attachAnonymousSessionCookie(response.cookies, session);
  return response;
}

function isEventPayload(value: unknown): value is { cafeId: string; eventType: string } {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.cafeId === 'string' && candidate.cafeId.length > 0
    && typeof candidate.eventType === 'string' && EVENT_TYPES.has(candidate.eventType);
}

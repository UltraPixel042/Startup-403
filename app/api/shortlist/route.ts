import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { createDatabase } from '@/src/db/client';
import { savedCafes } from '@/src/db/schema';
import { attachAnonymousSessionCookie, resolveAnonymousSession } from '@/src/server/anonymous-session';
import { hasDatabaseConfiguration } from '@/src/server/cafe-repository';

export async function GET(request: NextRequest) {
  const session = resolveAnonymousSession(request.cookies);
  if (!hasDatabaseConfiguration()) return createShortlistResponse({ cafeIds: [], mode: 'prototype' }, session);

  const { client, db } = createDatabase();
  try {
    const rows = await db
      .select({ cafeId: savedCafes.cafeId })
      .from(savedCafes)
      .where(eq(savedCafes.anonymousSessionId, session.id));
    return createShortlistResponse({ cafeIds: rows.map((row) => row.cafeId), mode: 'database' }, session);
  } catch {
    return createShortlistResponse({ cafeIds: [], mode: 'prototype' }, session);
  } finally {
    await client.end();
  }
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  if (!isCafePayload(payload)) return NextResponse.json({ error: 'Invalid cafe id.' }, { status: 400 });

  const session = resolveAnonymousSession(request.cookies);
  if (!hasDatabaseConfiguration()) return createShortlistResponse({ saved: true, mode: 'prototype' }, session, 202);

  const { client, db } = createDatabase();
  try {
    await db.insert(savedCafes).values({ anonymousSessionId: session.id, cafeId: payload.cafeId }).onConflictDoNothing();
    return createShortlistResponse({ saved: true, mode: 'database' }, session);
  } catch {
    return createShortlistResponse({ saved: true, mode: 'prototype' }, session, 202);
  } finally {
    await client.end();
  }
}

export async function DELETE(request: NextRequest) {
  const session = resolveAnonymousSession(request.cookies);
  if (!hasDatabaseConfiguration()) return createShortlistResponse({ deleted: true, mode: 'prototype' }, session, 202);

  const cafeId = new URL(request.url).searchParams.get('cafeId');
  const { client, db } = createDatabase();
  try {
    await db.delete(savedCafes).where(
      cafeId
        ? and(eq(savedCafes.anonymousSessionId, session.id), eq(savedCafes.cafeId, cafeId))
        : eq(savedCafes.anonymousSessionId, session.id),
    );
    return createShortlistResponse({ deleted: true, mode: 'database' }, session);
  } catch {
    return createShortlistResponse({ deleted: true, mode: 'prototype' }, session, 202);
  } finally {
    await client.end();
  }
}

function createShortlistResponse(
  body: { cafeIds: string[]; mode: 'prototype' | 'database' } | { saved: boolean; mode: 'prototype' | 'database' } | { deleted: boolean; mode: 'prototype' | 'database' },
  session: ReturnType<typeof resolveAnonymousSession>,
  status = 200,
) {
  const response = NextResponse.json(body, { status });
  attachAnonymousSessionCookie(response.cookies, session);
  return response;
}

function isCafePayload(value: unknown): value is { cafeId: string } {
  return Boolean(value) && typeof value === 'object'
    && typeof (value as { cafeId?: unknown }).cafeId === 'string'
    && (value as { cafeId: string }).cafeId.length > 0;
}

import { NextRequest, NextResponse } from 'next/server';

import { createDatabase } from '@/src/db/client';
import { profileChangeRequests } from '@/src/db/schema';
import { hasDatabaseConfiguration } from '@/src/server/cafe-repository';

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  if (!isProfileChangeRequest(payload)) {
    return NextResponse.json({ error: 'Please provide a cafe, source, and an observation of at least 20 characters.' }, { status: 400 });
  }

  if (!hasDatabaseConfiguration()) {
    return NextResponse.json({ accepted: true, mode: 'prototype', status: 'pending' }, { status: 202 });
  }

  const { client, db } = createDatabase();
  try {
    await db.insert(profileChangeRequests).values({
      cafeId: payload.cafeId,
      submitterName: payload.contactName || null,
      proposedChanges: {
        context: payload.context,
        recommendedGroup: payload.recommendedGroup,
        note: payload.note,
        sourceLabel: payload.sourceLabel,
      },
      status: 'pending',
    });
    return NextResponse.json({ accepted: true, mode: 'database', status: 'pending' }, { status: 201 });
  } catch {
    return NextResponse.json({ accepted: true, mode: 'prototype', status: 'pending' }, { status: 202 });
  } finally {
    await client.end();
  }
}

function isProfileChangeRequest(value: unknown): value is {
  cafeId: string;
  context: string;
  recommendedGroup: string;
  note: string;
  sourceLabel: string;
  contactName?: string;
} {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.cafeId === 'string' && candidate.cafeId.length > 0
    && typeof candidate.context === 'string'
    && typeof candidate.recommendedGroup === 'string'
    && typeof candidate.note === 'string' && candidate.note.trim().length >= 20
    && typeof candidate.sourceLabel === 'string' && candidate.sourceLabel.trim().length > 0
    && (candidate.contactName === undefined || typeof candidate.contactName === 'string');
}

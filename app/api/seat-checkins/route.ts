import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { getFloorPlan } from "@/lib/floor-plan/sample-layouts";
import { createDatabase } from "@/src/db/client";
import { cafes, events, seatCheckins } from "@/src/db/schema";
import { attachAnonymousSessionCookie, resolveAnonymousSession } from "@/src/server/anonymous-session";
import { hasDatabaseConfiguration } from "@/src/server/cafe-repository";

type SeatCheckinPayload = { cafeSlug: string; tableId: string; partySize?: number };

export async function GET(request: NextRequest) {
  const session = resolveAnonymousSession(request.cookies);
  const cafeSlug = new URL(request.url).searchParams.get("cafe");
  if (!cafeSlug) return response({ error: "Cafe is required." }, session, 400);
  if (!hasDatabaseConfiguration()) return response({ activeTableIds: [], myCheckins: [], mode: "prototype" }, session);

  const { client, db } = createDatabase();
  try {
    const cafe = await findCafe(db, cafeSlug);
    if (!cafe) return response({ error: "Cafe was not found." }, session, 404);

    const activeRows = await db
      .select({ id: seatCheckins.id, tableId: seatCheckins.layoutTableId, checkedInAt: seatCheckins.checkedInAt, sessionId: seatCheckins.anonymousSessionId })
      .from(seatCheckins)
      .where(and(eq(seatCheckins.cafeId, cafe.id), eq(seatCheckins.status, "checked_in")));

    return response({
      activeTableIds: activeRows.map((row) => row.tableId),
      myCheckins: activeRows
        .filter((row) => row.sessionId === session.id)
        .map((row) => ({ id: row.id, tableId: row.tableId, checkedInAt: row.checkedInAt.toISOString() })),
      mode: "database",
    }, session);
  } catch {
    return response({ error: "Unable to load seat status." }, session, 503);
  } finally {
    await client.end();
  }
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  if (!isSeatCheckinPayload(payload)) return NextResponse.json({ error: "Invalid check-in request." }, { status: 400 });

  const session = resolveAnonymousSession(request.cookies);
  const plan = getFloorPlan(payload.cafeSlug);
  const table = plan?.floors.flatMap((floor) => floor.objects).find((item) => item.kind === "table" && item.id === payload.tableId);
  if (!plan || !table) return response({ error: "This table does not belong to the selected cafe." }, session, 400);
  if (!hasDatabaseConfiguration()) return response({ error: "Database has not been configured." }, session, 503);

  const { client, db } = createDatabase();
  try {
    const cafe = await findCafe(db, payload.cafeSlug);
    if (!cafe) return response({ error: "Cafe was not found." }, session, 404);

    const result = await db.transaction(async (tx) => {
      const [checkin] = await tx
        .insert(seatCheckins)
        .values({
          anonymousSessionId: session.id,
          cafeId: cafe.id,
          layoutTableId: table.id,
          partySize: payload.partySize ?? 1,
          status: "checked_in",
        })
        .onConflictDoNothing()
        .returning({ id: seatCheckins.id, tableId: seatCheckins.layoutTableId, checkedInAt: seatCheckins.checkedInAt });

      if (!checkin) return null;
      await tx.insert(events).values({
        anonymousSessionId: session.id,
        cafeId: cafe.id,
        eventType: "seat_check_in",
        metadata: { tableId: table.id, source: "mvp-seat-checkin" },
      });
      return checkin;
    });

    if (!result) return response({ error: "This table has just been checked in by another session." }, session, 409);
    return response({ checkin: { ...result, checkedInAt: result.checkedInAt.toISOString() }, mode: "database" }, session, 201);
  } catch {
    return response({ error: "Unable to check in right now." }, session, 503);
  } finally {
    await client.end();
  }
}

export async function PATCH(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object" || typeof (payload as { checkinId?: unknown }).checkinId !== "string") {
    return NextResponse.json({ error: "Invalid check-out request." }, { status: 400 });
  }

  const session = resolveAnonymousSession(request.cookies);
  if (!hasDatabaseConfiguration()) return response({ error: "Database has not been configured." }, session, 503);

  const { client, db } = createDatabase();
  try {
    const [checkedOut] = await db
      .update(seatCheckins)
      .set({ status: "checked_out", checkedOutAt: new Date() })
      .where(and(
        eq(seatCheckins.id, payload.checkinId),
        eq(seatCheckins.anonymousSessionId, session.id),
        eq(seatCheckins.status, "checked_in"),
      ))
      .returning({ id: seatCheckins.id, cafeId: seatCheckins.cafeId, tableId: seatCheckins.layoutTableId, checkedOutAt: seatCheckins.checkedOutAt });

    if (!checkedOut) return response({ error: "The active check-in was not found." }, session, 404);
    await db.insert(events).values({
      anonymousSessionId: session.id,
      cafeId: checkedOut.cafeId,
      eventType: "seat_check_out",
      metadata: { tableId: checkedOut.tableId, source: "mvp-seat-checkin" },
    });
    return response({ checkinId: checkedOut.id, checkedOutAt: checkedOut.checkedOutAt?.toISOString(), mode: "database" }, session);
  } catch {
    return response({ error: "Unable to check out right now." }, session, 503);
  } finally {
    await client.end();
  }
}

async function findCafe(db: ReturnType<typeof createDatabase>["db"], slug: string) {
  const [cafe] = await db.select({ id: cafes.id }).from(cafes).where(eq(cafes.slug, slug)).limit(1);
  return cafe;
}

function response(body: unknown, session: ReturnType<typeof resolveAnonymousSession>, status = 200) {
  const result = NextResponse.json(body, { status });
  attachAnonymousSessionCookie(result.cookies, session);
  return result;
}

function isSeatCheckinPayload(value: unknown): value is SeatCheckinPayload {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.cafeSlug === "string" && candidate.cafeSlug.length > 0
    && typeof candidate.tableId === "string" && candidate.tableId.length > 0
    && (candidate.partySize === undefined || (typeof candidate.partySize === "number" && Number.isInteger(candidate.partySize) && candidate.partySize > 0 && candidate.partySize <= 20));
}

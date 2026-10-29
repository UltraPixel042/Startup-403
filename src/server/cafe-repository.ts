import { asc, inArray } from 'drizzle-orm';

import { createDatabase } from '@/src/db/client';
import { cafeAttributes, cafes, fieldNotes } from '@/src/db/schema';
import {
  SAMPLE_CAFES,
  type CafePresentation,
  type DiscoveryContext,
  type FieldNotePresentation,
  type OutletAvailability,
  type WifiQuality,
} from '@/lib/discovery-presentation';

const fallbackBySlug = new Map(SAMPLE_CAFES.map((cafe) => [cafe.slug, cafe]));

export function hasDatabaseConfiguration() {
  return Boolean(process.env.DATABASE_URL);
}

/**
 * Reads only through the server. If no database has been configured yet, the
 * UI deliberately stays usable with its visibly-labelled prototype dataset.
 */
export async function listCafePresentations(): Promise<CafePresentation[]> {
  if (!hasDatabaseConfiguration()) return SAMPLE_CAFES;

  const { client, db } = createDatabase();
  try {
    const cafeRows = await db.select().from(cafes).orderBy(asc(cafes.name));
    if (cafeRows.length === 0) return SAMPLE_CAFES;

    const cafeIds = cafeRows.map((cafe) => cafe.id);
    const attributeRows = await db
      .select()
      .from(cafeAttributes)
      .where(inArray(cafeAttributes.cafeId, cafeIds));
    const noteRows = await db
      .select()
      .from(fieldNotes)
      .where(inArray(fieldNotes.cafeId, cafeIds))
      .orderBy(asc(fieldNotes.createdAt));

    const attributesByCafeId = new Map(attributeRows.map((attribute) => [attribute.cafeId, attribute]));
    const notesByCafeId = new Map<string, FieldNotePresentation[]>();
    for (const note of noteRows) {
      const list = notesByCafeId.get(note.cafeId) ?? [];
      list.push({
        id: note.id,
        context: toDiscoveryContext(note.context),
        recommendedGroup: `${note.suitablePartyMin}–${note.suitablePartyMax} คน`,
        note: note.note,
        verifiedAt: note.observedAt.toISOString().slice(0, 10),
        sourceLabel: note.sourceLabel,
      });
      notesByCafeId.set(note.cafeId, list);
    }

    return cafeRows.map((cafe) => {
      const fallback = fallbackBySlug.get(cafe.slug);
      const attributes = attributesByCafeId.get(cafe.id);
      const fieldNoteList = notesByCafeId.get(cafe.id) ?? fallback?.fieldNotes ?? [];
      const contexts = uniqueContexts(fieldNoteList.map((note) => note.context), fallback?.contexts ?? ['casual-break']);

      return {
        id: cafe.id,
        slug: cafe.slug,
        name: cafe.name,
        area: cafe.area,
        address: fallback?.address ?? `ข้อมูล ${cafe.dataStatus === 'sample' ? 'ตัวอย่าง' : 'ร้าน'} — ${cafe.area}`,
        description: cafe.description,
        coverEmoji: fallback?.coverEmoji ?? '☕',
        contexts,
        attributes: {
          capacity: attributes?.capacity ?? fallback?.attributes.capacity ?? 0,
          recommendedGroup: attributes
            ? `${attributes.recommendedPartyMin}–${attributes.recommendedPartyMax} คน`
            : fallback?.attributes.recommendedGroup ?? 'รอข้อมูล',
          outlets: attributes ? toOutletAvailability(attributes.hasPowerOutlets) : fallback?.attributes.outlets ?? 'none',
          wifi: attributes ? toWifiQuality(attributes.wifiQuality) : fallback?.attributes.wifi ?? 'unknown',
          foodOptions: attributes?.foodAvailable ? ['อาหารและเครื่องดื่ม (ข้อมูลตัวอย่าง)'] : fallback?.attributes.foodOptions ?? [],
          hours: attributes?.openingHours ?? fallback?.attributes.hours ?? 'รอข้อมูล',
          atmosphere: attributes?.atmosphere.split(',').map((item) => item.trim()).filter(Boolean) ?? fallback?.attributes.atmosphere ?? [],
        },
        fieldNotes: fieldNoteList,
        mapUrl: cafe.mapUrl ?? undefined,
        contactUrl: cafe.contactUrl ?? undefined,
        isSampleData: cafe.dataStatus === 'sample',
        lastVerifiedAt: cafe.verifiedAt?.toISOString().slice(0, 10) ?? fallback?.lastVerifiedAt ?? '2026-10-29',
        sourceLabel: cafe.sourceLabel,
      };
    });
  } catch (error) {
    console.warn('BrewBook is using prototype presentation data because the database is unavailable.', error);
    return SAMPLE_CAFES;
  } finally {
    await client.end();
  }
}

export async function findCafePresentation(slug: string) {
  const cafes = await listCafePresentations();
  return cafes.find((cafe) => cafe.slug === slug) ?? null;
}

function toOutletAvailability(hasPowerOutlets: boolean): OutletAvailability {
  return hasPowerOutlets ? 'some' : 'none';
}

function toWifiQuality(value: string): WifiQuality {
  if (value === 'good') return 'strong';
  if (value === 'basic') return 'available';
  return 'unknown';
}

function toDiscoveryContext(value: string): DiscoveryContext {
  const supported: DiscoveryContext[] = ['after-meeting', 'group-work', 'focus-study', 'casual-break', 'content-creation'];
  return supported.includes(value as DiscoveryContext) ? (value as DiscoveryContext) : 'casual-break';
}

function uniqueContexts(contexts: DiscoveryContext[], fallback: DiscoveryContext[]) {
  const unique = [...new Set(contexts)];
  return unique.length > 0 ? unique : fallback;
}

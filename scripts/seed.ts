import { sql } from 'drizzle-orm';
import { config } from 'dotenv';

import { createDatabase } from '../src/db/client';
import { cafeAttributes, cafes, fieldNotes } from '../src/db/schema';

config({ path: '.env.local', quiet: true });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set before running the seed script.');
}

const seededAt = new Date('2026-10-29T00:00:00.000Z');
const sampleSource = 'Sample data / Prototype';

/**
 * This seed mirrors the UI exactly. Every record is fictional and must remain
 * labelled as sample data until a separate verification workflow replaces it.
 */
const seedCafes = [
  {
    slug: 'bangmod-corner-coffee', name: 'Bang Mod Corner Coffee', area: 'บางมด',
    description: 'ร้านตัวอย่างสำหรับเปรียบเทียบคาเฟ่หลังประชุมหรือทำงานกลุ่มขนาดเล็ก',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Bang+Mod', contactUrl: 'mailto:sample-cafe@example.com',
    attributes: { capacity: 28, recommendedPartyMin: 2, recommendedPartyMax: 5, hasPowerOutlets: true, wifiQuality: 'good', foodAvailable: true, openingHours: '08:00–18:00', atmosphere: 'โต๊ะรวม, คุยงานได้, แสงธรรมชาติ' },
    note: { seedKey: 'bangmod-corner-group-work', context: 'group-work', suitablePartyMin: 3, suitablePartyMax: 4, note: 'ข้อมูลตัวอย่าง: โต๊ะกลางเหมาะกับการเปิดโน้ตบุ๊กหลายเครื่อง แต่ควรเลือกช่วงที่ร้านไม่พลุกพล่าน' },
  },
  {
    slug: 'leaf-lab-cafe', name: 'Leaf Lab Café', area: 'บางมด',
    description: 'คาเฟ่ตัวอย่างที่เน้นบรรยากาศเงียบสำหรับอ่านหนังสือและทำงานเดี่ยว',
    mapUrl: null, contactUrl: null,
    attributes: { capacity: 18, recommendedPartyMin: 1, recommendedPartyMax: 2, hasPowerOutlets: true, wifiQuality: 'good', foodAvailable: true, openingHours: '09:00–20:00', atmosphere: 'เงียบ, โต๊ะเดี่ยว, มีปลั๊ก' },
    note: { seedKey: 'leaf-lab-focus-study', context: 'focus-study', suitablePartyMin: 1, suitablePartyMax: 2, note: 'ข้อมูลตัวอย่าง: จุดริมหน้าต่างเหมาะกับงานที่ต้องใช้สมาธิ และมีปลั๊กใกล้โต๊ะ' },
  },
  {
    slug: 'table-talk-studio', name: 'Table Talk Studio', area: 'บางมด',
    description: 'ร้านตัวอย่างที่มีโต๊ะขนาดใหญ่สำหรับระดมความคิดและทำงานกลุ่ม',
    mapUrl: null, contactUrl: null,
    attributes: { capacity: 40, recommendedPartyMin: 4, recommendedPartyMax: 8, hasPowerOutlets: true, wifiQuality: 'basic', foodAvailable: true, openingHours: '10:00–21:00', atmosphere: 'โต๊ะใหญ่, คุยงานได้, พื้นที่กว้าง' },
    note: { seedKey: 'table-talk-group-work', context: 'group-work', suitablePartyMin: 5, suitablePartyMax: 6, note: 'ข้อมูลตัวอย่าง: เหมาะกับกลุ่มที่ต้องใช้โต๊ะกว้าง แต่ควรตรวจจำนวนปลั๊กกับร้านก่อนใช้งานจริง' },
  },
  {
    slug: 'slow-morning-brew', name: 'Slow Morning Brew', area: 'บางมด',
    description: 'ร้านตัวอย่างสำหรับพักระหว่างวันและนัดคุยสั้น ๆ ในบรรยากาศสบาย',
    mapUrl: null, contactUrl: null,
    attributes: { capacity: 24, recommendedPartyMin: 2, recommendedPartyMax: 3, hasPowerOutlets: true, wifiQuality: 'basic', foodAvailable: true, openingHours: '07:30–17:30', atmosphere: 'สบาย ๆ, อาหารเช้า, แสงดี' },
    note: { seedKey: 'slow-morning-casual-break', context: 'casual-break', suitablePartyMin: 2, suitablePartyMax: 2, note: 'ข้อมูลตัวอย่าง: เหมาะกับการพักคุยหลังประชุมสั้น ๆ มากกว่าการนั่งทำงานต่อเนื่องทั้งวัน' },
  },
  {
    slug: 'frame-foundry', name: 'Frame Foundry', area: 'บางมด',
    description: 'คาเฟ่ตัวอย่างที่จัดมุมถ่ายภาพและเหมาะกับนัดเพื่อนหรือสร้างคอนเทนต์',
    mapUrl: null, contactUrl: null,
    attributes: { capacity: 32, recommendedPartyMin: 2, recommendedPartyMax: 4, hasPowerOutlets: true, wifiQuality: 'unknown', foodAvailable: true, openingHours: '10:00–19:00', atmosphere: 'มุมถ่ายรูป, แสงธรรมชาติ, ตกแต่งโดดเด่น' },
    note: { seedKey: 'frame-foundry-content-creation', context: 'content-creation', suitablePartyMin: 2, suitablePartyMax: 3, note: 'ข้อมูลตัวอย่าง: เหมาะกับการถ่ายภาพขนาดเล็ก และต้องยืนยันข้อกำหนดกับร้านจริงก่อนใช้งาน' },
  },
] as const;

const { client, db } = createDatabase(databaseUrl);

try {
  for (const cafe of seedCafes) {
    const [savedCafe] = await db
      .insert(cafes)
      .values({
        slug: cafe.slug, name: cafe.name, description: cafe.description, area: cafe.area,
        mapUrl: cafe.mapUrl, contactUrl: cafe.contactUrl, dataStatus: 'sample', verifiedAt: null, sourceLabel: sampleSource,
      })
      .onConflictDoUpdate({
        target: cafes.slug,
        set: { name: cafe.name, description: cafe.description, area: cafe.area, mapUrl: cafe.mapUrl, contactUrl: cafe.contactUrl, dataStatus: 'sample', verifiedAt: null, sourceLabel: sampleSource, updatedAt: sql`now()` },
      })
      .returning({ id: cafes.id });

    if (!savedCafe) throw new Error(`Could not create or update seed cafe: ${cafe.slug}`);

    await db
      .insert(cafeAttributes)
      .values({ cafeId: savedCafe.id, ...cafe.attributes })
      .onConflictDoUpdate({ target: cafeAttributes.cafeId, set: { ...cafe.attributes, updatedAt: sql`now()` } });

    await db
      .insert(fieldNotes)
      .values({ cafeId: savedCafe.id, ...cafe.note, observedAt: seededAt, sourceLabel: sampleSource })
      .onConflictDoUpdate({
        target: fieldNotes.seedKey,
        set: { cafeId: savedCafe.id, context: cafe.note.context, suitablePartyMin: cafe.note.suitablePartyMin, suitablePartyMax: cafe.note.suitablePartyMax, note: cafe.note.note, observedAt: seededAt, sourceLabel: sampleSource, updatedAt: sql`now()` },
      });
  }

  console.info(`Seeded ${seedCafes.length} explicitly sample/prototype cafes.`);
} finally {
  await client.end();
}

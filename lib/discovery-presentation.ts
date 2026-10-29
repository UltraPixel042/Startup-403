/**
 * Presentation contracts for BrewBook's discovery-first prototype.
 *
 * This module deliberately contains no database client. Routes can replace
 * SAMPLE_CAFES with data from Drizzle while keeping the UI contract stable.
 */

export const DISCOVERY_CONTEXTS = [
  { value: 'after-meeting', label: 'หลังประชุม', icon: '🗣️' },
  { value: 'group-work', label: 'ทำงานกลุ่ม', icon: '👥' },
  { value: 'focus-study', label: 'อ่านหนังสือ', icon: '📚' },
  { value: 'casual-break', label: 'พักผ่อน', icon: '☕' },
  { value: 'content-creation', label: 'ถ่ายรูป / ทำคอนเทนต์', icon: '📸' },
] as const;

export type DiscoveryContext = (typeof DISCOVERY_CONTEXTS)[number]['value'];
export type OutletAvailability = 'many' | 'some' | 'limited' | 'none';
export type WifiQuality = 'strong' | 'available' | 'unknown';

export interface CafeAttributesPresentation {
  capacity: number;
  recommendedGroup: string;
  outlets: OutletAvailability;
  wifi: WifiQuality;
  foodOptions: string[];
  hours: string;
  atmosphere: string[];
}

export interface FieldNotePresentation {
  id: string;
  context: DiscoveryContext;
  recommendedGroup: string;
  note: string;
  verifiedAt: string;
  sourceLabel: string;
}

export interface CafePresentation {
  id: string;
  slug: string;
  name: string;
  area: string;
  address: string;
  description: string;
  coverEmoji: string;
  contexts: DiscoveryContext[];
  attributes: CafeAttributesPresentation;
  fieldNotes: FieldNotePresentation[];
  mapUrl?: string;
  contactUrl?: string;
  isSampleData: boolean;
  lastVerifiedAt: string;
  sourceLabel: string;
}

export interface DiscoveryFilters {
  context: DiscoveryContext | 'all';
  partySize: number | null;
  requiresOutlets: boolean;
  requiresWifi: boolean;
  servesFood: boolean;
}

export const DEFAULT_DISCOVERY_FILTERS: DiscoveryFilters = {
  context: 'all',
  partySize: null,
  requiresOutlets: false,
  requiresWifi: false,
  servesFood: false,
};

export type CafeEventName = 'profile_view' | 'save' | 'share' | 'map_click' | 'contact_click';

export interface CafeActionPayload {
  cafe: CafePresentation;
  event: CafeEventName;
}

export interface FieldNoteDraft {
  cafeId: string;
  context: DiscoveryContext;
  recommendedGroup: string;
  note: string;
  sourceLabel: string;
  contactName?: string;
}

export const OUTLET_LABELS: Record<OutletAvailability, string> = {
  many: 'มีปลั๊กหลายจุด',
  some: 'มีปลั๊กบางโต๊ะ',
  limited: 'ปลั๊กจำกัด',
  none: 'ไม่พบข้อมูลปลั๊ก',
};

export const WIFI_LABELS: Record<WifiQuality, string> = {
  strong: 'Wi‑Fi เหมาะกับการทำงาน',
  available: 'มี Wi‑Fi',
  unknown: 'ยังไม่ยืนยัน Wi‑Fi',
};

/**
 * Placeholder content for product screenshots and local flows only.
 * Each item is intentionally fictional and must be replaced with a
 * documented source before it is presented as verified café information.
 */
export const SAMPLE_CAFES: CafePresentation[] = [
  {
    id: 'sample-bangmod-corner',
    slug: 'bangmod-corner-coffee',
    name: 'Bang Mod Corner Coffee',
    area: 'บางมด',
    address: 'ข้อมูลตัวอย่าง — ย่านบางมด',
    description: 'ร้านตัวอย่างสำหรับเปรียบเทียบคาเฟ่หลังประชุมหรือทำงานกลุ่มขนาดเล็ก',
    coverEmoji: '☕',
    contexts: ['after-meeting', 'group-work'],
    attributes: {
      capacity: 28,
      recommendedGroup: '2–5 คน',
      outlets: 'some',
      wifi: 'strong',
      foodOptions: ['กาแฟ', 'เบเกอรี', 'ของว่าง'],
      hours: '08:00–18:00',
      atmosphere: ['โต๊ะรวม', 'คุยงานได้', 'แสงธรรมชาติ'],
    },
    fieldNotes: [
      {
        id: 'sample-note-1',
        context: 'group-work',
        recommendedGroup: '3–4 คน',
        note: 'โต๊ะกลางเหมาะกับการเปิดโน้ตบุ๊กหลายเครื่อง แต่ควรเลือกช่วงที่ร้านไม่พลุกพล่าน',
        verifiedAt: '2026-10-29',
        sourceLabel: 'Sample field note',
      },
    ],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Bang+Mod',
    contactUrl: 'mailto:sample-cafe@example.com',
    isSampleData: true,
    lastVerifiedAt: '2026-10-29',
    sourceLabel: 'Prototype sample data',
  },
  {
    id: 'sample-leaf-lab',
    slug: 'leaf-lab-cafe',
    name: 'Leaf Lab Café',
    area: 'บางมด',
    address: 'ข้อมูลตัวอย่าง — ใกล้พื้นที่การศึกษา',
    description: 'คาเฟ่ตัวอย่างที่เน้นบรรยากาศเงียบสำหรับอ่านหนังสือและทำงานเดี่ยว',
    coverEmoji: '🌿',
    contexts: ['focus-study', 'casual-break'],
    attributes: {
      capacity: 18,
      recommendedGroup: '1–2 คน',
      outlets: 'many',
      wifi: 'strong',
      foodOptions: ['กาแฟ', 'ชา', 'ขนม'],
      hours: '09:00–20:00',
      atmosphere: ['เงียบ', 'โต๊ะเดี่ยว', 'มีปลั๊ก'],
    },
    fieldNotes: [
      {
        id: 'sample-note-2',
        context: 'focus-study',
        recommendedGroup: '1–2 คน',
        note: 'จุดริมหน้าต่างเหมาะกับงานที่ต้องใช้สมาธิ และมีปลั๊กใกล้โต๊ะในข้อมูลตัวอย่างนี้',
        verifiedAt: '2026-10-29',
        sourceLabel: 'Sample field note',
      },
    ],
    isSampleData: true,
    lastVerifiedAt: '2026-10-29',
    sourceLabel: 'Prototype sample data',
  },
  {
    id: 'sample-table-talk',
    slug: 'table-talk-studio',
    name: 'Table Talk Studio',
    area: 'บางมด',
    address: 'ข้อมูลตัวอย่าง — รอบมหาวิทยาลัย',
    description: 'ร้านตัวอย่างที่มีโต๊ะขนาดใหญ่สำหรับระดมความคิดและทำงานกลุ่ม',
    coverEmoji: '🪑',
    contexts: ['after-meeting', 'group-work', 'content-creation'],
    attributes: {
      capacity: 40,
      recommendedGroup: '4–8 คน',
      outlets: 'limited',
      wifi: 'available',
      foodOptions: ['อาหารจานเดียว', 'กาแฟ', 'เครื่องดื่ม'],
      hours: '10:00–21:00',
      atmosphere: ['โต๊ะใหญ่', 'คุยงานได้', 'พื้นที่กว้าง'],
    },
    fieldNotes: [
      {
        id: 'sample-note-3',
        context: 'group-work',
        recommendedGroup: '5–6 คน',
        note: 'เหมาะกับกลุ่มที่ต้องใช้โต๊ะกว้าง แต่ควรตรวจจำนวนปลั๊กกับร้านก่อนใช้งานจริง',
        verifiedAt: '2026-10-29',
        sourceLabel: 'Sample field note',
      },
    ],
    isSampleData: true,
    lastVerifiedAt: '2026-10-29',
    sourceLabel: 'Prototype sample data',
  },
  {
    id: 'sample-slow-morning',
    slug: 'slow-morning-brew',
    name: 'Slow Morning Brew',
    area: 'บางมด',
    address: 'ข้อมูลตัวอย่าง — เส้นทางไปบางมด',
    description: 'ร้านตัวอย่างสำหรับพักระหว่างวันและนัดคุยสั้น ๆ ในบรรยากาศสบาย',
    coverEmoji: '🥐',
    contexts: ['casual-break', 'after-meeting'],
    attributes: {
      capacity: 24,
      recommendedGroup: '2–3 คน',
      outlets: 'some',
      wifi: 'available',
      foodOptions: ['บรันช์', 'เบเกอรี', 'เครื่องดื่ม'],
      hours: '07:30–17:30',
      atmosphere: ['สบาย ๆ', 'อาหารเช้า', 'แสงดี'],
    },
    fieldNotes: [
      {
        id: 'sample-note-4',
        context: 'casual-break',
        recommendedGroup: '2 คน',
        note: 'เหมาะกับการพักคุยหลังประชุมสั้น ๆ มากกว่าการนั่งทำงานต่อเนื่องทั้งวัน',
        verifiedAt: '2026-10-29',
        sourceLabel: 'Sample field note',
      },
    ],
    isSampleData: true,
    lastVerifiedAt: '2026-10-29',
    sourceLabel: 'Prototype sample data',
  },
  {
    id: 'sample-frame-foundry',
    slug: 'frame-foundry',
    name: 'Frame Foundry',
    area: 'บางมด',
    address: 'ข้อมูลตัวอย่าง — ชุมชนบางมด',
    description: 'คาเฟ่ตัวอย่างที่จัดมุมถ่ายภาพและเหมาะกับนัดเพื่อนหรือสร้างคอนเทนต์',
    coverEmoji: '📷',
    contexts: ['content-creation', 'casual-break'],
    attributes: {
      capacity: 32,
      recommendedGroup: '2–4 คน',
      outlets: 'limited',
      wifi: 'unknown',
      foodOptions: ['กาแฟพิเศษ', 'ขนม', 'เครื่องดื่มเย็น'],
      hours: '10:00–19:00',
      atmosphere: ['มุมถ่ายรูป', 'แสงธรรมชาติ', 'ตกแต่งโดดเด่น'],
    },
    fieldNotes: [
      {
        id: 'sample-note-5',
        context: 'content-creation',
        recommendedGroup: '2–3 คน',
        note: 'เหมาะกับการถ่ายภาพขนาดเล็ก โดยข้อมูลนี้เป็นตัวอย่างและต้องยืนยันข้อกำหนดกับร้านจริงก่อนใช้งาน',
        verifiedAt: '2026-10-29',
        sourceLabel: 'Sample field note',
      },
    ],
    isSampleData: true,
    lastVerifiedAt: '2026-10-29',
    sourceLabel: 'Prototype sample data',
  },
];

export function formatThaiDate(value: string): string {
  const date = new Date(`${value}T00:00:00+07:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function matchesDiscoveryFilters(cafe: CafePresentation, filters: DiscoveryFilters): boolean {
  if (filters.context !== 'all' && !cafe.contexts.includes(filters.context)) return false;
  if (filters.partySize && cafe.attributes.capacity < filters.partySize) return false;
  if (filters.requiresOutlets && cafe.attributes.outlets === 'none') return false;
  if (filters.requiresWifi && cafe.attributes.wifi === 'unknown') return false;
  if (filters.servesFood && cafe.attributes.foodOptions.length === 0) return false;
  return true;
}

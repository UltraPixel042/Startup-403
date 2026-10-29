import type { CafeFloorPlan, FloorPlanObject } from "./types";

const table = (id: string, label: string, x: number, y: number, seats: number, sockets = 0, width = 15, height = 14): FloorPlanObject => ({
  id,
  kind: "table",
  label,
  x,
  y,
  width,
  height,
  seats,
  sockets,
  bookable: true,
});

const sharedGroundFloor = (tables: FloorPlanObject[]) => ({
  id: "ground",
  label: "ชั้น 1",
  description: "โซนหลักของร้าน — ข้อมูลจำลองจากไฟล์กำหนดผัง",
  objects: [
    { id: "entry", kind: "entrance" as const, label: "ทางเข้า", x: 3, y: 77, width: 18, height: 12 },
    { id: "counter", kind: "counter" as const, label: "Counter / รับออเดอร์", x: 3, y: 5, width: 36, height: 14 },
    { id: "restroom", kind: "restroom" as const, label: "ห้องน้ำ", x: 80, y: 5, width: 15, height: 14 },
    { id: "stairs", kind: "stairs" as const, label: "ขึ้นชั้น 2", x: 81, y: 74, width: 14, height: 15 },
    { id: "outlet-wall-a", kind: "outlet" as const, label: "ปลั๊กผนัง A", x: 42, y: 6, width: 6, height: 6, sockets: 4 },
    { id: "outlet-wall-b", kind: "outlet" as const, label: "ปลั๊กผนัง B", x: 68, y: 84, width: 6, height: 6, sockets: 2 },
    { id: "window", kind: "feature" as const, label: "หน้าต่าง / แสงธรรมชาติ", x: 97, y: 26, width: 2, height: 45 },
    ...tables,
  ],
});

export const FLOOR_PLAN_CONFIGS: CafeFloorPlan[] = [
  {
    id: "bangmod-corner-layout",
    cafeId: "bangmod-corner-coffee",
    name: "Bang Mod Corner Coffee",
    dataLabel: "Sample layout · ยังไม่ใช่ผังตรวจหน้างาน",
    floors: [
      sharedGroundFloor([
        table("bmc-a1", "A1", 13, 31, 2, 2),
        table("bmc-a2", "A2", 34, 31, 2, 2),
        table("bmc-b1", "B1", 57, 29, 4, 0, 22, 16),
        table("bmc-b2", "B2", 19, 57, 4, 2, 22, 16),
        table("bmc-c1", "C1", 54, 58, 6, 0, 28, 17),
      ]),
      {
        id: "mezzanine",
        label: "ชั้นลอย",
        description: "โซนเงียบสำหรับงานเดี่ยว — ข้อมูลจำลอง",
        objects: [
          { id: "stairs-up", kind: "stairs", label: "ลงชั้น 1", x: 4, y: 74, width: 16, height: 16 },
          { id: "restroom-up", kind: "restroom", label: "ห้องน้ำ", x: 81, y: 6, width: 14, height: 14 },
          { id: "outlet-up", kind: "outlet", label: "ปลั๊กริมผนัง", x: 92, y: 34, width: 5, height: 7, sockets: 6 },
          { id: "feature-up", kind: "feature", label: "ราวชั้นลอย", x: 1, y: 4, width: 67, height: 3 },
          table("bmc-m1", "M1", 20, 30, 1, 2, 13, 13),
          table("bmc-m2", "M2", 42, 30, 1, 2, 13, 13),
          table("bmc-m3", "M3", 63, 30, 2, 0),
          table("bmc-m4", "M4", 38, 59, 2, 2),
        ],
      },
    ],
  },
  {
    id: "leaf-lab-layout",
    cafeId: "leaf-lab-cafe",
    name: "Leaf Lab Café",
    dataLabel: "Sample layout · ยังไม่ใช่ผังตรวจหน้างาน",
    floors: [
      sharedGroundFloor([
        table("leaf-1", "W1", 17, 32, 1, 2, 13, 13),
        table("leaf-2", "W2", 39, 32, 1, 2, 13, 13),
        table("leaf-3", "W3", 61, 32, 1, 2, 13, 13),
        table("leaf-4", "S1", 22, 59, 2, 0),
        table("leaf-5", "S2", 52, 59, 2, 2),
      ]),
      {
        id: "upper-floor",
        label: "ชั้น 2",
        description: "ชั้น 2 สำหรับนั่งทำงานและกลุ่มย่อย — ข้อมูลจำลองจากไฟล์กำหนดผัง",
        objects: [
          { id: "leaf-stairs", kind: "stairs", label: "ลงชั้น 1", x: 4, y: 74, width: 16, height: 16 },
          { id: "leaf-restroom", kind: "restroom", label: "ห้องน้ำ", x: 81, y: 6, width: 14, height: 14 },
          { id: "leaf-outlet", kind: "outlet", label: "ปลั๊กผนัง", x: 92, y: 34, width: 5, height: 7, sockets: 6 },
          { id: "leaf-railing", kind: "feature", label: "ราวชั้น 2", x: 2, y: 4, width: 64, height: 3 },
          table("leaf-6", "U1", 18, 30, 2, 2, 16, 14),
          table("leaf-7", "U2", 45, 30, 2, 2, 16, 14),
          table("leaf-8", "U3", 68, 30, 2, 0, 16, 14),
          table("leaf-9", "G1", 25, 61, 4, 2, 25, 16),
          table("leaf-10", "G2", 59, 61, 4, 0, 25, 16),
        ],
      },
    ],
  },
  {
    id: "table-talk-layout",
    cafeId: "table-talk-studio",
    name: "Table Talk Studio",
    dataLabel: "Sample layout · ยังไม่ใช่ผังตรวจหน้างาน",
    floors: [sharedGroundFloor([
      table("talk-1", "G1", 14, 30, 6, 2, 28, 16),
      table("talk-2", "G2", 49, 30, 6, 0, 28, 16),
      table("talk-3", "G3", 18, 60, 8, 2, 50, 17),
    ])],
  },
  {
    id: "slow-morning-layout",
    cafeId: "slow-morning-brew",
    name: "Slow Morning Brew",
    dataLabel: "Sample layout · ยังไม่ใช่ผังตรวจหน้างาน",
    floors: [sharedGroundFloor([
      table("slow-1", "P1", 16, 30, 2, 2),
      table("slow-2", "P2", 39, 30, 2, 2),
      table("slow-3", "P3", 64, 30, 2, 0),
      table("slow-4", "B1", 24, 59, 4, 0, 24, 16),
      table("slow-5", "B2", 56, 59, 4, 2, 24, 16),
    ])],
  },
  {
    id: "frame-foundry-layout",
    cafeId: "frame-foundry",
    name: "Frame Foundry",
    dataLabel: "Sample layout · ยังไม่ใช่ผังตรวจหน้างาน",
    floors: [sharedGroundFloor([
      { id: "photo-corner", kind: "feature", label: "มุมถ่ายภาพ", x: 13, y: 27, width: 23, height: 22 },
      table("frame-1", "F1", 48, 30, 2, 2),
      table("frame-2", "F2", 72, 30, 2, 0),
      table("frame-3", "F3", 18, 60, 4, 2, 24, 16),
      table("frame-4", "F4", 54, 59, 4, 0, 24, 16),
    ])],
  },
  {
    id: "legacy-booking-layout",
    cafeId: "legacy-booking-demo",
    name: "Legacy booking demonstration",
    dataLabel: "Legacy sample layout · ใช้ทดสอบ flow จองเท่านั้น",
    floors: [
      sharedGroundFloor([
        table("A1", "A1", 13, 30, 2, 2),
        table("A2", "A2", 34, 30, 2, 2),
        table("A3", "A3", 56, 30, 2, 0),
        table("A4", "A4", 76, 30, 2, 0),
        table("B1", "B1", 13, 58, 4, 2, 21, 16),
        table("B2", "B2", 39, 58, 4, 0, 21, 16),
        table("B3", "B3", 65, 58, 4, 2, 21, 16),
      ]),
      {
        id: "upper-floor",
        label: "ชั้น 2",
        description: "พื้นที่ทำงานกลุ่มสำหรับ flow จองตัวอย่าง",
        objects: [
          { id: "legacy-stairs", kind: "stairs", label: "ลงชั้น 1", x: 4, y: 74, width: 16, height: 16 },
          { id: "legacy-outlet", kind: "outlet", label: "ปลั๊กผนัง", x: 92, y: 35, width: 5, height: 7, sockets: 4 },
          table("C1", "C1", 18, 30, 4, 2, 22, 16),
          table("C2", "C2", 53, 30, 4, 0, 22, 16),
          table("C3", "C3", 32, 61, 6, 2, 31, 17),
        ],
      },
    ],
  },
];

export function getFloorPlan(cafeId: string): CafeFloorPlan | undefined {
  return FLOOR_PLAN_CONFIGS.find((plan) => plan.cafeId === cafeId);
}

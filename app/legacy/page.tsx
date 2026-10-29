import { LegacyCard, LegacyShell } from "../../components/legacy/LegacyShell";

const flows = [
  { href: "/legacy/booking", title: "จองที่นั่ง", detail: "เลือกที่นั่ง เลือกเวลา และดูรายการจองจำลอง" },
  { href: "/legacy/food", title: "สั่งอาหาร", detail: "เพิ่มเมนูในตะกร้าและส่งออเดอร์จำลองไปยังโต๊ะ" },
  { href: "/legacy/cafe", title: "แดชบอร์ดร้าน", detail: "ปรับสถานะที่นั่งและจัดการออเดอร์จำลอง" },
];

export default function LegacyPage() {
  return (
    <LegacyShell title="Prototype ระบบจองเดิมของ BrewBook">
      <p className="max-w-3xl text-stone-300">หน้านี้เป็น archive ของแนวคิด booking-first ก่อน Pivot ไม่ใช่ Minimum Marketable Product ปัจจุบัน และไม่ควรใช้เป็นหลักฐานสถานะที่นั่งหรือการใช้งานจริง</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {flows.map((flow) => <a href={flow.href} key={flow.href}><LegacyCard><h2 className="text-xl font-semibold text-amber-100">{flow.title}</h2><p className="mt-2 text-sm text-stone-400">{flow.detail}</p><span className="mt-5 inline-block text-sm text-amber-200">เปิด flow →</span></LegacyCard></a>)}
      </div>
    </LegacyShell>
  );
}

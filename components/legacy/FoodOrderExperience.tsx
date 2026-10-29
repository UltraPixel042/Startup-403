"use client";

import { useMemo, useState } from "react";
import { LegacyButton, LegacyCard, LegacyShell } from "./LegacyShell";

type MenuItem = { id: number; name: string; category: "Coffee" | "Tea" | "Food"; price: number; emoji: string };

const menu: MenuItem[] = [
  { id: 1, name: "Café Latte", category: "Coffee", price: 85, emoji: "☕" },
  { id: 2, name: "Cold Brew", category: "Coffee", price: 90, emoji: "🧊" },
  { id: 3, name: "Matcha Latte", category: "Tea", price: 95, emoji: "🍵" },
  { id: 4, name: "Croissant", category: "Food", price: 75, emoji: "🥐" },
  { id: 5, name: "Avocado Toast", category: "Food", price: 120, emoji: "🥑" },
  { id: 6, name: "Banana Bread", category: "Food", price: 80, emoji: "🍞" },
];

export function FoodOrderExperience() {
  const [category, setCategory] = useState<"All" | MenuItem["category"]>("All");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [seat, setSeat] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const items = useMemo(() => menu.filter((item) => category === "All" || item.category === category), [category]);
  const cartItems = menu.filter((item) => cart[item.id]);
  const total = cartItems.reduce((sum, item) => sum + item.price * cart[item.id], 0);

  function adjust(id: number, change: number) {
    setCart((current) => {
      const next = Math.max((current[id] ?? 0) + change, 0);
      const updated = { ...current };
      if (next === 0) delete updated[id]; else updated[id] = next;
      return updated;
    });
  }

  function submit() {
    if (!seat.trim() || cartItems.length === 0) return;
    setConfirmation(`ส่งออเดอร์จำลองไปที่นั่ง ${seat.trim()} แล้ว`);
    setCart({});
    setSeat("");
  }

  return (
    <LegacyShell title="สั่งอาหารและเครื่องดื่ม (Prototype เดิม)">
      <div className="grid gap-6 lg:grid-cols-[1.7fr_0.85fr]">
        <div>
          <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="หมวดเมนู">
            {(["All", "Coffee", "Tea", "Food"] as const).map((value) => (
              <button className={`rounded-full px-4 py-2 text-sm ${category === value ? "bg-amber-200 text-stone-950" : "border border-white/10 text-stone-200"}`} key={value} onClick={() => setCategory(value)} type="button">{value}</button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <LegacyCard key={item.id}>
                <div className="flex items-start justify-between"><span className="text-3xl">{item.emoji}</span><span className="text-sm font-semibold text-amber-200">฿{item.price}</span></div>
                <h2 className="mt-4 font-semibold">{item.name}</h2>
                <p className="mt-1 text-sm text-stone-400">รายการตัวอย่างสำหรับ prototype ระบบ QR order</p>
                <div className="mt-4 flex items-center gap-3"><LegacyButton onClick={() => adjust(item.id, 1)}>เพิ่ม</LegacyButton>{cart[item.id] ? <span className="text-sm text-amber-100">ในตะกร้า {cart[item.id]}</span> : null}</div>
              </LegacyCard>
            ))}
          </div>
        </div>
        <LegacyCard>
          <h2 className="text-xl font-semibold">ตะกร้าอาหาร</h2>
          {confirmation ? <p className="mt-2 rounded-xl bg-emerald-300/10 p-3 text-sm text-emerald-100">{confirmation}</p> : null}
          {cartItems.length === 0 ? <p className="mt-4 text-sm text-stone-400">ยังไม่มีรายการในตะกร้า</p> : null}
          <div className="mt-4 space-y-3">
            {cartItems.map((item) => (
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3" key={item.id}>
                <div className="text-sm"><span>{item.emoji}</span><span className="ml-2">{item.name}</span><span className="ml-2 text-stone-400">฿{item.price * cart[item.id]}</span></div>
                <div className="flex gap-2"><button aria-label={`ลด ${item.name}`} className="h-7 w-7 rounded bg-white/10" onClick={() => adjust(item.id, -1)} type="button">−</button><span className="w-4 text-center text-sm">{cart[item.id]}</span><button aria-label={`เพิ่ม ${item.name}`} className="h-7 w-7 rounded bg-white/10" onClick={() => adjust(item.id, 1)} type="button">+</button></div>
              </div>
            ))}
          </div>
          <label className="mt-5 block text-sm text-stone-200" htmlFor="legacy-seat">หมายเลขที่นั่ง</label>
          <input className="mt-2 w-full rounded-xl border border-white/10 bg-[#27160e] p-3 text-sm text-white" id="legacy-seat" onChange={(event) => setSeat(event.target.value)} placeholder="เช่น A1" value={seat} />
          <div className="mt-5 flex items-center justify-between"><span className="font-semibold">รวม ฿{total}</span><LegacyButton disabled={!seat.trim() || cartItems.length === 0} onClick={submit}>ส่งออเดอร์จำลอง</LegacyButton></div>
        </LegacyCard>
      </div>
    </LegacyShell>
  );
}

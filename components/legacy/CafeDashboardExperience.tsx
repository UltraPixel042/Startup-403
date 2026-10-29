"use client";

import { useState } from "react";
import { LegacyCard, LegacyShell } from "./LegacyShell";

type SeatStatus = "available" | "occupied" | "closed";
type OrderStatus = "pending" | "preparing" | "completed";
type Order = { id: string; seat: string; item: string; status: OrderStatus };

const initialSeatStatus: Record<string, SeatStatus> = { A1: "available", A2: "available", A3: "occupied", A4: "closed", B1: "available", B2: "occupied", B3: "available", B4: "available" };
const initialOrders: Order[] = [{ id: "ORD-101", seat: "A3", item: "Café Latte × 1", status: "pending" }, { id: "ORD-102", seat: "B2", item: "Cold Brew × 1", status: "preparing" }];

const badges: Record<SeatStatus | OrderStatus, string> = { available: "bg-emerald-300/15 text-emerald-100", occupied: "bg-red-300/15 text-red-100", closed: "bg-slate-300/15 text-slate-200", pending: "bg-amber-300/15 text-amber-100", preparing: "bg-sky-300/15 text-sky-100", completed: "bg-emerald-300/15 text-emerald-100" };

export function CafeDashboardExperience() {
  const [seats, setSeats] = useState(initialSeatStatus);
  const [orders, setOrders] = useState(initialOrders);
  const activeOrders = orders.filter((order) => order.status !== "completed");
  const available = Object.values(seats).filter((status) => status === "available").length;

  function toggleSeat(id: string) {
    setSeats((current) => ({ ...current, [id]: current[id] === "available" ? "closed" : current[id] === "closed" ? "available" : current[id] }));
  }
  function advanceOrder(id: string) {
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status: order.status === "pending" ? "preparing" : "completed" } : order));
  }

  return (
    <LegacyShell title="Cafe Dashboard (Prototype เดิม)">
      <div className="grid gap-4 sm:grid-cols-3">
        <LegacyCard><p className="text-sm text-stone-400">ที่นั่งทั้งหมด</p><p className="mt-2 text-3xl font-bold text-amber-200">{Object.keys(seats).length}</p></LegacyCard>
        <LegacyCard><p className="text-sm text-stone-400">ที่นั่งว่าง</p><p className="mt-2 text-3xl font-bold text-emerald-200">{available}</p></LegacyCard>
        <LegacyCard><p className="text-sm text-stone-400">ออเดอร์ที่ต้องดูแล</p><p className="mt-2 text-3xl font-bold text-sky-200">{activeOrders.length}</p></LegacyCard>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <LegacyCard>
          <h2 className="text-xl font-semibold">จัดการสถานะที่นั่ง</h2>
          <p className="mt-1 text-sm text-stone-400">คลิกที่นั่งว่างหรือปิดบริการเพื่อสลับสถานะ (ที่นั่งมีผู้ใช้จะล็อกไว้)</p>
          <div className="mt-5 grid grid-cols-4 gap-3">
            {Object.entries(seats).map(([id, status]) => <button className={`rounded-xl p-4 text-sm font-semibold ${badges[status]} disabled:cursor-not-allowed disabled:opacity-80`} disabled={status === "occupied"} key={id} onClick={() => toggleSeat(id)} type="button">{id}<span className="mt-1 block text-[10px] font-normal">{status}</span></button>)}
          </div>
        </LegacyCard>
        <LegacyCard>
          <h2 className="text-xl font-semibold">จัดการออเดอร์</h2>
          <div className="mt-4 space-y-3">
            {orders.map((order) => <article className="rounded-xl border border-white/10 p-4" key={order.id}><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{order.id} · ที่นั่ง {order.seat}</p><p className="mt-1 text-sm text-stone-400">{order.item}</p></div><span className={`rounded-full px-2 py-1 text-xs ${badges[order.status]}`}>{order.status}</span></div>{order.status !== "completed" ? <button className="mt-3 text-sm text-amber-200 underline" onClick={() => advanceOrder(order.id)} type="button">{order.status === "pending" ? "เริ่มเตรียม" : "ทำเสร็จแล้ว"}</button> : null}</article>)}
          </div>
        </LegacyCard>
      </div>
    </LegacyShell>
  );
}

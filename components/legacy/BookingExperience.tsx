"use client";

import { CheckCircle2, PlugZap, RotateCcw, TicketCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { FloorPlanViewer } from "@/components/floor-plan/FloorPlanViewer";
import { getFloorPlan } from "@/lib/floor-plan/sample-layouts";
import type { FloorPlanObject, TableAvailabilityMap } from "@/lib/floor-plan/types";
import { LegacyButton, LegacyCard, LegacyShell } from "./LegacyShell";

type Reservation = { id: string; tableId: string; time: string; tableLabel: string };

const defaultAvailability: TableAvailabilityMap = {
  A1: "available", A2: "available", A3: "available", A4: "occupied", B1: "available", B2: "available", B3: "closed", C1: "available", C2: "available", C3: "available",
};

export function BookingExperience() {
  const searchParams = useSearchParams();
  const requestedCafeId = searchParams.get("cafe") ?? "legacy-booking-demo";
  const plan = getFloorPlan(requestedCafeId) ?? getFloorPlan("legacy-booking-demo");
  const [availability, setAvailability] = useState<TableAvailabilityMap>(defaultAvailability);
  const [onlyPower, setOnlyPower] = useState(false);
  const [selectedTable, setSelectedTable] = useState<FloorPlanObject>();
  const [time, setTime] = useState("10:00–12:00");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [message, setMessage] = useState("เลือกโต๊ะจากผังและช่วงเวลาที่ต้องการได้เลย");

  const selectedAvailability = selectedTable ? availability[selectedTable.id] ?? "available" : undefined;
  const selectedPlanName = plan?.name ?? "Legacy booking demonstration";
  const selectedTablePower = selectedTable?.sockets ?? 0;
  const selectedTableSeats = selectedTable?.seats ?? 0;
  const availableTables = useMemo(() => Object.entries(availability).filter(([, status]) => status === "available").length, [availability]);

  function selectTable(table: FloorPlanObject) {
    setSelectedTable(table);
    setMessage(`เลือก ${table.label} แล้ว — รองรับ ${table.seats ?? 0} ที่นั่ง${table.sockets ? ` และมีปลั๊ก ${table.sockets} จุด` : ""}`);
  }

  function reserve() {
    if (!selectedTable || selectedAvailability !== "available") {
      setMessage("กรุณาเลือกโต๊ะที่ว่างจากผังก่อนจอง");
      return;
    }
    setAvailability((current) => ({ ...current, [selectedTable.id]: "occupied" }));
    setReservations((current) => [{ id: `RES-${current.length + 1}`, tableId: selectedTable.id, tableLabel: selectedTable.label, time }, ...current]);
    setMessage(`บันทึกการจองจำลองสำหรับ ${selectedTable.label} แล้ว`);
    setSelectedTable(undefined);
  }

  function checkout(reservation: Reservation) {
    setAvailability((current) => ({ ...current, [reservation.tableId]: "available" }));
    setReservations((current) => current.filter((item) => item.id !== reservation.id));
    setMessage(`เช็กเอาต์ ${reservation.tableLabel} แล้ว`);
  }

  if (!plan) return null;

  return (
    <LegacyShell title="ระบบจองที่นั่งคาเฟ่ (Prototype เดิม)">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-200/15 bg-sky-100/[0.04] p-4 text-sm text-stone-300">
        <p>กำลังแสดงผังของ <strong className="text-stone-100">{selectedPlanName}</strong> จากไฟล์ configuration เดียวกับหน้า Profile</p>
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-200"><CheckCircle2 size={15} /> โต๊ะว่าง {availableTables} จุด</span>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
        <LegacyCard>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">เลือกโต๊ะจากผังร้าน</h2>
              <p className="mt-1 text-sm text-stone-400">Legacy prototype · สถานะในผังเป็นข้อมูลจำลอง ไม่ใช่สถานะร้านจริง</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-stone-200">
              <input checked={onlyPower} onChange={(event) => setOnlyPower(event.target.checked)} type="checkbox" />
              <PlugZap size={15} className="text-violet-200" /> แสดงเฉพาะโต๊ะมีปลั๊ก
            </label>
          </div>
          <div className="mt-5">
            <FloorPlanViewer plan={plan} availability={availability} selectedTableId={selectedTable?.id} onSelectTable={selectTable} onlyPower={onlyPower} interactive />
          </div>
        </LegacyCard>

        <div className="space-y-6">
          <LegacyCard>
            <h2 className="text-xl font-semibold">ล็อกโต๊ะและจอง</h2>
            <p className="mt-2 min-h-10 text-sm text-amber-100/80">{message}</p>
            <div className="mt-4 rounded-xl border border-white/10 bg-black/15 p-3 text-sm">
              โต๊ะที่เลือก: <strong className="text-amber-200">{selectedTable ? selectedTable.label : "ยังไม่ได้เลือก"}</strong>
              {selectedTable ? <p className="mt-2 flex items-center gap-2 text-xs text-stone-400"><span>{selectedTableSeats} ที่นั่ง</span>{selectedTablePower ? <span className="inline-flex items-center gap-1"><PlugZap size={13} /> ปลั๊ก {selectedTablePower} จุด</span> : <span>ไม่มีปลั๊กในข้อมูลตัวอย่าง</span>}</p> : null}
            </div>
            <label className="mt-4 block text-sm text-stone-200" htmlFor="legacy-time">ช่วงเวลา</label>
            <select className="mt-2 w-full rounded-xl border border-white/10 bg-[#27160e] p-3 text-sm text-white" id="legacy-time" onChange={(event) => setTime(event.target.value)} value={time}>
              <option>08:00–10:00</option><option>10:00–12:00</option><option>13:00–15:00</option><option>15:00–17:00</option>
            </select>
            <div className="mt-5"><LegacyButton disabled={!selectedTable} onClick={reserve}><TicketCheck size={16} /> ยืนยันการจองจำลอง</LegacyButton></div>
          </LegacyCard>
          <LegacyCard>
            <h2 className="text-lg font-semibold">รายการจองของฉัน</h2>
            {reservations.length === 0 ? <p className="mt-3 text-sm text-stone-400">ยังไม่มีรายการจองใน session นี้</p> : null}
            <div className="mt-3 space-y-3">
              {reservations.map((reservation) => (
                <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 p-3" key={reservation.id}>
                  <div className="text-sm"><strong>{reservation.tableLabel}</strong><span className="ml-2 text-stone-400">{reservation.time}</span></div>
                  <button className="inline-flex items-center gap-1 text-xs text-amber-200 underline" onClick={() => checkout(reservation)} type="button"><RotateCcw size={13} /> เช็กเอาต์</button>
                </div>
              ))}
            </div>
          </LegacyCard>
        </div>
      </div>
    </LegacyShell>
  );
}

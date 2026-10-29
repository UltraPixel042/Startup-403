"use client";

import { CheckCircle2, Clock3, PlugZap, RotateCcw, TicketCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { FloorPlanViewer } from "@/components/floor-plan/FloorPlanViewer";
import { getFloorPlan } from "@/lib/floor-plan/sample-layouts";
import type { FloorPlanObject, TableAvailabilityMap } from "@/lib/floor-plan/types";

type Checkin = { id: string; tableId: string; checkedInAt: string };

function createEmptyAvailability(plan: NonNullable<ReturnType<typeof getFloorPlan>>): TableAvailabilityMap {
  return Object.fromEntries(
    plan.floors
      .flatMap((floor) => floor.objects)
      .filter((item) => item.kind === "table")
      .map((table) => [table.id, "available"]),
  ) as TableAvailabilityMap;
}

export function BookingExperience() {
  const searchParams = useSearchParams();
  const requestedCafeSlug = searchParams.get("cafe") ?? "leaf-lab-cafe";
  const plan = getFloorPlan(requestedCafeSlug) ?? getFloorPlan("leaf-lab-cafe");
  const allTables = useMemo(
    () => plan?.floors.flatMap((floor) => floor.objects.filter((item) => item.kind === "table")) ?? [],
    [plan],
  );
  const [availability, setAvailability] = useState<TableAvailabilityMap>(() => createEmptyAvailability(plan!));
  const [onlyPower, setOnlyPower] = useState(false);
  const [selectedTable, setSelectedTable] = useState<FloorPlanObject>();
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("กำลังอ่านสถานะโต๊ะจากระบบ…");

  useEffect(() => {
    if (!plan) return;
    let cancelled = false;
    const initialAvailability = createEmptyAvailability(plan);

    async function loadCheckins() {
      setIsLoading(true);
      setSelectedTable(undefined);
      try {
        const result = await fetch(`/api/seat-checkins?cafe=${encodeURIComponent(requestedCafeSlug)}`, { cache: "no-store" });
        const payload = await result.json() as { activeTableIds?: string[]; myCheckins?: Checkin[]; error?: string };
        if (!result.ok) throw new Error(payload.error ?? "Unable to load seat status.");
        if (cancelled) return;
        setAvailability(Object.fromEntries(Object.keys(initialAvailability).map((tableId) => [tableId, payload.activeTableIds?.includes(tableId) ? "occupied" : "available"])) as TableAvailabilityMap);
        setCheckins(payload.myCheckins ?? []);
        setMessage("เลือกชั้น แล้วเลือกโต๊ะที่มีขอบสีเขียวเพื่อเช็กอินได้เลย");
      } catch {
        if (!cancelled) {
          setAvailability(initialAvailability);
          setCheckins([]);
          setMessage("ยังอ่านสถานะจากฐานข้อมูลไม่ได้ กรุณาลองใหม่อีกครั้ง");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadCheckins();
    return () => { cancelled = true; };
  }, [plan, requestedCafeSlug]);

  const selectedAvailability = selectedTable ? availability[selectedTable.id] ?? "available" : undefined;
  const availableTables = allTables.filter((table) => availability[table.id] === "available").length;

  function selectTable(table: FloorPlanObject) {
    if (isLoading || isSaving) return;
    setSelectedTable(table);
    setMessage(`เลือก ${table.label} แล้ว — รองรับ ${table.seats ?? 0} ที่นั่ง${table.sockets ? ` และมีปลั๊ก ${table.sockets} จุด` : ""}`);
  }

  async function checkIn() {
    if (!selectedTable || selectedAvailability !== "available") {
      setMessage("กรุณาเลือกโต๊ะที่ว่างจากผังก่อนเช็กอิน");
      return;
    }

    setIsSaving(true);
    try {
      const result = await fetch("/api/seat-checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cafeSlug: requestedCafeSlug, tableId: selectedTable.id }),
      });
      const payload = await result.json() as { checkin?: Checkin; error?: string };
      if (!result.ok || !payload.checkin) throw new Error(payload.error ?? "Unable to check in.");
      setAvailability((current) => ({ ...current, [selectedTable.id]: "occupied" }));
      setCheckins((current) => [payload.checkin!, ...current]);
      setMessage(`เช็กอิน ${selectedTable.label} เมื่อ ${formatCheckinTime(payload.checkin.checkedInAt)} แล้ว`);
      setSelectedTable(undefined);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "เช็กอินไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setIsSaving(false);
    }
  }

  async function checkOut(checkin: Checkin) {
    setIsSaving(true);
    try {
      const result = await fetch("/api/seat-checkins", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkinId: checkin.id }),
      });
      const payload = await result.json() as { error?: string };
      if (!result.ok) throw new Error(payload.error ?? "Unable to check out.");
      setAvailability((current) => ({ ...current, [checkin.tableId]: "available" }));
      setCheckins((current) => current.filter((item) => item.id !== checkin.id));
      setMessage(`เช็กเอาต์ ${getTableLabel(checkin.tableId, allTables)} แล้ว`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "เช็กเอาต์ไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setIsSaving(false);
    }
  }

  if (!plan) return null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-6 rounded-2xl border border-sky-200/15 bg-sky-100/[0.04] p-4 text-sm text-stone-300 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <p>กำลังดูผังของ <strong className="text-stone-100">{plan.name}</strong> ซึ่งจัดเก็บเป็น configuration แยกตามร้านและแต่ละชั้น</p>
        <span className="mt-2 inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-emerald-200 sm:mt-0"><CheckCircle2 size={15} /> ว่าง {availableTables} โต๊ะ</span>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(19rem,1fr)]">
        <section className="card p-4 sm:p-6" aria-labelledby="booking-map-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">Seat check-in</p>
              <h1 id="booking-map-heading" className="mt-1 text-2xl font-bold text-stone-50">เลือกโต๊ะจากผังร้าน</h1>
              <p className="mt-1 text-sm leading-6 text-stone-400">สลับชั้นได้จากแท็บในผัง แล้วเช็กอินตามเวลาจริงเมื่อพร้อมใช้งาน</p>
            </div>
            <label className="inline-flex w-fit items-center gap-2 text-sm text-stone-200">
              <input checked={onlyPower} onChange={(event) => setOnlyPower(event.target.checked)} type="checkbox" />
              <PlugZap size={15} className="text-violet-200" /> โต๊ะที่มีปลั๊ก
            </label>
          </div>
          <div className="mt-5">
            <FloorPlanViewer plan={plan} availability={availability} selectedTableId={selectedTable?.id} onSelectTable={selectTable} onlyPower={onlyPower} interactive={!isLoading && !isSaving} />
          </div>
        </section>

        <aside className="space-y-6">
          <section className="card p-5" aria-labelledby="checkin-heading">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">Now</p>
            <h2 id="checkin-heading" className="mt-1 text-xl font-bold text-stone-50">เช็กอินตอนนี้</h2>
            <p className="mt-3 min-h-12 text-sm leading-6 text-amber-100/80" aria-live="polite">{message}</p>
            <div className="mt-4 rounded-xl border border-white/10 bg-black/15 p-3 text-sm">
              โต๊ะที่เลือก: <strong className="text-amber-200">{selectedTable ? selectedTable.label : "ยังไม่ได้เลือก"}</strong>
              {selectedTable ? <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-400"><span>{selectedTable.seats ?? 0} ที่นั่ง</span>{selectedTable.sockets ? <span className="inline-flex items-center gap-1"><PlugZap size={13} /> ปลั๊ก {selectedTable.sockets} จุด</span> : <span>ไม่มีปลั๊กในข้อมูลตัวอย่าง</span>}</p> : null}
            </div>
            <button className="btn-primary mt-5 w-full justify-center" disabled={!selectedTable || isLoading || isSaving} onClick={checkIn} type="button"><TicketCheck size={16} /> {isSaving ? "กำลังบันทึก…" : "เช็กอินตอนนี้"}</button>
            <p className="mt-3 text-xs leading-5 text-stone-500">เมื่อเช็กอิน ระบบจะบันทึกเวลาเริ่มใช้งานจริงและล็อกโต๊ะไว้จนกว่าจะเช็กเอาต์</p>
          </section>

          <section className="card p-5" aria-labelledby="checkin-list-heading">
            <h2 id="checkin-list-heading" className="text-lg font-semibold text-stone-50">โต๊ะที่ฉันกำลังใช้</h2>
            {checkins.length === 0 ? <p className="mt-3 text-sm text-stone-400">ยังไม่มีการเช็กอินใน session นี้</p> : null}
            <div className="mt-3 space-y-3">
              {checkins.map((checkin) => (
                <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 p-3" key={checkin.id}>
                  <div className="text-sm"><strong>{getTableLabel(checkin.tableId, allTables)}</strong><span className="mt-1 flex items-center gap-1 text-xs text-stone-400"><Clock3 size={13} /> {formatCheckinTime(checkin.checkedInAt)}</span></div>
                  <button className="inline-flex items-center gap-1 text-xs text-amber-200 underline disabled:opacity-50" disabled={isSaving} onClick={() => void checkOut(checkin)} type="button"><RotateCcw size={13} /> เช็กเอาต์</button>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function getTableLabel(tableId: string, tables: FloorPlanObject[]) {
  return tables.find((table) => table.id === tableId)?.label ?? tableId;
}

function formatCheckinTime(value: string) {
  return new Intl.DateTimeFormat("th-TH", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

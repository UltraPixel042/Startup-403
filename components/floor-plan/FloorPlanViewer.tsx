"use client";

import {
  Armchair,
  Bath,
  ChevronDown,
  DoorOpen,
  LampDesk,
  Layers3,
  PlugZap,
  Store,
  Table2,
  Triangle,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { CafeFloorPlan, FloorPlanObject, TableAvailabilityMap } from "@/lib/floor-plan/types";

interface FloorPlanViewerProps {
  plan: CafeFloorPlan;
  availability?: TableAvailabilityMap;
  selectedTableId?: string;
  onSelectTable?: (table: FloorPlanObject) => void;
  onlyPower?: boolean;
  interactive?: boolean;
}

const objectMeta: Record<FloorPlanObject["kind"], { icon: LucideIcon; className: string; label: string }> = {
  table: { icon: Table2, className: "border-sky-300/40 bg-sky-300/15 text-sky-50", label: "โต๊ะ" },
  counter: { icon: Store, className: "border-amber-200/30 bg-amber-200/10 text-amber-100", label: "เคาน์เตอร์" },
  outlet: { icon: PlugZap, className: "border-violet-300/40 bg-violet-300/15 text-violet-100", label: "ปลั๊กไฟ" },
  restroom: { icon: Bath, className: "border-white/20 bg-white/[0.08] text-stone-100", label: "ห้องน้ำ" },
  entrance: { icon: DoorOpen, className: "border-emerald-300/35 bg-emerald-300/10 text-emerald-100", label: "ทางเข้า" },
  stairs: { icon: Triangle, className: "border-orange-200/30 bg-orange-200/10 text-orange-100", label: "บันได" },
  service: { icon: Armchair, className: "border-stone-300/30 bg-stone-300/10 text-stone-100", label: "บริการ" },
  feature: { icon: LampDesk, className: "border-pink-200/25 bg-pink-200/10 text-pink-100", label: "องค์ประกอบ" },
};

const availabilityClass = {
  available: "ring-2 ring-emerald-300/80 hover:border-emerald-100 hover:bg-emerald-300/25",
  occupied: "cursor-not-allowed opacity-45 saturate-50",
  closed: "cursor-not-allowed opacity-30 grayscale",
};

export function FloorPlanViewer({
  plan,
  availability = {},
  selectedTableId,
  onSelectTable,
  onlyPower = false,
  interactive = false,
}: FloorPlanViewerProps) {
  const [floorId, setFloorId] = useState(plan.floors[0]?.id);
  const floor = plan.floors.find((candidate) => candidate.id === floorId) ?? plan.floors[0];
  const visibleObjects = useMemo(
    () => floor.objects.filter((item) => !onlyPower || item.kind !== "table" || (item.sockets ?? 0) > 0),
    [floor.objects, onlyPower],
  );

  if (!floor) return null;

  return (
    <section className="floor-plan-shell" aria-label={`ผังพื้นที่ของ ${plan.name}`}>
      <div className="floor-plan-header">
        <div>
          <p className="floor-plan-kicker"><Layers3 size={14} strokeWidth={1.8} /> Layout preview</p>
          <h2 className="floor-plan-title">ผังพื้นที่ร้าน</h2>
          <p className="floor-plan-subtitle">{plan.dataLabel}</p>
        </div>
        {plan.floors.length > 1 ? (
          <label className="floor-select-wrap">
            <span className="sr-only">เลือกชั้น</span>
            <select value={floor.id} onChange={(event) => setFloorId(event.target.value)} className="floor-select">
              {plan.floors.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
            <ChevronDown aria-hidden="true" size={15} />
          </label>
        ) : null}
      </div>

      <div className="floor-tabs" role="tablist" aria-label="ชั้นของร้าน">
        {plan.floors.map((item) => (
          <button type="button" role="tab" key={item.id} aria-selected={floor.id === item.id} className={floor.id === item.id ? "floor-tab floor-tab-active" : "floor-tab"} onClick={() => setFloorId(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="floor-plan-stage" role="region" aria-label={`${floor.label} ${floor.description}`}>
        <div className="floor-plan-grid" aria-hidden="true" />
        <div className="floor-plan-wall floor-plan-wall-top" aria-hidden="true" />
        <div className="floor-plan-wall floor-plan-wall-right" aria-hidden="true" />
        {visibleObjects.map((item) => <FloorPlanObjectView key={item.id} item={item} availability={availability[item.id]} selected={selectedTableId === item.id} interactive={interactive} onSelectTable={onSelectTable} />)}
      </div>

      <p className="mt-3 text-xs leading-5 text-stone-400">{floor.description}</p>
      <FloorPlanLegend interactive={interactive} />
    </section>
  );
}

function FloorPlanObjectView({
  item,
  availability,
  selected,
  interactive,
  onSelectTable,
}: {
  item: FloorPlanObject;
  availability?: keyof typeof availabilityClass;
  selected: boolean;
  interactive: boolean;
  onSelectTable?: (table: FloorPlanObject) => void;
}) {
  const meta = objectMeta[item.kind];
  const Icon = meta.icon;
  const isSelectable = interactive && item.kind === "table" && item.bookable && availability !== "occupied" && availability !== "closed";
  const commonStyle = {
    left: `${item.x}%`,
    top: `${item.y}%`,
    width: `${item.width}%`,
    height: `${item.height}%`,
    transform: `rotate(${item.rotation ?? 0}deg)`,
  };
  const className = [
    "floor-plan-object",
    `floor-plan-${item.kind}`,
    meta.className,
    item.kind === "table" && availability ? availabilityClass[availability] : "",
    selected ? "floor-plan-object-selected" : "",
    isSelectable ? "floor-plan-object-selectable" : "",
  ].filter(Boolean).join(" ");
  const content = item.kind === "table"
    ? <><span className="floor-plan-table-label">{item.label}</span></>
    : item.kind === "outlet"
      ? <><Icon size={15} strokeWidth={1.75} /><span className="sr-only">{item.label}</span>{item.sockets ? <small>{item.sockets}</small> : null}</>
      : item.kind === "feature"
        ? <><Icon size={15} strokeWidth={1.75} /><span className="sr-only">{item.label}</span></>
        : <><Icon size={17} strokeWidth={1.75} /><span className="floor-plan-object-label">{item.label}</span></>;

  if (isSelectable) {
    return <button type="button" style={commonStyle} className={className} aria-pressed={selected} onClick={() => onSelectTable?.(item)} title={`${item.label} · ${item.seats ?? 0} ที่นั่ง · ปลั๊ก ${item.sockets ?? 0} จุด`}>{content}</button>;
  }
  return <div style={commonStyle} className={className} title={`${meta.label}: ${item.label}`}>{content}</div>;
}

function FloorPlanLegend({ interactive }: { interactive: boolean }) {
  return (
    <div className="floor-plan-legend" aria-label="คำอธิบายสัญลักษณ์ในผัง">
      <span><Table2 size={14} /> โต๊ะ</span><span><PlugZap size={14} /> ปลั๊กไฟ</span><span><Bath size={14} /> ห้องน้ำ</span><span><Store size={14} /> เคาน์เตอร์</span>
      {interactive ? <span className="text-emerald-200"><span className="availability-dot" /> เลือกจองได้</span> : null}
    </div>
  );
}

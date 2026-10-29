'use client';

import Link from 'next/link';
import { Bookmark, CalendarRange, ExternalLink, MapPinned, PanelsTopLeft, PlugZap, Share2, UsersRound, Wifi, Clock3, type LucideIcon } from 'lucide-react';

import { FloorPlanViewer } from '@/components/floor-plan/FloorPlanViewer';
import { getFloorPlan } from '@/lib/floor-plan/sample-layouts';
import { CafeVisualIcon, DiscoveryContextIcon } from './DiscoveryIcons';
import {
  DISCOVERY_CONTEXTS,
  OUTLET_LABELS,
  WIFI_LABELS,
  formatThaiDate,
  type CafeActionPayload,
  type CafePresentation,
} from '../../lib/discovery-presentation';
import { PrototypeDataNotice } from './PrototypeDataNotice';

interface CafeProfileDetailsProps {
  cafe: CafePresentation;
  isSaved?: boolean;
  onAction?: (payload: CafeActionPayload) => void | Promise<void>;
  onSavedChange?: (cafe: CafePresentation, nextSaved: boolean) => void | Promise<void>;
  className?: string;
}

/**
 * Detail view for a discovery-first cafe profile. The route owns persistence;
 * callbacks allow it to record anonymous events without exposing a DB client.
 */
export function CafeProfileDetails({
  cafe,
  isSaved = false,
  onAction,
  onSavedChange,
  className = '',
}: CafeProfileDetailsProps) {
  const dispatchAction = (event: CafeActionPayload['event']) => onAction?.({ cafe, event });
  const floorPlan = getFloorPlan(cafe.slug);

  return (
    <article className={`space-y-6 ${className}`}>
      <PrototypeDataNotice lastUpdated={cafe.lastVerifiedAt} />

      <header className="card overflow-hidden p-0">
        <div className="relative bg-gradient-to-br from-amber-300/20 via-stone-900 to-emerald-950/30 px-6 py-8 sm:px-8">
          <span className="absolute right-5 top-4 text-amber-100/50" aria-hidden="true"><CafeVisualIcon cafeSlug={cafe.slug} size={52} /></span>
          <p className="relative text-sm font-medium text-amber-200">{cafe.area} · {cafe.address}</p>
          <h1 className="relative mt-2 max-w-2xl text-3xl font-bold text-stone-50 sm:text-4xl">{cafe.name}</h1>
          <p className="relative mt-3 max-w-2xl leading-7 text-stone-300">{cafe.description}</p>
        </div>

        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-stone-400">ข้อมูลในโปรไฟล์นี้: <strong className="font-medium text-stone-200">{cafe.sourceLabel}</strong></p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => { dispatchAction('save'); onSavedChange?.(cafe, !isSaved); }} className={isSaved ? 'btn-accent' : 'btn-secondary'} aria-pressed={isSaved}>
              <Bookmark size={16} /> {isSaved ? 'อยู่ในรายการของฉัน' : 'บันทึกร้าน'}
            </button>
            <button type="button" onClick={() => dispatchAction('share')} className="btn-secondary"><Share2 size={16} /> แชร์</button>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2" aria-label="ข้อมูลเหมาะกับการใช้งาน">
        <InfoCard icon={UsersRound} label="เหมาะกับ" value={cafe.attributes.recommendedGroup} detail={`รองรับข้อมูลตัวอย่างสูงสุด ${cafe.attributes.capacity} คน`} />
        <InfoCard icon={PlugZap} label="ปลั๊กไฟ" value={OUTLET_LABELS[cafe.attributes.outlets]} detail="ควรตรวจสอบสถานะกับร้านก่อนใช้งานจริง" />
        <InfoCard icon={Wifi} label="Wi‑Fi" value={WIFI_LABELS[cafe.attributes.wifi]} detail="คุณภาพสัญญาณอาจเปลี่ยนตามช่วงเวลา" />
        <InfoCard icon={Clock3} label="เวลาเปิด" value={cafe.attributes.hours} detail="เวลาเปิดเป็นข้อมูลตัวอย่าง" />
      </section>

      {floorPlan ? (
        <section aria-label="ผังพื้นที่ร้านและการเลือกที่นั่ง" className="space-y-4">
          <FloorPlanViewer plan={floorPlan} />
          <div className="flex flex-col gap-3 rounded-2xl border border-amber-200/15 bg-amber-100/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-100"><PanelsTopLeft size={16} /> เลือกที่นั่งจากผัง</p>
              <p className="mt-1 text-xs leading-5 text-stone-400">ผังแยกตามร้านและชั้นจากไฟล์ configuration เดียวกัน เพื่อให้ขยายร้านและแก้ไขพื้นที่ได้โดยไม่ต้องเขียนหน้าใหม่</p>
            </div>
            <Link href={`/booking?cafe=${encodeURIComponent(cafe.slug)}`} className="btn-primary shrink-0 no-underline"><CalendarRange size={16} /> เลือกโต๊ะและช่วงเวลา</Link>
          </div>
        </section>
      ) : null}

      <section className="card" aria-labelledby="fit-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">Context fit</p>
        <h2 id="fit-heading" className="mt-1 text-xl font-bold text-stone-50">ร้านนี้เหมาะเมื่อคุณ…</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {cafe.contexts.map((context) => {
            const item = DISCOVERY_CONTEXTS.find((candidate) => candidate.value === context);
            return item ? <span key={context} className="inline-flex items-center gap-1.5 rounded-full bg-amber-200/10 px-3 py-2 text-sm text-amber-50"><DiscoveryContextIcon context={context} size={15} />{item.label}</span> : null;
          })}
          {cafe.attributes.atmosphere.map((item) => <span key={item} className="rounded-full bg-white/[0.06] px-3 py-2 text-sm text-stone-200">{item}</span>)}
        </div>
      </section>

      <section className="card" aria-labelledby="notes-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">Field notes</p>
            <h2 id="notes-heading" className="mt-1 text-xl font-bold text-stone-50">ข้อสังเกตตามบริบท</h2>
          </div>
          <p className="text-xs text-stone-500">ทุกข้อเป็นข้อมูลตัวอย่างใน prototype</p>
        </div>
        <ul className="mt-5 space-y-3">
          {cafe.fieldNotes.map((note) => {
            const context = DISCOVERY_CONTEXTS.find((item) => item.value === note.context);
            return (
              <li key={note.id} className="rounded-xl border border-white/[0.08] bg-black/10 p-4">
                <p className="text-sm leading-6 text-stone-200">“{note.note}”</p>
                <p className="mt-3 text-xs text-stone-500">
                  {context ? <span className="mr-1 inline-flex align-text-bottom"><DiscoveryContextIcon context={context.value} size={13} /></span> : null}{context?.label} · แนะนำ {note.recommendedGroup} · {note.sourceLabel} · {formatThaiDate(note.verifiedAt)}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card" aria-labelledby="actions-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">Next step</p>
        <h2 id="actions-heading" className="mt-1 text-xl font-bold text-stone-50">ตัดสินใจต่อจากข้อมูลที่มี</h2>
        <p className="mt-2 text-sm leading-6 text-stone-400">BrewBook ช่วยรวมข้อมูลเพื่อเริ่มเลือก ไม่รับประกันที่นั่งหรือสถานะจริง และไม่ได้เป็นระบบจองใน flow นี้</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {cafe.mapUrl ? <a href={cafe.mapUrl} target="_blank" rel="noreferrer" onClick={() => dispatchAction('map_click')} className="btn-primary"><MapPinned size={16} /> เปิดแผนที่</a> : null}
          {cafe.contactUrl ? <a href={cafe.contactUrl} target="_blank" rel="noreferrer" onClick={() => dispatchAction('contact_click')} className="btn-secondary"><ExternalLink size={16} /> ติดต่อร้าน</a> : null}
        </div>
      </section>
    </article>
  );
}

function InfoCard({ icon: Icon, label, value, detail }: { icon: LucideIcon; label: string; value: string; detail: string }) {
  return (
    <div className="card p-4">
      <p className="inline-flex items-center gap-1.5 text-sm text-stone-400"><Icon size={16} aria-hidden="true" />{label}</p>
      <p className="mt-2 text-lg font-semibold text-stone-50">{value}</p>
      <p className="mt-1 text-xs leading-5 text-stone-500">{detail}</p>
    </div>
  );
}

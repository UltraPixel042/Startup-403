'use client';

import { useState, type FormEvent } from 'react';
import {
  DISCOVERY_CONTEXTS,
  type CafePresentation,
  type DiscoveryContext,
  type FieldNoteDraft,
} from '../../lib/discovery-presentation';
import { PrototypeDataNotice } from './PrototypeDataNotice';

interface FieldNoteFormProps {
  cafes: Pick<CafePresentation, 'id' | 'name' | 'area' | 'isSampleData'>[];
  initialCafeId?: string;
  onSubmit: (draft: FieldNoteDraft) => void | Promise<void>;
  className?: string;
}

/**
 * Partner / community contribution form. Submission remains pending until a
 * route-side review workflow verifies it; it must never overwrite café facts directly.
 */
export function FieldNoteForm({ cafes, initialCafeId, onSubmit, className = '' }: FieldNoteFormProps) {
  const [cafeId, setCafeId] = useState(initialCafeId ?? cafes[0]?.id ?? '');
  const [context, setContext] = useState<DiscoveryContext>('group-work');
  const [recommendedGroup, setRecommendedGroup] = useState('2–4 คน');
  const [note, setNote] = useState('');
  const [sourceLabel, setSourceLabel] = useState('ข้อมูลที่ผู้ใช้เสนอ (รอตรวจสอบ)');
  const [contactName, setContactName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = cafeId.length > 0 && note.trim().length >= 20 && sourceLabel.trim().length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit({
        cafeId,
        context,
        recommendedGroup: recommendedGroup.trim(),
        note: note.trim(),
        sourceLabel: sourceLabel.trim(),
        contactName: contactName.trim() || undefined,
      });
      setSubmitted(true);
      setNote('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={`card max-w-2xl ${className}`} aria-labelledby="field-note-heading">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">Partner contribution</p>
      <h1 id="field-note-heading" className="mt-1 text-2xl font-bold text-stone-50">เสนอข้อมูลหรือข้อสังเกตร้าน</h1>
      <p className="mt-2 text-sm leading-6 text-stone-400">ข้อมูลทุกข้อจะมีสถานะ “รอตรวจสอบ” ก่อนแสดงในโปรไฟล์ร้าน และไม่เปลี่ยนข้อมูลสาธารณะโดยอัตโนมัติ</p>
      <PrototypeDataNotice className="mt-4" />

      {submitted ? (
        <div className="mt-5 rounded-xl border border-emerald-300/30 bg-emerald-400/10 p-4 text-sm text-emerald-50" role="status">
          รับข้อมูลแล้วในสถานะรอตรวจสอบ ขอบคุณที่ช่วยให้ข้อมูลร้านมีประโยชน์มากขึ้น
        </div>
      ) : null}

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-stone-200">
          เลือกร้าน
          <select value={cafeId} onChange={(event) => setCafeId(event.target.value)} className="mt-2 block w-full rounded-xl border border-white/10 bg-stone-950/50 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-amber-200" required>
            {cafes.length === 0 ? <option value="">ยังไม่มีร้านให้เลือก</option> : null}
            {cafes.map((cafe) => <option key={cafe.id} value={cafe.id}>{cafe.name} — {cafe.area}{cafe.isSampleData ? ' (sample)' : ''}</option>)}
          </select>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-stone-200">
            บริบทที่เกี่ยวข้อง
            <select value={context} onChange={(event) => setContext(event.target.value as DiscoveryContext)} className="mt-2 block w-full rounded-xl border border-white/10 bg-stone-950/50 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-amber-200">
              {DISCOVERY_CONTEXTS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-stone-200">
            จำนวนคนที่เหมาะ
            <input value={recommendedGroup} onChange={(event) => setRecommendedGroup(event.target.value)} className="mt-2 block w-full rounded-xl border border-white/10 bg-stone-950/50 px-3 py-2.5 text-sm text-stone-100 outline-none placeholder:text-stone-600 focus:border-amber-200" placeholder="เช่น 2–4 คน" maxLength={40} required />
          </label>
        </div>

        <label className="block text-sm font-medium text-stone-200">
          ข้อสังเกต
          <textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-2 block min-h-32 w-full resize-y rounded-xl border border-white/10 bg-stone-950/50 px-3 py-2.5 text-sm leading-6 text-stone-100 outline-none placeholder:text-stone-600 focus:border-amber-200" placeholder="เช่น โต๊ะด้านในเหมาะกับกลุ่ม 3–4 คน แต่ปลั๊กมีเฉพาะผนังด้านซ้าย" maxLength={500} minLength={20} required />
          <span className="mt-1 block text-right text-xs text-stone-500">{note.length}/500 · อย่างน้อย 20 ตัวอักษร</span>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-stone-200">
            แหล่งที่มา / สถานะ
            <input value={sourceLabel} onChange={(event) => setSourceLabel(event.target.value)} className="mt-2 block w-full rounded-xl border border-white/10 bg-stone-950/50 px-3 py-2.5 text-sm text-stone-100 outline-none placeholder:text-stone-600 focus:border-amber-200" maxLength={120} required />
          </label>
          <label className="block text-sm font-medium text-stone-200">
            ชื่อผู้ติดต่อ <span className="font-normal text-stone-500">(ไม่บังคับ)</span>
            <input value={contactName} onChange={(event) => setContactName(event.target.value)} className="mt-2 block w-full rounded-xl border border-white/10 bg-stone-950/50 px-3 py-2.5 text-sm text-stone-100 outline-none placeholder:text-stone-600 focus:border-amber-200" placeholder="สำหรับทีมตรวจสอบ" maxLength={80} />
          </label>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-xs leading-5 text-stone-500">เมื่อส่งแล้ว รายการนี้ควรบันทึกเป็น `pending` ใน `profile_change_requests` และต้องผ่านการตรวจสอบก่อนเผยแพร่</p>
          <button type="submit" disabled={!canSubmit || submitting} className="btn-primary disabled:cursor-not-allowed disabled:opacity-50">
            {submitting ? 'กำลังส่ง…' : 'ส่งเพื่อรอตรวจสอบ'}
          </button>
        </div>
      </form>
    </section>
  );
}

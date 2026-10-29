import { CircleAlert } from 'lucide-react';

import { formatThaiDate } from '../../lib/discovery-presentation';

interface PrototypeDataNoticeProps {
  lastUpdated?: string;
  className?: string;
  compact?: boolean;
}

/** Visible provenance label for all prototype/sample café content. */
export function PrototypeDataNotice({
  lastUpdated,
  className = '',
  compact = false,
}: PrototypeDataNoticeProps) {
  return (
    <aside
      className={`rounded-xl border border-amber-300/25 bg-amber-300/10 text-amber-100 ${
        compact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'
      } ${className}`}
      aria-label="สถานะข้อมูลต้นแบบ"
    >
      <CircleAlert className="mr-1.5 inline-block align-text-bottom" aria-hidden="true" size={compact ? 14 : 16} />
      <strong>ข้อมูลตัวอย่าง / Prototype</strong>
      {!compact && ' — ข้อมูลร้านในหน้านี้ใช้เพื่อทดสอบ flow เท่านั้น และยังไม่ใช่ข้อมูลร้านที่ยืนยันแล้ว'}
      {lastUpdated ? ` · อัปเดตตัวอย่าง ${formatThaiDate(lastUpdated)}` : ''}
    </aside>
  );
}

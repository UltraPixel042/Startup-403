import Link from 'next/link';

const links = [
  { href: '/discover', label: 'ค้นหาร้าน' },
  { href: '/booking', label: 'เลือกที่นั่ง' },
  { href: '/shortlist', label: 'รายการที่บันทึก' },
  { href: '/partner/field-notes', label: 'อัปเดตข้อมูลร้าน' },
];

export function SiteNavigation() {
  return (
    <header className="glass-strong sticky top-0 z-40 border-x-0 border-t-0">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="BrewBook navigation">
        <Link href="/" className="flex items-center gap-2 no-underline" aria-label="BrewBook home">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#D4A373] to-[#8B5A2B] text-sm font-bold text-white" aria-hidden="true">BB</span>
          <span className="text-xl font-bold gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>BrewBook</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm text-slate-300 no-underline transition hover:bg-white/5 hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
        <Link href="/discover" className="btn-primary text-sm no-underline">เริ่มค้นหา</Link>
      </nav>
    </header>
  );
}

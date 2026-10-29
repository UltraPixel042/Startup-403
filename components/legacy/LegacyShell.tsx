"use client";

import type { ReactNode } from "react";

const links = [
  { href: "/legacy", label: "ภาพรวม" },
  { href: "/legacy/booking", label: "จองที่นั่ง" },
  { href: "/legacy/food", label: "สั่งอาหาร" },
  { href: "/legacy/cafe", label: "แดชบอร์ดร้าน" },
];

export function LegacyShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#1a0f0a] px-4 py-8 text-[#fdf5e6] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-2xl border border-amber-100/15 bg-amber-50/5 p-4 text-sm text-amber-100/80">
          <p className="font-semibold text-amber-200">Legacy booking prototype</p>
          <p className="mt-1">
            หน้านี้เก็บ flow ระบบจองเดิมไว้เพื่ออ้างอิงก่อนทีม Pivot ไปสู่ BrewBook แบบค้นหาคาเฟ่ตามบริบท
            ข้อมูลทั้งหมดเป็นข้อมูลจำลองภายในเบราว์เซอร์
          </p>
        </div>
        <nav className="mb-8 flex flex-wrap gap-2" aria-label="Legacy prototype navigation">
          {links.map((link) => (
            <a
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-200 transition hover:border-amber-300/50 hover:bg-amber-200/10"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
          <a
            className="rounded-full border border-emerald-300/30 px-4 py-2 text-sm text-emerald-100 transition hover:bg-emerald-200/10"
            href="/discover"
          >
            ไปยัง MMP ใหม่
          </a>
        </nav>
        <header className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300">BrewBook archive</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>
        </header>
        {children}
      </div>
    </main>
  );
}

export function LegacyButton({
  children,
  disabled = false,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#a67b5b] to-[#8b5a2b] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

export function LegacyCard({ children }: { children: ReactNode }) {
  return <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10">{children}</section>;
}

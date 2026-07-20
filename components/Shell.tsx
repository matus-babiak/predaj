"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { activeDays, streak } from "@/lib/gamify";
import type { Entry, Reflection } from "@/lib/types";

const NAV = [
  { href: "/", label: "Dnes", icon: "☀️" },
  { href: "/dennik", label: "Denník", icon: "📒" },
  { href: "/program", label: "Program", icon: "🧭" },
  { href: "/namietky", label: "Námietky", icon: "🥊" },
  { href: "/plusy-minusy", label: "Plusy a mínusy", icon: "⚖️" },
  { href: "/otazky", label: "Otázky", icon: "❓" },
  { href: "/produkty", label: "Produkty", icon: "🗂️" },
  { href: "/statistiky", label: "Štatistiky", icon: "📈" },
];

const SYNC_LABEL = {
  loading: { dot: "bg-zinc-400", text: "Načítavam…" },
  synced: { dot: "bg-emerald-500", text: "Uložené" },
  pending: { dot: "bg-amber-500", text: "Ukladám…" },
  offline: { dot: "bg-red-500", text: "Offline — uložené v zariadení" },
};

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { db, sync } = useStore();

  if (pathname === "/login") return <>{children}</>;

  const s = streak(activeDays(db.entries as Entry[], db.reflections as Reflection[]));
  const syncInfo = SYNC_LABEL[sync];

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-indigo-600 text-white"
                : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="mt-auto space-y-2 pt-4 text-xs text-zinc-500 dark:text-zinc-400">
      {s > 0 && (
        <div className="flex items-center gap-1.5">
          <span aria-hidden>🔥</span> Séria: {s} {s === 1 ? "deň" : s < 5 ? "dni" : "dní"}
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <span className={`inline-block h-2 w-2 rounded-full ${syncInfo.dot}`} />
        {syncInfo.text}
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh md:flex">
      {/* Mobilná horná lišta */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur md:hidden dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="font-semibold">🥋 Sales Dojo</div>
        <button
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
        >
          {open ? "✕" : "☰"}
        </button>
      </header>

      {/* Mobilné menu */}
      {open && (
        <div className="fixed inset-0 z-20 bg-black/30 md:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute top-[53px] left-0 right-0 flex flex-col gap-1 border-b border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
            onClick={(e) => e.stopPropagation()}
          >
            {nav}
            {footer}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:shrink-0 md:flex-col md:gap-4 md:border-r md:border-zinc-200 md:p-4 md:dark:border-zinc-800 md:sticky md:top-0 md:h-dvh">
        <div className="px-2 py-1 text-lg font-semibold">🥋 Sales Dojo</div>
        {nav}
        {footer}
      </aside>

      <main className="mx-auto w-full max-w-3xl flex-1 p-4 pb-24 md:p-8">{children}</main>
    </div>
  );
}

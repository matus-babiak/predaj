"use client";

// Globálne vyhľadávanie naprieč appkou: námietky, myšlienky (banka aj vlastné),
// produktové kartičky. Otvára sa klávesovou skratkou (Ctrl/Cmd+K, alebo "/" mimo
// textového poľa) alebo tlačidlom v hlavičke/bočnom paneli.

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/lib/useData";
import { OBJECTIONS } from "@/content/objections";
import { THOUGHTS } from "@/content/mindset";
import { normalizeSearch, SEARCH_TYPE_LABEL, type SearchResult } from "@/lib/searchIndex";

const TYPE_ICON: Record<SearchResult["type"], string> = {
  namietka: "🥊",
  "vlastna-namietka": "🥊",
  myslienka: "🧠",
  "vlastna-myslienka": "🧠",
  produkt: "🗂️",
};

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { products, userObjections, myThoughts, ready } = useData();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo(() => {
    const q = normalizeSearch(query);
    if (!ready || q.length < 1) return [];

    const all: SearchResult[] = [];

    for (const o of OBJECTIONS) {
      all.push({
        type: "namietka",
        id: o.id,
        title: o.text,
        subtitle: o.meaning,
        href: `/namietky?q=${o.id}`,
      });
    }
    for (const u of userObjections) {
      all.push({
        type: "vlastna-namietka",
        id: u.id,
        title: u.text,
        subtitle: u.meaning,
        href: `/namietky?q=${u.id}`,
      });
    }
    for (const t of THOUGHTS) {
      all.push({
        type: "myslienka",
        id: t.id,
        title: t.text,
        subtitle: t.author,
        href: `/mindset?q=${t.id}`,
      });
    }
    for (const t of myThoughts) {
      all.push({
        type: "vlastna-myslienka",
        id: t.id,
        title: t.text,
        href: `/mindset?q=${t.id}`,
      });
    }
    for (const p of products) {
      all.push({
        type: "produkt",
        id: p.id,
        title: p.name,
        subtitle: p.category || p.problem || p.who,
        href: `/produkty?q=${p.id}`,
      });
    }

    const scored = all
      .map((r) => {
        const haystack = normalizeSearch(`${r.title} ${r.subtitle ?? ""}`);
        const idx = haystack.indexOf(q);
        return { r, idx };
      })
      .filter((x) => x.idx !== -1)
      .sort((a, b) => a.idx - b.idx);

    return scored.map((x) => x.r).slice(0, 30);
  }, [query, ready, products, userObjections, myThoughts]);

  const goTo = (href: string) => {
    router.push(href);
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && results.length > 0) goTo(results[0].href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, results]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose}>
      <div
        className="mx-auto mt-16 w-[92%] max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <span aria-hidden>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hľadaj naprieč námietkami, myšlienkami, produktmi…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
          />
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim().length === 0 ? (
            <p className="p-4 text-center text-sm text-zinc-400">Začni písať, výsledky sa hľadajú naprieč celou appkou.</p>
          ) : results.length === 0 ? (
            <p className="p-4 text-center text-sm text-zinc-400">Nič som nenašiel.</p>
          ) : (
            <ul className="space-y-1">
              {results.map((r) => (
                <li key={`${r.type}-${r.id}`}>
                  <button
                    type="button"
                    onClick={() => goTo(r.href)}
                    className="flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <span className="mt-0.5 shrink-0" aria-hidden>
                      {TYPE_ICON[r.type]}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">{r.title}</span>
                      {r.subtitle && (
                        <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">{r.subtitle}</span>
                      )}
                    </span>
                    <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {SEARCH_TYPE_LABEL[r.type]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

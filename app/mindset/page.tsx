"use client";

// Mindset: banka myšlienok o predaji na nakopnutie správneho nastavenia hlavy,
// plus vlastné myšlienky, ktoré si používateľ postupne pridáva.

import { useMemo, useState } from "react";
import { useData } from "@/lib/useData";
import { uid } from "@/lib/store";
import { THOUGHTS, THOUGHT_CATEGORIES, type Thought } from "@/content/mindset";
import type { MyThought, Settings } from "@/lib/types";
import { Btn, Card, Input, SectionTitle } from "@/components/ui";

function dayIndex(): number {
  const now = new Date();
  const start = Date.UTC(now.getFullYear(), 0, 0);
  const diff = Date.now() - start;
  return Math.floor(diff / 86400000);
}

function formatDay(ts: number): string {
  return new Date(ts).toLocaleDateString("sk-SK", { day: "numeric", month: "short", year: "numeric" });
}

export default function MindsetPage() {
  const { myThoughts, settings, put, remove, ready } = useData();
  const [filter, setFilter] = useState<string | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [text, setText] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [dayOpen, setDayOpen] = useState(false);

  const quoteOfDay = useMemo(() => THOUGHTS[dayIndex() % THOUGHTS.length], []);

  if (!ready) return null;

  const favorites = settings.favoriteThoughts ?? [];
  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = (id: string) => {
    const next: Settings = {
      ...settings,
      favoriteThoughts: isFavorite(id) ? favorites.filter((f) => f !== id) : [...favorites, id],
      updatedAt: Date.now(),
    };
    put("settings", next);
  };

  const addThought = () => {
    const t = text.trim();
    if (!t) return;
    const now = Date.now();
    put("myThoughts", { id: uid(), ts: now, text: t, updatedAt: now } satisfies MyThought);
    setText("");
  };

  const list = THOUGHTS.filter((t) => {
    if (onlyFavorites && !isFavorite(t.id)) return false;
    if (filter && t.category !== filter) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">🧠 Mindset</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Myšlienky, ktoré ti pomôžu naladiť hlavu na predaj, a miesto na tie vlastné.
        </p>
      </div>

      {/* Myšlienka dňa */}
      <Card className="border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/30">
        <SectionTitle>Myšlienka dňa</SectionTitle>
        <button type="button" className="w-full text-left" onClick={() => setDayOpen(!dayOpen)}>
          <p className="text-[17px] font-medium leading-relaxed text-zinc-800 md:text-[19px] dark:text-zinc-100">
            „{quoteOfDay.text}“
          </p>
          {quoteOfDay.author && (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{quoteOfDay.author}</p>
          )}
        </button>
        {dayOpen && quoteOfDay.detail && (
          <p className="mt-3 border-t border-indigo-200 pt-3 text-sm leading-relaxed text-zinc-600 dark:border-indigo-900 dark:text-zinc-300">
            {quoteOfDay.detail}
          </p>
        )}
        {quoteOfDay.detail && (
          <button
            type="button"
            onClick={() => setDayOpen(!dayOpen)}
            className="mt-2 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            {dayOpen ? "menej" : "viac do hĺbky"}
          </button>
        )}
      </Card>

      {/* Vlastné myšlienky */}
      <div>
        <SectionTitle>Moje myšlienky ({myThoughts.length})</SectionTitle>
        <Card>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addThought();
            }}
            className="flex gap-2"
          >
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="napr. Dnes stačí jeden dobrý rozhovor."
            />
            <Btn type="submit" disabled={!text.trim()}>
              Pridať
            </Btn>
          </form>
        </Card>
        {myThoughts.length > 0 && (
          <ul className="mt-3 space-y-2">
            {myThoughts.map((t) => (
              <li
                key={t.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <div className="text-zinc-800 dark:text-zinc-200">{t.text}</div>
                  <div className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">{formatDay(t.ts)}</div>
                </div>
                <DeleteButton onDelete={() => remove("myThoughts", t.id)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Banka myšlienok */}
      <div>
        <SectionTitle>Banka myšlienok ({list.length})</SectionTitle>
        <div className="mb-3 flex flex-wrap gap-1.5">
          <FilterChip label="Všetky" active={filter === null} onClick={() => setFilter(null)} />
          {THOUGHT_CATEGORIES.map((c) => (
            <FilterChip
              key={c.id}
              label={c.label}
              active={filter === c.id}
              onClick={() => setFilter(filter === c.id ? null : c.id)}
            />
          ))}
          <FilterChip
            label={`⭐ Obľúbené (${favorites.length})`}
            active={onlyFavorites}
            onClick={() => setOnlyFavorites(!onlyFavorites)}
          />
        </div>
        <div className="space-y-2">
          {list.length === 0 ? (
            <p className="text-sm text-zinc-400 dark:text-zinc-500">Žiadne myšlienky v tomto filtri.</p>
          ) : (
            list.map((t) => (
              <ThoughtCard
                key={t.id}
                t={t}
                fav={isFavorite(t.id)}
                onToggleFav={() => toggleFavorite(t.id)}
                open={openId === t.id}
                onToggleOpen={() => setOpenId(openId === t.id ? null : t.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ThoughtCard({
  t,
  fav,
  onToggleFav,
  open,
  onToggleOpen,
}: {
  t: Thought;
  fav: boolean;
  onToggleFav: () => void;
  open: boolean;
  onToggleOpen: () => void;
}) {
  return (
    <Card className="!p-3">
      <div className="flex items-start justify-between gap-3">
        <button type="button" className="flex-1 text-left" onClick={onToggleOpen}>
          <p className="text-[17px] leading-relaxed text-zinc-800 md:text-[19px] dark:text-zinc-200">„{t.text}“</p>
          {t.author && <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">{t.author}</p>}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav();
          }}
          aria-label={fav ? "Odobrať z obľúbených" : "Pridať medzi obľúbené"}
          className={`shrink-0 text-lg ${fav ? "text-amber-500" : "text-zinc-300 hover:text-amber-400 dark:text-zinc-600"}`}
        >
          {fav ? "★" : "☆"}
        </button>
      </div>
      {open && t.detail && (
        <p className="mt-3 border-t border-zinc-200 pt-3 text-sm leading-relaxed text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
          {t.detail}
        </p>
      )}
    </Card>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active ? "bg-indigo-600 text-white" : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300"
      }`}
    >
      {label}
    </button>
  );
}

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [confirm, setConfirm] = useState(false);
  return !confirm ? (
    <button onClick={() => setConfirm(true)} className="shrink-0 text-xs text-zinc-400 hover:text-red-600">
      zmazať
    </button>
  ) : (
    <span className="flex shrink-0 gap-2 text-xs">
      <button onClick={onDelete} className="font-medium text-red-600">
        naozaj
      </button>
      <button onClick={() => setConfirm(false)} className="text-zinc-500">
        nie
      </button>
    </span>
  );
}

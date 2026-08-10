"use client";

import { useEffect, useRef, useState } from "react";
import { useData } from "@/lib/useData";
import { uid } from "@/lib/store";
import { dayKey } from "@/lib/gamify";
import type {
  Entry,
  EntryDraft,
  ItemCount,
  NextStepPlan,
  ObjectionReaction,
  Outcome,
  PriceTiming,
} from "@/lib/types";
import { EntryRow } from "@/components/EntryRow";
import { Btn, Card, Input, Label, SectionTitle } from "@/components/ui";

const OUTCOMES: { id: Outcome; label: string; emoji: string }[] = [
  { id: "kupil", label: "Kúpil", emoji: "✅" },
  { id: "nekupil", label: "Nekúpil", emoji: "❌" },
  { id: "vrati_sa", label: "Vráti sa", emoji: "🔁" },
  { id: "rada", label: "Len rada", emoji: "💬" },
];

const PRICE_OPTIONS: { id: PriceTiming; label: string }[] = [
  { id: "start", label: "Hneď na začiatku" },
  { id: "end", label: "Neskôr / na konci" },
  { id: "avoided", label: "Vôbec / vyhol som sa" },
];

const OBJECTION_OPTIONS: { id: ObjectionReaction; label: string }[] = [
  { id: "none", label: "Námietka nepadla" },
  { id: "asked_benefit", label: "Opýtal som sa na úžitok" },
  { id: "gave_in", label: "Povedal som „Dobre“ / ustúpil som" },
  { id: "discount", label: "Dal som zľavu bez dôvodu" },
  { id: "froze", label: "Zamrzol som / ticho" },
];

const PLAN_OPTIONS: { id: NextStepPlan; label: string }[] = [
  { id: "yes", label: "Áno" },
  { id: "partial", label: "Čiastočne" },
  { id: "no", label: "Nie" },
];

function itemCountLabel(n: ItemCount): string {
  return n >= 5 ? "5+" : String(n);
}

export default function ZaznamyPage() {
  const { entries, settings, put, remove, ready } = useData();

  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [itemCount, setItemCount] = useState<ItemCount>(0);
  const [askedReview, setAskedReview] = useState(false);
  const [priceTiming, setPriceTiming] = useState<PriceTiming | null>(null);
  const [objectionReaction, setObjectionReaction] = useState<ObjectionReaction>("none");
  const [hadNextStepPlan, setHadNextStepPlan] = useState<NextStepPlan | null>(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const draftAppliedRef = useRef(false);
  const autosaveArmedRef = useRef(false);

  useEffect(() => {
    if (draftAppliedRef.current) return;
    const d = settings.entryDraft;
    if (!d) return;
    draftAppliedRef.current = true;
    setOutcome(d.outcome ?? null);
    setItemCount((d.itemCount as ItemCount) ?? 0);
    setAskedReview(!!d.askedReview);
    setPriceTiming(d.priceTiming ?? null);
    setObjectionReaction(d.objectionReaction ?? "none");
    setHadNextStepPlan(d.hadNextStepPlan ?? null);
    setNote(d.note ?? "");
  }, [settings.entryDraft]);

  useEffect(() => {
    if (ready) autosaveArmedRef.current = true;
  }, [ready]);

  useEffect(() => {
    if (!autosaveArmedRef.current) return;
    const draft: EntryDraft = {
      outcome: outcome ?? undefined,
      itemCount,
      askedReview,
      priceTiming: priceTiming ?? undefined,
      objectionReaction,
      hadNextStepPlan: hadNextStepPlan ?? undefined,
      note: note.trim() || undefined,
    };
    put("settings", { ...settings, entryDraft: draft, updatedAt: Date.now() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome, itemCount, askedReview, priceTiming, objectionReaction, hadNextStepPlan, note]);

  const canSave = !!outcome && !!priceTiming && !!hadNextStepPlan;

  const saveEntry = () => {
    if (!outcome || !priceTiming || !hadNextStepPlan) return;
    const now = Date.now();
    const entry: Entry = {
      id: uid(),
      ts: now,
      outcome,
      itemCount,
      askedReview,
      priceTiming,
      objectionReaction,
      hadNextStepPlan,
      note: note.trim() || undefined,
      updatedAt: now,
    };
    put("entries", entry);
    setOutcome(null);
    setItemCount(0);
    setAskedReview(false);
    setPriceTiming(null);
    setObjectionReaction("none");
    setHadNextStepPlan(null);
    setNote("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!ready) return null;

  const today = dayKey(Date.now());
  const byDay = new Map<string, Entry[]>();
  for (const e of entries) {
    const k = dayKey(e.ts);
    byDay.set(k, [...(byDay.get(k) ?? []), e]);
  }
  const days = [...byDay.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Záznamy</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Rýchly zápis podľa toho, čo ťa teraz posúva: cena, námietky, plán kroku a upsell.
        </p>
      </div>

      <Card>
        <SectionTitle>Rýchly záznam zákazníka</SectionTitle>
        <div className="space-y-5">
          <div>
            <Label>Ako to dopadlo?</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {OUTCOMES.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setOutcome(o.id)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                    outcome === o.id
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-zinc-300 bg-white text-zinc-700 hover:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                  }`}
                >
                  {o.emoji} {o.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Koľko položiek som predal / dohodol? ({itemCountLabel(itemCount)})</Label>
            <input
              type="range"
              min={0}
              max={5}
              step={1}
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value) as ItemCount)}
              className="mt-2 w-full accent-indigo-600"
              aria-valuetext={itemCountLabel(itemCount)}
            />
            <div className="mt-1 flex justify-between text-xs text-zinc-400">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5+</span>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-300 px-3 py-3 text-sm dark:border-zinc-700">
            <input
              type="checkbox"
              checked={askedReview}
              onChange={(e) => setAskedReview(e.target.checked)}
              className="h-4 w-4 accent-indigo-600"
            />
            <span>Požiadal som o recenziu</span>
          </label>

          <div>
            <Label>Cenu som povedal…</Label>
            <div className="grid gap-2 sm:grid-cols-3">
              {PRICE_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setPriceTiming(o.id)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                    priceTiming === o.id
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-zinc-300 bg-white text-zinc-700 hover:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Ak padla námietka (cena / nepotrebujem), čo som urobil?</Label>
            <div className="grid gap-2">
              {OBJECTION_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setObjectionReaction(o.id)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    objectionReaction === o.id
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-zinc-300 bg-white text-zinc-700 hover:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Mal som plán ďalšieho kroku?</Label>
            <div className="grid grid-cols-3 gap-2">
              {PLAN_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setHadNextStepPlan(o.id)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                    hadNextStepPlan === o.id
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-zinc-300 bg-white text-zinc-700 hover:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Jedna veta navyše (voliteľné)</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="čo si odnášam / kde som zamrzol"
            />
          </div>

          <div className="flex items-center gap-3">
            <Btn onClick={saveEntry} disabled={!canSave}>
              Uložiť záznam
            </Btn>
            {saved && <span className="text-sm text-emerald-600">Uložené ✔</span>}
            {!canSave && (
              <span className="text-xs text-zinc-400">Vyplň výsledok, cenu a plán kroku</span>
            )}
          </div>
        </div>
      </Card>

      {days.length > 0 && (
        <div>
          <SectionTitle>História</SectionTitle>
          <div className="space-y-2">
            {days.map(([day, list]) => {
              const label = new Date(day).toLocaleDateString("sk-SK", {
                weekday: "long",
                day: "numeric",
                month: "long",
              });
              return (
                <details
                  key={day}
                  open={day === today}
                  className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-zinc-700 marker:content-none dark:text-zinc-300 [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-2">
                      <span className="capitalize">{label}</span>
                      <span className="text-zinc-400">{list.length}</span>
                    </span>
                  </summary>
                  <div className="space-y-2 border-t border-zinc-200 px-3 py-3 dark:border-zinc-800">
                    {list
                      .slice()
                      .sort((a, b) => b.ts - a.ts)
                      .map((e) => (
                        <EntryRow key={e.id} entry={e} onDelete={() => remove("entries", e.id)} />
                      ))}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

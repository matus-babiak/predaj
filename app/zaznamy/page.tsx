"use client";

import { useEffect, useRef, useState } from "react";
import { useData } from "@/lib/useData";
import { uid } from "@/lib/store";
import { dayKey } from "@/lib/gamify";
import { ENTRY_OBJECTION_CHOICES } from "@/content/chips";
import type {
  CustomerRequest,
  Entry,
  EntryDraft,
  ItemCount,
  NextStepPlan,
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

const PLAN_OPTIONS: { id: NextStepPlan; label: string }[] = [
  { id: "yes", label: "Áno" },
  { id: "partial", label: "Čiastočne" },
  { id: "no", label: "Nie" },
];

const NONE_OBJECTION = "";

function itemCountLabel(n: ItemCount): string {
  return n >= 5 ? "5+" : String(n);
}

function cleanLines(lines: string[]): string[] {
  return lines.map((s) => s.trim()).filter(Boolean);
}

function MultiLines({
  label,
  values,
  onChange,
  placeholder,
  addLabel,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  addLabel: string;
}) {
  const rows = values.length > 0 ? values : [""];
  return (
    <div>
      <Label>{label}</Label>
      <div className="space-y-2">
        {rows.map((v, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={v}
              onChange={(e) => {
                const next = [...rows];
                next[i] = e.target.value;
                onChange(next);
              }}
              placeholder={placeholder}
            />
            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => onChange(rows.filter((_, j) => j !== i))}
                className="shrink-0 px-2 text-xs text-zinc-400 hover:text-red-600"
                aria-label="Odstrániť riadok"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...rows, ""])}
        className="mt-2 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
      >
        {addLabel}
      </button>
    </div>
  );
}

export default function ZaznamyPage() {
  const { entries, requests, settings, put, remove, ready } = useData();

  const [requestText, setRequestText] = useState("");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [itemCount, setItemCount] = useState<ItemCount>(0);
  const [askedReview, setAskedReview] = useState(false);
  const [priceTiming, setPriceTiming] = useState<PriceTiming | null>(null);
  const [objectionPick, setObjectionPick] = useState(NONE_OBJECTION);
  const [objectionCustom, setObjectionCustom] = useState("");
  const [hadNextStepPlan, setHadNextStepPlan] = useState<NextStepPlan | null>(null);
  const [pluses, setPluses] = useState<string[]>([""]);
  const [minuses, setMinuses] = useState<string[]>([""]);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const draftAppliedRef = useRef(false);
  const autosaveArmedRef = useRef(false);

  useEffect(() => {
    if (draftAppliedRef.current) return;
    const d = settings.entryDraft;
    if (!d) return;
    draftAppliedRef.current = true;
    setRequestText(d.requestText ?? "");
    setOutcome(d.outcome ?? null);
    setItemCount((d.itemCount as ItemCount) ?? 0);
    setAskedReview(!!d.askedReview);
    setPriceTiming(d.priceTiming ?? null);
    setObjectionPick(d.objectionPick ?? NONE_OBJECTION);
    setObjectionCustom(d.objectionCustom ?? "");
    setHadNextStepPlan(d.hadNextStepPlan ?? null);
    setPluses(d.pluses?.length ? d.pluses : [""]);
    setMinuses(d.minuses?.length ? d.minuses : [""]);
    setNote(d.note ?? "");
  }, [settings.entryDraft]);

  useEffect(() => {
    if (ready) autosaveArmedRef.current = true;
  }, [ready]);

  useEffect(() => {
    if (!autosaveArmedRef.current) return;
    const draft: EntryDraft = {
      requestText: requestText.trim() || undefined,
      outcome: outcome ?? undefined,
      itemCount,
      askedReview,
      priceTiming: priceTiming ?? undefined,
      objectionPick: objectionPick || undefined,
      objectionCustom: objectionCustom.trim() || undefined,
      hadNextStepPlan: hadNextStepPlan ?? undefined,
      pluses,
      minuses,
      note: note.trim() || undefined,
    };
    put("settings", { ...settings, entryDraft: draft, updatedAt: Date.now() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    requestText,
    outcome,
    itemCount,
    askedReview,
    priceTiming,
    objectionPick,
    objectionCustom,
    hadNextStepPlan,
    pluses,
    minuses,
    note,
  ]);

  const canSave = !!requestText.trim() && !!outcome && !!priceTiming && !!hadNextStepPlan;

  const syncRequest = (text: string, now: number) => {
    const open = requests.filter((r) => !r.doneAt);
    const existing = open.find((r) => r.text.toLowerCase() === text.toLowerCase());
    if (existing) {
      put("requests", { ...existing, count: existing.count + 1, updatedAt: now } satisfies CustomerRequest);
    } else {
      put("requests", {
        id: uid(),
        ts: now,
        text,
        count: 1,
        updatedAt: now,
      } satisfies CustomerRequest);
    }
  };

  const saveEntry = () => {
    const req = requestText.trim();
    if (!req || !outcome || !priceTiming || !hadNextStepPlan) return;
    const now = Date.now();
    const custom = objectionCustom.trim();
    const objection = custom || objectionPick || undefined;
    const plusList = cleanLines(pluses);
    const minusList = cleanLines(minuses);

    const entry: Entry = {
      id: uid(),
      ts: now,
      outcome,
      requestText: req,
      itemCount,
      askedReview,
      priceTiming,
      hadNextStepPlan,
      objection,
      pluses: plusList.length ? plusList : undefined,
      minuses: minusList.length ? minusList : undefined,
      note: note.trim() || undefined,
      updatedAt: now,
    };
    put("entries", entry);
    syncRequest(req, now);

    setRequestText("");
    setOutcome(null);
    setItemCount(0);
    setAskedReview(false);
    setPriceTiming(null);
    setObjectionPick(NONE_OBJECTION);
    setObjectionCustom("");
    setHadNextStepPlan(null);
    setPluses([""]);
    setMinuses([""]);
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
          Primárna požiadavka + výsledok predaja. Požiadavka sa automaticky pripočíta aj v zozname Požiadavky.
        </p>
      </div>

      <Card>
        <SectionTitle>Rýchly záznam zákazníka</SectionTitle>
        <div className="space-y-5">
          <div>
            <Label>Požiadavka (s čím prišiel)</Label>
            <Input
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              placeholder="napr. výmena batérie, prenos dát, nové sklo…"
            />
          </div>

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
            <Label>Námietka</Label>
            <select
              value={objectionPick}
              onChange={(e) => setObjectionPick(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value={NONE_OBJECTION}>Námietka nepadla</option>
              {ENTRY_OBJECTION_CHOICES.map((text) => (
                <option key={text} value={text}>
                  {text}
                </option>
              ))}
            </select>
            <Input
              className="mt-2"
              value={objectionCustom}
              onChange={(e) => setObjectionCustom(e.target.value)}
              placeholder="Alebo napíš vlastnú námietku"
            />
            <p className="mt-1 text-xs text-zinc-400">Ak vyplníš vlastnú, má prednosť pred výberom zo zoznamu.</p>
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

          <MultiLines
            label="Čo som urobil dobre"
            values={pluses}
            onChange={setPluses}
            placeholder="napr. povedal som cenu hneď na začiatku"
            addLabel="+ pridať ďalšie plus"
          />

          <MultiLines
            label="Čo som mohol zlepšiť"
            values={minuses}
            onChange={setMinuses}
            placeholder="napr. pri námietke som povedal len Dobre"
            addLabel="+ pridať ďalšie mínus"
          />

          <div>
            <Label>Jedna veta navyše (voliteľné)</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="čo si odnášam / kontext navyše"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Btn onClick={saveEntry} disabled={!canSave}>
              Uložiť záznam
            </Btn>
            {saved && <span className="text-sm text-emerald-600">Uložené ✔</span>}
            {!canSave && (
              <span className="text-xs text-zinc-400">Vyplň požiadavku, výsledok, cenu a plán kroku</span>
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

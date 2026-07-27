"use client";

import { useEffect, useRef, useState } from "react";
import { useData } from "@/lib/useData";
import { uid } from "@/lib/store";
import { dayKey } from "@/lib/gamify";
import { DEFAULT_WANTS, DEFAULT_FEARS } from "@/content/chips";
import { OBJECTIONS } from "@/content/objections";
import type { Entry, EntryDraft, Outcome } from "@/lib/types";
import { EntryRow } from "@/components/EntryRow";
import { Btn, Card, Chip, Input, Label, SectionTitle } from "@/components/ui";

const OUTCOMES: { id: Outcome; label: string; emoji: string }[] = [
  { id: "kupil", label: "Kúpil", emoji: "✅" },
  { id: "nekupil", label: "Nekúpil", emoji: "❌" },
  { id: "vrati_sa", label: "Vráti sa", emoji: "🔁" },
  { id: "rada", label: "Len rada", emoji: "💬" },
];

export default function ZaznamyPage() {
  const { entries, settings, put, remove, ready } = useData();

  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [want, setWant] = useState("");
  const [fear, setFear] = useState("");
  const [why, setWhy] = useState("");
  const [trust, setTrust] = useState(0);
  const [objection, setObjection] = useState("");
  const [note, setNote] = useState("");
  const [plus, setPlus] = useState("");
  const [minus, setMinus] = useState("");
  const [saved, setSaved] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // Rozpísaný záznam sa priebežne ukladá do settings.entryDraft, aby sa
  // nestratil pri odhlásení z nečinnosti alebo zatvorení appky.
  const draftAppliedRef = useRef(false);
  const autosaveArmedRef = useRef(false);

  useEffect(() => {
    if (draftAppliedRef.current) return;
    const d = settings.entryDraft;
    if (!d) return;
    draftAppliedRef.current = true;
    setOutcome(d.outcome ?? null);
    setWant(d.want ?? "");
    setFear(d.fear ?? "");
    setWhy(d.why ?? "");
    setTrust(d.trust ?? 0);
    setObjection(d.objection ?? "");
    setNote(d.note ?? "");
    setPlus(d.plus ?? "");
    setMinus(d.minus ?? "");
    if (d.objection || d.note) setShowMore(true);
  }, [settings.entryDraft]);

  useEffect(() => {
    if (ready) autosaveArmedRef.current = true;
  }, [ready]);

  useEffect(() => {
    if (!autosaveArmedRef.current) return;
    const draft: EntryDraft = {
      outcome: outcome ?? undefined,
      want: want.trim() || undefined,
      fear: fear.trim() || undefined,
      why: why.trim() || undefined,
      trust: trust || undefined,
      objection: objection.trim() || undefined,
      note: note.trim() || undefined,
      plus: plus.trim() || undefined,
      minus: minus.trim() || undefined,
    };
    put("settings", { ...settings, entryDraft: draft, updatedAt: Date.now() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome, want, fear, why, trust, objection, note, plus, minus]);

  const saveEntry = () => {
    if (!outcome) return;
    const now = Date.now();
    const entry: Entry = {
      id: uid(),
      ts: now,
      outcome,
      want: want.trim() || undefined,
      fear: fear.trim() || undefined,
      why: why.trim() || undefined,
      trust: trust || undefined,
      objection: objection.trim() || undefined,
      note: note.trim() || undefined,
      plus: plus.trim() || undefined,
      minus: minus.trim() || undefined,
      updatedAt: now,
    };
    put("entries", entry);
    setOutcome(null);
    setWant("");
    setFear("");
    setWhy("");
    setTrust(0);
    setObjection("");
    setNote("");
    setPlus("");
    setMinus("");
    setShowMore(false);
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
      <h1 className="text-2xl font-semibold">Záznamy</h1>

      <Card>
        <SectionTitle>Rýchly záznam zákazníka</SectionTitle>
        <div className="space-y-4">
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
            <Label>Čo podľa mňa naozaj chcel?</Label>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {DEFAULT_WANTS.map((c) => (
                <Chip key={c} label={c} active={want === c} onClick={() => setWant(want === c ? "" : c)} />
              ))}
            </div>
            <Input placeholder="…alebo napíš vlastné" value={want} onChange={(e) => setWant(e.target.value)} />
          </div>

          <div>
            <Label>Čoho sa bál?</Label>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {DEFAULT_FEARS.map((c) => (
                <Chip key={c} label={c} active={fear === c} onClick={() => setFear(fear === c ? "" : c)} />
              ))}
            </div>
            <Input placeholder="…alebo napíš vlastné" value={fear} onChange={(e) => setFear(e.target.value)} />
          </div>

          <div>
            <Label>Prečo kúpil / nekúpil? (jedna veta)</Label>
            <Input
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="napr. uveril, že nová batéria mu vydrží celý deň"
            />
          </div>

          <div>
            <Label>Vznikla dôvera? (1 = vôbec, 5 = úplne)</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setTrust(trust === n ? 0 : n)}
                  className={`h-10 w-10 rounded-xl border text-sm font-semibold transition-colors ${
                    trust >= n && trust > 0
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-zinc-300 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>➕ Moje plus, čo som urobil dobre?</Label>
              <Input
                value={plus}
                onChange={(e) => setPlus(e.target.value)}
                placeholder="napr. pýtal som sa na potrebu skôr než na rozpočet"
              />
            </div>
            <div>
              <Label>➖ Moje mínus, čo nabudúce inak?</Label>
              <Input
                value={minus}
                onChange={(e) => setMinus(e.target.value)}
                placeholder="napr. skočil som mu do reči pri námietke"
              />
            </div>
          </div>

          {!showMore ? (
            <button
              type="button"
              onClick={() => setShowMore(true)}
              className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
            >
              + námietka / poznámka
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Padla námietka?</Label>
                <Input
                  list="objection-list"
                  value={objection}
                  onChange={(e) => setObjection(e.target.value)}
                  placeholder="vyber alebo napíš vlastnú"
                />
                <datalist id="objection-list">
                  {OBJECTIONS.map((o) => (
                    <option key={o.id} value={o.text} />
                  ))}
                </datalist>
              </div>
              <div>
                <Label>Poznámka na večer</Label>
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="k čomu sa chcem večer vrátiť"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Btn onClick={saveEntry} disabled={!outcome}>
              Uložiť záznam
            </Btn>
            {saved && <span className="text-sm text-emerald-600">Uložené ✔</span>}
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

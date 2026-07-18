"use client";

import { useMemo, useState } from "react";
import { useData } from "@/lib/useData";
import { uid } from "@/lib/store";
import { dayKey } from "@/lib/gamify";
import { getWeek } from "@/content/program";
import { DEFAULT_WANTS, DEFAULT_FEARS, OUTCOME_LABELS } from "@/content/chips";
import { OBJECTIONS } from "@/content/objections";
import type { Entry, Outcome, Reflection } from "@/lib/types";
import { Btn, Card, Chip, Input, Label, SectionTitle, TextArea } from "@/components/ui";

const OUTCOMES: { id: Outcome; label: string; emoji: string }[] = [
  { id: "kupil", label: "Kúpil", emoji: "✅" },
  { id: "nekupil", label: "Nekúpil", emoji: "❌" },
  { id: "vrati_sa", label: "Vráti sa", emoji: "🔁" },
  { id: "rada", label: "Len rada", emoji: "💬" },
];

function sortChipsByUsage(defaults: string[], custom: string[], used: (string | undefined)[]): string[] {
  const counts = new Map<string, number>();
  for (const u of used) if (u) counts.set(u, (counts.get(u) ?? 0) + 1);
  return [...new Set([...defaults, ...custom])].sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0));
}

export default function DennikPage() {
  const { entries, reflections, settings, progress, put, remove, ready } = useData();

  // --- Rýchly záznam ---
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [want, setWant] = useState("");
  const [fear, setFear] = useState("");
  const [why, setWhy] = useState("");
  const [trust, setTrust] = useState(0);
  const [objection, setObjection] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const wantChips = useMemo(
    () => sortChipsByUsage(DEFAULT_WANTS, settings.customWants, entries.map((e) => e.want)),
    [entries, settings.customWants]
  );
  const fearChips = useMemo(
    () => sortChipsByUsage(DEFAULT_FEARS, settings.customFears, entries.map((e) => e.fear)),
    [entries, settings.customFears]
  );

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
      updatedAt: now,
    };
    put("entries", entry);
    // vlastné čipy si zapamätáme
    if (want.trim() && !wantChips.includes(want.trim())) {
      put("settings", { ...settings, customWants: [...settings.customWants, want.trim()], updatedAt: now });
    }
    if (fear.trim() && !fearChips.includes(fear.trim())) {
      put("settings", { ...settings, customFears: [...settings.customFears, fear.trim()], updatedAt: now });
    }
    setOutcome(null);
    setWant("");
    setFear("");
    setWhy("");
    setTrust(0);
    setObjection("");
    setNote("");
    setShowMore(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // --- Večerná reflexia ---
  const today = dayKey(Date.now());
  const week = getWeek(progress.currentWeek);
  const existing = reflections.find((r) => r.date === today);
  const [answers, setAnswers] = useState<Record<string, string>>(existing?.answers ?? {});
  const [focus, setFocus] = useState(existing?.focus ?? "");
  const [reflSaved, setReflSaved] = useState(false);

  const saveReflection = () => {
    const now = Date.now();
    const r: Reflection = {
      id: today,
      date: today,
      weekId: week?.id ?? "w1",
      answers,
      focus: focus.trim() || undefined,
      updatedAt: now,
    };
    put("reflections", r);
    setReflSaved(true);
    setTimeout(() => setReflSaved(false), 2500);
  };

  if (!ready) return null;

  const todayEntries = entries.filter((e) => dayKey(e.ts) === today);
  const olderByDay = new Map<string, Entry[]>();
  for (const e of entries) {
    const k = dayKey(e.ts);
    if (k === today) continue;
    olderByDay.set(k, [...(olderByDay.get(k) ?? []), e]);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Denník</h1>

      {/* Rýchly záznam */}
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
              {wantChips.slice(0, 8).map((c) => (
                <Chip key={c} label={c} active={want === c} onClick={() => setWant(want === c ? "" : c)} />
              ))}
            </div>
            <Input placeholder="…alebo napíš vlastné" value={want} onChange={(e) => setWant(e.target.value)} />
          </div>

          <div>
            <Label>Čoho sa bál?</Label>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {fearChips.slice(0, 8).map((c) => (
                <Chip key={c} label={c} active={fear === c} onClick={() => setFear(fear === c ? "" : c)} />
              ))}
            </div>
            <Input placeholder="…alebo napíš vlastné" value={fear} onChange={(e) => setFear(e.target.value)} />
          </div>

          <div>
            <Label>Prečo kúpil / nekúpil? (jedna veta)</Label>
            <Input value={why} onChange={(e) => setWhy(e.target.value)} placeholder="napr. uveril, že SSD mu zrýchli prácu" />
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

          {!showMore ? (
            <button type="button" onClick={() => setShowMore(true)} className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
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
                <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="k čomu sa chcem večer vrátiť" />
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

      {/* Večerná reflexia */}
      <Card className="scroll-mt-20" >
        <div id="reflexia" className="scroll-mt-24" />
        <SectionTitle>
          Večerná reflexia — {new Date().toLocaleDateString("sk-SK", { day: "numeric", month: "long" })}
        </SectionTitle>
        {existing && <p className="mb-3 text-sm text-emerald-600">Dnešná reflexia je uložená — môžeš ju doplniť.</p>}
        <div className="space-y-4">
          {(week?.reflection ?? []).map((q) => (
            <div key={q}>
              <Label>{q}</Label>
              <TextArea
                rows={2}
                value={answers[q] ?? ""}
                onChange={(e) => setAnswers({ ...answers, [q]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <Label>Čo chcem zajtra zlepšiť?</Label>
            <TextArea rows={2} value={focus} onChange={(e) => setFocus(e.target.value)} />
          </div>
          <div className="flex items-center gap-3">
            <Btn onClick={saveReflection}>Uložiť reflexiu</Btn>
            {reflSaved && <span className="text-sm text-emerald-600">Uložené ✔</span>}
          </div>
        </div>
      </Card>

      {/* Dnešné záznamy */}
      {todayEntries.length > 0 && (
        <div>
          <SectionTitle>Dnes ({todayEntries.length})</SectionTitle>
          <div className="space-y-2">
            {todayEntries.map((e) => (
              <EntryRow key={e.id} entry={e} onDelete={() => remove("entries", e.id)} />
            ))}
          </div>
        </div>
      )}

      {/* História */}
      {olderByDay.size > 0 && (
        <div>
          <SectionTitle>História</SectionTitle>
          <div className="space-y-5">
            {[...olderByDay.entries()].slice(0, 14).map(([day, list]) => (
              <div key={day}>
                <div className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {new Date(day).toLocaleDateString("sk-SK", { weekday: "long", day: "numeric", month: "long" })} · {list.length}
                </div>
                <div className="space-y-2">
                  {list.map((e) => (
                    <EntryRow key={e.id} entry={e} onDelete={() => remove("entries", e.id)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EntryRow({ entry, onDelete }: { entry: Entry; onDelete: () => void }) {
  const [confirm, setConfirm] = useState(false);
  const time = new Date(entry.ts).toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{OUTCOME_LABELS[entry.outcome]}</span>
          {entry.trust ? <span className="text-zinc-500">dôvera {entry.trust}/5</span> : null}
          <span className="text-zinc-400">{time}</span>
        </div>
        {!confirm ? (
          <button onClick={() => setConfirm(true)} className="text-xs text-zinc-400 hover:text-red-600">
            zmazať
          </button>
        ) : (
          <span className="flex gap-2 text-xs">
            <button onClick={onDelete} className="font-medium text-red-600">naozaj zmazať</button>
            <button onClick={() => setConfirm(false)} className="text-zinc-500">nie</button>
          </span>
        )}
      </div>
      <div className="mt-1 space-y-0.5 text-zinc-600 dark:text-zinc-300">
        {entry.want && <div>🎯 chcel: {entry.want}</div>}
        {entry.fear && <div>😟 bál sa: {entry.fear}</div>}
        {entry.why && <div>💡 prečo: {entry.why}</div>}
        {entry.objection && <div>🥊 námietka: {entry.objection}</div>}
        {entry.note && <div>📝 {entry.note}</div>}
      </div>
    </div>
  );
}

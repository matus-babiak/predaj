"use client";

import { useRef, useState } from "react";
import { useData } from "@/lib/useData";
import { dayKey } from "@/lib/gamify";
import { getWeek } from "@/content/program";
import { DAY_PRICE_LABELS } from "@/content/chips";
import type { DayPriceTiming, Reflection, Settings } from "@/lib/types";
import { Btn, Card, Input, Label, RichText, SectionTitle, TextArea } from "@/components/ui";

const PRICE_DAY_OPTIONS: { id: DayPriceTiming; label: string }[] = [
  { id: "start", label: "Väčšinou hneď" },
  { id: "mixed", label: "Striedavo" },
  { id: "end", label: "Neskoro / na konci" },
  { id: "avoided", label: "Vôbec / vyhýbal som sa" },
];

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

export default function DennikPage() {
  const { reflections, progress, settings, put, ready } = useData();
  const listRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const today = dayKey(Date.now());
  const week = getWeek(progress.currentWeek);
  const existing = reflections.find((r) => r.date === today);

  const [priceDay, setPriceDay] = useState<DayPriceTiming | null>(existing?.priceDay ?? null);
  const [wins, setWins] = useState<string[]>(existing?.wins?.length ? existing.wins : [""]);
  const [losses, setLosses] = useState<string[]>(existing?.losses?.length ? existing.losses : [""]);
  const [focus, setFocus] = useState(existing?.focus ?? "");
  const [editing, setEditing] = useState(false);
  const [reflSaved, setReflSaved] = useState(false);
  const [eveningLoading, setEveningLoading] = useState(false);
  const [eveningError, setEveningError] = useState(false);

  const loadFrom = (src?: Reflection) => {
    setPriceDay(src?.priceDay ?? null);
    setWins(src?.wins?.length ? src.wins : [""]);
    setLosses(src?.losses?.length ? src.losses : [""]);
    setFocus(src?.focus ?? "");
  };

  const startEdit = (r?: Reflection) => {
    loadFrom(r ?? existing);
    setEditing(true);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const cancelEdit = () => {
    loadFrom(existing);
    setEditing(false);
  };

  const canSave = !!priceDay && !!focus.trim();

  const saveReflection = () => {
    if (!priceDay || !focus.trim()) return;
    const now = Date.now();
    const winList = cleanLines(wins);
    const lossList = cleanLines(losses);
    const r: Reflection = {
      id: today,
      date: today,
      weekId: week?.id ?? "w1",
      priceDay,
      wins: winList.length ? winList : undefined,
      losses: lossList.length ? lossList : undefined,
      focus: focus.trim(),
      answers: existing?.answers ?? {},
      updatedAt: now,
    };
    put("reflections", r);
    setEditing(false);
    setReflSaved(true);
    setTimeout(() => setReflSaved(false), 2500);
    requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const fetchEvening = async (reflection: Reflection) => {
    setEveningLoading(true);
    setEveningError(false);
    try {
      const res = await fetch("/api/mentor/evening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reflection, date: reflection.date }),
      });
      const data = (await res.json()) as { text: string | null };
      if (data.text) {
        const next: Settings = {
          ...settings,
          eveningSummary: data.text,
          eveningSummaryDate: reflection.date,
          eveningSummaryAt: Date.now(),
          updatedAt: Date.now(),
        };
        put("settings", next);
      } else {
        setEveningError(true);
      }
    } catch {
      setEveningError(true);
    } finally {
      setEveningLoading(false);
    }
  };

  if (!ready) return null;

  const savedList = reflections.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  const showForm = editing || !existing;
  const eveningForToday =
    settings.eveningSummaryDate === today ? settings.eveningSummary : undefined;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Denník</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Krátka večerná reflexia: cena, silné momenty, kde si stratil, jedna vec na zajtra.
        </p>
      </div>

      <div ref={formRef} className="scroll-mt-24">
        {showForm ? (
          <Card>
            <div id="reflexia" className="scroll-mt-24" />
            <SectionTitle>
              Večerná reflexia, {new Date().toLocaleDateString("sk-SK", { day: "numeric", month: "long" })}
              {existing ? " · úprava" : ""}
            </SectionTitle>
            <div className="space-y-5">
              <div>
                <Label>Ako som dnes pracoval s cenou?</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {PRICE_DAY_OPTIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setPriceDay(o.id)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                        priceDay === o.id
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
                label="Najsilnejší moment dňa"
                values={wins}
                onChange={setWins}
                placeholder="napr. povedal som cenu hneď a zákazník súhlasil"
                addLabel="+ pridať ďalší silný moment"
              />

              <MultiLines
                label="Kde som dnes stratil / zamrzol"
                values={losses}
                onChange={setLosses}
                placeholder="napr. pri námietke na cenu som povedal len Dobre"
                addLabel="+ pridať ďalšie"
              />

              <div>
                <Label>Jedna vec na zajtra</Label>
                <TextArea
                  rows={2}
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  placeholder="jedna konkrétna vec, nie zoznam"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Btn onClick={saveReflection} disabled={!canSave}>
                  {existing ? "Uložiť zmeny" : "Uložiť reflexiu"}
                </Btn>
                {existing && (
                  <Btn variant="ghost" onClick={cancelEdit}>
                    Zrušiť
                  </Btn>
                )}
                {reflSaved && <span className="text-sm text-emerald-600">Uložené ✔</span>}
                {!canSave && (
                  <span className="text-xs text-zinc-400">Vyplň prácu s cenou a jednu vec na zajtra</span>
                )}
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <div id="reflexia" className="scroll-mt-24" />
            <SectionTitle>
              Večerná reflexia, {new Date().toLocaleDateString("sk-SK", { day: "numeric", month: "long" })}
            </SectionTitle>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Dnešná reflexia je uložená. Na zmenu použi{" "}
              <button
                type="button"
                onClick={() => startEdit()}
                className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Upraviť
              </button>
              .
            </p>
            {reflSaved && <p className="mt-2 text-sm text-emerald-600">Uložené ✔</p>}
            {existing && (
              <div className="mt-4 space-y-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <Btn
                  variant={eveningForToday ? "ghost" : "primary"}
                  onClick={() => void fetchEvening(existing)}
                  disabled={eveningLoading}
                >
                  {eveningLoading
                    ? "Pripravujem zhrnutie…"
                    : eveningForToday
                      ? "Obnoviť večerné zhrnutie"
                      : "Večerné zhrnutie mentora"}
                </Btn>
                {eveningError && (
                  <p className="text-sm text-red-500">Mentor momentálne nie je dostupný, skús neskôr.</p>
                )}
                {eveningForToday && (
                  <div className="space-y-2 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {eveningForToday.split("\n").map((line, i) => {
                      const h = line.trim().match(/^##\s+(.+)$/);
                      if (h) {
                        return (
                          <h3 key={i} className="pt-1 text-sm font-semibold text-indigo-800 dark:text-indigo-300">
                            {h[1]}
                          </h3>
                        );
                      }
                      if (!line.trim()) return null;
                      const b = line.trim().match(/^[-*]\s+(.+)$/);
                      if (b) {
                        return (
                          <p key={i} className="pl-3">
                            • <RichText text={b[1]} />
                          </p>
                        );
                      }
                      return (
                        <p key={i}>
                          <RichText text={line.trim()} />
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </Card>
        )}
      </div>

      {savedList.length > 0 && (
        <div ref={listRef} className="scroll-mt-24">
          <SectionTitle>Uložené reflexie</SectionTitle>
          <div className="space-y-3">
            {savedList.map((r) => (
              <ReflectionCard
                key={r.id}
                reflection={r}
                isToday={r.date === today}
                onEdit={r.date === today ? () => startEdit(r) : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReflectionCard({
  reflection,
  isToday,
  onEdit,
}: {
  reflection: Reflection;
  isToday?: boolean;
  onEdit?: () => void;
}) {
  const dateLabel = new Date(reflection.date).toLocaleDateString("sk-SK", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const answers = Object.entries(reflection.answers ?? {}).filter(([, v]) => String(v ?? "").trim());
  const wins = reflection.wins ?? [];
  const losses = reflection.losses ?? [];
  const hasCoaching =
    !!reflection.priceDay || wins.length > 0 || losses.length > 0 || !!reflection.focus?.trim();

  return (
    <Card className={isToday ? "border-indigo-300 dark:border-indigo-800" : undefined}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium capitalize text-zinc-500 dark:text-zinc-400">
          <span>{dateLabel}</span>
          {isToday && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold normal-case text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              dnes
            </span>
          )}
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Upraviť
          </button>
        )}
      </div>
      <div className="space-y-3 text-sm">
        {reflection.priceDay && (
          <div>
            <div className="font-medium text-zinc-700 dark:text-zinc-300">Práca s cenou</div>
            <p className="mt-0.5 text-zinc-600 dark:text-zinc-400">
              {DAY_PRICE_LABELS[reflection.priceDay] ?? reflection.priceDay}
            </p>
          </div>
        )}
        {wins.map((w, i) => (
          <div key={`w-${i}`} className="text-emerald-700 dark:text-emerald-400">
            ➕ {w}
          </div>
        ))}
        {losses.map((l, i) => (
          <div key={`l-${i}`} className="text-red-700 dark:text-red-400">
            ➖ {l}
          </div>
        ))}
        {reflection.focus?.trim() && (
          <div>
            <div className="font-medium text-zinc-700 dark:text-zinc-300">Jedna vec na zajtra</div>
            <p className="mt-0.5 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">{reflection.focus}</p>
          </div>
        )}
        {answers.map(([q, a]) => (
          <div key={q}>
            <div className="font-medium text-zinc-500 dark:text-zinc-400">(staré) {q}</div>
            <p className="mt-0.5 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">{a}</p>
          </div>
        ))}
        {!hasCoaching && answers.length === 0 && (
          <p className="text-zinc-400">Bez vyplneného textu.</p>
        )}
      </div>
    </Card>
  );
}

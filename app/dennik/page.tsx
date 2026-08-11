"use client";

import { useRef, useState } from "react";
import { useData } from "@/lib/useData";
import { dayKey } from "@/lib/gamify";
import { getWeek } from "@/content/program";
import { DAY_PRICE_LABELS, STRUGGLE_CATEGORY_LABELS } from "@/content/chips";
import type { Reflection, Settings, StruggleCategory } from "@/lib/types";
import { Btn, Card, Label, RichText, SectionTitle, TextArea } from "@/components/ui";

const STRUGGLE_OPTIONS: { id: StruggleCategory; label: string }[] = [
  { id: "cena", label: "Cena" },
  { id: "namietka", label: "Námietka" },
  { id: "ticho", label: "Ticho / zamrznutie" },
  { id: "peniaze", label: "Strach pýtať si peniaze" },
  { id: "ine", label: "Iné" },
];

function FieldTip({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-zinc-400">{children}</p>;
}

function OptionalHint() {
  return <span className="ml-2 text-xs font-normal normal-case tracking-normal text-zinc-400">(voliteľné)</span>;
}

export default function DennikPage() {
  const { reflections, progress, settings, put, ready } = useData();
  const listRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const today = dayKey(Date.now());
  const week = getWeek(progress.currentWeek);
  const existing = reflections.find((r) => r.date === today);

  const [struggleCategory, setStruggleCategory] = useState<StruggleCategory | null>(
    existing?.struggleCategory ?? null
  );
  const [struggleText, setStruggleText] = useState(existing?.struggleText ?? "");
  const [focus, setFocus] = useState(existing?.focus ?? "");
  const [retreated, setRetreated] = useState(existing?.retreated ?? "");
  const [selfFocus, setSelfFocus] = useState(existing?.selfFocus ?? "");
  const [hardestMoment, setHardestMoment] = useState(existing?.hardestMoment ?? "");
  const [strengthToday, setStrengthToday] = useState(existing?.strengthToday ?? "");
  const [better10, setBetter10] = useState(existing?.better10 ?? "");
  const [editing, setEditing] = useState(false);
  const [reflSaved, setReflSaved] = useState(false);
  const [eveningLoading, setEveningLoading] = useState(false);
  const [eveningError, setEveningError] = useState(false);

  const loadFrom = (src?: Reflection) => {
    setStruggleCategory(src?.struggleCategory ?? null);
    setStruggleText(src?.struggleText ?? "");
    setFocus(src?.focus ?? "");
    setRetreated(src?.retreated ?? "");
    setSelfFocus(src?.selfFocus ?? "");
    setHardestMoment(src?.hardestMoment ?? "");
    setStrengthToday(src?.strengthToday ?? "");
    setBetter10(src?.better10 ?? "");
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

  const hasStruggle = !!struggleCategory || !!struggleText.trim();
  const canSave = hasStruggle && !!focus.trim();

  const saveReflection = () => {
    if (!hasStruggle || !focus.trim()) return;
    const now = Date.now();
    const r: Reflection = {
      id: today,
      date: today,
      weekId: week?.id ?? "w1",
      struggleCategory: struggleCategory ?? undefined,
      struggleText: struggleText.trim() || undefined,
      focus: focus.trim(),
      retreated: retreated.trim() || undefined,
      selfFocus: selfFocus.trim() || undefined,
      hardestMoment: hardestMoment.trim() || undefined,
      strengthToday: strengthToday.trim() || undefined,
      better10: better10.trim() || undefined,
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
          Večer čeli tomu, s čím bojuješ, a vyber jednu vec, ktorá ťa zajtra posunie.
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
            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Kotva dňa</h3>

                <div>
                  <Label>S čím som dnes vnútorne bojoval pri predaji?</Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {STRUGGLE_OPTIONS.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setStruggleCategory(struggleCategory === o.id ? null : o.id)}
                        className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                          struggleCategory === o.id
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-zinc-300 bg-white text-zinc-700 hover:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                  <TextArea
                    className="mt-2"
                    rows={2}
                    value={struggleText}
                    onChange={(e) => setStruggleText(e.target.value)}
                    placeholder="krátko popíš, čo sa dialo"
                  />
                  <FieldTip>Vyber kategóriu. Text pomôže mentorovi vidieť vzorec, nie len pocit.</FieldTip>
                </div>

                <div>
                  <Label>Jedna vec, ktorú zajtra urobím inak</Label>
                  <TextArea
                    rows={2}
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                    placeholder="konkrétne správanie, napr. cenu poviem hneď pri prvej ponuke"
                  />
                  <FieldTip>Jedna vec. Čím konkrétnejšia, tým väčšia šanca, že ju zajtra urobíš.</FieldTip>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  Čeliť slabine
                  <OptionalHint />
                </h3>

                <div>
                  <Label>Pri ktorej situácii som dnes ustúpil, hoci som vedel, čo by bolo správne?</Label>
                  <TextArea
                    rows={2}
                    value={retreated}
                    onChange={(e) => setRetreated(e.target.value)}
                    placeholder="napr. povedal som Dobre, dal som zľavu, vyhol som sa cene…"
                  />
                  <FieldTip>Tu nejde o výčitku. Ide o pomenovať moment, kde vieš, že nabudúce zvládneš viac.</FieldTip>
                </div>

                <div>
                  <Label>Kde som dnes bol viac vo svojom strese než pri zákazníkovi? Čo to spustilo?</Label>
                  <TextArea
                    rows={2}
                    value={selfFocus}
                    onChange={(e) => setSelfFocus(e.target.value)}
                    placeholder="čo spustilo stres, hanbu alebo ticho"
                  />
                </div>

                <div>
                  <Label>
                    Aká jedna námietka / moment ma dnes najviac rozhodil? Čo som vtedy potreboval vedieť /
                    urobiť?
                  </Label>
                  <TextArea
                    rows={2}
                    value={hardestMoment}
                    onChange={(e) => setHardestMoment(e.target.value)}
                    placeholder="čo padlo + čo by ti vtedy pomohlo"
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  Rast a motivácia
                  <OptionalHint />
                </h3>

                <div>
                  <Label>Kde som dnes ukázal svoju silu?</Label>
                  <TextArea
                    rows={2}
                    value={strengthToday}
                    onChange={(e) => setStrengthToday(e.target.value)}
                    placeholder="upsell, recenzia, technika, pokoj, dobrá otázka…"
                  />
                  <FieldTip>Zapíš aj malú výhru. To, čo funguje, chceš opakovať zámerne.</FieldTip>
                </div>

                <div>
                  <Label>
                    Keby som zajtra spravil len jednu vec o 10 % lepšie, čo by to bolo a prečo by ma to
                    posunulo?
                  </Label>
                  <TextArea
                    rows={2}
                    value={better10}
                    onChange={(e) => setBetter10(e.target.value)}
                    placeholder="malý posun, veľký efekt"
                  />
                </div>
              </section>

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
                  <span className="text-xs text-zinc-400">
                    Vyplň boj dňa (kategória alebo text) a jednu vec na zajtra
                  </span>
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
  const hasNew =
    !!reflection.struggleCategory ||
    !!reflection.struggleText?.trim() ||
    !!reflection.retreated?.trim() ||
    !!reflection.selfFocus?.trim() ||
    !!reflection.hardestMoment?.trim() ||
    !!reflection.strengthToday?.trim() ||
    !!reflection.better10?.trim() ||
    !!reflection.focus?.trim();
  const hasLegacy =
    !!reflection.priceDay || wins.length > 0 || losses.length > 0 || answers.length > 0;

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
        {(reflection.struggleCategory || reflection.struggleText?.trim()) && (
          <div>
            <div className="font-medium text-zinc-700 dark:text-zinc-300">S čím som bojoval</div>
            <p className="mt-0.5 text-zinc-600 dark:text-zinc-400">
              {reflection.struggleCategory
                ? STRUGGLE_CATEGORY_LABELS[reflection.struggleCategory] ?? reflection.struggleCategory
                : null}
              {reflection.struggleCategory && reflection.struggleText?.trim() ? ": " : null}
              {reflection.struggleText?.trim() || null}
            </p>
          </div>
        )}
        {reflection.focus?.trim() && (
          <div>
            <div className="font-medium text-zinc-700 dark:text-zinc-300">Zajtra inak</div>
            <p className="mt-0.5 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">{reflection.focus}</p>
          </div>
        )}
        {reflection.retreated?.trim() && (
          <div>
            <div className="font-medium text-zinc-700 dark:text-zinc-300">Kde som ustúpil</div>
            <p className="mt-0.5 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">{reflection.retreated}</p>
          </div>
        )}
        {reflection.selfFocus?.trim() && (
          <div>
            <div className="font-medium text-zinc-700 dark:text-zinc-300">Stres namiesto zákazníka</div>
            <p className="mt-0.5 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">{reflection.selfFocus}</p>
          </div>
        )}
        {reflection.hardestMoment?.trim() && (
          <div>
            <div className="font-medium text-zinc-700 dark:text-zinc-300">Najťažší moment</div>
            <p className="mt-0.5 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
              {reflection.hardestMoment}
            </p>
          </div>
        )}
        {reflection.strengthToday?.trim() && (
          <div className="text-emerald-700 dark:text-emerald-400">➕ {reflection.strengthToday}</div>
        )}
        {reflection.better10?.trim() && (
          <div>
            <div className="font-medium text-zinc-700 dark:text-zinc-300">+10 % zajtra</div>
            <p className="mt-0.5 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">{reflection.better10}</p>
          </div>
        )}

        {reflection.priceDay && (
          <div>
            <div className="font-medium text-zinc-500 dark:text-zinc-400">(staré) Práca s cenou</div>
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
        {answers.map(([q, a]) => (
          <div key={q}>
            <div className="font-medium text-zinc-500 dark:text-zinc-400">(staré) {q}</div>
            <p className="mt-0.5 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">{a}</p>
          </div>
        ))}
        {!hasNew && !hasLegacy && <p className="text-zinc-400">Bez vyplneného textu.</p>}
      </div>
    </Card>
  );
}

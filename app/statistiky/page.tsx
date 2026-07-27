"use client";

import { useMemo, useState } from "react";
import { useData } from "@/lib/useData";
import { activeDays, streak, dayKey, computeBadges } from "@/lib/gamify";
import { DEFAULT_FEARS, DEFAULT_WANTS, OUTCOME_LABELS } from "@/content/chips";
import { OBJECTIONS } from "@/content/objections";
import { Btn, Card, SectionTitle } from "@/components/ui";
import type { Entry, Settings, StatsAiCategory } from "@/lib/types";
import {
  STATS_AI_MAX_ENTRIES,
  STATS_AI_WINDOW_DAYS,
  collectFreeItems,
  countKnownCategories,
  knownCategorySet,
  mapToRankItems,
  mergeCategoryCounts,
  type StatsAiEntryInput,
} from "@/lib/statsAi";

function topCounts(values: (string | undefined)[], n = 5): [string, number][] {
  const map = new Map<string, number>();
  for (const v of values) if (v) map.set(v, (map.get(v) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

function weekRange(offsetWeeks: number): [number, number] {
  const now = new Date();
  const day = (now.getDay() + 6) % 7; // pondelok = 0
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day - offsetWeeks * 7);
  const start = monday.getTime();
  return [start, start + 7 * 24 * 3600 * 1000];
}

function summarize(entries: Entry[], [start, end]: [number, number]) {
  const list = entries.filter((e) => e.ts >= start && e.ts < end);
  const bought = list.filter((e) => e.outcome === "kupil").length;
  const trustVals = list.filter((e) => e.trust).map((e) => e.trust!);
  return {
    total: list.length,
    bought,
    boughtPct: list.length ? Math.round((bought / list.length) * 100) : null,
    trust: trustVals.length ? (trustVals.reduce((a, b) => a + b, 0) / trustVals.length).toFixed(1) : null,
  };
}

function formatDay(ts: number): string {
  return new Date(ts).toLocaleDateString("sk-SK", { day: "numeric", month: "short", year: "numeric" });
}

function daysAgoTs(days: number): number {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

export default function StatistikyPage() {
  const { entries, reflections, objAttempts, products, progress, settings, put, ready } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const payload = useMemo(() => {
    if (!ready) return null;
    const sinceTs = daysAgoTs(STATS_AI_WINDOW_DAYS);
    const windowEntries = entries.filter((e) => e.ts >= sinceTs).slice(0, STATS_AI_MAX_ENTRIES);

    const knownWants = knownCategorySet(DEFAULT_WANTS, settings.customWants ?? []);
    const knownFears = knownCategorySet(DEFAULT_FEARS, settings.customFears ?? []);

    const statsEntries: StatsAiEntryInput[] = windowEntries.map((e) => ({
      id: e.id,
      date: dayKey(e.ts),
      outcome: OUTCOME_LABELS[e.outcome] ?? e.outcome,
      want: e.want,
      fear: e.fear,
      why: e.why,
      note: e.note,
      objection: e.objection,
      trust: e.trust,
    }));

    const localWantMap = countKnownCategories(
      statsEntries.map((e) => e.want),
      knownWants
    );
    const localFearMap = countKnownCategories(
      statsEntries.map((e) => e.fear),
      knownFears
    );
    const freeWants = collectFreeItems(statsEntries, "want", knownWants);
    const freeFears = collectFreeItems(statsEntries, "fear", knownFears);

    const fingerprint = statsEntries
      .map((e) =>
        [e.id, e.date, e.outcome, e.want ?? "", e.fear ?? "", e.why ?? "", e.note ?? "", e.objection ?? "", e.trust ?? ""].join("~")
      )
      .join("|");

    return {
      knownWants: [...knownWants],
      knownFears: [...knownFears],
      localWantMap,
      localFearMap,
      freeWants,
      freeFears,
      fingerprint,
      entryCount: statsEntries.length,
    };
  }, [ready, entries, settings.customWants, settings.customFears]);

  if (!ready || !payload) return null;

  const days = activeDays(entries, reflections);
  const s = streak(days);
  const badges = computeBadges({ entries, reflections, objAttempts, products, progress });

  const outcomes = topCounts(entries.map((e) => e.outcome), 4);
  const fallbackWants = topCounts(entries.map((e) => e.want));
  const fallbackFears = topCounts(entries.map((e) => e.fear));

  const hasCached =
    !!settings.statsAiWants?.length ||
    !!settings.statsAiFears?.length ||
    !!settings.statsAiInsight;

  const stale = hasCached && settings.statsAiFingerprint !== payload.fingerprint;

  const displayWants: [string, number][] = hasCached
    ? mapToRankItems(settings.statsAiWants ?? [])
    : fallbackWants;
  const displayFears: [string, number][] = hasCached
    ? mapToRankItems(settings.statsAiFears ?? [])
    : fallbackFears;

  const hasWindowSignals =
    payload.localWantMap.size > 0 ||
    payload.localFearMap.size > 0 ||
    payload.freeWants.length > 0 ||
    payload.freeFears.length > 0;
  const hasFallbackLists = fallbackWants.length > 0 || fallbackFears.length > 0;

  const fetchStats = async () => {
    setLoading(true);
    setError(false);
    try {
      const localWantCounts = [...payload.localWantMap.entries()].map(([label, count]) => ({
        label,
        count,
      }));
      const localFearCounts = [...payload.localFearMap.entries()].map(([label, count]) => ({
        label,
        count,
      }));

      const res = await fetch("/api/mentor/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          knownWants: payload.knownWants,
          knownFears: payload.knownFears,
          freeWants: payload.freeWants,
          freeFears: payload.freeFears,
          localWantCounts,
          localFearCounts,
        }),
      });
      const data = (await res.json()) as {
        wants: StatsAiCategory[] | null;
        fears: StatsAiCategory[] | null;
        insight: string | null;
      };

      if (!res.ok || data.wants === null || data.fears === null || data.insight === null) {
        setError(true);
        return;
      }

      const mergedWants = mergeCategoryCounts(payload.localWantMap, data.wants);
      const mergedFears = mergeCategoryCounts(payload.localFearMap, data.fears);

      const next: Settings = {
        ...settings,
        statsAiWants: mergedWants,
        statsAiFears: mergedFears,
        statsAiInsight: data.insight,
        statsAiAt: Date.now(),
        statsAiFingerprint: payload.fingerprint,
        updatedAt: Date.now(),
      };
      put("settings", next);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // dôvera po dňoch (posledných 30 dní so záznamom)
  const trustByDay = new Map<string, number[]>();
  for (const e of entries) {
    if (!e.trust) continue;
    const k = dayKey(e.ts);
    trustByDay.set(k, [...(trustByDay.get(k) ?? []), e.trust]);
  }
  const trustSeries = [...trustByDay.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .slice(-30)
    .map(([, vals]) => vals.reduce((x, y) => x + y, 0) / vals.length);

  // najslabšie námietky
  const weak = OBJECTIONS.map((o) => {
    const list = objAttempts.filter((a) => a.objectionId === o.id);
    const avg = list.length ? list.reduce((x, a) => x + a.rating, 0) / list.length : null;
    return { text: o.text, count: list.length, avg };
  })
    .filter((x) => x.count > 0 && x.avg! < 2.5)
    .sort((a, b) => a.avg! - b.avg!)
    .slice(0, 5);

  const thisWeek = summarize(entries, weekRange(0));
  const lastWeek = summarize(entries, weekRange(1));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Štatistiky</h1>

      {/* Prehľad */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Záznamov" value={String(entries.length)} />
        <Stat label="Dní so zápisom" value={String(days.size)} />
        <Stat label="Séria" value={s > 0 ? `🔥 ${s}` : "-"} />
        <Stat label="Námietok natrénovaných" value={String(objAttempts.length)} />
      </div>

      {/* Týždenné zhrnutie */}
      <Card>
        <SectionTitle>Tento týždeň vs. minulý</SectionTitle>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div />
          <div className="font-medium">Tento</div>
          <div className="font-medium text-zinc-500">Minulý</div>
          <CompareRow label="Zákazníci" a={String(thisWeek.total)} b={String(lastWeek.total)} />
          <CompareRow label="Kúpili" a={thisWeek.boughtPct !== null ? `${thisWeek.boughtPct} %` : "-"} b={lastWeek.boughtPct !== null ? `${lastWeek.boughtPct} %` : "-"} />
          <CompareRow label="Priem. dôvera" a={thisWeek.trust ?? "-"} b={lastWeek.trust ?? "-"} />
        </div>
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          Nehodnoť sa známkou, hľadaj vzorec. Čo sa tento týždeň naučím?
        </p>
      </Card>

      {/* Dôvera trend */}
      {trustSeries.length >= 3 && (
        <Card>
          <SectionTitle>Trend dôvery (denný priemer)</SectionTitle>
          <Sparkline data={trustSeries} min={1} max={5} />
          <p className="mt-2 text-xs text-zinc-500">Posledných {trustSeries.length} dní so záznamom · škála 1-5</p>
        </Card>
      )}

      {/* Výsledky */}
      {entries.length > 0 && (
        <Card>
          <SectionTitle>Výsledky rozhovorov</SectionTitle>
          <div className="space-y-2">
            {outcomes.map(([k, count]) => (
              <div key={k} className="flex items-center gap-3 text-sm">
                <div className="w-20 shrink-0">{OUTCOME_LABELS[k] ?? k}</div>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div className="h-full rounded-full bg-indigo-600" style={{ width: `${(count / entries.length) * 100}%` }} />
                </div>
                <div className="w-8 text-right text-zinc-500">{count}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Potreby a obavy + AI hybrid */}
      {(hasFallbackLists || hasCached) && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <SectionTitle>Čo zákazníci najčastejšie chcú</SectionTitle>
              <RankList items={displayWants} emptyText="Zatiaľ málo dát." />
              {!hasCached && displayWants.length > 0 && (
                <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                  Zatiaľ surový súčet textov. AI ich vie zlúčiť do kategórií.
                </p>
              )}
            </Card>
            <Card>
              <SectionTitle>Čoho sa najčastejšie boja</SectionTitle>
              <RankList items={displayFears} emptyText="Zatiaľ málo dát." />
              {!hasCached && displayFears.length > 0 && (
                <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                  Zatiaľ surový súčet textov. AI ich vie zlúčiť do kategórií.
                </p>
              )}
            </Card>
          </div>

          <Card className="border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/30">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-400">
              AI prehľad potrieb a obáv
            </h2>
            <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-300">
              Zhlukuje voľné zápisy z posledných {STATS_AI_WINDOW_DAYS} dní, chipy počíta lokálne a dá ti krátky komentár, na čo sa pripraviť.
            </p>

            {settings.statsAiInsight && (
              <p className="mb-3 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                {settings.statsAiInsight}
              </p>
            )}

            {settings.statsAiAt && (
              <p className="mb-2 text-xs text-zinc-400 dark:text-zinc-500">
                Naposledy {formatDay(settings.statsAiAt)}
                {stale && ", medzitým pribudli nové záznamy"}
              </p>
            )}

            {error && (
              <p className="mb-2 text-xs text-red-500">
                AI prehľad momentálne nie je dostupný, skús to neskôr.
              </p>
            )}

            <Btn
              variant={hasCached ? "ghost" : "primary"}
              onClick={fetchStats}
              disabled={loading || !hasWindowSignals}
            >
              {loading
                ? "Pripravujem prehľad…"
                : hasCached
                  ? "Obnoviť AI prehľad"
                  : "Vygenerovať AI prehľad"}
            </Btn>

            {!hasWindowSignals && (
              <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
                Za posledných {STATS_AI_WINDOW_DAYS} dní chýbajú signály potrieb/obáv. Pridaj ich v záznamoch (chip alebo vlastný text).
              </p>
            )}
          </Card>
        </div>
      )}

      {/* Slabé námietky */}
      {weak.length > 0 && (
        <Card>
          <SectionTitle>Námietky, ktoré ťa trápia</SectionTitle>
          <ul className="space-y-1.5 text-sm">
            {weak.map((w) => (
              <li key={w.text} className="flex items-center justify-between gap-2">
                <span>„{w.text}“</span>
                <span className="shrink-0 text-xs text-zinc-500">{w.avg!.toFixed(1)}/3 · {w.count}×</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-zinc-500">Tréning ti ich bude ponúkať častejšie, presne ako slabšiu partiu v posilňovni.</p>
        </Card>
      )}

      {/* Odznaky */}
      <Card>
        <SectionTitle>Odznaky</SectionTitle>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`rounded-xl border p-3 text-sm ${
                b.earned
                  ? "border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/30"
                  : "border-zinc-200 opacity-40 dark:border-zinc-800"
              }`}
            >
              <div className="text-xl">{b.emoji}</div>
              <div className="font-medium">{b.title}</div>
              <div className="text-xs text-zinc-500">{b.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="!p-3 text-center">
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs text-zinc-500 dark:text-zinc-400">{label}</div>
    </Card>
  );
}

function CompareRow({ label, a, b }: { label: string; a: string; b: string }) {
  return (
    <>
      <div className="text-left text-zinc-600 dark:text-zinc-300">{label}</div>
      <div className="font-semibold">{a}</div>
      <div className="text-zinc-500">{b}</div>
    </>
  );
}

function RankList({ items, emptyText }: { items: [string, number][]; emptyText: string }) {
  if (items.length === 0) return <p className="text-sm text-zinc-500">{emptyText}</p>;
  return (
    <ol className="space-y-1.5 text-sm">
      {items.map(([label, count], i) => (
        <li key={label} className="flex items-center justify-between gap-2">
          <span>
            <span className="mr-1.5 text-zinc-400">{i + 1}.</span>
            {label}
          </span>
          <span className="shrink-0 text-xs text-zinc-500">{count}×</span>
        </li>
      ))}
    </ol>
  );
}

function Sparkline({ data, min, max }: { data: number[]; min: number; max: number }) {
  const w = 600;
  const h = 80;
  const pts = data
    .map((v, i) => {
      const x = data.length === 1 ? w / 2 : (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min)) * (h - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-20 w-full" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

"use client";

import { useData } from "@/lib/useData";
import { activeDays, streak, dayKey, computeBadges } from "@/lib/gamify";
import { OUTCOME_LABELS } from "@/content/chips";
import { OBJECTIONS } from "@/content/objections";
import { Card, SectionTitle } from "@/components/ui";
import type { Entry } from "@/lib/types";

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

export default function StatistikyPage() {
  const { entries, reflections, objAttempts, products, progress, ready } = useData();
  if (!ready) return null;

  const days = activeDays(entries, reflections);
  const s = streak(days);
  const badges = computeBadges({ entries, reflections, objAttempts, products, progress });

  const outcomes = topCounts(entries.map((e) => e.outcome), 4);
  const wants = topCounts(entries.map((e) => e.want));
  const fears = topCounts(entries.map((e) => e.fear));

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

      {/* Potreby a obavy */}
      {(wants.length > 0 || fears.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <SectionTitle>Čo zákazníci najčastejšie chcú</SectionTitle>
            <RankList items={wants} emptyText="Zatiaľ málo dát." />
          </Card>
          <Card>
            <SectionTitle>Čoho sa najčastejšie boja</SectionTitle>
            <RankList items={fears} emptyText="Zatiaľ málo dát." />
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

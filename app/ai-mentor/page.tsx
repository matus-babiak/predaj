"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useData } from "@/lib/useData";
import { dayKey } from "@/lib/gamify";
import { OUTCOME_LABELS } from "@/content/chips";
import type { Settings } from "@/lib/types";
import { Btn, Card, RichText, SectionTitle } from "@/components/ui";

const WINDOW_DAYS = 14;
const MAX_ENTRIES = 40;
const MAX_REFLECTIONS = 14;
const MAX_SW = 25;

function formatDay(ts: number): string {
  return new Date(ts).toLocaleDateString("sk-SK", { day: "numeric", month: "short", year: "numeric" });
}

function daysAgoTs(days: number): number {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

function cutoffDateKey(days: number): string {
  return dayKey(daysAgoTs(days));
}

export default function AiMentorPage() {
  const { entries, reflections, selfNotes, settings, put, ready } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const payload = useMemo(() => {
    if (!ready) return null;
    const sinceTs = daysAgoTs(WINDOW_DAYS);
    const sinceDate = cutoffDateKey(WINDOW_DAYS);

    const pluses = [
      ...entries.filter((e) => e.plus && e.ts >= sinceTs).map((e) => e.plus!),
      ...selfNotes.filter((n) => n.kind === "plus" && n.ts >= sinceTs).map((n) => n.text),
    ].slice(0, MAX_SW);

    const minuses = [
      ...entries.filter((e) => e.minus && e.ts >= sinceTs).map((e) => e.minus!),
      ...selfNotes.filter((n) => n.kind === "minus" && n.ts >= sinceTs).map((n) => n.text),
    ].slice(0, MAX_SW);

    const briefingEntries = entries
      .filter((e) => e.ts >= sinceTs)
      .slice(0, MAX_ENTRIES)
      .map((e) => ({
        date: dayKey(e.ts),
        outcome: OUTCOME_LABELS[e.outcome] ?? e.outcome,
        want: e.want,
        fear: e.fear,
        why: e.why,
        trust: e.trust,
        objection: e.objection,
        plus: e.plus,
        minus: e.minus,
        note: e.note,
      }));

    const briefingReflections = reflections
      .filter((r) => r.date >= sinceDate)
      .slice(0, MAX_REFLECTIONS)
      .map((r) => ({
        date: r.date,
        answers: Object.values(r.answers ?? {}).filter((v) => String(v).trim()),
        focus: r.focus,
      }));

    const fingerprint = [
      pluses.join("|"),
      minuses.join("|"),
      briefingEntries
        .map((e) => [e.date, e.outcome, e.want, e.fear, e.why, e.trust, e.objection, e.plus, e.minus, e.note].join("~"))
        .join("|"),
      briefingReflections
        .map((r) => [r.date, r.answers.join("/"), r.focus ?? ""].join("~"))
        .join("|"),
    ].join("::");

    return { pluses, minuses, briefingEntries, briefingReflections, fingerprint };
  }, [ready, entries, reflections, selfNotes]);

  if (!ready || !payload) return null;

  const hasData =
    payload.pluses.length > 0 ||
    payload.minuses.length > 0 ||
    payload.briefingEntries.length > 0 ||
    payload.briefingReflections.length > 0;

  const stale =
    !!settings.mentorBriefing && settings.mentorBriefingFingerprint !== payload.fingerprint;

  const fetchBriefing = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/mentor/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pluses: payload.pluses,
          minuses: payload.minuses,
          entries: payload.briefingEntries,
          reflections: payload.briefingReflections,
        }),
      });
      const data = (await res.json()) as { text: string | null };
      if (data.text) {
        const next: Settings = {
          ...settings,
          mentorBriefing: data.text,
          mentorBriefingAt: Date.now(),
          mentorBriefingFingerprint: payload.fingerprint,
          updatedAt: Date.now(),
        };
        put("settings", next);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const note = settings.mentorBriefing;
  const noteAt = settings.mentorBriefingAt;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">AI Mentor</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Týždenný briefing z{" "}
          <Link href="/plusy-minusy" className="text-indigo-600 hover:underline dark:text-indigo-400">
            plusov a mínusov
          </Link>
          ,{" "}
          <Link href="/dennik" className="text-indigo-600 hover:underline dark:text-indigo-400">
            denníka
          </Link>{" "}
          a{" "}
          <Link href="/zaznamy" className="text-indigo-600 hover:underline dark:text-indigo-400">
            záznamov
          </Link>{" "}
          (posledných {WINDOW_DAYS} dní). Generuje sa na požiadanie, nie pri každom otvorení.
        </p>
      </div>

      <Card className="border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/30">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-400">
          🧠 Týždenný briefing
        </h2>

        {!note && !loading && (
          <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
            Mentor zhrnie, čo ti ide, kde strácaš, a dá 3 konkrétne rady na najbližšie dni.
          </p>
        )}

        {note && <BriefingMarkdown text={note} />}

        {note && noteAt && (
          <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
            Naposledy {formatDay(noteAt)}
            {stale && ", medzitým pribudli nové dáta"}
          </p>
        )}

        {error && (
          <p className="mb-2 mt-2 text-xs text-red-500">
            AI mentor momentálne nie je dostupný, skús to neskôr.
          </p>
        )}

        <Btn
          variant={note ? "ghost" : "primary"}
          onClick={fetchBriefing}
          disabled={loading || !hasData}
          className={note || error ? "mt-3" : ""}
        >
          {loading ? "Pripravujem briefing…" : note ? "Obnoviť briefing" : "Pripraviť briefing"}
        </Btn>

        {!hasData && (
          <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
            Najprv pridaj aspoň jeden záznam, reflexiu alebo plus/mínus za posledných {WINDOW_DAYS} dní.
          </p>
        )}
      </Card>

      <div>
        <SectionTitle>Zdroje briefingu</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <SourceStat label="Plusy" count={payload.pluses.length} href="/plusy-minusy" />
          <SourceStat label="Mínusy" count={payload.minuses.length} href="/plusy-minusy" />
          <SourceStat label="Záznamy" count={payload.briefingEntries.length} href="/zaznamy" />
          <SourceStat label="Reflexie" count={payload.briefingReflections.length} href="/dennik" />
        </div>
      </div>
    </div>
  );
}

function SourceStat({ label, count, href }: { label: string; count: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm transition-colors hover:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="font-medium text-zinc-800 dark:text-zinc-200">{label}</div>
      <div className="mt-0.5 text-zinc-500 dark:text-zinc-400">
        {count} {count === 1 ? "položka" : count < 5 ? "položky" : "položiek"} · {WINDOW_DAYS} dní
      </div>
    </Link>
  );
}

/** Jednoduchý renderer pre mentor briefing: ## nadpisy, **tučné**, - odrážky. */
function BriefingMarkdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length === 0) return;
    blocks.push(
      <ul key={key} className="mb-3 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
        {listItems.map((item, i) => (
          <li key={i}>
            <RichText text={item} />
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(`list-empty-${idx}`);
      return;
    }

    const h3 = trimmed.match(/^###\s+(.+)$/);
    const h2 = trimmed.match(/^##\s+(.+)$/);
    const h1 = trimmed.match(/^#\s+(.+)$/);
    const bullet = trimmed.match(/^[-*]\s+(.+)$/);

    if (h3 || h2 || h1) {
      flushList(`list-before-h-${idx}`);
      const title = (h3?.[1] ?? h2?.[1] ?? h1?.[1] ?? "").replace(/\*\*/g, "");
      if (h3) {
        blocks.push(
          <h3 key={`h-${idx}`} className="mb-2 mt-5 text-base font-semibold text-zinc-900 first:mt-0 dark:text-zinc-50">
            {title}
          </h3>
        );
      } else {
        blocks.push(
          <h2 key={`h-${idx}`} className="mb-2 mt-5 text-lg font-semibold text-zinc-900 first:mt-0 dark:text-zinc-50">
            {title}
          </h2>
        );
      }
      return;
    }

    if (bullet) {
      listItems.push(bullet[1]);
      return;
    }

    flushList(`list-before-p-${idx}`);
    blocks.push(
      <p key={`p-${idx}`} className="mb-3 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
        <RichText text={trimmed} />
      </p>
    );
  });

  flushList("list-end");
  return <div className="space-y-0">{blocks}</div>;
}

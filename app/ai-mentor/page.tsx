"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useData } from "@/lib/useData";
import { dayKey } from "@/lib/gamify";
import { uid } from "@/lib/store";
import { OUTCOME_LABELS, PRICE_TIMING_LABELS, OBJECTION_REACTION_LABELS, NEXT_STEP_PLAN_LABELS, DAY_PRICE_LABELS, STRUGGLE_CATEGORY_LABELS } from "@/content/chips";
import type { MentorMessage, Settings } from "@/lib/types";
import { Btn, Card, RichText, SectionTitle, TextArea } from "@/components/ui";

const WINDOW_DAYS = 14;
const MAX_ENTRIES = 40;
const MAX_REFLECTIONS = 14;
const MAX_SW = 25;
const CHAT_WINDOW = 20;

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
  const { entries, reflections, selfNotes, settings, mentorMessages, put, ready } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(false);

  const webChat = useMemo(() => {
    return mentorMessages
      .filter((m) => m.channel === "web")
      .slice()
      .sort((a, b) => a.ts - b.ts)
      .slice(-CHAT_WINDOW);
  }, [mentorMessages]);

  const payload = useMemo(() => {
    if (!ready) return null;
    const sinceTs = daysAgoTs(WINDOW_DAYS);
    const sinceDate = cutoffDateKey(WINDOW_DAYS);

    const pluses = [
      ...entries
        .filter((e) => e.ts >= sinceTs)
        .flatMap((e) => [...(e.pluses ?? []), ...(e.plus ? [e.plus] : [])]),
      ...selfNotes.filter((n) => n.kind === "plus" && n.ts >= sinceTs).map((n) => n.text),
    ].slice(0, MAX_SW);

    const minuses = [
      ...entries
        .filter((e) => e.ts >= sinceTs)
        .flatMap((e) => [...(e.minuses ?? []), ...(e.minus ? [e.minus] : [])]),
      ...selfNotes.filter((n) => n.kind === "minus" && n.ts >= sinceTs).map((n) => n.text),
    ].slice(0, MAX_SW);

    const briefingEntries = entries
      .filter((e) => e.ts >= sinceTs)
      .slice(0, MAX_ENTRIES)
      .map((e) => ({
        date: dayKey(e.ts),
        outcome: OUTCOME_LABELS[e.outcome] ?? e.outcome,
        requestText: e.requestText,
        itemCount: e.itemCount,
        askedReview: e.askedReview,
        priceTiming: e.priceTiming ? PRICE_TIMING_LABELS[e.priceTiming] ?? e.priceTiming : undefined,
        hadNextStepPlan: e.hadNextStepPlan
          ? NEXT_STEP_PLAN_LABELS[e.hadNextStepPlan] ?? e.hadNextStepPlan
          : undefined,
        objection: e.objection,
        pluses: e.pluses,
        minuses: e.minuses,
        want: e.want,
        fear: e.fear,
        why: e.why,
        trust: e.trust,
        objectionReaction: e.objectionReaction
          ? OBJECTION_REACTION_LABELS[e.objectionReaction] ?? e.objectionReaction
          : undefined,
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
        struggleCategory: r.struggleCategory
          ? STRUGGLE_CATEGORY_LABELS[r.struggleCategory] ?? r.struggleCategory
          : undefined,
        struggleText: r.struggleText,
        retreated: r.retreated,
        selfFocus: r.selfFocus,
        hardestMoment: r.hardestMoment,
        strengthToday: r.strengthToday,
        better10: r.better10,
        priceDay: r.priceDay ? DAY_PRICE_LABELS[r.priceDay] ?? r.priceDay : undefined,
        wins: r.wins,
        losses: r.losses,
      }));

    const fingerprint = [
      pluses.join("|"),
      minuses.join("|"),
      briefingEntries
        .map((e) =>
          [
            e.date,
            e.outcome,
            e.requestText ?? "",
            e.itemCount ?? "",
            e.askedReview ? "1" : "0",
            e.priceTiming ?? "",
            e.hadNextStepPlan ?? "",
            e.objection ?? "",
            (e.pluses ?? []).join("^"),
            (e.minuses ?? []).join("^"),
            e.want,
            e.fear,
            e.why,
            e.trust,
            e.objectionReaction ?? "",
            e.plus,
            e.minus,
            e.note,
          ].join("~")
        )
        .join("|"),
      briefingReflections
        .map((r) =>
          [
            r.date,
            r.struggleCategory ?? "",
            r.struggleText ?? "",
            r.focus ?? "",
            r.retreated ?? "",
            r.selfFocus ?? "",
            r.hardestMoment ?? "",
            r.strengthToday ?? "",
            r.better10 ?? "",
            r.priceDay ?? "",
            (r.wins ?? []).join("^"),
            (r.losses ?? []).join("^"),
            r.answers.join("/"),
          ].join("~")
        )
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

  const sendChat = async () => {
    const message = chatInput.trim();
    if (!message || chatLoading) return;
    setChatLoading(true);
    setChatError(false);
    setChatInput("");

    const now = Date.now();
    const userMsg: MentorMessage = {
      id: uid(),
      channel: "web",
      role: "user",
      text: message,
      ts: now,
      updatedAt: now,
    };
    put("mentorMessages", userMsg);

    const history = [...webChat, userMsg].map((m) => ({ role: m.role, text: m.text }));

    try {
      const res = await fetch("/api/mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, persist: false }),
      });
      const data = (await res.json()) as { text: string | null };
      if (data.text) {
        const asst: MentorMessage = {
          id: uid(),
          channel: "web",
          role: "assistant",
          text: data.text,
          ts: Date.now(),
          updatedAt: Date.now(),
        };
        put("mentorMessages", asst);
      } else {
        setChatError(true);
      }
    } catch {
      setChatError(true);
    } finally {
      setChatLoading(false);
    }
  };

  const note = settings.mentorBriefing;
  const noteAt = settings.mentorBriefingAt;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">AI Mentor</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Chatuj o predaji podľa svojich dát, alebo si daj týždenný briefing z{" "}
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
          </Link>
          .
        </p>
      </div>

      <Card>
        <SectionTitle>Rozhovor s mentorom</SectionTitle>
        <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
          Pýtaj sa voľne. Mentor drží kontext posledných správ a číta tvoje zápisy z dojo.
        </p>
        <div className="mb-3 max-h-80 space-y-2 overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
          {webChat.length === 0 && (
            <p className="text-sm text-zinc-400">Zatiaľ žiadne správy. Skús napr. „Kde strácam pri cene?“</p>
          )}
          {webChat.map((m) => (
            <div
              key={m.id}
              className={`rounded-lg px-3 py-2 text-sm ${
                m.role === "user"
                  ? "ml-6 bg-indigo-600 text-white"
                  : "mr-6 bg-white text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              }`}
            >
              <div className="mb-0.5 text-[10px] uppercase tracking-wide opacity-70">
                {m.role === "user" ? "Ty" : "Mentor"}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed">
                <RichText text={m.text} />
              </div>
            </div>
          ))}
          {chatLoading && <p className="text-xs text-zinc-400">Mentor píše…</p>}
        </div>
        {chatError && (
          <p className="mb-2 text-xs text-red-500">Odpoveď sa nepodarila, skús znova.</p>
        )}
        <TextArea
          rows={3}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Napíš otázku mentorovi…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void sendChat();
            }
          }}
        />
        <Btn className="mt-3" onClick={() => void sendChat()} disabled={chatLoading || !chatInput.trim()}>
          {chatLoading ? "Posielam…" : "Odoslať"}
        </Btn>
      </Card>

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

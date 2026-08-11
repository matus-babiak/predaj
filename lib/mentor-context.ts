// Snapshot tréningových dát pre hybrid mentora (web + Telegram).
// Len čítanie kolekcií. Žiadne zápisy.

import { getAllCollections } from "./db";
import { dayKey } from "./gamify";
import { getWeek } from "@/content/program";
import { OBJECTIONS } from "@/content/objections";
import {
  DAY_PRICE_LABELS,
  NEXT_STEP_PLAN_LABELS,
  OUTCOME_LABELS,
  PRICE_TIMING_LABELS,
} from "@/content/chips";
import type {
  Entry,
  MentorMessage,
  ObjAttempt,
  Progress,
  Reflection,
  SelfNote,
  UserObjection,
} from "./types";

export const MENTOR_CHAT_WINDOW = 20;
const MAX_ENTRIES = 25;
const MAX_REFLECTIONS = 10;
const MAX_SW = 20;
const MAX_WEAK = 8;
const WINDOW_DAYS = 14;

export interface MentorContextSnapshot {
  text: string;
  fingerprint: string;
}

function daysAgoTs(days: number): number {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

function formatEntryLine(e: Entry): string {
  const bits = [
    `${dayKey(e.ts)}: ${OUTCOME_LABELS[e.outcome] ?? e.outcome}`,
    e.requestText ? `požiadavka: ${e.requestText}` : "",
    e.itemCount != null ? `položky: ${e.itemCount >= 5 ? "5+" : e.itemCount}` : "",
    e.askedReview ? "recenzia: áno" : "",
    e.priceTiming ? `cena: ${PRICE_TIMING_LABELS[e.priceTiming] ?? e.priceTiming}` : "",
    e.objection ? `námietka: ${e.objection}` : "",
    e.hadNextStepPlan
      ? `plán kroku: ${NEXT_STEP_PLAN_LABELS[e.hadNextStepPlan] ?? e.hadNextStepPlan}`
      : "",
    e.pluses?.length ? `plusy: ${e.pluses.join("; ")}` : "",
    e.minuses?.length ? `mínusy: ${e.minuses.join("; ")}` : "",
    e.plus ? `plus: ${e.plus}` : "",
    e.minus ? `mínus: ${e.minus}` : "",
    e.note ? `poznámka: ${e.note}` : "",
  ].filter(Boolean);
  return `- ${bits.join(" | ")}`;
}

function weakObjections(
  objAttempts: ObjAttempt[],
  userObjections: UserObjection[],
): { text: string; avg: number; count: number }[] {
  const catalog = [
    ...OBJECTIONS.map((o) => ({ id: o.id, text: o.text })),
    ...userObjections.map((o) => ({ id: o.id, text: o.text })),
  ];
  return catalog
    .map((o) => {
      const list = objAttempts.filter((a) => a.objectionId === o.id);
      const avg = list.length ? list.reduce((s, a) => s + a.rating, 0) / list.length : null;
      return { text: o.text, count: list.length, avg };
    })
    .filter((x): x is { text: string; count: number; avg: number } => x.count > 0 && x.avg != null && x.avg < 2.5)
    .sort((a, b) => a.avg - b.avg)
    .slice(0, MAX_WEAK);
}

export function formatEntryForPrompt(e: Entry): string {
  return formatEntryLine(e);
}

export function formatReflectionForPrompt(r: Reflection): string {
  const bits = [
    r.priceDay ? `cena dnes: ${DAY_PRICE_LABELS[r.priceDay] ?? r.priceDay}` : "",
    r.wins?.length ? `silné: ${r.wins.join("; ")}` : "",
    r.losses?.length ? `straty: ${r.losses.join("; ")}` : "",
    r.focus ? `zajtra: ${r.focus}` : "",
  ].filter(Boolean);
  const legacy = Object.entries(r.answers ?? {})
    .filter(([, v]) => String(v ?? "").trim())
    .map(([q, a]) => `${q}: ${a}`)
    .join(" / ");
  if (legacy) bits.push(`(staré) ${legacy}`);
  return `- ${r.date}: ${bits.join(" | ") || "(prázdna)"}`;
}

/** Zostaví textový snapshot z už načítaných kolekcií (pre web API s body aj server). */
export function buildMentorContextFromData(input: {
  entries: Entry[];
  reflections: Reflection[];
  selfNotes: SelfNote[];
  progress: Progress;
  objAttempts: ObjAttempt[];
  userObjections: UserObjection[];
}): MentorContextSnapshot {
  const sinceTs = daysAgoTs(WINDOW_DAYS);
  const sinceDate = dayKey(sinceTs);

  const entries = input.entries
    .slice()
    .sort((a, b) => b.ts - a.ts)
    .filter((e) => e.ts >= sinceTs)
    .slice(0, MAX_ENTRIES);

  const reflections = input.reflections
    .slice()
    .filter((r) => r.date >= sinceDate)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, MAX_REFLECTIONS);

  const pluses = [
    ...entries.flatMap((e) => [...(e.pluses ?? []), ...(e.plus ? [e.plus] : [])]),
    ...input.selfNotes.filter((n) => n.kind === "plus" && n.ts >= sinceTs).map((n) => n.text),
  ].slice(0, MAX_SW);

  const minuses = [
    ...entries.flatMap((e) => [...(e.minuses ?? []), ...(e.minus ? [e.minus] : [])]),
    ...input.selfNotes.filter((n) => n.kind === "minus" && n.ts >= sinceTs).map((n) => n.text),
  ].slice(0, MAX_SW);

  const week = getWeek(input.progress.currentWeek);
  const weak = weakObjections(input.objAttempts, input.userObjections);

  const entryList = entries.length ? entries.map(formatEntryLine).join("\n") : "(zatiaľ žiadne)";
  const reflList = reflections.length
    ? reflections.map(formatReflectionForPrompt).join("\n")
    : "(zatiaľ žiadne)";
  const plusList = pluses.length ? pluses.map((p) => `- ${p}`).join("\n") : "(zatiaľ žiadne)";
  const minusList = minuses.length ? minuses.map((m) => `- ${m}`).join("\n") : "(zatiaľ žiadne)";
  const weakList = weak.length
    ? weak.map((w) => `- ${w.text} (priemer ${w.avg.toFixed(1)}/3, ${w.count}×)`).join("\n")
    : "(zatiaľ žiadne slabé)";

  const programLine = week
    ? `Týždeň ${week.num}/12, fáza ${week.phase} (${week.phaseTitle}): ${week.title}. Úloha: ${week.task}`
    : `Týždeň ${input.progress.currentWeek}/12`;

  const text = `PROGRAM:
${programLine}

PLUSY (čo ide):
${plusList}

MÍNUSY (čo zlepšiť):
${minusList}

ZÁZNAMY ZO ZÁKAZNÍKOV (posledných ${WINDOW_DAYS} dní):
${entryList}

VEČERNÉ REFLEXIE:
${reflList}

SLABÉ NÁMIETKY (tréning):
${weakList}`;

  const fingerprint = [
    String(input.progress.currentWeek),
    pluses.join("|"),
    minuses.join("|"),
    entries.map((e) => e.id + e.updatedAt).join("|"),
    reflections.map((r) => r.id + r.updatedAt).join("|"),
    weak.map((w) => w.text).join("|"),
  ].join("::");

  return { text, fingerprint };
}

export async function loadMentorContext(): Promise<MentorContextSnapshot> {
  const all = await getAllCollections();
  const entries = (all.entries ?? []) as unknown as Entry[];
  const reflections = (all.reflections ?? []) as unknown as Reflection[];
  const selfNotes = (all.selfNotes ?? []) as unknown as SelfNote[];
  const objAttempts = (all.objAttempts ?? []) as unknown as ObjAttempt[];
  const userObjections = (all.userObjections ?? []) as unknown as UserObjection[];
  const progress =
    ((all.progress ?? [])[0] as unknown as Progress | undefined) ??
    ({
      id: "progress",
      startedAt: Date.now(),
      currentWeek: 1,
      completedWeeks: [],
      readLessons: [],
      weekStarts: {},
      updatedAt: 0,
    } satisfies Progress);

  return buildMentorContextFromData({
    entries,
    reflections,
    selfNotes,
    progress,
    objAttempts,
    userObjections,
  });
}

export function rollingChatHistory(
  messages: MentorMessage[],
  channel: MentorMessage["channel"],
  limit = MENTOR_CHAT_WINDOW,
): MentorMessage[] {
  return messages
    .filter((m) => m.channel === channel)
    .slice()
    .sort((a, b) => a.ts - b.ts)
    .slice(-limit);
}

export function formatChatHistory(messages: MentorMessage[]): string {
  if (messages.length === 0) return "(zatiaľ žiadna história)";
  return messages
    .map((m) => `${m.role === "user" ? "Predajca" : "Mentor"}: ${m.text}`)
    .join("\n");
}

export function newMessageId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

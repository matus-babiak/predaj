// Hybrid AI štatistiky: lokálne počítanie chipov + Gemini zhlukovanie voľného textu.

import type { StatsAiCategory } from "@/lib/types";

export const STATS_AI_WINDOW_DAYS = 90;
export const STATS_AI_MAX_ENTRIES = 80;

export interface StatsAiEntryInput {
  id: string;
  date: string;
  outcome: string;
  want?: string;
  fear?: string;
  why?: string;
  note?: string;
  objection?: string;
  trust?: number;
}

export interface StatsAiFreeItem {
  entryId: string;
  date: string;
  outcome: string;
  primary?: string;
  why?: string;
  note?: string;
  objection?: string;
  trust?: number;
}

export interface StatsAiResult {
  wants: StatsAiCategory[];
  fears: StatsAiCategory[];
  insight: string;
}

const VAGUE_RE =
  /^(nezistil\s*som|neviem|neznam|neznám|neuvedene|neuvedené|-|\.|n\/a|nic|nič)$/i;

export function isVagueCustomerField(value: string | undefined): boolean {
  if (!value) return true;
  const t = value.trim();
  if (t.length < 2) return true;
  return VAGUE_RE.test(t);
}

export function knownCategorySet(defaults: string[], custom: string[]): Set<string> {
  return new Set([...defaults, ...custom].map((s) => s.trim()).filter(Boolean));
}

/** Spočíta presné zhody na známych chipoch. */
export function countKnownCategories(
  values: (string | undefined)[],
  known: Set<string>
): Map<string, number> {
  const map = new Map<string, number>();
  for (const v of values) {
    if (!v) continue;
    const t = v.trim();
    if (!known.has(t)) continue;
    map.set(t, (map.get(t) ?? 0) + 1);
  }
  return map;
}

/**
 * Voľné / vágne položky na AI: buď text mimo chipov, alebo prázdne pole
 * s kontextom v note/why/objection.
 */
export function collectFreeItems(
  entries: StatsAiEntryInput[],
  field: "want" | "fear",
  known: Set<string>
): StatsAiFreeItem[] {
  const items: StatsAiFreeItem[] = [];
  for (const e of entries) {
    const primary = e[field]?.trim();
    const hasContext = !!(e.note?.trim() || e.why?.trim() || e.objection?.trim());

    if (primary && known.has(primary)) continue;

    if (primary && !isVagueCustomerField(primary)) {
      items.push({
        entryId: e.id,
        date: e.date,
        outcome: e.outcome,
        primary,
        why: e.why,
        note: e.note,
        objection: e.objection,
        trust: e.trust,
      });
      continue;
    }

    if (hasContext) {
      items.push({
        entryId: e.id,
        date: e.date,
        outcome: e.outcome,
        primary: primary && !isVagueCustomerField(primary) ? primary : undefined,
        why: e.why,
        note: e.note,
        objection: e.objection,
        trust: e.trust,
      });
    }
  }
  return items;
}

function formatFreeList(items: StatsAiFreeItem[], kind: "want" | "fear"): string {
  if (items.length === 0) return "(žiadne voľné texty)";
  return items
    .map((it, i) => {
      const bits = [
        `#${i + 1} ${it.date} · ${it.outcome}`,
        it.primary ? `${kind === "want" ? "chcel" : "bál sa"}: ${it.primary}` : `${kind === "want" ? "chcel" : "bál sa"}: (nevyplnené / vágne)`,
        it.why ? `prečo: ${it.why}` : "",
        it.note ? `poznámka: ${it.note}` : "",
        it.objection ? `námietka: ${it.objection}` : "",
        it.trust ? `dôvera ${it.trust}/5` : "",
      ].filter(Boolean);
      return `- ${bits.join(" | ")}`;
    })
    .join("\n");
}

export function buildCustomerStatsPrompt(input: {
  knownWants: string[];
  knownFears: string[];
  freeWants: StatsAiFreeItem[];
  freeFears: StatsAiFreeItem[];
  localWantCounts: { label: string; count: number }[];
  localFearCounts: { label: string; count: number }[];
}): string {
  const knownWantsList = input.knownWants.length
    ? input.knownWants.map((w) => `- ${w}`).join("\n")
    : "(žiadne)";
  const knownFearsList = input.knownFears.length
    ? input.knownFears.map((f) => `- ${f}`).join("\n")
    : "(žiadne)";
  const localWants = input.localWantCounts.length
    ? input.localWantCounts.map((c) => `- ${c.label}: ${c.count}`).join("\n")
    : "(žiadne)";
  const localFears = input.localFearCounts.length
    ? input.localFearCounts.map((c) => `- ${c.label}: ${c.count}`).join("\n")
    : "(žiadne)";

  return `Si prísny, ale podporujúci mentor predaja v predajni elektroniky / mobilov. Predajca si zapisuje, čo zákazníci chceli a čoho sa báli. Niektoré zápisy sú krátke chipy, iné dlhé voľné texty.

Úloha: zo VOĽNÝCH textov vytvor zmysluplné kategórie (zhluky) potrieb a obáv. Lokálne spočítané chipy už poznáme, nemusíš ich znova počítať, ale môžeš na ne mapovať voľný text, ak význam sedí.

ZNÁME KATEGÓRIE POTRIEB (preferuj tieto labely, keď význam sedí):
${knownWantsList}

ZNÁME KATEGÓRIE OBÁV (preferuj tieto labely, keď význam sedí):
${knownFearsList}

UŽ SPOČÍTANÉ CHIPY (potreby):
${localWants}

UŽ SPOČÍTANÉ CHIPY (obavy):
${localFears}

VOĽNÉ / VÁGNE POTREBY (chcel) na zhlukovanie. Ak je primárne pole prázdne, odvoď kategóriu z poznámky, prečo alebo námietky. Ignoruj čisto vágne bez kontextu.
${formatFreeList(input.freeWants, "want")}

VOĽNÉ / VÁGNE OBÁVY (bál sa) na zhlukovanie. Rovnaké pravidlá.
${formatFreeList(input.freeFears, "fear")}

Pravidlá kategórií:
- Krátky label (max cca 6 slov), nie celá veta zo záznamu
- Podobné príbehy zlúč do jednej kategórie (napr. Google úložisko + USB + strata dát → jedna potreba okolo dát / úložiska)
- Ak sedí význam na známu kategóriu, použi PRESNE jej label
- Inak vytvor novú jasnú kategóriu v slovenčine
- count = koľko položiek z VOĽNÉHO zoznamu patrí do kategórie (len tie, nie chipy)
- examples: 1-2 krátke úryvky z pôvodných textov
- Nevytváraj kategóriu „Nezistil som“ ani podobné prázdne labely
- Ak pre wants alebo fears nie je čo zhlukovať, vráť prázdne pole []

Insight (pole insight):
- Slovenčina, max 4 vety, bez odrážok
- Pomenuj hlavný pattern v potrebách a obavách
- Jednu konkrétnu vec, na čo sa má predajca pripraviť / čo trénovať
- Buď konkrétny podľa dát, nie všeobecný
- Ak je málo dát, povedz to priamo a daj jednu praktickú radu na lepšie zapisovanie

Vráť VÝHRADNE platný JSON bez markdown fence, bez úvodu a bez záveru, v tomto tvare:
{"wants":[{"label":"...","count":1,"examples":["..."]}],"fears":[{"label":"...","count":1,"examples":["..."]}],"insight":"..."}`;
}

function asCategoryList(raw: unknown): StatsAiCategory[] {
  if (!Array.isArray(raw)) return [];
  const out: StatsAiCategory[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const label = typeof rec.label === "string" ? rec.label.trim() : "";
    const count = typeof rec.count === "number" ? rec.count : Number(rec.count);
    if (!label || !Number.isFinite(count) || count <= 0) continue;
    if (isVagueCustomerField(label)) continue;
    const examples = Array.isArray(rec.examples)
      ? rec.examples.filter((x): x is string => typeof x === "string" && x.trim().length > 0).slice(0, 3)
      : undefined;
    out.push({ label, count: Math.round(count), examples });
  }
  return out;
}

/** Vyberie JSON z odpovede modelu (aj keď omylom pridá ``` fence). */
export function parseStatsAiResponse(text: string): StatsAiResult | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? trimmed).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const parsed = JSON.parse(candidate.slice(start, end + 1)) as Record<string, unknown>;
    const insight = typeof parsed.insight === "string" ? parsed.insight.trim() : "";
    return {
      wants: asCategoryList(parsed.wants),
      fears: asCategoryList(parsed.fears),
      insight,
    };
  } catch {
    return null;
  }
}

/** Zlúči lokálne chip počty s AI zhlukmi (rovnaký label sčíta). */
export function mergeCategoryCounts(
  local: Map<string, number>,
  ai: StatsAiCategory[],
  topN = 5
): StatsAiCategory[] {
  const map = new Map<string, StatsAiCategory>();
  for (const [label, count] of local) {
    map.set(label, { label, count });
  }
  for (const cat of ai) {
    const prev = map.get(cat.label);
    if (prev) {
      map.set(cat.label, {
        label: cat.label,
        count: prev.count + cat.count,
        examples: cat.examples?.length ? cat.examples : prev.examples,
      });
    } else {
      map.set(cat.label, { ...cat });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "sk")).slice(0, topN);
}

export function mapToRankItems(cats: StatsAiCategory[]): [string, number][] {
  return cats.map((c) => [c.label, c.count]);
}

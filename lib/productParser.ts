// Rozpozná vložený text produktovej analýzy (nadpisy vo forme otázok, tučné nadpisy
// alebo markdown nadpisy) a rozdelí ho do polí kartičky podľa content/productFields.
// Je to odhad, nie exaktný parser: výsledok sa vždy zobrazí vo formulári na kontrolu
// pred uložením.

import { ALL_PRODUCT_FIELDS, type ProductFieldDef } from "@/content/productFields";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHeadingMarkup(line: string): string {
  return line
    .replace(/^#{1,6}\s*/, "")
    .replace(/^\*\*/, "")
    .replace(/\*\*:?\s*$/, "")
    .replace(/^\d+[.)]\s*/, "")
    .trim();
}

function isHeadingCandidate(line: string): boolean {
  if (!line || line.length > 100) return false;
  if (/^#{1,6}\s/.test(line)) return true;
  if (/^\*\*.*\*\*:?$/.test(line)) return true;
  return line.endsWith("?") || line.endsWith(":");
}

// Hrubá aproximácia slovenského stemu (skloňovanie mení konce slov: chyba/chybu,
// predajcov/predajcovia), aby zhoda nepadala len na presný tvar slova.
function stem(word: string): string {
  return word.length > 5 ? word.slice(0, 5) : word;
}

function bestFieldMatch(headingText: string, fields: ProductFieldDef[]): string | null {
  const words = new Set(
    normalize(headingText)
      .split(" ")
      .filter(Boolean)
      .map(stem)
  );
  if (words.size === 0) return null;
  let best: { key: string; score: number } | null = null;
  for (const f of fields) {
    for (const alias of [f.label, ...f.aliases]) {
      const aliasWords = normalize(alias).split(" ").filter(Boolean).map(stem);
      if (aliasWords.length === 0) continue;
      const hits = aliasWords.filter((w) => words.has(w)).length;
      const score = hits / aliasWords.length;
      if (score >= 0.6 && (!best || score > best.score)) {
        best = { key: f.key, score };
      }
    }
  }
  return best?.key ?? null;
}

const INLINE_LABEL = /^\*\*([^*]{1,80})\*\*:?\s*(.*)$/;

// Odstráni markdown zvýraznenie (**tučné**), nech sa v uloženom texte nezobrazujú hviezdičky.
function stripMarkdown(s: string): string {
  return s.replace(/\*\*/g, "").trim();
}

export function parseProductText(raw: string): Record<string, string> {
  const lines = raw.split(/\r?\n/);
  const buckets: Record<string, string[]> = {};
  let currentKey: string | null = null;

  const push = (key: string, text: string) => {
    const clean = stripMarkdown(text);
    if (!clean) return;
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(clean);
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Markdown nadpis (## Sekcia) alebo vodorovná čiara vždy ukončí aktuálne pole:
    // slúžia ako oddeľovač sekcií, nie ako otázka ku konkrétnemu poľu.
    if (/^#{1,6}\s/.test(line) || /^-{3,}$/.test(line)) {
      currentKey = null;
      continue;
    }

    // Riadok v tvare "**Popisok:** obsah" (nadpis a odpoveď na jednom riadku).
    const inline = line.match(INLINE_LABEL);
    if (inline) {
      const key = bestFieldMatch(inline[1].trim(), ALL_PRODUCT_FIELDS);
      if (key) {
        currentKey = key;
        if (inline[2].trim()) push(key, inline[2].trim());
        continue;
      }
    }

    if (isHeadingCandidate(line)) {
      const key = bestFieldMatch(stripHeadingMarkup(line), ALL_PRODUCT_FIELDS);
      if (key) {
        currentKey = key;
        continue;
      }
      // nadpis podobná veta bez istej zhody sa pripočíta k aktuálnemu poľu, nič sa nestratí
    }

    if (currentKey) push(currentKey, line);
  }

  const out: Record<string, string> = {};
  for (const [key, contentLines] of Object.entries(buckets)) {
    const text = contentLines.join("\n").trim();
    if (text) out[key] = text;
  }
  return out;
}

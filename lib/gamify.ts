import type { Entry, Reflection, ObjAttempt, ProductCard, Progress } from "./types";

// ---- Streak ----------------------------------------------------------------

export function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function activeDays(entries: Entry[], reflections: Reflection[]): Set<string> {
  const days = new Set<string>();
  for (const e of entries) days.add(dayKey(e.ts));
  for (const r of reflections) days.add(r.date);
  return days;
}

/** Séria po sebe idúcich dní so záznamom, končiaca dnes alebo včera. */
export function streak(days: Set<string>): number {
  let count = 0;
  const d = new Date();
  // streak môže končiť dnes alebo včera (dnešný zápis ešte len príde)
  if (!days.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1);
  while (days.has(dayKey(d.getTime()))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

// ---- Odznaky ---------------------------------------------------------------

export interface Badge {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  earned: boolean;
}

export function computeBadges(data: {
  entries: Entry[];
  reflections: Reflection[];
  objAttempts: ObjAttempt[];
  products: ProductCard[];
  progress?: Progress;
}): Badge[] {
  const days = activeDays(data.entries, data.reflections);
  const s = streak(days);
  const completed = data.progress?.completedWeeks ?? [];
  const phaseDone = (p: number) => completed.includes(p * 2 - 1) && completed.includes(p * 2);

  return [
    { id: "first", emoji: "✍️", title: "Prvý zápis", desc: "Prvý záznam zákazníka", earned: data.entries.length >= 1 },
    { id: "streak7", emoji: "🔥", title: "Týždeň v kuse", desc: "7-dňová séria zápisov", earned: s >= 7 },
    { id: "streak30", emoji: "🌋", title: "Mesiac v kuse", desc: "30-dňová séria zápisov", earned: s >= 30 },
    { id: "e50", emoji: "📒", title: "50 zákazníkov", desc: "50 záznamov v denníku", earned: data.entries.length >= 50 },
    { id: "e200", emoji: "📚", title: "200 zákazníkov", desc: "200 záznamov v denníku", earned: data.entries.length >= 200 },
    { id: "obj25", emoji: "🥊", title: "Sparring", desc: "25 natrénovaných námietok", earned: data.objAttempts.length >= 25 },
    { id: "obj100", emoji: "🏆", title: "Ring majster", desc: "100 natrénovaných námietok", earned: data.objAttempts.length >= 100 },
    { id: "prod10", emoji: "🗂️", title: "Znalec sortimentu", desc: "10 produktových kartičiek", earned: data.products.length >= 10 },
    { id: "ph1", emoji: "🧭", title: "Základy", desc: "Fáza 1 dokončená", earned: phaseDone(1) },
    { id: "ph2", emoji: "🩺", title: "Diagnostik", desc: "Fáza 2 dokončená", earned: phaseDone(2) },
    { id: "ph3", emoji: "📦", title: "Produktový poradca", desc: "Fáza 3 dokončená", earned: phaseDone(3) },
    { id: "ph4", emoji: "🛡️", title: "Krotiteľ námietok", desc: "Fáza 4 dokončená", earned: phaseDone(4) },
    { id: "ph5", emoji: "🎙️", title: "Komunikátor", desc: "Fáza 5 dokončená", earned: phaseDone(5) },
    { id: "ph6", emoji: "🎓", title: "Cesta dokončená", desc: "Celý 12-týždňový program", earned: phaseDone(6) },
  ];
}

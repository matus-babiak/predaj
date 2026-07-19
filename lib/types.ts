// Zdieľané typy pre celú appku

export type Outcome = "kupil" | "nekupil" | "vrati_sa" | "rada";

export interface Entry {
  id: string;
  ts: number; // timestamp záznamu
  outcome: Outcome;
  want?: string; // čo podľa mňa chcel (skutočná potreba)
  fear?: string; // čoho sa bál
  why?: string; // prečo kúpil / nekúpil
  trust?: number; // 1–5: nakoľko vznikla dôvera
  objection?: string; // námietka, ktorá padla
  note?: string; // poznámka na večer
  plus?: string; // sebahodnotenie: čo som urobil dobre
  minus?: string; // sebahodnotenie: čo nabudúce inak
  updatedAt: number;
}

// Samostatne pridané plus/mínus (mimo záznamu z predaja) — stránka Plusy a mínusy.
export interface SelfNote {
  id: string;
  ts: number;
  kind: "plus" | "minus";
  text: string;
  updatedAt: number;
}

export interface Reflection {
  id: string; // dátum YYYY-MM-DD
  date: string;
  weekId: string; // týždeň programu, v ktorom vznikla
  answers: Record<string, string>; // otázka -> odpoveď
  focus?: string; // čo chcem zajtra zlepšiť
  updatedAt: number;
}

export interface Progress {
  id: "progress";
  startedAt: number;
  currentWeek: number; // 1–12
  completedWeeks: number[];
  readLessons: string[]; // id týždňov s prečítanou lekciou
  weekStarts: Record<string, number>; // číslo týždňa -> kedy bol odomknutý
  updatedAt: number;
}

export interface ObjAttempt {
  id: string;
  objectionId: string;
  ts: number;
  answer: string;
  rating: 1 | 2 | 3; // 1 = mimo, 2 = čiastočne, 3 = trafil som princíp
  updatedAt: number;
}

export interface UserObjection {
  id: string;
  text: string;
  meaning?: string;
  approach?: string;
  updatedAt: number;
}

export interface ProductCard {
  id: string;
  name: string;
  category?: string;
  who: string; // komu pomáha
  when: string; // kedy ho odporučím
  whenNot: string; // kedy ho neodporučím
  alternatives: string; // aké má alternatívy
  objections: string; // najčastejšie námietky
  lastReviewed?: number;
  reviewCount?: number;
  updatedAt: number;
}

export interface Settings {
  id: "settings";
  customWants: string[];
  customFears: string[];
  updatedAt: number;
}

export type Collections = {
  entries: Entry[];
  reflections: Reflection[];
  progress: Progress[];
  objAttempts: ObjAttempt[];
  userObjections: UserObjection[];
  products: ProductCard[];
  settings: Settings[];
  selfNotes: SelfNote[];
};

export const COLLECTION_NAMES = [
  "entries",
  "reflections",
  "progress",
  "objAttempts",
  "userObjections",
  "products",
  "settings",
  "selfNotes",
] as const;

export type CollectionName = (typeof COLLECTION_NAMES)[number];

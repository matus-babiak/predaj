// Zdieľané typy pre celú appku

export type Outcome = "kupil" | "nekupil" | "vrati_sa" | "rada";

export interface Entry {
  id: string;
  ts: number; // timestamp záznamu
  outcome: Outcome;
  want?: string; // čo podľa mňa chcel (skutočná potreba)
  fear?: string; // čoho sa bál
  why?: string; // prečo kúpil / nekúpil
  trust?: number; // 1-5: nakoľko vznikla dôvera
  objection?: string; // námietka, ktorá padla
  note?: string; // poznámka na večer
  plus?: string; // sebahodnotenie: čo som urobil dobre
  minus?: string; // sebahodnotenie: čo nabudúce inak
  updatedAt: number;
}

// Samostatne pridané plus/mínus (mimo záznamu z predaja), stránka Plusy a mínusy.
export interface SelfNote {
  id: string;
  ts: number;
  kind: "plus" | "minus";
  text: string;
  updatedAt: number;
}

// Banka otázok: otázka čaká na odpoveď; po zodpovedaní sa presunie medzi zodpovedané.
export interface Question {
  id: string;
  ts: number;
  text: string;
  answer?: string;
  answeredAt?: number;
  updatedAt: number;
}

// Vlastná myšlienka pridaná v záložke Mindset (mimo vstavanej banky myšlienok).
export interface MyThought {
  id: string;
  ts: number;
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
  currentWeek: number; // 1-12
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

// Kartička produktu podľa rozšíreného predajno-psychologického rozboru.
// Pôvodných 5 polí (who/when/whenNot/alternatives/objections) ostáva povinných
// kvôli spätnej kompatibilite so staršími kartičkami, zvyšok je voliteľný doplnok.
export interface ProductCard {
  id: string;
  name: string;
  category?: string;
  url?: string; // odkaz na produkt (e-shop, výrobca)

  // Pochopenie produktu
  whatIs?: string; // čo produkt je
  problem?: string; // aký problém rieši
  need?: string; // akú potrebu/túžbu napĺňa
  whyExists?: string; // prečo produkt existuje

  // Ideálny zákazník
  who: string; // komu pomáha najviac
  when: string; // v akej situácii ho odporučím
  whenNot: string; // komu ho nepredávať / kedy ho neodporučím

  // Psychológia nákupu
  wantBecause?: string; // "chcem tento produkt, pretože..."
  beforeFeeling?: string; // ako sa cíti pred nákupom
  afterFeeling?: string; // ako sa cíti po kúpe

  // Hodnota produktu
  benefit?: string; // najväčší benefit (výsledok, nie vlastnosť)
  transformation?: string; // aká zmena nastane, pred/po
  gains?: string; // čo zákazník získa (čas, peniaze, stres, výsledok, pohodlie)

  // Konkurencia a alternatívy
  alternatives: string; // aká je alternatíva / lacnejšie riešenie
  whyBetter?: string; // prečo je tento produkt lepší
  riskIfNot?: string; // čo riskuje, ak si ho nekúpi

  // Predajná komunikácia
  pitch?: string; // jednovetový predajný argument
  mainReasons?: string; // 3 hlavné racionálne dôvody na kúpu
  emotionalReasons?: string; // 3 najsilnejšie emocionálne dôvody

  // Námietky
  objections: string; // najčastejšie námietky a odpovede

  // Predajný rozhovor
  questions?: string; // otázky pred predajom (potreba, hodnota, uzavretie)

  // Praktická príprava predajcu
  mustUnderstand?: string; // čo musím pochopiť, aby som ho vedel sebavedomo predávať
  commonMistake?: string; // akú chybu robia predajcovia
  top1Percent?: string; // ako by ho predal top 1% predajca

  lastReviewed?: number;
  reviewCount?: number;
  updatedAt: number;
}

export interface Settings {
  id: "settings";
  customWants: string[];
  customFears: string[];
  favoriteThoughts?: string[]; // id-čka obľúbených myšlienok z banky (záložka Mindset)
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
  questions: Question[];
  myThoughts: MyThought[];
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
  "questions",
  "myThoughts",
] as const;

export type CollectionName = (typeof COLLECTION_NAMES)[number];

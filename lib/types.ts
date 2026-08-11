// Zdieľané typy pre celú appku

export type Outcome = "kupil" | "nekupil" | "vrati_sa" | "rada";

/** Počet predaných / dohodnutých položiek. 5 = 5 alebo viac. */
export type ItemCount = 0 | 1 | 2 | 3 | 4 | 5;

/** Kedy som zákazníkovi povedal cenu. */
export type PriceTiming = "start" | "end" | "avoided";

/** Ako som zareagoval na námietku ceny / „nepotrebujem“. */
export type ObjectionReaction = "none" | "asked_benefit" | "gave_in" | "discount" | "froze";

/** Či som mal pred otázkou plán ďalšieho kroku. */
export type NextStepPlan = "yes" | "no" | "partial";

export interface Entry {
  id: string;
  ts: number; // timestamp záznamu
  outcome: Outcome;

  // Coaching polia (formulár Záznamy)
  requestText?: string; // primárna požiadavka (sync do kolekcie requests)
  itemCount?: ItemCount; // 0-5, kde 5 znamená 5+
  askedReview?: boolean;
  priceTiming?: PriceTiming;
  hadNextStepPlan?: NextStepPlan;
  objection?: string; // vybraná alebo vlastná námietka (prázdna = nepadla)
  pluses?: string[]; // čo som urobil dobre (viac položiek)
  minuses?: string[]; // čo zlepšiť (viac položiek)
  note?: string; // jedna veta navyše

  // Staršie polia: ostávajú kvôli histórii
  want?: string;
  fear?: string;
  why?: string;
  trust?: number;
  objectionReaction?: ObjectionReaction; // starý formulár
  plus?: string;
  minus?: string;

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

// Rýchle poznámky (TODO): pridať, vybaviť, zmazať.
export interface Note {
  id: string;
  ts: number;
  text: string;
  doneAt?: number;
  updatedAt: number;
}

// Čistá požiadavka zákazníka (s čím prišiel), oddelená od predajných záznamov.
// Slúži ako zoznam dopytov, s ktorými sa dá neskôr pracovať (sortiment, príprava).
export interface CustomerRequest {
  id: string;
  ts: number;
  text: string;
  count: number; // koľkokrát som to počul (začne na 1)
  doneAt?: number;
  updatedAt: number;
}

// Hardvérové / technické štúdium: voľný text + AI štruktúra čo sa naučiť.
export interface StudyTopic {
  id: string;
  ts: number;
  rawText: string;
  title?: string;
  situation?: string; // čo si riešil
  learnPoints?: string[]; // checklist čo sa naučiť / pozrieť
  whatsGo?: string; // krátke vysvetlenie „čo ísť študovať“
  doneAt?: number;
  updatedAt: number;
}

// Manuál (napr. Zisťovanie): tab na stránke Manuály + dlhý obsah.
export interface Manual {
  id: string;
  title: string;
  body: string;
  order: number;
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

// Rozpísaný, ešte neuložený rýchly záznam. Ukladá sa priebežne počas písania,
// aby sa nestratil pri odhlásení z nečinnosti alebo zatvorení appky pred
// kliknutím na "Uložiť záznam", synchronizuje sa rovnako ako ostatné dáta.
export interface EntryDraft {
  outcome?: Outcome;
  requestText?: string;
  itemCount?: ItemCount;
  askedReview?: boolean;
  priceTiming?: PriceTiming;
  hadNextStepPlan?: NextStepPlan;
  objectionPick?: string; // id z dropdownu alebo "" 
  objectionCustom?: string;
  pluses?: string[];
  minuses?: string[];
  note?: string;
  // staršie draft polia
  objectionReaction?: ObjectionReaction;
  want?: string;
  fear?: string;
  why?: string;
  trust?: number;
  objection?: string;
  plus?: string;
  minus?: string;
}

// Jedna kategória z AI hybrid štatistík (potreby / obavy zákazníkov).
export interface StatsAiCategory {
  label: string;
  count: number;
  examples?: string[];
}

// Správa v hybrid mentor chate (web alebo Telegram). Nie je to predajný zápis.
export type MentorChatChannel = "web" | "telegram";
export type MentorChatRole = "user" | "assistant";

export interface MentorMessage {
  id: string;
  channel: MentorChatChannel;
  role: MentorChatRole;
  text: string;
  ts: number;
  updatedAt: number;
}

export interface Settings {
  id: "settings";
  customWants: string[];
  customFears: string[];
  favoriteThoughts?: string[]; // id-čka obľúbených myšlienok z banky (záložka Mindset)
  swAiNote?: string; // AI komentár k plusom a mínusom (cache, negeneruje sa pri každom zobrazení)
  swAiNoteAt?: number;
  swAiNoteFingerprint?: string; // odtlačok vstupných dát, podľa ktorého sa pozná, či je komentár ešte platný
  mentorBriefing?: string; // týždenný AI briefing (plusy, mínusy, denník, záznamy)
  mentorBriefingAt?: number;
  mentorBriefingFingerprint?: string;
  // AI hybrid prehľad potrieb a obáv na stránke Štatistiky
  statsAiWants?: StatsAiCategory[];
  statsAiFears?: StatsAiCategory[];
  statsAiInsight?: string;
  statsAiAt?: number;
  statsAiFingerprint?: string;
  // Ranná priorita na Domove (max 1× za kalendárny deň)
  dailyFocus?: string;
  dailyFocusDate?: string; // YYYY-MM-DD
  dailyFocusAt?: number;
  dailyFocusFingerprint?: string;
  // Večerné zhrnutie po denníku (cache podľa dňa)
  eveningSummary?: string;
  eveningSummaryDate?: string;
  eveningSummaryAt?: number;
  entryDraft?: EntryDraft;
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
  notes: Note[];
  requests: CustomerRequest[];
  studyTopics: StudyTopic[];
  manuals: Manual[];
  mentorMessages: MentorMessage[];
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
  "notes",
  "requests",
  "studyTopics",
  "manuals",
  "mentorMessages",
] as const;

export type CollectionName = (typeof COLLECTION_NAMES)[number];

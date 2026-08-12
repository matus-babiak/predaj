// Stredná úroveň: skladanie promptov pre AI mentora (Gemini) na jednotlivých
// miestach appky.

export function buildSwPrompt(pluses: string[], minuses: string[]): string {
  const plusList = pluses.length ? pluses.map((p) => `- ${p}`).join("\n") : "(zatiaľ žiadne)";
  const minusList = minuses.length ? minuses.map((m) => `- ${m}`).join("\n") : "(zatiaľ žiadne)";

  return `Si prísny, ale podporujúci mentor predaja. Predajca si priebežne zapisuje vlastné plusy (čo mu v predaji ide) a mínusy (čo má zlepšiť) z každodenných zákazníckych rozhovorov.

Plusy:
${plusList}

Mínusy:
${minusList}

Napíš krátky komentár v slovenčine, najviac 4 vety, bez odrážok a bez nadpisu. Pomenuj, aký vzorec v tom vidíš, čo je jeho najsilnejšia stránka, a na ktorý jeden mínus by sa mal najbližší týždeň sústrediť. Buď konkrétny a vecný, nie všeobecný.`;
}

export interface BriefingEntryInput {
  date: string;
  outcome: string;
  requestText?: string;
  itemCount?: number;
  askedReview?: boolean;
  priceTiming?: string;
  hadNextStepPlan?: string;
  objection?: string;
  pluses?: string[];
  minuses?: string[];
  note?: string;
  // staršie polia (história)
  want?: string;
  fear?: string;
  why?: string;
  trust?: number;
  objectionReaction?: string;
  plus?: string;
  minus?: string;
}

export interface BriefingReflectionInput {
  date: string;
  answers: string[];
  focus?: string;
  struggleCategory?: string;
  struggleText?: string;
  retreated?: string;
  selfFocus?: string;
  hardestMoment?: string;
  strengthToday?: string;
  better10?: string;
  salesEur?: number;
  priceDay?: string;
  wins?: string[];
  losses?: string[];
}

export function buildWeeklyBriefingPrompt(input: {
  pluses: string[];
  minuses: string[];
  entries: BriefingEntryInput[];
  reflections: BriefingReflectionInput[];
}): string {
  const plusList = input.pluses.length ? input.pluses.map((p) => `- ${p}`).join("\n") : "(zatiaľ žiadne)";
  const minusList = input.minuses.length ? input.minuses.map((m) => `- ${m}`).join("\n") : "(zatiaľ žiadne)";

  const entryList = input.entries.length
    ? input.entries
        .map((e) => {
          const bits = [
            `${e.date}: ${e.outcome}`,
            e.requestText ? `požiadavka: ${e.requestText}` : "",
            e.itemCount != null ? `položky: ${e.itemCount >= 5 ? "5+" : e.itemCount}` : "",
            e.askedReview ? "recenzia: áno" : "",
            e.priceTiming ? `cena: ${e.priceTiming}` : "",
            e.objection ? `námietka: ${e.objection}` : "",
            e.hadNextStepPlan ? `plán kroku: ${e.hadNextStepPlan}` : "",
            e.pluses?.length ? `plusy: ${e.pluses.join("; ")}` : "",
            e.minuses?.length ? `mínusy: ${e.minuses.join("; ")}` : "",
            e.want ? `chcel: ${e.want}` : "",
            e.fear ? `bál sa: ${e.fear}` : "",
            e.why ? `prečo: ${e.why}` : "",
            e.trust ? `dôvera ${e.trust}/5` : "",
            e.objectionReaction ? `reakcia (staré): ${e.objectionReaction}` : "",
            e.plus ? `plus: ${e.plus}` : "",
            e.minus ? `mínus: ${e.minus}` : "",
            e.note ? `poznámka: ${e.note}` : "",
          ].filter(Boolean);
          return `- ${bits.join(" | ")}`;
        })
        .join("\n")
    : "(zatiaľ žiadne)";

  const reflList = input.reflections.length
    ? input.reflections
        .map((r) => {
          const bits = [
            r.struggleCategory ? `boj: ${r.struggleCategory}` : "",
            r.struggleText ? `boj detail: ${r.struggleText}` : "",
            r.focus ? `zajtra inak: ${r.focus}` : "",
            r.retreated ? `ustúpil: ${r.retreated}` : "",
            r.selfFocus ? `stres: ${r.selfFocus}` : "",
            r.hardestMoment ? `najťažší moment: ${r.hardestMoment}` : "",
            r.strengthToday ? `sila: ${r.strengthToday}` : "",
            r.better10 ? `+10%: ${r.better10}` : "",
            r.salesEur != null && Number.isFinite(r.salesEur) ? `predaje: ${r.salesEur} EUR` : "",
            r.priceDay ? `cena dnes: ${r.priceDay}` : "",
            r.wins?.length ? `silné: ${r.wins.join("; ")}` : "",
            r.losses?.length ? `straty: ${r.losses.join("; ")}` : "",
            r.answers.length ? `odpovede: ${r.answers.join(" / ")}` : "",
          ].filter(Boolean);
          return `- ${r.date}: ${bits.join(" | ") || "(prázdna)"}`;
        })
        .join("\n")
    : "(zatiaľ žiadne)";

  return `Si skúsený mentor predaja (prísny, ale podporujúci). Predajca vedie Sales Dojo denník. Priprav týždenný mentorsky briefing v slovenčine na základe štyroch zdrojov z posledných dní.

PLUSY (čo mu ide):
${plusList}

MÍNUSY (čo má zlepšiť):
${minusList}

ZÁZNAMY ZO ZÁKAZNÍKOV:
${entryList}

VEČERNÉ REFLEXIE (DENNÍK):
${reflList}

Napíš briefing v markdown formáte v slovenčine. Presne tieto sekcie:

## Silné stránky
(2–3 vety podľa plusov a úspešných vzorcov v záznamoch)

## Kde strácaš
(2–3 vety podľa mínusov, námietok, nízkej dôvery, neúspešných outcome)

## Spätná väzba z denníka
(1–3 vety podľa večerných reflexií; ak chýbajú, povedz to priamo)

## Spätná väzba zo záznamov
(1–3 vety podľa zákazníckych záznamov; ak chýbajú, povedz to priamo)

## Rady na najbližšie dni
(presne 3 konkrétne, praktické rady ako odrážky: každý riadok začni "- ")

Pravidlá formátovania:
- Nadpisy sekcií výhradne ako ## Nadpis
- Kľúčové body, vzorce a dôležité frázy zvýrazni **tučne** (markdown **text**)
- V každej sekcii aspoň 1–2 tučné zvýraznenia
- Buď konkrétny podľa dát, nie všeobecný
- Bez úvodu a bez záveru navyše
- Žiadne HTML, len markdown (##, **, - )`;
}

/** AI štruktúra hardvérového / technického štúdia z voľného textu predajcu. */
export function buildStudyPrompt(rawText: string): string {
  return `Si mentor predaja v PC/telefón servise. Predajca napísal vlastnými slovami situáciu, ktorú riešil a v ktorej mu chýbali produktové alebo hardvérové znalosti.

Jeho text:
"""
${rawText}
"""

Vráť VÝHRADNE jeden JSON objekt (bez markdown fence, bez úvodu) s kľúčmi:
{
  "title": "krátky výstižný názov témy po slovensky",
  "situation": "1–2 vety: čo riešil / čo nevedel",
  "learnPoints": ["3 až 7 konkrétnych bodov čo sa naučiť alebo pozrieť"],
  "whatsGo": "2–4 vety: čo má ísť študovať a prečo mu to pomôže pri predaji (What's Go)"
}

Buď konkrétny podľa jeho textu, nie všeobecný. Po slovensky.`;
}

const PERSONA = `Si prísny, ale podporujúci mentor predaja v Sales Dojo (predajňa / PC a telefón servis). Hovoríš po slovensky, tykáš, si konkrétny podľa dát predajcu, nie všeobecný. Bez úvodných fráz typu „Ako AI…“.`;

export function buildDebriefPrompt(entryBlock: string, contextText: string): string {
  return `${PERSONA}

Úloha: krátky debrief k JEDNÉMU predaju, ktorý predajca práve uložil.

PREDÁŽ PREDAJ:
${entryBlock}

KONTEXT Z DOJO (posledné dni, program, slabiny):
${contextText}

Napíš v slovenčine, markdown, max cca 8 viet / odrážok:
## Čo bolo dobré
(1-2 konkrétne body podľa tohto záznamu)
## Kde si stratil šancu
(1-2 body; ak nič podstatné, povedz to priamo)
## Tip na ďalšieho zákazníka
(presne 1 praktický tip)

Pravidlá: bez HTML, bez všeobecných fráz, opieraj sa o dáta.`;
}

export function buildDailyFocusPrompt(contextText: string): string {
  return `${PERSONA}

Úloha: jedna priorita na dnešný deň v predajni.

KONTEXT Z DOJO:
${contextText}

Napíš v slovenčine:
## Priorita na dnes
(1 veta: čo má dnes trénovať / robiť inak)
## Prečo
(1-2 vety podľa dát: mínusy, námietky, úloha týždňa)
## Ako to spoznáš
(1 konkrétny signál počas dňa)

Žiadny iný obsah. Bez HTML.`;
}

export function buildEveningSummaryPrompt(
  reflectionBlock: string,
  todayEntriesBlock: string,
  contextText: string,
): string {
  return `${PERSONA}

Úloha: večerné zhrnutie dňa po reflexii.

DNEŠNÁ REFLEXIA:
${reflectionBlock}

DNEŠNÉ ZÁZNAMY:
${todayEntriesBlock}

ŠIRŠÍ KONTEXT:
${contextText}

Napíš v slovenčine, markdown:
## Ako dopadol deň
(2-3 vety)
## Vzorec
(1-2 vety: čo sa opakuje)
## Zajtra
(presne 1 konkrétna vec)

Bez HTML, bez všeobecnej motivácie.`;
}

export function buildFreeChatPrompt(
  historyBlock: string,
  contextText: string,
  userMessage: string,
): string {
  return `${PERSONA}

Úloha: voľný koučovací rozhovor. Držíš kontext predchádzajúcich správ a zároveň čerstvé dáta z dojo.

KONTEXT Z DOJO:
${contextText}

HISTÓRIA ROZHOVORU:
${historyBlock}

NOVÁ SPRÁVA OD PREDAJCU:
${userMessage}

Odpovedz po slovensky, konkrétne, primerane krátko (zvyčajne 1-3 odseky alebo pár odrážok).
Ak sa pýta na tréning, námietky alebo predaje, opieraj sa o dáta vyššie.
Markdown OK (**tučné**, - odrážky). Bez HTML.`;
}

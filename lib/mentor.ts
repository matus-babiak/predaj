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
  want?: string;
  fear?: string;
  why?: string;
  trust?: number;
  objection?: string;
  plus?: string;
  minus?: string;
  note?: string;
}

export interface BriefingReflectionInput {
  date: string;
  answers: string[];
  focus?: string;
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
            e.want ? `chcel: ${e.want}` : "",
            e.fear ? `bál sa: ${e.fear}` : "",
            e.why ? `prečo: ${e.why}` : "",
            e.trust ? `dôvera ${e.trust}/5` : "",
            e.objection ? `námietka: ${e.objection}` : "",
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
          const body = r.answers.length ? r.answers.join(" / ") : "(prázdna)";
          return `- ${r.date}: ${body}${r.focus ? ` | zajtra: ${r.focus}` : ""}`;
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

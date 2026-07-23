// Stredná úroveň: skladanie promptov pre AI mentora (Gemini) na jednotlivých
// miestach appky. Zatiaľ jeden dotykový bod: Plusy a mínusy.

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

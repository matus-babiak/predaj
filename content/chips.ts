// Predvolené čipy pre rýchly záznam, skutočné potreby a obavy zákazníkov.
// Vlastné čipy si používateľ pridáva v appke; často používané sa radia dopredu.

export const DEFAULT_WANTS = [
  "istotu, že nenaletí",
  "rýchle riešenie",
  "poradiť sa s odborníkom",
  "najlacnejšiu možnosť",
  "kvalitu na dlhé roky",
  "byť vypočutý",
  "pokoj, nech to len funguje",
  "neprísť o dáta",
];

export const DEFAULT_FEARS = [
  "že platí zbytočne veľa",
  "že sa nevyzná a naletí",
  "straty dát a fotiek",
  "že kupuje zlú vec",
  "zlej skúsenosti z minulosti",
  "že to nebude fungovať",
  "že zostane bez telefónu",
  "nátlaku predajcu",
];

export const OUTCOME_LABELS: Record<string, string> = {
  kupil: "Kúpil",
  nekupil: "Nekúpil",
  vrati_sa: "Vráti sa",
  rada: "Len rada",
};

export const PRICE_TIMING_LABELS: Record<string, string> = {
  start: "Cena hneď na začiatku",
  end: "Cena neskôr / na konci",
  avoided: "Cene som sa vyhol",
};

export const OBJECTION_REACTION_LABELS: Record<string, string> = {
  none: "Námietka nepadla",
  asked_benefit: "Opýtal som sa na úžitok",
  gave_in: "Povedal som „Dobre“ / ustúpil som",
  discount: "Dal som zľavu bez dôvodu",
  froze: "Zamrzol som / ticho",
};

export const NEXT_STEP_PLAN_LABELS: Record<string, string> = {
  yes: "Mal som plán kroku",
  no: "Nemal som plán kroku",
  partial: "Plán kroku len čiastočne",
};

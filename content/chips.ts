// Predvolené čipy pre rýchly záznam — skutočné potreby a obavy zákazníkov.
// Vlastné čipy si používateľ pridáva v appke; často používané sa radia dopredu.

export const DEFAULT_WANTS = [
  "istotu, že nenaletí",
  "rýchle riešenie",
  "poradiť sa s odborníkom",
  "najlacnejšiu možnosť",
  "kvalitu na dlhé roky",
  "byť vypočutý",
  "pokoj — nech to len funguje",
  "neprísť o dáta",
];

export const DEFAULT_FEARS = [
  "že platí zbytočne veľa",
  "že sa nevyzná a naletí",
  "straty dát a fotiek",
  "že kupuje zlú vec",
  "zlej skúsenosti z minulosti",
  "že to nebude fungovať",
  "že sa bez počítača zasekne",
  "nátlaku predajcu",
];

export const OUTCOME_LABELS: Record<string, string> = {
  kupil: "Kúpil",
  nekupil: "Nekúpil",
  vrati_sa: "Vráti sa",
  rada: "Len rada",
};

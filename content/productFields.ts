// Štruktúra kartičky produktu: sekcie a polia podľa predajno-psychologického rozboru
// (pochopenie produktu, ideálny zákazník, psychológia nákupu, hodnota, konkurencia,
// komunikácia, námietky, predajný rozhovor, príprava predajcu).
// "aliases" slúžia na rozpoznanie nadpisov pri vkladaní hotového textu analýzy.

import type { ProductCard } from "@/lib/types";

export interface ProductFieldDef {
  key: keyof ProductCard;
  label: string;
  hint: string;
  aliases: string[];
}

export interface ProductSection {
  id: string;
  title: string;
  fields: ProductFieldDef[];
}

export const PRODUCT_SECTIONS: ProductSection[] = [
  {
    id: "pochopenie",
    title: "Pochopenie produktu",
    fields: [
      {
        key: "whatIs",
        label: "Čo je tento produkt?",
        hint: "jednoduchými slovami, čo to je",
        aliases: ["co je tento produkt", "co je produkt"],
      },
      {
        key: "problem",
        label: "Aký problém rieši?",
        hint: "skutočný problém zákazníka, nie funkcia",
        aliases: ["aky problem tento produkt riesi", "aky problem riesi", "hlavny problem", "jeho hlavny problem je"],
      },
      {
        key: "need",
        label: "Akú potrebu alebo túžbu napĺňa?",
        hint: "napr. bezpečnosť, pohodlie, úspora času, status, istota",
        aliases: ["aku potrebu alebo tuzbu naplna", "aku potrebu", "tuzbu naplna"],
      },
      {
        key: "whyExists",
        label: "Prečo tento produkt existuje?",
        hint: "aký dôvod mal niekto na jeho vytvorenie",
        aliases: ["preco tento produkt existuje", "preco existuje"],
      },
    ],
  },
  {
    id: "zakaznik",
    title: "Ideálny zákazník",
    fields: [
      {
        key: "who",
        label: "Komu pomáha najviac?",
        hint: "vek, typ zákazníka, situácia, frustrácie, ciele",
        aliases: ["kto tento produkt potrebuje najviac", "kto ho potrebuje najviac", "komu pomaha najviac", "idealny zakaznik"],
      },
      {
        key: "when",
        label: "V akej situácii ho odporučím?",
        hint: "konkrétny moment, kedy má zmysel ho ponúknuť",
        aliases: ["kedy ho odporucim", "v akej situacii"],
      },
      {
        key: "whenNot",
        label: "Komu ho nepredávať?",
        hint: "komu produkt nepomôže, kedy ho neodporučiť",
        aliases: ["kto tento produkt nepotrebuje", "kto ho nepotrebuje", "komu ho nemal predavat", "kedy ho neodporucim"],
      },
    ],
  },
  {
    id: "psychologia",
    title: "Psychológia nákupu",
    fields: [
      {
        key: "wantBecause",
        label: "Chcem tento produkt, pretože...",
        hint: "dokonči vetu z pohľadu zákazníka",
        aliases: ["chcem tento produkt pretoze", "zakaznik ho kupuje preto ze"],
      },
      {
        key: "beforeFeeling",
        label: "Pred nákupom sa cíti",
        hint: "napr. neisto, frustrovane, nahnevane, stráca čas",
        aliases: ["pred nakupom sa zakaznik citi", "pred nakupom sa citi"],
      },
      {
        key: "afterFeeling",
        label: "Po kúpe sa cíti",
        hint: "napr. pokojnejšie, istejšie, spokojnejšie",
        aliases: ["po kupe sa zakaznik citi", "po kupe sa citi"],
      },
    ],
  },
  {
    id: "hodnota",
    title: "Hodnota produktu",
    fields: [
      {
        key: "benefit",
        label: "Najväčší benefit",
        hint: "skutočný výsledok pre zákazníka, nie vlastnosť",
        aliases: ["najvacsi benefit produktu", "najvacsi benefit"],
      },
      {
        key: "transformation",
        label: "Aká zmena nastane? (pred a po)",
        hint: "stav pred produktom a po ňom",
        aliases: ["aku zmenu produkt sposobi", "pred a po", "pred po"],
      },
      {
        key: "gains",
        label: "Čo zákazník získa?",
        hint: "ušetrený čas, ušetrené peniaze, menej stresu, lepší výsledok, pohodlie",
        aliases: ["co zakaznik ziska", "usetreny cas", "usetrene peniaze"],
      },
    ],
  },
  {
    id: "konkurencia",
    title: "Konkurencia a alternatívy",
    fields: [
      {
        key: "alternatives",
        label: "Aká je alternatíva?",
        hint: "konkurenčný produkt, lacnejšie riešenie, alebo nerobenie nič",
        aliases: ["aka je alternativa k tomuto produktu", "aka je alternativa", "alternativy"],
      },
      {
        key: "whyBetter",
        label: "Prečo je tento produkt lepší?",
        hint: "kvalita, životnosť, výsledok, riziko, pohodlie oproti lacnejšej alternatíve",
        aliases: ["preco je tento produkt lepsi", "preco je tato lepsia"],
      },
      {
        key: "riskIfNot",
        label: "Čo zákazník riskuje, ak si ho nekúpi?",
        hint: "",
        aliases: ["co zakaznik riskuje", "co riskuje ak si produkt nekupi"],
      },
    ],
  },
  {
    id: "komunikacia",
    title: "Predajná komunikácia",
    fields: [
      {
        key: "pitch",
        label: "Jednovetový predajný argument",
        hint: "tento produkt pomáha ... dosiahnuť ... bez toho, aby museli ...",
        aliases: ["jednovetovy predajny argument"],
      },
      {
        key: "mainReasons",
        label: "3 hlavné (racionálne) dôvody na kúpu",
        hint: "",
        aliases: ["3 hlavne dovody na kupu", "hlavne dovody na kupu"],
      },
      {
        key: "emotionalReasons",
        label: "3 najsilnejšie emocionálne dôvody",
        hint: "",
        aliases: ["3 najvacsie emocionalne dovody na kupu", "emocionalne dovody"],
      },
    ],
  },
  {
    id: "namietky",
    title: "Námietky",
    fields: [
      {
        key: "objections",
        label: "Najčastejšie námietky a odpovede",
        hint: "3 typické námietky a ako na ne reagovať",
        aliases: ["najcastejsie namietky zakaznikov", "namietky zakaznikov", "namietka"],
      },
    ],
  },
  {
    id: "rozhovor",
    title: "Predajný rozhovor",
    fields: [
      {
        key: "questions",
        label: "Otázky, ktoré položím zákazníkovi",
        hint: "otázky na potrebu, na zvýšenie hodnoty, na uzavretie predaja",
        aliases: [
          "otazky ktore mam polozit zakaznikovi pred predajom",
          "otazky ktore odhalia potrebu",
          "otazky ktore zvysia hodnotu produktu",
          "otazky ktore pomozu uzavriet predaj",
        ],
      },
    ],
  },
  {
    id: "priprava",
    title: "Praktická príprava predajcu",
    fields: [
      {
        key: "mustUnderstand",
        label: "Čo musím o produkte pochopiť?",
        hint: "aby si ho vedel sebavedomo predávať",
        aliases: ["co musim o tomto produkte pochopit", "co musite o tomto produkte pochopit", "co musite pochopit"],
      },
      {
        key: "commonMistake",
        label: "Akú chybu robia predajcovia?",
        hint: "",
        aliases: ["aku chybu robia predajcovia pri predaji tohto produktu", "najcastejsia chyba predajcov"],
      },
      {
        key: "top1Percent",
        label: "Ako by ho predal top 1 % predajca?",
        hint: "",
        aliases: ["ako by tento produkt predal top 1 percent predajca", "ako by tento produkt predal top"],
      },
    ],
  },
];

export const ALL_PRODUCT_FIELDS: ProductFieldDef[] = PRODUCT_SECTIONS.flatMap((s) => s.fields);

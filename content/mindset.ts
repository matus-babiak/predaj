// Banka myšlienok o predaji a mindsete — na pripomenutie, keď treba nakopnúť motiváciu
// alebo si zoradiť hlavu pred zákazníkom. Vlastné myšlienky si používateľ pridáva v appke.

export interface Thought {
  id: string;
  text: string;
  author?: string;
  category: "mindset" | "vytrvalosť" | "zákazník" | "disciplína" | "rast" | "sebadôvera";
}

export const THOUGHTS: Thought[] = [
  {
    id: "t1",
    text: "Predaj a marketing sú absolútne nevyhnutné, keď chceme prežiť a rásť.",
    category: "mindset",
  },
  {
    id: "t2",
    text: "Nepredávaš produkt — predávaš pocit istoty, že zákazník urobil dobré rozhodnutie.",
    category: "zákazník",
  },
  {
    id: "t3",
    text: "Zákazník si nepamätá, čo si povedal. Pamätá si, ako sa pri tebe cítil.",
    category: "zákazník",
  },
  {
    id: "t4",
    text: "Odmietnutie nie je o tebe. Je to informácia, nie rozsudok.",
    category: "vytrvalosť",
  },
  {
    id: "t5",
    text: "Každé „nie“ ťa posúva bližšie k ďalšiemu „áno“ — ak si z neho vezmeš poučenie.",
    category: "vytrvalosť",
  },
  {
    id: "t6",
    text: "Najlepší predajcovia nehovoria najviac — najviac sa pýtajú a počúvajú.",
    category: "zákazník",
  },
  {
    id: "t7",
    text: "Disciplína je robiť to, čo treba, aj v deň, keď sa ti nechce.",
    category: "disciplína",
  },
  {
    id: "t8",
    text: "Motivácia ťa naštartuje. Návyk ťa udrží v pohybe, keď motivácia zmizne.",
    category: "disciplína",
  },
  {
    id: "t9",
    text: "Dôvera sa buduje pomaly a stratí sa v jednej vete. Zváž každú.",
    category: "zákazník",
  },
  {
    id: "t10",
    text: "Ak sa bojíš pýtať na cenu, zákazník to vycíti a začne sa báť tiež.",
    category: "sebadôvera",
  },
  {
    id: "t11",
    text: "Nikto ti nedôveruje viac, než koľko dôveruješ sebe a tomu, čo predávaš.",
    category: "sebadôvera",
  },
  {
    id: "t12",
    text: "Zlý deň v predaji je dáta, nie identita.",
    category: "mindset",
  },
  {
    id: "t13",
    text: "Ľudia nekupujú od firiem. Kupujú od ľudí, ktorým veria.",
    category: "zákazník",
  },
  {
    id: "t14",
    text: "Kto sa prestane učiť, prestane rásť — aj keď stále „pracuje“.",
    category: "rast",
  },
  {
    id: "t15",
    text: "Príprava pred rozhovorom rozhoduje viac, než talent počas neho.",
    category: "disciplína",
  },
  {
    id: "t16",
    text: "Najdrahšia vec v predaji je zákazník, ktorého si stratil zbytočným nátlakom.",
    category: "zákazník",
  },
  {
    id: "t17",
    text: "Tvoja hodnota pre zákazníka nie je v tom, čo vieš — je v tom, čo mu z toho odovzdáš.",
    category: "mindset",
  },
  {
    id: "t18",
    text: "Konzistentnosť poráža intenzitu. Malý krok každý deň porazí veľký krok raz za mesiac.",
    category: "disciplína",
  },
  {
    id: "t19",
    text: "Kým sa bojíš vyzerať hlúpo pri otázke, zákazník si myslí, že sa o neho nezaujímaš.",
    category: "sebadôvera",
  },
  {
    id: "t20",
    text: "Chyba, ktorú si priznáš a napravíš, buduje dôveru viac než žiadna chyba.",
    category: "rast",
  },
  {
    id: "t21",
    text: "Predávaš dobre vtedy, keď zákazníkovi pomáhaš rozhodnúť sa — nie keď ho presviedčaš.",
    category: "mindset",
  },
  {
    id: "t22",
    text: "Komfortná zóna je pekné miesto, ale nič v nej nerastie.",
    category: "rast",
  },
  {
    id: "t23",
    text: "Ak nevieš, prečo by si to kúpil ty, nečakaj, že to kúpi niekto iný.",
    category: "sebadôvera",
  },
  {
    id: "t24",
    text: "Vytrvalosť je schopnosť pokračovať dlho po tom, čo sa nadšenie vytratilo.",
    category: "vytrvalosť",
  },
];

export const THOUGHT_CATEGORIES = [
  { id: "mindset", label: "Mindset" },
  { id: "vytrvalosť", label: "Vytrvalosť" },
  { id: "zákazník", label: "Zákazník" },
  { id: "disciplína", label: "Disciplína" },
  { id: "rast", label: "Rast" },
  { id: "sebadôvera", label: "Sebadôvera" },
] as const;

// Banka myšlienok o predaji a mindsete: skutočné citáty od uznávaných predajcov,
// obchodníkov a autorov (Zig Ziglar, Brian Tracy, Jeffrey Gitomer, Dale Carnegie, Jim Rohn,
// Napoleon Hill, Grant Cardone a ďalší), voľne preložené do slovenčiny.
// Vlastné myšlienky si používateľ pridáva priamo v appke, v sekcii „Moje myšlienky“.

export interface Thought {
  id: string;
  text: string;
  author?: string;
  category: "mindset" | "vytrvalosť" | "zákazník" | "disciplína" | "rast" | "sebadôvera";
}

export const THOUGHTS: Thought[] = [
  // --- Mindset ---
  {
    id: "t1",
    text: "Tvoj postoj, nie tvoj talent, určí, ako vysoko sa dostaneš.",
    author: "Zig Ziglar",
    category: "mindset",
  },
  {
    id: "t2",
    text: "Predaj je v podstate prenos pocitov.",
    author: "Zig Ziglar",
    category: "mindset",
  },
  {
    id: "t3",
    text: "Ľudia nekupujú z logických dôvodov. Kupujú z emocionálnych dôvodov.",
    author: "Zig Ziglar",
    category: "mindset",
  },
  {
    id: "t4",
    text: "Každý predaj má päť základných prekážok: žiadna potreba, žiadne peniaze, žiadny spech, žiadna túžba, žiadna dôvera.",
    author: "Zig Ziglar",
    category: "mindset",
  },
  {
    id: "t5",
    text: "Úspech v predaji je z 80 percent postoj a z 20 percent schopnosti.",
    author: "Brian Tracy",
    category: "mindset",
  },
  {
    id: "t6",
    text: "Nečakaj na správnu chvíľu, tá nikdy nepríde. Začni tam, kde stojíš, a použi nástroje, ktoré máš po ruke.",
    author: "Napoleon Hill",
    category: "mindset",
  },
  {
    id: "t7",
    text: "Svet si vždy nájde miesto pre človeka, ktorého slová a činy ukazujú, že vie, kam smeruje.",
    author: "Napoleon Hill",
    category: "mindset",
  },
  {
    id: "t8",
    text: "Ľudia nemajú radi, keď im niekto predáva. Ale milujú nakupovať.",
    author: "Jeffrey Gitomer",
    category: "mindset",
  },
  {
    id: "t9",
    text: "Buď riadiš svoj deň, alebo deň riadi teba.",
    author: "Jim Rohn",
    category: "mindset",
  },
  {
    id: "t10",
    text: "Čokoľvek si dokáže myseľ predstaviť a uveriť tomu, to dokáže aj dosiahnuť.",
    author: "Napoleon Hill",
    category: "mindset",
  },
  {
    id: "t11",
    text: "Staneš sa tým, na čo najviac myslíš.",
    author: "Earl Nightingale",
    category: "mindset",
  },
  {
    id: "t12",
    text: "Ak sa nevidíš ako víťaz, nemôžeš hrať ako víťaz.",
    author: "Zig Ziglar",
    category: "mindset",
  },
  {
    id: "t13",
    text: "Narodil si sa, aby si vyhrával. Ale aby si sa víťazom aj stal, musíš na výhru myslieť, pripraviť sa na ňu a očakávať ju.",
    author: "Zig Ziglar",
    category: "mindset",
  },

  // --- Vytrvalosť ---
  {
    id: "t14",
    text: "Pád je súčasť života. Vstať znova je súčasť života úspešného človeka.",
    author: "Zig Ziglar",
    category: "vytrvalosť",
  },
  {
    id: "t15",
    text: "Nemusíš byť skvelý, aby si začal. Musíš začať, aby si sa stal skvelým.",
    author: "Zig Ziglar",
    category: "vytrvalosť",
  },
  {
    id: "t16",
    text: "Prichádzame o sto percent obchodov, o ktoré sa nepýtame.",
    author: "Zig Ziglar",
    category: "vytrvalosť",
  },
  {
    id: "t17",
    text: "Odmietnutia ti umožňujú presmerovať energiu tam, kde to naozaj funguje.",
    author: "Brian Tracy",
    category: "vytrvalosť",
  },
  {
    id: "t18",
    text: "Najistejšia cesta k úspechu je skúsiť to ešte raz.",
    author: "Brian Tracy",
    category: "vytrvalosť",
  },
  {
    id: "t19",
    text: "Nemám žiadny zázračný vzorec. Tvrdo pracujem a nevzdávam sa.",
    author: "Jeffrey Gitomer",
    category: "vytrvalosť",
  },
  {
    id: "t20",
    text: "Úspech sa buduje z neúspechov. Sklamanie a zlyhanie sú najistejšie odrazové mostíky k úspechu.",
    author: "Dale Carnegie",
    category: "vytrvalosť",
  },
  {
    id: "t21",
    text: "Nič na svete nenahradí vytrvalosť. Talent ju nenahradí, nič nie je bežnejšie než neúspešní ľudia s talentom. Jedine vytrvalosť a odhodlanie sú všemocné.",
    author: "Calvin Coolidge",
    category: "vytrvalosť",
  },
  {
    id: "t22",
    text: "K úspechu som sa prepracoval cez množstvo zlyhaní.",
    author: "Thomas Edison",
    category: "vytrvalosť",
  },
  {
    id: "t23",
    text: "Ak prechádzaš peklom, pokračuj ďalej.",
    author: "Winston Churchill",
    category: "vytrvalosť",
  },
  {
    id: "t24",
    text: "Vydržím, kým neuspejem.",
    author: "Og Mandino",
    category: "vytrvalosť",
  },
  {
    id: "t25",
    text: "Nikdy sa nehanbi za to, že si to skúsil a zlyhal. Hanbi sa za to, že si to nikdy neskúsil.",
    author: "Og Mandino",
    category: "vytrvalosť",
  },
  {
    id: "t26",
    text: "Väčšinu dôležitých vecí na svete dosiahli ľudia, ktorí sa snažili ďalej aj vtedy, keď sa zdalo, že niet žiadnej nádeje.",
    author: "Dale Carnegie",
    category: "vytrvalosť",
  },

  // --- Zákazník ---
  {
    id: "t27",
    text: "Môžeš mať v živote všetko, čo chceš, ak pomôžeš dostatku iných ľudí získať to, čo chcú oni.",
    author: "Zig Ziglar",
    category: "zákazník",
  },
  {
    id: "t28",
    text: "Keď sa zákazník sťažuje, mal by si sa tešiť. Je to veľká príležitosť na ďalší obchod.",
    author: "Zig Ziglar",
    category: "zákazník",
  },
  {
    id: "t29",
    text: "Dobré otázky sa rýchlo dostanú k jadru problému a zákazník nemá pocit, že ho niekto tlačí.",
    author: "Jeffrey Gitomer",
    category: "zákazník",
  },
  {
    id: "t30",
    text: "Skvelí predajcovia budujú vzťahy, prinášajú hodnotu a pomáhajú zákazníkom vyhrávať.",
    author: "Jeffrey Gitomer",
    category: "zákazník",
  },
  {
    id: "t31",
    text: "Kľúč k majstrovstvu v predaji je preklopiť vety o sebe na vety o zákazníkovi.",
    author: "Jeffrey Gitomer",
    category: "zákazník",
  },
  {
    id: "t32",
    text: "Jediný spôsob, ako niekoho prinútiť niečo urobiť, je dať mu to, čo chce.",
    author: "Dale Carnegie",
    category: "zákazník",
  },
  {
    id: "t33",
    text: "Rozprávaj sa s niekým o ňom samotnom a bude ťa počúvať celé hodiny.",
    author: "Dale Carnegie",
    category: "zákazník",
  },
  {
    id: "t34",
    text: "Námietky ber ako žiadosť o ďalšie informácie.",
    author: "Brian Tracy",
    category: "zákazník",
  },
  {
    id: "t35",
    text: "Existuje len jeden šéf, zákazník. Ten môže vyhodiť každého vo firme, od predsedu nižšie, jednoducho tým, že minie peniaze inde.",
    author: "Sam Walton",
    category: "zákazník",
  },
  {
    id: "t36",
    text: "Dostaň sa k svojim zákazníkom bližšie než kedykoľvek predtým. Tak blízko, že im povieš, čo potrebujú, skôr než si to sami uvedomia.",
    author: "Steve Jobs",
    category: "zákazník",
  },
  {
    id: "t37",
    text: "Na svojich zákazníkov sa pozeraj ako na pozvaných hostí na večierku, kde si ty hostiteľ.",
    author: "Jeff Bezos",
    category: "zákazník",
  },
  {
    id: "t38",
    text: "Keď prestaneš hovoriť, stratil si zákazníka. Keď sa otočíš chrbtom, stratil si ho úplne.",
    author: "Estée Lauder",
    category: "zákazník",
  },
  {
    id: "t39",
    text: "Cieľom firmy je mať zákaznícky servis, ktorý nie je len najlepší, ale legendárny.",
    author: "Sam Walton",
    category: "zákazník",
  },

  // --- Disciplína ---
  {
    id: "t40",
    text: "Osobná disciplína, keď sa stane spôsobom života v osobnej, rodinnej aj pracovnej oblasti, ti umožní dosiahnuť neuveriteľné veci.",
    author: "Zig Ziglar",
    category: "disciplína",
  },
  {
    id: "t41",
    text: "Opakovanie je matkou učenia, otcom činu, a preto je architektom úspechu.",
    author: "Zig Ziglar",
    category: "disciplína",
  },
  {
    id: "t42",
    text: "Disciplína je most medzi cieľmi a ich dosiahnutím.",
    author: "Jim Rohn",
    category: "disciplína",
  },
  {
    id: "t43",
    text: "Nácvik má rovnakú hodnotu ako predaj. Predaj ťa uživí, zručnosť ti prinesie majetok.",
    author: "Jim Rohn",
    category: "disciplína",
  },
  {
    id: "t44",
    text: "Pracuj na sebe tvrdšie než na svojej práci.",
    author: "Jim Rohn",
    category: "disciplína",
  },
  {
    id: "t45",
    text: "Rozdiel medzi úspešnými a neúspešnými ľuďmi je v tom, že úspešní hľadajú problémy, ktoré môžu vyriešiť. Neúspešní sa im snažia vyhnúť.",
    author: "Grant Cardone",
    category: "disciplína",
  },
  {
    id: "t46",
    text: "Každý deň urob niečo pre zlepšenie svojich kľúčových zručností.",
    author: "Brian Tracy",
    category: "disciplína",
  },
  {
    id: "t47",
    text: "Disciplína znamená ukázať sa bez ohľadu na okolnosti. Začína pri maličkostiach, ako kedy spíš, kedy vstávaš a čo urobíš ako prvé po prebudení.",
    author: "Grant Cardone",
    category: "disciplína",
  },
  {
    id: "t48",
    text: "V živote nikdy nemôžeš urobiť príliš veľa akcie. Môžeš urobiť len príliš málo.",
    author: "Grant Cardone",
    category: "disciplína",
  },
  {
    id: "t49",
    text: "Tri veľké predpoklady na dosiahnutie čohokoľvek hodnotného sú tvrdá práca, vytrvalosť a zdravý rozum.",
    author: "Thomas Edison",
    category: "disciplína",
  },
  {
    id: "t50",
    text: "Každé ráno privítaj s úsmevom. Buď sám sebe hýbateľom a nech prvá hodina dňa určí tému úspechu, ktorá sa bude niesť celým dňom.",
    author: "Og Mandino",
    category: "disciplína",
  },
  {
    id: "t51",
    text: "Ak každý deň venuješ hodinu naviac štúdiu vo svojom odbore, do piatich rokov budeš jeho národným expertom.",
    author: "Earl Nightingale",
    category: "disciplína",
  },
  {
    id: "t52",
    text: "Motivácia nevydrží dlho. Ale ani sprchovanie, preto sa odporúča denne.",
    author: "Zig Ziglar",
    category: "disciplína",
  },

  // --- Rast ---
  {
    id: "t53",
    text: "Osobný rozvoj je nekonečná šanca zlepšiť sa a zároveň prilákať príležitosti a ovplyvniť ostatných.",
    author: "Jim Rohn",
    category: "rast",
  },
  {
    id: "t54",
    text: "Zo všetkého, čo môže ovplyvniť tvoju budúcnosť, je osobný rast najdôležitejší. Môžeme hovoriť o raste predaja, zisku či majetku, no bez osobného rastu sa to pravdepodobne nestane.",
    author: "Jim Rohn",
    category: "rast",
  },
  {
    id: "t55",
    text: "Neželaj si, aby to bolo jednoduchšie. Želaj si byť lepší. Neželaj si menej problémov, želaj si viac zručností.",
    author: "Jim Rohn",
    category: "rast",
  },
  {
    id: "t56",
    text: "Úspech si nehľadáš. Priťahuješ si ho tým, kým sa staneš.",
    author: "Jim Rohn",
    category: "rast",
  },
  {
    id: "t57",
    text: "Najväčší dar, ktorý môžeš niekomu dať, je tvoj vlastný osobný rozvoj.",
    author: "Jim Rohn",
    category: "rast",
  },
  {
    id: "t58",
    text: "Motivácia ťa naštartuje. Návyk ťa udrží v pohybe.",
    author: "Jim Rohn",
    category: "rast",
  },
  {
    id: "t59",
    text: "Ak sa nechceš učiť, nikto ti nepomôže. Ak si odhodlaný učiť sa, nikto ťa nezastaví.",
    author: "Zig Ziglar",
    category: "rast",
  },
  {
    id: "t60",
    text: "Život je trieda. Do popredia sa dostanú len tí, ktorí sú ochotní učiť sa celý život.",
    author: "Zig Ziglar",
    category: "rast",
  },
  {
    id: "t61",
    text: "Si tam, kde si, a taký, aký si, kvôli tomu, čo si vpustil do svojej mysle. Zmeníš to tak, že zmeníš, čo do nej vpúšťaš.",
    author: "Zig Ziglar",
    category: "rast",
  },
  {
    id: "t62",
    text: "Ak sa z prehry poučíš, v skutočnosti si neprehral.",
    author: "Zig Ziglar",
    category: "rast",
  },
  {
    id: "t63",
    text: "Snívaj o tom, čo si trúfaš snívať. Choď tam, kam chceš ísť. Buď tým, kým chceš byť.",
    author: "Earl Nightingale",
    category: "rast",
  },
  {
    id: "t64",
    text: "Viac priateľov si získaš za dva mesiace tým, že prejavíš záujem o iných, než za dva roky snahy, aby sa iní zaujímali o teba.",
    author: "Dale Carnegie",
    category: "rast",
  },
  {
    id: "t65",
    text: "Každý človek má moc zmeniť svoju hmotnú či finančnú situáciu tým, že najprv zmení povahu svojich presvedčení.",
    author: "Napoleon Hill",
    category: "rast",
  },

  // --- Sebadôvera ---
  {
    id: "t66",
    text: "Nečinnosť plodí pochybnosti a strach. Konanie plodí sebadôveru a odvahu. Ak chceš prekonať strach, nesedávaj doma a nepremýšľaj o ňom. Choď von a daj sa do práce.",
    author: "Dale Carnegie",
    category: "sebadôvera",
  },
  {
    id: "t67",
    text: "Sebadôveru buduješ tým, že začneš, nie tým, že čakáš.",
    author: "Zig Ziglar",
    category: "sebadôvera",
  },
  {
    id: "t68",
    text: "Príprava plodí sebadôveru, sebadôvera vytvára príležitosť.",
    author: "Zig Ziglar",
    category: "sebadôvera",
  },
  {
    id: "t69",
    text: "Sebadôvera znamená ísť po Moby Dickovi na veslici a vziať si so sebou tatársku omáčku.",
    author: "Zig Ziglar",
    category: "sebadôvera",
  },
  {
    id: "t70",
    text: "Sebadôvera pochádza z vedomia, že si dnes urobil, čo si mohol najlepšie.",
    author: "Zig Ziglar",
    category: "sebadôvera",
  },
  {
    id: "t71",
    text: "Viera v seba samého je prvý krok k úspechu.",
    author: "Zig Ziglar",
    category: "sebadôvera",
  },
  {
    id: "t72",
    text: "Budeš mizerným niekým iným, ale si tou najlepšou verziou seba, aká existuje. Si jediný, kto dokáže využiť tvoje schopnosti.",
    author: "Zig Ziglar",
    category: "sebadôvera",
  },
  {
    id: "t73",
    text: "Kvalitný výkon začína pozitívnym postojom.",
    author: "Jeffrey Gitomer",
    category: "sebadôvera",
  },
  {
    id: "t74",
    text: "Ak veríš v to, čo robíš, nedovoľ ničomu, aby ťa v tej práci zastavilo.",
    author: "Dale Carnegie",
    category: "sebadôvera",
  },
  {
    id: "t75",
    text: "Čokoľvek očakávaš so sebadôverou, sa stáva tvojím vlastným naplneným proroctvom.",
    author: "Brian Tracy",
    category: "sebadôvera",
  },
  {
    id: "t76",
    text: "Sebaobraz, ktorý o sebe máš, sa vždy prejaví v tom, ako sa správaš.",
    author: "Brian Tracy",
    category: "sebadôvera",
  },
  {
    id: "t77",
    text: "Sebadôvera je návyk, ktorý sa dá rozvíjať tak, že sa začneš správať, akoby si ju už mal.",
    author: "Brian Tracy",
    category: "sebadôvera",
  },
  {
    id: "t78",
    text: "Musíš si byť istý sám sebou, skôr než môžeš vyhrať akúkoľvek cenu.",
    author: "Napoleon Hill",
    category: "sebadôvera",
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

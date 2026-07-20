// 12-týždňový program „Sales Dojo"
// Postavené na mentorskom pláne: psychológia predaja, dôvera a rozhodovanie
// zákazníkov — nie skripty naspamäť.

export interface Week {
  id: string;
  num: number; // 1–12
  phase: number; // 1–6
  phaseTitle: string;
  title: string;
  lesson: string[]; // odseky mikro-lekcie (**text** = tučné)
  task: string; // denná úloha na zmenu
  reflection: string[]; // večerné otázky špecifické pre tento týždeň
  minDays: number; // koľko dní so záznamom treba na odomknutie ďalšieho týždňa
}

export const PHASES = [
  { num: 1, title: "Základy", goal: "Pochopiť, čo je predaj a ako sa ľudia rozhodujú." },
  { num: 2, title: "Diagnostika", goal: "Naučiť sa klásť otázky a počúvať." },
  { num: 3, title: "Produkt", goal: "Poznať produkty ako riešenia, nie ako položky." },
  { num: 4, title: "Námietky", goal: "Zvládnuť princíp uznaj → zisti → odpovedz." },
  { num: 5, title: "Komunikácia", goal: "Hlas, tempo, jednoduchosť, pokoj." },
  { num: 6, title: "Analýza", goal: "Zlepšovať sa podľa dát, nie podľa pocitov." },
];

export const WEEKS: Week[] = [
  {
    id: "w1",
    num: 1,
    phase: 1,
    phaseTitle: "Základy",
    title: "Prečo ľudia kupujú",
    lesson: [
      "Nikto nekupuje produkt. Každý kupuje **zmenu svojho stavu**: z neistoty do istoty, z pomalého počítača do plynulej práce, zo strachu o dáta do pokoja. Produkt je len nástroj, ktorým sa tá zmena dosiahne.",
      "Preto prvá otázka profesionálneho predajcu nikdy nie je „čo vám mám predať?“, ale „**čo sa tento človek snaží vyriešiť?**“ Zákazník, ktorý pýta nový notebook, možno v skutočnosti rieši to, že sa hanbí na porade, keď mu počítač 5 minút štartuje.",
      "Rozhodovanie funguje takto: rozhodnutie vzniká **emočne** (chcem sa cítiť bezpečne, chcem mať pokoj, nechcem vyzerať hlúpo) a až potom si ho človek **racionálne zdôvodní** (parametre, cena, recenzie). Kto predáva len parametrami, rozpráva sa s tou druhou, neskoršou časťou rozhodnutia.",
      "Kľúčový rozdiel tohto týždňa: **vlastnosť vs. hodnota.** Vlastnosť: „má 512 GB SSD.“ Hodnota: „zapne sa za pár sekúnd a už nikdy nebudete čakať.“ Vlastnosť je fakt o produkte. Hodnota je zmena v živote zákazníka. Ľudia platia za hodnotu.",
      "Tento týždeň nič nepredávaš inak. Len **pozoruješ**. Tvojou úlohou je začať vidieť za produktmi potreby a za otázkami obavy.",
    ],
    task:
      "Po každom zákazníkovi si v duchu (a do rýchleho záznamu) odpovedz na 3 otázky: Čo podľa mňa naozaj chcel? Čoho sa bál? Prečo kúpil alebo nekúpil?",
    reflection: [
      "Ktorý dnešný zákazník kupoval najviac „emočne“? Podľa čoho som to spoznal?",
      "Pri ktorom produkte som dnes hovoril o vlastnostiach namiesto hodnoty?",
      "Čo dnes zákazníci najčastejšie naozaj chceli (nie aký produkt, ale akú zmenu)?",
    ],
    minDays: 4,
  },
  {
    id: "w2",
    num: 2,
    phase: 1,
    phaseTitle: "Základy",
    title: "Dôvera a prečo vznikajú námietky",
    lesson: [
      "Dôvera nie je pocit „je sympatický“. Dôvera je odpoveď zákazníka na tri tiché otázky: **Rozumie tomu?** (kompetencia) **Hovorí mi pravdu?** (poctivosť) **Je na mojej strane, alebo na strane svojej tržby?** (zámer). Ak čo i len jedna odpoveď je „neviem“, zákazník váha.",
      "Najsilnejší nástroj budovania dôvery v predajni je paradoxne **odhováranie**: „Toto by som vám nebral, na to, čo robíte, stačí lacnejší.“ Zákazník si zapamätá, že si zarobil menej, aby jemu bolo lepšie — a nabudúce príde rovno za tebou.",
      "A teraz námietky. Námietka **nie je útok a nie je odmietnutie**. Je to signál, že niečo chýba: informácia („nerozumiem, za čo platím“), dôvera („neviem, či mi neklameš“) alebo odvaha („bojím sa, že spravím zlé rozhodnutie“). Zákazník, ktorý namieta, sa stále rozhoduje. Ten, kto sa už rozhodol odísť, väčšinou nenamieta — len odíde.",
      "Preto sa profesionál námietkam **teší**: sú to súradnice, kde presne treba pomôcť. „Je to drahé“ najčastejšie znamená „nevidím, prečo to za tú cenu stojí“ — a to sa dá vyriešiť rozhovorom, nie zľavou.",
      "Tento týždeň pokračuješ v troch otázkach z minulého týždňa a pridávaš pozornosť na obavy: pri každej námietke si polož otázku **„čoho sa tento človek asi bojí?“**",
    ],
    task:
      "Pri každej námietke, ktorá dnes padne, si najprv v duchu odpovedz „čoho sa asi bojí?“ — a až potom reaguj. Námietku si zapíš do rýchleho záznamu.",
    reflection: [
      "Ktorému zákazníkovi som dnes najviac pomohol vybudovať dôveru? Čím?",
      "Aká námietka dnes padla a čo za ňou podľa mňa naozaj bolo?",
      "Odporučil som dnes niekomu lacnejšie/menšie riešenie, hoci som mohol predať drahšie?",
    ],
    minDays: 4,
  },
  {
    id: "w3",
    num: 3,
    phase: 2,
    phaseTitle: "Diagnostika",
    title: "Otvorené otázky",
    lesson: [
      "Lekár, ktorý predpíše liek bez vyšetrenia, je šarlatán. Predajca, ktorý odporučí produkt bez otázok, je ten istý prípad. **Najdôležitejšia zručnosť predajcu nie je hovoriť — je pýtať sa.**",
      "Zatvorená otázka sa dá odbiť jedným slovom: „Chcete radšej SSD?“ — „Neviem.“ Otvorená otázka otvára príbeh: „**Na čo počítač najviac používate?**“ — a zákazník ti sám povie, čo mu máš predať.",
      "Zlaté otvorené otázky do predajne a servisu: „Na čo to najviac používate?“ • „Čo vám na tom súčasnom najviac prekáža?“ • „Ako si predstavujete, že to bude fungovať?“ • „Čo sa stalo, keď to prestalo ísť?“ • „Čo je pre vás dôležitejšie — cena, alebo aby vydržal?“",
      "Prečo to funguje: kto kladie otázky, **vedie rozhovor**. A zákazník, ktorý rozpráva, cíti, že mu rozumieš — dôvera z 2. týždňa rastie sama, bez jediného argumentu.",
      "Pozor na pascu: nepýtaj sa ako vypočúvač. Otázka má znieť ako záujem o človeka, nie ako formulár. Jedna dobrá otázka a **ticho**, kým dopovie, je viac než päť otázok za sebou.",
    ],
    task:
      "Dnes povedz o 30 % menej a pýtaj sa o 30 % viac. V každom rozhovore polož aspoň 2 otvorené otázky skôr, než čokoľvek odporučíš.",
    reflection: [
      "Ktorá moja dnešná otázka otvorila najviac? Čo mi zákazník vďaka nej prezradil?",
      "V ktorom rozhovore som skočil rovno na odporúčanie bez otázok? Čo sa stalo?",
      "Akú otázku chcem zajtra vyskúšať?",
    ],
    minDays: 4,
  },
  {
    id: "w4",
    num: 4,
    phase: 2,
    phaseTitle: "Diagnostika",
    title: "Aktívne počúvanie a skutočný problém",
    lesson: [
      "Počúvať neznamená čakať, kým na teba príde rad hovoriť. **Aktívne počúvanie** znamená, že zákazník z tvojej reakcie spozná, že si ho naozaj počul.",
      "Tri nástroje: **Parafráza** — zopakuj vlastnými slovami: „Takže ak dobre rozumiem, potrebujete, aby zvládol účtovníctvo a občas film, a hlavne nech vydrží.“ **Doplňujúca otázka** — „vydrží — myslíte batériu, alebo celkovú životnosť?“ **Ticho** — po otázke vydrž 2–3 sekundy. Najdôležitejšie veci ľudia povedia až po pauze.",
      "Skutočný problém býva **o vrstvu hlbšie**, než prvá veta zákazníka. „Chcem antivírus“ môže znamenať „minule mi prišiel podozrivý mail a odvtedy sa bojím internetbankingu.“ Kto rieši prvú vetu, predá krabicu. Kto nájde skutočný problém, vyrieši človeka — a získa zákazníka na roky.",
      "Overovacia otázka na skutočný problém: **„Čo sa stalo, že ste sa rozhodli to riešiť práve teraz?“** Odpoveď na ňu je takmer vždy dôležitejšia než všetko, čo zaznelo predtým.",
      "Tento týždeň spájaš minulý a tento: otázky otvárajú, počúvanie prehlbuje. Cieľ: aby zákazník aspoň raz povedal „presne tak!“",
    ],
    task:
      "V každom rozhovore najprv parafrázuj („takže ak dobre rozumiem…“) a až potom odporuč. Aspoň raz denne použi otázku „čo sa stalo, že to riešite práve teraz?“",
    reflection: [
      "Kedy dnes zákazník povedal „presne tak“ alebo prikývol na moju parafrázu?",
      "Našiel som dnes u niekoho skutočný problém, ktorý bol iný než jeho prvá veta?",
      "Kde som dnes skočil do reči alebo nevydržal ticho?",
    ],
    minDays: 4,
  },
  {
    id: "w5",
    num: 5,
    phase: 3,
    phaseTitle: "Produkt",
    title: "Produkt ako riešenie",
    lesson: [
      "Teraz, keď vieš počúvať, potrebuješ mať čo ponúknuť. Znalosť produktu pre predajcu neznamená vedieť parametre naspamäť — znamená vedieť **komu a kedy produkt pomôže**.",
      "Pri každom produkte a službe v PCexpres by si mal vedieť odpovedať na 5 otázok: **Komu pomáha? Kedy ho odporučím? Kedy ho neodporučím? Aké má alternatívy? Aké sú najčastejšie námietky?** Ak niektorú nevieš, práve si našiel svoju medzeru vo vedomostiach.",
      "Na toto slúži modul **Produkty** v tejto appke: každý deň vyplň kartičku jedného-dvoch produktov či služieb (výmena disku za SSD, čistenie notebooku, inštalácia Windows, repasovaný počítač, rozšírenie RAM…). O dva týždne budeš mať vlastnú znalostnú mapu predajne.",
      "Trik na hodnotu z 1. týždňa: ku každej vlastnosti si dopíš „**…a to znamená, že…**“. „SSD má rýchle čítanie dát… a to znamená, že počítač naštartuje skôr, než si zoberiete kávu.“ Ak vetu nevieš dokončiť, vlastnosť pre zákazníka nič neznamená — tak ju ani nespomínaj.",
      "Odpoveď „neviem, zistím vám to“ nie je hanba — je to budovanie dôvery, ak po nej naozaj príde odpoveď. Hanba je vymýšľať si.",
    ],
    task:
      "Každý deň vyplň v module Produkty kartičku 1–2 produktov alebo služieb. Pri zákazníkoch skús aspoň raz použiť „…a to znamená, že…“.",
    reflection: [
      "Na ktorú otázku o produkte som dnes nevedel odpovedať? (Doplň si kartičku.)",
      "Ktorú vlastnosť som dnes preložil do hodnoty a ako to zabralo?",
      "Ktorý produkt si zaslúži kartičku ako ďalší?",
    ],
    minDays: 4,
  },
  {
    id: "w6",
    num: 6,
    phase: 3,
    phaseTitle: "Produkt",
    title: "Alternatívy a poctivé odporúčanie",
    lesson: [
      "Profesionál nepozná len produkt — pozná **mapu alternatív**: čo je o stupeň lacnejšie, čo o stupeň lepšie, kedy sa oprava neoplatí, kedy je repas rozumnejší než nový kus.",
      "Sila alternatív: keď vieš ponúknuť tri cesty („opravíme za X, repasovaný za Y, nový za Z — a pre vaše použitie by som šiel do…“), zákazník sa nerozhoduje **či** kúpi, ale **ktorú cestu** si vyberie. A hlavne cíti, že mu dávaš na výber, nie že ho tlačíš.",
      "**Kedy neodporučiť** je najcennejšia kolónka kartičky. „Túto hru vaša grafika neutiahne, neberte to“ ťa krátkodobo stojí predaj a dlhodobo ti vyrába verného zákazníka. Predajňa žije z ľudí, ktorí sa vracajú.",
      "Poctivé odporúčanie má vzorec: **„Pre vás by som vybral X, pretože [jeho situácia]. Y by som nebral, pretože [jeho situácia].“** Vždy zdôvodnené jeho svetom, nie parametrami.",
      "Tento týždeň dokončuješ produktové kartičky — zameraj sa na kolónky „kedy neodporučím“ a „alternatívy“. To je rozdiel medzi predavačom a poradcom.",
    ],
    task:
      "Pokračuj v kartičkách (1–2 denne). Aspoň raz dnes ponúkni zákazníkovi vedome alternatívy („máte tri cesty…“) alebo poctivo odhovor od nevhodnej voľby.",
    reflection: [
      "Komu som dnes ponúkol alternatívy a ako sa rozhodoval?",
      "Odhovoril som dnes niekoho od niečoho? Ako reagoval?",
      "Pri ktorom produkte si stále nie som istý, kedy ho NEodporučiť?",
    ],
    minDays: 4,
  },
  {
    id: "w7",
    num: 7,
    phase: 4,
    phaseTitle: "Námietky",
    title: "Princíp: uznaj → zisti → odpovedz",
    lesson: [
      "Na námietky neexistuje kúzelná veta. Existuje **princíp v troch krokoch** — a ten funguje na každú námietku, aj na takú, akú si ešte nepočul.",
      "**1. Uznaj.** Nie súhlas — uznanie: „Rozumiem, cena je dôležitá.“ / „Chápem, to by mrzelo každého.“ Uznanie vypne obranu. Kým sa zákazník cíti napádaný, nepočuje žiadny argument, ani ten najlepší.",
      "**2. Zisti.** Námietka je nadpis, nie obsah. Zisti, čo je pod ňou: „Drahé v porovnaní s čím?“ / „Čo presne vás na tom znepokojuje?“ / „Keby cena nebola téma, brali by ste to?“ Posledná otázka je diagnostický zázrak: oddelí cenovú námietku od skrytej inej.",
      "**3. Odpovedz.** Až teraz, keď vieš, na čo naozaj odpovedáš. Odpoveď mieri na skutočný dôvod, nie na nadpis — a často je to hodnota z 1. týždňa, alternatíva zo 6. týždňa alebo jednoduché doplnenie informácie.",
      "Najčastejšia chyba: skočiť rovno na krok 3. Vyzerá to akčne, ale strieľaš naslepo. **Poradie krokov je celý trik.** Tento týždeň otvor každý deň modul Námietky a natrénuj aspoň jednu.",
    ],
    task:
      "Každý deň natrénuj v simulátore aspoň 1 námietku. Pri reálnej námietke vedome dodrž poradie: najprv uznaj, potom sa opýtaj, až potom odpovedz.",
    reflection: [
      "Pri ktorej dnešnej námietke som dodržal poradie uznaj → zisti → odpovedz? Čo sa stalo?",
      "Kde som skočil rovno na odpoveď a ako to dopadlo?",
      "Akú otázku „zisti“ chcem mať zajtra pripravenú?",
    ],
    minDays: 4,
  },
  {
    id: "w8",
    num: 8,
    phase: 4,
    phaseTitle: "Námietky",
    title: "Čo zákazník naozaj myslí",
    lesson: [
      "Rovnaká veta, tri rôzne významy. „Je to drahé“ môže znamenať: „nemám toľko peňazí“ (rozpočet), „nevidím, za čo platím“ (hodnota) alebo „inde som to videl lacnejšie“ (porovnanie). **Každý význam má inú správnu odpoveď** — preto krok „zisti“ rozhoduje.",
      "Rozpočet riešiš alternatívou („poďme nájsť niečo v sume, s ktorou rátate“). Hodnotu riešiš prekladom vlastností na úžitok. Porovnanie riešiš tým, čo je v cene navyše: záruka na mieste, osobná pomoc, servis, poradenstvo — teda to, čo e-shop nedá.",
      "„Rozmyslím si to“ je zriedka o čase. Väčšinou znamená: „mám obavu, ktorú som ti nepovedal.“ Jemná sonda: **„Jasné, také rozhodnutie chce čas. Čo vám v tom najviac vŕta hlavou?“** Polovica ľudí ti povie skutočný dôvod — a ten sa dá riešiť hneď.",
      "Databáza tvojich súbojov: v module Námietky sa ti ukladá, ktoré námietky ti idú a ktoré ťa potápajú. Slabé sa vracajú častejšie — presne ako v posilňovni trénuješ slabšiu partiu viac.",
      "Tento týždeň si pri každej reálnej námietke zapíš do denníka, **čo ňou zákazník podľa teba naozaj myslel**. To je celá úloha — a je to najrýchlejšia cesta k majstrovstvu v námietkach.",
    ],
    task:
      "Každý deň si vezmi jednu námietku (reálnu alebo zo simulátora) a rozober si ju: čo tým zákazník pravdepodobne myslel? Zapíš to.",
    reflection: [
      "Aká námietka dnes padla a ktorý z významov za ňou bol (rozpočet / hodnota / porovnanie / obava)?",
      "Použil som dnes sondu na „rozmyslím si to“? Čo sa ukázalo?",
      "Ktorá námietka mi ide najhoršie? (Pozri si štatistiku v module Námietky.)",
    ],
    minDays: 4,
  },
  {
    id: "w9",
    num: 9,
    phase: 5,
    phaseTitle: "Komunikácia",
    title: "Pokoj, hlas a tempo",
    lesson: [
      "Obsah máš. Teraz forma — pretože zákazník najprv vníma **ako** hovoríš, a až potom **čo** hovoríš. Neistý hlas dokáže pochovať aj perfektný argument.",
      "**Tempo:** nervozita zrýchľuje reč. Rýchla reč znie ako neistota alebo nátlak — oboje zabíja dôveru. Vedome spomaľ, zvlášť pri cene. Cena povedaná pokojne a pomaly znie férovo. Cena vyhŕknutá znie ako zlodejina.",
      "**Pauza:** po dôležitej vete a po otázke — ticho. Dve sekundy ticha po „ktorú cestu by ste si vybrali?“ urobia viac než ďalší argument. Kto nevydrží ticho, kupuje si ho zbytočnými rečami.",
      "**Jedna myšlienka na vetu.** Dlhé súvetia s tromi „ale“ a dvomi „vlastne“ nikto nesleduje. Krátke vety. Pauza. Ďalšia myšlienka.",
      "**Očný kontakt a telo:** pri kľúčových vetách sa pozri do očí, ramená dole, ruky pokojné. Nemusíš nič hrať — stačí nebyť v pohybe, keď hovoríš dôležité veci. Pokoj tela = pokoj v hlave zákazníka.",
    ],
    task:
      "Dnes vedome spomaľ. Pri každom povedaní ceny: pokojné tempo, očný kontakt, po vete ticho. Sleduj, čo to robí so zákazníkom.",
    reflection: [
      "Kedy som dnes hovoril prirýchlo a prečo (nervozita, tlak, zvyk)?",
      "Ako reagovali zákazníci, keď som spomalil a vydržal ticho?",
      "Ktorá situácia ma dnes rozhodila a ako som sa upokojil?",
    ],
    minDays: 4,
  },
  {
    id: "w10",
    num: 10,
    phase: 5,
    phaseTitle: "Komunikácia",
    title: "Vysvetľuj jednoducho",
    lesson: [
      "Zákazník, ktorý nerozumie, nekúpi — alebo kúpi a bude sa cítiť oklamaný. **Jednoduchosť nie je zjednodušovanie, je to rešpekt.** Einstein: ak to nevieš vysvetliť jednoducho, sám tomu dosť nerozumieš.",
      "Nástroj č. 1: **prirovnanie zo sveta zákazníka.** SSD vs. HDD? „Predstavte si sklad: HDD je skladník, ktorý beží pre každú vec do zadnej haly. SSD má všetko na pulte.“ RAM? „Pracovný stôl — čím väčší, tým viac vecí naraz bez upratovania.“",
      "Nástroj č. 2: **test babičky.** Vysvetlil by som to tak svojej babičke? Ak nie, hľadaj iné slová. Odborné slovo smieš použiť, len ak ho hneď preložíš.",
      "Nástroj č. 3: **maximálne tri veci.** Zákazník si z rozhovoru odnesie tri body, viac nie. Vyber tri, na ktorých mu záleží (podľa toho, čo si zistil otázkami!), a zvyšok vypusti. Kto povie desať výhod, akoby nepovedal žiadnu.",
      "Skús aj obrátenú kontrolu: „Dáva to zmysel? Mám ukázať, ako to funguje?“ — otázkou zistíš, či ťa človek stíha, bez toho, aby si ho urazil.",
    ],
    task:
      "Každé odborné slovo dnes preloz do prirovnania alebo ho vôbec nepouži. Pri každom odporúčaní max. 3 dôvody — vybrané podľa toho, čo zákazník povedal.",
    reflection: [
      "Aké prirovnanie som dnes použil a zabralo?",
      "Kedy som videl, že zákazník prestal rozumieť? Ako som to zachytil?",
      "Ktoré odborné slovo potrebujem do zajtra „preložiť“?",
    ],
    minDays: 4,
  },
  {
    id: "w11",
    num: 11,
    phase: 6,
    phaseTitle: "Analýza",
    title: "Čísla namiesto pocitov",
    lesson: [
      "„Dnes to bolo dobré“ nie je dáta, to je nálada. Profesionál sa hodnotí **otázkou, nie známkou**: nie „bol som dobrý či zlý“, ale „**čo sa dnes naučím?**“",
      "Tvoja appka za teba už 10 týždňov zbiera dáta: koľko zákazníkov, aké výsledky, aké potreby a obavy sa opakujú, ako sa vyvíja tvoje skóre dôvery, ktoré námietky ťa trápia. Tento týždeň sa ich naučíš čítať.",
      "Hľadaj **vzorce, nie jednotlivé dni**: Klesá dôvera vždy poobede? (únava → tempo reči?) Vracia sa tá istá obava? (chýba ti na ňu odpoveď → dopracuj kartičku produktu) Veľa „vráti sa“, málo „kúpil“? (možno chýba jasné „ktorú cestu si vyberiete?“)",
      "Jeden údaj sleduj obzvlášť: **pomer rozhovorov, kde si našiel skutočnú potrebu**. To je tvoja predajná kondícia. Predaje kolíšu aj kvôli počasiu — ale kvalita diagnostiky je celá tvoja.",
      "Večerné zhrnutie tento týždeň rozšír: koľko zákazníkov som obslúžil, aké boli najčastejšie otázky, kde som sa zasekol, čo chcem zajtra zlepšiť.",
    ],
    task:
      "Každý večer vyplň plnú reflexiu vrátane „čo chcem zajtra zlepšiť“. Raz tento týždeň si otvor Štatistiky a nájdi v nich jeden vzorec — zapíš ho.",
    reflection: [
      "Koľko zákazníkov som dnes obslúžil a aké boli najčastejšie otázky?",
      "Kde som sa dnes zasekol?",
      "Aký vzorec vidím vo svojich číslach za posledné týždne?",
      "Čo chcem zajtra zlepšiť?",
    ],
    minDays: 4,
  },
  {
    id: "w12",
    num: 12,
    phase: 6,
    phaseTitle: "Analýza",
    title: "Systém zlepšovania",
    lesson: [
      "Posledný týždeň programu — a začiatok všetkého ostatného. Cieľom nikdy nebolo „dokončiť kurz“. Cieľom bolo vybudovať **systém, ktorý ťa zlepšuje každý deň**, aj keď žiadny program nebeží.",
      "Ten systém má tri súčiastky, všetky už máš: **1. Denný zápis** (3 otázky po zákazníkovi — 30 sekúnd). **2. Večerná otázka** „čo sa dnes naučím?“ + jedna vec na zajtra. **3. Týždenný pohľad** do štatistík — jeden vzorec, jedno rozhodnutie.",
      "Princíp kaizen: **1 % denne**. Nie je dôležité, aby bol zajtrajšok výrazne lepší. Je dôležité, aby bol o čosi lepší — a aby to nikdy neprestalo. Za rok je z toho iná liga.",
      "Kam ďalej: prejdi si znova lekcie fáz, ktoré ti išli najťažšie (štatistiky ti povedia ktoré). Dopĺňaj produktové kartičky pri každej novinke. Trénuj námietky, ktoré ti simulátor stále vracia. A pokojne si program pusti odznova — tie isté lekcie budeš s trojmesačnou praxou čítať úplne inými očami.",
      "A jedno si zapamätaj z celej cesty: **predaj je pomoc s rozhodnutím**. Kto sa pýta, počúva a poctivo radí, tomu ľudia veria. A od koho ľudia kupujú? Od toho, komu veria. Všetko ostatné sú detaily.",
    ],
    task:
      "Každý večer vyber jednu konkrétnu vec na zajtra. Na konci týždňa si prejdi štatistiky celého programu a napíš si: 3 veci, v ktorých som narástol, a 1 vec, na ktorej makám ďalej.",
    reflection: [
      "Čo som sa dnes naučil?",
      "Čo chcem zajtra zlepšiť?",
      "(Na konci týždňa) V čom som za 12 týždňov narástol najviac? Na čom makám ďalej?",
    ],
    minDays: 4,
  },
];

export function getWeek(num: number): Week | undefined {
  return WEEKS.find((w) => w.num === num);
}

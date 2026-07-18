// Štartovacia banka námietok — prostredie PC servisu a predajne elektroniky.
// Každá námietka má rozbor podľa princípu: uznaj → zisti → odpovedz.
// Vzorové odpovede sú princíp a inšpirácia, nie skript naspamäť.

export interface Objection {
  id: string;
  text: string;
  category: "cena" | "konkurencia" | "čas" | "dôvera" | "technika" | "rozhodovanie";
  meaning: string; // čo tým zákazník pravdepodobne myslí
  uznaj: string; // ako uznať bez súhlasu
  zisti: string; // akou otázkou zistiť skutočný dôvod
  odpovedz: string; // princíp odpovede / vzorový smer
}

export const OBJECTIONS: Objection[] = [
  {
    id: "o1",
    text: "Je to drahé.",
    category: "cena",
    meaning:
      "Tri možné významy: nemám toľko (rozpočet), nevidím za čo platím (hodnota), inde je to lacnejšie (porovnanie). Kým nevieš ktorý, nevieš odpovedať.",
    uznaj: "„Rozumiem, cena je dôležitá — nikto nechce platiť viac, než musí.“",
    zisti: "„Drahé v porovnaní s čím?“ alebo „Keby cena nebola téma, brali by ste to?“",
    odpovedz:
      "Rozpočet → ponúkni alternatívu v jeho sume. Hodnota → prelož vlastnosti na úžitok („platíte za to, že...“). Porovnanie → povedz, čo je v cene navyše (servis, osobná pomoc, záruka na mieste).",
  },
  {
    id: "o2",
    text: "Na Alze / v e-shope je to lacnejšie.",
    category: "konkurencia",
    meaning:
      "Porovnáva len číslo na cenovke. Zároveň ale stojí u teba v predajni — čiže niečo mu na e-shope nestačí, inak by už dávno klikol „kúpiť“.",
    uznaj: "„Máte pravdu, online býva cenovka nižšia.“",
    zisti: "„Čo vás priviedlo k nám, keď ste to videli online?“",
    odpovedz:
      "Odpoveď je v tom, čo ti povie: chce poradiť, vidieť to, mať kam prísť keď je problém. Pomenuj to: „U nás máte tovar hneď, poradíme vám s nastavením a keď čokoľvek, prídete rovno sem — to je tých pár eur rozdielu.“ Ak je rozdiel priepastný, buď férový a povedz to.",
  },
  {
    id: "o3",
    text: "Oprava stojí skoro toľko ako nový.",
    category: "cena",
    meaning:
      "Neistota v rozhodovaní: oplatí sa investovať do starého? Často za tým je aj strach, že sa o mesiac pokazí niečo ďalšie.",
    uznaj: "„Dobrá úvaha — presne toto sa oplatí prepočítať.“",
    zisti: "„Ako dlho by ste chceli, aby vám ešte slúžil? A ako ste s ním inak spokojný?“",
    odpovedz:
      "Poctivá kalkulácia: ak je stroj inak zdravý, oprava = zlomok ceny nového za ďalšie roky služby. Ak je na hrane životnosti, povedz to na rovinu a ponúkni alternatívy (repas, nový). Poctivosť tu buduje zákazníka na roky.",
  },
  {
    id: "o4",
    text: "Ja si to ešte rozmyslím.",
    category: "rozhodovanie",
    meaning:
      "Zriedka o čase. Väčšinou nevypovedaná obava: nie je si istý, či to potrebuje, či nepreplatí, či mu vôbec rozumieš. Alebo sa len nevie rozhodnúť medzi možnosťami.",
    uznaj: "„Jasné, také rozhodnutie chce čas.“",
    zisti: "„Čo vám v tom najviac vŕta hlavou?“ alebo „Čo by vám pomohlo sa rozhodnúť?“",
    odpovedz:
      "Polovica ľudí povie skutočný dôvod — a ten rieš na mieste (informácia, alternatíva, istota). Ak naozaj potrebuje čas, uľahči návrat: zhrň možnosti, daj mu ich napísané, ponúkni, že mu tovar podržíš.",
  },
  {
    id: "o5",
    text: "Musím sa poradiť s manželkou / manželom.",
    category: "rozhodovanie",
    meaning:
      "Buď naozaj nerozhoduje sám (bežné pri väčších sumách), alebo je to zdvorilá verzia „rozmyslím si to“ — má obavu, ktorú nepovedal.",
    uznaj: "„Samozrejme, pri takej sume je fér poradiť sa.“",
    zisti: "„Čo myslíte, že bude pre ňu/neho najdôležitejšie?“",
    odpovedz:
      "Vyzbroj ho pre ten rozhovor doma: krátke zhrnutie čo, prečo a za koľko (pokojne na papier). Ak vidíš váhanie aj u neho, jemne over: „A vy osobne — sedí vám to?“",
  },
  {
    id: "o6",
    text: "Kamarát mi to opraví lacnejšie.",
    category: "konkurencia",
    meaning:
      "Testuje, čo dostane u teba navyše. Alebo úprimne zvažuje známeho a nevie, v čom je rozdiel medzi kamarátskou opravou a servisom.",
    uznaj: "„Super, že máte niekoho šikovného poruke.“",
    zisti: "„Čo vám na tom váha? Cena, alebo aby to bolo isté?“",
    odpovedz:
      "Bez zhadzovania kamaráta. Pomenuj rozdiel: záruka na opravu, originálne diely, zodpovednosť keď sa niečo pokazí, termín. „Kamarát vám to spraví, keď bude mať čas — my do stredy a s garanciou.“ Nechaj rozhodnutie na ňom.",
  },
  {
    id: "o7",
    text: "Nechcem platiť za diagnostiku.",
    category: "cena",
    meaning:
      "Nerozumie, čo diagnostika obnáša — znie mu to ako „poplatok za pozretie“. Bojí sa, že zaplatí a aj tak sa nič nevyrieši.",
    uznaj: "„Chápem, platiť za niečo, čoho výsledok nepoznáte vopred, znie zvláštne.“",
    zisti: "„Čo presne vám na tom prekáža — suma, alebo že neviete, čo za ňu dostanete?“",
    odpovedz:
      "Vysvetli, čo diagnostika je: odborný čas a meranie, výsledkom je presná odpoveď čo a za koľko — a až potom sa rozhoduje o oprave. Ak sa diagnostika pri oprave odpočítava, zdôrazni to: „Ak opravu spravíme u nás, diagnostiku máte v cene.“",
  },
  {
    id: "o8",
    text: "Repasovaný? Použitý tovar nechcem.",
    category: "technika",
    meaning:
      "Predstava „bazár = riziko“. Nevie, že repas prešiel kontrolou a má záruku. Bojí sa, že kupuje cudzí problém.",
    uznaj: "„Rozumiem, nikto nechce kupovať mačku vo vreci.“",
    zisti: "„Čo si pod repasovaným predstavujete?“",
    odpovedz:
      "Vysvetli rozdiel bazár vs. repas: firemné stroje, kontrola, vyčistenie, záruka. Hodnota: „Za polovičnú cenu máte strednú manažérsku triedu — kvalitnejšiu konštrukciu než nový lacný kus.“ A poctivo: komu sa repas nehodí, tomu ho neodporúčaj.",
  },
  {
    id: "o9",
    text: "To zvládnem sám podľa YouTube.",
    category: "dôvera",
    meaning:
      "Šetrí peniaze a možno ho to aj baví. Nevidí riziko (poškodenie, strata dát) ani hodnotu tvojho času a skúsenosti.",
    uznaj: "„Klobúk dole, veľa vecí sa dá zvládnuť doma — niektorí to tak robia.“",
    zisti: "„Robili ste už niečo podobné? Máte čím zálohovať dáta, keby sa niečo pokazilo?“",
    odpovedz:
      "Bez strašenia, ale férovo: pomenuj konkrétne riziko toho konkrétneho zásahu (krehký konektor, strata dát, záruka). „Ak si na to trúfate, smelo — a keby čokoľvek, sme tu.“ Ochota pustiť ho buduje dôveru, s ktorou sa vráti.",
  },
  {
    id: "o10",
    text: "Windows mi nainštaluje známy zadarmo.",
    category: "konkurencia",
    meaning:
      "Inštalácia mu príde ako triviálna služba bez pridanej hodnoty. Nevie, čo všetko je v tvojej službe navyše (ovládače, aktualizácie, prenos dát, legálna licencia).",
    uznaj: "„Jasné, samotná inštalácia nie je veda.“",
    zisti: "„A dáta, programy a nastavenia — tie vám prenesie tiež?“",
    odpovedz:
      "Rozbaľ, čo služba naozaj obsahuje: legálna licencia, ovládače, aktualizácie, prenos dát a fotiek, funkčné všetko na počkanie. „Platíte za to, že si počítač zapnete doma a všetko je tam, kde bolo.“",
  },
  {
    id: "o11",
    text: "Antivírus netreba, ja si dávam pozor.",
    category: "technika",
    meaning:
      "Verí, že hrozba = hlúpe klikanie, a on nekliká. Nevie, že útoky dnes nevyžadujú chybu používateľa (falošné maily bánk, napadnuté weby).",
    uznaj: "„To je dobrý základ — opatrnosť je najlepší prvý filter.“",
    zisti: "„Používate internetbanking alebo platíte kartou online?“",
    odpovedz:
      "Prepoj na jeho svet: „Práve pri bankovníctve už nejde o pozor — falošná stránka banky vyzerá na nerozoznanie. Ochrana je poistka pre peniaze, nie pre počítač.“ Ak naozaj nemá rizikové použitie, netlač — poctivosť nadovšetko.",
  },
  {
    id: "o12",
    text: "Načo SSD, veď mi to funguje.",
    category: "technika",
    meaning:
      "Zvykol si na pomalý počítač a nevie, že existuje výrazne lepší stav. Chýba mu predstava rozdielu — vlastnosť „SSD“ mu nič nehovorí.",
    uznaj: "„Funguje — to je pravda, nič nehorí.“",
    zisti: "„Koľko čakáte, kým naštartuje? A prekáža vám to?“",
    odpovedz:
      "Hodnota namiesto parametra: „Toto je najlacnejšia vec, ktorá zmení starý počítač na svižný — štart za pár sekúnd namiesto minút.“ Ideálne ukáž rozdiel naživo na stroji v predajni. Zážitok predá viac než argument.",
  },
  {
    id: "o13",
    text: "Minule ste mi to opravili a zase sa to pokazilo.",
    category: "dôvera",
    meaning:
      "Sklamanie a test: dá sa vám ešte veriť? Nezaujíma ho, čia je to vina — zaujíma ho, či sa k tomu postavíte čelom.",
    uznaj: "„To by nahnevalo aj mňa. Poďme sa na to pozrieť.“",
    zisti: "„Čo presne sa deje teraz? Je to to isté, alebo niečo nové?“",
    odpovedz:
      "Žiadne výhovorky, žiadne obviňovanie zákazníka. Zisti fakty: rovnaká porucha (reklamácia opravy — vyrieš veľkoryso) alebo nová vec (vysvetli rozdiel zrozumiteľne). Ako sa zachováš teraz, rozhodne, či máš zákazníka navždy alebo nikdy.",
  },
  {
    id: "o14",
    text: "Prečo to trvá tak dlho? Potrebujem to hneď.",
    category: "čas",
    meaning:
      "Počítač je jeho pracovný nástroj alebo spojenie so svetom — každý deň bez neho ho niečo stojí. Časová tieseň, možno aj panika.",
    uznaj: "„Rozumiem, bez počítača sa dnes nedá fungovať.“",
    zisti: "„Na čo ho súrne potrebujete? Dá sa niečo z toho vyriešiť hneď?“",
    odpovedz:
      "Rieš jeho skutočný problém, nie len termín: expresný príplatok, zapožičanie náhradného stroja, záchrana najdôležitejších dát na USB hneď na počkanie. A daj realistický termín, ktorý dodržíš — sľúbiť nemožné je horšie než povedať pravdu.",
  },
  {
    id: "o15",
    text: "Bojím sa, že prídem o fotky a dáta.",
    category: "dôvera",
    meaning:
      "Toto nie je technická otázka, ale emočná — fotky detí sa nedajú kúpiť znova. Potrebuje istotu a pocit, že to berieš rovnako vážne ako on.",
    uznaj: "„Úplne oprávnená obava — dáta sú to najcennejšie v celom počítači.“",
    zisti: "„Máte nejakú zálohu? Čo z toho je nenahraditeľné?“",
    odpovedz:
      "Konkrétny postup namiesto chlácholenia: „Prvý krok u nás je záloha — kým nie sú dáta v bezpečí, do stroja nesiahame.“ Ponúkni aj trvalé riešenie (externý disk, cloud) — práve vyriešil svoj skutočný problém, nie len dnešnú opravu.",
  },
  {
    id: "o16",
    text: "Dáte mi zľavu?",
    category: "cena",
    meaning:
      "Niekedy šport (skúsiť sa patrí), niekedy signál, že hodnota ešte neprevážila cenu, niekedy reálne obmedzený rozpočet.",
    uznaj: "„Opýtať sa je fér.“",
    zisti: "„Ide o to dostať sa do nejakej sumy, alebo len či sa dá?“",
    odpovedz:
      "Nezľavuj automaticky — zľava bez dôvodu učí, že prvá cena bola nafúknutá. Pridaj hodnotu namiesto uberania ceny (služba, príslušenstvo, predĺžená podpora) alebo ponúkni lacnejšiu alternatívu. Ak zľavu dáš, povedz prečo („predvádzací kus“).",
  },
  {
    id: "o17",
    text: "Počkám na zľavy / Black Friday.",
    category: "čas",
    meaning:
      "Verí, že o mesiac kúpi to isté výrazne lacnejšie. Váha medzi potrebou teraz a možnou úsporou potom.",
    uznaj: "„Rozumiem, nikto nechce kúpiť deň pred zľavou.“",
    zisti: "„Ako veľmi vás súčasný stav obmedzuje? Vydržíte s ním do akcií?“",
    odpovedz:
      "Poctivá matematika: ak vydrží a vie, že akcia bude, nech počká — tá férovosť sa ti vráti. Ale pomenuj aj druhú stranu: akciové ceny bývajú na vybraných kusoch, a mesiac trápenia s pokazeným strojom má tiež svoju cenu.",
  },
  {
    id: "o18",
    text: "Táto značka je vraj zlá, čítal som recenzie.",
    category: "technika",
    meaning:
      "Chráni sa pred zlým rozhodnutím cudzou skúsenosťou. Recenzie píšu najčastejšie nespokojní — ale jeho obava je skutočná: nechce naletieť.",
    uznaj: "„Dobre, že si veci overujete — recenzie sa oplatí čítať.“",
    zisti: "„Čo konkrétne sa tam písalo? Ktorý model recenzovali?“",
    odpovedz:
      "Neháď recenzie zo stola. Rozlíš model vs. značku (každá značka má vydarené aj nevydarené rady) a doplň vlastnú skúsenosť zo servisu: „My vidíme, čo sa reálne kazí — z tohto radu sa nám nevracia takmer nič.“ Ak má model naozaj zlú povesť, potvrď to a ponúkni iný.",
  },
  {
    id: "o19",
    text: "Objednám si to z Nemecka / z zahraničia.",
    category: "konkurencia",
    meaning:
      "Vidí nižšiu cenu v zahraničnom e-shope. Nemyslí na reklamáciu, dopravu, klávesnicu, či podporu v slovenčine.",
    uznaj: "„Áno, v zahraničí sa dá občas nájsť lepšia cena.“",
    zisti: "„Rátali ste aj s dopravou? A riešili ste už niekedy reklamáciu do zahraničia?“",
    odpovedz:
      "Bez strašenia vymenuj rozdiely: reklamácia posielaním do zahraničia a v cudzom jazyku, iná klávesnica, doprava, dostupnosť. „Tu prídete s problémom ku mne k pultu.“ Ak mu to aj tak vyjde lepšie, dopraj mu to — a ponúkni, že mu stroj aspoň nastavíš.",
  },
  {
    id: "o20",
    text: "Nemám teraz na to peniaze.",
    category: "cena",
    meaning:
      "Buď reálny stav rozpočtu, alebo zdvorilé nie. Ak je potreba skutočná, hľadá cestu — len ju nevidí.",
    uznaj: "„Chápem, netreba sa naťahovať nad možnosti.“",
    zisti: "„Je to o tomto mesiaci, alebo celkovo o sume? Akú sumu by ste vedeli dať?“",
    odpovedz:
      "Ponúkni cesty podľa odpovede: lacnejšia alternatíva alebo repas, splátky ak ich máte, rezervácia do výplaty, prípadne dočasné riešenie („zatiaľ vymeníme len disk, zvyšok vydrží“). Ak je to zdvorilé nie, spoznáš to — a netlač.",
  },
  {
    id: "o21",
    text: "Záruka aj tak nič nerieši, to poznám.",
    category: "dôvera",
    meaning:
      "Zlá skúsenosť s reklamáciou v minulosti (jeho alebo z počutia). Neverí sľubom na papieri — verí len tomu, čo zažije.",
    uznaj: "„Zlá skúsenosť s reklamáciou vie človeka odradiť nadlho, to chápem.“",
    zisti: "„Čo sa vám stalo, ak sa smiem opýtať?“",
    odpovedz:
      "Vypočuj celý príbeh — samotné vypočutie je polovica odpovede. Potom konkrétne, ako to beží u vás: kam príde, kto to rieši, dokedy. Rozdiel medzi anonymnou linkou e-shopu a pultom, za ktorým stojíš ty osobne, je tu tvoja najsilnejšia karta.",
  },
  {
    id: "o22",
    text: "Chcem len to najlacnejšie, nič extra netreba.",
    category: "rozhodovanie",
    meaning:
      "Buď naozaj minimálne potreby, alebo obranná reakcia — bojí sa, že mu predajca natlačí drahé zbytočnosti. Test tvojej poctivosti.",
    uznaj: "„Jasné, zbytočnosti nemá zmysel platiť.“",
    zisti: "„Na čo to bude slúžiť? Nech vám to najlacnejšie o pol roka nie je najdrahšie.“",
    odpovedz:
      "Ak jeho potrebám najlacnejšie stačí, predaj mu ho s čistým svedomím a povedz mu to — práve si získal jeho dôveru. Ak nestačí, ukáž konkrétny rozdiel v jeho použití („pri desiatich kartách v prehliadači sa tento zadýcha“) a nechaj voľbu na ňom.",
  },
  {
    id: "o23",
    text: "Starý ešte doslúži, načo nový.",
    category: "rozhodovanie",
    meaning:
      "Šetrnosť a vzťah k veciam — nechce vyhadzovať funkčné. Nevidí skryté náklady starého stroja (čas, riziko zlyhania, dáta bez zálohy).",
    uznaj: "„To je rozumný prístup, vyhadzovať funkčné veci netreba.“",
    zisti: "„Čo by sa stalo, keby vám zajtra doobeda vypovedal? Máte dáta zálohované?“",
    odpovedz:
      "Netlač na výmenu — ponúkni plán: dnes záloha dát a kontrola stavu, výmena až keď to bude treba. Ak stroj reálne dosluhuje, povedz čo presne odchádza a prečo je lepšie vymeniť ho plánovane než v paniku, keď zlyhá.",
  },
  {
    id: "o24",
    text: "Vy mi chcete len niečo predať.",
    category: "dôvera",
    meaning:
      "Otvorená nedôvera — čaká nátlak a chráni sa vopred. Možno má skúsenosť s tlačením na predaj. Toto je test celej tvojej cesty predajcu.",
    uznaj: "„Fér poznámka — ste v predajni, tak je tá ostražitosť namieste.“",
    zisti: "„Čo by vám pomohlo, aby ste mali istotu, že radím vám a nie svojej tržbe?“",
    odpovedz:
      "Najlepšia odpoveď nie je veta, ale správanie: pýtaj sa, počúvaj, pokojne odporuč lacnejšie alebo nič („podľa toho, čo hovoríte, by som zatiaľ nekupoval nič — spravme len X“). Nátlak nula. Tento zákazník sa buduje najdlhšie a vydrží najvernejšie.",
  },
];

export const OBJECTION_CATEGORIES = [
  { id: "cena", label: "Cena" },
  { id: "konkurencia", label: "Konkurencia" },
  { id: "čas", label: "Čas" },
  { id: "dôvera", label: "Dôvera" },
  { id: "technika", label: "Technika" },
  { id: "rozhodovanie", label: "Rozhodovanie" },
] as const;

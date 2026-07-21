// Banka námietok: prostredie PC servisu, mobilného servisu a predajne elektroniky.
// Každá námietka má rozbor podľa princípu: uznaj, zisti, odpovedz, a navyše hĺbkový
// rozbor (pole hlbka), ktorý sa zobrazí po rozkliknutí a ide viac do podstaty.
// Vzorové odpovede sú princíp a inšpirácia, nie skript naspamäť.

export interface Objection {
  id: string;
  text: string;
  category: "cena" | "konkurencia" | "čas" | "dôvera" | "technika" | "rozhodovanie" | "sortiment";
  meaning: string; // čo tým zákazník pravdepodobne myslí
  uznaj: string; // ako uznať bez súhlasu
  zisti: string; // akou otázkou zistiť skutočný dôvod
  odpovedz: string; // princíp odpovede / vzorový smer
  hlbka?: string; // hĺbkový rozbor po rozkliknutí
}

export const OBJECTIONS: Objection[] = [
  {
    id: "o1",
    text: "Je to drahé.",
    category: "cena",
    meaning:
      "Tri možné významy: nemám toľko (rozpočet), nevidím za čo platím (hodnota), inde je to lacnejšie (porovnanie). Kým nevieš ktorý, nevieš odpovedať.",
    uznaj: "„Rozumiem, cena je dôležitá, nikto nechce platiť viac, než musí.“",
    zisti: "„Drahé v porovnaní s čím?“ alebo „Keby cena nebola téma, brali by ste to?“",
    odpovedz:
      "Rozpočet → ponúkni alternatívu v jeho sume. Hodnota → prelož vlastnosti na úžitok („platíte za to, že...“). Porovnanie → povedz, čo je v cene navyše (servis, osobná pomoc, záruka na mieste).",
    hlbka:
      "Za touto vetou sú spravidla tri odlišné situácie a každá potrebuje iný postup: skutočne obmedzený rozpočet, nepochopená hodnota, alebo porovnanie s inou ponukou. Najčastejšia chyba je hneď ponúknuť zľavu, čím si sám potvrdíš, že pôvodná cena bola nafúknutá. Skús namiesto obhajoby ceny najprv jednou vetou zhrnúť, čo všetko je v nej zahrnuté, a až potom sa pýtaj, s čím porovnáva.",
  },
  {
    id: "o2",
    text: "Na Alze / v e-shope je to lacnejšie.",
    category: "konkurencia",
    meaning:
      "Porovnáva len číslo na cenovke. Zároveň ale stojí u teba v predajni, čiže niečo mu na e-shope nestačí, inak by už dávno klikol „kúpiť“.",
    uznaj: "„Máte pravdu, online býva cenovka nižšia.“",
    zisti: "„Čo vás priviedlo k nám, keď ste to videli online?“",
    odpovedz:
      "Odpoveď je v tom, čo ti povie: chce poradiť, vidieť to, mať kam prísť keď je problém. Pomenuj to: „U nás máte tovar hneď, poradíme vám s nastavením a keď čokoľvek, prídete rovno sem, to je tých pár eur rozdielu.“ Ak je rozdiel priepastný, buď férový a povedz to.",
    hlbka:
      "Zákazník stojí fyzicky v predajni, hoci mohol kúpiť online, čo je samo osebe signál, že niečo z online nákupu mu nesedí, chce vidieť tovar, poradiť sa, mať istotu servisu. Nepúšťaj sa do súboja o každý eur, radšej pomenuj konkrétnu hodnotu, ktorú e-shop nedáva, okamžitú dostupnosť, osobné nastavenie, riešenie problémov na mieste. Ak je rozdiel v cene naozaj priepastný, priznaj to otvorene, dôveru tým získaš viac, než keby si sa to snažil zahovoriť.",
  },
  {
    id: "o3",
    text: "Oprava stojí skoro toľko ako nový.",
    category: "cena",
    meaning:
      "Neistota v rozhodovaní: oplatí sa investovať do starého? Často za tým je aj strach, že sa o mesiac pokazí niečo ďalšie.",
    uznaj: "„Dobrá úvaha, presne toto sa oplatí prepočítať.“",
    zisti: "„Ako dlho by ste chceli, aby vám ešte slúžil? A ako ste s ním inak spokojný?“",
    odpovedz:
      "Poctivá kalkulácia: ak je stroj inak zdravý, oprava = zlomok ceny nového za ďalšie roky služby. Ak je na hrane životnosti, povedz to na rovinu a ponúkni alternatívy (repas, nový). Poctivosť tu buduje zákazníka na roky.",
    hlbka:
      "Tu ide o rozhodovanie medzi dvomi neistotami, koľko ešte vydrží opravené zariadenie a koľko stojí nový kus so všetkým, čo k nemu patrí, prenos dát, nastavenie, adaptácia. Pomôž zákazníkovi rátať s reálnymi číslami, nie len s cenovkou opravy verzus cenovkou nového kusu. Ak je stroj skutočne na hrane životnosti, čestné odporúčanie nového rieši dôveru na roky dopredu, aj keď v tú chvíľu prídeš o menší obchod.",
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
      "Polovica ľudí povie skutočný dôvod, a ten rieš na mieste (informácia, alternatíva, istota). Ak naozaj potrebuje čas, uľahči návrat: zhrň možnosti, daj mu ich napísané, ponúkni, že mu tovar podržíš.",
    hlbka:
      "V polovici prípadov ide o skutočnú potrebu premyslieť si to, v druhej polovici o zdvorilú formu odmietnutia, za ktorou sa skrýva nepomenovaná obava. Rozdiel spoznáš podľa toho, či ti zákazník po otázke, čo mu v rozhodnutí najviac prekáža, odpovie konkrétne, alebo len vyhýbavo. Uľahči mu návrat, zhrň ponuku písomne, prípadne mu tovar na pár dní podrž, aby sa nemusel vracať s prázdnymi rukami.",
  },
  {
    id: "o5",
    text: "Musím sa poradiť s manželkou / manželom.",
    category: "rozhodovanie",
    meaning:
      "Buď naozaj nerozhoduje sám (bežné pri väčších sumách), alebo je to zdvorilá verzia „rozmyslím si to“, má obavu, ktorú nepovedal.",
    uznaj: "„Samozrejme, pri takej sume je fér poradiť sa.“",
    zisti: "„Čo myslíte, že bude pre ňu/neho najdôležitejšie?“",
    odpovedz:
      "Vyzbroj ho pre ten rozhovor doma: krátke zhrnutie čo, prečo a za koľko (pokojne na papier). Ak vidíš váhanie aj u neho, jemne over: „A vy osobne, sedí vám to?“",
    hlbka:
      "Za touto vetou môže byť skutočné spoločné rozhodovanie o väčšom výdavku, ale aj neistota, ktorú si zákazník sám sebe ešte nepriznal. Vybav ho pre rozhovor doma jasným zhrnutím na papieri, čo, prečo, za koľko, nech nemusí spoliehať na pamäť. Jemne over aj jeho osobný postoj, lebo ak sám váha, žiadne zhrnutie pre partnera to nezmení.",
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
      "Bez zhadzovania kamaráta. Pomenuj rozdiel: záruka na opravu, originálne diely, zodpovednosť keď sa niečo pokazí, termín. „Kamarát vám to spraví, keď bude mať čas, my do stredy a s garanciou.“ Nechaj rozhodnutie na ňom.",
    hlbka:
      "Zákazník takto často testuje, čo presne dostane navyše za vyššiu cenu u teba, nie že by kamarátovi neveril. Nezhadzuj kamaráta, len jasne pomenuj konkrétny rozdiel, záruku, termín, zodpovednosť pri probléme, a nechaj rozhodnutie na ňom bez nátlaku. Ak sa napriek tomu rozhodne pre kamaráta, rozíď sa slušne, môže sa vrátiť práve vtedy, keď kamarátska oprava zlyhá.",
  },
  {
    id: "o7",
    text: "Nechcem platiť za diagnostiku.",
    category: "cena",
    meaning:
      "Nerozumie, čo diagnostika obnáša, znie mu to ako „poplatok za pozretie“. Bojí sa, že zaplatí a aj tak sa nič nevyrieši.",
    uznaj: "„Chápem, platiť za niečo, čoho výsledok nepoznáte vopred, znie zvláštne.“",
    zisti: "„Čo presne vám na tom prekáža, suma, alebo že neviete, čo za ňu dostanete?“",
    odpovedz:
      "Vysvetli, čo diagnostika je: odborný čas a meranie, výsledkom je presná odpoveď čo a za koľko, a až potom sa rozhoduje o oprave. Ak sa diagnostika pri oprave odpočítava, zdôrazni to: „Ak opravu spravíme u nás, diagnostiku máte v cene.“",
    hlbka:
      "Zákazník si pod diagnostikou často predstaví len letmý pohľad zadarmo, nie odborný čas strávený meraním a hľadaním presnej príčiny poruchy. Vysvetli diagnostiku ako produkt sám osebe, ktorého výsledkom je presná odpoveď, čo a za koľko, nie ako poplatok za nič. Ak sa diagnostika pri následnej oprave odpočítava, zdôrazni to hneď na začiatku, väčšinou to obavu úplne rozptýli.",
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
      "Vysvetli rozdiel bazár vs. repas: firemné stroje, kontrola, vyčistenie, záruka. Hodnota: „Za polovičnú cenu máte strednú manažérsku triedu, kvalitnejšiu konštrukciu než nový lacný kus.“ A poctivo: komu sa repas nehodí, tomu ho neodporúčaj.",
    hlbka:
      "V hlave zákazníka sa slovo repasovaný často spája s bazárom, nie s kontrolovaným procesom obnovy. Rozlož rozdiel na konkrétne kroky, kontrola, vyčistenie, výmena opotrebovaných častí, záruka, a porovnaj hodnotu za peniaze s novým lacným kusom v rovnakej cenovej hladine. Buď však úprimný aj o limitoch, nie každému sa repas hodí a poctivé odporučenie iného riešenia buduje dôveru viac než predaj za každú cenu.",
  },
  {
    id: "o9",
    text: "To zvládnem sám podľa YouTube.",
    category: "dôvera",
    meaning:
      "Šetrí peniaze a možno ho to aj baví. Nevidí riziko (poškodenie, strata dát) ani hodnotu tvojho času a skúsenosti.",
    uznaj: "„Klobúk dole, veľa vecí sa dá zvládnuť doma, niektorí to tak robia.“",
    zisti: "„Robili ste už niečo podobné? Máte čím zálohovať dáta, keby sa niečo pokazilo?“",
    odpovedz:
      "Bez strašenia, ale férovo: pomenuj konkrétne riziko toho konkrétneho zásahu (krehký konektor, strata dát, záruka). „Ak si na to trúfate, smelo, a keby čokoľvek, sme tu.“ Ochota pustiť ho buduje dôveru, s ktorou sa vráti.",
    hlbka:
      "Zákazníka väčšinou neženie len úspora peňazí, ale aj chuť si to vyskúšať a dokázať si niečo sám. Nestrašiac konkrétne pomenuj riziko práve tohto zásahu, krehký konektor, stratu dát, stratu záruky, a nechaj rozhodnutie na ňom. Ochota pustiť ho do vlastného pokusu, s ponukou pomoci keď to nevyjde, buduje dôveru, s ktorou sa vráti pri ďalšom probléme.",
  },
  {
    id: "o10",
    text: "Windows mi nainštaluje známy zadarmo.",
    category: "konkurencia",
    meaning:
      "Inštalácia mu príde ako triviálna služba bez pridanej hodnoty. Nevie, čo všetko je v tvojej službe navyše (ovládače, aktualizácie, prenos dát, legálna licencia).",
    uznaj: "„Jasné, samotná inštalácia nie je veda.“",
    zisti: "„A dáta, programy a nastavenia, tie vám prenesie tiež?“",
    odpovedz:
      "Rozbaľ, čo služba naozaj obsahuje: legálna licencia, ovládače, aktualizácie, prenos dát a fotiek, funkčné všetko na počkanie. „Platíte za to, že si počítač zapnete doma a všetko je tam, kde bolo.“",
    hlbka:
      "Inštalácia sama osebe zákazníkovi príde ako triviálna vec bez pridanej hodnoty, lebo nevidí všetko, čo sa za ňou skrýva. Rozbaľ konkrétne, čo služba naozaj obsahuje, legálnu licenciu, ovládače, aktualizácie, prenos dát a fotiek, funkčný stroj na počkanie. Porovnanie so známym potom prestane byť porovnaním rovnakých vecí.",
  },
  {
    id: "o11",
    text: "Antivírus netreba, ja si dávam pozor.",
    category: "technika",
    meaning:
      "Verí, že hrozba = hlúpe klikanie, a on nekliká. Nevie, že útoky dnes nevyžadujú chybu používateľa (falošné maily bánk, napadnuté weby).",
    uznaj: "„To je dobrý základ, opatrnosť je najlepší prvý filter.“",
    zisti: "„Používate internetbanking alebo platíte kartou online?“",
    odpovedz:
      "Prepoj na jeho svet: „Práve pri bankovníctve už nejde o pozor, falošná stránka banky vyzerá na nerozoznanie. Ochrana je poistka pre peniaze, nie pre počítač.“ Ak naozaj nemá rizikové použitie, netlač, poctivosť nadovšetko.",
    hlbka:
      "Zákazník si hrozbu predstavuje ako vlastnú chybu, napríklad kliknutie na podozrivý odkaz, nevie však, že dnešné útoky často nevyžadujú žiadnu chybu z jeho strany. Príliš netlač, ak naozaj nerobí nič rizikové, ale ak áno, internetbanking, online platby, prepoj ochranu priamo na jeho peniaze, nie na počítač ako taký. Poctivosť tu funguje lepšie než strašenie.",
  },
  {
    id: "o12",
    text: "Načo SSD, veď mi to funguje.",
    category: "technika",
    meaning:
      "Zvykol si na pomalý počítač a nevie, že existuje výrazne lepší stav. Chýba mu predstava rozdielu, vlastnosť „SSD“ mu nič nehovorí.",
    uznaj: "„Funguje, to je pravda, nič nehorí.“",
    zisti: "„Koľko čakáte, kým naštartuje? A prekáža vám to?“",
    odpovedz:
      "Hodnota namiesto parametra: „Toto je najlacnejšia vec, ktorá zmení starý počítač na svižný, štart za pár sekúnd namiesto minút.“ Ideálne ukáž rozdiel naživo na stroji v predajni. Zážitok predá viac než argument.",
    hlbka:
      "Zákazník si zvykol na pomalý stav a nemá porovnanie, ako veľmi iný počítač môže byť. Namiesto technického parametra ukáž konkrétny zážitok, ideálne naživo v predajni, rozdiel v štarte a otváraní programov predá viac než akékoľvek číslo v gigabajtoch za sekundu.",
  },
  {
    id: "o13",
    text: "Minule ste mi to opravili a zase sa to pokazilo.",
    category: "dôvera",
    meaning:
      "Sklamanie a test: dá sa vám ešte veriť? Nezaujíma ho, čia je to vina, zaujíma ho, či sa k tomu postavíte čelom.",
    uznaj: "„To by nahnevalo aj mňa. Poďme sa na to pozrieť.“",
    zisti: "„Čo presne sa deje teraz? Je to to isté, alebo niečo nové?“",
    odpovedz:
      "Žiadne výhovorky, žiadne obviňovanie zákazníka. Zisti fakty: rovnaká porucha (reklamácia opravy, vyrieš veľkoryso) alebo nová vec (vysvetli rozdiel zrozumiteľne). Ako sa zachováš teraz, rozhodne, či máš zákazníka navždy alebo nikdy.",
    hlbka:
      "Zákazníka v tejto chvíli nezaujíma technické vysvetlenie, zaujíma ho, či sa mu dá veriť aj napriek sklamaniu. Zisti fakty bez obviňovania, ide o rovnakú poruchu (rieš ako reklamáciu veľkoryso), alebo o novú vec (vysvetli rozdiel zrozumiteľne a bez výhovoriek). Spôsob, akým sa zachováš práve teraz, rozhodne, či máš zákazníka navždy, alebo nikdy viac.",
  },
  {
    id: "o14",
    text: "Prečo to trvá tak dlho? Potrebujem to hneď.",
    category: "čas",
    meaning:
      "Počítač je jeho pracovný nástroj alebo spojenie so svetom, každý deň bez neho ho niečo stojí. Časová tieseň, možno aj panika.",
    uznaj: "„Rozumiem, bez počítača sa dnes nedá fungovať.“",
    zisti: "„Na čo ho súrne potrebujete? Dá sa niečo z toho vyriešiť hneď?“",
    odpovedz:
      "Rieš jeho skutočný problém, nie len termín: expresný príplatok, zapožičanie náhradného stroja, záchrana najdôležitejších dát na USB hneď na počkanie. A daj realistický termín, ktorý dodržíš, sľúbiť nemožné je horšie než povedať pravdu.",
    hlbka:
      "Za urgenciou často nie je len netrpezlivosť, ale reálna závislosť na zariadení, práca, kontakt s rodinou, podnikanie. Rieš skutočný problém za urgenciou, nie len termín, expresný príplatok, náhradný stroj, záchranu najdôležitejších dát hneď na počkanie. Daj termín, ktorý naozaj dodržíš, sľúbiť nemožné je horšie než povedať nepríjemnú pravdu.",
  },
  {
    id: "o15",
    text: "Bojím sa, že prídem o fotky a dáta.",
    category: "dôvera",
    meaning:
      "Toto nie je technická otázka, ale emočná, fotky detí sa nedajú kúpiť znova. Potrebuje istotu a pocit, že to berieš rovnako vážne ako on.",
    uznaj: "„Úplne oprávnená obava, dáta sú to najcennejšie v celom počítači.“",
    zisti: "„Máte nejakú zálohu? Čo z toho je nenahraditeľné?“",
    odpovedz:
      "Konkrétny postup namiesto chlácholenia: „Prvý krok u nás je záloha, kým nie sú dáta v bezpečí, do stroja nesiahame.“ Ponúkni aj trvalé riešenie (externý disk, cloud), práve vyriešil svoj skutočný problém, nie len dnešnú opravu.",
    hlbka:
      "Toto nie je technická otázka, je to emočná obava, fotky detí alebo spomienky sa nedajú kúpiť znova. Pomenuj postup konkrétne, najprv záloha, až potom zásah do stroja, a ponúkni aj trvalé riešenie do budúcna, externý disk, cloud. Zákazník, ktorému takto vyriešiš skutočný problém, sa stáva stálym zákazníkom, nielen jednorazovou opravou.",
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
      "Nezľavuj automaticky, zľava bez dôvodu učí, že prvá cena bola nafúknutá. Pridaj hodnotu namiesto uberania ceny (služba, príslušenstvo, predĺžená podpora) alebo ponúkni lacnejšiu alternatívu. Ak zľavu dáš, povedz prečo („predvádzací kus“).",
    hlbka:
      "Otázka na zľavu je niekedy len šport, skúsiť sa oplatí, inokedy signál, že hodnota ešte neprevážila cenu v hlave zákazníka. Automatická zľava bez dôvodu učí zákazníka, že prvá cena bola nafúknutá, preto radšej pridaj hodnotu, servis, príslušenstvo, predĺženú podporu, namiesto uberania z ceny. Ak zľavu naozaj dáš, pomenuj dôvod, predvádzací kus, doexpedovaný model, nech to nepôsobí ako ústupok.",
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
      "Poctivá matematika: ak vydrží a vie, že akcia bude, nech počká, tá férovosť sa ti vráti. Ale pomenuj aj druhú stranu: akciové ceny bývajú na vybraných kusoch, a mesiac trápenia s pokazeným strojom má tiež svoju cenu.",
    hlbka:
      "Zákazník kalkuluje s tým, že o mesiac kúpi to isté výrazne lacnejšie, čo nemusí byť pravda, akciové ceny bývajú na vybraných kusoch, nie na všetkom. Poctivo mu pomôž zvážiť aj druhú stranu rovnice, koľko ho stojí mesiac trápenia s pokazeným strojom oproti prípadnej úspore. Ak vydrží čakať a akcia naozaj príde, nechaj ho počkať, tá férovosť sa vracia v odporúčaniach.",
  },
  {
    id: "o18",
    text: "Táto značka je vraj zlá, čítal som recenzie.",
    category: "technika",
    meaning:
      "Chráni sa pred zlým rozhodnutím cudzou skúsenosťou. Recenzie píšu najčastejšie nespokojní, ale jeho obava je skutočná: nechce naletieť.",
    uznaj: "„Dobre, že si veci overujete, recenzie sa oplatí čítať.“",
    zisti: "„Čo konkrétne sa tam písalo? Ktorý model recenzovali?“",
    odpovedz:
      "Neháď recenzie zo stola. Rozlíš model vs. značku (každá značka má vydarené aj nevydarené rady) a doplň vlastnú skúsenosť zo servisu: „My vidíme, čo sa reálne kazí, z tohto radu sa nám nevracia takmer nič.“ Ak má model naozaj zlú povesť, potvrď to a ponúkni iný.",
    hlbka:
      "Recenzie na internete píšu najčastejšie nespokojní zákazníci, čo skresľuje celkový obraz, no obava zákazníka je aj tak skutočná, nechce naletieť. Rozlíš model od značky, každá značka má vydarené aj nevydarené rady, a doplň vlastnú skúsenosť zo servisu, čo sa reálne kazí a čo nie. Ak má konkrétny model naozaj zlú povesť, potvrď to otvorene a ponúkni alternatívu.",
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
      "Bez strašenia vymenuj rozdiely: reklamácia posielaním do zahraničia a v cudzom jazyku, iná klávesnica, doprava, dostupnosť. „Tu prídete s problémom ku mne k pultu.“ Ak mu to aj tak vyjde lepšie, dopraj mu to, a ponúkni, že mu stroj aspoň nastavíš.",
    hlbka:
      "Zákazník vidí nižšiu cenu v zahraničnom e-shope, ale nepočíta s dopravou, jazykovou bariérou pri reklamácii a časom, ktorý to zaberie, keď sa niečo pokazí. Vymenuj rozdiely bez strašenia, reklamáciu do zahraničia, inú klávesnicu, dostupnosť podpory v slovenčine. Ak sa mu to napriek tomu vyplatí, dopraj mu to a ponúkni aspoň nastavenie stroja pri prevzatí.",
  },
  {
    id: "o20",
    text: "Nemám teraz na to peniaze.",
    category: "cena",
    meaning:
      "Buď reálny stav rozpočtu, alebo zdvorilé nie. Ak je potreba skutočná, hľadá cestu, len ju nevidí.",
    uznaj: "„Chápem, netreba sa naťahovať nad možnosti.“",
    zisti: "„Je to o tomto mesiaci, alebo celkovo o sume? Akú sumu by ste vedeli dať?“",
    odpovedz:
      "Ponúkni cesty podľa odpovede: lacnejšia alternatíva alebo repas, splátky ak ich máte, rezervácia do výplaty, prípadne dočasné riešenie („zatiaľ vymeníme len disk, zvyšok vydrží“). Ak je to zdvorilé nie, spoznáš to, a netlač.",
    hlbka:
      "Toto môže byť reálny stav rozpočtu, alebo zdvorilé odmietnutie, rozdiel spoznáš podľa toho, či zákazník aktívne hľadá cestu, keď mu ju ponúkneš. Ponúkni konkrétne možnosti podľa jeho odpovede, lacnejšiu alternatívu, repas, splátky, rezerváciu do výplaty, alebo len čiastočné riešenie. Ak ide o skutočné zdvorilé nie, nechaj to tak bez ďalšieho tlaku.",
  },
  {
    id: "o21",
    text: "Záruka aj tak nič nerieši, to poznám.",
    category: "dôvera",
    meaning:
      "Zlá skúsenosť s reklamáciou v minulosti (jeho alebo z počutia). Neverí sľubom na papieri, verí len tomu, čo zažije.",
    uznaj: "„Zlá skúsenosť s reklamáciou vie človeka odradiť nadlho, to chápem.“",
    zisti: "„Čo sa vám stalo, ak sa smiem opýtať?“",
    odpovedz:
      "Vypočuj celý príbeh, samotné vypočutie je polovica odpovede. Potom konkrétne, ako to beží u vás: kam príde, kto to rieši, dokedy. Rozdiel medzi anonymnou linkou e-shopu a pultom, za ktorým stojíš ty osobne, je tu tvoja najsilnejšia karta.",
    hlbka:
      "Za touto vetou je takmer vždy konkrétna zlá skúsenosť, vlastná alebo z počutia, ktorá zlomila dôveru v sľuby na papieri. Nechaj zákazníka príbeh dokončiť, samotné vypočutie je polovica odpovede, a potom konkrétne vysvetli, ako reklamácia beží u teba, kam príde, kto to rieši, dokedy. Rozdiel medzi anonymnou linkou veľkého e-shopu a pultom, za ktorým stojíš osobne ty, je tu tvoja najsilnejšia karta.",
  },
  {
    id: "o22",
    text: "Chcem len to najlacnejšie, nič extra netreba.",
    category: "rozhodovanie",
    meaning:
      "Buď naozaj minimálne potreby, alebo obranná reakcia, bojí sa, že mu predajca natlačí drahé zbytočnosti. Test tvojej poctivosti.",
    uznaj: "„Jasné, zbytočnosti nemá zmysel platiť.“",
    zisti: "„Na čo to bude slúžiť? Nech vám to najlacnejšie o pol roka nie je najdrahšie.“",
    odpovedz:
      "Ak jeho potrebám najlacnejšie stačí, predaj mu ho s čistým svedomím a povedz mu to, práve si získal jeho dôveru. Ak nestačí, ukáž konkrétny rozdiel v jeho použití („pri desiatich kartách v prehliadači sa tento zadýcha“) a nechaj voľbu na ňom.",
    hlbka:
      "Toto je buď skutočne minimálna potreba, alebo obranná reakcia proti obave, že mu predajca natlačí drahé zbytočnosti, čo je aj test tvojej poctivosti. Ak jeho potrebám najlacnejšie naozaj stačí, predaj mu ho s čistým svedomím a otvorene mu to povedz, práve si získal jeho dôveru na dlho. Ak nestačí, ukáž konkrétny rozdiel v jeho reálnom použití, nie v abstraktných parametroch, a rozhodnutie nechaj na ňom.",
  },
  {
    id: "o23",
    text: "Starý ešte doslúži, načo nový.",
    category: "rozhodovanie",
    meaning:
      "Šetrnosť a vzťah k veciam, nechce vyhadzovať funkčné. Nevidí skryté náklady starého stroja (čas, riziko zlyhania, dáta bez zálohy).",
    uznaj: "„To je rozumný prístup, vyhadzovať funkčné veci netreba.“",
    zisti: "„Čo by sa stalo, keby vám zajtra doobeda vypovedal? Máte dáta zálohované?“",
    odpovedz:
      "Netlač na výmenu, ponúkni plán: dnes záloha dát a kontrola stavu, výmena až keď to bude treba. Ak stroj reálne dosluhuje, povedz čo presne odchádza a prečo je lepšie vymeniť ho plánovane než v paniku, keď zlyhá.",
    hlbka:
      "Zákazník si cení šetrnosť a nechce vyhadzovať funkčnú vec, čo je v poriadku, len nevidí skryté náklady starého stroja, čas, riziko náhleho zlyhania, dáta bez zálohy. Netlač na výmenu, ponúkni plán, dnes záloha a kontrola stavu, výmena až keď to bude naozaj treba. Ak stroj reálne dosluhuje, povedz otvorene čo presne odchádza a prečo je lepšie vymeniť plánovane než v panike, keď zlyhá bez varovania.",
  },
  {
    id: "o24",
    text: "Vy mi chcete len niečo predať.",
    category: "dôvera",
    meaning:
      "Otvorená nedôvera, čaká nátlak a chráni sa vopred. Možno má skúsenosť s tlačením na predaj. Toto je test celej tvojej cesty predajcu.",
    uznaj: "„Fér poznámka, ste v predajni, tak je tá ostražitosť namieste.“",
    zisti: "„Čo by vám pomohlo, aby ste mali istotu, že radím vám a nie svojej tržbe?“",
    odpovedz:
      "Najlepšia odpoveď nie je veta, ale správanie: pýtaj sa, počúvaj, pokojne odporuč lacnejšie alebo nič („podľa toho, čo hovoríte, by som zatiaľ nekupoval nič, spravme len X“). Nátlak nula. Tento zákazník sa buduje najdlhšie a vydrží najvernejšie.",
    hlbka:
      "Toto je otvorená nedôvera, zákazník sa chráni vopred, možno má za sebou skúsenosť s nátlakovým predajom. Najlepšia odpoveď nie je veta na obhajobu, je to správanie, pýtaj sa, počúvaj, pokojne odporuč aj lacnejšie riešenie alebo žiadne, ak to tak naozaj je. Nulový nátlak v tejto chvíli buduje zákazníka, ktorý sa vracia najdlhšie a najvernejšie.",
  },

  // --- Nové: konkrétne situácie z predajne a servisu ---
  {
    id: "o25",
    text: "Prečo UV fólia stojí až 35 eur?",
    category: "cena",
    meaning:
      "Zákazník porovnáva cenu fólie s bežnou fóliou z obchodu za pár eur a nevidí rozdiel v materiáli ani v práci, ktorá je v cene zahrnutá.",
    uznaj: "„Chápem, na prvý pohľad je to len tenká fólia, cena vyzerá vysoko.“",
    zisti: "„Porovnávate to s bežnou plastovou fóliou, alebo ste si UV fóliu už niekde kupovali?“",
    odpovedz:
      "Vysvetli, čo je v cene navyše oproti lacnej fólii z drogérie: samoliečivý materiál, presné prispôsobenie zaobleniu displeja, odbornú aplikáciu bez bublín a záruku na aplikáciu. Ak zákazník aj tak volí lacnejšiu alternatívu, ponúkni ju otvorene, nech vie, v čom je rozdiel.",
    hlbka:
      "UV fólia je typický prípad, keď zákazník nevidí prácu a materiál skrytý za výslednou cenou, vidí len tenkú vrstvu na displeji. Rozlož cenu na zložky nahlas, samotný materiál, čas aplikácie, UV lampu na vytvrdenie, a riziko, že sa pri zlej aplikácii musí fólia vyhodiť a začať odznova. Ak máš možnosť, ukáž vedľa seba rozdiel medzi lacnou fóliou a UV fóliou naživo, vizuálne porovnanie presvedčí rýchlejšie než akékoľvek slová.",
  },
  {
    id: "o26",
    text: "Prečo bude oprava trvať 1-2 týždne?",
    category: "čas",
    meaning:
      "Zákazník čaká opravu na počkanie alebo do pár dní a nevie, že konkrétny diel nie je skladom a musí sa objednať.",
    uznaj: "„Rozumiem, dva týždne bez zariadenia je dlho.“",
    zisti: "„Potrebujete ho súrne na niečo konkrétne, alebo je to skôr o tom, čo najskôr ho mať naspäť?“",
    odpovedz:
      "Vysvetli konkrétny dôvod čakania (diel nie je skladom, objednáva sa od dodávateľa) a daj reálny, nie optimistický termín. Ak je to možné, ponúkni alternatívu na preklenutie čakania, náhradný kus, expresné objednanie dielu za príplatok, alebo aspoň priebežnú informáciu, keď diel dorazí.",
    hlbka:
      "Dlhý termín opravy je frustrujúci hlavne vtedy, keď zákazník nerozumie, prečo to trvá práve toľko, ticho v hlave si vyplní domnienkou, že sa na jeho zariadení jednoducho nič nedeje. Buď konkrétny, pomenuj, že diel prichádza od dodávateľa a kedy presne bol objednaný, nie len všeobecné čaká sa. Ak máš možnosť sledovania zásielky alebo aspoň orientačný dátum, zdieľaj ho aktívne, aj bez toho, aby sa zákazník musel sám pýtať, výrazne to znižuje jeho podráždenie.",
  },
  {
    id: "o27",
    text: "Nemám záujem.",
    category: "rozhodovanie",
    meaning:
      "Môže ísť o skutočný nezáujem o ponúkaný produkt či službu, alebo o automatickú obrannú reakciu na čokoľvek, čo znie ako predaj, bez toho, aby si zákazník ponuku vôbec vypočul.",
    uznaj: "„Jasné, žiadny problém.“",
    zisti: "„Len aby som vedel, je to preto, že to nepotrebujete, alebo že podobné veci zvyčajne nekupujete cez predajňu?“",
    odpovedz:
      "Rešpektuj odpoveď bez nátlaku, jedna veta navyše (čo presne ponúkaš a prečo) mu nechá priestor si to rozmyslieť sám, bez pocitu, že naň tlačíš. Nátlak po jasnom nezáujme obvykle len utvrdí zákazníka v tom, že sa mal odmietnutiu vyhnúť ešte dôraznejšie.",
    hlbka:
      "Táto veta je často naučená reakcia na akúkoľvek ponuku, spustí sa skôr, než zákazník vôbec počuje, čo presne ponúkaš. Neber ju osobne a neopakuj rovnakú ponuku inými slovami, radšej sa jednou krátkou otázkou uisti, že vôbec vie, o čo išlo, a nechaj rozhodnutie na ňom. Zákazník, ktorého si nenechal cítiť sa pod tlakom, sa k tebe častejšie vráti nabudúce, aj keď dnes odišiel bez nákupu.",
  },
  {
    id: "o28",
    text: "Nemám čas.",
    category: "čas",
    meaning:
      "Zákazník je v zhone alebo má pocit, že rozhovor, diagnostika či rozhodovanie zaberie viac času, než je ochotný práve teraz investovať.",
    uznaj: "„Chápem, netreba sa naťahovať, poviem vám to naozaj stručne.“",
    zisti: "„Koľko času máte teraz reálne k dispozícii? Stačí vám krátke zhrnutie, alebo sa radšej ozvem neskôr?“",
    odpovedz:
      "Prispôsob tempo aj rozsah informácií tomu, čo zákazník práve povedal, jedna vecná veta namiesto dlhého vysvetľovania. Ak čas naozaj nemá, ponúkni rýchlejšiu alternatívu, telefonát, správu, alebo dohodnutý termín, keď bude môcť venovať pozornosť naplno.",
    hlbka:
      "Nedostatok času je často skutočný, ale rovnako často aj spôsob, ako sa slušne vyhnúť dlhšiemu rozhovoru, ktorý zákazník v tú chvíľu nechce viesť. Neskracuj obsah tak, že vynecháš dôležité informácie, radšej skráť formu, jedna jasná veta miesto piatich. Ak vidíš, že zákazník naozaj ponáhľa, ponúkni mu spôsob, ako pokračovať neskôr bez straty kontextu, napríklad krátku správu alebo spätné zavolanie v dohodnutom čase.",
  },
  {
    id: "o29",
    text: "Drahé ochranné sklá.",
    category: "cena",
    meaning:
      "Podobne ako pri UV fólii, zákazník porovnáva sklo s lacnou verziou z internetu bez ohľadu na kvalitu materiálu, presnosť výrezu a odbornú aplikáciu.",
    uznaj: "„Rozumiem, sklá sa naozaj cenovo dosť líšia.“",
    zisti: "„Kupovali ste už niekedy lacnejšie sklo? Ako to s ním dopadlo?“",
    odpovedz:
      "Vysvetli rozdiel medzi lacným sklom (nepresný výrez, horšia priľnavosť, praská pri náraze) a kvalitným sklom s presným tvrdením a zárukou na prasknutie. Ak zákazník už mal zlú skúsenosť s lacným sklom, táto skúsenosť predá kvalitu sama, stačí sa na ňu opýtať.",
    hlbka:
      "Ochranné sklo je produkt, pri ktorom sa rozdiel v kvalite prejaví až pri páde telefónu, teda v momente, keď je už neskoro to riešiť. Priprav si konkrétny argument, čo presne robí sklo kvalitným, tvrdosť, presnosť výrezu okolo kamery a snímača, spôsob, akým sa rozbije, praskne sklo, nie displej. Ak máš skúsenosť z vlastnej predajne s tým, koľko displejov zachránilo práve kvalitné sklo, konkrétny príklad presvedčí viac než technický popis.",
  },
  {
    id: "o30",
    text: "Prečo nepredávate obaly so šnúrkami?",
    category: "sortiment",
    meaning:
      "Zákazník má konkrétnu predstavu produktu, ktorý v ponuke nenašiel, a pýta sa, či ide o zámer, alebo len o dočasnú medzeru v sortimente.",
    uznaj: "„Dobrá otázka, momentálne ich naozaj v ponuke nemáme.“",
    zisti: "„Hľadáte konkrétny typ šnúrky alebo farbu? Je to na bežné nosenie, alebo napríklad do práce?“",
    odpovedz:
      "Ak vieš, kedy alebo či sa taký tovar plánuje doskladniť, povedz to otvorene, prípadne ponúkni podobnú alternatívu, ktorú aktuálne máš. Ak dopyt po danom produkte počuješ opakovane od viacerých zákazníkov, je to cenná spätná väzba pre budúce doplnenie sortimentu.",
    hlbka:
      "Otázka na chýbajúci produkt nie je klasická námietka proti kúpe, je to signál nevyužitej príležitosti, zákazník ti priamo hovorí, čo by si u teba kúpil, keby si to mal. Neuzavri rozhovor jednoduchým nemáme, radšej zisti presnejšie, čo presne hľadá, a ponúkni najbližšiu alternatívu z aktuálnej ponuky. Ak sa podobná otázka opakuje častejšie, je to dobrý dôvod sortiment naozaj rozšíriť, nie len ospravedlnenie na jednorazovú stratenú tržbu.",
  },
  {
    id: "o31",
    text: "Prečo nemáte Anker nabíjačky na Samsung?",
    category: "sortiment",
    meaning:
      "Zákazník hľadá konkrétnu značku príslušenstva, ktorú pozná a dôveruje jej, a neuspokojí ho automaticky akákoľvek iná nabíjačka.",
    uznaj: "„Anker je naozaj kvalitná značka, chápem, prečo po nej siahate.“",
    zisti: "„Ide vám hlavne o rýchlosť nabíjania, alebo priamo o tú konkrétnu značku?“",
    odpovedz:
      "Ak máš v ponuke porovnateľnú alternatívu (rovnaký výkon, kompatibilita, záruka), ukáž ju ako rovnocennú náhradu, nie ako núdzové riešenie. Ak zákazník trvá presne na tejto značke, priznaj, že ju momentálne nemáš, a v pokoji ho nechaj rozhodnúť sa, či počká na doskladnenie, alebo zoberie alternatívu.",
    hlbka:
      "Pri značkovom príslušenstve zákazník často nekupuje len funkciu, kupuje si aj istotu, že produkt nezničí batériu telefónu, ktorá je drahá na výmenu. Nezľahčuj jeho preferenciu vetou, veď je to jedno, aká nabíjačka, radšej vysvetli, čím sa tvoja alternatíva reálne vyrovná značke, ktorú hľadá, výkonom aj certifikáciou. Ak sa dopyt po konkrétnej značke opakuje, zváž jej zaradenie do ponuky, strácaš tým opakovane zákazníkov, ktorí presne vedia, čo chcú.",
  },
  {
    id: "o32",
    text: "Ďakujem, ešte pozriem inde.",
    category: "rozhodovanie",
    meaning:
      "Zdvorilá formulácia na odchod z predajne, za ktorou môže byť skutočný zámer porovnať ponuky, alebo len spôsob, ako sa vyhnúť priamemu nie práve tebe.",
    uznaj: "„Jasné, je dobré si to porovnať.“",
    zisti: "„Čo je pre vás pri porovnávaní najdôležitejšie, cena, alebo niečo iné?“",
    odpovedz:
      "Nechaj ho odísť bez nátlaku, ale uľahči mu návrat, daj mu kontakt, prípadne písomné zhrnutie ponuky, nech sa nemusí vracať s prázdnymi rukami k porovnávaniu. Zákazník, ktorý odišiel spokojný s rozhovorom, sa vracia častejšie, aj keď si to práve teraz nekúpil.",
    hlbka:
      "Táto veta je najčastejšie spoločensky prijateľný spôsob, ako ukončiť rozhovor bez toho, aby zákazník musel povedať tvrdé nie priamo do očí. Nesnaž sa ho zadržať ďalšími argumentmi, práve to môže pôsobiť ako nátlak a utvrdí ho v odchode. Namiesto toho mu daj niečo konkrétne na porovnanie, písomnú ponuku, vizitku, zvýšiš tak šancu, že sa po obehnutí konkurencie vráti práve k tebe.",
  },
  {
    id: "o33",
    text: "Včera som tu nechal telefón na servis, prečo to ešte nie je hotové?",
    category: "dôvera",
    meaning:
      "Zákazník mohol mať nerealistickú predstavu o rýchlosti opravy, alebo mu pri prevzatí nebol jasne komunikovaný odhadovaný termín.",
    uznaj: "„Rozumiem, že po dni bez telefónu chcete vedieť, ako to napreduje.“",
    zisti: "„Povedali sme vám pri odovzdaní orientačný termín? Chcete, aby som sa hneď pozrel, v akom je to stave?“",
    odpovedz:
      "Zisti aktuálny stav zákazky priamo pred zákazníkom a vysvetli mu presne, čo sa deje a kedy môže reálne počítať s výsledkom. Ak sa pri prevzatí termín nekomunikoval jasne, priznaj to a nastav očakávania správne do budúcna, nabudúce mu termín napíš aj na potvrdenku.",
    hlbka:
      "Netrpezlivosť po jednom dni väčšinou neznamená, že zákazník je nerozumný, znamená to, že si pri odovzdaní telefónu neodniesol jasnú predstavu, dokedy má čakať. Over si v systéme, v akej fáze presne oprava je, čaká sa na diagnostiku, na diel, na testovanie, a povedz to konkrétne, nie len je to v riešení. Táto situácia je najlepšia príležitosť nastaviť si do budúcna zvyk, vždy pri prevzatí zariadenia povedať jasný, radšej mierne opatrný termín, nech sa podobná otázka neopakuje.",
  },
  {
    id: "o34",
    text: "Prečo to je také drahé? Na internete to stojí 2 eurá.",
    category: "cena",
    meaning:
      "Zákazník porovnáva s extrémne lacnou ponukou (často z ázijských e-shopov), ktorá zvyčajne neberie do úvahy kvalitu materiálu, dodaciu lehotu ani záruku.",
    uznaj: "„Chápem, dva eurá verzus naša cena vyzerá ako obrovský rozdiel.“",
    zisti: "„Videli ste, odkiaľ presne sa to posiela a za ako dlho by vám to prišlo?“",
    odpovedz:
      "Vysvetli, čo dostáva za rozdiel v cene, okamžitú dostupnosť, overenú kvalitu, možnosť reklamácie priamo na mieste, bez čakania týždne na zásielku z druhého konca sveta. Nezľahčuj lacnú alternatívu, len postav vedľa seba, čo presne kupuje za dve eurá a čo za cenu v predajni.",
    hlbka:
      "Extrémne nízka cena z internetu takmer vždy skrýva kompromis, ktorý zákazník v momente porovnávania nevidí, dlhú dodaciu lehotu, žiadnu reálnu záruku, alebo materiál, ktorý sa poškodí pri prvom použití. Neváhaj sa opýtať priamo, či si to už niekedy objednal a ako to dopadlo, väčšina ľudí má s extrémne lacným tovarom už vlastnú skúsenosť. Tvoja výhoda nie je v tom, že sa vyrovnáš cene dva eurá, je v tom, že dokážeš vysvetliť presne, za čo je rozdiel a prečo sa oplatí.",
  },
  {
    id: "o35",
    text: "Už to mám doma.",
    category: "rozhodovanie",
    meaning:
      "Zákazník odmieta konkrétne príslušenstvo (napríklad adaptér) s tým, že rovnaký alebo podobný kus už vlastní, čo môže, ale nemusí byť presne to, čo teraz potrebuje.",
    uznaj: "„Fajn, ak ho máte, netreba kupovať ďalší.“",
    zisti: "„Je to presne rovnaký typ, aký teraz potrebujete, alebo iný konektor či výkon?“",
    odpovedz:
      "Ak sa ukáže, že doma má iný typ, ktorý nebude fungovať alebo bude nabíjať pomalšie, vysvetli konkrétny rozdiel, bez toho, aby si spochybňoval, že niečo doma má. Ak je to naozaj to isté, nechaj to tak, zbytočný predaj duplicitného kusu poškodí dôveru viac, než by pomohla jedna navyše predaná položka.",
    hlbka:
      "Táto námietka sa oplatí overiť, nie automaticky akceptovať, veľa zákazníkov má doma adaptér iného výkonu alebo konektora, než práve potrebuje k novému zariadeniu. Polož jednu konkrétnu otázku, aký má konektor, aký výkon vo wattoch, namiesto všeobecného je to fajn, že ho máte. Ak sa ukáže nesúlad, zákazník oceni, že si mu ušetril nepríjemné prekvapenie doma, nie že si mu chcel len niečo predať navyše.",
  },
  {
    id: "o36",
    text: "Je to nekvalitné.",
    category: "technika",
    meaning:
      "Všeobecná pochybnosť o kvalite produktu alebo náhradného dielu, často bez konkrétneho dôvodu, môže vychádzať zo skúsenosti s iným, lacnejším tovarom v minulosti.",
    uznaj: "„Rozumiem, kvalita je pri tomto type tovaru citlivá téma.“",
    zisti: "„Máte s podobným tovarom už nejakú konkrétnu skúsenosť, ktorá vás k tomu vedie?“",
    odpovedz:
      "Ak ide o náhradný diel, vysvetli pôvod a triedu dielu (originál, kompatibilný overený, s akou zárukou) namiesto všeobecného ubezpečovania, že je to kvalitné. Konkrétne fakty (odkiaľ diel je, aká je na neho záruka, koľko podobných opráv za ním stojí) presvedčia viac než ubezpečenie bez obsahu.",
    hlbka:
      "Slovo nekvalitné je väčšinou skratka za konkrétnu, nevyslovenú obavu, buď z minulej zlej skúsenosti, alebo z toho, že cena je nižšia, než zákazník čakal, a nevie si to inak vysvetliť. Nebráň sa všeobecným ubezpečovaním, radšej sa opýtaj, čo presne robí niečo v jeho očiach kvalitným, a porovnaj to s konkrétnymi vlastnosťami toho, čo ponúkaš. Ak má diel alebo produkt naozaj slabšiu triedu, povedz to otvorene a ponúkni kvalitnejšiu alternatívu, poctivosť tu prevažuje nad snahou predať za každú cenu.",
  },
  {
    id: "o37",
    text: "Bez zľavy to neberiem.",
    category: "cena",
    meaning:
      "Zákazník kladie zľavu ako podmienku obchodu, nie len ako otázku, čo môže byť vyjednávacia taktika, alebo skutočná hranica jeho rozpočtu.",
    uznaj: "„Rozumiem, že zľava je pre vás dôležitá súčasť rozhodnutia.“",
    zisti: "„Je pre vás kľúčová konkrétna suma, na ktorú by ste sa chceli dostať, alebo ide skôr o princíp?“",
    odpovedz:
      "Neustupuj automaticky, over si najprv, akú sumu má na mysli, môže byť bližšie k tvojej cene, než čakáš. Ak zľavu naozaj nemôžeš dať, ponúkni hodnotu inou formou (príslušenstvo, predĺžená podpora) namiesto priameho zníženia ceny, alebo mu úprimne vysvetli, prečo cena stojí presne toľko.",
    hlbka:
      "Ultimátum bez zľavy neberiem je často testovacia veta, ktorá zisťuje, ako pevne stojíš za svojou cenou, nie skutočná hranica, za ktorou zákazník odíde. Neustupuj hneď pri prvom náznaku, pokojná, sebavedomá reakcia, toto je naša cena a toto všetko v nej dostávate, často zákazníka presvedčí viac než okamžitá zľava. Ak napriek tomu odíde, nie je to prehra, zľava daná pod tlakom by ťa stála dôveryhodnosť pri každom ďalšom rokovaní s ním aj s ľuďmi, ktorým ťa odporučí.",
  },
  {
    id: "o38",
    text: "Z Číny to je za euro.",
    category: "konkurencia",
    meaning:
      "Zákazník porovnáva s extrémne lacným tovarom z čínskych e-shopov, pri ktorom si často neuvedomuje riziko nekvalitného materiálu, chýbajúcich certifikácií alebo bezpečnostných rizík (najmä pri nabíjacom príslušenstve).",
    uznaj: "„Áno, z Číny sa dá kúpiť naozaj takmer čokoľvek za euro.“",
    zisti: "„Kupovali ste si už niekedy niečo podobné odtiaľ? Ako dlho vám to vydržalo?“",
    odpovedz:
      "Pri nabíjacom a elektrickom príslušenstve pomenuj konkrétne riziko (chýbajúca certifikácia, riziko poškodenia batérie alebo požiaru, žiadna reálna záruka) namiesto všeobecného je to horšie. Ak zákazník napriek tomu uprednostní lacnejší variant, rešpektuj to, časom si rozdiel v kvalite overí sám a vráti sa s väčšou dôverou.",
    hlbka:
      "Cena za euro z čínskeho e-shopu takmer nikdy nezahŕňa bezpečnostné testovanie, certifikáciu ani reálnu možnosť reklamácie, čo je pri nabíjačkách a batériách rozdiel, ktorý sa nevidí, kým sa niečo nepokazí. Neváhaj byť konkrétny, práve pri elektrike ide okrem peňazí aj o bezpečnosť zariadenia aj domácnosti, to je argument, ktorý má váhu nad rámec ceny. Zároveň rešpektuj, že nie každý zákazník si túto investíciu môže alebo chce dovoliť, ponúkni preto aj strednú cenovú variantu, ak ju máš, nie len najdrahšiu možnosť.",
  },
];

export const OBJECTION_CATEGORIES = [
  { id: "cena", label: "Cena" },
  { id: "konkurencia", label: "Konkurencia" },
  { id: "čas", label: "Čas" },
  { id: "dôvera", label: "Dôvera" },
  { id: "technika", label: "Technika" },
  { id: "rozhodovanie", label: "Rozhodovanie" },
  { id: "sortiment", label: "Sortiment" },
] as const;

// Banka myšlienok o predaji a mindsete: skutočné citáty od uznávaných predajcov,
// obchodníkov a autorov (Zig Ziglar, Brian Tracy, Jeffrey Gitomer, Dale Carnegie, Jim Rohn,
// Napoleon Hill, Grant Cardone a ďalší), voľne preložené do slovenčiny, s vlastným rozborom.
// Vlastné myšlienky si používateľ pridáva priamo v appke, v sekcii „Moje myšlienky“.

export interface Thought {
  id: string;
  text: string;
  author?: string;
  category: "mindset" | "predaj" | "vytrvalosť" | "zákazník" | "disciplína" | "rast" | "sebadôvera";
  detail?: string;
}

export const THOUGHTS: Thought[] = [
  // --- Mindset ---
  {
    id: "t1",
    text: "Tvoj postoj, nie tvoj talent, určí, ako vysoko sa dostaneš.",
    author: "Zig Ziglar",
    category: "mindset",
    detail:
      "Dvaja predajcovia môžu poznať rovnaké produkty aj rovnaké techniky, no ten s lepším postojom bude dlhodobo úspešnejší. Postoj sa dá trénovať rovnako ako zručnosť, stačí si každé ráno vedome vybrať, s akou náladou vstúpiš k prvému zákazníkovi.",
  },
  {
    id: "t2",
    text: "Predaj je v podstate prenos pocitov.",
    author: "Zig Ziglar",
    category: "mindset",
    detail:
      "Zákazník necíti tabuľku parametrov, cíti tvoju istotu a nadšenie pre riešenie, ktoré mu ponúkaš. Ak neveríš tomu, čo predávaš, tvoja neistota sa prenesie na neho skôr než akýkoľvek argument.",
  },
  {
    id: "t3",
    text: "Ľudia nekupujú z logických dôvodov. Kupujú z emocionálnych dôvodov.",
    author: "Zig Ziglar",
    category: "mindset",
    detail:
      "Racionálne argumenty zákazníka presvedčia, až keď mu najprv dáš emocionálny dôvod chcieť to, čo ponúkaš. Preto najprv zisti, čo cíti (obavu, túžbu, úľavu), a až potom to podlož faktami.",
  },
  {
    id: "t4",
    text: "Každý predaj má päť základných prekážok: žiadna potreba, žiadne peniaze, žiadny spech, žiadna túžba, žiadna dôvera.",
    author: "Zig Ziglar",
    category: "mindset",
    detail:
      "Skôr než začneš presviedčať, over si, ktorá z piatich prekážok naozaj bráni obchodu, lebo na každú platí iné riešenie. Predávať riešenie na neexistujúci problém je strata času pre teba aj zákazníka.",
  },
  {
    id: "t5",
    text: "Úspech v predaji je z 80 percent postoj a z 20 percent schopnosti.",
    author: "Brian Tracy",
    category: "mindset",
    detail:
      "Zručnosti sa dajú naučiť pomerne rýchlo, ale bez správneho postoja ich prestaneš používať pri prvom náročnejšom zákazníkovi. Investuj do svojho nastavenia hlavy rovnako vedome, ako investuješ do produktových školení.",
  },
  {
    id: "t6",
    text: "Nečakaj na správnu chvíľu, tá nikdy nepríde. Začni tam, kde stojíš, a použi nástroje, ktoré máš po ruke.",
    author: "Napoleon Hill",
    category: "mindset",
    detail:
      "Čakanie na dokonalé podmienky je najčastejšia výhovorka na odklad. Začni s tým, čo vieš a máš teraz, zvyšok sa doplní cestou.",
  },
  {
    id: "t7",
    text: "Svet si vždy nájde miesto pre človeka, ktorého slová a činy ukazujú, že vie, kam smeruje.",
    author: "Napoleon Hill",
    category: "mindset",
    detail:
      "Zákazník aj kolegovia vycítia, keď máš jasný smer a vieš, prečo robíš to, čo robíš. Táto istota v hlase a v postoji otvára dvere, ktoré sa neistému predajcovi nikdy neotvoria.",
  },
  {
    id: "t8",
    text: "Ľudia nemajú radi, keď im niekto predáva. Ale milujú nakupovať.",
    author: "Jeffrey Gitomer",
    category: "mindset",
    detail:
      "Nikto nechce mať pocit, že mu niečo vnucujú, ale každý rád nakupuje, keď má pocit kontroly nad rozhodnutím. Tvoja úloha nie je tlačiť, ale sprevádzať zákazníka k rozhodnutiu, ktoré urobí sám za seba.",
  },
  {
    id: "t9",
    text: "Buď riadiš svoj deň, alebo deň riadi teba.",
    author: "Jim Rohn",
    category: "mindset",
    detail:
      "Ak si deň neriadiš vedome, riadi sa sám a zvyčajne najhoršie. Pár minút ranného plánovania (kto je na rade, s čím si poradiť ako prvým) ušetrí hodiny chaosu.",
  },
  {
    id: "t10",
    text: "Čokoľvek si dokáže myseľ predstaviť a uveriť tomu, to dokáže aj dosiahnuť.",
    author: "Napoleon Hill",
    category: "mindset",
    detail:
      "Než uveríš, že vieš danému zákazníkovi pomôcť, tvoje slová to budú prezrádzať. Jasná predstava výsledku (spokojný zákazník, uzavretý obchod) ťa vedie k krokom, ktoré k nej reálne smerujú.",
  },
  {
    id: "t11",
    text: "Staneš sa tým, na čo najviac myslíš.",
    author: "Earl Nightingale",
    category: "mindset",
    detail:
      "Ak celý deň premýšľaš nad tým, čo sa môže pokaziť, presne to sa ti bude diať častejšie. Sústreď pozornosť na to, čomu chceš, aby sa v obchode darilo.",
  },
  {
    id: "t12",
    text: "Ak sa nevidíš ako víťaz, nemôžeš hrať ako víťaz.",
    author: "Zig Ziglar",
    category: "mindset",
    detail:
      "Spôsob, akým sa vidíš pred zrkadlom pred zmenou, ovplyvňuje, ako budeš pôsobiť pred prvým zákazníkom. Víťazný postoj nie je arogancia, je to tichá istota, že vieš pomôcť.",
  },
  {
    id: "t13",
    text: "Narodil si sa, aby si vyhrával. Ale aby si sa víťazom aj stal, musíš na výhru myslieť, pripraviť sa na ňu a očakávať ju.",
    author: "Zig Ziglar",
    category: "mindset",
    detail:
      "Túžba vyhrávať nestačí, potrebuješ plán, prípravu a očakávanie úspechu, inak zostane len pri prianí. Priprav sa na deň tak, akoby si už vedel, že bude dobrý.",
  },

  // --- Predaj ---
  {
    id: "t79",
    text: "Kto prvý povie cenu, prehráva vyjednávanie. Kto prvý zdôvodní cenu, uzatvára obchod.",
    author: "Jeffrey Gitomer",
    category: "predaj",
    detail:
      "V rokovaní o cene má navrch ten, kto počká, kým protistrana povie číslo ako prvá. Ak musíš cenu povedať prvý, hneď ju podlož hodnotou, ktorú za ňu zákazník dostane.",
  },
  {
    id: "t80",
    text: "Toto nie je tvrdý predaj. Je to predaj srdcom.",
    author: "Jeffrey Gitomer",
    category: "predaj",
    detail:
      "Otázky položené z úprimného záujmu o riešenie problému pôsobia inak než otázky položené s cieľom dotlačiť k podpisu. Zákazník rozdiel medzi predajom srdcom a predajom naostro vždy vycíti.",
  },
  {
    id: "t81",
    text: "Malý denný pokrok sa časom nasčíta na veľké výsledky.",
    author: "Brian Tracy",
    category: "predaj",
    detail:
      "Jedno percento zlepšenia denne, napríklad lepšia otváracia veta alebo presnejšia otázka, sa za mesiace nasčíta na výrazne lepšie výsledky. Netreba čakať na jednu veľkú zmenu, stačí sústavné drobné zlepšovanie.",
  },
  {
    id: "t82",
    text: "Ku každému zákazníkovi pristupuj s myšlienkou, že mu pomáhaš vyriešiť problém alebo dosiahnuť cieľ, nie že mu predávaš produkt či službu.",
    author: "Brian Tracy",
    category: "predaj",
    detail:
      "Keď vstúpiš do rozhovoru s cieľom vyriešiť problém zákazníka, a nie predať konkrétny kus tovaru, prirodzene sa spýtaš na správne otázky. Táto zmena zámeru mení aj to, ako ťa zákazník vníma.",
  },
  {
    id: "t83",
    text: "Keď hovoríš so záujemcom, pamätaj, že vo väčšine prípadov ti rád poskytne dôležité informácie, ak oň jednoducho požiadaš.",
    author: "Zig Ziglar",
    category: "predaj",
    detail:
      "Väčšina zákazníkov ti rada povie, čo potrebuje, ak sa jednoducho a úprimne spýtaš. Predajcovia sa často boja pýtať, hoci zákazník na otázku iba čaká.",
  },
  {
    id: "t84",
    text: "Odlíš sa hodnotou, alebo zomri na cenu.",
    author: "Jeffrey Gitomer",
    category: "predaj",
    detail:
      "Ak sa nevieš odlíšiť ničím iným než nižšou cenou, skôr či neskôr prehráš s niekým, kto zľavu dá ešte väčšiu. Odlíš sa servisom, odbornosťou a starostlivosťou, ktoré sa cenou nedajú jednoducho kopírovať.",
  },
  {
    id: "t85",
    text: "Cena je to, čo zaplatíš. Hodnota je to, čo dostaneš.",
    author: "Warren Buffett",
    category: "predaj",
    detail:
      "Cena je číslo na cenovke, hodnota je to, čo zákazník reálne získa: funkčnosť, istotu, čas, pokoj. Tvoja úloha predajcu je preklopiť rozhovor z ceny na hodnotu skôr, než sa zákazník rozhodne len podľa čísla.",
  },
  {
    id: "t86",
    text: "Odporúčanie je najľahší predaj na svete.",
    author: "Jeffrey Gitomer",
    category: "predaj",
    detail:
      "Odporúčaný zákazník prichádza už s dôverou, ktorú si si u niekoho iného vybudoval, takže predaj je oveľa jednoduchší. Oplatí sa preto o odporúčania aktívne a slušne požiadať, nielen na ne čakať.",
  },
  {
    id: "t87",
    text: "Najlepší spôsob, ako niečo predať, je prestať predávať a začať pomáhať.",
    author: "Zig Ziglar",
    category: "predaj",
    detail:
      "V momente, keď prestaneš tlačiť na predaj a začneš skutočne pomáhať vyriešiť problém, sa paradoxne predáva ľahšie. Zákazník cíti rozdiel medzi predavačom a poradcom.",
  },
  {
    id: "t88",
    text: "Predaj je výsledok, nie cieľ. Je to funkcia mnohých vecí urobených správne, od chvíle, keď si vytipuješ potenciálneho zákazníka, až kým obchod nedotiahneš do konca.",
    author: "Jill Konrath",
    category: "predaj",
    detail:
      "Predaj nie je jedna veľká akcia na konci, je to súčet mnohých malých vecí urobených správne od prvého kontaktu až po podpis. Sústreď sa na to, čo môžeš urobiť dobre práve teraz, výsledok príde ako súčet týchto krokov.",
  },
  {
    id: "t89",
    text: "Najlepšie predajné otázky majú v sebe zabalenú tvoju odbornosť.",
    author: "Jill Konrath",
    category: "predaj",
    detail:
      "Najlepšia predajná otázka v sebe nesie aj kus tvojej odbornosti, napríklad upozorní zákazníka na niečo, na čo by sám nepomyslel. Takáto otázka buduje dôveru rýchlejšie než akékoľvek tvrdenie o tom, že si odborník.",
  },
  {
    id: "t90",
    text: "Nepredávaj steak. Predávaj syčanie na panvici.",
    author: "Elmer Wheeler",
    category: "predaj",
    detail:
      "Zákazník si nekupuje technické parametre, kupuje si pocit a výsledok, ktorý mu tie parametre prinesú. Preklop každú vlastnosť produktu na konkrétny úžitok, ktorý si zákazník vie predstaviť.",
  },
  {
    id: "t91",
    text: "Nepýtaj sa, či. Pýtaj sa, ktoré.",
    author: "Elmer Wheeler",
    category: "predaj",
    detail:
      "Otázka „Chcete si to vziať?“ necháva zákazníkovi jednoduchú možnosť odmietnuť. Otázka „Chcete radšej variant A, alebo B?“ ho posúva rovno k rozhodnutiu, ktoré si vyberie.",
  },
  {
    id: "t92",
    text: "Úspech nastáva vtedy, keď sa stretne príležitosť s prípravou.",
    author: "Zig Ziglar",
    category: "predaj",
    detail:
      "Šťastie v predaji väčšinou vyzerá ako náhoda zvonku, no v skutočnosti je to stretnutie pripraveného predajcu so správnou príležitosťou. Čím lepšie si pripravený, tým viac príležitostí si všimneš a využiješ.",
  },
  {
    id: "t93",
    text: "Za každý predaj, ktorý ti unikne pre prílišné nadšenie, ti unikne sto ďalších pre nedostatok nadšenia.",
    author: "Zig Ziglar",
    category: "predaj",
    detail:
      "Prehnané nadšenie ti občas pokazí jeden obchod, ale nedostatok nadšenia ťa stojí desiatky ďalších. V pochybnostiach je lepšie ukázať o niečo viac energie a záujmu než menej.",
  },

  // --- Vytrvalosť ---
  {
    id: "t14",
    text: "Pád je súčasť života. Vstať znova je súčasť života úspešného človeka.",
    author: "Zig Ziglar",
    category: "vytrvalosť",
    detail:
      "Každý predajca má dni, keď nič nevyjde. Rozdiel medzi ním a úspešným kolegom je len v tom, ako rýchlo sa nadýchne a ide za ďalším zákazníkom.",
  },
  {
    id: "t15",
    text: "Nemusíš byť skvelý, aby si začal. Musíš začať, aby si sa stal skvelým.",
    author: "Zig Ziglar",
    category: "vytrvalosť",
    detail:
      "Čakanie, kým budeš dokonale pripravený, ťa len oberá o skúsenosti, ktoré ťa dokonalým urobia. Prvý neistý rozhovor so zákazníkom je vždy horší než stý.",
  },
  {
    id: "t16",
    text: "Prichádzame o sto percent obchodov, o ktoré sa nepýtame.",
    author: "Zig Ziglar",
    category: "vytrvalosť",
    detail:
      "Strach z odmietnutia ťa niekedy odradí od toho, aby si sa vôbec spýtal, či si zákazník chce vziať produkt domov. Bez tej otázky je odpoveď automaticky nie.",
  },
  {
    id: "t17",
    text: "Odmietnutia ti umožňujú presmerovať energiu tam, kde to naozaj funguje.",
    author: "Brian Tracy",
    category: "vytrvalosť",
    detail:
      "Odmietnutie ti hovorí, kde tvoj prístup nefunguje, aby si energiu presunul tam, kde funguje. Sleduj, po akom type ponuky alebo otázky prichádza najviac nie, a uprav ich.",
  },
  {
    id: "t18",
    text: "Najistejšia cesta k úspechu je skúsiť to ešte raz.",
    author: "Brian Tracy",
    category: "vytrvalosť",
    detail:
      "Veľa obchodov sa uzavrie až pri druhom alebo treťom kontakte, nie pri prvom. Kým sa neozveš znova, nevieš, či zákazník naozaj povedal definitívne nie.",
  },
  {
    id: "t19",
    text: "Nemám žiadny zázračný vzorec. Tvrdo pracujem a nevzdávam sa.",
    author: "Jeffrey Gitomer",
    category: "vytrvalosť",
    detail:
      "Za zdanlivo ľahkým úspechom skúsených predajcov je väčšinou len o dosť viac odrobeného počítania telefonátov a rozhovorov. Vytrvalosť poráža talent, ktorý sa vzdá skôr.",
  },
  {
    id: "t20",
    text: "Úspech sa buduje z neúspechov. Sklamanie a zlyhanie sú najistejšie odrazové mostíky k úspechu.",
    author: "Dale Carnegie",
    category: "vytrvalosť",
    detail:
      "Každé zlyhanie obsahuje presnú informáciu o tom, čo nabudúce urobiť inak, ak si ju z neho vieš vziať. Sklamanie bez poučenia je strata, sklamanie s poučením je investícia.",
  },
  {
    id: "t21",
    text: "Nič na svete nenahradí vytrvalosť. Talent ju nenahradí, nič nie je bežnejšie než neúspešní ľudia s talentom. Jedine vytrvalosť a odhodlanie sú všemocné.",
    author: "Calvin Coolidge",
    category: "vytrvalosť",
    detail:
      "Talentovaní ľudia, ktorí sa vzdajú, dosiahnu menej než priemerní, ktorí vydržia. V predaji rozhoduje väčšinou to, kto vydrží o jeden telefonát alebo jednu návštevu dlhšie.",
  },
  {
    id: "t22",
    text: "K úspechu som sa prepracoval cez množstvo zlyhaní.",
    author: "Thomas Edison",
    category: "vytrvalosť",
    detail:
      "Neúspech nie je opak úspechu, je to jeho súčasť, ak si z neho vezmeš, čo funguje a čo nie. Každé zlyhanie ťa posúva o krok bližšie k správnemu postupu.",
  },
  {
    id: "t23",
    text: "Ak prechádzaš peklom, pokračuj ďalej.",
    author: "Winston Churchill",
    category: "vytrvalosť",
    detail:
      "Sú obdobia v predaji, napríklad slabý mesiac alebo séria odmietnutí, kedy jediné správne rozhodnutie je nezastaviť sa uprostred. Pokračovanie samo osebe je už polovica riešenia.",
  },
  {
    id: "t24",
    text: "Vydržím, kým neuspejem.",
    author: "Og Mandino",
    category: "vytrvalosť",
    detail:
      "Rozhodnutie nevzdať sa vopred, bez ohľadu na počet nie, ťa oslobodí od potreby vyhrávať každý jednotlivý rozhovor. Stačí vyhrať dostatočne veľa z nich.",
  },
  {
    id: "t25",
    text: "Nikdy sa nehanbi za to, že si to skúsil a zlyhal. Hanbi sa za to, že si to nikdy neskúsil.",
    author: "Og Mandino",
    category: "vytrvalosť",
    detail:
      "Hanba patrí k tomu, kto sa nikdy neodvážil skúsiť, nie k tomu, komu sa niečo nepodarilo. Odvaha osloviť náročného zákazníka je hodnota sama osebe, bez ohľadu na výsledok.",
  },
  {
    id: "t26",
    text: "Väčšinu dôležitých vecí na svete dosiahli ľudia, ktorí sa snažili ďalej aj vtedy, keď sa zdalo, že niet žiadnej nádeje.",
    author: "Dale Carnegie",
    category: "vytrvalosť",
    detail:
      "Väčšina veľkých obchodov v kariére prišla presne vtedy, keď to už vyzeralo beznádejne. Vzdanie sa tesne pred úspechom je najčastejšia chyba inak vytrvalých ľudí.",
  },

  // --- Zákazník ---
  {
    id: "t27",
    text: "Môžeš mať v živote všetko, čo chceš, ak pomôžeš dostatku iných ľudí získať to, čo chcú oni.",
    author: "Zig Ziglar",
    category: "zákazník",
    detail:
      "Ak dôsledne riešiš skutočnú potrebu zákazníka namiesto svojho čísla na konci mesiaca, tržba príde ako vedľajší produkt dôvery. Táto zmena perspektívy je najrýchlejšia cesta k dlhodobým zákazníkom.",
  },
  {
    id: "t28",
    text: "Keď sa zákazník sťažuje, mal by si sa tešiť. Je to veľká príležitosť na ďalší obchod.",
    author: "Zig Ziglar",
    category: "zákazník",
    detail:
      "Sťažujúci sa zákazník ti ešte dáva šancu, ticho nespokojný zákazník už len odchádza ku konkurencii bez slova. Ber každú sťažnosť ako pozvanie, nie ako útok.",
  },
  {
    id: "t29",
    text: "Dobré otázky sa rýchlo dostanú k jadru problému a zákazník nemá pocit, že ho niekto tlačí.",
    author: "Jeffrey Gitomer",
    category: "zákazník",
    detail:
      "Otázka položená s úprimným záujmom pôsobí úplne inak než tá istá otázka položená s cieľom niečo predať. Zákazník cíti rozdiel medzi vypočúvaním a záujmom.",
  },
  {
    id: "t30",
    text: "Skvelí predajcovia budujú vzťahy, prinášajú hodnotu a pomáhajú zákazníkom vyhrávať.",
    author: "Jeffrey Gitomer",
    category: "zákazník",
    detail:
      "Predaj, ktorý sa skončí podpisom, je jednorazový. Predaj, ktorý sa skončí vzťahom, sa vracia každý rok aj s odporúčaniami.",
  },
  {
    id: "t31",
    text: "Kľúč k majstrovstvu v predaji je preklopiť vety o sebe na vety o zákazníkovi.",
    author: "Jeffrey Gitomer",
    category: "zákazník",
    detail:
      "Zákazníka nezaujíma, aký si dobrý predajca, zaujíma ho, čo pre neho konkrétne znamená to, čo mu ponúkaš. Preber každú vetu o sebe a produkte a preformuluj ju na vetu o jeho výhode.",
  },
  {
    id: "t32",
    text: "Jediný spôsob, ako niekoho prinútiť niečo urobiť, je dať mu to, čo chce.",
    author: "Dale Carnegie",
    category: "zákazník",
    detail:
      "Presviedčanie proti vôli zákazníka nefunguje dlhodobo. Zisti, čo skutočne chce, a ukáž mu, ako sa to prieniká s tým, čo ponúkaš.",
  },
  {
    id: "t33",
    text: "Rozprávaj sa s niekým o ňom samotnom a bude ťa počúvať celé hodiny.",
    author: "Dale Carnegie",
    category: "zákazník",
    detail:
      "Keď necháš zákazníka rozprávať o jeho probléme, jeho stroji, jeho starostiach, urobí to za teba väčšinu predajnej práce. Ľudia najradšej počúvajú samých seba.",
  },
  {
    id: "t34",
    text: "Námietky ber ako žiadosť o ďalšie informácie.",
    author: "Brian Tracy",
    category: "zákazník",
    detail:
      "Námietka nie je odmietnutie, je to signál, že zákazník potrebuje ešte jeden kúsok informácie, aby sa rozhodol. Zmena tohto vnímania ti zoberie strach z námietok úplne.",
  },
  {
    id: "t35",
    text: "Existuje len jeden šéf, zákazník. Ten môže vyhodiť každého vo firme, od predsedu nižšie, jednoducho tým, že minie peniaze inde.",
    author: "Sam Walton",
    category: "zákazník",
    detail:
      "Nech je akákoľvek firemná hierarchia, o výplate v konečnom dôsledku rozhoduje spokojnosť zákazníka, nie nadriadený. Táto pravda platí rovnako v malej predajni ako vo veľkom reťazci.",
  },
  {
    id: "t36",
    text: "Dostaň sa k svojim zákazníkom bližšie než kedykoľvek predtým. Tak blízko, že im povieš, čo potrebujú, skôr než si to sami uvedomia.",
    author: "Steve Jobs",
    category: "zákazník",
    detail:
      "Čím lepšie poznáš svojich stálych zákazníkov, tým skôr rozpoznáš, čo budú potrebovať ešte predtým, než ti to povedia. Táto predvídavosť buduje povesť odborníka, nie predavača.",
  },
  {
    id: "t37",
    text: "Na svojich zákazníkov sa pozeraj ako na pozvaných hostí na večierku, kde si ty hostiteľ.",
    author: "Jeff Bezos",
    category: "zákazník",
    detail:
      "Ak sa na zákazníka pozeráš ako na hosťa vo svojom dome, prirodzene sa oňho staráš inak, než keď v ňom vidíš len číslo na účtenke. Táto zmena optiky sa prejaví v každom detaile obsluhy.",
  },
  {
    id: "t38",
    text: "Keď prestaneš hovoriť, stratil si zákazníka. Keď sa otočíš chrbtom, stratil si ho úplne.",
    author: "Estée Lauder",
    category: "zákazník",
    detail:
      "Prílišné rozprávanie o produkte zahlcuje zákazníka a odvádza pozornosť od jeho vlastného rozhodovania. Vedieť sa v správnej chvíli odmlčať je rovnako dôležitá zručnosť ako vedieť hovoriť.",
  },
  {
    id: "t39",
    text: "Cieľom firmy je mať zákaznícky servis, ktorý nie je len najlepší, ale legendárny.",
    author: "Sam Walton",
    category: "zákazník",
    detail:
      "Priemerný servis zákazník rýchlo zabudne, výnimočný servis mu porozpráva ďalším ľuďom. Rozdiel medzi nimi je väčšinou v maličkostiach, ktoré firma robí navyše bez toho, aby si to zákazník vypýtal.",
  },

  // --- Disciplína ---
  {
    id: "t40",
    text: "Osobná disciplína, keď sa stane spôsobom života v osobnej, rodinnej aj pracovnej oblasti, ti umožní dosiahnuť neuveriteľné veci.",
    author: "Zig Ziglar",
    category: "disciplína",
    detail:
      "Disciplína, ktorú držíš len keď sa ti chce, nie je disciplína, je to nálada. Skutočný účinok sa dostaví, až keď sa určité návyky stanú automatickými bez ohľadu na náladu.",
  },
  {
    id: "t41",
    text: "Opakovanie je matkou učenia, otcom činu, a preto je architektom úspechu.",
    author: "Zig Ziglar",
    category: "disciplína",
    detail:
      "Prvý rozhovor o novom produkte býva neistý, desiaty už znie prirodzene. Opakovanie premieňa vedomé úsilie na podvedomú zručnosť.",
  },
  {
    id: "t42",
    text: "Disciplína je most medzi cieľmi a ich dosiahnutím.",
    author: "Jim Rohn",
    category: "disciplína",
    detail:
      "Cieľ bez disciplíny zostáva len prianím. Disciplína je to, čo prevedie tvoj plán z papiera do skutočných výsledkov deň čo deň.",
  },
  {
    id: "t43",
    text: "Nácvik má rovnakú hodnotu ako predaj. Predaj ťa uživí, zručnosť ti prinesie majetok.",
    author: "Jim Rohn",
    category: "disciplína",
    detail:
      "Čas strávený cvičením argumentov a odpovedí na námietky sa neprejaví hneď, ale postupne buduje zručnosť, ktorá ti prináša príjem roky. Jeden predaj ťa uživí, zručnosť ťa uživí opakovane.",
  },
  {
    id: "t44",
    text: "Pracuj na sebe tvrdšie než na svojej práci.",
    author: "Jim Rohn",
    category: "disciplína",
    detail:
      "Investícia do vlastného rozvoja, napríklad čítanie, tréning alebo sebareflexia, sa prejaví vo všetkých budúcich obchodoch, nielen v tom najbližšom. Kto rastie ako človek, rastie aj ako predajca.",
  },
  {
    id: "t45",
    text: "Rozdiel medzi úspešnými a neúspešnými ľuďmi je v tom, že úspešní hľadajú problémy, ktoré môžu vyriešiť. Neúspešní sa im snažia vyhnúť.",
    author: "Grant Cardone",
    category: "disciplína",
    detail:
      "Neúspešní ľudia míňajú energiu na to, aby sa problému vyhli, úspešní ju investujú do jeho vyriešenia. Táto jedna zmena v prístupe rozhoduje o tom, kto z náročného zákazníka odíde s obchodom a kto bez neho.",
  },
  {
    id: "t46",
    text: "Každý deň urob niečo pre zlepšenie svojich kľúčových zručností.",
    author: "Brian Tracy",
    category: "disciplína",
    detail:
      "Zručnosť v kladení otázok, v počúvaní alebo v uzatváraní obchodu sa nezlepší sama od seba. Vyhraď si krátky čas denne na vedomé zlepšovanie jednej konkrétnej zručnosti.",
  },
  {
    id: "t47",
    text: "Disciplína znamená ukázať sa bez ohľadu na okolnosti. Začína pri maličkostiach, ako kedy spíš, kedy vstávaš a čo urobíš ako prvé po prebudení.",
    author: "Grant Cardone",
    category: "disciplína",
    detail:
      "Malé návyky, napríklad kedy vstávaš alebo ako začínaš deň, určujú, koľko disciplíny ti zostane na väčšie výzvy. Poriadok v maličkostiach sa prenáša aj do práce so zákazníkmi.",
  },
  {
    id: "t48",
    text: "V živote nikdy nemôžeš urobiť príliš veľa akcie. Môžeš urobiť len príliš málo.",
    author: "Grant Cardone",
    category: "disciplína",
    detail:
      "Väčšina predajcov robí príliš málo aktivít (telefonátov, oslovení, follow-upov), nie príliš veľa. Kým sa neuistíš, že robíš dosť, neobviňuj z výsledkov trh alebo zákazníkov.",
  },
  {
    id: "t49",
    text: "Tri veľké predpoklady na dosiahnutie čohokoľvek hodnotného sú tvrdá práca, vytrvalosť a zdravý rozum.",
    author: "Thomas Edison",
    category: "disciplína",
    detail:
      "Tvrdá práca bez vytrvalosti sa vzdá pri prvej prekážke, vytrvalosť bez zdravého rozumu sa minie na nesprávne veci. Potrebuješ všetky tri naraz.",
  },
  {
    id: "t50",
    text: "Každé ráno privítaj s úsmevom. Buď sám sebe hýbateľom a nech prvá hodina dňa určí tému úspechu, ktorá sa bude niesť celým dňom.",
    author: "Og Mandino",
    category: "disciplína",
    detail:
      "Spôsob, akým začneš deň, s úsmevom alebo s otrávením, nastavuje tón na hodiny dopredu. Prvý zákazník ráno často pocíti náladu, ktorú si si priniesol z domu.",
  },
  {
    id: "t51",
    text: "Ak každý deň venuješ hodinu naviac štúdiu vo svojom odbore, do piatich rokov budeš jeho národným expertom.",
    author: "Earl Nightingale",
    category: "disciplína",
    detail:
      "Malá, no pravidelná investícia času do vzdelávania sa v odbore sa v priebehu rokov nasčíta na obrovský náskok pred kolegami, ktorí ju neinvestujú. Nemusí to byť hodina denne, stačí začať s desiatimi minútami.",
  },
  {
    id: "t52",
    text: "Motivácia nevydrží dlho. Ale ani sprchovanie, preto sa odporúča denne.",
    author: "Zig Ziglar",
    category: "disciplína",
    detail:
      "Motivácia z jedného videa alebo školenia nevydrží týždeň. Preto ju treba dopĺňať pravidelne, rovnako samozrejme ako hygienu.",
  },

  // --- Rast ---
  {
    id: "t53",
    text: "Osobný rozvoj je nekonečná šanca zlepšiť sa a zároveň prilákať príležitosti a ovplyvniť ostatných.",
    author: "Jim Rohn",
    category: "rast",
    detail:
      "Osobný rozvoj nie je jednorazový projekt s koncom, je to trvalý postoj k životu aj práci. Každý rozhovor so zákazníkom je príležitosť naučiť sa niečo, čo použiješ nabudúce.",
  },
  {
    id: "t54",
    text: "Zo všetkého, čo môže ovplyvniť tvoju budúcnosť, je osobný rast najdôležitejší. Môžeme hovoriť o raste predaja, zisku či majetku, no bez osobného rastu sa to pravdepodobne nestane.",
    author: "Jim Rohn",
    category: "rast",
    detail:
      "Skôr než budeš riešiť, ako zvýšiť tržby, over si, či rastieš ty sám ako predajca a človek. Číselné výsledky bez osobného rastu sú väčšinou len náhoda alebo dočasný stav.",
  },
  {
    id: "t55",
    text: "Neželaj si, aby to bolo jednoduchšie. Želaj si byť lepší. Neželaj si menej problémov, želaj si viac zručností.",
    author: "Jim Rohn",
    category: "rast",
    detail:
      "Sťažovanie sa na náročných zákazníkov alebo pomalý trh nič nezmení. Zmena príde, až keď si namiesto toho začneš rozvíjať zručnosti, ktoré ti chýbajú.",
  },
  {
    id: "t56",
    text: "Úspech si nehľadáš. Priťahuješ si ho tým, kým sa staneš.",
    author: "Jim Rohn",
    category: "rast",
    detail:
      "Naháňanie výsledkov priamo väčšinou sklame. Keď sa staneš niekým, kto si výsledky zaslúži (odborník, spoľahlivý, disciplinovaný), výsledky prirodzene prídu.",
  },
  {
    id: "t57",
    text: "Najväčší dar, ktorý môžeš niekomu dať, je tvoj vlastný osobný rozvoj.",
    author: "Jim Rohn",
    category: "rast",
    detail:
      "Keď rastieš, máš viac čo ponúknuť aj svojim zákazníkom a kolegom. Investícia do seba nie je sebecká, je to investícia do všetkých, s ktorými pracuješ.",
  },
  {
    id: "t58",
    text: "Motivácia ťa naštartuje. Návyk ťa udrží v pohybe.",
    author: "Jim Rohn",
    category: "rast",
    detail:
      "Nadšenie z nového predsavzatia, napríklad viac telefonátov alebo lepšia príprava, vydrží pár dní. Až keď sa to zmení na návyk, ktorý robíš aj bez nadšenia, sa dostaví trvalý výsledok.",
  },
  {
    id: "t59",
    text: "Ak sa nechceš učiť, nikto ti nepomôže. Ak si odhodlaný učiť sa, nikto ťa nezastaví.",
    author: "Zig Ziglar",
    category: "rast",
    detail:
      "Postoj k učeniu rozhoduje viac než samotný talent. Predajca ochotný učiť sa zo svojich chýb rastie rýchlejšie než talentovaný predajca, ktorý si myslí, že už všetko vie.",
  },
  {
    id: "t60",
    text: "Život je trieda. Do popredia sa dostanú len tí, ktorí sú ochotní učiť sa celý život.",
    author: "Zig Ziglar",
    category: "rast",
    detail:
      "Každý deň v predajni prináša lekciu, aj keď nevyzerá ako lekcia (ťažký zákazník, nevydarený obchod, nová otázka). Kto si tieto lekcie všíma, postupuje rýchlejšie než ten, kto ich prehliada.",
  },
  {
    id: "t61",
    text: "Si tam, kde si, a taký, aký si, kvôli tomu, čo si vpustil do svojej mysle. Zmeníš to tak, že zmeníš, čo do nej vpúšťaš.",
    author: "Zig Ziglar",
    category: "rast",
    detail:
      "To, čo pravidelne čítaš, počúvaš a s kým sa rozprávaš, formuje spôsob, akým rozmýšľaš o predaji aj o sebe. Zmena vstupov, teda kníh, podcastov, vzorov, postupne zmení aj výsledky.",
  },
  {
    id: "t62",
    text: "Ak sa z prehry poučíš, v skutočnosti si neprehral.",
    author: "Zig Ziglar",
    category: "rast",
    detail:
      "Prehratý obchod, z ktorého si sa nič nenaučil, je čistá strata. Prehratý obchod, ktorý ťa naučil niečo nové o zákazníkovi alebo o sebe, je investícia do budúcich obchodov.",
  },
  {
    id: "t63",
    text: "Snívaj o tom, čo si trúfaš snívať. Choď tam, kam chceš ísť. Buď tým, kým chceš byť.",
    author: "Earl Nightingale",
    category: "rast",
    detail:
      "Malé ciele vedú k malým výsledkom. Dovoľ si predstaviť väčší cieľ v predaji, než na aký si práve zvyknutý, a začni k nemu robiť malé kroky.",
  },
  {
    id: "t64",
    text: "Viac priateľov si získaš za dva mesiace tým, že prejavíš záujem o iných, než za dva roky snahy, aby sa iní zaujímali o teba.",
    author: "Dale Carnegie",
    category: "rast",
    detail:
      "Záujem o druhých buduje vzťahy rýchlejšie než snaha zapôsobiť. V predaji to znamená pýtať sa na zákazníka namiesto rozprávania o sebe a svojom produkte.",
  },
  {
    id: "t65",
    text: "Každý človek má moc zmeniť svoju hmotnú či finančnú situáciu tým, že najprv zmení povahu svojich presvedčení.",
    author: "Napoleon Hill",
    category: "rast",
    detail:
      "Presvedčenie, že si dobrý predajca, sa premieta do toho, ako sa správaš k zákazníkom, ešte predtým, než to dokážeš číslami. Zmena presvedčenia o sebe často predchádza zmene výsledkov.",
  },

  // --- Sebadôvera ---
  {
    id: "t66",
    text: "Nečinnosť plodí pochybnosti a strach. Konanie plodí sebadôveru a odvahu. Ak chceš prekonať strach, nesedávaj doma a nepremýšľaj o ňom. Choď von a daj sa do práce.",
    author: "Dale Carnegie",
    category: "sebadôvera",
    detail:
      "Čím dlhšie odkladáš náročný telefonát alebo rozhovor, tým väčší strach z neho narastá v tvojej hlave. Konanie, aj nedokonalé, rozpúšťa strach rýchlejšie než akékoľvek premýšľanie o ňom.",
  },
  {
    id: "t67",
    text: "Sebadôveru buduješ tým, že začneš, nie tým, že čakáš.",
    author: "Zig Ziglar",
    category: "sebadôvera",
    detail:
      "Sebadôvera nepríde skôr, než začneš, príde ako dôsledok toho, že si začal a prežil to. Čakanie na sebadôveru pred prvým krokom je najčastejší dôvod, prečo krok nikdy nepríde.",
  },
  {
    id: "t68",
    text: "Príprava plodí sebadôveru, sebadôvera vytvára príležitosť.",
    author: "Zig Ziglar",
    category: "sebadôvera",
    detail:
      "Neistota pred náročným rozhovorom sa dá znížiť konkrétnou prípravou, napríklad dôkladným poznaním produktu alebo overením možných námietok. Príprava je najspoľahlivejší zdroj sebadôvery, aký existuje.",
  },
  {
    id: "t69",
    text: "Sebadôvera znamená ísť po Moby Dickovi na veslici a vziať si so sebou tatársku omáčku.",
    author: "Zig Ziglar",
    category: "sebadôvera",
    detail:
      "Sebadôvera občas znamená ísť do náročného rozhovoru aj bez záruky úspechu, len s presvedčením, že sa oň oplatí pokúsiť. Humor v tomto obraze pripomína, že netreba čakať na dokonalé podmienky.",
  },
  {
    id: "t70",
    text: "Sebadôvera pochádza z vedomia, že si dnes urobil, čo si mohol najlepšie.",
    author: "Zig Ziglar",
    category: "sebadôvera",
    detail:
      "Sebadôvera nezávisí od výsledku obchodu, závisí od toho, či si urobil, čo bolo v tvojich silách. Táto vnútorná mierka ťa ochráni pred tým, aby ťa jedno odmietnutie zrazilo na kolená.",
  },
  {
    id: "t71",
    text: "Viera v seba samého je prvý krok k úspechu.",
    author: "Zig Ziglar",
    category: "sebadôvera",
    detail:
      "Kým neveríš, že dokážeš pomôcť zákazníkovi, ťažko ho o tom presvedčíš. Viera v seba je prvý, neviditeľný krok pred každým viditeľným úspechom.",
  },
  {
    id: "t72",
    text: "Budeš mizerným niekým iným, ale si tou najlepšou verziou seba, aká existuje. Si jediný, kto dokáže využiť tvoje schopnosti.",
    author: "Zig Ziglar",
    category: "sebadôvera",
    detail:
      "Porovnávanie sa s iným, úspešnejším kolegom ťa oberá o energiu, ktorú môžeš vložiť do rozvoja vlastného štýlu. Tvoja jedinečná kombinácia skúseností a osobnosti je konkurenčná výhoda, ktorú nikto iný nemá.",
  },
  {
    id: "t73",
    text: "Kvalitný výkon začína pozitívnym postojom.",
    author: "Jeffrey Gitomer",
    category: "sebadôvera",
    detail:
      "Kvalita tvojho výkonu u zákazníka začína skôr, než vôbec otvoríš ústa, v tom, s akým postojom k nemu pristupuješ. Zákazník to vycíti, aj keď to nevie pomenovať.",
  },
  {
    id: "t74",
    text: "Ak veríš v to, čo robíš, nedovoľ ničomu, aby ťa v tej práci zastavilo.",
    author: "Dale Carnegie",
    category: "sebadôvera",
    detail:
      "Ak si sám neveríš, že produkt alebo služba, ktorú predávaš, má hodnotu, žiadna technika predaja to nezakryje. Vnútorné presvedčenie o hodnote toho, čo ponúkaš, je základ, na ktorom stojí všetko ostatné.",
  },
  {
    id: "t75",
    text: "Čokoľvek očakávaš so sebadôverou, sa stáva tvojím vlastným naplneným proroctvom.",
    author: "Brian Tracy",
    category: "sebadôvera",
    detail:
      "Keď s istotou očakávaš, že rozhovor dopadne dobre, tvoje správanie sa tomu prispôsobí a zvyšuje šancu, že sa tak aj stane. Platí to žiaľ aj opačne, preto si vyberaj očakávania vedome.",
  },
  {
    id: "t76",
    text: "Sebaobraz, ktorý o sebe máš, sa vždy prejaví v tom, ako sa správaš.",
    author: "Brian Tracy",
    category: "sebadôvera",
    detail:
      "Ak sa vidíš ako niekto, kto sa bojí pýtať na cenu, budeš sa tak aj správať bez ohľadu na trénované techniky. Zmena sebaobrazu, teda vidieť sa ako odborník, ktorý pomáha, zmení aj tvoje reálne správanie.",
  },
  {
    id: "t77",
    text: "Sebadôvera je návyk, ktorý sa dá rozvíjať tak, že sa začneš správať, akoby si ju už mal.",
    author: "Brian Tracy",
    category: "sebadôvera",
    detail:
      "Sebadôvera sa dá budovať aj tak, že sa najprv začneš správať sebaisto, a pocit príde neskôr. Nečakaj, kým to budeš cítiť naplno, začni konať tak, akoby si to už cítil.",
  },
  {
    id: "t78",
    text: "Musíš si byť istý sám sebou, skôr než môžeš vyhrať akúkoľvek cenu.",
    author: "Napoleon Hill",
    category: "sebadôvera",
    detail:
      "Vnútorná istota predchádza vonkajší úspech, nie naopak. Práca na sebadôvere preto nie je vedľajšia aktivita popri predaji, je jeho základ.",
  },
];

export const THOUGHT_CATEGORIES = [
  { id: "mindset", label: "Mindset" },
  { id: "predaj", label: "Predaj" },
  { id: "zákazník", label: "Zákazník" },
  { id: "vytrvalosť", label: "Vytrvalosť" },
  { id: "disciplína", label: "Disciplína" },
  { id: "rast", label: "Rast" },
  { id: "sebadôvera", label: "Sebadôvera" },
] as const;

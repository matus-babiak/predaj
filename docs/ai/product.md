# Produkt: Sales Dojo

> Overené podľa kódu (navigácia, stránky, content, typy). Neznáme je označené.

## Čo aplikácia robí

**Sales Dojo** je osobný online tréningový nástroj na systematické zlepšovanie predajných zručností.
Zameranie: psychológia predaja, dôvera a rozhodovanie zákazníkov, nie skripty naspamäť.
Kontext obsahu: predajňa / PC servis (námietky, produkty, hardvér).

Brand v UI: `🥋 Sales Dojo` (`components/Shell.tsx`, `app/layout.tsx`).
Package name: `sales-dojo`. Repozitár: `matus-babiak/predaj`.

## Pre koho

- Primárne: **jeden používateľ** (osobný nástroj).
- Pozdrav na domovskej stránke je natvrdo **„Matúš“** (`app/page.tsx`).
- Autentifikácia: **jedno zdieľané heslo** (`APP_PASSWORD`), nie multi-user účty.
- **Neznáme:** či je plánovaný multi-user režim. V kóde nie je.

## Aký problém rieši

Pomáha predajcovi:
1. denne trénovať a reflektovať (program + denník + záznamy),
2. budovať banku skúseností (zákazníci, námietky, produkty, požiadavky),
3. vidieť trendy a slabiny (štatistiky, odznaky, AI mentor),
4. mať po ruke myšlienky, manuály a hardvérové štúdium.

## Hlavný používateľský cieľ

Každý deň: zaznamenať zákazníkov, splniť úlohu týždňa, večer reflektovať, postupne prejsť 12-týždňový program a zlepšovať sa podľa dát.

## Hlavné obrazovky (navigácia)

Zdroj: `components/Shell.tsx` → pole `NAV`.

| Cesta | Názov | Účel |
|-------|-------|------|
| `/` | Dnes | Denný hub: úloha týždňa, rýchle akcie, streak, odznaky |
| `/mindset` | Mindset | Banka myšlienok + vlastné myšlienky + obľúbené |
| `/dennik` | Denník | Večerná reflexia podľa otázok aktuálneho týždňa |
| `/zaznamy` | Záznamy | Coaching zápis po zákazníkovi + história |
| `/poziadavky` | Požiadavky | Čisté dopyty zákazníkov (bez výsledku predaja) |
| `/program` | Program | 12 týždňov / 6 fáz, odomykanie vlastným tempom |
| `/namietky` | Námietky | Tréning uznaj → zisti → odpovedz + banka |
| `/plusy-minusy` | Plusy a mínusy | Sebahodnotenie + AI komentár |
| `/ai-mentor` | AI Mentor | Týždenný AI briefing (okno 14 dní) |
| `/otazky` | Otázky | Otvorené otázky → zodpovedané |
| `/poznamky` | Poznámky | Rýchle TODO |
| `/hardver` | Hardvér | Štúdium tém, AI štruktúra |
| `/manualy` | Manuály | Dlhé manuály (záložky) |
| `/produkty` | Produkty | Predajno-psychologické kartičky + skúšanie |
| `/login` | Prihlásenie | Heslo (mimo Shell chrome) |
| `/statistiky` | Štatistiky | Prehľady, odznaky, AI clustering potrieb/obáv |

## Hlavné používateľské flows

### Denný cyklus
1. Otvorí **Dnes** → vidí úlohu aktuálneho týždňa.
2. Po zákazníkovi ide do **Záznamy** (outcome povinný; want/fear/why/trust voliteľné).
3. Večer **Denník** → reflexia podľa otázok týždňa (1 reflexia / deň).
4. Voliteľne trénuje **Námietky**, skúša **Produkty**, dopĺňa **Požiadavky**.

### Program
1. Prečíta lekciu týždňa → označí prečítané.
2. Zbiera dni so záznamom (min. 4 podľa `minDays`).
3. Dokončí týždeň → odomkne ďalší (alebo „dokončiť aj tak“).

### Offline / sync
1. Zmeny sa uložia lokálne hneď.
2. Fronta sa odošle na `/api/data`.
3. Pri výpadku ostávajú v zariadení (`sync: offline`).

### AI (voliteľné, on-demand)
- Plusy/mínusy komentár, AI Mentor briefing, štatistiky clustering, Hardvér štruktúra.
- Vyžaduje `GEMINI_API_KEY`. Odpovede sa cache-ujú vo `settings` cez fingerprint.

## Hlavné funkcie (MVP podľa aktuálneho kódu)

Za MVP sa považuje to, čo je v kóde a v navigácii funkčné:

- 12-týždňový program s odomykaním
- Záznamy zákazníkov + draft autosave
- Denná reflexia
- Banka a tréning námietok (38 vstavaných + vlastné)
- Produktové kartičky + quiz
- Mindset banka (93 myšlienok)
- Požiadavky, otázky, poznámky, manuály, hardvér
- Štatistiky + odznaky + streak
- AI mentor funkcie (ak je kľúč)
- Prihlásenie heslom + PWA ikony + offline-first sync
- Desktop auto-logout pri nečinnosti

## Mimo scope (podľa absencie v kóde)

- Multi-user / role / tímy
- E-mail / OAuth prihlásenie
- Platby, predplatné
- Automatické notifikácie / push
- Automatizované testy (žiadne `*test*` / `*spec*` v repozitári)
- Admin panel, export/import UI (neznáme ako produktová požiadavka)
- Verejný marketingový web

## Produktové rozhodnutia už urobené (z kódu)

1. **Jeden používateľ, jedno heslo**, nie účty.
2. **Offline-first** s last-write-wins podľa `updatedAt`.
3. Program ide **vlastným tempom**, nie kalendárom.
4. Námietky: princíp **uznaj → zisti → odpovedz**; slabšie sa vracajú častejšie.
5. Záznam je coaching zápis: primárna požiadavka (sync do Požiadaviek), výsledok, počet položiek, recenzia, kedy bola cena, námietka, plán kroku, plusy/mínusy (viac riadkov), voliteľná poznámka.
6. Reflexia: **jedna na deň**, id = dátum `YYYY-MM-DD`.
7. Požiadavky sú **oddelené** od predajných záznamov.
8. AI sa **negeneruje automaticky** pri každom otvorení: on-demand + fingerprint cache.
9. Texty UI sú **slovenské**.
10. Typografia v repozitári: **žiadne em/en pomlčky** (`CLAUDE.md`).

## Neznáme / neúplné

- `settings.customWants` / `customFears` sú v type a čítajú sa v Štatistikách, ale **v UI sa nikde nezapisujú**. Účel UI nie je jasný.
- Cieľová produkčná URL a či beží live: `NAVOD.md` hovorí o Verceli, stav nasadenia z kódu nevyplýva.
- Dlhodobá vízia po 12 týždňoch: v kóde nie je.

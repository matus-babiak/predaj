# Golden example: Planning Agent

Overený príklad na **aktuálnom kóde** (nie hypotéza).
Scenár ukazuje celý planning flow bez zmeny aplikácie.

---

## Používateľská požiadavka

> Na stránke Dnes chcem hneď vidieť, koľko mám ešte nezodpovedaných otázok, aby som nemusel vždy chodiť do Otázky.

---

## 1. Pochopenie

Chceš na domovskej obrazovke (Dnes) vidieť počet otvorených otázok zo stránky Otázky.
Cieľ: rýchly prehľad a motivačný skok do Otázky, bez zmeny samotnej banky otázok.

---

## 2. Produktový kontext

Zo `docs/ai/product.md` a kódu:
- Dnes je denný hub s úlohou týždňa a rýchlymi akciami.
- Otázky (`/otazky`) už existujú: otvorené = bez `answer`, zodpovedané majú `answer` + `answeredAt`.
- Dnes už má 2×2 mriežku odkazov (Záznamy, Denník, Námietky, Štatistiky) a voliteľný Rýchly prístup.

Toto sedí s produktom: hub má ukazovať, čo treba vybaviť dnes.

---

## 3. Kontrola kódu (overené)

| Čo | Kde | Zistenie |
|----|-----|----------|
| Domovská stránka | `app/page.tsx` | Počíta `todayEntries`, `hasReflection`, streak, badges; **nečíta `questions`** |
| Dáta otázok | `lib/useData.ts` | `questions` už sú dostupné z store |
| Definícia otvorenej otázky | `lib/types.ts` + `app/otazky/page.tsx` | otvorená = nemá `answer` |
| Navigácia | `components/Shell.tsx` | položka Otázky existuje, bez badge počtu |
| UI pattern | `app/page.tsx` akčná mriežka | `Link` + číslo/stav v kartičke |

---

## 4. Dotknuté časti

- **Hlavne:** `app/page.tsx` (pridať počet + odkaz).
- **Možno:** nič iné, ak sa počet vmestí do existujúcej mriežky alebo ako piaty riadok pod ňou.
- **Nemeniť:** `questions` model, stránku Otázky, sync, Shell badge (pokiaľ to neschváliš zvlášť).

---

## 5. Business rules

- Dotknuté: skôr bežné (B8 ready gate, UX hub).
- Kritické/dôležité: žiadne (auth, sync, program, dátový tvar otázky sa nemenia).
- Pravidlo výpočtu: rovnaké ako na `/otazky` (otvorené = bez `answer`).

---

## 6. Riziká

- Pridanie piatej karty môže narušiť 2×2 mriežku na mobile.
- Alternatíva „badge v navigácii“ je väčší zásah do Shell a týka sa všetkých stránok.

---

## 7. Otázky na teba

1. Má byť počet **novou kartou** v akčnej mriežke (napr. namiesto úpravy layoutu na viac položiek), alebo stačí **jeden riadok** pod mriežkou typu „Otvorené otázky: 3 →“?
2. Ak je počet 0, má sa blok **schovať**, alebo ukazovať nulu?

*(V tomto golden example predpokladáme tvoje odpovede: riadok pod mriežkou; pri 0 schovať.)*

---

## 8. Návrh (ľudskou rečou)

Na Dnes, pod existujúcimi štyrmi rýchlymi akciami, pribudne krátky odkaz len vtedy, keď máš aspoň jednu nezodpovedanú otázku.
Ukáže číslo a po ťuknutí ťa vezme do Otázky.
Keď je všetko zodpovedané, riadok zmizne.
Samotné otázky, ich ukladanie ani iné obrazovky sa nemenia.

### Technicky (stručne)

- V `app/page.tsx` cez `useData()` doplniť `questions`.
- `const openQuestions = questions.filter((q) => !q.answer).length`
- Ak `openQuestions > 0`, render `Link` na `/otazky` s textom počtu.
- Žiadna nová kolekcia, žiadne API.

---

## 9. Spôsob overenia

| Položka | Hodnota |
|---------|---------|
| Čo sa má zmeniť | Domovská stránka ukáže počet otvorených otázok (ak je väčší ako 0) |
| Čo sa nesmie zmeniť | Logika Otázky, sync, program, ostatné karty Dnes |
| Scenár A | 0 otvorených → riadok nie je viditeľný |
| Scenár B | Pridaj otvorenú otázku → na Dnes je počet 1 (alebo N) a odkaz vedie na `/otazky` |
| Scenár C | Zodpovedz všetky → riadok zmizne |
| Príkazy | `npm run build` (TypeScript check) |

---

## 10. Rozhodnutie

Schválené s voľbami: riadok pod mriežkou; pri 0 skryť.

---

## 11. Implementačný prompt pre `/dojo-implement`

```
## Cieľ
Na stránke Dnes (`app/page.tsx`) zobraz počet otvorených otázok (questions bez `answer`)
ako odkaz na `/otazky`, umiestnený pod existujúcou 2×2 akčnou mriežkou.
Ak je počet 0, blok nerenderuj.

## Súbory
- Upraviť: `app/page.tsx`
- Dokumentácia: doplniť do `docs/ai/ui-ux.md` alebo `product.md` jednu vetu o tomto skrate (voliteľné, krátke)

## Implementácia
1. Z `useData()` vezmi aj `questions`.
2. Spočítaj `openQuestions = questions.filter((q) => !q.answer).length`.
3. Ak `openQuestions > 0`, zobraz Link na `/otazky` s zrozumiteľným SK textom
   (napr. „Otvorené otázky: N“). Vizuálne drž existujúci štýl stránky (žiadna nová UI knižnica).
4. Nemeniť Shell navigáciu, nemeniť `/otazky`, nemeniť typy ani store.

## Scope lock (NErobiť)
- Žiadny badge v sidebarí
- Žiadna zmena dátového modelu
- Žiadne AI / API zmeny
- Žiadny refaktor celej stránky Dnes
- Žiadne em/en pomlčky v textoch

## Business rules
- Rešpektuj definíciu otvorenej otázky ako na `/otazky`
- ready gate ostáva

## Overenie
1. `npm run build`
2. Manuálne: 0 otvorených = skryté; pridať otázku = viditeľný počet; zodpovedať = zmizne
3. Ostatné karty na Dnes vyzerajú ako predtým

## Po dokončení
Krátko zhrň čo sa zmenilo a výsledok buildu.
```

---

## Prečo je toto „golden“

- Požiadavka je ľudská a reálna.
- Analýza sedí s aktuálnym `app/page.tsx` (questions sa dnes nepoužívajú).
- Návrh je najmenšia zmena.
- Oddelenie ľudského návrhu a technického promptu je jasné.
- Tento súbor **nie je** inštrukcia na okamžitú implementáciu v tejto fáze budovania AI systému; je to vzor správania Planning Agenta.

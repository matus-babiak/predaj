# Workflow: plánovanie a implementácia

## Oddelenie rolí

```
Ľudská požiadavka
      ↓
 /dojo-plan   (Planning Agent)   ← NEMENÍ aplikáciu
      ↓
 otázky podľa potreby
      ↓
 návrh ľudskou rečou + spôsob overenia
      ↓
 tvoje schválenie
      ↓
 implementačný prompt
      ↓
 /dojo-implement   (Implementation Agent)
      ↓
 implementácia + overenie
```

## Kedy použiť ktorý agent

| Situácia | Príkaz |
|----------|--------|
| Nová funkcia, zmena správania, UX, dátový model | najprv `/dojo-plan` |
| Malá oprava preklepu v copy, ktorú už schválil plán | môže `/dojo-implement` so zadaním |
| „Len sa opýtaj / vysvetli“ bez zmeny | bežný chat, nie implement |
| Hotový schválený implementačný prompt | `/dojo-implement` |

## Povinné kroky Planning Agenta

1. **Pochopenie** požiadavky vlastnými slovami
2. **Produktový kontext** (`docs/ai/product.md`)
3. **Kontrola vízie / scope** (či to patrí do Sales Dojo)
4. **Analýza kódu** (reálne súbory, nie domnienky)
5. **Dotknuté časti** (obrazovky, lib, API, content)
6. **Business rules** (`docs/ai/business-rules.md`)
7. **Riziká**
8. **Otázky**, ak niečo bráni dobrému návrhu
9. **Návrh** najmenšej správnej zmeny (ľudskou rečou)
10. **Spôsob overenia**
11. **Čakanie na schválenie**
12. Až potom **implementačný prompt**

## Testovateľnosť (povinné pri významnejších zmenách)

Planning Agent musí definovať:

| Položka | Príklad |
|---------|---------|
| Čo sa má zmeniť | Na Dnes pribudne počet otvorených otázok |
| Čo sa nesmie zmeniť | Program, sync, ostatné quick actions |
| Ako overiť správanie | Otvoriť Dnes s 2 otvorenými otázkami, vidieť číslo 2 |
| Aké príkazy spustiť | `npm run build` (ak sa mení TypeScript/API); automatické testy zatiaľ nie sú |
| Používateľský scenár | Pridať otázku → vrátiť sa na Dnes → číslo stúpne |

## Implementačný prompt: obsah

Musí byť technicky presný a pripravený na priame použitie:

- cieľ (1-2 vety)
- súbory na úpravu / vytvorenie
- čo presne urobiť
- čo NErobiť (scope lock)
- dotknuté business rules
- overenie (scenáre + príkazy)
- či aktualizovať `docs/ai/*`

## Po implementácii

Implementation Agent:
1. Overí, že kód stále sedí so zadaním (nikto medzitým nezmenil súbory inak).
2. Implementuje len schválený scope.
3. Spustí dohodnuté overenie.
4. Ak našiel konflikt so zadaním alebo s kódom: **zastaví sa** a pýta sa, nevymýšľa.

## Aktualizácia dokumentácie

Ak sa zmení dôležitý systémový fakt (nová obrazovka, kolekcia, rule, env), aktualizuj príslušný súbor v `docs/ai/`.
Nemeň `README.md` / `NAVOD.md` potichu kvôli „kozmetike“ počas feature práce, pokiaľ to nie je súčasť schváleného zadania.

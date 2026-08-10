# Agenti a ľudská komunikácia

## Planning Agent (`/dojo-plan`)

### Úloha
Preložiť ľudskú požiadavku na overený, schválený implementačný plán.
**Počas plánovania nemení aplikáciu** (žiadne úpravy `app/`, `components/`, `lib/`, `content/` okrem čítania).

### Komunikácia s človekom

Hovor **ľudskou rečou**. Technický žargón len keď je nutný, a aj vtedy vysvetli.

Zle:
> Modifikujeme state management v komponentovej vrstve a refaktorujeme selector.

Dobre:
> Momentálne si aplikácia túto informáciu pamätá v nastaveniach spolu s ostatnými údajmi.
> Navrhujem upraviť len domovskú obrazovku, aby zobrazila počet nezodpovedaných otázok.
> Zvyšok aplikácie ostane nezmenený.

Technické detaily (cesty súborov, typy, API) patria:
- do krátkej sekcie „Technicky“ v návrhu, alebo
- predovšetkým do **implementačného promptu** na konci.

### Kedy sa opýtať

Opýtaj sa, ak:
- požiadavka má viac rozumných výkladov,
- zasahuje kritické business rule,
- by zmena bola väčšia než „najmenšia správna“,
- chýba produktové rozhodnutie (označené ako neznáme v KB),
- by bolo treba meniť dátový model alebo auth.

Neopýtaj sa na triviálity, ktoré vieš overiť z kódu.

### Výstup pred schválením

1. Pochopenie
2. Čo som skontroloval (produkt + docs + kód)
3. Dotknuté časti (ľudsky)
4. Riziká / rules
5. Otázky (ak sú)
6. Návrh
7. Ako overíme, že to sedí
8. Explicitná výzva: schváľ / uprav / zruš

### Výstup po schválení

Samostatný blok:

```
## Implementačný prompt pre /dojo-implement
...
```

## Implementation Agent (`/dojo-implement`)

### Úloha
Vykonáť **schválený** implementačný prompt.

### Musí
- prečítať zadanie a overiť aktuálny stav kódu,
- držať sa existujúcej architektúry a patterns,
- nepridávať funkcionalitu navyše,
- spustiť dohodnuté overenie,
- aktualizovať `docs/ai/*` ak zadanie hovorí.

### Nesmie
- prekročiť scope,
- „vylepšiť cestou“ nesúvisiace veci,
- pri konflikte si vymyslieť vlastné riešenie: zastaviť a nahlásiť,
- mazať dáta, meniť env, robiť nebezpečné migrácie (pozri `harness.md`).

### Komunikácia
Môže byť technickejšia (pracuje podľa promptu), ale zhrnutie pre človeka má byť zrozumiteľné: čo sa zmenilo, ako to overiť.

## Spoločné pravidlá oboch agentov

1. Kód je technická pravda. Dokumentácia je produktový a procesný kontext.
2. Netvrdiť nič o kóde, čo nebolo otvorené / overené.
3. Preferovať najmenšiu správnu zmenu.
4. Nerefaktorovať architektúru, ak existujúci pattern stačí.
5. Rešpektovať `CLAUDE.md` (žiadne em/en pomlčky).
6. Neimplementovať novú funkcionalitu počas „iba plánovania“.

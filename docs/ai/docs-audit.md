# Audit pôvodnej dokumentácie

Stav k dátumu vytvorenia AI Knowledge Base. Porovnanie dokumentov s aktuálnym kódom.

## Prehľad súborov (pred KB)

| Súbor | Úloha |
|-------|--------|
| `README.md` | Produkt + technika + lokálne spustenie |
| `NAVOD.md` | Nasadenie GitHub + Vercel + Redis + heslo |
| `CLAUDE.md` | Pravidlo: žiadne em/en pomlčky |
| `.claude/launch.json` | Spustenie `npm run dev` na porte 3000 |

**Chýbalo:** Cursor rules, AI workflow, Knowledge Base, popis všetkých modulov, AI/Gemini, dátový model, business rules.

---

## Aktuálne (zodpovedá kódu)

| Tvrdenie | Kde | Overenie |
|----------|-----|----------|
| Next.js 15 + React 19 + Tailwind 4 + TS | README | `package.json` |
| Offline-first sync | README | `lib/store.tsx` |
| Prihlásenie `APP_PASSWORD` + cookie | README | `lib/auth.ts`, `middleware.ts` |
| Bez hesla lokálne otvorené | README | middleware |
| Redis cez Vercel / Upstash, lokálne `.data.json` | README, NAVOD | `lib/db.ts` (aj `KV_*` aliasy) |
| 12 týždňov, 6 fáz (mená fáz) | README | `content/program.ts` |
| Deploy cez push na Vercel | NAVOD | dokumentačný postup (infra mimo kódu) |
| Žiadne em/en pomlčky | CLAUDE.md | platné pravidlo pre celý repo |

---

## Zastarané / nepresné

| Tvrdenie | Dokument | Realita v kóde |
|----------|----------|----------------|
| **24 námietok** | README | **38** v `content/objections.ts` (`o1`-`o38`) |
| Moduly len: Dnes, Denník, Program, Námietky, Produkty, Štatistiky | README | Navigácia má navyše Mindset, Záznamy, Požiadavky, Plusy a mínusy, AI Mentor, Otázky, Poznámky, Hardvér, Manuály; Denník a Záznamy sú oddelené |
| „Denník: 30-sekundový záznam…“ | README | Rýchly záznam je na `/zaznamy`; `/dennik` je večerná reflexia |
| Lokálna cesta `/Users/matus/Documents/Claude/predaj` | NAVOD | Platí len pre jedného autora; nie je univerzálny návod |

---

## Duplicitné

| Téma | Kde | Poznámka |
|------|-----|----------|
| Lokálne `npm install` / `npm run dev` | README | Jediný správny krátky návod; neopakovať inde zbytočne |
| Heslo + Redis setup | NAVOD (detail), README (odkaz) | NAVOD je kanonický pre deploy; OK |

Po vzniku `docs/ai/*` je **produktový a architektonický popis** kanonický tam. README ostáva krátky vstupný bod pre človeka; pri konflikte s kódom neprepisuj README potichu, najprv oprav KB / zaznač konflikt.

---

## Konfliktné

1. **Počet námietok:** README 24 vs kód 38.
2. **Rozsah modulov:** README vs `Shell.tsx` NAV.
3. **Význam „Denník“:** README mieša záznam + reflexiu; kód má dve stránky.

Tieto konflikty Knowledge Base rieši tak, že **uvádza stav z kódu** a tu ich eviduje. README v tejto fáze zámerne neprepisujeme celý (táto úloha nemenila produktovú docs agresívne; opraví sa samostatnou úlohou, ak chceš).

---

## Chýbajúce (pred KB; teraz pokryté v `docs/ai/`)

- Kompletný zoznam obrazoviek a flows
- Dátový model a kolekcie
- Business rules (program, streak, pickNext, auth, sync)
- AI / Gemini (`GEMINI_API_KEY`, mentor API, fingerprint cache)
- Oddelenie Planning / Implementation
- Harness
- UI patterns
- Zistenie, že `customWants` / `customFears` nemajú UI zápis
- Absencia automatických testov

---

## Odporúčanie

1. `docs/ai/` = zdroj pravdy pre AI development.
2. `CLAUDE.md` = typografické pravidlo (ponechať).
3. `NAVOD.md` = ľudský deploy návod (ponechať).
4. `README.md` = krátky prehľad; pri ďalšej docs úlohe zosúladiť počet námietok a zoznam modulov s kódom.

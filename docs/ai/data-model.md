# Dátový model

> Zdroj: `lib/types.ts`, `lib/db.ts`, `lib/store.tsx`, `lib/useData.ts`.

## Princíp

- Všetky používateľské dáta sú v **kolekciách** so spoločným tvarom: položka má `id` a `updatedAt`.
- Klient drží kópiu v `localStorage` (`cp_cache_v1`) a frontu mutácií (`cp_queue_v1`).
- Server: Redis hash `cp:{collection}` alebo lokálny `.data.json`.
- Merge: podľa `id`, novší `updatedAt` vyhráva (last-write-wins).

## Kolekcie (`COLLECTION_NAMES`)

| Kolekcia | Typ | Účel |
|----------|-----|------|
| `entries` | `Entry` | Záznamy po zákazníkovi |
| `reflections` | `Reflection` | Večerné reflexie (id = dátum) |
| `progress` | `Progress` | Stav 12-týždňového programu (singleton `id: "progress"`) |
| `objAttempts` | `ObjAttempt` | Pokusy tréningu námietok |
| `userObjections` | `UserObjection` | Vlastné námietky používateľa |
| `products` | `ProductCard` | Produktové kartičky |
| `settings` | `Settings` | Nastavenia + AI cache + entry draft (singleton `id: "settings"`) |
| `selfNotes` | `SelfNote` | Samostatné plus/mínus mimo záznamu |
| `questions` | `Question` | Banka otázok |
| `myThoughts` | `MyThought` | Vlastné mindset myšlienky |
| `notes` | `Note` | Rýchle TODO |
| `requests` | `CustomerRequest` | Čisté požiadavky zákazníkov |
| `studyTopics` | `StudyTopic` | Hardvérové témy |
| `manuals` | `Manual` | Manuály |

## Kľúčové typy (skrátene)

### Entry
- `outcome`: `kupil` | `nekupil` | `vrati_sa` | `rada` (**povinné** pri uložení)
- Coaching polia (nový formulár):
  - `itemCount`: 0-5 (5 = 5+)
  - `askedReview`: boolean
  - `priceTiming`: `start` | `end` | `avoided` (**povinné** v novom formulári)
  - `objectionReaction`: `none` | `asked_benefit` | `gave_in` | `discount` | `froze`
  - `hadNextStepPlan`: `yes` | `no` | `partial` (**povinné** v novom formulári)
  - `note`: voliteľná jedna veta
- Staršie voliteľné polia (história, nový formulár ich nezapisuje):
  `want`, `fear`, `why`, `trust`, `objection`, `plus`, `minus`

### Reflection
- `id` a `date`: `YYYY-MM-DD` (jedna reflexia na deň)
- `weekId`, `answers`, voliteľné `focus`

### Progress
- `currentWeek` 1-12, `completedWeeks`, `readLessons`, `weekStarts`, `startedAt`

### ObjAttempt
- `objectionId`, `answer`, `rating` 1 | 2 | 3

### ProductCard
- Povinné kvôli kompatibilite: `who`, `when`, `whenNot`, `alternatives`, `objections`
- Veľa voliteľných predajno-psychologických polí (pozri `types.ts` a `content/productFields.ts`)

### Settings (AI cache a draft)
- `entryDraft`, `favoriteThoughts`, `customWants`, `customFears`
- AI: `swAiNote*`, `mentorBriefing*`, `statsAi*`

## Statický obsah (nie Redis)

| Súbor | Obsah (overené počty) |
|-------|------------------------|
| `content/program.ts` | 12 týždňov, 6 fáz, `minDays: 4` |
| `content/objections.ts` | **38** námietok (`o1`-`o38`) |
| `content/mindset.ts` | **93** myšlienok (`t1`-`t93`) |
| `content/chips.ts` | default wants/fears, outcome labely |
| `content/productFields.ts` | 9 sekcií, 24 polí kartičky |

## Sync API

`POST /api/data` body:
```json
{ "mutations": [{ "collection": "entries", "put": [...], "delete": ["id"] }] }
```

Neznáme kolekcie sa na serveri **preskočia**.
Tvar položiek sa na serveri **nevaliduje** nad rámec potreby `id` pri put.

## Pravidlá pri zmene modelu

1. Pridaj typ do `lib/types.ts`.
2. Pridaj názov do `COLLECTION_NAMES`.
3. Doplň `useData.ts`, ak stránka potrebuje typované pole.
4. Aktualizuj tento dokument.
5. Nestĺčaj nesúvisiace entity do jednej kolekcie „pre jednoduchosť“.
6. Singleton kolekcie (`progress`, `settings`) musia zachovať stabilné `id`.

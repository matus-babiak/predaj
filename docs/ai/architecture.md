# Architektúra

> Zdroj: `package.json`, `app/`, `lib/`, `components/`, `content/`, `middleware.ts`, `NAVOD.md`.

## Stack

| Vrstva | Technológia | Verzia (package.json) |
|--------|-------------|------------------------|
| Framework | Next.js (App Router) | ^15.3.3 |
| UI | React | ^19.1.0 |
| Jazyk | TypeScript | ^5.8.3 |
| Štýly | Tailwind CSS + `@tailwindcss/postcss` | ^4.1.8 |
| Dáta (prod) | Upstash Redis cez REST | env URL + token |
| Dáta (dev) | súbor `.data.json` | lokálny fallback |
| AI | Google Gemini (`gemini-flash-latest`) | REST, `GEMINI_API_KEY` |
| Hosting | Vercel (podľa NAVOD.md) | (nie je v package.json) |

## Štruktúra repozitára

```
app/                 # Next.js routes (stránky + API)
  api/               # Route handlers
  */page.tsx         # Obrazovky
  layout.tsx         # Root layout + StoreProvider + Shell
  globals.css
components/          # Zdieľané UI (Shell, ui, SearchModal, …)
content/             # Statický obsah (program, námietky, mindset, …)
lib/                 # Auth, db, store, business helpers, AI
middleware.ts        # Auth gate
public/              # PWA ikony, manifest
docs/ai/             # Táto Knowledge Base (AI development)
.cursor/             # Cursor rules + commands
```

**Nie je tu** klasický priečinok `src/`. Aplikácia žije v `app/`, `components/`, `lib/`, `content/`.

## Vrstvy a zodpovednosti

```
UI (app/*/page.tsx + components/)
        ↓ useData() / useStore()
Klientský store (lib/store.tsx)  ← localStorage cache + mutation queue
        ↓ fetch /api/data
API routes (app/api/**)
        ↓
db.ts → Redis (prod) alebo .data.json (dev)

Paralelne AI:
UI → POST /api/mentor/* → lib/mentor|statsAi|mentor-context + gemini.ts → Gemini
Telegram → POST /api/telegram → mentor-context + mentor chat + gemini → sendTelegramMessage
```

### Kde je čo

| Concern | Kde |
|---------|-----|
| UI obrazovky | `app/*/page.tsx` |
| Layout, nav | `components/Shell.tsx`, `app/layout.tsx` |
| Zdieľané UI primitives | `components/ui.tsx` |
| Klientský stav / sync | `lib/store.tsx` |
| Typované čítanie dát | `lib/useData.ts` |
| Dátové typy | `lib/types.ts` |
| Serverové úložisko | `lib/db.ts` |
| Auth token | `lib/auth.ts` + `middleware.ts` |
| Streak, odznaky | `lib/gamify.ts` |
| AI prompty | `lib/mentor.ts`, `lib/statsAi.ts` |
| Mentor snapshot / chat helpers | `lib/mentor-context.ts` |
| Telegram klient | `lib/telegram.ts` |
| Gemini volanie | `lib/gemini.ts` |
| Statický obsah | `content/*.ts` |
| Business rules programu | `app/program/page.tsx` + `content/program.ts` + `useData.daysInCurrentWeek` |

## Entry pointy

| Entry | Úloha |
|-------|--------|
| `app/layout.tsx` | HTML shell, metadata PWA, `StoreProvider`, `Shell` |
| `middleware.ts` | Auth pre všetko okrem login/static/`api/telegram` |
| `app/page.tsx` | Domov „Dnes“ |
| `app/api/data/route.ts` | Sync dát GET/POST |
| `app/api/login|logout` | Session cookie |
| `app/api/mentor/*` | AI endpointy |
| `app/api/telegram` | Telegram webhook (secret + chat allowlist) |

## API

| Route | Metódy | Účel |
|-------|--------|------|
| `/api/login` | POST | Overí heslo, nastaví cookie |
| `/api/logout` | POST | Zmaže cookie |
| `/api/data` | GET, POST | Načíta / aplikuje mutácie kolekcií |
| `/api/mentor/sw` | POST | AI komentár k plusom/mínusom |
| `/api/mentor/briefing` | POST | Týždenný mentor briefing |
| `/api/mentor/stats` | POST | Clustering potrieb/obáv |
| `/api/mentor/study` | POST | Štruktúra hardvérovej témy |
| `/api/mentor/debrief` | POST | Debrief jedného záznamu |
| `/api/mentor/daily-focus` | POST | Ranná priorita na dnes |
| `/api/mentor/evening` | POST | Večerné zhrnutie po reflexii |
| `/api/mentor/chat` | POST | Voľný web chat (história + snapshot) |
| `/api/telegram` | POST | Telegram webhook (chat mentor) |

API handlery **nespôsobujú vlastnú auth kontrolu**: spoliehajú sa na middleware.
Výnimky: `/api/login` a `/api/telegram` sú v middleware exclude (Telegram má vlastný secret).

## Env premenné

| Premenná | Účel |
|----------|------|
| `APP_PASSWORD` | Heslo; bez nej je appka otvorená (lokálny vývoj) |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Redis |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Alias pre Redis (Vercel Marketplace) |
| `GEMINI_API_KEY` | AI mentor funkcie |
| `TELEGRAM_BOT_TOKEN` | Telegram bot |
| `TELEGRAM_CHAT_ID` | Whitelist jedného chatu |
| `TELEGRAM_WEBHOOK_SECRET` | Overenie webhooku |
| `NODE_ENV` | `secure` flag cookie |

## Spustenie a build

```bash
npm install
npm run dev      # next dev → http://localhost:3000
npm run build    # next build
npm run start    # next start
```

Deploy: push do GitHub → Vercel (pozri root `NAVOD.md`).

## Testy

V repozitári **nie sú** automatizované testy.
Overenie zmien: manuálne podľa scenárov z Planning Agenta + `npm run build` pri rizikovejších zmenách.

## Mapa: obrazovka → logika → dáta

| Obrazovka | Hlavná logika | Kolekcie (R/W) | Content |
|-----------|---------------|----------------|---------|
| Dnes | greeting, daily focus, quick access, badges | R: entries, reflections, objAttempts, products, userObjections, settings, progress; W: settings (dailyFocus cache) | program, mindset, objections |
| Program | unlock, completeWeek | R/W: progress; R days z entries/reflections | program.ts |
| Denník | 1 reflexia/deň + večerné zhrnutie | R/W: reflections, settings; R: progress | week.reflection |
| Záznamy | draft, coaching zápis, debrief tlačidlo | R/W: entries, settings | chips (labely) |
| Námietky | pickNext scoring | R/W: objAttempts, userObjections | objections.ts |
| Produkty | quiz by lastReviewed | R/W: products | productFields.ts |
| Mindset | quote of day, favorites | R/W: myThoughts, settings | mindset.ts |
| Štatistiky | agregácie + AI | R: entries…; W: settings (AI cache) | chips |
| AI Mentor | chat + fingerprint briefing | R: entries…; R/W: settings, mentorMessages | (žiadny content) |
| Plusy/mínusy | merge + AI | R/W: selfNotes, settings; R: entries | (žiadny content) |
| Otázky / Poznámky / Požiadavky / Hardvér / Manuály | CRUD patterns | príslušné kolekcie | seed manuálu v page |

## Architektonické pravidlá pre budúci vývoj

1. Nové používateľské dáta = nová alebo existujúca **kolekcia** v `types.ts` + `COLLECTION_NAMES` + sync cez store.
2. Statický tréningový obsah patrí do `content/`, nie do Redis.
3. AI volania idú cez `app/api/mentor/*`, nie priamo z browseru na Gemini.
4. Auth nemeniť na komplexný systém bez explicitnej požiadavky.
5. Preferovať existujúce UI primitives z `components/ui.tsx`.
6. Nepridávať zbytočné state knižnice: store je offline-first Context.

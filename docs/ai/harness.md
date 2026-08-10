# Harness: ochrana pred nebezpečnými zmenami

Harness je primeraný tomuto projektu: osobná Next.js PWA bez klasickej SQL databázy, bez testovacej sady, s Redis hash úložiskom a heslom v env.

## Červená zóna (zakázané bez explicitného ľudského schválenia v pláne)

| Riziko | Prečo | Čo robiť namiesto toho |
|--------|-------|-------------------------|
| Zmazať / flushnúť celý Redis alebo `.data.json` | strata všetkých dát používateľa | nikdy; max. cielený delete jednej položky cez existujúce UI/API |
| Bulk delete celej kolekcie „na čisto“ | nevratné | len so schválením a backup plánom |
| Commitnúť `.env`, heslá, `GEMINI_API_KEY`, `.data.json` | únik secretov | `.gitignore` už kryje; nemeň to |
| Exponovať `GEMINI_API_KEY` do client bundle | krádež kľúča | volania len cez `app/api/mentor/*` |
| Oslabiť auth (vypnúť middleware, soft cookie) | nechránené dáta | meniť auth len podľa schváleného plánu |
| Premenovať Redis kľúče `cp:*` alebo localStorage kľúče bez migrácie | strata sync / cache | migrácia musí byť v pláne |
| Odstrániť položku z `COLLECTION_NAMES` bez migrácie | osirelé dáta | plán + docs update |
| Veľký refaktor store/sync „cestou“ | riziko offline fronty | najmenšia zmena na konkrétnej obrazovke |
| Zmeniť sémantiku `updatedAt` merge | tiché prepísanie dát | zakázané bez plánu |
| Automaticky generovať AI pri každom page load | náklady, rate, UX | zostať pri on-demand + fingerprint |

## Žltá zóna (povolené, ale Planning Agent musí upozorniť)

- Zmena `Progress` / odomykania týždňov
- Zmena streak / badge prahov
- Zmena povinných polí `ProductCard`
- Zmena login cookie TTL alebo HMAC payload
- Pridanie novej kolekcie
- Zmena Gemini modelu alebo promptov (správanie mentora)
- Úpravy `middleware.ts` matcheru
- Zmeny v `content/program.ts` alebo `objections.ts` (produktový obsah)

## Zelená zóna (bežný vývoj po schválení)

- Úprava UI jednej stránky v existujúcom patterne
- Nové voliteľné pole na existujúcom type (spätne kompatibilné)
- Copy / microcopy (bez pomlčiek)
- Nová položka navigácie + stránka kopírujúca existujúci CRUD pattern
- Doplnenie dokumentácie v `docs/ai/`

## Povinné kontroly Implementation Agenta

Pred commitom zmeny aplikácie:

1. Scope sedí so schváleným promptom.
2. Nepristáli secret súbory do gitu.
3. Ak sa menil TypeScript / API: `npm run build` (ak je to v overení).
4. Manuálny scenár z plánu je popísaný vo výsledku.
5. Ak niečo z červenej zóny: **stop**.

## Čo harness zámerne nerobí

- Neblokuje `npm run dev` ani bežný edit stránok.
- Nevyžaduje CI testy (v projekte zatiaľ nie sú).
- Nepridáva runtime „guard“ knižnice do aplikácie.
- Nemení produkčnú konfiguráciu na Verceli (to je mimo tohto repa).

## Súvis so Cursor rules

Pravidlá v `.cursor/rules/` opakujú červenú zónu, aby ich agent videl pri práci.
Detail a zdôvodnenie ostávajú tu.

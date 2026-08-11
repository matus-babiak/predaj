# 🥋 Sales Dojo

Osobný online nástroj na systematické zlepšovanie predajných zručností.
Postavený na 12-týždňovom mentorskom pláne: psychológia predaja, dôvera
a rozhodovanie zákazníkov, nie skripty naspamäť.

## Moduly

- **Dnes**: úloha dňa podľa aktuálnej fázy programu, rýchle akcie, streak a odznaky
- **Denník**: 30-sekundový záznam po každom zákazníkovi (čo chcel, čoho sa bál,
  prečo kúpil/nekúpil, dôvera 1-5) + večerná reflexia s otázkami podľa fázy
- **Program**: 12 týždňov mikro-lekcií a denných úloh v 6 fázach
  (Základy → Diagnostika → Produkt → Námietky → Komunikácia → Analýza),
  odomykanie vlastným tempom
- **Námietky**: banka 24 námietok z prostredia PC servisu s rozborom
  *uznaj → zisti → odpovedz*; tréning s vlastnou odpoveďou a sebahodnotením,
  slabšie námietky sa vracajú častejšie
- **Produkty**: kartičky produktov (komu pomáha / kedy áno / kedy nie /
  alternatívy / námietky) + režim skúšania
- **Štatistiky**: týždenné zhrnutia, trend dôvery, najčastejšie potreby
  a obavy zákazníkov, slabé námietky, odznaky

## Technika

- Next.js 15 + React 19 + Tailwind CSS 4, TypeScript
- Dáta: Upstash Redis (cez Vercel Marketplace), lokálne bez Redisu súbor `.data.json`
- Prihlásenie jedným heslom (`APP_PASSWORD` env premenná), podpísaná cookie
- Offline-first: dáta sa ukladajú okamžite v prehliadači a synchronizujú na server

## Lokálne spustenie

```bash
npm install
npm run dev     # http://localhost:3000
```

Bez nastaveného `APP_PASSWORD` beží appka lokálne bez prihlásenia.

## Nasadenie

Pozri [NAVOD.md](NAVOD.md): krok za krokom GitHub + Vercel + heslo.
Každý push do repozitára spustí automatický deployment na Verceli.

## Hybrid AI mentor (Gemini + Telegram)

Env premenné (Vercel → Settings → Environment Variables):

| Premenná | Účel |
|----------|------|
| `GEMINI_API_KEY` | AI mentor (web + Telegram) |
| `TELEGRAM_BOT_TOKEN` | Telegram bot |
| `TELEGRAM_CHAT_ID` | Jediný povolený chat (whitelist) |
| `TELEGRAM_WEBHOOK_SECRET` | Overenie webhooku |

Webhook (po nasadení, nahraď doménu a secret):

```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"https://<domena>/api/telegram\",\"secret_token\":\"$TELEGRAM_WEBHOOK_SECRET\"}"
```

Telegram bot len radí, do záznamov / denníka nič neukladá. Žiadny ranný push.

## AI development

Pre systematický AI vývoj (plánovanie oddelené od implementácie) pozri
[docs/ai/README.md](docs/ai/README.md). Príkazy v Cursore: `/dojo-plan`, `/dojo-implement`.

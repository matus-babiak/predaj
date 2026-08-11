# Návod na nasadenie (GitHub + Vercel): cca 10 minút

Výsledok: appka **Sales Dojo** beží na adrese typu `https://sales-dojo.vercel.app`,
funguje na mobile aj PC, dáta sa synchronizujú a vstup chráni tvoje heslo.

## Krok 1: Kód je už na GitHube ✔

Repozitár je hotový a nahraný: **github.com/matus-babiak/predaj**.
Keď budeš v priečinku niečo meniť, stačí:

```bash
cd /Users/matus/Documents/Claude/predaj
git add .
git commit -m "popis zmeny"
git push
```

## Krok 2: Nasaď na Vercel

1. Choď na [vercel.com](https://vercel.com) a prihlás sa cez **Continue with GitHub**.
2. Klikni **Add New… → Project** a pri repozitári `predaj` klikni **Import**.
3. (Voliteľné) **Project Name** premenuj na `sales-dojo`, určí to výslednú
   adresu `sales-dojo.vercel.app`.
4. Nič ďalšie nemeň (Vercel sám spozná Next.js) a klikni **Deploy**.
5. Po minúte máš appku online. Zatiaľ bez hesla a bez databázy, to doriešia
   kroky 3 a 4.

## Krok 3: Pripoj databázu (Upstash Redis, zadarmo)

1. V projekte na Verceli otvor záložku **Storage**.
2. Klikni **Create Database** (alebo Browse Marketplace) a vyber **Upstash** → **Redis**.
3. Zvoľ **Free** plán, región nechaj navrhnutý (ideálne Frankfurt, `fra1`), potvrď.
4. Pri otázke, ku ktorému projektu pripojiť, vyber svoj projekt a potvrď, Vercel sám doplní premenné `KV_REST_API_URL` a `KV_REST_API_TOKEN`.

## Krok 4: Nastav si heslo

1. V projekte na Verceli: **Settings → Environment Variables**.
2. Pridaj premennú:
   - **Name:** `APP_PASSWORD`
   - **Value:** heslo, ktoré si vymyslíš (toto budeš zadávať pri prihlásení)
   - Prostredia nechaj zaškrtnuté všetky.
3. Ulož a potom v záložke **Deployments** pri najnovšom nasadení klikni
   **⋯ → Redeploy**, aby sa heslo aj databáza načítali.

## Krok 5: Otvor a nainštaluj na mobil

1. Otvor adresu appky na mobile, zadaj heslo.
2. **iPhone (Safari):** Zdieľať → **Pridať na plochu**.
   **Android (Chrome):** menu ⋮ → **Pridať na plochu**.
3. Odteraz sa appka správa ako natívna, ikonka na ploche, celá obrazovka.

## Krok 6 (voliteľné): AI mentor + Telegram

1. Vo Verceli pridaj `GEMINI_API_KEY` (Google AI Studio).
2. Pre Telegram chat pridaj:
   - `TELEGRAM_BOT_TOKEN` (od @BotFather)
   - `TELEGRAM_CHAT_ID` (tvoje chat ID)
   - `TELEGRAM_WEBHOOK_SECRET` (náhodný tajný reťazec)
3. Redeploy projektu.
4. Nastav webhook:

```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"https://<tvoja-domena>/api/telegram\",\"secret_token\":\"$TELEGRAM_WEBHOOK_SECRET\"}"
```

Bot odpovedá na správy podľa dát v appke. Do appky z Telegramu nič neukladá.

## Keď budeš chcieť niečo zmeniť

Každý `git push` na GitHub automaticky nasadí novú verziu na Vercel.

## Riešenie problémov

- **„Nesprávne heslo“**: skontroluj `APP_PASSWORD` vo Verceli a či si po zmene
  spravil Redeploy.
- **Dáta sa nesynchronizujú medzi zariadeniami**: skontroluj v Settings →
  Environment Variables, či existujú `KV_REST_API_URL` a `KV_REST_API_TOKEN`
  (krok 3), a sprav Redeploy.
- **Appka píše „Offline“**: zápisy sa ukladajú v zariadení a odošlú sa samy,
  keď bude spojenie.

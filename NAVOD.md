# Návod na nasadenie (GitHub + Vercel) — cca 10 minút

Výsledok: appka beží na adrese typu `https://cesta-predajcu.vercel.app`,
funguje na mobile aj PC, dáta sa synchronizujú a vstup chráni tvoje heslo.

## Krok 1 — Nahraj kód na GitHub

1. Ak nemáš účet, založ si ho na [github.com](https://github.com).
2. Na GitHube klikni **New repository**, názov napr. `cesta-predajcu`,
   nechaj **Private**, nič iné nezaškrtávaj, **Create repository**.
3. V termináli v priečinku projektu spusti (URL vymeň za svoju z GitHubu):

```bash
cd /Users/matus/Documents/Claude/predaj
git init
git add .
git commit -m "Cesta predajcu v1"
git branch -M main
git remote add origin https://github.com/TVOJE-MENO/cesta-predajcu.git
git push -u origin main
```

## Krok 2 — Nasaď na Vercel

1. Choď na [vercel.com](https://vercel.com) a prihlás sa cez **Continue with GitHub**.
2. Klikni **Add New… → Project** a pri repozitári `cesta-predajcu` klikni **Import**.
3. Nič nemeň (Vercel sám spozná Next.js) a klikni **Deploy**.
4. Po minúte máš appku na `https://cesta-predajcu-….vercel.app`. Zatiaľ bez
   hesla a bez databázy — to doriešia kroky 3 a 4.

## Krok 3 — Pripoj databázu (Upstash Redis, zadarmo)

1. V projekte na Verceli otvor záložku **Storage**.
2. Klikni **Create Database** (alebo Browse Marketplace) a vyber **Upstash** → **Redis**.
3. Zvoľ **Free** plán, región nechaj navrhnutý (ideálne Frankfurt — `fra1`), potvrď.
4. Pri otázke, ku ktorému projektu pripojiť, vyber `cesta-predajcu` a potvrď —
   Vercel sám doplní premenné `KV_REST_API_URL` a `KV_REST_API_TOKEN`.

## Krok 4 — Nastav si heslo

1. V projekte na Verceli: **Settings → Environment Variables**.
2. Pridaj premennú:
   - **Name:** `APP_PASSWORD`
   - **Value:** heslo, ktoré si vymyslíš (toto budeš zadávať pri prihlásení)
   - Prostredia nechaj zaškrtnuté všetky.
3. Ulož a potom v záložke **Deployments** pri najnovšom nasadení klikni
   **⋯ → Redeploy**, aby sa heslo aj databáza načítali.

## Krok 5 — Otvor a nainštaluj na mobil

1. Otvor adresu appky na mobile, zadaj heslo.
2. **iPhone (Safari):** Zdieľať → **Pridať na plochu**.
   **Android (Chrome):** menu ⋮ → **Pridať na plochu**.
3. Odteraz sa appka správa ako natívna — ikonka na ploche, celá obrazovka.

## Keď budeš chcieť niečo zmeniť

Každý `git push` na GitHub automaticky nasadí novú verziu na Vercel.

## Riešenie problémov

- **„Nesprávne heslo“** — skontroluj `APP_PASSWORD` vo Verceli a či si po zmene
  spravil Redeploy.
- **Dáta sa nesynchronizujú medzi zariadeniami** — skontroluj v Settings →
  Environment Variables, či existujú `KV_REST_API_URL` a `KV_REST_API_TOKEN`
  (krok 3), a sprav Redeploy.
- **Appka píše „Offline“** — zápisy sa ukladajú v zariadení a odošlú sa samy,
  keď bude spojenie.

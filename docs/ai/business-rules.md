# Business rules

Pravidlá rozdelené podľa závažnosti. AI ich pri plánovaní aj implementácii **musí skontrolovať**.

Zdroj je kód. Pri konflikte s textom v README platí kód.

---

## Kritické

Porušenie = strata dát, bezpečnostná diera, alebo rozbitie jadra produktu.

### K1: Auth cookie a heslo
- Heslo žije len v `APP_PASSWORD`, nikdy v kóde ani v clientoch.
- Token: HMAC s prefixom `cesta-predajcu:`, cookie `cp_auth`, httpOnly.
- Bez `APP_PASSWORD` je appka otvorená (zámer pre lokálny vývoj).
- `/api/login` nesmie byť omylom chránené middleware matcherom.
- Open redirect: návratová cesta po logine musí zostať bezpečná (`safeReturnPath` na login page).

### K2: Integrita sync a `updatedAt`
- Každá mutácia musí nastaviť `updatedAt`.
- Merge je last-write-wins podľa `updatedAt`. Zmena tejto sémantiky bez plánu = riziko straty dát.
- Klientsky cache kľúče: `cp_cache_v1`, `cp_queue_v1`. Premenovanie bez migrácie = strata lokálnych dát.

### K3: Redis kľúče a kolekcie
- Serverové kľúče: `cp:{collection}`.
- Nová kolekcia musí byť v `COLLECTION_NAMES`, inak sa nesynchronizuje správne.
- Neimplementovať „wipe all“ / bulk delete všetkých kolekcií bez explicitného schválenia.

### K4: Reflexia: jedna na deň
- `Reflection.id` = dátum dňa. Prepísanie iným id by rozbilo denný model a štatistiky streaku.
- Nový formulár vyžaduje `priceDay` a `focus`. `wins` / `losses` sú voliteľné zoznamy.
- Otázky týždňa z programu už nie sú večerný formulár (ostávajú v `content/program.ts` ako obsah lekcie).

### K5: Progress singleton
- `Progress.id` musí ostať `"progress"`. Viacero progress dokumentov by rozbilo program.

### K6: Settings singleton + AI cache
- `Settings.id` = `"settings"`.
- AI polia vo settings sú cache; ich zmazanie bez náhrady nie je katastrofa, ale omylom zmazať celý settings objekt áno (draft, favorites).

### K7: Gemini kľúč
- `GEMINI_API_KEY` len na serveri. Nikdy neexponovať do client bundle.

### K8: Typografia repozitára
- Žiadne em dash (—) ani en dash (–) v textoch, ktoré sa pridávajú do repozitára (`CLAUDE.md`).
- Pre prázdne UI hodnoty použi `-` (spojovník), nie čiarku.

---

## Dôležité

### D1: Odomykanie programu
- Týždeň `num > currentWeek` je zamknutý (ak nie je už completed).
- Dokončenie vyžaduje: lekcia v `readLessons` **a** `daysInCurrentWeek >= minDays` (všetky týždne majú `minDays: 4`).
- Výnimka: UI „dokončiť aj tak“ po potvrdení.
- Po complete: `currentWeek = min(12, w.num+1)`, zapíš `weekStarts`.

### D2: Počet dní v týždni
- `daysInCurrentWeek` počíta unikátne dni z entries (`ts >= start`) a reflections (`updatedAt >= start`) od `weekStarts[currentWeek]` (fallback `startedAt`).
- Zmena tejto logiky mení tempo celého programu.

### D3: Entry: povinné polia formulára Záznamy
- Uloženie vyžaduje `requestText`, `outcome`, `priceTiming` a `hadNextStepPlan`.
- `itemCount` default 0, `askedReview` default false.
- `objection`: text z dropdownu alebo vlastný (vlastný má prednosť); prázdne = námietka nepadla.
- `pluses` / `minuses`: polia riadkov, prázdne sa neukladajú.
- Pri uložení sa `requestText` syncne do `requests` (nová položka alebo `count + 1` pri rovnakom otvorenom texte, case-insensitive), rovnaká sémantika ako stránka Požiadavky.
- Staršie polia (`want`, `fear`, `why`, `trust`, `objectionReaction`, `plus`, `minus`) sa v novom formulári nezapisujú, ale v histórii ostávajú.

### D4: Entry draft
- Rozpísaný záznam sa autosave-uje do `settings.entryDraft`, aby sa nestratil pri idle logout.
- Po úspešnom uložení záznamu treba draft vyčistiť (aktuálne správanie pri `saveEntry`).

### D5: Námietky: pickNext
- Priorita: nižší priemer ratingu a menej recentné → vyššia šanca.
- Netrénované majú efektívne `avg` 1.8.
- Reveal odpovede až po ≥5 znakoch vlastnej odpovede.
- Rating len 1 | 2 | 3.

### D6: ProductCard spätná kompatibilita
- Polia `who`, `when`, `whenNot`, `alternatives`, `objections` ostávajú povinné v type.
- Nové polia majú byť voliteľné, aby staré kartičky nespadli.

### D7: Streak
- Aktívny deň = entry alebo reflection.
- Streak môže končiť dnes alebo včera (ak dnes ešte nie je zápis).

### D8: Odznaky
- Prahy a fázy sú v `lib/gamify.ts` (`computeBadges`). Meniť len vedome: first, streak7/30, e50/e200, obj25/100, prod10, ph1-ph6.

### D9: Požiadavky: frekvencia
- Rovnaký otvorený text (case-insensitive) zvyšuje `count`, nevytvára duplicitný open item.

### D10: Manuály seed
- Prázdna banka sa raz naseeduje manuálom „Zisťovanie“; duplicity rovnakého názvu sa čistia.
- Zmazať manuál len ak ostane aspoň jeden.

### D11: AI on-demand + fingerprint
- AI sa nevolá pri každom renderi (okrem Domov: `dailyFocus` max 1× za kalendárny deň cez `dailyFocusDate`).
- Fingerprint vo settings určuje, či je cache `stale`.
- Mentorské endpointy nemajú server-side rate limit: nepridávať automatické bulk volania.
- Telegram bot nezapisuje do predajných kolekcií; len `mentorMessages` + odpoveď.

### D12: Offline-first UX
- Zápis musí najprv aktualizovať lokálny stav, potom frontu.
- Nesmie sa stať, že UI čaká na server pred zobrazením vlastného zápisu.

---

## Bežné

### B1: Dve kroky pri mazaní
- Pattern „zmazať“ → „naozaj zmazať“ / „nie“ (EntryRow a podobné).

### B2: Open / Done taby
- Otázky, poznámky, požiadavky, hardvér: mobil taby, desktop často dva stĺpce.

### B3: Deep link `?q=id`
- Mindset, Námietky, Produkty cez `DeepLinkParam`.

### B4: Hash `#reflexia`
- Denník scroll na večernú reflexiu.

### B5: Desktop auto-logout
- Len `pointer: fine`; warning po 30s idle, logout po ďalších 30s.
- Return URL sa má zachovať.

### B6: Search
- Ctrl/Cmd+K alebo `/` (mimo inputov).

### B7: Jazyk UI
- Slovensky. Nové reťazce v SK.

### B8: ready gate
- Stránky: `if (!ready) return null` pred renderom dát.

### B9: Quiz produktov
- Ďalší produkt = najstarší `lastReviewed` (least recently reviewed).

### B10: Štatistiky weak objections
- „Slabé“ námietky: priemer ratingu pod 2.5 (pozri `statistiky/page.tsx`).

---

## Pri plánovaní zmeny

Planning Agent musí pri každej úlohe vypísať:
- ktoré pravidlá z tohto zoznamu sú dotknuté,
- či niektoré kritické/dôležité treba zachovať bezo zmeny,
- čo overí Implementation Agent po zmene.

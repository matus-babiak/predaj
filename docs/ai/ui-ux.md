# UI / UX

> Zdroj: `components/Shell.tsx`, `components/ui.tsx`, stránky v `app/`.

## Brand a tón

- Názov: **Sales Dojo**, emoji 🥋 v nav a title.
- Jazyk: slovenčina, tykanie (osobný nástroj).
- Domovský pozdrav obsahuje meno **Matúš** (natvrdo v kóde).
- Téma farieb: indigo akcent (`indigo-600`), zinc neutrálne, podpora `dark:`.

## Layout

- Mobil: sticky header + hamburger menu.
- Desktop (`sm:`): sticky sidebar šírky `w-60`, main content vedľa.
- Login: bez Shell chrome.
- Max šírka main na mobile: `max-w-3xl`; na desktope voľnejšie.

## Navigácia

15 položiek v `NAV` (pozri `product.md`). Active state: `pathname === href` (presná zhoda, nie prefix).

Footer sidebaru:
- streak (ak je väčší ako 0),
- sync status (Načítavam / Uložené / Ukladám / Offline…),
- Odhlásiť sa (s potvrdením).

## Zdieľané UI (`components/ui.tsx`)

Používať existujúce:
- `Card`, `SectionTitle`, `Btn` (primary / ghost / danger)
- `Chip`, `TextArea`, `Input`, `Label`, `Modal`
- `RichText` (jednoduché `**tučné**`)

Nepriďávať novú UI knižnicu, kým to požiadavka nevyžaduje.

## Opakujúce sa UX patterns

| Pattern | Kde |
|---------|-----|
| `if (!ready) return null` | takmer všetky stránky |
| Indigo highlight card pre primárnu akciu | Dnes, Program, AI |
| Open / Done (alebo Plus / Minus) taby | Otázky, Poznámky, Požiadavky, Hardvér, Plusy |
| Dvojkrokové mazanie | EntryRow, karty |
| Train: napíš → odhal → ohodnoť | Námietky, podobne Produkt quiz |
| AI on-demand + „stale“ podľa fingerprint | Plusy, AI Mentor briefing, Štatistiky |
| Domov: priorita na dnes (max 1×/deň) | `settings.dailyFocus*` |
| Debrief tlačidlo pri zázname | Záznamy / EntryRow |
| Večerné zhrnutie tlačidlo | Denník po uložení reflexie |
| Mentor chat | AI Mentor + Telegram webhook |
| Deep link `?q=` | Mindset, Námietky, Produkty |
| Autosave draft | Záznamy → `settings.entryDraft` |
| Coaching zápis Záznamov | požiadavka (+ sync do Požiadaviek), výsledok, položky 0-5+, recenzia, cena, námietka (dropdown/vlastná), plán kroku, plusy/mínusy (viac riadkov), jedna veta |

## Sync feedback

Používateľ musí vidieť, či sú dáta uložené / pending / offline.
Nemeň labely sync statusu bez dôvodu: sú v `SYNC_LABEL` v Shell.

## Prístupnosť a mobile

- PWA: `manifest.webmanifest`, apple web app metadata.
- Viewport: `maximumScale: 1`, `viewportFit: cover` (zámer pre mobilnú appku).
- Desktop idle logout len na jemnom pointeri.

## Čo nerobiť v UI bez schválenia

- Neprerábať celú navigáciu kvôli jednej obrazovke.
- Nepridávať dashboard-style clutter na **Dnes** (hub má zostať rýchly).
- Nekopírovať anglické default labely do SK UI.
- Nepoužívať em/en pomlčky v copy (`CLAUDE.md`).

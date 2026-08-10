# Sales Dojo: AI Knowledge Base

Toto je **zdroj pravdy pre AI development** tohto projektu.
Keď dokumentácia a kód nie sú v súlade, **aktuálny kód je technická pravda**.
Konflikt sa má zaznamenať (pozri `docs-audit.md`), nie potichu prepísať.

## Pre koho

- **Ty (človek):** píšeš požiadavku bežnou rečou a schvaľuješ návrh.
- **Planning Agent** (`/dojo-plan`): pochopí, skontroluje kontext a kód, navrhne, počká na schválenie.
- **Implementation Agent** (`/dojo-implement`): až po schválení implementuje podľa promptu.

## Mapa dokumentov

| Dokument | Účel |
|----------|------|
| [product.md](./product.md) | Čo aplikácia je, pre koho, flows, MVP, mimo scope |
| [architecture.md](./architecture.md) | Stack, vrstvy, entry pointy, build, deploy |
| [data-model.md](./data-model.md) | Kolekcie, typy, sync, úložisko |
| [business-rules.md](./business-rules.md) | Pravidlá, ktoré sa nesmú porušiť |
| [ui-ux.md](./ui-ux.md) | Obrazovky, navigácia, UX patterns |
| [workflow.md](./workflow.md) | Plánovanie vs. implementácia, testovateľnosť |
| [agent.md](./agent.md) | Role agentov, ľudská komunikácia |
| [harness.md](./harness.md) | Ochrana pred nebezpečnými zmenami |
| [docs-audit.md](./docs-audit.md) | Stav pôvodnej dokumentácie vs. kód |
| [golden-example.md](./golden-example.md) | Overený príklad Planning Agenta |

## Ako spustiť workflow

1. Napíš požiadavku ľudskou rečou.
2. Spusti **`/dojo-plan`**.
3. Odpovedz na otázky (ak sú).
4. Schváľ alebo uprav návrh.
5. Spusti **`/dojo-implement`** so schváleným implementačným promptom.

Podrobnosti: [workflow.md](./workflow.md).

## Čo táto KB nie je

- Nie je návod na nasadenie pre začiatočníka (to ostáva v `NAVOD.md`).
- Nie je marketingový popis produktu.
- Nemení samotnú aplikáciu. Popisuje ju, aby ju AI vedela bezpečne rozvíjať.

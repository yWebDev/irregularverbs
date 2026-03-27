# Requirements traceability matrix

This document maps **product features** to **automated tests** and defines how we check **consistency**, **completeness**, and **verifiability** of requirements.

## Feature → tests

| Feature / requirement area | Unit / component | A11y (axe) | E2E (Playwright) | Notes |
| --- | --- | --- | --- | --- |
| App shell, routing, layout | `app.component.spec.ts` | `app.component.a11y.spec.ts` | — | Shell and bootstrap |
| Search: input, results, navigation | `search.component.spec.ts`, `verb-input.component.spec.ts`, `verb-info.component.spec.ts` | `search.component.a11y.spec.ts`, `verb-input.component.a11y.spec.ts` | `e2e/tests/search.spec.ts` | Search UX |
| Verb examples / AI content display | `verb-examples.component.spec.ts` | — | — | Sanitization covered in component tests |
| Verbs table (list, patterns) | `verbs.component.spec.ts` | `verbs.component.a11y.spec.ts` | `e2e/tests/verbs.spec.ts` | Table and worker-backed behavior |
| Game: core flow | `game.component.spec.ts` | `game.component.a11y.spec.ts` | `e2e/tests/game.spec.ts` | Drag-drop and scoring |
| Game: how-to dialog | `how-to-play.component.spec.ts` | `how-to-play.component.a11y.spec.ts` | — | Modal focus |
| Game: game-over dialog | `game-over-dialog.component.spec.ts` | `game-over-dialog.component.a11y.spec.ts` | — | Modal focus |
| Game: promo, login | `game-promo.component.spec.ts`, `login.component.spec.ts` | — | — | Auth entry |
| Services: verbs, auth, prompt, config | `verbs.service.spec.ts`, `auth.service.spec.ts`, `prompt.service.spec.ts`, `config.service.spec.ts` | — | — | API and state boundaries |
| Pure utilities | `functional.spec.ts`, `verb-pattern.spec.ts` | — | — | Pattern and FP helpers |

Rows without E2E coverage rely on **unit/component** tests or **manual** checks until scenarios are added in `e2e/tests/`.

## Validation process

### Consistency checks

- **Naming:** Feature areas in this matrix align with route names and main components under `src/app/components/`.
- **Trace IDs:** Pull requests that change behavior should reference the affected row (feature) and add or update tests in the same change when feasible.
- **ADRs:** Architectural shifts (state, E2E, logging, i18n) are recorded under `docs/adr/` so requirements and implementation do not drift silently.

### Completeness analysis

- **Coverage gaps:** Any feature row with empty columns is a candidate for new tests. Prioritize user-facing flows (search, verbs, game) for E2E; prioritize interactive widgets for a11y specs.
- **Non-functional requirements:** Security, performance, and observability are verified by CI jobs (lint, tests, audits), server integration tests in `irregularverbs-server`, and operational checks (health endpoint, monitoring) as documented in ADR 0004.

### Verifiability criteria

Each feature should be **observable** and **testable** as follows:

| Criterion | Meaning for this project |
| --- | --- |
| Given–When–Then | E2E and key component tests express a clear user action and outcome. |
| Deterministic mocks | Services use test doubles or `HttpClientTestingModule` so failures map to a specific contract. |
| Accessibility | Interactive surfaces have `*.a11y.spec.ts` where axe rules catch regressions. |
| Regression | Bug fixes include a test that would fail without the fix. |

## Maintenance

Update this matrix when:

- New routes or major components ship
- New E2E or integration suites are added
- A feature is deprecated (mark row or remove with PR reference)

**Owner:** development team; **review:** as part of release or milestone planning.

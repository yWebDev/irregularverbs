# Contributing to Iverbs

This guide helps you set up a local environment, follow team workflow, and ship changes safely. The primary app lives in this directory (`irregularverbs`); the API is in `../irregularverbs-server` when you work on full-stack features.

## Prerequisites

- **Node.js** 20 LTS (same major version as GitHub Actions workflows)
- **npm** (use `npm ci` in CI; local `npm install` is fine for development)
- **Chrome** (for Karma unit tests) or rely on CI for headless runs
- For **E2E:** Playwright installs browsers on first run (`npx playwright install` if needed)

## Quick start

```bash
cd irregularverbs
npm install
npm run start:dev
```

- **`npm run start:dev`** — development configuration and proxy (see `angular.json` and environment files).
- **`npm start`** — staging-like configuration for integration with staging backends.

See [docs/ANGULAR_CLI.md](docs/ANGULAR_CLI.md) for CLI commands, build targets, and bundler notes.

## Repository layout (client)

| Path | Purpose |
| --- | --- |
| `src/app/` | Application code: components, services, store |
| `src/assets/` | Static assets, i18n JSON, WASM |
| `e2e/` | Playwright tests and configuration |
| `docs/` | ADRs, traceability matrix, CLI documentation |
| `.github/workflows/` | CI: deploy, security, technical-debt, etc. |

## Branching strategy

- **`main`** — production-ready; merges trigger deployment workflows where configured.
- **Feature branches** — named `feature/<short-description>` or `fix/<issue>`; branch from `main`, open a pull request back to `main`.
- Keep branches **short-lived**; rebase or merge `main` regularly to reduce integration pain.

## Pull request checklist

Before requesting review:

1. **Build and test locally:** `npm run lint`, `npm test -- --watch=false --browsers=ChromeHeadless`, and `npm run e2e` when you touch user flows or routing.
2. **Scope:** One logical change per PR; unrelated refactors belong in separate PRs.
3. **Tests:** Add or update unit/component/E2E tests for behavior changes; update [docs/requirements-traceability-matrix.md](docs/requirements-traceability-matrix.md) if you add a major feature area or new suite.
4. **ADRs:** For architectural decisions (new state approach, E2E tooling, logging, i18n), add or supersede entries in [docs/adr/](docs/adr/README.md).
5. **Accessibility:** For new interactive UI, consider `*.a11y.spec.ts` patterns used elsewhere under `src/app/components/`.
6. **Secrets:** Never commit API keys, tokens, or production credentials; use environment and CI secrets.

Reviewers check correctness, test coverage, consistency with existing patterns, and whether documentation matches the change.

## Deployment process (overview)

- Client and server each have their own **GitHub Actions** workflows under `.github/workflows/` (for example `gcp-deploy.yml`).
- Pipelines typically run **security checks**, **lint**, **unit tests with coverage**, and **build** before deploy to **Google App Engine**.
- Exact triggers and environments depend on branch and workflow files; read the workflow in the package you change before relying on behavior.

## Testing pyramid

```
        ┌─────────────┐
        │  E2E (few)  │  Playwright — critical paths
        ├─────────────┤
        │ Integration │  Components + services + HTTP mocks
        ├─────────────┤
        │ Unit (many) │  Services, reducers, utils, pipes
        └─────────────┘
```

- **Unit tests** — Fast, isolated; most business logic should be covered here.
- **Component tests** — Angular `TestBed`, DOM and inputs/outputs.
- **E2E** — Expensive; reserve for journeys that prove wiring across routes and real browser behavior.

## Architecture notes

- Significant decisions are recorded as **ADRs** in `docs/adr/`.
- **NgRx** holds shared client state; keep local UI state in components when it does not need to be global.
- **Playwright** is the standard E2E tool (see ADR 0003).

## Getting help

- Open an issue or internal ticket with reproduction steps for bugs.
- For cross-cutting design questions, propose an ADR draft and discuss in review.

Thank you for contributing.

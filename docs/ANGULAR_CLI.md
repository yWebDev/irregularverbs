# Angular CLI — Iverbs client

This app targets **Angular 21** (see `package.json`). Use the local CLI via `npx ng` or `npm run ng --`.

## Prerequisites

- Node.js 20 LTS (aligned with CI)
- npm 10+

## Core commands

| Command | Purpose |
|--------|---------|
| `npm start` | `ng serve` with **staging** config and default proxy (`src/proxy/staging.proxy.conf.json`). |
| `npm run start:dev` | `ng serve` with default **development** environment and `src/proxy/proxy.conf.json`. |
| `npm run build` | Production-style build using default `iverbs:build` (development `environment.ts`). Output: `dist/browser`. |
| `npm run build:prod` | `ng build --configuration=production` — optimizations, hashing, prod `environment.prod.ts`. |
| `npm test` | Karma + Jasmine unit tests (`ng test`). |
| `npm run lint` | ESLint via `ng lint` (`angular-eslint`). |
| `npm run e2e` | Playwright E2E tests. |

### Serve with explicit configuration

```bash
npx ng serve --configuration=staging
npx ng serve --configuration=production
```

Staging and production serve targets are defined in `angular.json` under `projects.iverbs.architect.serve.configurations`.

## Build targets and environments

| Configuration | Environment file | Notes |
|---------------|------------------|--------|
| *(default)* | `src/environments/environment.ts` | Local development. |
| `staging` | `environment.staging.ts` | Staging API URLs; used by `npm start`. |
| `production` | `environment.prod.ts` | AOT, optimization, budgets, license extraction. |

Build configurations live under `projects.iverbs.architect.build.configurations` in `angular.json`.

## Scaffolding (`ng generate`)

Examples (standalone components are the project default):

```bash
npx ng generate component features/example --standalone
npx ng generate service core/example
npx ng generate pipe shared/example
npx ng generate directive shared/example
```

Global schematic defaults (standalone, style suffix) are in `angular.json` under `projects.iverbs.schematics` and top-level `schematics`.

## Assets and third-party libraries

- **Assets**: `src/assets`, favicon, and root files `ads.txt`, `robots.txt`, `sitemap.xml` are copied via `angular.json` → `architect.build.options.assets`.
- **Styles**: Global SCSS entry `src/styles.scss` and `src/styles/variables.scss`.
- **Bundler**: `@angular-devkit/build-angular:application` (esbuild-based application builder). Output layout uses `outputPath.base` = `dist`.

## i18n and deploy

- **Extract messages**: `npx ng extract-i18n` (builder `extract-i18n` targets `iverbs:build`).
- **Firebase / GAE**: Production deploy uses `npm run build:prod` and `client.yaml` (see repository README / CI workflow).

## SonarCloud and CI (repository setup)

To enable **SonarCloud** scans in GitHub Actions:

1. Create a project at [SonarCloud](https://sonarcloud.io) and note the **organization key** and **project key**.
2. In the GitHub repository, add a **secret**: `SONAR_TOKEN` (from SonarCloud user security page).
3. Add **repository variables**: `SONAR_ORGANIZATION`, `SONAR_PROJECT_KEY` (match SonarCloud).

The `sonar-project.properties` file in this folder configures sources and LCOV (`coverage/iverbs/lcov.info`). If the variables are unset, the Sonar step is skipped so forks and local clones keep working.

Configure **quality gates** (coverage, duplication, maintainability) in the SonarCloud UI for this project; optional scanner flag `-Dsonar.qualitygate.wait=true` can be appended to the workflow `args` if you want the pipeline to fail when the gate fails.

## Coverage

Unit tests with coverage:

```bash
npm test -- --watch=false --browsers=ChromeHeadless --code-coverage
```

Reports are written under `coverage/iverbs/` (see `karma.conf.js`).

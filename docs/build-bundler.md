# Angular build, esbuild, and tooling

The `iverbs` app uses the **`application`** builder from Angular’s build system (esbuild-based via `@angular/build`). This document summarizes how the workspace configures it and how build metadata and the schematic fit in.

## Configurations (`angular.json`)

| Configuration   | Purpose |
|----------------|---------|
| **development** | Fast local work: no minification, source maps, named chunks. Default for `ng serve`. |
| **staging**     | Staging API env (`environment.staging.ts`), same build style as development. Used by `npm start`. |
| **production**  | Prod env, full **optimization** (scripts, style minify + critical CSS + font inlining), output hashing, license extraction, bundle budgets. |

Global build options include **AOT**, **SCSS** global styles (`src/styles/variables.scss`, `src/styles.scss`), and **`stylePreprocessorOptions.includePaths`** set to `src/styles` so partials can be imported with short paths.

Assets copy favicon, `src/assets`, and root files `ads.txt`, `robots.txt`, `sitemap.xml` into the output.

## Production build metadata (`build-info`)

Footer and tooling read **`PACKAGE_VERSION`**, **`BUILD_TIME_ISO`**, and **`GIT_COMMIT`** from `src/app/build-info.ts`.

- **Local / Karma / `ng build` without production**: the checked-in **`build-info.ts`** supplies placeholder values (`dev`, empty strings).
- **Production bundles**: Angular **`fileReplacements`** swaps `build-info.ts` for **`build-info.prod.ts`**.

**`npm run build:prod`** runs **`node tools/iverbs-builders/write-build-info.cjs`** (writes `build-info.prod.ts` from `package.json`, current time, and `git rev-parse --short HEAD`) then **`ng build --configuration=production`**. CI should use **`build:prod`** and a full git history (or shallow clone will yield `GIT_COMMIT` of `unknown`).

User esbuild plugins cannot reliably replace that module: Angular’s compiler handles `.ts` before those hooks, so this repo uses **pre-build generation + `fileReplacements`** instead.

## Custom schematic: `verb-component`

The workspace registers the local collection in **`angular.json`** → `cli.schematicCollections` (`./schematics/collection.json`), so you can run:

```bash
ng generate verb-component my-feature-name
```

Equivalent npm script: `npm run generate:verb-component -- my-feature-name`

Optional: `--path=src/app/components` (default selector prefix is `app-iv`, e.g. `app-iv-my-feature`; override with `--prefix=…`)

Creates a folder under `path` with `.ts`, `.html`, `.scss`, and `.spec.ts` wired like existing feature components (standalone `imports`, Karma + `provideRouter([])`).

## CLI commands used in this repo

| Command | Role |
|--------|------|
| `ng serve` / `ng serve --configuration=staging` | Dev server (proxy from `src/proxy/`). |
| `ng build` / `ng build --configuration=production` | Production/staging artifact under `dist/`. |
| `npm run build:prod` | Writes prod build-info, then production Angular build (use for deploys). |
| `ng test` | Karma unit tests. |
| `ng lint` | ESLint via `angular-eslint`. |
| `ng generate verb-component` | Project-specific component scaffold. |

## esbuild vs Vite

**`ng build`** uses Angular’s application pipeline (esbuild for bundling). **`ng serve`** uses **Vite** as the dev server in current `@angular-devkit/build-angular` setups.

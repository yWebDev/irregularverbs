# Angular build, esbuild, and tooling

The `iverbs` app uses the **`application`** builder from Angular’s build system (esbuild-based via `@angular/build`). This document summarizes how the workspace configures it and how the custom builder and schematic fit in.

## Configurations (`angular.json`)

| Configuration   | Purpose |
|----------------|---------|
| **development** | Fast local work: no minification, source maps, named chunks. Default for `ng serve`. |
| **staging**     | Staging API env (`environment.staging.ts`), same build style as development. Used by `npm start`. |
| **production**  | Prod env, full **optimization** (scripts, style minify + critical CSS + font inlining), output hashing, license extraction, bundle budgets. |

Global build options include **AOT**, **SCSS** global styles (`src/styles/variables.scss`, `src/styles.scss`), and **`stylePreprocessorOptions.includePaths`** set to `src/styles` so partials can be imported with short paths.

Assets copy favicon, `src/assets`, and root files `ads.txt`, `robots.txt`, `sitemap.xml` into the output.

## Custom builder: `application-with-build-info`

The project build target uses **`./tools/iverbs-builders:application-with-build-info`** instead of `@angular-devkit/build-angular:application`.

Architect requires builder option schemas to live **inside** the builder package (no `..` in `schema`), so this repo vendors a copy at `tools/iverbs-builders/angular-application.schema.json`. After a major `@angular-devkit/build-angular` upgrade, refresh it from  
`node_modules/@angular-devkit/build-angular/node_modules/@angular/build/src/builders/application/schema.json`.

The implementation loads **`buildApplication`** from the same nested `@angular/build` package that `build-angular` ships (no extra npm dependency).

That builder wraps Angular’s public **`buildApplication()`** API and registers **`codePlugins`**: an esbuild plugin (`build-info-plugin.cjs`) that intercepts `src/app/build-info.ts` and replaces it with:

- `PACKAGE_VERSION` from `package.json`
- `BUILD_TIME_ISO` (UTC ISO string at build time)
- `GIT_COMMIT` (`git rev-parse --short HEAD`, or `"unknown"`)

Editors and **Karma** still see the checked-in placeholder `build-info.ts`. **`ng build`** (target `build`) runs this custom builder, so production/staging artifacts get injected build metadata (footer shows `v…` with commit/time in `title` / `aria-label`).

### `build-serve` and `ng serve`

The CLI only treats **`@angular-devkit/build-angular:application`** (and siblings) as esbuild/Vite-based. A **local** builder name (`./tools/iverbs-builders:…`) is not, so `ng serve` was falling back to **Webpack** and produced false “unused TypeScript file” warnings.

This workspace adds a mirror target **`build-serve`** with the **stock** `application` builder and the **same options/configurations** as `build`. **`serve`** uses `iverbs:build-serve:…`. When you change build options, update **`build` and `build-serve` together**. Dev server footer build metadata stays placeholder values from `build-info.ts`; **`ng build`** still applies the esbuild plugin.

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
| `ng test` | Karma unit tests. |
| `ng lint` | ESLint via `angular-eslint`. |
| `ng generate verb-component` | Project-specific component scaffold. |

## esbuild vs Vite

**`ng build`** uses **esbuild** (via the custom builder wrapping `buildApplication`). **`ng serve`** uses **Vite** because it targets **`build-serve`** (`@angular-devkit/build-angular:application`), not the local builder package name.

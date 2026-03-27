# 0005 — Internationalization strategy

**Status:** Accepted  
**Date:** 2025-03-27

## Context

The product targets learners who may prefer multiple locales. Strings are currently embedded in templates and TypeScript in one language, which complicates translation and locale-specific formatting.

## Decision

We use **runtime translation** via `@ngx-translate` with JSON bundles under `assets/i18n/`, plus a language switcher in the shell. For build-time extraction and ICU workflows where needed, **Angular `@angular/localize`** may complement ngx-translate for specific templates. Date and number formatting use Angular pipes with an explicit locale where relevant.

## Consequences

- **Positive:** Translators can work on JSON files; switching language does not require a separate build per locale for the ngx-translate path.
- **Negative:** Two i18n mechanisms require clear guidelines to avoid mixing patterns inconsistently; all user-visible strings must be keyed and reviewed for context.

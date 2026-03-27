# 0003 — Use Playwright for end-to-end tests

**Status:** Accepted  
**Date:** 2025-03-27

## Context

End-to-end tests must validate critical user journeys (search, verb table, game) against real browsers. Protractor is deprecated and no longer aligned with modern Angular tooling.

## Decision

We standardize on **Playwright** for E2E automation. Tests live under `e2e/`, use npm scripts (`e2e`, `e2e:ui`, `e2e:report`), and follow the Page Object pattern where it reduces duplication.

## Consequences

- **Positive:** Active maintenance, strong cross-browser support, good debugging (trace, UI mode), aligns with industry direction away from Protractor.
- **Negative:** CI must install browsers or cache Playwright binaries; contributors need Node version alignment with the project.

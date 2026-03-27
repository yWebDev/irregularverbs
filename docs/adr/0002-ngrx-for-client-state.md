# 0002 — Use NgRx for client-side state

**Status:** Accepted  
**Date:** 2025-03-27

## Context

The application coordinates verb lists, search, game flow, and authentication across multiple routes and services. Local component state and ad hoc services alone make data flow harder to trace, test, and debug as features grow.

## Decision

We adopt **NgRx** (`@ngrx/store`, `@ngrx/effects`, `@ngrx/store-devtools`, `@ngrx/router-store`) for centralized, predictable state management. Feature areas (verbs, game, auth) use actions, reducers, and effects aligned with existing Angular services for side effects such as HTTP calls.

## Consequences

- **Positive:** Single source of truth, time-travel debugging via devtools, easier integration tests of state transitions, clearer separation of UI and domain logic.
- **Negative:** Boilerplate and learning curve for developers new to Redux-style patterns; overuse of global state should still be avoided for purely local UI concerns.

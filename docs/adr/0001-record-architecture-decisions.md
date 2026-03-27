# 0001 — Record architecture decisions

**Status:** Accepted  
**Date:** 2025-03-27

## Context

The project needs a durable, discoverable record of why important technical choices were made. Informal notes and chat history do not scale across contributors or time.

## Decision

We will maintain Architecture Decision Records (ADRs) in `docs/adr/` using a consistent template: Context, Decision, Consequences. Each ADR gets a monotonic numeric prefix and a short descriptive filename.

## Consequences

- **Positive:** Decisions are searchable, versioned with the repo, and reviewable in pull requests.
- **Negative:** Contributors must remember to add or update ADRs when making architectural changes; stale ADRs require explicit supersession or status updates.

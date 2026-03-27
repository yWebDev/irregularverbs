# 0004 — Logging and observability strategy

**Status:** Accepted  
**Date:** 2025-03-27

## Context

Production issues require structured logs, safe handling of sensitive data, and integration with the hosting environment. The stack includes an Angular client and a Node/Express API on Google App Engine, with room for client error reporting and cloud-native monitoring.

## Decision

- **Backend:** Prefer structured logging (e.g. Winston or Pino) with levels (info, warn, error, debug), PII sanitization before persistence, and integration with Google Cloud Logging where applicable. Replace ad hoc `console` usage for request and application logs in favor of a shared logger.
- **Frontend:** Use centralized error handling and, where configured, a client monitoring SDK (e.g. Sentry) for uncaught errors and performance traces.
- **Operations:** Expose a **health** endpoint for uptime and load-balancer checks; align alert policies with GCP Monitoring as the project matures.

## Consequences

- **Positive:** Easier incident triage, fewer accidental leaks of emails or tokens in logs, better correlation between client and server signals when both are instrumented.
- **Negative:** Extra dependencies and configuration; secrets and DSNs must be managed per environment without committing sensitive values.

# ADR-003 — Lazy Database Initialization

## Decision

Use `getDb()` instead of exporting a module-level database instance.

## Alternatives Considered

- Export a global `db` object.

## Rationale

Module-scope database initialization caused failures during:

- Docker builds
- Vitest imports

Both failures originated from import-time side effects.

Lazy initialization removes those side effects while maintaining module-level caching.

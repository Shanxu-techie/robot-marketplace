# ADR-009 — Index Creation Strategy

## Decision

Use standard `CREATE INDEX` migrations instead of `CREATE INDEX CONCURRENTLY` for the current project stage.

## Alternatives Considered

- Use `CREATE INDEX CONCURRENTLY` to avoid write blocking during index creation.

## Rationale

`CREATE INDEX CONCURRENTLY` is not a drop-in replacement in the current migration workflow.

PostgreSQL does not allow `CREATE INDEX CONCURRENTLY` inside a transaction block. The current Drizzle migration workflow uses standard transactional migrations, so adopting concurrent index creation would require a different migration strategy rather than a simple SQL change.

For the current project stage:

- the catalog has low traffic,
- tables contain a small dataset,
- index creation blocking risk is negligible.

The additional operational complexity is not justified yet.

Standard `CREATE INDEX` keeps migrations simple, reviewable, and consistent with the existing Drizzle workflow.

## Review Trigger

Revisit this decision if:

- the application reaches production scale with significant write traffic,
- large tables require index creation on active databases,
- migration downtime becomes a practical concern,
- a deployment workflow supporting non-transactional migrations is introduced.

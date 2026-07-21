# ADR-007 — No Transaction for E2E Seed Script

## Decision

Do not wrap `seedE2EInquiries` in a transaction.

## Alternatives Considered

- Wrap the seed process in a single database transaction.

## Rationale

The script seeds an isolated CI database.

If a failure occurs:

- the workflow fails,
- the next run deletes existing data,
- the database is reseeded from scratch.

Because the database is ephemeral and the seed process is idempotent, transactions provide little practical benefit.

## Review Trigger

Revisit if:

- the script begins writing related tables requiring atomic consistency,
- it is reused outside ephemeral CI environments,
- it becomes part of production or staging deployment workflows.

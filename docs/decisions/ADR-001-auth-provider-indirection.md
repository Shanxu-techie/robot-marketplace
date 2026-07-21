# ADR-001 — Auth Provider Indirection

## Decision

Internal foreign keys reference `users.id`, never `clerkUserId`.

## Alternatives Considered

- Reference `clerkUserId` directly throughout the schema.

## Rationale

Clerk is an external identity provider, not the application's relational source of truth.

If the authentication provider changes in the future, only:

- the `users` table
- the webhook synchronization layer

require changes.

The remainder of the schema and all foreign keys remain unaffected.

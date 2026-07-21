# ADR-005 — Restrict User-Owned Record Deletion

## Decision

Use `onDelete: 'restrict'` for every foreign key referencing `users`.

## Alternatives Considered

- `CASCADE`
- `SET NULL`

## Rationale

Business records such as inquiries and custom requests must outlive user access.

The database should enforce this invariant rather than relying on application logic.

Future user-owned tables follow the same pattern.

## Trade-off

Deleting a user requires explicitly resolving dependent records first.

Applications should implement soft deletion or account deactivation instead of hard deletion.

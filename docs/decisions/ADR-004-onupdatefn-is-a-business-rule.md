# ADR-004 — `$onUpdateFn()` is a Business Rule

## Decision

Apply `$onUpdateFn()` only to tables with genuine update workflows.

## Rationale

Not every table represents mutable business data.

Excluded:

- robotImages
- robotSpecifications
- testimonials

These tables are insert/delete oriented and do not require automatic update timestamps.

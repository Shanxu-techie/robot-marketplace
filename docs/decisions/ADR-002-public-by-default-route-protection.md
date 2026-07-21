# ADR-002 — Public-by-Default Route Protection

## Decision

Use `isProtectedRoute` (public-by-default) rather than `isPublicRoute` (protected-by-default).

Protected routes are defined centrally in `src/proxy.ts` using `createRouteMatcher`.

Current protected routes:

- `/dashboard`
- `/profile`
- `/orders`
- `/requests`
- `/favorites`
- `/admin`

Everything else is public.

## Alternatives Considered

- `isPublicRoute` (protected-by-default / fail-closed)

## Rationale

The Robot Marketplace MVP is primarily a public catalogue.

The important trade-off is not how often mistakes occur—it is how those mistakes fail.

### Public-by-default failure

A protected route is accidentally left public.

- Nothing crashes.
- No obvious error appears.
- The mistake is silent.
- It may only be discovered during code review, security testing, or after unintended data exposure.

### Protected-by-default failure

A public page is accidentally protected.

- Anonymous users are redirected to sign in.
- The problem is immediately visible.
- It becomes a usability issue rather than a security issue.

Security engineering generally prefers fail-closed systems because silent security failures are more dangerous than visible usability failures.

This project intentionally accepts the opposite trade-off because:

- the protected surface is currently very small,
- every protected route lives in a single matcher,
- reviewing that matcher during code review is straightforward,
- the application is overwhelmingly public.

## Review Trigger

Revisit this decision if any of the following occur:

- protected route groups grow beyond roughly ten,
- protection becomes distributed across multiple files,
- a feature introduces both public and authenticated views of the same resource,
- administrative functionality becomes comparable in size to the public catalogue.

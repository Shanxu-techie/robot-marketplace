# ADR-006 — GitHub Actions Version Pinning Strategy

## Decision

Use GitHub-maintained major version tags (for example `actions/checkout@v7`) instead of commit SHA pinning.

## Alternatives Considered

- Pin every action to an immutable commit SHA.

## Rationale

This is an actively developed personal project maintained by a single developer.

Using major version tags:

- receives compatible fixes automatically,
- reduces maintenance burden,
- follows GitHub's supported release channels.

The operational benefits currently outweigh the additional supply-chain protection provided by SHA pinning.

## Review Trigger

Revisit if:

- the project becomes production-critical,
- multiple maintainers contribute,
- organizational policy requires immutable references,
- stricter supply-chain requirements are introduced.

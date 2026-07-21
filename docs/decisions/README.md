# Architecture Decision Records

Index of ADRs for Robot Marketplace. Phase status and project history: see `../progress.md`.

| ADR                                                                 | Title                                       | Summary                                                                              | Phase |
| ------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------ | ----- |
| [ADR-001](./ADR-001-auth-provider-indirection.md)                   | Auth Provider Indirection                   | FKs reference `users.id`, never `clerkUserId`                                        | 3     |
| [ADR-002](./ADR-002-public-by-default-route-protection.md)          | Public-by-Default Route Protection          | `isProtectedRoute` matcher, public unless listed                                     | 3     |
| [ADR-003](./ADR-003-lazy-database-initialization.md)                | Lazy Database Initialization                | `getDb()` instead of a module-level instance                                         | 2     |
| [ADR-004](./ADR-004-onupdatefn-is-a-business-rule.md)               | `$onUpdateFn()` is a Business Rule          | Applied only to tables with real update workflows                                    | 3     |
| [ADR-005](./ADR-005-restrict-user-owned-record-deletion.md)         | Restrict User-Owned Record Deletion         | `onDelete: 'restrict'` on all FKs referencing `users`                                | 3     |
| [ADR-006](./ADR-006-github-actions-version-pinning-strategy.md)     | GitHub Actions Version Pinning Strategy     | Major version tags, not SHA pinning                                                  | 2     |
| [ADR-007](./ADR-007-no-transaction-for-e2e-seed-script.md)          | No Transaction for E2E Seed Script          | Seed script left unwrapped; DB is ephemeral                                          | 3     |
| [ADR-008](./ADR-008-ai-recommendation-validation-strategy.md)       | AI Recommendation Validation Strategy       | Two-stage: schema, then business-rule validation                                     | 4     |
| [ADR-009](./ADR-009-index-creation-strategy.md)                     | Index Creation Strategy                     | Standard `CREATE INDEX`, not `CONCURRENTLY`                                          | 2     |
| [ADR-010](./ADR-010-temporary-development-provider-nvidia-nim.md)   | Temporary Development Provider (NVIDIA NIM) | Dev-only `gpt-oss-20b`; does not satisfy Deliverable 7                               | 4     |
| [ADR-011](./ADR-011-buffer-ai-recommendations-before-responding.md) | Buffer AI Recommendations Before Responding | Buffer + validate before responding; deviates from Deliverable 7 streaming criterion | 4     |

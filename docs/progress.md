# Robot Marketplace — Progress Document

## Project Overview

B2B Next.js 16 platform for browsing, buying, and requesting custom robotic solutions. Users browse ready-made robots or configure custom robots. The platform targets businesses purchasing robotics solutions while providing an administrative backend for inquiries, orders, contracts, and receipts.

**Repository:** <https://github.com/Shanxu-techie/robot-marketplace>

### Deployment

- Frontend: Vercel
- Database: Neon (Postgres)

---

## Stack

| Layer          | Choice                                        |
| -------------- | --------------------------------------------- |
| Framework      | Next.js 16 (App Router)                       |
| Language       | TypeScript                                    |
| Styling        | Tailwind CSS                                  |
| Components     | shadcn/ui                                     |
| Database       | Neon (Serverless Postgres)                    |
| ORM            | Drizzle ORM + drizzle-kit                     |
| Authentication | Clerk                                         |
| Testing        | Vitest (Unit + Integration), Playwright (E2E) |
| CI/CD          | GitHub Actions                                |
| Containers     | Docker + Docker Compose                       |
| Hosting        | Vercel                                        |
| AI             | Vercel AI SDK (Phase 4)                       |

---

## Phase Status

| Phase                                  | Status         |
| -------------------------------------- | -------------- |
| Phase 0 — Environment Setup            | ✅ Complete    |
| Phase 1 — Landing Page                 | ✅ Complete    |
| Phase 2 — Database + API + Docker + CI | ✅ Complete    |
| Phase 3 — Authentication + Security    | ✅ Complete    |
| Phase 4 — Payments + AI                | 🔄 In Progress |
| Phase 5 — Production + System Design   | ⬜ Not Started |
| Phase 6 — Capstone                     | ⬜ Not Started |

---

## Phase 0 — Environment Setup ✅

### Deliverables

- Node.js, Git and SSH configured
- Next.js 16 project initialized
- GitHub repository created
- `.gitignore` configured
- `.env.example` committed
- Prettier configured
- Conventional commits adopted
- Initial project structure established

---

## Phase 1 — Landing Page ✅

### Deliverables

#### Design System

- OKLCH-based design tokens
- Dark-first theme
- Deep navy / electric blue / amber palette
- shadcn/ui initialized
- Reusable SectionHeading component
- Custom `ctaOutline` button variant

#### Components

- Responsive Navbar
- Hero
- TwoPaths
- Trust
- FeaturedRobots
- HowItWorks
- CTA Banner
- Footer

#### Data Layer

- Typed robot data
- RobotCard component
- Featured robots section

#### Engineering Decisions

- Glassmorphism navigation
- Design tokens instead of hardcoded colors
- Dark mode by default
- Typed reusable UI components

---

## Phase 2 — Database + API + Docker + CI ✅

### Deliverables

#### Database

- Drizzle schema
- 8 tables
- 3 enums
- Explicit FK delete behavior
- First migration applied
- Composite partial index
- Idempotent seed script

#### API

Implemented:

- `GET /api/robots`

Features:

- Zod validation
- Filtering
- Error handling
- Category filtering
- Featured filtering
- Primary image selection
- Visibility enforcement

#### Testing

Vitest configured.

Coverage includes:

- Happy path
- Validation errors
- Filter pass-through
- Database failures

Testing conventions established:

- Unit/integration tests co-located with source
- Playwright reserved exclusively for E2E

#### Docker

- Three-stage Dockerfile
- Docker Compose
- Standalone Next.js output
- Non-root runtime
- Correct file ownership using `--chown`
- Verified against live Neon database

#### CI/CD

GitHub Actions workflow:

- Parallel build/test jobs
- Pull Request validation
- Push validation
- Node.js 22
- `npm ci`
- Lockfile verification

#### Performance

Composite partial index:

\```sql
CREATE INDEX "idx_robots_category_featured"
ON "robots" USING btree ("category_id","featured")
WHERE "robots"."is_visible" = true;
\```

Optimized for:

- Category filtering
- Featured filtering
- Visible robots only

Applied via migration `0005_lively_thunderbolts.sql`. Verified directly
against the database (`pg_indexes`) after resolving local index drift left
over from the original stale branch. Index-creation strategy (standard
`CREATE INDEX` rather than `CONCURRENTLY`) documented in ADR-009.

#### Engineering Decisions

- Lazy `getDb()` initialization
- Query layer extracted from routes
- Route-level error boundaries
- Deterministic installs via `npm ci`
- Node 22 adopted across local, Docker and CI
- Drizzle partial-index code generation manually verified before migration

---

## Phase 3 — Authentication + Security ✅

### Deliverables

#### Schema Modularization

Schema split into domain-based files:

```text
src/db/schema/
├── users.ts
├── robots.ts
├── catalog.ts
├── inquiries.ts
├── testimonials.ts
└── index.ts
```

Completed:

- Monolithic schema split into domain modules
- `drizzle.config.ts` updated to use directory-based schema discovery
- `{ withTimezone: true }` standardized across all timestamp columns
- `$onUpdateFn()` applied only where records have genuine update workflows

---

#### Users

- UUID primary key (`defaultRandom()`)
- `clerkUserId` (unique external identity)
- `email` stored for display purposes
- `user_role` enum (`buyer`, `admin`)
- Email uniqueness intentionally removed (Clerk owns identity)

---

#### Authentication Architecture

Implemented authentication-provider indirection.

Internal relationships reference:

```text
users.id
```

Never:

```text
clerkUserId
```

Benefits:

- Authentication provider can be replaced without schema-wide FK changes.
- Clerk remains an external identity provider rather than the relational source of truth.

---

#### Clerk Integration

Completed:

- ClerkProvider added to root layout
- `proxy.ts` replaces `middleware.ts` in Next.js 16
- Public-by-default routing strategy
- Protected routes:
  - `/dashboard`
  - `/profile`
  - `/orders`
  - `/requests`
  - `/favorites`
  - `/admin`
- Sign-in page
- Sign-up page
- Redirect environment variables configured

---

#### Clerk Webhooks

Implemented:

```text
src/app/api/webhooks/clerk/route.ts
```

Features:

- Svix signature verification
- Raw body verification
- Primary email lookup using `primary_email_address_id`
- Idempotent inserts via `onConflictDoNothing()`

Response strategy:

| Condition             | Response |
| --------------------- | -------- |
| Invalid signature     | 400      |
| Missing headers       | 400      |
| Missing primary email | 200      |
| Unknown event         | 200      |

Verified:

```text
Sign Up
→ Clerk
→ Webhook
→ Users table
```

---

#### Row-Level Authorization

Implemented:

```text
src/lib/auth.ts
```

`getCurrentUser()`:

- `server-only`
- Guards directly on `!userId`
- Returns internal user record
- Returns `null` for unauthenticated requests or webhook race conditions

Dashboard:

- Server Component
- Redirects unauthenticated users
- Queries database directly
- Uses internal UUID
- Latest inquiries ordered by `createdAt DESC`

Database:

- `userId` foreign keys
- `NOT NULL`
- `onDelete: 'restrict'`
- Composite dashboard index:

```text
(userId, createdAt)
```

Authorization enforced at the query layer rather than trusting client input.

---

#### Playwright

Infrastructure completed.

Implemented:

- Dedicated Playwright configuration
- Separate E2E seed script
- Fixed Clerk test accounts
- Authenticated test helpers
- CI-ready E2E environment

---

#### CI Improvements

Completed:

- Dedicated Neon branch for CI
- Automated E2E database seeding
- Playwright integrated into GitHub Actions
- Stable authentication testing strategy
- Reliable webhook testing workflow

---

#### Infrastructure

- ngrok configured for webhook development
- Dynamic `ALLOWED_DEV_ORIGIN`
- Clerk webhook secret documented
- CI secrets configured

---

### Phase 3 Completion Criteria

Completed:

- ✅ Row-level authorization implemented
- ✅ User isolation enforced
- ✅ Authentication architecture completed
- ✅ Clerk integration completed
- ✅ Webhook synchronization completed
- ✅ Playwright infrastructure completed

Current carry-forward:

- Improve Playwright coverage as additional user flows are implemented
- Re-evaluate routing strategy if protected surface grows substantially

---

## Architectural Decision Records (ADR)

### ADR-001 — Auth Provider Indirection

#### Decision

Internal foreign keys reference `users.id`, never `clerkUserId`.

#### Alternatives Considered

- Reference `clerkUserId` directly throughout the schema.

#### Rationale

Clerk is an external identity provider, not the application's relational source of truth.

If the authentication provider changes in the future, only:

- the `users` table
- the webhook synchronization layer

require changes.

The remainder of the schema and all foreign keys remain unaffected.

---

### ADR-002 — Public-by-Default Route Protection

#### Decision

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

#### Alternatives Considered

- `isPublicRoute` (protected-by-default / fail-closed)

#### Rationale

The Robot Marketplace MVP is primarily a public catalogue.

The important trade-off is not how often mistakes occur—it is how those mistakes fail.

**Public-by-default failure**

A protected route is accidentally left public.

- Nothing crashes.
- No obvious error appears.
- The mistake is silent.
- It may only be discovered during code review, security testing, or after unintended data exposure.

**Protected-by-default failure**

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

#### Review Trigger

Revisit this decision if any of the following occur:

- protected route groups grow beyond roughly ten,
- protection becomes distributed across multiple files,
- a feature introduces both public and authenticated views of the same resource,
- administrative functionality becomes comparable in size to the public catalogue.

---

### ADR-003 — Lazy Database Initialization

#### Decision

Use `getDb()` instead of exporting a module-level database instance.

#### Alternatives Considered

- Export a global `db` object.

#### Rationale

Module-scope database initialization caused failures during:

- Docker builds
- Vitest imports

Both failures originated from import-time side effects.

Lazy initialization removes those side effects while maintaining module-level caching.

---

### ADR-004 — `$onUpdateFn()` is a Business Rule

#### Decision

Apply `$onUpdateFn()` only to tables with genuine update workflows.

#### Rationale

Not every table represents mutable business data.

Excluded:

- robotImages
- robotSpecifications
- testimonials

These tables are insert/delete oriented and do not require automatic update timestamps.

---

### ADR-005 — Restrict User-Owned Record Deletion

#### Decision

Use `onDelete: 'restrict'` for every foreign key referencing `users`.

#### Alternatives Considered

- `CASCADE`
- `SET NULL`

#### Rationale

Business records such as inquiries and custom requests must outlive user access.

The database should enforce this invariant rather than relying on application logic.

Future user-owned tables follow the same pattern.

#### Trade-off

Deleting a user requires explicitly resolving dependent records first.

Applications should implement soft deletion or account deactivation instead of hard deletion.

---

### ADR-006 — GitHub Actions Version Pinning Strategy

#### Decision

Use GitHub-maintained major version tags (for example `actions/checkout@v7`) instead of commit SHA pinning.

#### Alternatives Considered

- Pin every action to an immutable commit SHA.

#### Rationale

This is an actively developed personal project maintained by a single developer.

Using major version tags:

- receives compatible fixes automatically,
- reduces maintenance burden,
- follows GitHub's supported release channels.

The operational benefits currently outweigh the additional supply-chain protection provided by SHA pinning.

#### Review Trigger

Revisit if:

- the project becomes production-critical,
- multiple maintainers contribute,
- organizational policy requires immutable references,
- stricter supply-chain requirements are introduced.

---

### ADR-007 — No Transaction for E2E Seed Script

#### Decision

Do not wrap `seedE2EInquiries` in a transaction.

#### Alternatives Considered

- Wrap the seed process in a single database transaction.

#### Rationale

The script seeds an isolated CI database.

If a failure occurs:

- the workflow fails,
- the next run deletes existing data,
- the database is reseeded from scratch.

Because the database is ephemeral and the seed process is idempotent, transactions provide little practical benefit.

#### Review Trigger

Revisit if:

- the script begins writing related tables requiring atomic consistency,
- it is reused outside ephemeral CI environments,
- it becomes part of production or staging deployment workflows.

---

### ADR-008 — AI Recommendation Validation Strategy

#### Decision

Validate AI recommendations in two stages:

1. Validate the LLM response against the Zod schema.
2. Apply business-rule validation to the parsed recommendations.

Recommendations that violate business rules (for example, referencing a `robotId` outside the candidate set) are discarded. Remaining valid recommendations continue through the response pipeline.

If no valid recommendations remain after business validation, treat the AI response as a failure and return the dedicated recommendation error state.

#### Alternatives Considered

##### Fail the entire response if any recommendation is invalid

Rejected.

A single invalid recommendation should not prevent users from receiving other valid recommendations generated in the same response.

##### Accept all recommendations after schema validation

Rejected.

Schema validation cannot verify application-specific business rules such as candidate-set membership. Accepting all recommendations could expose invalid or inconsistent results to users.

#### Rationale

Schema validation and business validation solve different problems.

Zod ensures the AI response matches the expected data contract, but it cannot verify rules that depend on application state. Candidate-set membership, for example, requires knowledge of which robots were actually supplied to the model.

Filtering invalid recommendations allows the system to tolerate occasional LLM mistakes while still returning trustworthy results whenever possible. This improves resilience without compromising data integrity.

The validation strategy intentionally favors graceful degradation. Individual recommendation failures do not invalidate the entire response when trustworthy recommendations remain. The response is treated as a failure only after business validation determines that no valid recommendations remain, at which point the frontend displays the dedicated recommendation error state.

#### Consequences

##### Positive

- More resilient to occasional LLM contract violations.
- Valid recommendations remain usable even if individual recommendations fail validation.
- Clear separation between schema validation and business-rule validation.
- Additional business-rule validators can be added without changing the response schema.

##### Trade-offs

- Response processing requires an additional validation stage.
- Invalid recommendations are filtered from the final response.
- Validation failures should be logged to monitor AI quality and identify recurring issues.

#### Future Considerations

Additional business validation rules may be introduced alongside candidate-set validation, including duplicate recommendation detection and other application-specific consistency checks. Each rule should be evaluated independently rather than being coupled to schema validation.

---

### ADR-009 — Index Creation Strategy

#### Decision

Use standard `CREATE INDEX` migrations instead of `CREATE INDEX CONCURRENTLY` for the current project stage.

#### Alternatives Considered

- Use `CREATE INDEX CONCURRENTLY` to avoid write blocking during index creation.

#### Rationale

`CREATE INDEX CONCURRENTLY` is not a drop-in replacement in the current migration workflow.

PostgreSQL does not allow `CREATE INDEX CONCURRENTLY` inside a transaction block. The current Drizzle migration workflow uses standard transactional migrations, so adopting concurrent index creation would require a different migration strategy rather than a simple SQL change.

For the current project stage:

- the catalog has low traffic,
- tables contain a small dataset,
- index creation blocking risk is negligible.

The additional operational complexity is not justified yet.

Standard `CREATE INDEX` keeps migrations simple, reviewable, and consistent with the existing Drizzle workflow.

#### Review Trigger

Revisit this decision if:

- the application reaches production scale with significant write traffic,
- large tables require index creation on active databases,
- migration downtime becomes a practical concern,
- a deployment workflow supporting non-transactional migrations is introduced.

### ADR-010 — Temporary Development Provider (NVIDIA NIM)

#### Decision

Use NVIDIA NIM as a temporary, dev-only provider for the AI recommendation pipeline while OpenAI billing is unresolved, running `gpt-oss-20b` rather than the larger `gpt-oss-120b`. The smaller model is chosen because the objective right now is validating pipeline mechanics, not maximizing recommendation quality, and its lower latency makes iterative testing faster.

#### Scope

This validates streaming mechanics end-to-end: provider integration, `streamObject()` against a real model, schema validation, candidate-set business-rule validation, and the AI error-handling paths. It does not satisfy the Phase 4 / Deliverable 7 milestone gate — a real, live, end-to-end streaming call against the production provider — because `gpt-oss-20b` may differ from OpenAI's model in hallucination rate, `.describe()` adherence, and behavior on the duplicate-`robotId` refine, so that call must still be rerun against OpenAI.

#### Review Trigger

Once OpenAI billing is enabled, switch the provider back and rerun the complete end-to-end streaming validation against OpenAI. The NIM-based run is a development aid only and does not count toward satisfying the milestone gate.

### ADR-011 — Buffer AI Recommendations Before Responding

#### Decision

Buffer generated recommendations until AI generation completes, then perform schema validation and business-rule validation (per ADR-008) before returning the response to the client. The client receives a single complete response, not incremental updates.

#### Alternatives Considered

##### Validate and stream each recommendation incrementally as it completes

Rejected.

The endpoint returns at most three recommendations. Incremental streaming would require validating and forwarding recommendations one at a time as the model completes each one, adding implementation complexity — partial-object handling, per-item validation ordering, client-side incremental rendering — for a UX benefit that is limited when the total payload is this small.

#### Rationale

Buffering guarantees clients only ever receive fully validated recommendations, preserving the guarantees defined in ADR-008 without needing to reconcile "already streamed to the client" against "later found invalid."

This deviates from Deliverable 7's streaming criterion, which states that no acceptable UX sends a response only after the full LLM response arrives. We accept that deviation here because the response is capped at three items — the latency cost of waiting for the full generation before responding is small relative to the complexity incremental delivery would add, and the alternative risks exposing a recommendation to the client that business-rule validation later rejects.

The implementation continues to call `streamObject()` rather than switching to `generateObject()`, even though chunks are buffered rather than forwarded to the client. ADR-010 already scoped `streamObject()` as the mechanism being validated, against both NIM and, eventually, OpenAI; switching to `generateObject()` now would mean re-validating a different function's error handling, retry behavior, and partial-parse semantics for no benefit today. It also works against the Review Trigger below: if incremental delivery is adopted later, the change becomes "start forwarding chunks already being received" rather than "swap the underlying generation call and revalidate its behavior from scratch."

#### Consequences

##### Positive

- Clients only ever receive recommendations that have passed both validation stages defined in ADR-008.
- Implementation stays simple — no incremental-delivery transport (SSE or streaming response) needs to be built or tested yet.
- `streamObject()` remains the validated generation primitive from ADR-010; no rework of provider-call mechanics is required later.

##### Trade-offs

- Clients do not receive incremental recommendation updates during generation — full response latency is paid up front.
- This deviates from Deliverable 7's stated streaming-UX criterion; the deviation is accepted here specifically because the response is capped at three items, not as a general exception to that criterion.
- Chunks are still received via `streamObject()` and discarded/accumulated rather than forwarded, which is unneeded complexity today relative to `generateObject()` — accepted as the cost of keeping the future incremental-delivery path cheap.

#### Review Trigger

Revisit if response size, generation latency, or user-experience requirements make incremental streaming worthwhile. Because `streamObject()` remains in place, the revisit is expected to be a transport change (forward chunks to the client as they arrive) rather than a provider-call change.

---

## AI Design Notes

### Recommendation UX

- **Recommendation empty/error state:** If no valid recommendations remain after AI response validation (for example, all returned `robotId`s are rejected during candidate-set validation), display a dedicated empty/error state instead of a generic failure message.

**Review Trigger:** Implement as part of the recommendation UI (Phase 4 — Deliverable 5).

---

### AI Observability

- **Centralized AI logging:** `console.error` is an intentional development placeholder. Before production, replace it with a centralized logging solution capable of capturing:
  - AI contract violations
  - Token usage
  - Model/provider errors
  - AI-specific telemetry

Avoid introducing separate logging mechanisms for individual AI features.

---

### Environment Filtering

- **Environment is currently recommendation context, not a database filter.** Although `environment` is collected as a required input, the current robot catalog does not persist an environment attribute. The value is therefore forwarded to the LLM as required contextual information rather than participating in SQL candidate filtering.

This intentionally separates **business importance** from **database enforceability**: `environment` remains required because it materially affects recommendation quality, even though the current schema cannot filter on it.

**Review Trigger:** Revisit when robot environment becomes a structured catalog attribute or specification normalization enables SQL-based environment filtering.

---

### Recommendation Ranking Strategy

Current recommendation pipeline limits the candidate set (top 15) before sending robots to the LLM.

Current ordering:

1. Closest price to the user's budget
2. Featured robots (tie-breaker)
3. `robots.id` ascending (final deterministic tie-breaker, added after
   integration tests surfaced nondeterministic ordering among robots tied
   on both budget distance and featured status)

- **Budget input evolution:** The current ranking strategy assumes a single target budget and orders candidates by proximity before sending them to the LLM. If the recommendation UI changes to collect budgets as ranges (for example, "Under $5,000", "$5,000–10,000", or "Over $10,000") rather than a single value, both the ranking algorithm and the AI request contract should be revisited together to ensure candidate selection still reflects user intent.

**Review Trigger:** Re-evaluate when the recommendation UI replaces a single budget value with budget ranges or bracket-based input.

#### Design Hypothesis

Ordering primarily by budget proximity may bias recommendations toward mid-range robots while burying lower-cost robots that better satisfy the user's overall requirements.

No implementation change is planned until production usage data exists.

**Review Trigger**

Re-evaluate during Phase 5 using real recommendation and buyer behavior data.

---

### Documentation

- **ADR organization:** Evaluate moving Architecture Decision Records into a dedicated `docs/decisions/` directory as the number of ADRs grows, keeping `PROGRESS.md` focused on project status while preserving ADR discoverability.

**Review Trigger:** Revisit once the project reaches approximately 10+ ADRs or `PROGRESS.md` becomes difficult to navigate due to ADR length.

---

## Key Learnings

### Phase 2

- `npm ci` catches lockfile drift immediately and should be used everywhere automation runs.
- Avoid `npm audit fix --force`; review breaking changes before accepting them.
- Review every generated migration before execution.
- Drizzle partial-index SQL requires manual verification (`$1` → `true`).
- `vi.mock()` requires a factory to avoid importing real modules.
- Composite indexes should be ordered by selectivity.
- Query extraction improves testability without unnecessary abstraction.
- Docker images should run as a non-root user with correct file ownership.

---

### Phase 3

- Standardize timezone handling project-wide using `{ withTimezone: true }`.
- Clerk synthetic webhook events are incomplete; validate against real sign-ups.
- HTTP status codes directly control Clerk webhook retry behavior.
- `primary_email_address_id` is authoritative; never assume the first email is primary.
- Commit history should always remain buildable.
- Migration workflow: **Generate → Review → Understand → Execute**.
- `onDelete: 'restrict'` enforces business invariants at the database layer.
- `$onUpdateFn()` exists only in the ORM layer; raw SQL bypasses it.
- Avoid variable shadowing even when TypeScript permits it.
- B-tree indexes are bidirectional; descending queries do not require DESC indexes.
- Composite indexes belong at the table level, not inline on individual columns.
- Adding a `NOT NULL` column without a default fails on populated tables—reason through migrations before applying them.
- Guard on `!userId` directly instead of Clerk implementation details.
- Server Components can query the database directly; API routes are unnecessary for server-only data access.
- Public-by-default route protection is acceptable only while the protected surface remains small and centrally defined.
- CI databases should be isolated from development databases.
- E2E seed scripts should be idempotent and deterministic.

---

### Phase 4

- Graceful degradation and fail-fast are different failure strategies. Recommendation validation filters individual invalid recommendations and only fails once no trustworthy recommendations remain.
- Operating environment can be a required recommendation constraint even when it cannot yet participate in SQL filtering. Business importance and database enforceability are separate concerns.

---

## Deferred / Horizon

### Deferred Features

- `specification_definitions` normalization table
- HowItWorks timeline connector
- `testimonials.rating` database check constraint
- **Catalog pricing constraints:** Evaluate making `robots.priceFrom` and `robots.priceTo` `NOT NULL`. Budget-aware recommendation ranking assumes priced catalog robots, but enforcing this requires a schema migration, verification/backfill of existing data, and confirmation that unpriced catalog listings are not a supported business state.

### Deferred Infrastructure

- SHA pinning for GitHub Actions (ADR-006)
- Re-evaluate route protection strategy if protected surface grows
- Revisit transactions for E2E seed scripts if they become production-facing
- **Test database isolation and hook timeouts are tracked in [#9](https://github.com/Shanxu-techie/robot-marketplace/issues/9):** fail-closed `DATABASE_URL` validation for Vitest, plus a single chosen mitigation for orphaned rows from timed-out hooks (generous `hookTimeout`, transaction wrapping, or standalone cleanup — one strategy, not left open). See issue for full acceptance criteria.
- Evaluate splitting ADRs into `docs/decisions/` as the ADR count grows

### Known Issues

Current npm audit vulnerabilities remain deferred:

- esbuild (drizzle-kit)
- postcss (Next.js)
- hono
- js-yaml

These affect development tooling only.

`npm audit fix --force` is intentionally avoided until upstream fixes are available.

---

## Force Multiplier

See `docs/force-multiplier.md` — 8 artifacts published (2 Discord, 5 LinkedIn, 1 Stack Overflow), 0 open items, as of 2026-07-20.

---

## Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Development
ALLOWED_DEV_ORIGIN=

# AI
OPENAI_API_KEY=
```

---

## Mentorship Rules

- Own every line of code.
- No `any`.
- Never leave work uncommitted.
- Use conventional commits.
- Every feature follows:
  **Branch → PR → CI → Merge**
- Prefer Server Components.
- Use `"use client"` only when state or browser APIs require it.
- Reason before receiving answers (Socratic approach).
- Every AI-generated line must be explainable before shipping.

---

## Current Status

**Current Phase:** Phase 4 — Payments + AI (Recommendation Engine) 🔄

### Immediate Next Steps

1. Verify how `robotId` is serialized into the prompt sent to the LLM
   (JSON number vs. string-interpolated) — flagged during route-handler
   architecture, not yet confirmed. Must be resolved before the prompt
   builder is considered complete, since a mismatch would cause every
   correct LLM response to fail the corrected `z.number()` schema.
2. Build `buildRecommendationPrompt()` — assemble the finalized system
   prompt with the validated request and the candidate set returned by
   `getRecommendationCandidates()`.
3. Integrate Vercel AI SDK (`streamObject`) using the finalized request/response
   schemas and system prompt.
4. Wire ADR-008's two-stage validation (schema, then business-rule) into the
   route handler.
5. Implement the route handler's rate-limit gate as a named, visible stub
   (`checkRateLimitStub()`) — loud `console.warn` on every call, a
   `// TODO(rate-limit):` comment at the call site, and this line item —
   so it can't be silently mistaken for real enforcement. Real IP-keyed
   rate limiting is tracked as a separate, later task.
6. Build the recommendation UI, including the dedicated empty/error state.
7. Enable OpenAI billing (blocked — key created, no billing configured yet)
   before the first live streaming test; set a hard spend cap immediately
   once enabled.
8. Implement real IP-keyed rate limiting (replacing the stub above) and
   token logging — remaining Deliverable 7 criteria.
9. Set up an NVIDIA NIM developer account and API key when the dev-provider
   integration (ADR-010) is actually implemented; add the key to
   `.env.example` at that time, not before.
10. Integrate payment provider.
11. Expand Playwright coverage alongside new user flows.

---

_Last updated after beginning Phase 4 — AI Recommendation Engine._

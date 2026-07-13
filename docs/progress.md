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

Composite partial index (pending):

```sql
(category_id, featured)
WHERE is_visible = true
```

Planned optimization for:

- Category filtering
- Featured filtering
- Visible robots only

> **Status:** Not yet merged into `main`. Being rebuilt in a replacement PR after the original branch became stale following the schema modularization.

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

### Deferred Infrastructure

- SHA pinning for GitHub Actions (ADR-006)
- Re-evaluate route protection strategy if protected surface grows
- Revisit transactions for E2E seed scripts if they become production-facing
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

### Completed

- ✅ LinkedIn post — CI lockfile synchronization lesson
  - ~84 impressions
  - Demonstrated a real debugging story and lesson learned

### Open

- [ ] Community write-up: Docker non-root EACCES permission issue

Goal:

Write and publish a Stack Overflow question + answer documenting the root cause and solution.

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

1. Architect the recommendation route handler — pipeline order, candidate
   query location, HTTP contract (status + body) per outcome, and where the
   duplicate-robotId check lands.
2. Build the candidate filtering/ranking query (top 15, ordered by budget
   proximity, featured as tiebreaker).
3. Integrate Vercel AI SDK (`streamObject`) using the finalized request/response
   schemas and system prompt.
4. Wire ADR-008's two-stage validation (schema, then business-rule) into the
   route handler.
5. Build the recommendation UI, including the dedicated empty/error state.
6. Enable OpenAI billing (blocked — key created, no billing configured yet)
   before the first live streaming test; set a hard spend cap immediately
   once enabled.
7. Implement real rate limiting (currently a stubbed placeholder gate) and
   token logging — remaining Deliverable 7 criteria.
8. Integrate payment provider.
9. Expand Playwright coverage alongside new user flows.

---

_Last updated after beginning Phase 4 — AI Recommendation Engine._

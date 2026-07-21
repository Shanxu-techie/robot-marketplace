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

Full ADR text lives in `docs/decisions/`. Index below; open a file for Decision, Alternatives Considered, Rationale, and Review Trigger.

| ADR                                                                         | Title                                       | Summary                                                                              | Phase |
| --------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------ | ----- |
| [ADR-001](decisions/ADR-001-auth-provider-indirection.md)                   | Auth Provider Indirection                   | FKs reference `users.id`, never `clerkUserId`                                        | 3     |
| [ADR-002](decisions/ADR-002-public-by-default-route-protection.md)          | Public-by-Default Route Protection          | `isProtectedRoute` matcher, public unless listed                                     | 3     |
| [ADR-003](decisions/ADR-003-lazy-database-initialization.md)                | Lazy Database Initialization                | `getDb()` instead of a module-level instance                                         | 2     |
| [ADR-004](decisions/ADR-004-onupdatefn-is-a-business-rule.md)               | `$onUpdateFn()` is a Business Rule          | Applied only to tables with real update workflows                                    | 3     |
| [ADR-005](decisions/ADR-005-restrict-user-owned-record-deletion.md)         | Restrict User-Owned Record Deletion         | `onDelete: 'restrict'` on all FKs referencing `users`                                | 3     |
| [ADR-006](decisions/ADR-006-github-actions-version-pinning-strategy.md)     | GitHub Actions Version Pinning Strategy     | Major version tags, not SHA pinning                                                  | 2     |
| [ADR-007](decisions/ADR-007-no-transaction-for-e2e-seed-script.md)          | No Transaction for E2E Seed Script          | Seed script left unwrapped; DB is ephemeral                                          | 3     |
| [ADR-008](decisions/ADR-008-ai-recommendation-validation-strategy.md)       | AI Recommendation Validation Strategy       | Two-stage: schema, then business-rule validation                                     | 4     |
| [ADR-009](decisions/ADR-009-index-creation-strategy.md)                     | Index Creation Strategy                     | Standard `CREATE INDEX`, not `CONCURRENTLY`                                          | 2     |
| [ADR-010](decisions/ADR-010-temporary-development-provider-nvidia-nim.md)   | Temporary Development Provider (NVIDIA NIM) | Dev-only `gpt-oss-20b`; does not satisfy Deliverable 7                               | 4     |
| [ADR-011](decisions/ADR-011-buffer-ai-recommendations-before-responding.md) | Buffer AI Recommendations Before Responding | Buffer + validate before responding; deviates from Deliverable 7 streaming criterion | 4     |

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

- **ADR organization:** Resolved 2026-07-20 — ADRs moved to `docs/decisions/` (one file per ADR, indexed in `docs/decisions/README.md` and mirrored above). Trigger was met at ADR-010 (10 ADRs).

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

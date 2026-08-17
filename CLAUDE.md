# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Burgoweb is a free condominium management/transparency platform (Portuguese-language product), aimed initially at condominiums with no administrative structure or management system.

## Repository layout: two generations of code

There are **two, non-overlapping codebases** in this repo — know which one you're touching:

- `src/` + `index.html` + `tsconfig.server.json` — the original prototype (a Vite SPA with an in-memory `data/storage.json`-backed server). It is not part of the active build (`npm run build`), the active test run (`vitest.config.ts` only includes `tests/**` and `apps/**`), or the boundary rules. Treat it as legacy; don't build new features on it.
- `apps/*` + `packages/*` — the active greenfield monorepo (npm workspaces). All new work happens here.

`scripts/check-boundaries.mjs` explicitly forbids `apps/web` from importing `src/server`, confirming the old prototype is being phased out.

## Commands

> **PostgreSQL em code review:** antes de declarar Docker/WSL indisponível, execute `npm run test:integration:local`. Esse comando usa o PostgreSQL 18 Windows local, cria/remove banco temporário e executa o gate real. Procedimento: `docs/operations/postgresql-integration.md`.

Run everything from the repo root (npm workspaces).

- `npm run dev` — starts the full local environment: spins up Postgres 18 in Docker **inside WSL (Ubuntu distro)** via `infra/compose/compose.dev.yml`, then runs the API (port 3001) and the web app (port 3000) with ephemeral generated credentials. Requires WSL with an `Ubuntu` distro that has Docker available; Ctrl+C tears the container down. See `scripts/dev.mjs`.
- `npm run dev:web` / `npm run dev:api` / `npm run dev:worker` — run a single workspace app directly (no Postgres orchestration; you must provide `BURGOWEB_DATABASE_URL`, `BURGOWEB_PASSWORD_PEPPER`, `BURGOWEB_PASSWORD_PEPPER_VERSION` yourself for the API).
- `npm run build` — runs `check:api-contract`, then `check:boundaries`, then builds every workspace. All three must pass; this is effectively the CI gate.
- `npm test` — `vitest run` across `tests/**/*.test.ts` and `apps/**/*.test.{ts,tsx}`.
  - Single file: `npx vitest run tests/api-provisioning.test.ts`
  - Single test by name: `npx vitest run -t "nome do teste"`
- `npm run test:integration` — runs `tests/postgres-integration.test.ts` against a **real** Postgres via `testcontainers` (needs Docker). The suite is gated behind `describe.runIf(process.env.BURGOWEB_INTEGRATION === '1')`, so set `BURGOWEB_INTEGRATION=1` or the tests no-op.
- `npm run test:e2e` — builds the app, then runs Cypress against `scripts/serve-built.mjs` (a static server for the built output). Spec lives at `cypress/e2e/public-entry.cy.js`.
- `npm run smoke` — `npm test` + `npm run test:e2e`.
- `npm run check:types` — `tsc --noEmit` for the root config (tests + scripts only; each app/package has its own `tsconfig.json` checked as part of its own `build`).
- `npm run check:api-contract` — verifies `packages/api-client/src/provisioning.ts` matches `apps/api/src/openapi.ts`. Regenerate with `npm run generate:api-client` whenever the API contract (`apps/api/src/openapi.ts`) changes — the generated file is marked "Do not edit manually."
- `npm run check:boundaries` — static import check enforced by `scripts/check-boundaries.mjs` (see Architecture below).

## Architecture

Hexagonal / ports-and-adapters, organized as an npm-workspaces monorepo.

- **`packages/application`** — pure domain and use cases, no infrastructure dependencies. E.g. `CreateCondominium` (`packages/application/src/provisioning/create-condominium.ts`) depends only on interfaces defined in `ports.ts` (`ProvisioningRepository`, `TenantProvisioner`, `AuditPort`, `PasswordHasher`).
- **`packages/adapters`** — concrete implementations of those ports: Postgres repositories/migrators (`packages/adapters/src/db/`), Argon2 password hashing, log redaction. Only composition roots (e.g. `apps/api/src/composition-root.ts`) should import this package.
- **`packages/config`** — env var loading/validation (`loadRuntimeConfig`, `loadSecurityConfig`); throws on missing/malformed config rather than defaulting silently.
- **`packages/api-client`** — a generated TypeScript client for the public API, produced from `apps/api/src/openapi.ts` by `scripts/generate-api-client.mjs`. This is the *only* way `apps/web` is allowed to talk to the backend.
- **`packages/test-support`** — currently an empty placeholder; shared test helpers get added here once duplication actually appears (don't preemptively build it out).

### `apps/api`

NestJS running on the Fastify adapter (not Express), assembled in `apps/api/src/nest-app.ts` and wired to real infra in `apps/api/src/composition-root.ts`. Notable conventions:

- Errors are returned as RFC 9457 `application/problem+json` bodies (`ProvisioningProblem`), never bare error objects.
- Mutating requests require an `Idempotency-Key` header; `CreateCondominium.execute` treats replays of the same key deterministically (same result, or a 409 if the payload hash differs) and quarantines/compensates on partial failure — see the failpoint table in `tests/postgres-integration.test.ts` for the exact compensation contract.
- Rate limiting keys on a composite signal (`sec-fetch-site` + `origin` + `user-agent` + `accept-language`), deliberately not on IP alone.
- Logging redacts auth/password/email fields at the Fastify logger level; responses are checked in tests to never leak `password|hash|pepper|schema`.
- `/api/v1/tenants/:id/context` always 403s in this shell — tenant context resolution isn't implemented yet, so it fails closed rather than being silently permissive.

### `apps/web`

TanStack Start + TanStack Router (file-based routing under `apps/web/src/routes/`). `apps/web/src/routeTree.gen.ts` is generated by the router tooling — don't hand-edit it.

`apps/web` may only talk to the backend through `@burgoweb/api-client`. `scripts/check-boundaries.mjs` statically scans every import in `apps/web` and fails the build if it finds imports of `apps/api`, `apps/worker`, `packages/adapters`, `packages/application`, `src/server`, `kysely`, or the corresponding `@burgoweb/*` package names — this is enforced in `npm run build` and covered by `tests/boundaries.test.ts`.

### `apps/worker`

Currently a stub (`workerEntrypoint.jobsEnabled === false`, `tests/entrypoints.test.ts` pins this) — no background jobs are wired up yet.

### Multi-tenancy / data model

Postgres, schema-per-tenant:

- `burgoweb_global` schema holds cross-tenant tables (`accounts`, `credentials`, `tenant_registry`, `provisioning_requests`, `authority_declarations`, `pending_authorities`, `idempotency_records`, `audit_events`). Migration: `migrations/global/001_provisioning.sql`, applied by `PostgresGlobalMigrator` (idempotent — re-running is safe).
- Each condominium gets its own `tenant_<uuid>` schema, created and migrated by `PostgresTenantMigrator` from `migrations/tenant/001_identity_pending.sql`.
- Provisioning a new condominium (`CreateCondominium`) is a saga: hash the password, persist global records, create+migrate the tenant schema, then mark pending — with compensation (drop the tenant schema, mark the request `compensated`/`quarantined`) if any step fails partway.

## BMAD planning workflow

This project uses the BMAD Method for product/planning work (agents and workflows live in `_bmad/` and `.agents/skills/`; generated artifacts belong in `_bmad-output/planning-artifacts/` and `_bmad-output/implementation-artifacts/`). Full rules are in `AGENTS.md` — key points:

- Before producing a PRD, UX spec, architecture doc, epics, or stories, read `docs/product/discovery/00-index.md` through `10-referencias.md` first.
- Conflict precedence: (1) most recent explicit product-owner decision, (2) `docs/product/discovery/`, (3) approved artifacts in `_bmad-output/planning-artifacts/`, (4) stories in `_bmad-output/implementation-artifacts/`, (5) agent inference.
- Don't silently change product decisions, don't implement features still marked as future/hypothetical, don't turn hypotheses into confirmed requirements without saying so.
- Communication and documentation: Brazilian Portuguese. Code, identifiers, and technical names: English (unless an architectural decision says otherwise).

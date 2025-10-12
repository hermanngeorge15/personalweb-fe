## WriteWave Frontend Roadmap & Checklist

This document is the single source of truth for frontend delivery. It is organized into phases with actionable checklist items. Each item has a stable ID so you can reference and tick it off in PR titles, commits, and status reports.

How to use
- Search by ID to find context and acceptance criteria
- Check off items by changing "[ ]" to "[x]"
- Reference items in PRs like: "feat: implement env validation [SETUP-ENV]"

Conventions
- Stack: React 19, TypeScript, Vite 6 (SWC), TanStack Router/Query, HeroUI, Tailwind
- Package manager: pnpm
- Linting/formatting: ESLint (flat), Prettier (+ tailwind plugin)

---

### Phase 0 — PStart / Prerequisites

- [ ] [PSTART-PREREQS] Verify Node 20+, pnpm 9+, Git configured
- [ ] [PSTART-ENV] Create `.env.local` with `VITE_API_URL`, `VITE_API_DEBUG`, Keycloak vars
- [ ] [PSTART-READ] Skim `src/routes`, `src/components`, `src/lib/data/*` for current behavior

---

### Phase 1 — Setup & Tooling

- [ ] [SETUP-ENV] Add env validation via Zod at `src/config/env.ts`; export typed `env`
- [ ] [SETUP-HTTP] Promote `src/lib/api.ts` into thin `http` client with auth/error handling
- [ ] [SETUP-QK] Add query key factories `src/lib/query-keys.ts`
- [ ] [SETUP-PROVIDERS] Create `src/providers/AppProviders.tsx` composing Query, HeroUI, Auth
- [ ] [SETUP-PRECOMMIT] Add `prettier-plugin-tailwindcss`, `lint-staged`, `husky` pre-commit
- [ ] [MSW-BASE] Install and wire MSW; add handlers for `tasks`, `logs`, `bonsai`, `car`
- [ ] [DOCS-DEV] Add `docs/DEV.md` with run scripts, env, MSW usage

Acceptance
- Boot with MSW on dev; network failures produce friendly errors; env is validated early

---

### Phase 2 — App Shell & Routing

- [ ] [ROUTER-ERROR] Add root `errorComponent` with retry/back link
- [ ] [ROUTER-PREFETCH] Use loaders to prefetch queries on key routes
- [ ] [ROUTER-CODE-SPLIT] Lazy-load route components (vite dynamic import)
- [ ] [NAV-RESP] Make sidebar responsive (drawer on mobile) and keep keyboard nav
- [ ] [NAV-COUNTS] Add Query-driven badges (e.g., due today) to nav links

Acceptance
- Smooth transitions, preloaded data, accessible navigation

---

### Phase 3 — Tasks Feature

- [ ] [REPO-TASKS] Abstract Tasks repo (Local + HTTP); preserve current local data behavior
- [ ] [TASKS-QUERY] Integrate TanStack Query for list/detail/mutations
- [ ] [TASKS-FILTERS] Add `TaskFilters` with URL-synced state (area, status, priority, due)
- [ ] [TASKS-OPT] Optimistic create/update/delete with rollback on error
- [ ] [TASKS-KANBAN] Add Kanban view (todo/in_progress/done) with DnD
- [ ] [TASKS-ACCESS] Keyboard actions; a11y labels; empty and skeleton states

Acceptance
- Filters persist via URL; Kanban reorder updates status; zero-loading for warm paths

---

### Phase 4 — Bonsai Care

- [ ] [BONSAI-MODEL] Define bonsai types (species, age, location) and API/repo
- [ ] [BONSAI-LIST] List/grid with card summary (last care, next due)
- [ ] [BONSAI-DETAIL] Detail with tabs: Overview, Care Log, Schedule, Notes
- [ ] [BONSAI-SCHED-L1] Scheduler v1: rules (watering/fertilizing/pruning), next-due
- [ ] [BONSAI-QUICKLOG] Reuse Quick Log on list/detail; app-wide feedback

Acceptance
- Can create bonsai, attach schedules, see computed next-due, and log care

---

### Phase 5 — Car Maintenance

- [ ] [CAR-MODEL] Define vehicle types (make/model/year/odometer) and API/repo
- [ ] [CAR-MVP] List/detail with quick service logging and reminders
- [ ] [CAR-TEMPLATES] Service templates (oil change, inspection) with suggested intervals

Acceptance
- Create vehicle, log service, see next reminders and history

---

### Phase 6 — Timeline

- [ ] [TL-FILTERS] Filters (area, type, date range) synced to search params
- [ ] [TL-PAGE] Infinite scroll / pagination; group by date headers
- [ ] [TL-EMPTY] Empty, error, and skeleton states

Acceptance
- Navigable audit of activity with performant pagination

---

### Phase 7 — Auth (Keycloak)

- [ ] [AUTH-KEYCLOAK] Implement `AuthProvider` (init, login/logout, token refresh)
- [ ] [AUTH-GUARDS] Route guards with TanStack Router `beforeLoad`
- [ ] [AUTH-API] Inject Bearer token in `http` and refresh on 401

Acceptance
- Authenticated routes redirect to login and back; tokens refresh transparently

---

### Phase 8 — Final Polish

- [ ] [UX-ERROR-LOADING] Error boundaries; cohesive empty/loading; toast feedback
- [ ] [PERF-CACHE] Query caching tweaks; memoization; virtualization for long lists
- [ ] [PERF-SPLIT] Route-level code splitting; prefetch on hover
- [ ] [A11Y-PASS] A11Y pass: labels, roles, focus management, skip-to-content
- [ ] [PWA-OPT] Optional PWA: manifest + SW for static assets

Acceptance
- Crisp interaction quality; accessible; resilient under slow networks

---

## IDs Reference Index

Setup & Tooling
- SETUP-ENV, SETUP-HTTP, SETUP-QK, SETUP-PROVIDERS, SETUP-PRECOMMIT, MSW-BASE, DOCS-DEV

Routing & Layout
- ROUTER-ERROR, ROUTER-PREFETCH, ROUTER-CODE-SPLIT, NAV-RESP, NAV-COUNTS

Tasks
- REPO-TASKS, TASKS-QUERY, TASKS-FILTERS, TASKS-OPT, TASKS-KANBAN, TASKS-ACCESS

Bonsai
- BONSAI-MODEL, BONSAI-LIST, BONSAI-DETAIL, BONSAI-SCHED-L1, BONSAI-QUICKLOG

Car
- CAR-MODEL, CAR-MVP, CAR-TEMPLATES

Timeline
- TL-FILTERS, TL-PAGE, TL-EMPTY

Auth & Polish
- AUTH-KEYCLOAK, AUTH-GUARDS, AUTH-API, UX-ERROR-LOADING, PERF-CACHE, PERF-SPLIT, A11Y-PASS, PWA-OPT

---

## Quickstart

Install & run
```bash
pnpm i
pnpm dev
```

Recommended PR template title
```text
feat(tasks): add URL-synced filters [TASKS-FILTERS]
```



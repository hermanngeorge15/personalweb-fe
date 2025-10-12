## Frontend Integration Guide

### 1) Base URL & Envs
- Local API base: `http://localhost:8080`
- Frontend env (Vite/Next):
  - `VITE_API_BASE=http://localhost:8080`
- In production, set to your BE URL (behind TLS/ingress).

### 2) CORS
- Backend allows origins via `security.allowed-origins` (env `ALLOWED_ORIGINS`).
- Ensure your FE dev server origin (e.g. `http://localhost:3333`) is present.

### 3) OpenAPI & Swagger UI
- OpenAPI JSON: `GET /v3/api-docs`
- Swagger UI: open `/swagger-ui.html` (redirects to `/webjars/swagger-ui/index.html`).

### 4) Public Endpoints (no auth)
- `GET /api/meta`
- `GET /api/posts?limit=&tag=&cursor=` (cursor-based pagination)
- `GET /api/posts/{slug}`
- `GET /api/projects`
- `GET /api/testimonials`
- `GET /api/resume`
- `POST /api/contact` (rate-limited + honeypot) body: `{ name, email, message, website:"" }`

Pagination notes:
- Responses shape:
```json
{
  "items": [ /* ... */ ],
  "nextCursor": "..." | null
}
```
- Pass `nextCursor` to `cursor=` for the next page.

### 5) Admin Endpoints (JWT required, role `ROLE_ADMIN`)
- CRUD for `/api/posts`, `/api/projects`, `/api/testimonials`
- `GET /api/contact?handled=false` and `POST /api/contact/{id}:handle`
- Auth header: `Authorization: Bearer <token>`

Keycloak (high-level):
- Realm `personal`; configure a Client (public/bearer), add role `admin`.
- Assign role to user. Map realm/client roles → authorities (done in BE).
- FE obtains tokens via your chosen flow (PKCE or dev token), include in requests.

### 6) Error Handling
- 404 for missing slugs/resources.
- 400 validation errors on `POST /api/contact` (invalid `email`/`name`/`message`).
- 401/403 for admin endpoints without proper JWT/role.

### 7) Examples (TypeScript)

Simple API client factory:
```ts
export function api(base = import.meta.env.VITE_API_BASE || "") {
  return async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${base}${path}`, {
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      ...init,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${text}`);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  };
}
```

Fetch posts (paginated):
```ts
type PostListItem = {
  slug: string; title: string; excerpt: string; tags: string[];
  published_at?: string; cover_url?: string | null;
};
type Page<T> = { items: T[]; nextCursor?: string | null };

const request = api();

export async function fetchPosts(limit = 10, tag?: string, cursor?: string) {
  const q = new URLSearchParams();
  q.set("limit", String(limit));
  if (tag) q.set("tag", tag);
  if (cursor) q.set("cursor", cursor);
  return request<Page<PostListItem>>(`/api/posts?${q.toString()}`);
}

export async function fetchPost(slug: string) {
  return request(`/api/posts/${encodeURIComponent(slug)}`);
}
```

Submit contact form (honeypot empty):
```ts
export async function submitContact(name: string, email: string, message: string) {
  return request(`/api/contact`, {
    method: "POST",
    body: JSON.stringify({ name, email, message, website: "" }),
  });
}
```

Admin call with JWT:
```ts
export async function createPost(token: string, body: any) {
  return request(`/api/posts`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { Authorization: `Bearer ${token}` },
  });
}
```

### 8) Local Dev Checklist
- Start BE + DB: `docker compose up -d --build`
- FE env: `VITE_API_BASE=http://localhost:8080`
- FE dev server: e.g. `http://localhost:3333` (ensure CORS origin matches)
- Docs: `/swagger-ui.html` and `/v3/api-docs`

### 9) Production Checklist
- API behind TLS (ingress/reverse proxy)
- Set FE `API_BASE` to public BE URL
- Configure `ALLOWED_ORIGINS` to FE origin(s)
- Keycloak issuer URL set in env `JWT_ISSUER_URI`
- Verify health `/actuator/health` and metrics `/actuator/prometheus`

### 10) Troubleshooting
- CORS error: check `ALLOWED_ORIGINS` and FE origin.
- 401/403 on admin: verify token contains `admin` role.
- Pagination: always pass `nextCursor` from the last response to fetch next page.

---

## Integration TODOs (Frontend ↔ Backend)

- [ ] Configure FE envs to point at BE
  - [ ] `VITE_API_BASE` (or `VITE_API_URL`) set to BE URL in `.env`
  - [ ] `VITE_KEYCLOAK_URL`, `VITE_KEYCLOAK_REALM`, `VITE_KEYCLOAK_CLIENT_ID`
- [ ] CORS allowlist includes FE dev/stage/prod origins
  - [ ] Local dev `http://localhost:3333`
  - [ ] Staging/Production domains
- [ ] Verify public endpoints
  - [ ] `GET /api/meta`
  - [ ] `GET /api/posts?limit=&tag=&cursor=` and `GET /api/posts/{slug}`
  - [ ] `GET /api/projects`, `GET /api/testimonials`, `GET /api/resume`
  - [ ] `POST /api/contact` (validate honeypot + rate limits)
- [ ] Admin endpoints (JWT)
  - [ ] Create/Update/Delete for posts/projects/testimonials (200/400/401/403)
  - [ ] Token roles include `admin`; BE maps roles → authorities
- [ ] Pagination (cursor)
  - [ ] FE passes `nextCursor` from last page
  - [ ] Empty/terminal page handled gracefully
- [ ] Error handling
  - [ ] 404 for unknown slugs
  - [ ] 400 validation surfaces field errors
  - [ ] 401/403 redirect to login (Keycloak) or show access denied
- [ ] SEO & Feeds
  - [ ] `sitemap.xml` and RSS served by BE; FE links added
  - [ ] JSON-LD (Person/BlogPosting/Service) present on key routes
- [ ] Observability
  - [ ] `/actuator/health` up; metrics `/actuator/prometheus` if applicable
- [ ] Deployment
  - [ ] FE points to prod BE base; TLS via ingress/proxy
  - [ ] `ALLOWED_ORIGINS` configured for FE origins

## Step-by-step Integration Plan

1. Environments
   - Set `VITE_API_BASE` (or `VITE_API_URL`) in FE `.env` to BE base.
   - Configure Keycloak envs in FE; verify realm/client exist and user has `admin` role.

2. Local Dev
   - Start BE (`docker compose up -d --build`).
   - Ensure BE `ALLOWED_ORIGINS` includes `http://localhost:3333`.
   - Run FE dev on 3333. Verify public endpoints render (meta/posts list/detail).

3. Admin Flows
   - Log in via Keycloak and access `/admin`.
   - Exercise CRUD: posts, projects, testimonials. Confirm 401/403 on missing role.
   - Validate server responses and FE state updates (lists invalidate, detail updates).

4. Pagination & States
   - Test `limit` and `cursor` parameters on `/api/posts`.
   - Confirm FE shows Skeletons, empty states, and load-more/auto-fetch patterns as designed.

5. Contact Form
   - Submit valid and invalid payloads; confirm 400 surfaces field errors.
   - Verify honeypot field blocks bots (BE), FE keeps the field hidden/empty.

6. SEO & Feeds
   - Ensure BE serves `sitemap.xml` and RSS at stable URLs; FE includes `<link rel="alternate" type="application/rss+xml" ...>` and robots sitemap reference.
   - Validate JSON-LD in page source for Home (Person), Blog Post (BlogPosting), Services (Service).

7. Security & Observability
   - Confirm TLS on BE/FE in staging/prod.
   - Verify `/actuator/health` and metrics. Wire alerts/dashboards as needed.

8. Production Cutover
   - FE envs point to prod BE; invalidate caches/CDN.
   - Smoke test public pages and admin flows.
   - Run Lighthouse (Perf/BP/A11y ≥ 90) and address regressions.

---

## Frontend Implementation Status (What’s already wired)

- Routing & Layout
  - Shared `AppShell` with skip link, sticky `TopNav`, `PagePath` (breadcrumbs)
  - File-based routes (TanStack Router) – see `src/routes/*`
- Data & API
  - Query hooks for all public/admin endpoints in `src/lib/queries.ts`
  - API base via `VITE_API_URL` (or `VITE_API_BASE`) and Vite proxy for dev
- Auth (Admin)
  - Keycloak init + guard: `src/lib/keycloak.ts`; admin routes use `beforeLoad`
- Content & Blog
  - Blog list/detail using React Query; MDX rendering with GFM + code highlighting
  - JSON-LD for BlogPosting injected per post
- Forms
  - Contact form with basic client validation; wired to `POST /api/contact`
- SEO
  - `setHead` utility for titles/canonical/OG/Twitter; JSON-LD via `setJsonLd`
- A11y & UX
  - Accessible mobile menu (ARIA), skip link, Skeleton loading states
- Mocks
  - MSW handlers for all public/admin endpoints; error simulation via `?err=500`

### File Map (Where to look)

- Routing
  - Root: `src/routes/__root.tsx`
  - Public pages: `src/routes/index.tsx`, `about.tsx`, `services.tsx`, `resume.tsx`, `blog/*`
  - Admin: `src/routes/admin/*` (posts/projects/testimonials – list + edit where relevant)
- Layout & UI
  - `src/components/AppShell.tsx`, `TopNav.tsx`, `LayoutWidth.tsx`, `PagePath.tsx`
  - UI wrappers: `src/components/ui/Card.tsx`, `Typography.tsx`, `LazyImage.tsx`
  - Motion: `src/components/MotionSection.tsx`
- Data & API
  - Queries/mutations: `src/lib/queries.ts`
  - API helper: `src/lib/api.ts`
  - Keycloak: `src/lib/keycloak.ts`
  - SEO: `src/lib/seo.ts`
- Mocks
  - Service worker: `src/mocks/browser.ts`
  - Handlers: `src/mocks/handlers.ts`

### Switch Mock ↔ Backend

- Mock mode (no BE required):
  - `pnpm dev:mock` – MSW worker is started automatically in `src/main.tsx`
- Backend mode:
  - `pnpm dev` with `.env` pointing `VITE_API_URL` (or `VITE_API_BASE`) to your BE
  - Vite proxy forwards `/api`, `/session`, `/sse`, `/actuator` to the BE during dev

### Admin Authentication Flow (Keycloak)

1. Admin route loads → `beforeLoad` calls `ensureKeycloakAuth()`
2. If not authenticated → redirects to Keycloak login; upon success returns to the same URL
3. Requests may include `Authorization: Bearer <token>` if needed
4. Ensure the user has `admin` role; BE maps it to proper authorities

### Implementation Notes & Expectations

- Pagination: FE expects `{ items: [], nextCursor }`; passing `cursor=` fetches next page
- Error states: FE displays loading/error/empty for lists; MSW can simulate 500 via `?err=500`
- SEO/Feeds: FE links RSS in `index.html` and `robots.txt` references `/sitemap.xml`; BE should serve both
- A11y: verify keyboard navigation, focus management, and color-contrast in BE-hosted environments


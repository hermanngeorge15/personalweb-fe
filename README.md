# WriteWave FE

Development

```bash
pnpm install
pnpm dev
```

Environment

Create a `.env` with:

```
VITE_API_URL=http://localhost:8080
VITE_KEYCLOAK_URL=http://localhost:8081
VITE_KEYCLOAK_REALM=personal
VITE_KEYCLOAK_CLIENT_ID=personal-fe
VITE_KEYCLOAK_CHECK_SSO=true
```

Scripts

```bash
# Dev
pnpm dev            # Vite dev server (port 3333)
pnpm dev:mock       # Dev with MSW mock endpoints enabled

# Quality
pnpm lint           # ESLint + Prettier
pnpm typecheck      # TS type checking only

# Build
pnpm build          # Vite build
pnpm preview        # Preview production build (port 3333)
```

Mock API (MSW)

- The app can run fully mocked in `pnpm dev:mock`.
- Example error simulation: `GET /api/posts?err=500` returns a 500 to test states.

Tech highlights

- React 19 + Vite 6, TypeScript strict
- Routing: TanStack Router (file-based, codegen)
- UI: HeroUI + Tailwind; shared wrappers in `src/components/ui/`
- Data: TanStack Query; API base via `VITE_API_URL`
- Auth: Keycloak (guarded admin routes)
- Content: MDX runtime with GFM + code highlighting
- A11y: skip link, mobile menu with ARIA, keyboard friendly
- SEO: per-route meta + JSON-LD helpers

Deploy

Netlify

1. Set environment variables in site settings (see `.env` above)
2. Build command: `pnpm build`
3. Publish directory: `dist`
4. Redirects (optional if using backend on same origin):

```
/*  /index.html  200
```

Vercel

1. Import project, framework: Vite
2. Environment variables as above
3. Build command: `pnpm build`, Output: `dist`

Backend integration

- In dev, Vite proxies `/api`, `/session`, `/sse`, `/actuator` to `VITE_PROXY_TARGET` (defaults to `http://localhost:8080`) — see `vite.config.ts`.
- In production, prefer same-origin deployments (frontend and backend under one domain) to avoid CORS.

Troubleshooting

- Router codegen: if `routeTree.gen.ts` is missing or out of date, restart dev server; the plugin regenerates it.
- If ESLint reports Prettier errors, run `pnpm exec eslint "src/**/*.{ts,tsx}" --fix`.
- `@mdx-js/runtime` types are shimmed in `src/vite-env.d.ts`.

Accessibility & Lighthouse

- A11y: Use keyboard to navigate the site (Tab/Shift+Tab). Verify skip link visibility and mobile menu toggle/ARIA.
- Run Lighthouse (Chrome DevTools) for Performance/Best Practices/A11y ≥ 90.
- Images: prefer `<LazyImage />` for non-critical media; add width/height when possible.
- Reduce bundle: keep routes code-split (plugin default), avoid large client libs.


## Prerequisites
- Install [Fast Node Manager (fnm)](https://github.com/Schniz/fnm)

- Install Node 24
  ```bash
  fnm install 24
  ```

- Install PNPM using Corepack
  ```bash
  corepack enable pnpm
  ```

### Connect to backend API

- Create `.env` file in the project root

- Set `VITE_API_URL` or `VITE_API_BASE` to your backend base, e.g.:
  ```
  VITE_API_URL=http://localhost:8080
  VITE_PROXY_TARGET=http://localhost:8080
  ```

### Install project

```bash
pnpm i
```

### Development

```bash
pnpm dev
```

## Mocks

### Initialize mocks

```bash
npx msw init public/
```

### Development (with FE mocks)

```bash
pnpm dev:mocks
```

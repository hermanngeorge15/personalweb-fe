## Project
React 19 + TypeScript + Vite 6 frontend. TanStack Router (file-based) + TanStack Query.
HeroUI + Tailwind 4. react-hook-form + zod. Keycloak auth. MSW for mock mode.
Package manager: pnpm (required, Node >= 24).

## Build Commands
- `pnpm dev` — dev server (live backend)
- `pnpm dev:mock` — dev server with MSW mocks
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm lint` — ESLint on `src/**/*.{ts,tsx}`
- `pnpm build:check` — tsc + vite build (use this, not plain `build`, to catch type errors)
- `pnpm prettier` — format

## Hard Rules
- Always run `pnpm typecheck` before declaring a task done
- Use pnpm — never npm or yarn
- Route files live under `src/routes/` (TanStack file-based routing) — respect the convention
- Validate forms with zod schemas; wire via `@hookform/resolvers/zod`
- Never commit `.env` / `.env.local`; use `.env.sample` as the template
- API client is generated from `openapi.json` — don't hand-edit generated code

## Conventions
- Components: PascalCase `.tsx`; hooks: `useX.ts`; utilities: camelCase `.ts`
- Prefer server state via TanStack Query over local state for remote data
- Tailwind utility-first; use `tailwind-merge` / `clsx` for conditional classes
- Keep components under ~150 lines; extract subcomponents or hooks

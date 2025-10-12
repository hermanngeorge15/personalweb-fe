
# Personal Site — Frontend (React 19 + Vite 6)

This document describes UX, routes, components, shared responsive layout, state/data layer, and setup for your chosen stack.

---

## Tech Stack

- **Core:** Node 24, pnpm ≥ 10, TypeScript 5, React 19, Vite 6
- **UI & Styling:** Tailwind CSS 3, @heroui/react 2, framer-motion 12
- **Routing & Data:** @tanstack/react-router 1 (+ codegen/devtools), @tanstack/react-query 5
- **Forms & Validation:** react-hook-form 7 + zod 3 (+ @hookform/resolvers 5)
- **Auth:** keycloak-js 26
- **Content & Editors:** @mdxeditor/editor 3, react-quill 2
- **DX & Quality:** MSW 2, ESLint 9, Prettier 3, @nabla/vite-plugin-eslint, @vitejs/plugin-react-swc

**Primary CTAs:** “Hire me” (Contact), “See work” (Resume).

---

## Information Architecture / Pages

```
/
/about
/services
/resume
/blog
  /blog/$slug
/testimonials
/contact
/admin (protected)
/admin/posts
/admin/posts/$id
/admin/projects
```

---

## Project Structure

```
src/
  routes/
    __root.tsx
    index.tsx
    about.tsx
    services.tsx
    resume.tsx
    blog/
      index.tsx
      $slug.tsx
    testimonials.tsx
    contact.tsx
    admin/
      index.tsx
      posts.tsx
      posts.$id.tsx
  components/
    AppShell.tsx
    LayoutWidth.tsx
    TopNav.tsx
    PagePath.tsx
    Hero.tsx
    PostCard.tsx
    Testimonial.tsx
    ServiceCard.tsx
    MDXContent.tsx
  lib/
    api.ts            # fetch wrapper with React Query
    keycloak.ts       # init + token getter
    mdx.ts            # MDX helpers (rehype/remark options if needed)
  styles/
    globals.css
```

---

## Shared Responsive Layout (Consistent Across All Pages)

**Goal:** Top navigation (logo/title + pages), middle content area, bottom path/breadcrumb. Same width and responsive behavior on all pages, from mobile → laptop → 4K.

### Principles

- **Single source of truth** for page width via a shared container component (`LayoutWidth`).
- **Fluid, clamped width** using Tailwind + CSS clamp to look great on 360px phones through 4K monitors.
- **Sticky top nav** with translucent background and blur; **footer path** mirrors the same width.
- **Content area grows** and is centered; safe paddings at all breakpoints.
- **Respect accessibility:** prefers-reduced-motion, logical landmarks (`header`/`main`/`footer`).

### Width & Spacing Rules

- Content wrapper uses: `w-full` + `max-w-[min(1400px,90vw)]` on large screens, and `max-w-[min(1200px,94vw)]` on mid screens.
- Horizontal padding: `px-4 sm:px-6 md:px-8`.
- Vertical rhythm: `py-6 sm:py-8 md:py-10` in `main`.

### Reusable Building Blocks

```tsx
// src/components/LayoutWidth.tsx
import { PropsWithChildren } from "react";

/**
 * Single source of truth for page max width + horizontal paddings.
 * Ensures identical responsive behavior across header, main, and footer.
 */
export default function LayoutWidth({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto w-full px-4 sm:px-6 md:px-8
                    max-w-[min(1400px,90vw)] lg:max-w-[min(1400px,88vw)]
                    xl:max-w-[min(1440px,84vw)] 2xl:max-w-[min(1600px,80vw)]">
      {children}
    </div>
  );
}
```

```tsx
// src/components/TopNav.tsx
import { Link } from "@tanstack/react-router";
import LayoutWidth from "./LayoutWidth";

export default function TopNav() {
  return (
    <header className="sticky top-0 z-50 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <LayoutWidth>
        <nav className="h-16 flex items-center justify-between gap-4">
          <Link to="/" className="font-semibold tracking-tight">
            Jiri Hermann
          </Link>
          <ul className="hidden md:flex items-center gap-6 text-sm">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/resume">Resume</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/testimonials">Testimonials</Link></li>
            <li><Link to="/contact" className="font-medium">Hire me</Link></li>
          </ul>
        </nav>
      </LayoutWidth>
    </header>
  );
}
```

```tsx
// src/components/PagePath.tsx
import LayoutWidth from "./LayoutWidth";

/** Bottom path / breadcrumb / current route hint */
export default function PagePath({ trail }: { trail: string }) {
  return (
    <footer className="mt-10 border-t py-4 text-sm text-muted-foreground">
      <LayoutWidth>
        <div className="truncate">{trail}</div>
      </LayoutWidth>
    </footer>
  );
}
```

```tsx
// src/components/AppShell.tsx
import { PropsWithChildren } from "react";
import TopNav from "./TopNav";
import LayoutWidth from "./LayoutWidth";
import PagePath from "./PagePath";

export default function AppShell({ children, path }: PropsWithChildren<{ path: string }>) {
  return (
    <div className="min-h-dvh flex flex-col">
      <TopNav />
      <main id="content" className="flex-1 py-6 sm:py-8 md:py-10">
        <LayoutWidth>
          {children}
        </LayoutWidth>
      </main>
      <PagePath trail={path} />
    </div>
  );
}
```

#### Usage in Routes

All route components render inside `AppShell` to inherit the same responsive width.

```tsx
// src/routes/index.tsx
import AppShell from "@/components/AppShell";
export default function HomeRoute() {
  return (
    <AppShell path="Home / Overview">
      <section className="grid gap-6 md:gap-8">
        {/* hero, recent posts, services, etc. */}
      </section>
    </AppShell>
  );
}
```

```tsx
// src/routes/__root.tsx  (TanStack Router root route component)
import { Outlet } from "@tanstack/react-router";

export default function Root() {
  // Keep minimal; per-page components wrap with AppShell for path-specific breadcrumbs.
  return <Outlet />;
}
```

**Notes**
- If you prefer a single `AppShell` at the root, you can wrap `<Outlet />` with `AppShell` and pass the computed path via router context.
- Add `scroll-margin-top` via Tailwind for anchor targets: `scroll-mt-24` to account for the sticky nav.
- For ultra-wide (≥ 2560px / 4K), the clamp above caps content width while keeping generous side gutters.

---

## Routing (TanStack Router)

- Static routes as above.
- Codegen plugin enabled in Vite for type-safe links.
- Protected admin routes via a `beforeLoad` guard that ensures Keycloak auth.

```tsx
// src/routes/admin/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { ensureKeycloakAuth } from "@/lib/keycloak";
import AdminLayout from "@/components/AppShell"; // can be the same shell with different path

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    await ensureKeycloakAuth(); // redirects to login if needed
    return null;
  },
  component: () => (
    <AdminLayout path="Admin">
      {/* admin dashboard cards */}
    </AdminLayout>
  ),
});
```

---

## Data Layer (React Query)

**Queries:**
- `GET /api/meta`
- `GET /api/posts?limit=&tag=&cursor=`
- `GET /api/posts/{slug}`
- `GET /api/projects`
- `GET /api/testimonials`
- `GET /api/resume`

**Mutations:**
- `POST /api/contact`
- Admin CRUD: `POST/PUT/DELETE /api/posts|projects|testimonials`

```ts
// src/lib/api.ts
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(import.meta.env.VITE_API_BASE + path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()), // { Authorization: `Bearer ${token}` } if logged in
      ...(init?.headers ?? {}),
    },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}
```

---

## Auth (Keycloak)

- Public site is anonymous.
- Admin routes require Keycloak.
- Use `keycloak-js` with silent SSO and token refresh.
- Prefer in-memory token + periodic refresh.

```ts
// src/lib/keycloak.ts
import Keycloak from "keycloak-js";

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KC_URL,
  realm: import.meta.env.VITE_KC_REALM,
  clientId: import.meta.env.VITE_KC_CLIENT_ID,
});

export async function initAuth() {
  await keycloak.init({
    onLoad: "check-sso",
    silentCheckSsoRedirectUri: `${location.origin}/silent-check-sso.html`
  });
}

export async function ensureKeycloakAuth() {
  if (!keycloak.authenticated) {
    await keycloak.login({ redirectUri: location.href });
  }
}

export async function authHeader() {
  if (!keycloak.token) return {};
  return { Authorization: `Bearer ${keycloak.token}` };
}
```

---

## Styling & Motion

- Tailwind for layout/typography, HeroUI for primitives.
- Framer Motion for section reveals (`whileInView` + stagger).
- Respect `prefers-reduced-motion`:
  - Gate motion with `useReducedMotion()`.
  - Provide non-animated fallbacks for essential interactions.

---

## Content (MDX)

- Blog post content is MDX fetched from `/api/posts/{slug}` with metadata.
- Render via `<MDXContent>` component (client-side only).
- Optional Quill for testimonials/projects admin notes.

```tsx
// src/components/MDXContent.tsx
import { useMemo } from "react";
import { MDXProvider } from "@mdx-js/react";

export default function MDXContent({ code }: { code: string }) {
  const Content = useMemo(() => {
    // transform code string to component (implementation-specific)
    // e.g., using @mdx-js/runtime or a compiled MDX function
    return () => <article className="prose prose-zinc dark:prose-invert">{/* ... */}</article>;
  }, [code]);

  return (
    <MDXProvider>
      <Content />
    </MDXProvider>
  );
}
```

---

## Forms (react-hook-form + zod)

```ts
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

type ContactForm = z.infer<typeof schema>;

export function ContactForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit(async (data) => {
      await fetch(import.meta.env.VITE_API_BASE + "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      // show toast, reset, etc.
    })} className="grid gap-4 max-w-xl">
      {/* inputs bound with {...register('field')} */}
      <button disabled={isSubmitting} className="btn">Send</button>
    </form>
  );
}
```

---

## Environment & Dev

**.env**

```
VITE_API_BASE=http://localhost:8080
VITE_KC_URL=http://localhost:8081
VITE_KC_REALM=personal
VITE_KC_CLIENT_ID=personal-fe
```

**package.json scripts**

```json
{
  "scripts": {
    "dev": "vite --port 3333",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint \"src/**/*.{ts,tsx}\"",
    "typecheck": "tsc --noEmit"
  }
}
```

**Vite dev proxy** (optional) to `/api`, `/sse`, `/session`, `/actuator` if needed.

---

## SEO

- Per-page `<head>`: title, description, canonical, Open Graph/Twitter.
- `sitemap.xml` + RSS feed for `/blog` (generated by BE).
- JSON-LD: `Person`, `BlogPosting`, `Service`.

---

## MSW (optional for local)

- Mock `GET /api/posts`, `GET /api/posts/:slug`, etc., to unblock FE dev.

---

## Definition of Done (FE)

- Shared AppShell with identical responsive width on top nav, content, and bottom path.
- Page structure, nav, footer, responsive across mobile → 4K.
- Blog list + post render (MDX).
- Contact form with validation and server integration.
- Admin shell + guard (basic).
- Lighthouse ≥ **90** (Performance / Best Practices / A11y).
- ESLint/Prettier clean; TS typecheck passes.

---

## Quick Checklist (Responsive)

- [ ] All pages render inside `AppShell`.
- [ ] No page-specific `max-w` overrides; only `LayoutWidth` controls width.
- [ ] Sticky nav does not overlap anchors (`scroll-mt-*` used).
- [ ] 4K screens show capped content width with ample gutters.
- [ ] Mobile menus accessible (keyboard + screen readers).
- [ ] Motion reduced when `prefers-reduced-motion` is active.


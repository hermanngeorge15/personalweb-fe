## Personal Site — Frontend: Implementation TODOs

Immediate

- Scaffold React entry with TanStack Router (done)
- Add Tailwind globals and CSS variables (done)
- Implement shared layout components (done)
- Create initial routes: root and home (done)
- Add basic pages: about, services, resume, blog, blog/$slug, testimonials, contact (done)
- Add admin route with guard shell (basic, done)
- Wrap app with HeroUI + React Query providers (done)
- Replace nav CTA with HeroUI Button (done)
- Add ContactForm (RHF + zod) and wire submit (done)
- MSW: handlers and mock mode bootstrap (done)
 - React Query hooks for posts/post/meta/projects/testimonials/resume (done)
 - Wire routes to data hooks (blog list/detail, testimonials, resume) (done)
 - Per-route SEO titles via helper (done)
- SEO: canonical/og/twitter helpers applied across key routes (done)
- MDXContent: client-side MDX rendering with @mdx-js/runtime + remark-gfm (done)

Next

- Integrate HeroUI theme tokens more broadly (cards, typography, modals)
- Add subtle motion to sections/cards with MotionSection variants
- Admin CRUD: add save flows for posts/projects/testimonials (+ optimistic UI)
- Accessibility pass: landmarks, aria labels, focus states, keyboard nav
- Performance: image optimization guidelines and lazy loading where needed
- Lighthouse ≥ 90 across Performance/Best Practices/A11y; fix identified gaps
- Sitemap.xml + RSS for blog; verify canonical links per route
- MSW: refine data and add error states (500, 404, empty states)

Definition of Done

- AppShell cohesive width across header, main, footer
- Basic pages render with consistent layout
- Lint, format, typecheck clean



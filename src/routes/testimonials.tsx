import AppShell from '@/components/AppShell'
import { useTestimonials } from '@/lib/queries'
import { MotionSection } from '@/components/MotionSection'
import { useEffect } from 'react'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'
import { createFileRoute } from '@tanstack/react-router'

function TestimonialsPage() {
  const { data, isLoading, isError } = useTestimonials()
  useEffect(() => {
    setHead({
      title: `Testimonials — ${SEO_DEFAULTS.siteName}`,
      description: SEO_DEFAULTS.description,
      canonical: `${SEO_DEFAULTS.siteUrl}/testimonials`,
      og: {
        title: `Testimonials — ${SEO_DEFAULTS.siteName}`,
        url: `${SEO_DEFAULTS.siteUrl}/testimonials`,
        image: SEO_DEFAULTS.image,
        description: SEO_DEFAULTS.description,
      },
      twitter: {
        card: 'summary',
        title: `Testimonials — ${SEO_DEFAULTS.siteName}`,
        description: SEO_DEFAULTS.description,
        image: SEO_DEFAULTS.image,
      },
    })
  }, [])
  return (
    <AppShell path="Testimonials">
      <MotionSection>
        <section className="relative overflow-hidden rounded-3xl border bg-white/60 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur md:p-10">
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-400/30 via-fuchsia-400/20 to-pink-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-400/20 via-cyan-400/20 to-blue-400/20 blur-3xl" />
          <div className="relative grid gap-6 md:gap-8">
            <h1 className="text-2xl font-semibold tracking-tight">
              Testimonials
            </h1>
            {isLoading && <div>Loading…</div>}
            {isError && <div>Failed to load testimonials.</div>}
            {data && (
              <ul className="grid gap-4 md:grid-cols-2">
                {data.map((t) => (
                  <li key={t.id}>
                    <div className="rounded-xl border bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl">
                      <div className="mb-4 flex items-start gap-4">
                        {t.avatar_url ? (
                          <img
                            src={t.avatar_url}
                            alt={t.author}
                            className="h-16 w-16 rounded-full object-cover ring-2 ring-indigo-100"
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-2xl font-semibold text-white">
                            {t.author.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="text-lg font-semibold">
                            {t.author}
                          </div>
                          {t.role && (
                            <div className="text-muted-foreground text-sm">
                              {t.role}
                            </div>
                          )}
                        </div>
                        <svg
                          className="h-6 w-6 text-indigo-600"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zM8 8h3.8v2.05h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.15V23h-4v-7.5c0-1.79-.03-4.1-2.5-4.1-2.5 0-2.88 1.95-2.88 3.98V23h-4V8z" />
                        </svg>
                      </div>
                      <blockquote className="text-muted-foreground italic">
                        "{t.quote}"
                      </blockquote>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </MotionSection>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: TestimonialsPage,
})

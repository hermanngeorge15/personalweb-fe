import AppShell from '@/components/AppShell'
import { useEffect } from 'react'
import { SEO_DEFAULTS, setHead, setJsonLd } from '@/lib/seo'
import { createFileRoute } from '@tanstack/react-router'

function ServicesPage() {
  useEffect(() => {
    setHead({
      title: `Services — ${SEO_DEFAULTS.siteName}`,
      description: SEO_DEFAULTS.description,
      canonical: `${SEO_DEFAULTS.siteUrl}/services`,
      og: {
        title: `Services — ${SEO_DEFAULTS.siteName}`,
        url: `${SEO_DEFAULTS.siteUrl}/services`,
        image: SEO_DEFAULTS.image,
        description: SEO_DEFAULTS.description,
      },
      twitter: {
        card: 'summary',
        title: `Services — ${SEO_DEFAULTS.siteName}`,
        description: SEO_DEFAULTS.description,
        image: SEO_DEFAULTS.image,
      },
    })
    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Software Engineering',
      provider: { '@type': 'Person', name: 'Jiri Hermann' },
    })
  }, [])
  return (
    <AppShell path="Services">
      <section className="relative overflow-hidden rounded-3xl border bg-white/60 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur md:p-10">
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-400/30 via-fuchsia-400/20 to-pink-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-400/20 via-cyan-400/20 to-blue-400/20 blur-3xl" />
        <div className="prose relative max-w-none">
          <h1>Services</h1>
          <p>
            I offer end-to-end product development, UI engineering, and design
            systems work.
          </p>
        </div>
      </section>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: ServicesPage,
})

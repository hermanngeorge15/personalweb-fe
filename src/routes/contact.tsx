import AppShell from '@/components/AppShell'
import { ContactForm } from '@/components/ContactForm'
import { useEffect } from 'react'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'

function ContactPage() {
  useEffect(() => {
    setHead({
      title: `Contact — ${SEO_DEFAULTS.siteName}`,
      description: SEO_DEFAULTS.description,
      canonical: location.origin + '/contact',
      og: {
        title: `Contact — ${SEO_DEFAULTS.siteName}`,
        url: location.origin + '/contact',
        image: SEO_DEFAULTS.image,
        description: SEO_DEFAULTS.description,
      },
      twitter: {
        card: 'summary',
        title: `Contact — ${SEO_DEFAULTS.siteName}`,
        description: SEO_DEFAULTS.description,
        image: SEO_DEFAULTS.image,
      },
    })
  }, [])
  return (
    <AppShell path="Contact">
      <section className="relative overflow-hidden rounded-3xl border bg-white/60 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur md:p-10">
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-400/30 via-fuchsia-400/20 to-pink-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-400/20 via-cyan-400/20 to-blue-400/20 blur-3xl" />
        <div className="relative grid gap-6 md:gap-8">
          <h1 className="text-2xl font-semibold tracking-tight">Contact</h1>
          <ContactForm />
        </div>
      </section>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: ContactPage,
})

import AppShell from '@/components/AppShell'
import { useEffect, type ComponentType } from 'react'
import { Link } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'
import { SEO_DEFAULTS, setHead, setJsonLd } from '@/lib/seo'
import { ComponentsIcon, LayersIcon, LayoutIcon } from '@/components/icons'

const section = 'relative mx-auto max-w-[1200px] px-4 sm:px-8'

const focusRing =
  'focus-visible:outline-brand-a focus-visible:outline-2 focus-visible:outline-offset-2'

/** The three offerings named on the page. Copy is the owner's; the cards only lay it out. */
const OFFERINGS: ReadonlyArray<{
  title: string
  Icon: ComponentType<{ size?: number }>
  featured?: boolean
}> = [
  { title: 'End-to-end product development', Icon: LayersIcon },
  { title: 'UI engineering', Icon: LayoutIcon, featured: true },
  { title: 'Design systems', Icon: ComponentsIcon },
]

function OfferingCard({
  title,
  Icon,
  featured = false,
}: (typeof OFFERINGS)[number]) {
  return (
    <li
      className={twMerge(
        'bg-card flex items-center gap-5 rounded-[20px] border p-6 sm:flex-col sm:items-start sm:p-8',
        featured ? 'border-brand-a/40' : 'border-line',
      )}
    >
      <span
        aria-hidden="true"
        className={twMerge(
          'flex size-12 shrink-0 items-center justify-center rounded-xl',
          featured
            ? 'bg-brand-gradient text-on-brand'
            : 'bg-brand-a/10 text-brand-a',
        )}
      >
        <Icon size={22} />
      </span>
      <h2 className="text-heading text-[21px] leading-tight font-semibold tracking-[-0.015em] sm:text-[23px]">
        {title}
      </h2>
    </li>
  )
}

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
    <AppShell path="Services" fullBleed>
      <div
        aria-hidden="true"
        className="bg-glow-hero pointer-events-none absolute -top-[260px] left-1/2 h-[640px] w-[1100px] -translate-x-1/2"
      />

      <section
        className={`${section} pt-16 pb-10 text-center sm:pt-[88px] sm:pb-12`}
      >
        <span className="border-line-strong bg-chip/60 text-body inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px]">
          <span
            aria-hidden="true"
            className="bg-brand-b size-1.5 rounded-full"
          />
          Software engineering
        </span>
        <h1 className="text-heading mx-auto mt-6 max-w-[800px] text-[40px] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-[52px] lg:text-[58px]">
          <span className="text-brand-gradient">Services</span>
        </h1>
        <p className="text-muted mx-auto mt-5 max-w-[600px] text-[17px] leading-[1.55] sm:text-[19px]">
          I offer end-to-end product development, UI engineering, and design
          systems work.
        </p>
      </section>

      <section className={`${section} pt-2`}>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-5">
          {OFFERINGS.map((offering) => (
            <OfferingCard key={offering.title} {...offering} />
          ))}
        </ul>
      </section>

      <section className={`${section} pt-20 pb-24 sm:pt-24 sm:pb-[104px]`}>
        <div className="border-line bg-cta-glow rounded-3xl border px-6 py-12 text-center sm:px-12 sm:py-14">
          <h2 className="text-heading text-[28px] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[38px]">
            Have a project in mind?
          </h2>
          <p className="text-muted mx-auto mt-3.5 max-w-[480px] text-base sm:text-[17px]">
            I typically respond within 24-48 hours.
          </p>
          <Link
            to="/contact"
            className={`bg-brand-gradient-x text-on-brand mt-7 inline-flex min-h-11 items-center rounded-[10px] px-[22px] py-3 text-[15px] font-medium transition-opacity hover:opacity-90 ${focusRing}`}
          >
            Get in touch
          </Link>
        </div>
      </section>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: ServicesPage,
})

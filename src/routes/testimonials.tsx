import AppShell from '@/components/AppShell'
import { useTestimonials, type Testimonial } from '@/lib/queries'
import { MotionSection } from '@/components/MotionSection'
import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'
import { QuoteIcon } from '@/components/icons'

const section = 'relative mx-auto max-w-[1200px] px-4 sm:px-8'

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <li className="h-full">
      <figure className="border-line bg-card flex h-full flex-col rounded-[20px] border p-6 sm:p-7">
        <QuoteIcon size={28} className="text-brand-a -ml-1" />
        <blockquote className="text-body mt-4 flex-1 text-[17px] leading-relaxed">
          {testimonial.quote}
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-3">
          {testimonial.avatar_url ? (
            <img
              src={testimonial.avatar_url}
              alt={testimonial.author}
              loading="lazy"
              className="border-line-strong size-11 shrink-0 rounded-full border object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="bg-brand-gradient text-on-brand flex size-11 shrink-0 items-center justify-center rounded-full text-base font-semibold"
            >
              {testimonial.author.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="min-w-0">
            <span className="text-heading block text-[15px] font-semibold">
              {testimonial.author}
            </span>
            {testimonial.role && (
              <span className="text-faint block text-sm">
                {testimonial.role}
              </span>
            )}
          </span>
        </figcaption>
      </figure>
    </li>
  )
}

function StatusBox({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="border-line bg-subtle rounded-[20px] border px-6 py-14 text-center">
      <p className="text-heading text-lg font-semibold">{title}</p>
      <p className="text-faint mt-2 text-sm">{detail}</p>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <ul
      aria-busy="true"
      aria-label="Loading testimonials"
      className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-5"
    >
      {[0, 1, 2].map((key) => (
        <li
          key={key}
          className="border-line bg-card flex animate-pulse flex-col gap-4 rounded-[20px] border p-7 motion-reduce:animate-none"
        >
          <div className="bg-chip size-7 rounded-md" />
          <div className="bg-chip h-5 w-11/12 rounded-lg" />
          <div className="bg-chip h-5 w-4/5 rounded-lg" />
          <div className="mt-4 flex items-center gap-3">
            <div className="bg-chip size-11 rounded-full" />
            <div className="bg-chip h-4 w-32 rounded-lg" />
          </div>
        </li>
      ))}
    </ul>
  )
}

function EmptyState() {
  return (
    <div className="border-line-strong bg-subtle rounded-[20px] border border-dashed px-6 py-12 text-center sm:p-12">
      <h2 className="text-heading text-2xl font-semibold tracking-[-0.015em]">
        No testimonials yet
      </h2>
      <p className="text-muted mx-auto mt-2.5 max-w-[460px] text-base leading-relaxed">
        Worked with me? I’d be grateful for a few words.
      </p>
      <Link
        to="/contact"
        className="bg-brand-gradient-x text-on-brand focus-visible:outline-brand-a mt-6 inline-flex min-h-11 items-center rounded-[10px] px-5 py-3 text-[15px] font-medium transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Write one
      </Link>
    </div>
  )
}

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
    <AppShell path="Testimonials" fullBleed>
      <div
        aria-hidden="true"
        className="bg-glow-hero pointer-events-none absolute -top-[260px] left-1/2 h-[640px] w-[1100px] -translate-x-1/2"
      />

      <section
        className={`${section} pt-16 pb-8 text-center sm:pt-[88px] sm:pb-10`}
      >
        <p className="text-brand-a text-[13px] font-medium">Testimonials</p>
        <h1 className="text-heading mx-auto mt-3.5 max-w-[760px] text-[40px] leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-[48px] lg:text-[54px]">
          What people I’ve worked with say
        </h1>
      </section>

      <div className={`${section} pt-2 pb-24 sm:pb-[104px]`}>
        {isLoading && <LoadingSkeleton />}
        {isError && (
          <StatusBox
            title="Failed to load testimonials"
            detail="Please try again later"
          />
        )}
        {data && data.length === 0 && <EmptyState />}
        {data && data.length > 0 && (
          <MotionSection>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-5">
              {data.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                />
              ))}
            </ul>
          </MotionSection>
        )}
      </div>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: TestimonialsPage,
})

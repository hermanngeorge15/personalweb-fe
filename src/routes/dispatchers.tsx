import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import AppShell from '@/components/AppShell'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'
import { ArrowLeftIcon, ExternalLinkIcon } from '@/components/icons'
import { LEARN_KOTLIN_ENABLED } from '@/config/features'

const TITLE = 'Kotlin Coroutines Dispatcher Visualizer'
const DESCRIPTION =
  'Interactive learning tool - from basics to advanced pitfalls'

/**
 * The visualizer itself is the standalone page public/dispatchers.html,
 * embedded in an iframe. In a frame it hides its own heading and backdrop
 * (see the `html.embedded` styles there); opened directly it is unchanged.
 */
function DispatchersPage() {
  useEffect(() => {
    const title = `${TITLE} — ${SEO_DEFAULTS.siteName}`
    const url = `${SEO_DEFAULTS.siteUrl}/dispatchers`
    setHead({
      title,
      description: DESCRIPTION,
      canonical: url,
      og: { title, url, image: SEO_DEFAULTS.image, description: DESCRIPTION },
      twitter: {
        card: 'summary',
        title,
        description: DESCRIPTION,
        image: SEO_DEFAULTS.image,
      },
    })
  }, [])

  return (
    <AppShell path="Dispatchers" fullBleed>
      <div
        aria-hidden="true"
        className="bg-glow-hero pointer-events-none absolute -top-[300px] left-1/2 h-[600px] w-[1100px] -translate-x-1/2 opacity-80"
      />

      <section className="relative mx-auto flex max-w-[1200px] flex-wrap items-end justify-between gap-4 px-4 pt-8 sm:px-8 sm:pt-12">
        <div className="min-w-0 flex-[1_1_520px]">
          {LEARN_KOTLIN_ENABLED && (
            <Link
              to="/learn-kotlin"
              className="text-muted hover:text-ink inline-flex min-h-11 items-center gap-1.5 text-[14px] transition-colors"
            >
              <ArrowLeftIcon size={15} />
              Learn Kotlin
            </Link>
          )}
          <h1 className="text-heading mt-1 text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[40px]">
            {TITLE}
          </h1>
          <p className="text-muted mt-2 text-[16px] leading-relaxed sm:text-[17px]">
            Interactive learning tool — from basics to advanced pitfalls. Pick a
            scenario, then watch workers, global queues and work stealing in
            real time.
          </p>
        </div>
        <a
          href="/dispatchers.html"
          target="_blank"
          rel="noopener noreferrer"
          className="border-line-strong text-ink hover:bg-chip inline-flex min-h-11 items-center gap-2 rounded-[10px] border px-4 text-[15px] font-medium transition-colors"
        >
          Open full screen
          <ExternalLinkIcon size={15} />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </section>

      <section className="relative mx-auto max-w-[1200px] px-4 pt-6 pb-16 sm:px-8 sm:pb-24">
        <div className="border-line bg-subtle shadow-window overflow-hidden rounded-2xl border">
          <iframe
            src="/dispatchers.html"
            title={TITLE}
            className="block h-[calc(100dvh-140px)] min-h-[640px] w-full border-0"
          />
        </div>
        <p className="text-faint mt-3 text-[13px]">
          The visualizer scrolls inside its frame. Use “Open full screen” for
          more room.
        </p>
      </section>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: DispatchersPage,
})

import { useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import AppShell from './AppShell'
import { SEO_DEFAULTS } from '@/lib/seo'

const buttonBase =
  'focus-visible:outline-brand-a inline-flex min-h-11 items-center rounded-[10px] px-5 py-3 text-[15px] font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2'
const primaryButton = `${buttonBase} bg-brand-gradient-x text-on-brand hover:opacity-90`
const secondaryButton = `${buttonBase} border-window-line text-ink hover:bg-chip border`

/** Asks crawlers not to index the 404 view; removed again when the user navigates away. */
function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])
}

/** Page shown for any URL no route matches (wired as the root route's `notFoundComponent`). */
export default function NotFound() {
  const { pathname } = useLocation()
  useNoIndex()

  useEffect(() => {
    document.title = `Page not found — ${SEO_DEFAULTS.siteName}`
  }, [])

  return (
    <AppShell path="404" fullBleed>
      <div
        aria-hidden="true"
        className="bg-glow-hero pointer-events-none absolute -top-[200px] left-1/2 h-[640px] w-[1000px] -translate-x-1/2"
      />
      <section className="relative mx-auto max-w-[760px] px-4 pt-20 pb-28 text-center sm:px-8 sm:pt-[120px] sm:pb-[140px]">
        <div
          aria-hidden="true"
          className="border-window-line bg-window shadow-window text-body inline-block max-w-full rounded-xl border px-5 py-4 text-left font-mono text-sm leading-[1.9]"
        >
          <div className="break-all">
            <span className="text-brand-b">$</span> curl -I jirihermann.com
            {pathname}
          </div>
          <div>
            HTTP/2 <span className="text-danger">404</span> Not Found
          </div>
        </div>
        <h1 className="text-heading mt-9 text-[40px] leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-[48px] lg:text-[56px]">
          This page doesn’t exist
        </h1>
        <p className="text-muted mx-auto mt-4 max-w-[480px] text-[17px] leading-relaxed sm:text-lg">
          The link may be old, or the post may have moved. Try one of these
          instead.
        </p>
        <nav
          aria-label="Suggested pages"
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Link to="/" className={primaryButton}>
            Go home
          </Link>
          <Link to="/blog" className={secondaryButton}>
            Read the blog
          </Link>
          <Link to="/projects" className={secondaryButton}>
            See projects
          </Link>
        </nav>
      </section>
    </AppShell>
  )
}

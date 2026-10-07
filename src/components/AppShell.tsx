import { PropsWithChildren } from 'react'
import TopNav from './TopNav'
import LayoutWidth from './LayoutWidth'
import Footer from './Footer'

/**
 * Page frame: header, main, footer.
 *
 * `fullBleed` pages (the redesigned blog) lay out their own width and sections.
 * Other pages keep the old padded column and the `legacy-dark` class, which
 * remaps their hard-coded light Tailwind colours in dark mode (see globals.css).
 */
export default function AppShell({
  children,
  fullBleed = false,
}: PropsWithChildren<{ path: string; fullBleed?: boolean }>) {
  return (
    <div className="bg-page text-ink flex min-h-dvh flex-col">
      <a
        href="#content"
        className="focus:bg-invert focus:text-on-invert sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <TopNav />
      {fullBleed ? (
        <main id="content" className="relative flex-1 overflow-x-clip">
          {children}
        </main>
      ) : (
        <main id="content" className="legacy-dark flex-1 py-6 sm:py-8 md:py-10">
          <LayoutWidth>{children}</LayoutWidth>
        </main>
      )}
      <Footer />
    </div>
  )
}

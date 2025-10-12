import { PropsWithChildren } from 'react'
import TopNav from './TopNav'
import LayoutWidth from './LayoutWidth'
import Footer from './Footer'

export default function AppShell({
  children,
  path: _path,
}: PropsWithChildren<{ path: string }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded focus:bg-blue-600 focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <TopNav />
      <main id="content" className="flex-1 py-6 sm:py-8 md:py-10">
        <LayoutWidth>{children}</LayoutWidth>
      </main>
      <Footer />
    </div>
  )
}

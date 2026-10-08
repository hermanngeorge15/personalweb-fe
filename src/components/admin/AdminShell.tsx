import { useEffect, useId, useState, type PropsWithChildren } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { AUTHOR } from '@/config/site'
import { keycloak } from '@/lib/keycloak'
import { LogoTile } from '@/components/Brand'
import { CloseIcon, MenuIcon } from '@/components/icons'
import ThemeToggle from '@/components/ThemeToggle'
import { cx, ArrowUpRightIcon, SignOutIcon, secondaryButton } from './ui'

type NavItem = { to: string; label: string; exact?: boolean }

export const ADMIN_NAV: Array<{ heading: string; items: NavItem[] }> = [
  {
    heading: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', exact: true }],
  },
  {
    heading: 'Content',
    items: [
      { to: '/admin/posts', label: 'Posts' },
      { to: '/admin/projects', label: 'Projects' },
      { to: '/admin/testimonials', label: 'Testimonials' },
    ],
  },
  {
    heading: 'Resume',
    items: [
      { to: '/admin/resume/projects', label: 'Projects' },
      { to: '/admin/resume/education', label: 'Education' },
      { to: '/admin/resume/certificates', label: 'Certificates' },
      { to: '/admin/resume/languages', label: 'Languages' },
      { to: '/admin/resume/hobbies', label: 'Hobbies' },
    ],
  },
  {
    heading: 'Learn Kotlin',
    items: [
      { to: '/admin/kotlin/topics', label: 'Topics' },
      { to: '/admin/kotlin/chapters', label: 'Chapters' },
    ],
  },
]

export type Crumb = {
  label: string
  to?: string
  params?: Record<string, string>
}

/** Signed-in user's display name from the Keycloak token, or the site author. */
export function adminUserName(): string {
  const token = keycloak.tokenParsed as
    | { name?: string; preferred_username?: string }
    | undefined
  return token?.name ?? token?.preferred_username ?? AUTHOR.name
}

function signOut() {
  void keycloak.logout({ redirectUri: `${window.location.origin}/` })
}

const navLinkClass =
  'text-body hover:bg-chip hover:text-ink flex min-h-11 items-center rounded-lg px-2.5 text-[15px] transition-colors lg:min-h-9 lg:text-sm focus-visible:outline-brand-a focus-visible:outline-2'
const navLinkActive = {
  className: '!bg-brand-a/10 !text-brand-a font-semibold',
  'aria-current': 'page' as const,
}

function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Admin" className="flex flex-col gap-5">
      {ADMIN_NAV.map((group) => (
        <div key={group.heading}>
          <p className="text-faint mb-1.5 px-2.5 text-[11px] font-semibold tracking-[0.08em] uppercase">
            {group.heading}
          </p>
          <ul className="grid gap-0.5">
            {group.items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  className={navLinkClass}
                  activeOptions={{ exact: item.exact ?? false }}
                  activeProps={navLinkActive}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function UserBox() {
  return (
    <div className="border-line flex items-center justify-between gap-2 border-t pt-4">
      <span className="min-w-0">
        <span className="text-ink block truncate text-[13px] font-semibold">
          {adminUserName()}
        </span>
        <span className="text-faint block text-xs">Admin</span>
      </span>
      <button
        type="button"
        onClick={signOut}
        className={cx(secondaryButton, 'px-3')}
      >
        <SignOutIcon />
        Sign out
      </button>
    </div>
  )
}

function AdminLogo() {
  return (
    <Link
      to="/admin"
      className="text-ink flex items-center gap-2.5 px-1 text-[15px] font-semibold"
    >
      <LogoTile className="size-7 text-xs" />
      Admin
    </Link>
  )
}

/**
 * Frame for every admin page: sidebar navigation with sign-out (a menu on phones), a top bar
 * with breadcrumbs, the theme switch and a link to the public site. Replaces the public
 * header and footer inside /admin.
 */
export default function AdminShell({
  crumbs,
  viewHref = '/',
  children,
}: PropsWithChildren<{ crumbs: Crumb[]; viewHref?: string }>) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const pathname = useLocation({ select: (location) => location.pathname })

  // A navigation closes the phone menu.
  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <div className="bg-subtle text-ink min-h-dvh lg:flex">
      <a
        href="#content"
        className="focus:bg-invert focus:text-on-invert sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="border-line bg-footer sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col gap-6 overflow-y-auto border-r px-3.5 py-5 lg:flex">
        <AdminLogo />
        <AdminNav />
        <div className="mt-auto">
          <UserBox />
        </div>
      </aside>

      {/* Phone / tablet header with a disclosure menu */}
      <header className="border-line bg-footer sticky top-0 z-40 border-b lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5">
          <AdminLogo />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? 'Close admin menu' : 'Open admin menu'}
            className="border-line-strong text-ink flex size-11 items-center justify-center rounded-[10px] border"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
        {menuOpen && (
          <div
            id={menuId}
            className="border-line max-h-[calc(100dvh-66px)] overflow-y-auto border-t px-4 pt-4 pb-5"
          >
            <AdminNav onNavigate={() => setMenuOpen(false)} />
            <div className="mt-5">
              <UserBox />
            </div>
          </div>
        )}
      </header>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-line bg-page flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5 sm:px-7">
          <nav aria-label="Breadcrumb" className="min-w-0 text-sm">
            <ol className="text-faint flex flex-wrap items-center gap-1.5">
              {crumbs.map((crumb, index) => {
                const last = index === crumbs.length - 1
                return (
                  <li key={index} className="flex min-w-0 items-center gap-1.5">
                    {index > 0 && <span aria-hidden="true">/</span>}
                    {last || !crumb.to ? (
                      <span
                        aria-current={last ? 'page' : undefined}
                        className={
                          last ? 'text-ink truncate' : 'text-faint truncate'
                        }
                      >
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        to={crumb.to}
                        params={crumb.params}
                        className="text-link hover:underline"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href={viewHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cx(secondaryButton, 'px-3')}
            >
              View site
              <ArrowUpRightIcon />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
        <main
          id="content"
          className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-6 sm:px-7 sm:py-7"
        >
          {children}
        </main>
      </div>
    </div>
  )
}

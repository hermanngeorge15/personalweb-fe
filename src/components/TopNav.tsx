import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ANNOUNCEMENT, AUTHOR, SOCIAL_LINKS } from '@/config/site'
import { LogoTile } from './Brand'
import { CloseIcon, GitHubIcon, MenuIcon } from './icons'
import ThemeToggle from './ThemeToggle'

const navLinkClass =
  'text-muted hover:text-ink rounded-lg px-3 py-2 transition-colors sm:px-3.5'
const navLinkActive = { className: 'bg-chip !text-ink' }

function AnnouncementBar() {
  if (!ANNOUNCEMENT) return null
  return (
    <a
      href={ANNOUNCEMENT.href}
      target="_blank"
      rel="noopener noreferrer"
      className="border-line bg-subtle text-body hover:text-ink block border-b px-4 py-2.5 text-center text-[13px] transition-colors"
    >
      <span className="bg-brand-gradient text-on-brand mr-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold">
        NEW
      </span>
      {ANNOUNCEMENT.text}
    </a>
  )
}

const MAIN_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/resume', label: 'Resume' },
  { to: '/blog', label: 'Blog' },
] as const

const menuLinkClass =
  'border-line text-ink block border-b px-1 py-4 text-[26px] font-semibold tracking-[-0.02em]'

/** Full-screen menu below the md breakpoint. Escape or any link closes it. */
function MobileMenu({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="bg-page fixed inset-0 z-[70] flex flex-col overflow-y-auto md:hidden"
    >
      <div className="border-line flex items-center justify-between border-b px-4 py-3">
        <Link
          to="/"
          onClick={onClose}
          className="text-ink flex items-center gap-2 text-[15px] font-semibold"
        >
          <LogoTile />
          {AUTHOR.name}
        </Link>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="border-line-strong text-ink flex size-11 items-center justify-center rounded-[10px] border"
        >
          <CloseIcon />
        </button>
      </div>
      <nav aria-label="Main" className="flex flex-col px-4 py-6">
        <Link to="/" onClick={onClose} className={menuLinkClass}>
          Home
        </Link>
        {MAIN_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={menuLinkClass}
          >
            {link.label}
          </Link>
        ))}
        <Link
          to="/learn-kotlin"
          onClick={onClose}
          className={`${menuLinkClass} !text-muted`}
        >
          Learn Kotlin
        </Link>
      </nav>
      <div className="mt-auto flex flex-col gap-3 px-4 pt-4 pb-8">
        <Link
          to="/contact"
          onClick={onClose}
          className="bg-brand-gradient text-on-brand rounded-xl p-3.5 text-center text-base font-medium"
        >
          Contact me
        </Link>
        <div className="text-faint flex justify-center gap-6 text-sm">
          {SOCIAL_LINKS.linkedin && (
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink py-2"
            >
              LinkedIn
            </a>
          )}
          {SOCIAL_LINKS.github && (
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink py-2"
            >
              GitHub
            </a>
          )}
          {SOCIAL_LINKS.instagram && (
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink py-2"
            >
              Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  return (
    <>
      <AnnouncementBar />
      <header className="border-line bg-header top-0 z-50 border-b backdrop-blur-md md:sticky">
        <nav
          aria-label="Main"
          className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 sm:px-8 md:py-4"
        >
          <Link
            to="/"
            className="text-ink order-1 flex items-center gap-2.5 text-base font-semibold"
          >
            <LogoTile />
            {AUTHOR.name}
          </Link>

          <ul className="order-2 hidden items-center gap-1 text-sm md:flex">
            {MAIN_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={navLinkClass}
                  activeProps={navLinkActive}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="order-3 flex items-center gap-1 sm:gap-2">
            {SOCIAL_LINKS.github && (
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-muted hover:bg-chip hover:text-ink hidden size-10 items-center justify-center rounded-lg transition-colors sm:flex"
              >
                <GitHubIcon />
              </a>
            )}
            <ThemeToggle />
            <Link
              to="/contact"
              className="bg-invert text-on-invert ml-1 hidden rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 md:inline-block"
            >
              Contact me
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="border-line-strong text-ink flex size-11 items-center justify-center rounded-[10px] border md:hidden"
            >
              <MenuIcon />
            </button>
          </div>
        </nav>
      </header>
      {menuOpen && <MobileMenu onClose={closeMenu} />}
    </>
  )
}

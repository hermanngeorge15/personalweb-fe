import { Link } from '@tanstack/react-router'
import { ANNOUNCEMENT, AUTHOR, SOCIAL_LINKS } from '@/config/site'
import { LogoTile } from './Brand'
import { GitHubIcon } from './icons'
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

export default function TopNav() {
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

          <ul className="order-3 -ml-3 flex w-full flex-wrap items-center gap-1 text-sm md:order-2 md:ml-0 md:w-auto">
            <li>
              <Link
                to="/about"
                className={navLinkClass}
                activeProps={navLinkActive}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/resume"
                className={navLinkClass}
                activeProps={navLinkActive}
              >
                Resume
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className={navLinkClass}
                activeProps={navLinkActive}
              >
                Blog
              </Link>
            </li>
          </ul>

          <div className="order-2 flex items-center gap-1 sm:gap-2 md:order-3">
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
              className="bg-invert text-on-invert ml-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
            >
              Contact me
            </Link>
          </div>
        </nav>
      </header>
    </>
  )
}

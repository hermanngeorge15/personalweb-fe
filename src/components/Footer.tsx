import { Link } from '@tanstack/react-router'
import { AUTHOR, RSS_URL, SOCIAL_LINKS } from '@/config/site'
import { LogoTile } from './Brand'

const columnTitle = 'text-ink text-[13px] font-semibold'
const footerLink = 'text-faint hover:text-ink transition-colors'

function ExternalLink({ href, label }: { href: string; label: string }) {
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={footerLink}
    >
      {label}
    </a>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-line bg-footer border-t">
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-10 px-4 pt-14 pb-8 sm:px-8">
        <div className="max-w-[380px] flex-[1_1_320px]">
          <Link
            to="/"
            className="text-ink flex items-center gap-2.5 font-semibold"
          >
            <LogoTile />
            {AUTHOR.name}
          </Link>
          <p className="text-faint mt-4 text-sm leading-relaxed">
            {AUTHOR.footerBio}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-14 gap-y-8 text-sm">
          <nav aria-label="Site" className="flex flex-col gap-2.5">
            <span className={columnTitle}>Site</span>
            <Link to="/about" className={footerLink}>
              About
            </Link>
            <Link to="/projects" className={footerLink}>
              Projects
            </Link>
            <Link to="/resume" className={footerLink}>
              Resume
            </Link>
            <Link to="/blog" className={footerLink}>
              Blog
            </Link>
            <Link to="/contact" className={footerLink}>
              Contact
            </Link>
          </nav>
          <nav aria-label="Learn" className="flex flex-col gap-2.5">
            <span className={columnTitle}>Learn</span>
            <Link to="/learn-kotlin" className={footerLink}>
              Learn Kotlin
            </Link>
            <Link to="/dispatchers" className={footerLink}>
              Dispatcher Visualizer
            </Link>
            <ExternalLink
              href={SOCIAL_LINKS.kotlinServerSquad}
              label="Kotlin Server Squad"
            />
          </nav>
          <nav aria-label="Connect" className="flex flex-col gap-2.5">
            <span className={columnTitle}>Connect</span>
            <ExternalLink href={SOCIAL_LINKS.linkedin} label="LinkedIn" />
            <ExternalLink href={SOCIAL_LINKS.github} label="GitHub" />
            <ExternalLink href={SOCIAL_LINKS.instagram} label="Instagram" />
            {RSS_URL && (
              <a href={RSS_URL} className={footerLink}>
                RSS
              </a>
            )}
          </nav>
        </div>
      </div>
      <div className="border-line text-fainter mx-auto flex max-w-[1200px] flex-wrap justify-between gap-3 border-t px-4 pt-5 pb-8 text-[13px] sm:px-8">
        <span>
          © {year} {AUTHOR.name}
        </span>
        <span>Built with Kotlin + React</span>
      </div>
    </footer>
  )
}

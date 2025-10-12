import { Link } from '@tanstack/react-router'
import LayoutWidth from './LayoutWidth'
import { useMeta } from '@/lib/queries'

export default function Footer() {
  const meta = useMeta()
  const socials = (() => {
    try {
      const parsed = meta.data?.socials ? JSON.parse(meta.data.socials) : undefined
      return parsed ?? {}
    } catch {
      return {}
    }
  })()

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-20 overflow-hidden border-t bg-gradient-to-br from-white/60 via-blue-50/30 to-cyan-50/20 backdrop-blur">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/10 via-cyan-400/5 to-teal-400/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-gradient-to-tr from-green-400/10 via-emerald-400/5 to-teal-400/5 blur-3xl" />

      <LayoutWidth>
        <div className="relative py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link
                to="/"
                className="inline-block text-2xl font-bold tracking-tight transition-colors hover:text-blue-600"
              >
                <span className="bg-gradient-to-br from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-transparent">
                  Jiri Hermann
                </span>
              </Link>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                Product-focused full-stack engineer specializing in frontend and user experience.
                Building performant, accessible interfaces and robust systems that scale.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <a
                  href={(socials.linkedin as string) || 'https://www.linkedin.com/in/your-handle'}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 ring-1 ring-black/10 backdrop-blur transition hover:scale-110 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-cyan-500/10 hover:ring-blue-500/30"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-gray-700 group-hover:text-blue-600"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zM8 8h3.8v2.05h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.15V23h-4v-7.5c0-1.79-.03-4.1-2.5-4.1-2.5 0-2.88 1.95-2.88 3.98V23h-4V8z" />
                  </svg>
                </a>
                <a
                  href={(socials.github as string) || 'https://github.com/your-handle'}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 ring-1 ring-black/10 backdrop-blur transition hover:scale-110 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-cyan-500/10 hover:ring-blue-500/30"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-gray-700 group-hover:text-blue-600"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.17-1.11-1.48-1.11-1.48-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.13-4.55-5 0-1.11.39-2.02 1.03-2.73-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.04A9.27 9.27 0 0 1 12 7.49c.85 0 1.7.12 2.5.35 1.9-1.31 2.74-1.04 2.74-1.04.55 1.41.2 2.45.1 2.71.64.71 1.02 1.62 1.02 2.73 0 3.88-2.34 4.73-4.57 4.99.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"
                    />
                  </svg>
                </a>
                <a
                  href={(socials.instagram as string) || 'https://instagram.com/your-handle'}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 ring-1 ring-black/10 backdrop-blur transition hover:scale-110 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-cyan-500/10 hover:ring-blue-500/30"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-gray-700 group-hover:text-blue-600"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.4.4.6.2 1 .4 1.5.9.5.5.7.9.9 1.5.2.5.3 1.2.4 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.4-.2.6-.4 1-.9 1.5-.5.5-.9.7-1.5.9-.5.2-1.2.3-2.4.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.4-.4-.6-.2-1-.4-1.5-.9-.5-.5-.7-.9-.9-1.5-.2-.5-.3-1.2-.4-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.4.2-.6.4-1 .9-1.5.5-.5.9-.7 1.5-.9.5-.2 1.2-.3 2.4-.4C8.4 2.2 8.8 2.2 12 2.2m0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.5.2-1.8.3-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.1.3-.3.8-.3 1.8-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.5.3 1.8.2.5.4.8.7 1.1.3.3.6.5 1.1.7.3.1.8.3 1.8.3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1 0 1.5-.2 1.8-.3.5-.2.8-.4 1.1-.7.3-.3.6-.6.7-1.1.1-.3.2-.8.3-1.8.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.5-.3-1.8-.2-.5-.4-.8-.7-1.1-.3-.3-.6-.5-1.1-.7-.3-.1-.8-.3-1.8-.3-1.2-.1-1.6-.1-4.7-.1zm0 2.9a6.2 6.2 0 1 1 0 12.4 6.2 6.2 0 0 1 0-12.4zm0 10.2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-10.9a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z" />
                  </svg>
                </a>
                <a
                  href={(socials.kotlinserversquad as string) || 'https://kotlinserversquad.dev'}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Kotlin Server Squad"
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 ring-1 ring-black/10 backdrop-blur transition hover:scale-110 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-cyan-500/10 hover:ring-blue-500/30"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-gray-700 group-hover:text-blue-600"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2c1.7 0 3.3.6 4.5 1.6L12 10.1 7.5 5.6A8 8 0 0112 4zm-8 8c0-1.7.6-3.3 1.6-4.5L10.1 12l-4.5 4.5A8 8 0 014 12zm8 8a8 8 0 01-4.5-1.6L12 13.9l4.5 4.5A8 8 0 0112 20zm6.4-3.5L13.9 12l4.5-4.5A8 8 0 0120 12c0 1.7-.6 3.3-1.6 4.5z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Navigation
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a
                    href="/#about-me"
                    className="text-muted-foreground transition-colors hover:text-blue-600"
                  >
                    About
                  </a>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-muted-foreground transition-colors hover:text-blue-600"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resume"
                    className="text-muted-foreground transition-colors hover:text-blue-600"
                  >
                    Resume
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="text-muted-foreground transition-colors hover:text-blue-600"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Get in Touch
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    to="/contact"
                    className="text-muted-foreground transition-colors hover:text-blue-600"
                  >
                    Contact Form
                  </Link>
                </li>
                <li>
                  <a
                    href={(socials.linkedin as string) || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground transition-colors hover:text-blue-600"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={(socials.github as string) || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground transition-colors hover:text-blue-600"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@jirihermann.com"
                    className="text-muted-foreground transition-colors hover:text-blue-600"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 border-t border-gray-200/50 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
              <p>
                © {currentYear} Jiri Hermann. All rights reserved.
              </p>
              <p className="flex items-center gap-2">
                Built with
                <span className="inline-block animate-pulse text-red-500">♥</span>
                using React & TypeScript
              </p>
            </div>
          </div>
        </div>
      </LayoutWidth>
    </footer>
  )
}


import { Link } from '@tanstack/react-router'
import { Button } from '@heroui/react'
import { useState } from 'react'
import LayoutWidth from './LayoutWidth'

export default function TopNav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <LayoutWidth>
        <nav
          className="flex h-16 items-center justify-between gap-4"
          aria-label="Main"
        >
          <Link to="/" className="font-semibold tracking-tight">
            Jiri Hermann
          </Link>
          <div className="flex items-center gap-2 md:hidden">
            <Button
              aria-controls="mobile-menu"
              aria-expanded={open}
              onPress={() => setOpen((v) => !v)}
              size="sm"
            >
              {open ? 'Close' : 'Menu'}
            </Button>
          </div>
          <ul className="hidden items-center gap-6 text-sm md:flex">
            <li>
              <a
                href="/#about-me"
                className="hover:underline"
              >
                About
              </a>
            </li>
            <li>
              <Link
                to="/services"
                activeProps={{ className: 'font-semibold underline' }}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/resume"
                activeProps={{ className: 'font-semibold underline' }}
              >
                Resume
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                activeProps={{ className: 'font-semibold underline' }}
              >
                Blog
              </Link>
            </li>
            <li>
              <Button
                as={Link}
                to="/contact"
                color="primary"
                size="sm"
                className="font-medium"
              >
                Contact me
              </Button>
            </li>
          </ul>
        </nav>
        {open && (
          <div id="mobile-menu" className="md:hidden">
            <ul className="grid gap-2 py-2 text-sm">
              <li>
                <a
                  href="/#about-me"
                  onClick={() => setOpen(false)}
                  className="hover:underline"
                >
                  About
                </a>
              </li>
              <li>
                <Link
                  to="/services"
                  onClick={() => setOpen(false)}
                  activeProps={{ className: 'font-semibold underline' }}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/resume"
                  onClick={() => setOpen(false)}
                  activeProps={{ className: 'font-semibold underline' }}
                >
                  Resume
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  onClick={() => setOpen(false)}
                  activeProps={{ className: 'font-semibold underline' }}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Button
                  as={Link}
                  to="/contact"
                  color="primary"
                  size="sm"
                  className="font-medium"
                  onPress={() => setOpen(false)}
                >
                  Contact me
                </Button>
              </li>
            </ul>
          </div>
        )}
      </LayoutWidth>
    </header>
  )
}

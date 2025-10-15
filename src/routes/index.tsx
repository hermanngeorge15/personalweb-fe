import AppShell from '@/components/AppShell'
import { useEffect } from 'react'
import { SEO_DEFAULTS, setHead, setJsonLd } from '@/lib/seo'
import { MotionSection } from '@/components/MotionSection'
import { H1 } from '@/components/ui/Typography'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@heroui/react'
import { Link } from '@tanstack/react-router'
import { useMeta, usePosts } from '@/lib/queries'
import profilePhoto from '@/assets/images/profile.jpg'

function HomePage() {
  const meta = useMeta()
  const posts = usePosts({ limit: 3 })
  const socials = (() => {
    try {
      const parsed = meta.data?.socials
        ? JSON.parse(meta.data.socials)
        : undefined
      return parsed ?? {}
    } catch {
      return {}
    }
  })()
  useEffect(() => {
    setHead({
      title: `Home — ${SEO_DEFAULTS.siteName}`,
      description: SEO_DEFAULTS.description,
      canonical: `${SEO_DEFAULTS.siteUrl}/`,
      og: {
        title: `Home — ${SEO_DEFAULTS.siteName}`,
        url: `${SEO_DEFAULTS.siteUrl}/`,
        image: SEO_DEFAULTS.image,
        description: SEO_DEFAULTS.description,
      },
      twitter: {
        card: 'summary_large_image',
        title: `Home — ${SEO_DEFAULTS.siteName}`,
        description: SEO_DEFAULTS.description,
        image: SEO_DEFAULTS.image,
      },
    })
    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Jiří Hermann',
      url: location.origin,
      jobTitle: 'Backend Software Engineer',
      description:
        'Backend Software Engineer specializing in Kotlin, Java, Spring Boot, and scalable systems. Founder of Kotlin Server Squad.',
      knowsAbout: [
        'Kotlin',
        'Java',
        'Spring Boot',
        'Webflux',
        'Backend Development',
        'Microservices',
      ],
    })
  }, [])
  return (
    <AppShell path="Home / Overview">
      <div className="grid gap-12 md:gap-16 lg:gap-20">
        {/* Hero: left photo, right about me */}
        <MotionSection variant="fade-up">
          <div className="relative overflow-hidden rounded-3xl border bg-white/60 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur md:p-10">
            {/* decorative blobs */}
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/30 via-cyan-400/20 to-teal-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-tr from-green-400/20 via-emerald-400/20 to-teal-400/20 blur-3xl" />
            <div className="relative grid items-center gap-10 md:grid-cols-2">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-3 py-1 text-sm text-blue-700 ring-1 ring-inset ring-blue-500/20">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  Available for new projects
                </div>
                <H1>
                  <span className="bg-gradient-to-br from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-transparent">
                    Backend Software Engineer
                  </span>
                </H1>
                <div className="text-muted-foreground mt-2 text-base">
                  Based in Prague, CZ. Available for selected projects.
                </div>
                <div className="mt-4 grid gap-3">
                  <p className="text-base leading-relaxed text-gray-700">
                    Hi there! My name is{' '}
                    <strong className="text-gray-900">Jiří Hermann</strong>, and
                    I'm a{' '}
                    <strong className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      Backend Software Engineer
                    </strong>{' '}
                    and{' '}
                    <strong className="bg-gradient-to-r from-cyan-600 to-green-600 bg-clip-text text-transparent">
                      Community Builder
                    </strong>{' '}
                    passionate about designing clean, reliable, and scalable
                    systems.
                  </p>
                  <p className="text-base leading-relaxed text-gray-700">
                    I'm based in{' '}
                    <strong className="text-gray-900">
                      Prague, Czech Republic
                    </strong>
                    , and I love turning complex ideas into well-structured
                    backend solutions using{' '}
                    <span className="font-semibold text-blue-700">Kotlin</span>{' '}
                    and{' '}
                    <span className="font-semibold text-blue-700">Java</span>.
                    My work revolves around{' '}
                    <span className="font-medium text-gray-800">
                      Spring Boot
                    </span>
                    ,{' '}
                    <span className="font-medium text-gray-800">Micronaut</span>
                    ,{' '}
                    <span className="font-medium text-gray-800">
                      PostgreSQL
                    </span>
                    , <span className="font-medium text-gray-800">Redis</span>,{' '}
                    <span className="font-medium text-gray-800">Kafka</span>,
                    and{' '}
                    <span className="font-medium text-gray-800">Docker</span>,
                    always with a focus on clean architecture and automation.
                  </p>
                  <p className="text-base leading-relaxed text-gray-700">
                    Beyond engineering, I'm the founder of{' '}
                    <a
                      href="https://kotlinserversquad.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-gradient-to-r from-blue-600 via-cyan-600 to-green-600 bg-clip-text font-bold text-transparent transition-all hover:from-blue-700 hover:via-cyan-700 hover:to-green-700 hover:underline"
                    >
                      Kotlin Server Squad
                    </a>{' '}
                    — a community for developers who share a passion for
                    building, learning, and helping each other grow. It's not
                    just about Kotlin; it's about connecting people across the
                    JVM world and creating a space where ideas come to life.
                  </p>
                  <p className="text-base leading-relaxed text-gray-700">
                    Recently, I've been exploring{' '}
                    <span className="font-semibold text-cyan-700">
                      frontend development
                    </span>{' '}
                    with{' '}
                    <span className="font-medium text-gray-800">React</span> and{' '}
                    <span className="font-medium text-gray-800">
                      TypeScript
                    </span>{' '}
                    to better understand full-stack workflows and bridge the gap
                    between backend and user experience.
                  </p>
                  <p className="text-base leading-relaxed text-gray-700">
                    If you're looking for a dedicated engineer who builds with
                    purpose and fosters community, I'd love to connect and see
                    how we can collaborate.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/contact">
                    <Button
                      color="primary"
                      variant="solid"
                      className="shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                    >
                      Get in touch
                    </Button>
                  </Link>
                  <Link to="/resume">
                    <Button variant="bordered" className="hover:underline">
                      Resume
                    </Button>
                  </Link>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <a
                    href={
                      (socials.linkedin as string) ||
                      'https://www.linkedin.com/in/your-handle'
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 ring-1 ring-black/10 backdrop-blur transition hover:scale-105 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-cyan-500/10"
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
                    href={
                      (socials.github as string) ||
                      'https://github.com/your-handle'
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 ring-1 ring-black/10 backdrop-blur transition hover:scale-105 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-cyan-500/10"
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
                        d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.17-1.11-1.48-1.11-1.48-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05 .9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.13-4.55-5 0-1.11.39-2.02 1.03-2.73-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.04A9.27 9.27 0 0 1 12 7.49c.85 0 1.7.12 2.5.35 1.9-1.31 2.74-1.04 2.74-1.04 .55 1.41.2 2.45.1 2.71.64.71 1.02 1.62 1.02 2.73 0 3.88-2.34 4.73-4.57 4.99.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"
                      />
                    </svg>
                  </a>
                  <a
                    href={
                      (socials.instagram as string) ||
                      'https://instagram.com/your-handle'
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 ring-1 ring-black/10 backdrop-blur transition hover:scale-105 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-cyan-500/10"
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
                    href={
                      (socials.kotlinserversquad as string) ||
                      'https://kotlinserversquad.dev'
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Kotlin Server Squad website"
                    className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 ring-1 ring-black/10 backdrop-blur transition hover:scale-105 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-cyan-500/10"
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
              <div className="order-1 flex items-center justify-center md:order-2">
                <div className="relative mx-auto aspect-square h-[280px] w-[280px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg md:h-[360px] md:w-[360px] lg:h-[420px] lg:w-[420px]">
                  <img
                    src={profilePhoto}
                    alt="Jiří Hermann"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </MotionSection>

        {/* Core skillset */}
        <MotionSection variant="fade-up" id="core-skillset">
          <div className="relative overflow-hidden rounded-3xl border border-cyan-200/50 bg-white/40 p-8 shadow-lg ring-1 ring-cyan-500/10 backdrop-blur md:p-12">
            {/* Decorative gradient blob */}
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-gradient-to-tr from-cyan-400/20 via-teal-400/10 to-green-400/10 blur-3xl" />
            <div className="relative grid gap-6 md:gap-8">
              <div className="flex items-center gap-4">
                <H1 className="bg-gradient-to-br from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-transparent">
                  Core skillset
                </H1>
                <span className="h-[2px] flex-1 bg-gradient-to-r from-blue-500/50 via-cyan-500/30 to-transparent" />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: 'Backend Development',
                    body: 'CraftiDeveloping scalable services, integrations, and business logic',
                  },
                  {
                    title: 'Java / Kotlin',
                    body: 'Building clean, maintainable backend systems on the JVM',
                  },
                  {
                    title: 'Spring Boot / Webflux',
                    body: 'Extensive experience across Spring Boot and Webflux.',
                  },
                ].map((s) => (
                  <Card
                    key={s.title}
                    className="transition-all hover:-translate-y-[2px] hover:shadow-lg"
                  >
                    <CardBody className="relative">
                      <span className="pointer-events-none absolute -top-1 right-6 h-[2px] w-12 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-70" />
                      <div className="text-lg font-semibold">{s.title}</div>
                      <div className="text-muted-foreground">{s.body}</div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </MotionSection>

        {/* Latest blog posts */}
        <MotionSection variant="fade-up" id="latest-blog-posts">
          <div className="relative overflow-hidden rounded-3xl border border-green-200/50 bg-white/40 p-8 shadow-lg ring-1 ring-green-500/10 backdrop-blur md:p-12">
            {/* Decorative gradient blob */}
            <div className="pointer-events-none absolute -right-20 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-gradient-to-bl from-green-400/20 via-emerald-400/10 to-teal-400/10 blur-3xl" />
            <div className="relative grid gap-6 md:gap-8">
              <div className="flex items-center gap-4">
                <H1 className="bg-gradient-to-br from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-transparent">
                  Latest blog posts
                </H1>
                <span className="h-[2px] flex-1 bg-gradient-to-r from-blue-500/50 via-cyan-500/30 to-transparent" />
              </div>
              {posts.isLoading && <div>Loading…</div>}
              {posts.isError && <div>Failed to load posts.</div>}
              {posts.data && (
                <div className="grid gap-4 md:grid-cols-3">
                  {posts.data.items.map((p) => (
                    <Link
                      key={p.slug}
                      to="/blog/$slug"
                      params={{ slug: p.slug }}
                      className="group"
                    >
                      <Card className="h-full cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl">
                        <CardBody>
                          <div className="text-lg font-semibold transition-colors group-hover:text-blue-600">
                            {p.title}
                          </div>
                          <div className="text-muted-foreground mt-2">
                            {p.excerpt}
                          </div>
                          <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600">
                            Read more
                            <svg
                              className="h-4 w-4 transition-transform group-hover:translate-x-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </CardBody>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </MotionSection>
      </div>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: HomePage,
})

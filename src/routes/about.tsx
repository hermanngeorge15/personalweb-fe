import AppShell from '@/components/AppShell'
import { useEffect } from 'react'
import { SEO_DEFAULTS, setHead, setJsonLd } from '@/lib/seo'
import { createFileRoute } from '@tanstack/react-router'

function AboutPage() {
  useEffect(() => {
    const description =
      'Learn about Jiří Hermann - Backend Software Engineer from Prague, Czech Republic. Specializing in Kotlin, Java, Spring Boot, and building scalable backend systems. Founder of Kotlin Server Squad community.'
    setHead({
      title: `About — ${SEO_DEFAULTS.siteName}`,
      description: description,
      canonical: `${SEO_DEFAULTS.siteUrl}/about`,
      og: {
        title: `About — ${SEO_DEFAULTS.siteName}`,
        url: `${SEO_DEFAULTS.siteUrl}/about`,
        image: SEO_DEFAULTS.image,
        description: description,
      },
      twitter: {
        card: 'summary',
        title: `About — ${SEO_DEFAULTS.siteName}`,
        description: description,
        image: SEO_DEFAULTS.image,
      },
    })
    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      url: location.href,
    })
  }, [])
  return (
    <AppShell path="About">
      <section className="relative overflow-hidden rounded-3xl border border-blue-200/50 bg-white/60 p-6 shadow-xl shadow-blue-500/5 ring-1 ring-blue-100/50 backdrop-blur md:p-10">
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/30 via-cyan-400/20 to-teal-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-tr from-green-400/20 via-emerald-400/20 to-cyan-400/20 blur-3xl" />
        <div className="prose prose-lg relative max-w-none">
          <h1 className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
            About
          </h1>
          <p className="text-lg leading-relaxed text-gray-700">
            Hi there! My name is{' '}
            <strong className="text-gray-900">Jiří Hermann</strong>, and I'm a{' '}
            <strong className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Backend Software Engineer
            </strong>{' '}
            and{' '}
            <strong className="bg-gradient-to-r from-cyan-600 to-green-600 bg-clip-text text-transparent">
              Community Builder
            </strong>{' '}
            passionate about designing clean, reliable, and scalable systems.
          </p>
          <p className="leading-relaxed text-gray-700">
            I'm based in{' '}
            <strong className="text-gray-900">Prague, Czech Republic</strong>,
            and I love turning complex ideas into well-structured backend
            solutions using{' '}
            <span className="font-semibold text-blue-700">Kotlin</span> and{' '}
            <span className="font-semibold text-blue-700">Java</span>. My work
            revolves around{' '}
            <span className="font-medium text-gray-800">Spring Boot</span>,{' '}
            <span className="font-medium text-gray-800">Micronaut</span>,{' '}
            <span className="font-medium text-gray-800">PostgreSQL</span>,{' '}
            <span className="font-medium text-gray-800">Redis</span>,{' '}
            <span className="font-medium text-gray-800">Kafka</span>, and{' '}
            <span className="font-medium text-gray-800">Docker</span>, always
            with a focus on clean architecture and automation.
          </p>
          <p className="leading-relaxed text-gray-700">
            Beyond engineering, I'm the founder of{' '}
            <a
              href="https://kotlinserversquad.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-blue-600 via-cyan-600 to-green-600 bg-clip-text font-bold text-transparent transition-all hover:from-blue-700 hover:via-cyan-700 hover:to-green-700 hover:underline"
            >
              Kotlin Server Squad
            </a>{' '}
            — a community for developers who share a passion for building,
            learning, and helping each other grow. It's not just about Kotlin;
            it's about connecting people across the JVM world and creating a
            space where ideas come to life.
          </p>
          <p className="leading-relaxed text-gray-700">
            Recently, I've been exploring{' '}
            <span className="font-semibold text-cyan-700">
              frontend development
            </span>{' '}
            with <span className="font-medium text-gray-800">React</span> and{' '}
            <span className="font-medium text-gray-800">TypeScript</span> to
            better understand full-stack workflows and bridge the gap between
            backend and user experience.
          </p>
          <div className="mt-8 rounded-2xl border border-blue-200/70 bg-gradient-to-br from-blue-50/80 via-cyan-50/60 to-green-50/80 p-6 shadow-lg shadow-blue-500/5">
            <p className="mb-0 text-base leading-relaxed text-gray-800">
              <strong className="bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-lg text-transparent">
                If you're looking for a dedicated engineer who builds with
                purpose and fosters community,
              </strong>{' '}
              I'd love to connect and see how we can collaborate.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: AboutPage,
})

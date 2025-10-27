import AppShell from '@/components/AppShell'
import { ContactForm } from '@/components/ContactForm'
import { useEffect } from 'react'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'
import { createFileRoute } from '@tanstack/react-router'

function ContactPage() {
  useEffect(() => {
    setHead({
      title: `Contact — ${SEO_DEFAULTS.siteName}`,
      description: 'Get in touch with me for collaborations, questions, or just to say hi.',
      canonical: `${SEO_DEFAULTS.siteUrl}/contact`,
      og: {
        title: `Contact — ${SEO_DEFAULTS.siteName}`,
        url: `${SEO_DEFAULTS.siteUrl}/contact`,
        image: SEO_DEFAULTS.image,
        description: 'Get in touch with me for collaborations, questions, or just to say hi.',
      },
      twitter: {
        card: 'summary',
        title: `Contact — ${SEO_DEFAULTS.siteName}`,
        description: 'Get in touch with me for collaborations, questions, or just to say hi.',
        image: SEO_DEFAULTS.image,
      },
    })
  }, [])

  return (
    <AppShell path="Contact">
      {/* Hero Header */}
      <div className="mb-12 text-center">
        <h1 className="bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
          Get in Touch
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Have a project in mind? Let&apos;s build something great together.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
        {/* Left Column - Contact Info */}
        <div className="space-y-8 lg:col-span-2">
          {/* Quick Contact Cards */}
          <div className="space-y-4">
            {/* Email Card */}
            <a
              href="mailto:me@jirihermann.com"
              className="group block rounded-2xl border border-gray-200 bg-white/60 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="mt-1 text-sm text-blue-600 group-hover:underline">
                    me@jirihermann.com
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Best for detailed inquiries
                  </p>
                </div>
              </div>
            </a>

            {/* LinkedIn Card */}
            <a
              href="https://www.linkedin.com/in/ji%C5%99%C3%AD-hermann-8926a173/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-gray-200 bg-white/60 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 text-white shadow-lg">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zM8 8h3.8v2.05h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.15V23h-4v-7.5c0-1.79-.03-4.1-2.5-4.1-2.5 0-2.88 1.95-2.88 3.98V23h-4V8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">LinkedIn</h3>
                  <p className="mt-1 text-sm text-blue-600 group-hover:underline">
                    Connect with me
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Professional networking
                  </p>
                </div>
              </div>
            </a>

            {/* GitHub Card */}
            <a
              href="https://github.com/hermanngeorge15"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-gray-200 bg-white/60 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-600 text-white shadow-lg">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.17-1.11-1.48-1.11-1.48-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.13-4.55-5 0-1.11.39-2.02 1.03-2.73-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.04A9.27 9.27 0 0 1 12 7.49c.85 0 1.7.12 2.5.35 1.9-1.31 2.74-1.04 2.74-1.04.55 1.41.2 2.45.1 2.71.64.71 1.02 1.62 1.02 2.73 0 3.88-2.34 4.73-4.57 4.99.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">GitHub</h3>
                  <p className="mt-1 text-sm text-blue-600 group-hover:underline">
                    View my projects
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Code & contributions
                  </p>
                </div>
              </div>
            </a>
          </div>

          {/* Additional Info */}
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 p-6 backdrop-blur">
            <h3 className="font-semibold text-gray-900">Response Time</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              I typically respond within 24-48 hours. For urgent matters, please mention it in
              your message.
            </p>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white/60 p-8 shadow-sm backdrop-blur">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: ContactPage,
})

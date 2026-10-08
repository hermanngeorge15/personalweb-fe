import type { ReactNode } from 'react'
import AppShell from '@/components/AppShell'
import { ContactForm } from '@/components/ContactForm'
import { useEffect } from 'react'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'
import { SOCIAL_LINKS } from '@/config/site'
import { GitHubIcon, LinkedInIcon, MailIcon } from '@/components/icons'

const section = 'relative mx-auto px-4 sm:px-8'

function ContactCard({
  href,
  external = false,
  label,
  title,
  tone,
  icon,
}: {
  href: string
  external?: boolean
  label: string
  title: string
  tone: 'a' | 'b'
  icon: ReactNode
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="border-line bg-card hover:border-line-strong group flex items-center gap-4 rounded-2xl border p-5 transition-colors"
    >
      <span
        aria-hidden="true"
        className={`flex size-11 shrink-0 items-center justify-center rounded-[10px] ${
          tone === 'a'
            ? 'bg-brand-a/10 text-brand-a'
            : 'bg-brand-b/10 text-brand-b'
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="text-faint block text-[13px]">{label}</span>
        <span className="text-ink mt-0.5 block text-base font-medium break-words group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
          {title}
        </span>
      </span>
    </a>
  )
}

function ContactPage() {
  useEffect(() => {
    setHead({
      title: `Contact — ${SEO_DEFAULTS.siteName}`,
      description:
        'Get in touch with me for collaborations, questions, or just to say hi.',
      canonical: `${SEO_DEFAULTS.siteUrl}/contact`,
      og: {
        title: `Contact — ${SEO_DEFAULTS.siteName}`,
        url: `${SEO_DEFAULTS.siteUrl}/contact`,
        image: SEO_DEFAULTS.image,
        description:
          'Get in touch with me for collaborations, questions, or just to say hi.',
      },
      twitter: {
        card: 'summary',
        title: `Contact — ${SEO_DEFAULTS.siteName}`,
        description:
          'Get in touch with me for collaborations, questions, or just to say hi.',
        image: SEO_DEFAULTS.image,
      },
    })
  }, [])

  return (
    <AppShell path="Contact" fullBleed>
      <div
        aria-hidden="true"
        className="bg-glow-hero pointer-events-none absolute -top-[260px] left-1/2 h-[640px] w-[1100px] -translate-x-1/2"
      />

      {/* Hero */}
      <section
        className={`${section} max-w-[1200px] pt-16 pb-8 text-center sm:pt-[88px] sm:pb-10`}
      >
        <span className="border-line-strong bg-chip/60 text-body inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px]">
          <span
            aria-hidden="true"
            className="bg-brand-b size-1.5 rounded-full"
          />
          I typically respond within 24–48 hours
        </span>
        <h1 className="text-heading mx-auto mt-6 max-w-[760px] text-[40px] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-[52px] lg:text-[58px]">
          Get in <span className="text-brand-gradient">Touch</span>
        </h1>
        <p className="text-muted mx-auto mt-5 max-w-[560px] text-[17px] leading-[1.55] sm:text-[19px]">
          Have a project in mind? Let&apos;s build something great together.
        </p>
      </section>

      {/* Contact options + form */}
      <section
        className={`${section} flex max-w-[1080px] flex-wrap items-start gap-6 pt-4 pb-24 sm:pb-[104px]`}
      >
        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-3">
          <ContactCard
            href="mailto:me@jirihermann.com"
            label="Email · best for detailed inquiries"
            title="me@jirihermann.com"
            tone="a"
            icon={<MailIcon size={20} />}
          />
          {SOCIAL_LINKS.linkedin && (
            <ContactCard
              href={SOCIAL_LINKS.linkedin}
              external
              label="LinkedIn · professional networking"
              title="Connect with me"
              tone="a"
              icon={<LinkedInIcon size={20} />}
            />
          )}
          {SOCIAL_LINKS.github && (
            <ContactCard
              href={SOCIAL_LINKS.github}
              external
              label="GitHub · code & contributions"
              title="View my projects"
              tone="b"
              icon={<GitHubIcon size={20} />}
            />
          )}
          {SOCIAL_LINKS.kotlinServerSquad && (
            <ContactCard
              href={SOCIAL_LINKS.kotlinServerSquad}
              external
              label="Community"
              title="Kotlin Server Squad"
              tone="b"
              icon={<span className="text-[13px] font-bold">KSS</span>}
            />
          )}
          <p className="text-faint mt-2 px-1 text-sm leading-relaxed">
            For urgent matters, please mention it in your message.
          </p>
        </div>

        <div className="border-line bg-cta-glow min-w-0 flex-[999_1_460px] rounded-[20px] border p-5 sm:p-8">
          <h2 className="text-heading mb-5 text-[22px] font-semibold tracking-[-0.015em]">
            Send a Message
          </h2>
          <ContactForm />
        </div>
      </section>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: ContactPage,
})

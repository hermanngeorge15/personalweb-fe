import AppShell from '@/components/AppShell'
import { useEffect, useMemo, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'
import { SEO_DEFAULTS, setHead, setJsonLd } from '@/lib/seo'
import {
  useResumeEducation,
  useResumeLanguages,
  useResumeProjects,
} from '@/lib/queries'
import { SOCIAL_LINKS } from '@/config/site'
import profilePhoto from '@/assets/images/profile.jpg'
import { PostCover } from '@/components/blog/PostCover'
import {
  PageGlow,
  SectionHeading,
  primaryButtonClass,
  secondaryButtonClass,
  sectionClass,
} from '@/components/home/Section'
import {
  buildPath,
  monthYearOf,
  useCurrentRole,
} from '@/components/home/resume'

function FactCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border-line bg-subtle rounded-xl border p-4">
      <div className="text-faint text-[13px]">{label}</div>
      <div className="text-ink mt-1 text-[15px] font-medium">{value}</div>
    </div>
  )
}

function Languages() {
  const { data, isLoading, isError } = useResumeLanguages()
  if (isError) return null
  const text = (data ?? [])
    .filter((language) => language.name)
    .map((language) =>
      language.level
        ? `${language.name} (${language.level.toLowerCase()})`
        : language.name,
    )
    .join(' · ')
  if (!isLoading && !text) return null
  return (
    <FactCard
      label="Speaks"
      value={
        isLoading ? (
          <span
            aria-label="Loading"
            className="bg-chip inline-block h-5 w-32 animate-pulse rounded motion-reduce:animate-none"
          />
        ) : (
          text
        )
      }
    />
  )
}

const strong = 'text-heading font-semibold'

/** Centred page header in the blog's style: pill label, gradient headline. */
function Hero() {
  return (
    <section
      className={`${sectionClass} pt-16 pb-4 text-center sm:pt-[88px] sm:pb-6`}
    >
      <span className="border-line-strong bg-chip/60 text-body inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px]">
        <span aria-hidden="true" className="bg-brand-b size-1.5 rounded-full" />
        About · Prague, Czech Republic
      </span>
      <h1 className="text-heading mx-auto mt-6 max-w-[900px] text-[40px] leading-[1.04] font-semibold tracking-[-0.035em] sm:text-[52px] lg:text-[64px]">
        Hi, I&apos;m Jiří.{' '}
        <span className="text-brand-gradient">
          Backend engineer and community builder.
        </span>
      </h1>
    </section>
  )
}

function Intro() {
  return (
    <section
      className={`${sectionClass} grid gap-10 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:items-start lg:gap-16`}
    >
      <div className="order-2 lg:order-none">
        <img
          src={profilePhoto}
          alt="Jiří Hermann with his wire-haired dachshund"
          decoding="async"
          className="border-window-line block aspect-square w-full rounded-[20px] border object-cover object-[50%_30%] sm:aspect-[4/5] sm:max-w-[400px] sm:rounded-3xl"
        />
        <div className="mt-5 grid grid-cols-1 gap-3 sm:max-w-[400px] sm:grid-cols-2">
          <FactCard label="Based in" value="Prague, Czech Republic" />
          <Languages />
        </div>
      </div>

      <div className="order-1 min-w-0 lg:order-none">
        <div className="text-body max-w-[720px] space-y-5 text-[17px] leading-[1.75] sm:text-lg">
          <p>
            My name is <strong className={strong}>Jiří Hermann</strong>, and
            I&apos;m a{' '}
            <strong className={strong}>Backend Software Engineer</strong> and{' '}
            <strong className={strong}>Community Builder</strong> passionate
            about designing clean, reliable, and scalable systems.
          </p>
          <p>
            I&apos;m based in{' '}
            <strong className={strong}>Prague, Czech Republic</strong>, and I
            love turning complex ideas into well-structured backend solutions
            using <strong className={strong}>Kotlin</strong> and{' '}
            <strong className={strong}>Java</strong>. My work revolves around
            Spring Boot, Micronaut, PostgreSQL, Redis, Kafka, and Docker, always
            with a focus on clean architecture and automation.
          </p>
          <p>
            Beyond engineering, I&apos;m the founder of{' '}
            <a
              href={SOCIAL_LINKS.kotlinServerSquad}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:text-ink font-medium underline decoration-1 underline-offset-[3px]"
            >
              Kotlin Server Squad
            </a>{' '}
            — a community for developers who share a passion for building,
            learning, and helping each other grow. It&apos;s not just about
            Kotlin; it&apos;s about connecting people across the JVM world and
            creating a space where ideas come to life.
          </p>
          <p>
            Recently, I&apos;ve been exploring{' '}
            <strong className={strong}>frontend development</strong> with React
            and TypeScript to better understand full-stack workflows and bridge
            the gap between backend and user experience.
          </p>
        </div>
      </div>
    </section>
  )
}

/** Same frame as the blog's post cards. */
const nowCardClass =
  'border-line bg-card hover:border-line-strong group flex flex-col overflow-hidden rounded-2xl border transition-colors'

/** Card body under a blog-style generated cover: `cover` names the window's path and lines. */
function NowCard({
  label,
  title,
  body,
  cover,
}: {
  label: string
  title: string
  body: string
  cover: { slug: string; path: string; lines: string[] }
}) {
  return (
    <>
      <PostCover
        post={{ slug: cover.slug, tags: cover.lines }}
        path={cover.path}
        size="card"
      />
      <div className="flex flex-1 flex-col p-6">
        <span className="text-faint text-[13px]">{label}</span>
        <h3 className="text-heading mt-2.5 text-[19px] leading-tight font-semibold tracking-[-0.015em] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
          {title}
        </h3>
        <p className="text-muted mt-2.5 text-[15px] leading-relaxed">{body}</p>
      </div>
    </>
  )
}

function Now() {
  const role = useCurrentRole()
  const since = monthYearOf(role?.startAt)
  return (
    <section
      aria-labelledby="now-title"
      className={`${sectionClass} pt-16 sm:pt-24`}
    >
      <SectionHeading
        eyebrow="Now"
        title="What I’m working on"
        titleId="now-title"
      />
      <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-5 sm:mt-7">
        {role && (
          <Link to="/resume" className={nowCardClass}>
            <NowCard
              label={since ? `Day job · since ${since}` : 'Day job'}
              title={[role.projectName, role.company]
                .filter(Boolean)
                .join(' at ')}
              body={role.description ?? ''}
              cover={{
                slug: 'day-job',
                path: `~/now/${(role.company ?? 'day-job').toLowerCase()}`,
                lines: role.techStack ?? [],
              }}
            />
          </Link>
        )}
        {SOCIAL_LINKS.kotlinServerSquad && (
          <a
            href={SOCIAL_LINKS.kotlinServerSquad}
            target="_blank"
            rel="noopener noreferrer"
            className={nowCardClass}
          >
            <NowCard
              label="Community"
              title="Founder, Kotlin Server Squad"
              body="A community for developers who share a passion for building, learning, and helping each other grow."
              cover={{
                slug: 'kotlin-server-squad',
                path: '~/community/kotlin-server-squad',
                lines: ['kotlin', 'jvm'],
              }}
            />
          </a>
        )}
        <Link to="/projects" className={nowCardClass}>
          <NowCard
            label="Open source"
            title="UnityInFlow"
            body="injection-scanner: a static scanner that catches prompt injection before it reaches your model."
            cover={{
              slug: 'unityinflow',
              path: '~/projects/unityinflow',
              lines: ['injection-scanner'],
            }}
          />
        </Link>
        <Link to="/blog" className={nowCardClass}>
          <NowCard
            label="Writing"
            title="Securing AI agents"
            body="A weekly series on prompt injection, SSRF and agent tooling."
            cover={{
              slug: 'writing',
              path: '~/blog',
              lines: ['prompt-injection', 'ssrf'],
            }}
          />
        </Link>
      </div>
    </section>
  )
}

function Path() {
  const projects = useResumeProjects()
  const education = useResumeEducation()
  const entries = useMemo(
    () => buildPath(projects.data ?? [], education.data ?? []),
    [projects.data, education.data],
  )
  const loading = projects.isLoading || education.isLoading
  if (!loading && entries.length === 0) return null

  return (
    <section
      aria-labelledby="path-title"
      className={`${sectionClass} pt-16 sm:pt-24`}
    >
      <SectionHeading
        eyebrow="Path"
        title="From banking backends to agent tooling"
        titleId="path-title"
        action={
          <Link
            to="/resume"
            className="text-brand-a inline-flex min-h-11 items-center text-[15px] font-medium hover:underline hover:underline-offset-4"
          >
            Full resume →
          </Link>
        }
      />
      {loading ? (
        <div
          aria-busy="true"
          aria-label="Loading"
          className="border-line-strong mt-8 max-w-[760px] space-y-7 border-l pl-7"
        >
          {[0, 1, 2].map((key) => (
            <div
              key={key}
              className="bg-chip h-11 w-3/4 animate-pulse rounded-lg motion-reduce:animate-none"
            />
          ))}
        </div>
      ) : (
        <ol className="border-line-strong mt-8 max-w-[760px] space-y-7 border-l pl-7">
          {entries.map((entry) => (
            <li key={entry.key} className="relative">
              <span
                aria-hidden="true"
                className={twMerge(
                  'absolute top-[7px] -left-[33px] size-[9px] rounded-full',
                  entry.current
                    ? 'bg-brand-gradient top-1.5 -left-[34px] size-[11px]'
                    : 'bg-window-dot',
                )}
              />
              <div className="text-faint text-[13px]">{entry.years}</div>
              <div className="text-heading mt-1 text-[17px] font-semibold">
                {entry.title}
              </div>
              {entry.detail && (
                <div className="text-muted mt-1 text-[15px] leading-[1.55]">
                  {entry.detail}
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

function AboutCta() {
  return (
    <section className={`${sectionClass} pt-16 pb-16 sm:pt-24 sm:pb-[104px]`}>
      <div className="border-line bg-cta-glow flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[20px] border p-6 sm:rounded-3xl sm:p-12">
        <div className="flex-[1_1_420px]">
          <h2 className="text-heading text-[24px] leading-[1.2] font-semibold tracking-[-0.02em] sm:text-[30px]">
            Looking for a dedicated engineer who builds with purpose and fosters
            community?
          </h2>
          <p className="text-muted mt-2.5 text-base leading-[1.6]">
            I&apos;d love to connect and see how we can collaborate.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
          <Link to="/contact" className={primaryButtonClass}>
            Get in touch
          </Link>
          <Link to="/resume" className={secondaryButtonClass}>
            Resume
          </Link>
        </div>
      </div>
    </section>
  )
}

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
    <AppShell path="About" fullBleed>
      <PageGlow />
      <Hero />
      <Intro />
      <Now />
      <Path />
      <AboutCta />
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: AboutPage,
})

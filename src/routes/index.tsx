import AppShell from '@/components/AppShell'
import { useEffect, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'
import { SEO_DEFAULTS, setHead, setJsonLd } from '@/lib/seo'
import { usePosts } from '@/lib/queries'
import { sortByPublishedDesc } from '@/lib/blog-utils'
import { SOCIAL_LINKS } from '@/config/site'
import { FEATURED_PROJECT_NAMES, PROJECTS } from '@/config/projects'
import profilePhoto from '@/assets/images/profile.jpg'
import {
  BoltIcon,
  ChartIcon,
  CodeIcon,
  DatabaseIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  LockIcon,
  PlugIcon,
} from '@/components/icons'
import {
  PageGlow,
  SectionHeading,
  primaryButtonClass,
  secondaryButtonClass,
  sectionClass,
  sectionLinkClass,
} from '@/components/home/Section'
import { ProjectCard } from '@/components/home/ProjectCard'
import { HomePostCard } from '@/components/home/HomePostCard'
import { LEARN_KOTLIN_ENABLED } from '@/config/features'

const socialButtonClass =
  'border-line-strong text-body hover:bg-chip hover:text-ink flex size-11 items-center justify-center rounded-[10px] border transition-colors'

function Hero() {
  return (
    <section
      className={`${sectionClass} flex flex-wrap items-center gap-x-16 gap-y-7 pt-8 sm:pt-[88px] sm:pb-16`}
    >
      <div className="min-w-0 flex-[999_1_560px]">
        <span className="border-line-strong bg-chip/60 text-body inline-flex items-center gap-2 rounded-full border px-3 py-[5px] text-[13px] sm:px-3.5 sm:py-1.5">
          <span
            aria-hidden="true"
            className="bg-brand-b ring-brand-b/20 size-[7px] shrink-0 rounded-full ring-4"
          />
          Available for selected projects · Prague, CZ
        </span>
        <h1 className="text-heading mt-[18px] text-[38px] leading-[1.06] font-semibold tracking-[-0.03em] sm:mt-6 sm:text-[52px] sm:leading-[1.04] sm:tracking-[-0.035em] lg:text-[62px]">
          Backend engineer. <br className="hidden sm:block" />
          Building secure tooling{' '}
          <span className="text-brand-gradient">for AI agents.</span>
        </h1>
        <p className="text-muted mt-4 max-w-[580px] text-base leading-[1.6] sm:mt-6 sm:text-[19px]">
          I&apos;m Jiří Hermann — I design clean, reliable, scalable backend
          systems in Kotlin and Java, founded the Kotlin Server Squad community,
          and build open-source tools that keep AI agents safe.{' '}
          <Link
            to="/about"
            className="text-link underline decoration-1 underline-offset-[3px]"
          >
            More about me
          </Link>
        </p>
        <div className="mt-[22px] flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <Link to="/contact" className={primaryButtonClass}>
            Get in touch
          </Link>
          <Link to="/resume" className={secondaryButtonClass}>
            Resume
          </Link>
          <span
            aria-hidden="true"
            className="bg-line-strong mx-2 hidden h-7 w-px sm:block"
          />
          <div className="mt-2 flex gap-3 sm:mt-0">
            {SOCIAL_LINKS.linkedin && (
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={socialButtonClass}
              >
                <LinkedInIcon size={17} />
              </a>
            )}
            {SOCIAL_LINKS.github && (
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className={socialButtonClass}
              >
                <GitHubIcon size={17} />
              </a>
            )}
            {SOCIAL_LINKS.instagram && (
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={socialButtonClass}
              >
                <InstagramIcon size={17} />
              </a>
            )}
            {SOCIAL_LINKS.kotlinServerSquad && (
              <a
                href={SOCIAL_LINKS.kotlinServerSquad}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Kotlin Server Squad website"
                className={twMerge(
                  socialButtonClass,
                  'w-auto px-3.5 text-[13px] font-medium',
                )}
              >
                KSS
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-[1_1_380px] justify-center">
        <div className="relative w-full sm:w-[400px] sm:max-w-full">
          <div
            aria-hidden="true"
            className="bg-brand-gradient absolute -inset-0.5 hidden rounded-[26px] opacity-35 blur-[18px] sm:block"
          />
          <img
            src={profilePhoto}
            alt="Jiří Hermann with his wire-haired dachshund"
            decoding="async"
            className="border-window-line relative block aspect-square w-full rounded-[20px] border object-cover object-[50%_30%] sm:aspect-[4/5] sm:rounded-3xl"
          />
        </div>
      </div>
    </section>
  )
}

function Tools() {
  const featured = FEATURED_PROJECT_NAMES.map((name) =>
    PROJECTS.find((project) => project.name === name),
  ).filter((project) => project !== undefined)

  return (
    <section
      aria-labelledby="tools-title"
      className={`${sectionClass} pt-12 sm:pt-[104px]`}
    >
      <SectionHeading
        eyebrow="Open source · UnityInFlow"
        title="Tools I build for the AI agent stack"
        titleId="tools-title"
        action={
          <Link
            to="/projects"
            className={twMerge(sectionLinkClass, 'hidden sm:inline-flex')}
          >
            Projects →
          </Link>
        }
      />
      <div className="-mx-4 mt-[18px] flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1.5 sm:mx-0 sm:mt-8 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0">
        {featured.map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
            variant="compact"
            className="flex-[0_0_270px] snap-start sm:flex-auto"
          />
        ))}
      </div>
      <Link
        to="/projects"
        className={twMerge(sectionLinkClass, 'mt-2 sm:hidden')}
      >
        Projects →
      </Link>
    </section>
  )
}

const SKILLS = [
  {
    title: 'Kotlin & Spring Boot',
    body: 'Expert in building scalable backend services with Kotlin, Spring Boot, Coroutines, and reactive programming',
    Icon: CodeIcon,
    tone: 'text-brand-a',
  },
  {
    title: 'System Integration & APIs',
    body: 'Building seamless integrations with banking systems, payment gateways, and third-party services via REST and messaging',
    Icon: PlugIcon,
    tone: 'text-brand-a',
  },
  {
    title: 'Database Design',
    body: 'Working with PostgreSQL, MongoDB, Cassandra, Oracle, Redis, and Elasticsearch for diverse data needs',
    Icon: DatabaseIcon,
    tone: 'text-brand-a',
  },
  {
    title: 'API Development',
    body: 'Building robust REST APIs, PSD2 integrations, and banking-grade applications with high reliability',
    Icon: LockIcon,
    tone: 'text-brand-b',
  },
  {
    title: 'Observability & Monitoring',
    body: 'Implementing comprehensive monitoring with Grafana, Prometheus, Loki, ELK stack, and Kibana for system insights',
    Icon: ChartIcon,
    tone: 'text-brand-b',
  },
  {
    title: 'Event-Driven Systems',
    body: 'Implementing messaging solutions with Kafka, RabbitMQ, and asynchronous processing patterns',
    Icon: BoltIcon,
    tone: 'text-brand-b',
  },
] as const

function CoreSkillset() {
  return (
    <section
      id="core-skillset"
      aria-labelledby="core-skillset-title"
      className={`${sectionClass} scroll-mt-24 pt-12 sm:pt-[104px]`}
    >
      <SectionHeading
        eyebrow="Core skillset"
        title="Banking-grade backends, built to be observed"
        titleId="core-skillset-title"
      />
      <ul className="bg-line border-line mt-[18px] grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-px overflow-hidden rounded-2xl border sm:mt-8">
        {SKILLS.map(({ title, body, Icon, tone }) => (
          <li key={title} className="bg-page p-6 sm:p-7">
            <Icon size={22} className={tone} />
            <h3 className="text-heading mt-4 text-[17px] font-semibold">
              {title}
            </h3>
            <p className="text-muted mt-2 text-sm leading-[1.6]">{body}.</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function LatestPosts() {
  const { data, isLoading, isError } = usePosts({ limit: 4 })
  const posts = useMemo(
    () => (data ? sortByPublishedDesc(data.items) : []),
    [data],
  )
  return (
    <section
      id="latest-blog-posts"
      aria-labelledby="latest-blog-posts-title"
      className={`${sectionClass} scroll-mt-24 pt-12 sm:pt-[104px]`}
    >
      <SectionHeading
        eyebrow="Writing"
        title="Latest from the blog"
        titleId="latest-blog-posts-title"
        action={
          <Link to="/blog" className={sectionLinkClass}>
            All posts →
          </Link>
        }
      />
      <div className="mt-[18px] sm:mt-8">
        {isLoading && (
          <div
            aria-busy="true"
            aria-label="Loading posts"
            className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,440px),1fr))] gap-3 sm:gap-5"
          >
            {[0, 1].map((key) => (
              <div
                key={key}
                className="border-line bg-card h-[90px] animate-pulse rounded-2xl border motion-reduce:animate-none sm:h-[162px]"
              />
            ))}
          </div>
        )}
        {isError && (
          <p className="border-line bg-subtle text-faint rounded-2xl border px-6 py-10 text-center text-sm">
            Failed to load posts. Please try again later.
          </p>
        )}
        {data && posts.length === 0 && (
          <p className="border-line bg-subtle text-faint rounded-2xl border px-6 py-10 text-center text-sm">
            No posts yet — check back soon.
          </p>
        )}
        {posts.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,440px),1fr))] gap-3 sm:gap-5">
            {posts.map((post) => (
              <HomePostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

const communityCardClass =
  'border-line bg-card hover:border-line-strong group flex flex-col rounded-2xl border p-6 transition-colors sm:p-7'

function CommunityCard({
  badge,
  badgeFilled = false,
  title,
  body,
  cta,
}: {
  badge: string
  badgeFilled?: boolean
  title: string
  body: string
  cta: string
}) {
  return (
    <>
      <span
        className={`self-start rounded-full px-2.5 py-1 text-xs font-medium ${
          badgeFilled
            ? 'bg-brand-gradient-x text-on-brand'
            : 'border-line-strong text-body border'
        }`}
      >
        {badge}
      </span>
      <h3 className="text-heading mt-[18px] text-xl font-semibold group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
        {title}
      </h3>
      <p className="text-muted mt-2.5 flex-1 text-[15px] leading-[1.6]">
        {body}
      </p>
      <span className="text-brand-a mt-[18px] text-sm font-medium">{cta}</span>
    </>
  )
}

function Community() {
  return (
    <section
      aria-labelledby="community-title"
      className={`${sectionClass} pt-12 sm:pt-[104px]`}
    >
      <SectionHeading
        eyebrow="Community & teaching"
        title="Helping JVM developers learn Kotlin"
        titleId="community-title"
      />
      <div className="mt-[18px] grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-3 sm:mt-8 sm:gap-5">
        {SOCIAL_LINKS.kotlinServerSquad && (
          <a
            href={SOCIAL_LINKS.kotlinServerSquad}
            target="_blank"
            rel="noopener noreferrer"
            className={communityCardClass}
          >
            <CommunityCard
              badge="Community"
              badgeFilled
              title="Kotlin Server Squad"
              body="A community for developers who share a passion for building, learning, and helping each other grow — across the whole JVM world."
              cta="kotlinserversquad.com ↗"
            />
          </a>
        )}
        {LEARN_KOTLIN_ENABLED && (
          <Link to="/learn-kotlin" className={communityCardClass}>
            <CommunityCard
              badge="Interactive course"
              title="Learn Kotlin"
              body="Interactive Kotlin learning for experienced developers — tailored paths for Java and C# developers, with a learning mind map."
              cta="Start learning →"
            />
          </Link>
        )}
        <Link to="/dispatchers" className={communityCardClass}>
          <CommunityCard
            badge="Interactive tool"
            title="Coroutine Dispatcher Visualizer"
            body="Watch worker threads, global queues and work stealing in real time — from basics to advanced pitfalls."
            cta="Open the visualizer →"
          />
        </Link>
      </div>
    </section>
  )
}

function ContactCta() {
  return (
    <section
      className={`${sectionClass} pt-12 pb-12 sm:pt-[104px] sm:pb-[104px]`}
    >
      <div className="border-line bg-cta-glow relative overflow-hidden rounded-[18px] border px-5 py-7 text-center sm:rounded-3xl sm:px-12 sm:py-16">
        <h2 className="text-heading mx-auto max-w-[700px] text-[26px] leading-[1.15] font-semibold tracking-[-0.02em] sm:text-[42px] sm:leading-[1.1] sm:tracking-[-0.03em]">
          Have a project in mind?{' '}
          <span className="hidden sm:inline">
            Let&apos;s build something great together.
          </span>
        </h2>
        <p className="text-muted mx-auto mt-2.5 max-w-[520px] text-[15px] leading-[1.6] sm:mt-4 sm:text-[17px]">
          I typically respond within 24–48 hours.
        </p>
        <div className="mt-[18px] flex flex-col justify-center gap-3 sm:mt-8 sm:flex-row">
          <Link to="/contact" className={primaryButtonClass}>
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  )
}

function HomePage() {
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
    <AppShell path="Home / Overview" fullBleed>
      <PageGlow className="-top-[220px] left-[40%] h-[760px] w-[1200px]" />
      <Hero />
      <Tools />
      <CoreSkillset />
      <LatestPosts />
      <Community />
      <ContactCta />
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: HomePage,
})

import AppShell from '@/components/AppShell'
import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'
import {
  GITHUB_ORG_URL,
  PROJECTS,
  type ProjectLanguage,
} from '@/config/projects'
import {
  PageGlow,
  primaryButtonClass,
  secondaryButtonClass,
  sectionClass,
} from '@/components/home/Section'
import { LanguageDot, ProjectCard } from '@/components/home/ProjectCard'

type Filter = 'All' | ProjectLanguage

const LANGUAGE_ORDER: ReadonlyArray<ProjectLanguage> = [
  'Rust',
  'Kotlin',
  'TypeScript',
]

const DESCRIPTION =
  'UnityInFlow: open-source tooling for the AI agent stack — prompt-injection scanning, spec validation, token cost control, a Kotlin agent runtime and MCP tooling.'

function Hero() {
  return (
    <section
      className={`${sectionClass} pt-12 pb-8 text-center sm:pt-[88px] sm:pb-12`}
    >
      <span className="border-line-strong bg-chip/60 text-body inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px]">
        <span aria-hidden="true" className="bg-brand-b size-1.5 rounded-full" />
        UnityInFlow · open source · MIT
      </span>
      <h1 className="text-heading mx-auto mt-6 max-w-[820px] text-[38px] leading-[1.06] font-semibold tracking-[-0.03em] sm:text-[52px] sm:leading-[1.05] sm:tracking-[-0.035em] lg:text-[60px]">
        Open-source tooling for the{' '}
        <span className="text-brand-gradient">AI agent stack</span>
      </h1>
      <p className="text-muted mx-auto mt-5 max-w-[640px] text-[17px] leading-[1.55] sm:text-[19px]">
        Spec validation, prompt-injection scanning, token cost control, a Kotlin
        agent runtime and MCP tooling — JVM-native, observability-first, each
        tool usable on its own.
      </p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
        <a
          href={GITHUB_ORG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={primaryButtonClass}
        >
          github.com/UnityInFlow ↗
        </a>
        <Link to="/blog" className={secondaryButtonClass}>
          Read how they&apos;re built
        </Link>
      </div>
    </section>
  )
}

function FilterChip({
  label,
  count,
  language,
  pressed,
  onPress,
}: {
  label: string
  count: number
  language?: ProjectLanguage
  pressed: boolean
  onPress: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onPress}
      className={twMerge(
        'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm transition-colors',
        pressed
          ? 'bg-invert text-on-invert border-transparent font-medium'
          : 'border-line-strong text-body hover:bg-chip hover:text-ink',
      )}
    >
      {language && (
        <LanguageDot
          language={language}
          className={pressed ? 'ring-1 ring-current' : undefined}
        />
      )}
      {label} · {count}
    </button>
  )
}

function ToolGrid() {
  const [filter, setFilter] = useState<Filter>('All')
  const counts = useMemo(() => {
    const byLanguage = new Map<ProjectLanguage, number>()
    for (const project of PROJECTS) {
      byLanguage.set(
        project.language,
        (byLanguage.get(project.language) ?? 0) + 1,
      )
    }
    return byLanguage
  }, [])
  const visible =
    filter === 'All'
      ? PROJECTS
      : PROJECTS.filter((project) => project.language === filter)

  return (
    <section
      aria-labelledby="tools-title"
      className={`${sectionClass} pt-4 sm:pt-6`}
    >
      <h2 id="tools-title" className="sr-only">
        Released tools
      </h2>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="group"
          aria-label="Filter by language"
          className="flex flex-wrap gap-2"
        >
          <FilterChip
            label="All"
            count={PROJECTS.length}
            pressed={filter === 'All'}
            onPress={() => setFilter('All')}
          />
          {LANGUAGE_ORDER.filter((language) => counts.has(language)).map(
            (language) => (
              <FilterChip
                key={language}
                label={language}
                language={language}
                count={counts.get(language) ?? 0}
                pressed={filter === language}
                onPress={() => setFilter(language)}
              />
            ),
          )}
        </div>
        <span className="text-faint text-sm">Newest release first</span>
      </div>
      <p aria-live="polite" className="sr-only">
        {filter === 'All'
          ? `Showing all ${visible.length} tools`
          : `Showing ${visible.length} ${filter} tools`}
      </p>

      <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4 sm:gap-5">
        {visible.map((project) => (
          <li key={project.name} className="flex">
            <ProjectCard project={project} className="w-full" />
          </li>
        ))}
      </ul>
    </section>
  )
}

function ContributeCta() {
  return (
    <section className={`${sectionClass} pt-16 pb-16 sm:pt-24 sm:pb-[104px]`}>
      <div className="border-line bg-cta-glow flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[20px] border p-6 sm:rounded-3xl sm:p-12">
        <div className="flex-[1_1_420px]">
          <h2 className="text-heading text-[24px] leading-[1.2] font-semibold tracking-[-0.02em] sm:text-[30px]">
            Using one of these tools?
          </h2>
          <p className="text-muted mt-2.5 max-w-[560px] text-base leading-[1.6]">
            Open an issue, send a pattern the scanner misses, or tell me what
            broke. Adversarial input is the best contribution.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            to="/contact"
            className="bg-invert text-on-invert inline-flex min-h-11 items-center justify-center rounded-[10px] px-5 py-3 text-[15px] font-medium transition-opacity hover:opacity-90"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  )
}

function ProjectsPage() {
  useEffect(() => {
    const title = `Projects — ${SEO_DEFAULTS.siteName}`
    setHead({
      title,
      description: DESCRIPTION,
      canonical: `${SEO_DEFAULTS.siteUrl}/projects`,
      og: {
        title,
        url: `${SEO_DEFAULTS.siteUrl}/projects`,
        image: SEO_DEFAULTS.image,
        description: DESCRIPTION,
      },
      twitter: {
        card: 'summary',
        title,
        description: DESCRIPTION,
        image: SEO_DEFAULTS.image,
      },
    })
  }, [])

  return (
    <AppShell path="Projects" fullBleed>
      <PageGlow className="-top-[260px] h-[640px]" />
      <Hero />
      <ToolGrid />
      <ContributeCta />
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: ProjectsPage,
})

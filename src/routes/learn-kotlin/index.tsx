import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import AppShell from '@/components/AppShell'
import {
  useKotlinTopicsByModule,
  type KotlinModule,
  type SourceLanguage,
} from '@/lib/queries'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'
import { ArrowRightIcon, LayersIcon, PlayIcon } from '@/components/icons'
import { LanguageToggle } from '@/components/learn/LanguageToggle'
import {
  DIFFICULTY_LEVELS,
  difficultyDotClass,
} from '@/components/learn/Difficulty'
import {
  LANGUAGE_LABEL,
  readStoredLanguage,
  storeLanguage,
} from '@/components/learn/language'

export const Route = createFileRoute({
  component: LearnKotlinIndex,
})

const section = 'relative mx-auto max-w-[1200px] px-4 sm:px-8'

function BackgroundChooser({
  sourceLanguage,
  onChange,
}: {
  sourceLanguage: SourceLanguage
  onChange: (language: 'java' | 'csharp') => void
}) {
  return (
    <div className="border-line bg-card flex-[1_1_320px] rounded-2xl border p-5 sm:p-6">
      <h2 className="text-heading text-[15px] font-semibold">
        What&apos;s your background?
      </h2>
      <LanguageToggle
        legend="Your background"
        value={sourceLanguage}
        onChange={onChange}
        className="mt-3"
      />
      <p className="text-faint mt-3 text-[14px] leading-relaxed">
        {sourceLanguage
          ? `Topics compare Kotlin with ${LANGUAGE_LABEL[sourceLanguage]}. Remembered on this device.`
          : 'Pick one and every topic compares Kotlin with the language you already know.'}
      </p>
    </div>
  )
}

function StartHere({
  modules,
  lang,
}: {
  modules: KotlinModule[]
  lang: string | undefined
}) {
  const firstModule = modules.find((module) => module.topics.length > 0)
  const first = firstModule?.topics[0]
  if (!firstModule || !first) return null
  return (
    <section className={`${section} pt-2`}>
      <Link
        to="/learn-kotlin/$topicId"
        params={{ topicId: first.id }}
        search={{ lang }}
        className="border-brand-a/40 bg-cta-glow hover:border-brand-a/70 group flex flex-wrap items-center justify-between gap-5 rounded-[18px] border p-6 transition-colors sm:px-7"
      >
        <span className="min-w-0 flex-[1_1_420px]">
          <span className="text-brand-a block text-[13px] font-medium">
            Start here · {firstModule.name}
          </span>
          <span className="text-heading mt-1.5 block text-[22px] leading-tight font-semibold tracking-[-0.015em]">
            {first.title}
          </span>
          {first.description && (
            <span className="text-muted mt-1.5 block text-[15px] leading-relaxed">
              {first.description}
            </span>
          )}
        </span>
        <span className="bg-invert text-on-invert inline-flex min-h-11 items-center gap-2 rounded-[10px] px-[18px] text-[15px] font-medium transition-opacity group-hover:opacity-90">
          Start learning
          <ArrowRightIcon size={16} />
        </span>
      </Link>
    </section>
  )
}

function ModuleCard({
  module,
  lang,
}: {
  module: KotlinModule
  lang: string | undefined
}) {
  return (
    <div className="border-line bg-card rounded-2xl border p-5 sm:p-[22px]">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-heading text-lg font-semibold tracking-[-0.01em]">
          {module.name}
        </h3>
        <span className="text-faint shrink-0 text-[13px]">
          {module.topics.length}{' '}
          {module.topics.length === 1 ? 'topic' : 'topics'}
        </span>
      </div>
      <ul className="mt-3 flex flex-col">
        {module.topics.map((topic) => (
          <li key={topic.id}>
            <Link
              to="/learn-kotlin/$topicId"
              params={{ topicId: topic.id }}
              search={{ lang }}
              className="hover:bg-chip group -mx-2.5 block rounded-lg px-2.5 py-2.5 transition-colors"
            >
              <span className="text-ink block text-[15px] leading-snug font-medium group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                {topic.title}
              </span>
              <span className="text-faint mt-1 flex flex-wrap items-center gap-x-2 text-[13px]">
                <span className="inline-flex items-center gap-1.5 capitalize">
                  <span
                    aria-hidden="true"
                    className={`size-1.5 rounded-full ${difficultyDotClass(topic.difficulty)}`}
                  />
                  {topic.difficulty}
                </span>
                <span aria-hidden="true">·</span>
                <span>{topic.readingTimeMinutes} min read</span>
              </span>
              {topic.description && (
                <span className="text-muted mt-1 line-clamp-2 block text-[14px] leading-relaxed">
                  {topic.description}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ModulesSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading topics"
      className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="border-line bg-card h-[260px] animate-pulse rounded-2xl border p-6 motion-reduce:animate-none"
        >
          <div className="bg-chip h-5 w-1/2 rounded" />
          <div className="bg-chip mt-6 h-4 w-4/5 rounded" />
          <div className="bg-chip mt-4 h-4 w-3/5 rounded" />
          <div className="bg-chip mt-4 h-4 w-2/3 rounded" />
        </div>
      ))}
    </div>
  )
}

function DifficultyLegend() {
  return (
    <ul
      aria-label="Difficulty levels"
      className="text-muted flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]"
    >
      {DIFFICULTY_LEVELS.map((level) => (
        <li key={level} className="inline-flex items-center gap-1.5 capitalize">
          <span
            aria-hidden="true"
            className={`size-2 rounded-full ${difficultyDotClass(level)}`}
          />
          {level}
        </li>
      ))}
    </ul>
  )
}

function LearnKotlinIndex() {
  const [sourceLanguage, setSourceLanguage] = useState<SourceLanguage>(null)
  const { data: modules, isLoading, error } = useKotlinTopicsByModule()

  // Restore a remembered choice after mount (storage is client-only).
  useEffect(() => {
    setSourceLanguage(readStoredLanguage())
  }, [])

  useEffect(() => {
    const title = `Learn Kotlin — ${SEO_DEFAULTS.siteName}`
    const description = 'Interactive Kotlin learning for experienced developers'
    const url = `${SEO_DEFAULTS.siteUrl}/learn-kotlin`
    setHead({
      title,
      description,
      canonical: url,
      og: { title, url, image: SEO_DEFAULTS.image, description },
      twitter: {
        card: 'summary',
        title,
        description,
        image: SEO_DEFAULTS.image,
      },
    })
  }, [])

  const chooseLanguage = (language: 'java' | 'csharp') => {
    setSourceLanguage(language)
    storeLanguage(language)
  }

  // Topic pages read the background from ?lang=.
  const lang = sourceLanguage || undefined

  return (
    <AppShell path="Learn Kotlin" fullBleed>
      <div
        aria-hidden="true"
        className="bg-glow-hero pointer-events-none absolute -top-[260px] left-1/2 h-[640px] w-[1100px] -translate-x-1/2"
      />

      <section
        className={`${section} flex flex-wrap items-end justify-between gap-10 pt-14 pb-10 sm:pt-20 lg:gap-12`}
      >
        <div className="min-w-0 flex-[999_1_560px]">
          <span className="border-line-strong bg-chip/60 text-body inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px]">
            <span
              aria-hidden="true"
              className="bg-brand-b size-1.5 rounded-full"
            />
            Learn Kotlin · for Java &amp; C# developers
          </span>
          <h1 className="text-heading mt-6 text-[40px] leading-[1.04] font-semibold tracking-[-0.035em] sm:text-[52px] lg:text-[58px]">
            Learn Kotlin,{' '}
            <span className="text-brand-gradient">
              from the language you know
            </span>
          </h1>
          <p className="text-muted mt-5 max-w-[600px] text-[17px] leading-[1.55] sm:text-[19px]">
            Interactive Kotlin learning for experienced developers. Every topic
            compares Kotlin with Java or C#, links runnable examples, and goes
            as deep as you choose.
          </p>
        </div>
        <BackgroundChooser
          sourceLanguage={sourceLanguage}
          onChange={chooseLanguage}
        />
      </section>

      {modules && <StartHere modules={modules} lang={lang} />}

      <section className={`${section} pt-14 sm:pt-16`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-heading text-[26px] font-semibold tracking-[-0.02em] sm:text-[30px]">
              Modules
            </h2>
            <DifficultyLegend />
          </div>
          <Link
            to="/learn-kotlin/mindmap"
            className="text-brand-a inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium hover:underline"
          >
            Open the learning map
            <ArrowRightIcon size={16} />
          </Link>
        </div>

        {isLoading && <ModulesSkeleton />}
        {error && (
          <div
            role="alert"
            className="border-line bg-subtle mt-6 rounded-[20px] border px-6 py-14 text-center"
          >
            <p className="text-heading text-lg font-semibold">
              Failed to load topics
            </p>
            <p className="text-faint mt-2 text-sm">Please try again later.</p>
          </div>
        )}
        {modules && (
          <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] items-start gap-4">
            {modules.map((module) => (
              <ModuleCard key={module.name} module={module} lang={lang} />
            ))}
          </div>
        )}
      </section>

      <section className={`${section} pt-16 pb-24 sm:pt-[72px]`}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4">
          <Link
            to="/learn-kotlin/mindmap"
            className="border-line bg-cover-green hover:border-line-strong group block rounded-[18px] border p-6 transition-colors sm:p-7"
          >
            <span className="border-line-strong text-body inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium">
              <LayersIcon size={14} />
              Learning map
            </span>
            <span className="text-heading mt-4 block text-[21px] font-semibold tracking-[-0.015em]">
              See how the topics connect
            </span>
            <span className="text-muted mt-2 block text-[15px] leading-relaxed">
              Every topic by module and as a graph, with the prerequisites
              between them.
            </span>
            <span className="text-brand-a mt-4 inline-flex items-center gap-1.5 text-[15px] font-medium group-hover:underline">
              Open the learning map
              <ArrowRightIcon size={16} />
            </span>
          </Link>
          <Link
            to="/dispatchers"
            className="border-line bg-cover-blue hover:border-line-strong group block rounded-[18px] border p-6 transition-colors sm:p-7"
          >
            <span className="border-line-strong text-body inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium">
              <PlayIcon size={14} />
              Interactive tool
            </span>
            <span className="text-heading mt-4 block text-[21px] font-semibold tracking-[-0.015em]">
              Coroutine Dispatcher Visualizer
            </span>
            <span className="text-muted mt-2 block text-[15px] leading-relaxed">
              Watch workers, global queues and work stealing in real time — from
              basics to advanced pitfalls.
            </span>
            <span className="text-brand-a mt-4 inline-flex items-center gap-1.5 text-[15px] font-medium group-hover:underline">
              Open the visualizer
              <ArrowRightIcon size={16} />
            </span>
          </Link>
        </div>
      </section>
    </AppShell>
  )
}

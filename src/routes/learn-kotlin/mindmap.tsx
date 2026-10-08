import { useEffect, useId, useState } from 'react'
import AppShell from '@/components/AppShell'
import { Link } from '@tanstack/react-router'
import { useKotlinMindMap, type SourceLanguage } from '@/lib/queries'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'
import { ArrowLeftIcon, SearchIcon } from '@/components/icons'
import { KotlinMindMap } from '@/components/KotlinMindMap'
import { MindMapGraph } from '@/components/learn/MindMapGraph'
import {
  DIFFICULTY_LEVELS,
  difficultyDotClass,
} from '@/components/learn/Difficulty'
import { readStoredLanguage } from '@/components/learn/language'

type View = 'modules' | 'graph'

const VIEWS: { value: View; label: string }[] = [
  { value: 'modules', label: 'By module' },
  { value: 'graph', label: 'Graph' },
]

const section = 'relative mx-auto max-w-[1200px] px-4 sm:px-8'

function ViewToggle({
  view,
  onChange,
}: {
  view: View
  onChange: (view: View) => void
}) {
  const name = useId()
  return (
    <fieldset>
      <legend className="sr-only">View</legend>
      <div className="border-line bg-subtle flex gap-1 rounded-xl border p-1">
        {VIEWS.map((option) => (
          <label key={option.value} className="relative">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={view === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className="text-muted hover:text-ink peer-checked:bg-invert peer-checked:text-on-invert peer-focus-visible:outline-brand-a flex min-h-11 cursor-pointer items-center rounded-[9px] px-4 text-sm font-medium transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Legend({ view }: { view: View }) {
  return (
    <div className="text-muted flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
      <span className="text-heading font-medium">Difficulty:</span>
      {DIFFICULTY_LEVELS.map((level) => (
        <span
          key={level}
          className="inline-flex items-center gap-1.5 capitalize"
        >
          <span
            aria-hidden="true"
            className={`size-2.5 rounded-full ${difficultyDotClass(level)}`}
          />
          {level}
        </span>
      ))}
      {view === 'graph' && (
        <>
          <span aria-hidden="true" className="bg-line-strong h-4 w-px" />
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="bg-brand-a h-0.5 w-5 rounded" />
            Prerequisite
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="bg-brand-b h-0.5 w-5 rounded" />
            Suggested next
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="border-fainter w-5 border-t-2 border-dashed"
            />
            Related
          </span>
        </>
      )}
    </div>
  )
}

function KotlinMindMapPage() {
  const { data: mindMapData, isLoading, error } = useKotlinMindMap()
  const [view, setView] = useState<View>('modules')
  const [search, setSearch] = useState('')
  const [lang, setLang] = useState<SourceLanguage>(null)
  const query = search.trim().toLowerCase()

  // Topic links keep the background chosen on /learn-kotlin.
  useEffect(() => setLang(readStoredLanguage()), [])

  useEffect(() => {
    setHead({
      title: `Kotlin Mind Map — ${SEO_DEFAULTS.siteName}`,
      description:
        'Interactive mind map of Kotlin topics. Visualize your learning path and explore topic relationships.',
      canonical: `${SEO_DEFAULTS.siteUrl}/learn-kotlin/mindmap`,
      og: {
        title: `Kotlin Mind Map — ${SEO_DEFAULTS.siteName}`,
        url: `${SEO_DEFAULTS.siteUrl}/learn-kotlin/mindmap`,
        image: SEO_DEFAULTS.image,
        description: 'Interactive mind map of Kotlin topics',
      },
    })
  }, [])

  const hasTopics = !!mindMapData && mindMapData.topics.length > 0

  return (
    <AppShell path="Learn Kotlin / Mind Map" fullBleed>
      <div
        aria-hidden="true"
        className="bg-glow-hero pointer-events-none absolute -top-[300px] left-1/2 h-[600px] w-[1100px] -translate-x-1/2 opacity-80"
      />

      <section
        className={`${section} flex flex-wrap items-end justify-between gap-5 pt-10 sm:pt-14`}
      >
        <div className="min-w-0 flex-[1_1_460px]">
          <Link
            to="/learn-kotlin"
            className="text-muted hover:text-ink inline-flex min-h-11 items-center gap-1.5 text-[14px] transition-colors"
          >
            <ArrowLeftIcon size={15} />
            Back to Topics
          </Link>
          <h1 className="text-heading mt-2 text-[34px] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-[44px]">
            Learning Mind Map
          </h1>
          <p className="text-muted mt-3 text-[16px] leading-relaxed sm:text-[17px]">
            {view === 'graph'
              ? 'Click any topic bubble to start learning. Arrows show prerequisites.'
              : 'Hover a topic to highlight what it needs and what it unlocks. Click to open it.'}
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <ViewToggle view={view} onChange={setView} />
          <label className="border-line-strong bg-card text-faint focus-within:outline-brand-a flex min-h-11 flex-[1_1_200px] items-center gap-2 rounded-[10px] border px-3 focus-within:outline-2 focus-within:outline-offset-2 sm:flex-none">
            <SearchIcon size={16} />
            <span className="sr-only">Find a topic</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find a topic"
              className="text-ink placeholder:text-faint w-full min-w-0 bg-transparent text-[15px] outline-none sm:w-[170px]"
            />
          </label>
        </div>
      </section>

      <section className={`${section} pt-6 pb-24`}>
        {hasTopics && (
          <div className="mb-5">
            <Legend view={view} />
          </div>
        )}

        {isLoading && (
          <div
            aria-busy="true"
            aria-label="Loading mind map"
            className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-4"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="border-line bg-card h-[220px] animate-pulse rounded-2xl border motion-reduce:animate-none"
              />
            ))}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="border-line bg-subtle rounded-[20px] border px-6 py-14 text-center"
          >
            <p className="text-heading text-lg font-semibold">
              Failed to load mind map
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="border-line-strong text-ink hover:bg-chip mt-6 inline-flex min-h-11 items-center rounded-[10px] border px-5 text-[15px] font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && mindMapData && !hasTopics && (
          <div className="border-line bg-subtle rounded-[20px] border px-6 py-14 text-center">
            <p className="text-heading text-lg font-semibold">
              No topics available yet
            </p>
            <Link
              to="/learn-kotlin"
              className="border-line-strong text-ink hover:bg-chip mt-6 inline-flex min-h-11 items-center rounded-[10px] border px-5 text-[15px] font-medium transition-colors"
            >
              View Topics List
            </Link>
          </div>
        )}

        {hasTopics && view === 'modules' && (
          <KotlinMindMap
            data={mindMapData}
            selectedLanguage={lang}
            query={query}
          />
        )}

        {hasTopics && view === 'graph' && (
          <>
            <MindMapGraph data={mindMapData} query={query} lang={lang} />
            <p className="text-faint mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px]">
              <span className="text-muted font-medium">Tips:</span>
              <span>Scroll to zoom</span>
              <span aria-hidden="true">·</span>
              <span>Drag to pan</span>
              <span aria-hidden="true">·</span>
              <span>Click bubble to learn</span>
            </p>
          </>
        )}
      </section>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: KotlinMindMapPage,
})

import { LEARN_KOTLIN_ENABLED } from '@/config/features'
import NotFound from '@/components/NotFound'
import AppShell from '@/components/AppShell'
import { useParams, Link, useSearch, useNavigate } from '@tanstack/react-router'
import {
  useKotlinTopicWithTiers,
  useKotlinTopicsByModule,
  type SourceLanguage,
  type KotlinContentTier,
  type KotlinRunnableExample,
  type KotlinTopicListItem,
  type KotlinTopicWithTiers,
} from '@/lib/queries'
import { useEffect, useId, useState, useMemo, type ReactNode } from 'react'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'
import {
  AlertIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BoltIcon,
  BookIcon,
  CheckIcon,
  ClipboardIcon,
  CodeIcon,
  ExternalLinkIcon,
  FolderIcon,
  LayersIcon,
  LightbulbIcon,
  MessageIcon,
  PlayIcon,
  SproutIcon,
  TargetIcon,
  WrenchIcon,
} from '@/components/icons'
import { DifficultyBadge } from '@/components/learn/Difficulty'
import { LanguageToggle } from '@/components/learn/LanguageToggle'
import { LearnCode, LearnMarkdown } from '@/components/learn/LearnMarkdown'
import {
  isSourceLanguage,
  readStoredLanguage,
  storeLanguage,
} from '@/components/learn/language'

const TIER_STORAGE_KEY = 'kotlin-learning-selected-tier'

type IconComponent = (props: { size?: number }) => ReactNode

const TIER_CONFIG: Record<number, { name: string; Icon: IconComponent }> = {
  1: { name: 'TL;DR', Icon: BoltIcon },
  2: { name: 'Beginner', Icon: SproutIcon },
  3: { name: 'Intermediate', Icon: WrenchIcon },
  4: { name: 'Deep Dive', Icon: LayersIcon },
}

function getStoredTier(): number {
  if (typeof window === 'undefined') return 2
  try {
    const stored = localStorage.getItem(TIER_STORAGE_KEY)
    const parsed = stored ? parseInt(stored, 10) : 2
    return parsed >= 1 && parsed <= 4 ? parsed : 2
  } catch {
    return 2
  }
}

function setStoredTier(tier: number) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(TIER_STORAGE_KEY, tier.toString())
  } catch {
    // Remembering the tier is a convenience only.
  }
}

/**
 * The tier to show: the preferred one if this topic has it, else the deepest tier below it,
 * else the shallowest the topic has. Topics differ in which tiers they define.
 */
function resolveTier(
  available: number[] | undefined,
  preferred: number,
): number {
  if (!available || available.length === 0 || available.includes(preferred)) {
    return preferred
  }
  const below = available.filter((t) => t < preferred)
  return below.length > 0 ? Math.max(...below) : Math.min(...available)
}

const EXPERIENCE: Record<
  string,
  { label: string; Icon: IconComponent; accent: string }
> = {
  story: {
    label: "JIRI'S PRODUCTION STORY",
    Icon: BookIcon,
    accent: 'text-brand-a',
  },
  mistake: { label: "JIRI'S MISTAKE", Icon: AlertIcon, accent: 'text-danger' },
  tip: { label: "JIRI'S TIP", Icon: LightbulbIcon, accent: 'text-brand-b' },
  warning: { label: "JIRI'S WARNING", Icon: AlertIcon, accent: 'text-danger' },
  opinion: {
    label: "JIRI'S OPINION",
    Icon: TargetIcon,
    accent: 'text-brand-a',
  },
}
const EXPERIENCE_FALLBACK = {
  label: "JIRI'S NOTE",
  Icon: MessageIcon,
  accent: 'text-brand-a',
}

const DOC_LINK_LABEL: Record<string, string> = {
  kotlin_official: 'Kotlin docs',
  java_official: 'Java docs',
  csharp_official: 'C# docs',
}

/** "nested-inner-classes" → "nested inner classes" (as the page always showed ids). */
function idToLabel(id: string) {
  return id.replace(/-/g, ' ')
}

const card = 'border-line bg-card rounded-2xl border'
const sectionHeading =
  'text-heading flex items-center gap-2.5 text-[22px] font-semibold tracking-[-0.015em] sm:text-[24px]'

function SectionIcon({ children }: { children: ReactNode }) {
  return (
    <span className="bg-brand-a/10 text-brand-a inline-flex size-9 shrink-0 items-center justify-center rounded-[10px]">
      {children}
    </span>
  )
}

function TierSelector({
  topic,
  selectedTier,
  onChange,
}: {
  topic: KotlinTopicWithTiers
  selectedTier: number
  onChange: (tier: number) => void
}) {
  const name = useId()
  return (
    <fieldset className="min-w-0">
      <legend className="text-heading text-sm font-semibold">
        Choose your depth
      </legend>
      <p className="text-faint mt-0.5 text-[13px]">
        Select how deep you want to dive into this topic
      </p>
      <div className="mt-2.5 grid grid-cols-2 gap-1 sm:flex sm:flex-wrap">
        {topic.availableTiers.map((tier) => {
          const config = TIER_CONFIG[tier]
          const tierContent = topic.tiers.find((t) => t.tierLevel === tier)
          const Icon = config?.Icon ?? BookIcon
          return (
            <label key={tier} className="relative">
              <input
                type="radio"
                name={name}
                value={tier}
                checked={selectedTier === tier}
                onChange={() => onChange(tier)}
                className="peer sr-only"
              />
              <span className="text-muted hover:text-ink peer-checked:bg-card peer-checked:text-heading peer-checked:border-brand-a/60 peer-checked:[&_svg]:text-brand-a peer-focus-visible:outline-brand-a flex min-h-11 cursor-pointer items-center gap-2 rounded-[10px] border border-transparent px-3 text-sm font-medium transition-colors peer-checked:shadow-sm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                <Icon size={16} />
                <span>
                  {tierContent?.tierName || config?.name || `Tier ${tier}`}
                </span>
                {tierContent && (
                  <span className="text-faint text-[13px] font-normal">
                    {tierContent.readingTimeMinutes}m
                  </span>
                )}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function ComparisonSection({
  topic,
  sourceLanguage,
}: {
  topic: KotlinTopicWithTiers
  sourceLanguage: SourceLanguage
}) {
  const [index, setIndex] = useState(0)
  const name = useId()
  // A different topic or language brings a different list.
  useEffect(() => setIndex(0), [topic.id, sourceLanguage])
  const examples = topic.codeExamples
  const example = examples[Math.min(index, examples.length - 1)]
  if (!example) return null
  const isJava = sourceLanguage === 'java'
  return (
    <section aria-labelledby="comparison-heading">
      <h2 id="comparison-heading" className={sectionHeading}>
        <SectionIcon>
          <CodeIcon size={18} />
        </SectionIcon>
        {isJava ? 'Java Evolution Timeline' : 'How You Know It (C#)'}
      </h2>
      {examples.length > 1 && (
        <fieldset className="mt-4">
          <legend className="sr-only">
            {isJava ? 'Java version' : 'C# version'}
          </legend>
          <div className="flex flex-wrap gap-2">
            {examples.map((item, itemIndex) => (
              <label key={itemIndex} className="relative">
                <input
                  type="radio"
                  name={name}
                  checked={itemIndex === index}
                  onChange={() => setIndex(itemIndex)}
                  className="peer sr-only"
                />
                <span className="border-line-strong text-body hover:text-ink peer-checked:bg-invert peer-checked:text-on-invert peer-focus-visible:outline-brand-a flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-sm font-medium transition-colors peer-checked:border-transparent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                  {item.versionLabel || item.language}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <div className={`${card} mt-4 p-4 sm:p-6`}>
        {examples.length === 1 && (
          <p className="text-heading mb-3 text-[15px] font-semibold">
            {example.versionLabel || example.language}
          </p>
        )}
        <LearnCode code={example.code} language={example.language} />
        {example.explanation && (
          <div className="mt-5">
            <LearnMarkdown text={example.explanation} size="sm" />
          </div>
        )}
      </div>
    </section>
  )
}

function RunnableExampleCard({ example }: { example: KotlinRunnableExample }) {
  const tier = TIER_CONFIG[example.tierLevel]
  const TierIcon = tier?.Icon ?? BookIcon
  return (
    <div className="border-window-line bg-card overflow-hidden rounded-2xl border">
      <div className="border-line bg-subtle flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
          <h3 className="text-heading text-[16px] font-semibold">
            {example.title}
          </h3>
          {tier && (
            <span className="border-line-strong text-body inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[13px] leading-none">
              <TierIcon size={13} />
              {tier.name}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            // Open in Kotlin Playground
            const encoded = encodeURIComponent(example.code)
            window.open(
              `https://play.kotlinlang.org/#code=${encoded}`,
              '_blank',
            )
          }}
          className="bg-brand-gradient-x text-on-brand focus-visible:outline-brand-a inline-flex min-h-11 items-center gap-2 rounded-[10px] px-4 text-sm font-medium transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <PlayIcon size={15} />
          Run in Kotlin Playground
        </button>
      </div>
      <div className="p-4 sm:p-5">
        {example.description && (
          <p className="text-muted mb-4 text-[15px] leading-relaxed">
            {example.description}
          </p>
        )}
        <LearnCode code={example.code} />
        {example.expectedOutput && (
          <div className="border-brand-b/30 bg-brand-b/5 mt-4 rounded-xl border px-4 py-3">
            <p className="text-faint text-[13px] font-medium">
              Expected Output:
            </p>
            <pre className="text-ink mt-1.5 font-mono text-[14px] leading-relaxed break-words whitespace-pre-wrap">
              {example.expectedOutput}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

function ModuleTopicList({
  topics,
  currentId,
  lang,
}: {
  topics: KotlinTopicListItem[]
  currentId: string
  lang: string | undefined
}) {
  return (
    <ul className="border-line flex flex-col border-l">
      {topics.map((item) => {
        const current = item.id === currentId
        return (
          <li key={item.id}>
            <Link
              to="/learn-kotlin/$topicId"
              params={{ topicId: item.id }}
              search={{ lang }}
              aria-current={current ? 'page' : undefined}
              className={`-ml-px flex min-h-10 items-center border-l-2 py-2 pl-3.5 text-[14px] leading-snug transition-colors ${
                current
                  ? 'border-brand-a text-heading font-medium'
                  : 'text-muted hover:text-ink hover:border-line-strong border-transparent'
              }`}
            >
              {item.title}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

function NavCard({
  label,
  title,
  align,
  children,
}: {
  label: string
  title: string
  align: 'left' | 'right'
  children?: ReactNode
}) {
  return (
    <span
      className={`flex flex-col ${align === 'right' ? 'items-end text-right' : ''}`}
    >
      <span className="text-faint inline-flex items-center gap-1.5 text-[13px]">
        {children}
        {label}
      </span>
      <span className="text-heading mt-1 text-[17px] leading-snug font-semibold group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
        {title}
      </span>
    </span>
  )
}

function KotlinTopicPage() {
  const { topicId } = useParams({ from: '/learn-kotlin/$topicId' })
  const search = useSearch({ from: '/learn-kotlin/$topicId' }) as {
    lang?: string
    tier?: string
  }
  const navigate = useNavigate()
  const [sourceLanguage, setSourceLanguage] = useState<SourceLanguage>(null)
  const [preferredTier, setPreferredTier] = useState<number>(2)

  useEffect(() => {
    const lang =
      (search.lang as SourceLanguage) || readStoredLanguage() || 'java'
    setSourceLanguage(lang)

    const tier = search.tier ? parseInt(search.tier, 10) : getStoredTier()
    if (tier >= 1 && tier <= 4) {
      setPreferredTier(tier)
    }
  }, [search.lang, search.tier])

  const handleTierChange = (tier: number) => {
    setPreferredTier(tier)
    setStoredTier(tier)
  }

  // Switching Java / C# here updates ?lang= (and remembers it), like the home page choice.
  const handleLanguageChange = (language: 'java' | 'csharp') => {
    storeLanguage(language)
    void navigate({
      to: '/learn-kotlin/$topicId',
      params: { topicId },
      search: { lang: language, tier: search.tier },
      replace: true,
      resetScroll: false,
    })
  }

  // Fetch every tier and filter here: with ?tier=N the API lists only tiers <= N in
  // availableTiers, so the deeper tiers could never be selected.
  const {
    data: topic,
    isLoading,
    isError,
  } = useKotlinTopicWithTiers(topicId, sourceLanguage)
  const { data: modules } = useKotlinTopicsByModule()

  const selectedTier = useMemo(
    () => resolveTier(topic?.availableTiers, preferredTier),
    [topic?.availableTiers, preferredTier],
  )

  // Get the current tier content
  const currentTierContent = useMemo<KotlinContentTier | undefined>(() => {
    if (!topic?.tiers) return undefined
    return topic.tiers.find((t) => t.tierLevel === selectedTier)
  }, [topic?.tiers, selectedTier])

  // Get runnable examples for current tier and below
  const currentExamples = useMemo<KotlinRunnableExample[]>(() => {
    if (!topic?.runnableExamples) return []
    return topic.runnableExamples.filter((e) => e.tierLevel <= selectedTier)
  }, [topic?.runnableExamples, selectedTier])

  // Calculate total reading time up to current tier
  const totalReadingTime = useMemo(() => {
    if (!topic?.tiers) return 0
    return topic.tiers
      .filter((t) => t.tierLevel <= selectedTier)
      .reduce((sum, t) => sum + t.readingTimeMinutes, 0)
  }, [topic?.tiers, selectedTier])

  // Titles for linked topic ids, and this topic's module siblings, from the topic list.
  const { titles, siblings } = useMemo(() => {
    const map = new Map<string, string>()
    let moduleTopics: KotlinTopicListItem[] = []
    modules?.forEach((module) =>
      module.topics.forEach((item) => {
        map.set(item.id, item.title)
        if (item.id === topicId) moduleTopics = module.topics
      }),
    )
    return { titles: map, siblings: moduleTopics }
  }, [modules, topicId])
  const titleOf = (id: string) => titles.get(id) ?? idToLabel(id)

  useEffect(() => {
    if (topic?.title) {
      const canonicalUrl = `${SEO_DEFAULTS.siteUrl}/learn-kotlin/${topicId}`
      setHead({
        title: `${topic.title} — Learn Kotlin — ${SEO_DEFAULTS.siteName}`,
        description: topic.description || `Learn ${topic.title} in Kotlin`,
        canonical: canonicalUrl,
        og: {
          title: `${topic.title} — Learn Kotlin`,
          url: canonicalUrl,
        },
      })
    }
  }, [topic?.title, topic?.description, topicId])

  const lang = sourceLanguage ?? undefined
  const languageValue = isSourceLanguage(sourceLanguage) ? sourceLanguage : null
  const tierConfig = TIER_CONFIG[selectedTier]
  const TierIcon = tierConfig?.Icon ?? BookIcon

  return (
    <AppShell path="Learn Kotlin / Topic" fullBleed>
      <div
        aria-hidden="true"
        className="bg-glow-hero pointer-events-none absolute -top-[300px] left-1/2 h-[600px] w-[1100px] -translate-x-1/2 opacity-80"
      />

      {isLoading && (
        <div
          aria-busy="true"
          aria-label="Loading topic"
          className="relative mx-auto max-w-[1200px] animate-pulse px-4 pt-14 pb-24 motion-reduce:animate-none sm:px-8"
        >
          <div className="max-w-[780px] lg:ml-[288px]">
            <div className="bg-chip h-4 w-48 rounded" />
            <div className="bg-chip mt-5 h-12 w-3/4 rounded-lg" />
            <div className="bg-chip mt-4 h-5 w-full rounded" />
            <div className="bg-chip mt-8 h-24 w-full rounded-2xl" />
          </div>
        </div>
      )}

      {isError && (
        <section className="relative mx-auto max-w-[880px] px-4 py-24 text-center sm:px-8">
          <h1 className="text-heading text-2xl font-semibold">
            Failed to load topic
          </h1>
          <p className="text-muted mt-3">
            This topic may not exist or there was an error loading it.
          </p>
          <Link
            to="/learn-kotlin"
            className="border-line-strong text-ink hover:bg-chip mt-8 inline-flex min-h-11 items-center gap-2 rounded-[10px] border px-5 text-[15px] font-medium transition-colors"
          >
            <ArrowLeftIcon size={16} />
            Back to Topics
          </Link>
        </section>
      )}

      {topic && (
        <div className="relative mx-auto flex max-w-[1200px] items-start gap-12 px-4 pt-10 pb-24 sm:px-8 sm:pt-12">
          <aside className="hidden w-[240px] shrink-0 lg:block">
            <div className="sticky top-28 text-[14px]">
              <Link
                to="/learn-kotlin"
                className="text-muted hover:text-ink inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeftIcon size={15} />
                Back to Topics
              </Link>
              {siblings.length > 0 && (
                <nav aria-label={`Topics in ${topic.module}`}>
                  <p className="text-faint mt-6 mb-2.5 text-[12px] font-semibold tracking-[0.06em] uppercase">
                    {topic.module}
                  </p>
                  <ModuleTopicList
                    topics={siblings}
                    currentId={topic.id}
                    lang={lang}
                  />
                </nav>
              )}
              <Link
                to="/learn-kotlin/mindmap"
                className="text-brand-a mt-6 inline-flex items-center gap-1.5 font-medium hover:underline"
              >
                View in the learning map
                <ArrowRightIcon size={15} />
              </Link>
            </div>
          </aside>

          <article className="max-w-[780px] min-w-0 flex-1">
            <Link
              to="/learn-kotlin"
              className="text-muted hover:text-ink inline-flex min-h-11 items-center gap-1.5 text-[14px] transition-colors lg:hidden"
            >
              <ArrowLeftIcon size={15} />
              Back to Topics
            </Link>

            <p className="text-faint text-[13px] lg:mt-0">
              {topic.partNumber && (
                <>
                  Part {topic.partNumber}
                  {topic.partName && `: ${topic.partName}`}
                  <span aria-hidden="true"> · </span>
                </>
              )}
              {topic.module}
            </p>
            <h1 className="text-heading mt-3 text-[34px] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-[44px] lg:text-[48px]">
              {topic.title}
            </h1>
            {topic.description && (
              <p className="text-muted mt-4 text-[17px] leading-[1.55] sm:text-[19px]">
                {topic.description}
              </p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <DifficultyBadge difficulty={topic.difficulty} />
              <span className="border-line-strong text-body rounded-full border px-2.5 py-1 text-[13px] leading-none">
                {totalReadingTime} min read
              </span>
              {topic.navigation?.next && (
                <Link
                  to="/learn-kotlin/$topicId"
                  params={{ topicId: topic.navigation.next }}
                  search={{ lang }}
                  className="border-line-strong text-body hover:text-ink rounded-full border px-2.5 py-1 text-[13px] leading-none transition-colors"
                >
                  Next: {titleOf(topic.navigation.next)}
                </Link>
              )}
            </div>

            {/* Depth + language */}
            <div className="border-line bg-subtle mt-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 rounded-2xl border p-4">
              {topic.availableTiers && topic.availableTiers.length > 1 ? (
                <TierSelector
                  topic={topic}
                  selectedTier={selectedTier}
                  onChange={handleTierChange}
                />
              ) : null}
              <div className="w-full sm:w-auto">
                <p
                  aria-hidden="true"
                  className="text-heading mb-2.5 text-sm font-semibold"
                >
                  Compare with
                </p>
                <LanguageToggle
                  legend="Compare with"
                  value={languageValue}
                  onChange={handleLanguageChange}
                  size="sm"
                  className="sm:w-[200px]"
                />
              </div>
            </div>

            {/* Learning Objectives */}
            {currentTierContent?.learningObjectives &&
              currentTierContent.learningObjectives.length > 0 && (
                <section className={`${card} mt-8 p-5 sm:p-6`}>
                  <h2 className="text-heading flex items-center gap-2.5 text-[17px] font-semibold">
                    <span className="text-brand-b">
                      <TargetIcon size={18} />
                    </span>
                    Learning Objectives
                  </h2>
                  <ul className="mt-3 space-y-2">
                    {currentTierContent.learningObjectives.map((obj, idx) => (
                      <li
                        key={idx}
                        className="text-body flex items-start gap-2.5 text-[15px] leading-relaxed"
                      >
                        <span className="text-brand-b mt-1 shrink-0">
                          <CheckIcon size={15} />
                        </span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            {/* Prerequisites */}
            {currentTierContent?.prerequisites &&
              currentTierContent.prerequisites.length > 0 && (
                <section className={`${card} mt-4 p-5 sm:p-6`}>
                  <h2 className="text-heading flex items-center gap-2.5 text-[17px] font-semibold">
                    <span className="text-brand-a">
                      <ClipboardIcon size={18} />
                    </span>
                    Prerequisites
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {currentTierContent.prerequisites.map((prereq, idx) => (
                      <Link
                        key={idx}
                        to="/learn-kotlin/$topicId"
                        params={{ topicId: prereq }}
                        search={{ lang }}
                        className="border-line-strong text-body hover:text-ink hover:bg-chip inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors"
                      >
                        {titleOf(prereq)}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

            {/* Tier Content - Main Explanation */}
            {currentTierContent && (
              <section className="mt-10" aria-labelledby="tier-heading">
                <h2 id="tier-heading" className={sectionHeading}>
                  <SectionIcon>
                    <TierIcon size={18} />
                  </SectionIcon>
                  {currentTierContent.title || 'The Kotlin Way'}
                </h2>
                <div className="mt-5">
                  <LearnMarkdown text={currentTierContent.explanation} />
                </div>

                {/* Tier Code Examples */}
                {currentTierContent.codeExamples &&
                  currentTierContent.codeExamples.length > 0 && (
                    <div className="mt-6 space-y-4">
                      {currentTierContent.codeExamples.map((code, idx) => (
                        <LearnCode key={idx} code={code} />
                      ))}
                    </div>
                  )}
              </section>
            )}

            {/* Runnable Examples */}
            {currentExamples.length > 0 && (
              <section className="mt-12" aria-labelledby="try-heading">
                <h2 id="try-heading" className={sectionHeading}>
                  <SectionIcon>
                    <PlayIcon size={17} />
                  </SectionIcon>
                  Try It Yourself
                </h2>
                <p className="text-muted mt-2 text-[15px]">
                  Run these examples directly in your browser
                </p>
                <div className="mt-5 space-y-5">
                  {currentExamples.map((example, idx) => (
                    <RunnableExampleCard key={idx} example={example} />
                  ))}
                </div>
              </section>
            )}

            {/* Expense Tracker Chapters */}
            {topic.expenseTrackerChapters &&
              topic.expenseTrackerChapters.length > 0 && (
                <section className={`${card} bg-cover-green mt-12 p-5 sm:p-6`}>
                  <h2 className="text-heading flex items-center gap-2.5 text-[17px] font-semibold">
                    <span className="text-brand-b">
                      <FolderIcon size={18} />
                    </span>
                    Used in Expense Tracker Project
                  </h2>
                  <p className="text-muted mt-1.5 text-sm">
                    See this topic in action in the hands-on project
                  </p>
                  <div className="mt-4 space-y-2">
                    {topic.expenseTrackerChapters.map((chapter, idx) => (
                      // Plain link: the chapter route is not part of this app's route tree.
                      <a
                        key={idx}
                        href={`/learn-kotlin/expense-tracker/${chapter.chapterNumber}`}
                        className="border-line bg-card hover:border-line-strong flex items-center justify-between gap-3 rounded-xl border p-3.5 transition-colors"
                      >
                        <span className="min-w-0">
                          <span className="text-ink block text-[15px] font-medium">
                            Chapter {chapter.chapterNumber}: {chapter.title}
                          </span>
                          {chapter.contextDescription && (
                            <span className="text-faint mt-0.5 block text-[13px]">
                              {chapter.contextDescription}
                            </span>
                          )}
                        </span>
                        <span className="border-line-strong text-body shrink-0 rounded-full border px-2.5 py-1 text-[13px] leading-none">
                          {chapter.usageType}
                        </span>
                      </a>
                    ))}
                  </div>
                </section>
              )}

            {/* Language Comparisons */}
            {topic.codeExamples.length > 0 && (
              <div className="mt-12">
                <ComparisonSection
                  topic={topic}
                  sourceLanguage={sourceLanguage}
                />
              </div>
            )}

            {/* Personal Experiences */}
            {topic.experiences.length > 0 && (
              <section className="mt-12" aria-labelledby="experience-heading">
                <h2 id="experience-heading" className={sectionHeading}>
                  <SectionIcon>
                    <MessageIcon size={17} />
                  </SectionIcon>
                  From my experience
                </h2>
                <div className="mt-5 grid gap-4">
                  {topic.experiences.map((exp, idx) => {
                    const meta = EXPERIENCE[exp.type] ?? EXPERIENCE_FALLBACK
                    const Icon = meta.Icon
                    return (
                      <div key={idx} className={`${card} p-5 sm:p-6`}>
                        <p
                          className={`${meta.accent} inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.06em]`}
                        >
                          <Icon size={15} />
                          {meta.label}
                        </p>
                        {exp.title && (
                          <h3 className="text-heading mt-2 text-[17px] font-semibold">
                            {exp.title}
                          </h3>
                        )}
                        <div className="mt-2">
                          <LearnMarkdown text={exp.content} size="sm" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Documentation Links */}
            {topic.docLinks.length > 0 && (
              <section className="border-line mt-12 border-t pt-8">
                <h2 className="text-heading flex items-center gap-2.5 text-[18px] font-semibold">
                  <span className="text-brand-a">
                    <BookIcon size={18} />
                  </span>
                  Learn More
                </h2>
                <ul className="mt-4 space-y-3">
                  {topic.docLinks.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link inline-flex items-center gap-1.5 text-[15px] font-medium hover:underline"
                      >
                        {link.title}
                        <ExternalLinkIcon size={14} />
                      </a>
                      <p className="text-faint mt-0.5 text-[14px]">
                        {DOC_LINK_LABEL[link.type] && (
                          <span className="text-muted">
                            {DOC_LINK_LABEL[link.type]}
                            {link.description && ' · '}
                          </span>
                        )}
                        {link.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Navigation */}
            <nav
              aria-label="Topic navigation"
              className="mt-12 grid gap-3 sm:grid-cols-2"
            >
              {topic.navigation?.previous ? (
                <Link
                  to="/learn-kotlin/$topicId"
                  params={{ topicId: topic.navigation.previous }}
                  search={{ lang }}
                  className={`${card} hover:border-line-strong group block p-5 transition-colors`}
                >
                  <NavCard
                    label="Previous Topic"
                    title={titleOf(topic.navigation.previous)}
                    align="left"
                  >
                    <ArrowLeftIcon size={14} />
                  </NavCard>
                </Link>
              ) : (
                <Link
                  to="/learn-kotlin"
                  className={`${card} hover:border-line-strong group block p-5 transition-colors`}
                >
                  <NavCard label="Back" title="All Topics" align="left">
                    <ArrowLeftIcon size={14} />
                  </NavCard>
                </Link>
              )}
              {topic.navigation?.next && (
                <Link
                  to="/learn-kotlin/$topicId"
                  params={{ topicId: topic.navigation.next }}
                  search={{ lang }}
                  className={`${card} hover:border-line-strong group block p-5 transition-colors sm:col-start-2`}
                >
                  <NavCard
                    label="Next Topic"
                    title={titleOf(topic.navigation.next)}
                    align="right"
                  >
                    <ArrowRightIcon size={14} />
                  </NavCard>
                </Link>
              )}
            </nav>
            {topic.navigation?.previous && (
              <Link
                to="/learn-kotlin"
                className="text-brand-a mt-6 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium hover:underline"
              >
                <ArrowLeftIcon size={15} />
                All Topics
              </Link>
            )}

            {/* Module siblings on small screens (the sidebar shows them on wide ones) */}
            {siblings.length > 1 && (
              <nav
                aria-label={`More in ${topic.module}`}
                className={`${card} mt-10 p-5 lg:hidden`}
              >
                <p className="text-faint mb-3 text-[12px] font-semibold tracking-[0.06em] uppercase">
                  More in {topic.module}
                </p>
                <ModuleTopicList
                  topics={siblings}
                  currentId={topic.id}
                  lang={lang}
                />
                <Link
                  to="/learn-kotlin/mindmap"
                  className="text-brand-a mt-4 inline-flex min-h-11 items-center gap-1.5 text-[14px] font-medium hover:underline"
                >
                  View in the learning map
                  <ArrowRightIcon size={15} />
                </Link>
              </nav>
            )}
          </article>
        </div>
      )}
    </AppShell>
  )
}

export const Route = createFileRoute({
  // Frozen sections answer with the site's 404 page (see config/features).
  component: LEARN_KOTLIN_ENABLED ? KotlinTopicPage : NotFound,
})

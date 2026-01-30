import AppShell from '@/components/AppShell'
import { useParams, Link, useSearch } from '@tanstack/react-router'
import {
  useKotlinTopicWithTiers,
  type SourceLanguage,
  type KotlinContentTier,
  type KotlinRunnableExample,
} from '@/lib/queries'
import { useEffect, useState, useMemo } from 'react'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'
import { MotionSection } from '@/components/MotionSection'
import {
  Button,
  Card,
  CardBody,
  Accordion,
  AccordionItem,
  Tabs,
  Tab,
  Chip,
} from '@heroui/react'

const STORAGE_KEY = 'kotlin-learning-source-language'
const TIER_STORAGE_KEY = 'kotlin-learning-selected-tier'

const TIER_CONFIG: Record<number, { name: string; icon: string; color: string }> = {
  1: { name: 'TL;DR', icon: '⚡', color: 'warning' },
  2: { name: 'Beginner', icon: '🌱', color: 'success' },
  3: { name: 'Intermediate', icon: '🔧', color: 'primary' },
  4: { name: 'Deep Dive', icon: '🔬', color: 'secondary' },
}

function getStoredLanguage(): SourceLanguage {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'java' || stored === 'csharp') return stored
  return null
}

function getStoredTier(): number {
  if (typeof window === 'undefined') return 2
  const stored = localStorage.getItem(TIER_STORAGE_KEY)
  const parsed = stored ? parseInt(stored, 10) : 2
  return parsed >= 1 && parsed <= 4 ? parsed : 2
}

function setStoredTier(tier: number) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TIER_STORAGE_KEY, tier.toString())
  }
}

function KotlinTopicPage() {
  const { topicId } = useParams({ from: '/learn-kotlin/$topicId' })
  const search = useSearch({ from: '/learn-kotlin/$topicId' }) as {
    lang?: string
    tier?: string
  }
  const [sourceLanguage, setSourceLanguage] = useState<SourceLanguage>(null)
  const [selectedTier, setSelectedTier] = useState<number>(2)

  useEffect(() => {
    const lang =
      (search.lang as SourceLanguage) || getStoredLanguage() || 'java'
    setSourceLanguage(lang)

    const tier = search.tier ? parseInt(search.tier, 10) : getStoredTier()
    if (tier >= 1 && tier <= 4) {
      setSelectedTier(tier)
    }
  }, [search.lang, search.tier])

  const handleTierChange = (tier: number) => {
    setSelectedTier(tier)
    setStoredTier(tier)
  }

  const { data: topic, isLoading, isError } = useKotlinTopicWithTiers(
    topicId,
    sourceLanguage,
    selectedTier
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

  useEffect(() => {
    if (topic?.title) {
      const canonicalUrl = `${SEO_DEFAULTS.siteUrl}/learn-kotlin/${topicId}`
      setHead({
        title: `${topic.title} — Learn Kotlin — ${SEO_DEFAULTS.siteName}`,
        description:
          topic.description || `Learn ${topic.title} in Kotlin`,
        canonical: canonicalUrl,
        og: {
          title: `${topic.title} — Learn Kotlin`,
          url: canonicalUrl,
        },
      })
    }
  }, [topic?.title, topic?.description, topicId])

  const getExperienceIcon = (type: string) => {
    switch (type) {
      case 'story':
        return '📖'
      case 'mistake':
        return '⚠️'
      case 'tip':
        return '💡'
      case 'warning':
        return '🚨'
      case 'opinion':
        return '🎯'
      default:
        return '💬'
    }
  }

  const getExperienceTitle = (type: string) => {
    switch (type) {
      case 'story':
        return "JIRI'S PRODUCTION STORY"
      case 'mistake':
        return "JIRI'S MISTAKE"
      case 'tip':
        return "JIRI'S TIP"
      case 'warning':
        return "JIRI'S WARNING"
      case 'opinion':
        return "JIRI'S OPINION"
      default:
        return "JIRI'S NOTE"
    }
  }

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, `<code>$1</code>`)
  }

  return (
    <AppShell path="Learn Kotlin / Topic">
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-r-transparent"></div>
            <p className="text-muted-foreground mt-4">Loading topic...</p>
          </div>
        </div>
      )}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <h3 className="text-lg font-semibold text-red-900">
            Failed to load topic
          </h3>
          <p className="mt-2 text-sm text-red-600">
            This topic may not exist or there was an error loading it.
          </p>
          <Button
            as={Link}
            to="/learn-kotlin"
            className="mt-6"
            variant="bordered"
          >
            Back to Topics
          </Button>
        </div>
      )}
      {topic && (
        <div className="grid gap-8">
          {/* Back Button */}
          <div>
            <Button
              as={Link}
              to="/learn-kotlin"
              variant="light"
              className="hover:underline"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Topics
            </Button>
          </div>

          {/* Header */}
          <MotionSection variant="fade-up">
            <div className="relative overflow-hidden rounded-3xl border border-purple-200/50 bg-white/40 p-8 shadow-lg ring-1 ring-purple-500/10 backdrop-blur md:p-12">
              <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-purple-400/20 via-blue-400/10 to-cyan-400/10 blur-3xl" />

              <div className="relative">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                    {topic.module}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      topic.difficulty === 'beginner'
                        ? 'bg-green-100 text-green-700'
                        : topic.difficulty === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-700'
                          : topic.difficulty === 'advanced'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {topic.difficulty}
                  </span>
                  {topic.partNumber && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                      Part {topic.partNumber}
                      {topic.partName && `: ${topic.partName}`}
                    </span>
                  )}
                  <span className="text-muted-foreground text-sm">
                    {totalReadingTime} min read
                  </span>
                </div>

                <h1 className="mt-4 text-3xl font-bold md:text-4xl">
                  <span className="bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    {topic.title}
                  </span>
                </h1>

                {topic.description && (
                  <p className="text-muted-foreground mt-4 text-lg">
                    {topic.description}
                  </p>
                )}
              </div>
            </div>
          </MotionSection>

          {/* Tier Selector */}
          {topic.availableTiers && topic.availableTiers.length > 1 && (
            <MotionSection variant="fade-up">
              <Card>
                <CardBody className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700">
                        Choose your depth
                      </h3>
                      <p className="text-xs text-gray-500">
                        Select how deep you want to dive into this topic
                      </p>
                    </div>
                    <Tabs
                      aria-label="Tier selection"
                      selectedKey={selectedTier.toString()}
                      onSelectionChange={(key) =>
                        handleTierChange(parseInt(key as string, 10))
                      }
                      color="primary"
                      variant="bordered"
                      classNames={{
                        tabList: 'gap-2',
                      }}
                    >
                      {topic.availableTiers.map((tier) => {
                        const config = TIER_CONFIG[tier]
                        const tierContent = topic.tiers.find(
                          (t) => t.tierLevel === tier
                        )
                        return (
                          <Tab
                            key={tier.toString()}
                            title={
                              <div className="flex items-center gap-2">
                                <span>{config?.icon}</span>
                                <span className="hidden sm:inline">
                                  {tierContent?.tierName || config?.name}
                                </span>
                                {tierContent && (
                                  <Chip size="sm" variant="flat">
                                    {tierContent.readingTimeMinutes}m
                                  </Chip>
                                )}
                              </div>
                            }
                          />
                        )
                      })}
                    </Tabs>
                  </div>
                </CardBody>
              </Card>
            </MotionSection>
          )}

          {/* Learning Objectives */}
          {currentTierContent?.learningObjectives &&
            currentTierContent.learningObjectives.length > 0 && (
              <MotionSection variant="fade-up">
                <Card className="border-l-4 border-l-green-500 bg-green-50/50">
                  <CardBody className="p-6">
                    <h3 className="flex items-center gap-2 font-bold text-green-800">
                      <span className="text-xl">🎯</span>
                      Learning Objectives
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {currentTierContent.learningObjectives.map((obj, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-green-700"
                        >
                          <svg
                            className="mt-1 h-4 w-4 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              </MotionSection>
            )}

          {/* Prerequisites */}
          {currentTierContent?.prerequisites &&
            currentTierContent.prerequisites.length > 0 && (
              <MotionSection variant="fade-up">
                <Card className="border-l-4 border-l-amber-500 bg-amber-50/50">
                  <CardBody className="p-6">
                    <h3 className="flex items-center gap-2 font-bold text-amber-800">
                      <span className="text-xl">📋</span>
                      Prerequisites
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {currentTierContent.prerequisites.map((prereq, idx) => (
                        <Link
                          key={idx}
                          to="/learn-kotlin/$topicId"
                          params={{ topicId: prereq }}
                          search={{ lang: sourceLanguage }}
                          className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-200"
                        >
                          {prereq.replace(/-/g, ' ')}
                        </Link>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </MotionSection>
            )}

          {/* Tier Content - Main Explanation */}
          {currentTierContent && (
            <MotionSection variant="fade-up">
              <Card>
                <CardBody className="p-6 md:p-8">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-purple-700">
                    <span className="text-2xl">
                      {TIER_CONFIG[selectedTier]?.icon || '📚'}
                    </span>
                    {currentTierContent.title || 'The Kotlin Way'}
                  </h2>
                  <div className="prose prose-gray mt-4 max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(currentTierContent.explanation),
                      }}
                    />
                  </div>

                  {/* Tier Code Examples */}
                  {currentTierContent.codeExamples &&
                    currentTierContent.codeExamples.length > 0 && (
                      <div className="mt-6 space-y-4">
                        {currentTierContent.codeExamples.map((code, idx) => (
                          <pre
                            key={idx}
                            className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100"
                          >
                            <code>{code}</code>
                          </pre>
                        ))}
                      </div>
                    )}
                </CardBody>
              </Card>
            </MotionSection>
          )}

          {/* Runnable Examples */}
          {currentExamples.length > 0 && (
            <MotionSection variant="fade-up">
              <Card>
                <CardBody className="p-6 md:p-8">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-blue-700">
                    <span className="text-2xl">🏃</span>
                    Try It Yourself
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Run these examples directly in your browser
                  </p>

                  <div className="mt-6 space-y-6">
                    {currentExamples.map((example, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-blue-200 bg-blue-50/30 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-blue-800">
                            {example.title}
                          </h4>
                          <Chip
                            size="sm"
                            color={
                              TIER_CONFIG[example.tierLevel]?.color as
                                | 'warning'
                                | 'success'
                                | 'primary'
                                | 'secondary'
                            }
                            variant="flat"
                          >
                            {TIER_CONFIG[example.tierLevel]?.name}
                          </Chip>
                        </div>
                        {example.description && (
                          <p className="mt-2 text-sm text-gray-600">
                            {example.description}
                          </p>
                        )}
                        <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                          <code>{example.code}</code>
                        </pre>
                        {example.expectedOutput && (
                          <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
                            <p className="text-xs font-medium text-green-700">
                              Expected Output:
                            </p>
                            <pre className="mt-1 text-sm text-green-800">
                              {example.expectedOutput}
                            </pre>
                          </div>
                        )}
                        {/* Kotlin Playground integration placeholder */}
                        <Button
                          className="mt-3"
                          color="primary"
                          variant="flat"
                          size="sm"
                          onPress={() => {
                            // Open in Kotlin Playground
                            const encoded = encodeURIComponent(example.code)
                            window.open(
                              `https://play.kotlinlang.org/#code=${encoded}`,
                              '_blank'
                            )
                          }}
                        >
                          <svg
                            className="mr-1 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Run in Kotlin Playground
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </MotionSection>
          )}

          {/* Expense Tracker Chapters */}
          {topic.expenseTrackerChapters &&
            topic.expenseTrackerChapters.length > 0 && (
              <MotionSection variant="fade-up">
                <Card className="border-l-4 border-l-cyan-500 bg-cyan-50/50">
                  <CardBody className="p-6">
                    <h3 className="flex items-center gap-2 font-bold text-cyan-800">
                      <span className="text-xl">💰</span>
                      Used in Expense Tracker Project
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      See this topic in action in the hands-on project
                    </p>
                    <div className="mt-4 space-y-2">
                      {topic.expenseTrackerChapters.map((chapter, idx) => (
                        <Link
                          key={idx}
                          to="/learn-kotlin/expense-tracker/$chapterNumber"
                          params={{
                            chapterNumber: chapter.chapterNumber.toString(),
                          }}
                          className="flex items-center justify-between rounded-lg border border-cyan-200 bg-white p-3 transition-colors hover:bg-cyan-100"
                        >
                          <div>
                            <span className="font-medium text-cyan-700">
                              Chapter {chapter.chapterNumber}: {chapter.title}
                            </span>
                            {chapter.contextDescription && (
                              <p className="text-xs text-gray-500">
                                {chapter.contextDescription}
                              </p>
                            )}
                          </div>
                          <Chip
                            size="sm"
                            variant="flat"
                            color={
                              chapter.usageType === 'primary'
                                ? 'primary'
                                : chapter.usageType === 'supporting'
                                  ? 'secondary'
                                  : 'default'
                            }
                          >
                            {chapter.usageType}
                          </Chip>
                        </Link>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </MotionSection>
            )}

          {/* Language Comparisons */}
          {topic.codeExamples.length > 0 && (
            <MotionSection variant="fade-up">
              <Card>
                <CardBody className="p-6 md:p-8">
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    {sourceLanguage === 'java' ? (
                      <>
                        <span className="text-2xl">☕</span>
                        <span className="text-orange-700">
                          Java Evolution Timeline
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">🔷</span>
                        <span className="text-purple-700">
                          How You Know It (C#)
                        </span>
                      </>
                    )}
                  </h2>

                  <Accordion className="mt-4" variant="bordered">
                    {topic.codeExamples.map((example, idx) => (
                      <AccordionItem
                        key={idx}
                        title={
                          <span className="font-medium">
                            {example.versionLabel || example.language}
                          </span>
                        }
                      >
                        <div className="space-y-4 pb-4">
                          <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                            <code>{example.code}</code>
                          </pre>
                          <div
                            className="prose prose-sm prose-gray max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: renderMarkdown(example.explanation),
                            }}
                          />
                        </div>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardBody>
              </Card>
            </MotionSection>
          )}

          {/* Personal Experiences */}
          {topic.experiences.length > 0 && (
            <MotionSection variant="fade-up">
              <div className="space-y-4">
                {topic.experiences.map((exp, idx) => (
                  <Card
                    key={idx}
                    className="border-l-4 border-l-purple-500 bg-purple-50/50"
                  >
                    <CardBody className="p-6">
                      <h3 className="flex items-center gap-2 font-bold text-purple-800">
                        <span className="text-xl">{getExperienceIcon(exp.type)}</span>
                        {exp.title || getExperienceTitle(exp.type)}
                      </h3>
                      <div
                        className="prose prose-sm prose-gray mt-3 max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(exp.content),
                        }}
                      />
                    </CardBody>
                  </Card>
                ))}
              </div>
            </MotionSection>
          )}

          {/* Documentation Links */}
          {topic.docLinks.length > 0 && (
            <MotionSection variant="fade-up">
              <Card>
                <CardBody className="p-6">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <span className="text-xl">📚</span>
                    Learn More
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {topic.docLinks.map((link, idx) => (
                      <li key={idx}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 text-blue-600 hover:underline"
                        >
                          <span>
                            {link.type === 'kotlin_official'
                              ? '🟣'
                              : link.type === 'java_official'
                                ? '☕'
                                : link.type === 'csharp_official'
                                  ? '🔷'
                                  : '📖'}
                          </span>
                          <span>{link.title}</span>
                          <svg
                            className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                        {link.description && (
                          <p className="text-muted-foreground ml-7 text-sm">
                            {link.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </MotionSection>
          )}

          {/* Navigation */}
          <MotionSection variant="fade-up">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white/60 p-4">
              {topic.navigation?.previous ? (
                <Button
                  as={Link}
                  to="/learn-kotlin/$topicId"
                  params={{ topicId: topic.navigation.previous }}
                  search={{ lang: sourceLanguage }}
                  variant="bordered"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous Topic
                </Button>
              ) : (
                <div />
              )}

              <Button as={Link} to="/learn-kotlin" variant="light">
                All Topics
              </Button>

              {topic.navigation?.next ? (
                <Button
                  as={Link}
                  to="/learn-kotlin/$topicId"
                  params={{ topicId: topic.navigation.next }}
                  search={{ lang: sourceLanguage }}
                  color="primary"
                >
                  Next Topic
                  <svg
                    className="h-4 w-4"
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
                </Button>
              ) : (
                <div />
              )}
            </div>
          </MotionSection>
        </div>
      )}
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: KotlinTopicPage,
})

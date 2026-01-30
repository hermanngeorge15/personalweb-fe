import AppShell from '@/components/AppShell'
import { useParams, Link, useSearch } from '@tanstack/react-router'
import { useKotlinTopic, type SourceLanguage } from '@/lib/queries'
import { useEffect, useState } from 'react'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'
import { MotionSection } from '@/components/MotionSection'
import { Button, Card, CardBody, Accordion, AccordionItem } from '@heroui/react'

const STORAGE_KEY = 'kotlin-learning-source-language'

function getStoredLanguage(): SourceLanguage {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'java' || stored === 'csharp') return stored
  return null
}

function KotlinTopicPage() {
  const { topicId } = useParams({ from: '/learn-kotlin/$topicId' })
  const search = useSearch({ from: '/learn-kotlin/$topicId' }) as {
    lang?: string
  }
  const [sourceLanguage, setSourceLanguage] = useState<SourceLanguage>(null)

  useEffect(() => {
    const lang =
      (search.lang as SourceLanguage) || getStoredLanguage() || 'java'
    setSourceLanguage(lang)
  }, [search.lang])

  const { data: topic, isLoading, isError } = useKotlinTopic(topicId, sourceLanguage)

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
                  <span className="text-muted-foreground text-sm">
                    {topic.readingTimeMinutes} min read
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

          {/* Kotlin Explanation */}
          <MotionSection variant="fade-up">
            <Card>
              <CardBody className="p-6 md:p-8">
                <h2 className="flex items-center gap-2 text-xl font-bold text-purple-700">
                  <span className="text-2xl">🎯</span>
                  The Kotlin Way
                </h2>
                <div className="prose prose-gray mt-4 max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: topic.kotlinExplanation
                        .replace(/\n/g, '<br>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/`(.*?)`/g, '<code>$1</code>'),
                    }}
                  />
                </div>

                {/* Kotlin Code */}
                <div className="mt-6">
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                    <code>{topic.kotlinCode}</code>
                  </pre>
                </div>
              </CardBody>
            </Card>
          </MotionSection>

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
                              __html: example.explanation
                                .replace(/\n/g, '<br>')
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/`(.*?)`/g, '<code>$1</code>'),
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
                          __html: exp.content
                            .replace(/\n/g, '<br>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/`(.*?)`/g, '<code>$1</code>'),
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

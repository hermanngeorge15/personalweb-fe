import AppShell from '@/components/AppShell'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'
import { MotionSection } from '@/components/MotionSection'
import { Button, Card, CardBody } from '@heroui/react'
import { H1 } from '@/components/ui/Typography'
import { useKotlinTopicsByModule, type SourceLanguage } from '@/lib/queries'

const STORAGE_KEY = 'kotlin-learning-source-language'

function getStoredLanguage(): SourceLanguage {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'java' || stored === 'csharp') return stored
  return null
}

function setStoredLanguage(lang: SourceLanguage) {
  if (typeof window === 'undefined') return
  if (lang) {
    localStorage.setItem(STORAGE_KEY, lang)
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

function LearnKotlinIndex() {
  const [selectedLanguage, setSelectedLanguage] = useState<SourceLanguage>(null)
  const { data: modules, isLoading } = useKotlinTopicsByModule()

  useEffect(() => {
    const stored = getStoredLanguage()
    if (stored) setSelectedLanguage(stored)
  }, [])

  useEffect(() => {
    setHead({
      title: `Learn Kotlin — ${SEO_DEFAULTS.siteName}`,
      description:
        'Interactive Kotlin learning platform for Java and C# developers. Learn Kotlin with personalized comparisons to your language.',
      canonical: `${SEO_DEFAULTS.siteUrl}/learn-kotlin`,
      og: {
        title: `Learn Kotlin — ${SEO_DEFAULTS.siteName}`,
        url: `${SEO_DEFAULTS.siteUrl}/learn-kotlin`,
        image: SEO_DEFAULTS.image,
        description:
          'Interactive Kotlin learning platform for Java and C# developers',
      },
    })
  }, [])

  const handleSelectLanguage = (lang: SourceLanguage) => {
    setSelectedLanguage(lang)
    setStoredLanguage(lang)
  }

  // If no language selected, show language selection screen
  if (!selectedLanguage) {
    return (
      <AppShell path="Learn Kotlin">
        <MotionSection variant="slide-up">
          <section className="relative overflow-hidden rounded-3xl border border-purple-200/50 bg-white/40 p-6 shadow-lg ring-1 ring-purple-500/10 backdrop-blur md:p-10">
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-purple-400/30 via-blue-400/20 to-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-tr from-orange-400/20 via-red-400/20 to-pink-400/20 blur-3xl" />

            <div className="relative text-center">
              <H1 className="bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Learn Kotlin Your Way
              </H1>
              <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
                From a developer who&apos;s been in your shoes. See Kotlin
                comparisons in YOUR language.
              </p>

              <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
                {/* Java Developer Card */}
                <button
                  onClick={() => handleSelectLanguage('java')}
                  className="group text-left"
                >
                  <Card className="h-full cursor-pointer border-2 border-transparent transition-all hover:-translate-y-2 hover:border-orange-400 hover:shadow-xl">
                    <CardBody className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-3xl">
                          <span role="img" aria-label="coffee">
                            ☕
                          </span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-orange-600">
                            I&apos;m a Java Developer
                          </h2>
                          <p className="text-muted-foreground mt-1">
                            Java 8 → 11 → 17 → 21 → Kotlin
                          </p>
                        </div>
                      </div>

                      <ul className="mt-6 space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          See Java evolution timeline for each feature
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          Understand what Java is missing
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          Real migration experiences
                        </li>
                      </ul>

                      <div className="mt-6 flex items-center gap-2 text-orange-600 transition-transform group-hover:translate-x-2">
                        <span className="font-medium">Start Learning</span>
                        <svg
                          className="h-5 w-5"
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
                      </div>
                    </CardBody>
                  </Card>
                </button>

                {/* C# Developer Card */}
                <button
                  onClick={() => handleSelectLanguage('csharp')}
                  className="group text-left"
                >
                  <Card className="h-full cursor-pointer border-2 border-transparent transition-all hover:-translate-y-2 hover:border-purple-400 hover:shadow-xl">
                    <CardBody className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-3xl">
                          <span role="img" aria-label="diamond">
                            🔷
                          </span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-purple-600">
                            I&apos;m a C# Developer
                          </h2>
                          <p className="text-muted-foreground mt-1">
                            C# → Kotlin (you&apos;ll feel at home!)
                          </p>
                        </div>
                      </div>

                      <ul className="mt-6 space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          Direct C# to Kotlin comparisons
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          Highlight similarities (very similar!)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          Migration tips for .NET developers
                        </li>
                      </ul>

                      <div className="mt-6 flex items-center gap-2 text-purple-600 transition-transform group-hover:translate-x-2">
                        <span className="font-medium">Start Learning</span>
                        <svg
                          className="h-5 w-5"
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
                      </div>
                    </CardBody>
                  </Card>
                </button>
              </div>

              <p className="text-muted-foreground mt-8 text-sm">
                You can change your language preference at any time
              </p>
            </div>
          </section>
        </MotionSection>
      </AppShell>
    )
  }

  // Language selected - show topics
  return (
    <AppShell path="Learn Kotlin">
      <MotionSection variant="slide-up">
        <section className="relative overflow-hidden rounded-3xl border border-purple-200/50 bg-white/40 p-6 shadow-lg ring-1 ring-purple-500/10 backdrop-blur md:p-10">
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-purple-400/30 via-blue-400/20 to-cyan-400/20 blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <H1 className="bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Learn Kotlin
                </H1>
                <p className="text-muted-foreground mt-2">
                  Viewing as{' '}
                  <span className="font-medium text-gray-900">
                    {selectedLanguage === 'java'
                      ? 'Java Developer'
                      : 'C# Developer'}
                  </span>
                </p>
              </div>
              <Button
                variant="bordered"
                size="sm"
                onClick={() => handleSelectLanguage(null)}
              >
                Change Language
              </Button>
            </div>

            {isLoading && (
              <div className="mt-8 flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-r-transparent"></div>
              </div>
            )}

            {modules && modules.length === 0 && (
              <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
                <p className="text-gray-600">
                  Topics coming soon! Check back later.
                </p>
              </div>
            )}

            {modules && modules.length > 0 && (
              <div className="mt-8 space-y-8">
                {modules.map((mod) => (
                  <div key={mod.name}>
                    <h2 className="text-xl font-bold text-gray-900">
                      {mod.name}
                    </h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {mod.topics.map((topic) => (
                        <Link
                          key={topic.id}
                          to="/learn-kotlin/$topicId"
                          params={{ topicId: topic.id }}
                          search={{ lang: selectedLanguage }}
                          className="group"
                        >
                          <Card className="h-full cursor-pointer transition-all hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg">
                            <CardBody className="p-4">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
                                  {topic.title}
                                </h3>
                                <span
                                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
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
                              </div>
                              {topic.description && (
                                <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                                  {topic.description}
                                </p>
                              )}
                              <div className="text-muted-foreground mt-3 flex items-center gap-1 text-xs">
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
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span>{topic.readingTimeMinutes} min</span>
                              </div>
                            </CardBody>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </MotionSection>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: LearnKotlinIndex,
})

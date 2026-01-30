import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Card, CardBody, Button, Chip, Spinner } from '@heroui/react'
import { useKotlinTopicsByModule, type SourceLanguage } from '../../lib/queries'

export const Route = createFileRoute({
  component: LearnKotlinIndex,
})

const difficultyColors: Record<string, 'primary' | 'success' | 'warning' | 'danger'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger',
  expert: 'primary',
}

function LearnKotlinIndex() {
  const [sourceLanguage, setSourceLanguage] = useState<SourceLanguage>(null)
  const { data: modules, isLoading, error } = useKotlinTopicsByModule()

  if (!sourceLanguage) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Learn Kotlin</h1>
          <p className="mb-8 text-xl text-gray-600">
            Interactive Kotlin learning for experienced developers
          </p>

          <h2 className="mb-6 text-2xl font-semibold">What's your background?</h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              color="primary"
              variant="shadow"
              onPress={() => setSourceLanguage('java')}
              className="min-w-[200px]"
            >
              Java Developer
            </Button>
            <Button
              size="lg"
              color="secondary"
              variant="shadow"
              onPress={() => setSourceLanguage('csharp')}
              className="min-w-[200px]"
            >
              C# Developer
            </Button>
          </div>

          <div className="mt-8">
            <Link to="/learn-kotlin/mindmap">
              <Button variant="flat" color="default">
                Preview Learning Mind Map
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          Failed to load topics. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Learn Kotlin</h1>
          <p className="text-gray-600">
            Coming from{' '}
            <span className="font-semibold">
              {sourceLanguage === 'java' ? 'Java' : 'C#'}
            </span>
            <Button
              size="sm"
              variant="light"
              onPress={() => setSourceLanguage(null)}
              className="ml-2"
            >
              Change
            </Button>
          </p>
        </div>
        <Link to="/learn-kotlin/mindmap">
          <Button variant="flat">View Mind Map</Button>
        </Link>
      </div>

      <div className="space-y-8">
        {modules?.map((module) => (
          <div key={module.name}>
            <h2 className="mb-4 text-xl font-semibold text-gray-800">{module.name}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {module.topics.map((topic) => (
                <Link
                  key={topic.id}
                  to="/learn-kotlin/$topicId"
                  params={{ topicId: topic.id }}
                  search={{ source: sourceLanguage || undefined }}
                >
                  <Card
                    isPressable
                    className="h-full transition-shadow hover:shadow-lg"
                  >
                    <CardBody className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                        <Chip
                          size="sm"
                          color={difficultyColors[topic.difficulty] || 'default'}
                          variant="flat"
                        >
                          {topic.difficulty}
                        </Chip>
                      </div>
                      {topic.description && (
                        <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                          {topic.description}
                        </p>
                      )}
                      <div className="text-xs text-gray-400">
                        {topic.readingTimeMinutes} min read
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

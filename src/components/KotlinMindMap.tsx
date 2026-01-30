import { Link } from '@tanstack/react-router'
import { useKotlinMindMap, type MindMapData, type SourceLanguage } from '@/lib/queries'
import { useMemo, useState } from 'react'

type ModuleGroup = {
  name: string
  color: string
  topics: { id: string; title: string; difficulty: string }[]
}

const MODULE_COLORS: Record<string, string> = {
  'Classes & Objects Fundamentals': 'from-blue-500 to-blue-600',
  'Class Types & Data Modeling': 'from-purple-500 to-purple-600',
  'Variables & Properties': 'from-green-500 to-green-600',
  Functions: 'from-orange-500 to-orange-600',
  'Collections & Sequences': 'from-cyan-500 to-cyan-600',
  'Advanced Topics': 'from-red-500 to-red-600',
}

const MODULE_BG_COLORS: Record<string, string> = {
  'Classes & Objects Fundamentals': 'bg-blue-50 border-blue-200 hover:bg-blue-100',
  'Class Types & Data Modeling': 'bg-purple-50 border-purple-200 hover:bg-purple-100',
  'Variables & Properties': 'bg-green-50 border-green-200 hover:bg-green-100',
  Functions: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
  'Collections & Sequences': 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100',
  'Advanced Topics': 'bg-red-50 border-red-200 hover:bg-red-100',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-500',
  intermediate: 'bg-yellow-500',
  advanced: 'bg-orange-500',
  expert: 'bg-red-500',
}

type KotlinMindMapProps = {
  selectedLanguage: SourceLanguage
}

export function KotlinMindMap({ selectedLanguage }: KotlinMindMapProps) {
  const { data: mindMapData, isLoading } = useKotlinMindMap()
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null)

  const moduleGroups = useMemo(() => {
    if (!mindMapData) return []

    const groups: Record<string, ModuleGroup> = {}

    mindMapData.topics.forEach((topic) => {
      if (!groups[topic.module]) {
        groups[topic.module] = {
          name: topic.module,
          color: MODULE_COLORS[topic.module] || 'from-gray-500 to-gray-600',
          topics: [],
        }
      }
      groups[topic.module].topics.push({
        id: topic.id,
        title: topic.title,
        difficulty: topic.difficulty,
      })
    })

    return Object.values(groups)
  }, [mindMapData])

  const dependencyMap = useMemo(() => {
    if (!mindMapData) return new Map<string, string[]>()

    const map = new Map<string, string[]>()
    mindMapData.dependencies.forEach((dep) => {
      const existing = map.get(dep.from) || []
      existing.push(dep.to)
      map.set(dep.from, existing)
    })
    return map
  }, [mindMapData])

  const getConnectedTopics = (topicId: string): Set<string> => {
    const connected = new Set<string>()
    connected.add(topicId)

    // Add topics this one depends on
    mindMapData?.dependencies.forEach((dep) => {
      if (dep.from === topicId) {
        connected.add(dep.to)
      }
      if (dep.to === topicId) {
        connected.add(dep.from)
      }
    })

    return connected
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-r-transparent"></div>
      </div>
    )
  }

  if (!mindMapData || mindMapData.topics.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-600">Mind map data not available.</p>
      </div>
    )
  }

  const connectedTopics = hoveredTopic ? getConnectedTopics(hoveredTopic) : null

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <span className="text-sm font-medium text-gray-700">Difficulty:</span>
        <div className="flex flex-wrap gap-3">
          {Object.entries(DIFFICULTY_COLORS).map(([level, color]) => (
            <div key={level} className="flex items-center gap-1.5">
              <div className={`h-3 w-3 rounded-full ${color}`}></div>
              <span className="text-xs text-gray-600 capitalize">{level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mind Map Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {moduleGroups.map((group) => (
          <div
            key={group.name}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            {/* Module Header */}
            <div
              className={`mb-4 rounded-lg bg-gradient-to-r ${group.color} px-4 py-2`}
            >
              <h3 className="font-semibold text-white">{group.name}</h3>
            </div>

            {/* Topics */}
            <div className="space-y-2">
              {group.topics.map((topic) => {
                const isHighlighted =
                  !connectedTopics || connectedTopics.has(topic.id)
                const prerequisites = dependencyMap.get(topic.id) || []

                return (
                  <Link
                    key={topic.id}
                    to="/learn-kotlin/$topicId"
                    params={{ topicId: topic.id }}
                    search={{ lang: selectedLanguage }}
                    className={`block rounded-lg border p-3 transition-all ${
                      MODULE_BG_COLORS[group.name] ||
                      'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    } ${
                      !isHighlighted ? 'opacity-30' : ''
                    }`}
                    onMouseEnter={() => setHoveredTopic(topic.id)}
                    onMouseLeave={() => setHoveredTopic(null)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Difficulty indicator */}
                      <div
                        className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                          DIFFICULTY_COLORS[topic.difficulty] || 'bg-gray-400'
                        }`}
                        title={topic.difficulty}
                      ></div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {topic.title}
                        </h4>

                        {/* Prerequisites */}
                        {prerequisites.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            <span className="text-xs text-gray-500">
                              Requires:
                            </span>
                            {prerequisites.map((prereq) => {
                              const prereqTopic = mindMapData.topics.find(
                                (t) => t.id === prereq
                              )
                              return (
                                <span
                                  key={prereq}
                                  className="inline-flex items-center rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-700"
                                >
                                  {prereqTopic?.title || prereq}
                                </span>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <svg
                        className="h-5 w-5 shrink-0 text-gray-400"
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
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <p className="text-center text-sm text-gray-500">
        Hover over a topic to see its connections. Click to view the lesson.
      </p>
    </div>
  )
}

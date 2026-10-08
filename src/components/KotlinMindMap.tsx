import { Link } from '@tanstack/react-router'
import { type MindMapData, type SourceLanguage } from '@/lib/queries'
import { useMemo, useState } from 'react'
import { ArrowRightIcon } from '@/components/icons'
import { difficultyDotClass } from '@/components/learn/Difficulty'

type ModuleGroup = {
  name: string
  topics: { id: string; title: string; difficulty: string }[]
}

type KotlinMindMapProps = {
  data: MindMapData
  selectedLanguage: SourceLanguage
  /** Lower-cased search text; topics that don't match are hidden. */
  query?: string
}

/**
 * "By module" view of the learning map: one card per module, each topic
 * linking to its lesson. Hovering or focusing a topic highlights the topics it
 * depends on or unlocks and fades the rest.
 */
export function KotlinMindMap({
  data,
  selectedLanguage,
  query = '',
}: KotlinMindMapProps) {
  const [activeTopic, setActiveTopic] = useState<string | null>(null)

  const moduleGroups = useMemo(() => {
    const groups: Record<string, ModuleGroup> = {}
    data.topics.forEach((topic) => {
      if (query && !topic.title.toLowerCase().includes(query)) return
      if (!groups[topic.module]) {
        groups[topic.module] = { name: topic.module, topics: [] }
      }
      groups[topic.module].topics.push({
        id: topic.id,
        title: topic.title,
        difficulty: topic.difficulty,
      })
    })
    return Object.values(groups)
  }, [data, query])

  const titleById = useMemo(
    () => new Map(data.topics.map((topic) => [topic.id, topic.title])),
    [data],
  )

  // Prerequisites of each topic (dependency `from` needs `to`, as the page always read it).
  const dependencyMap = useMemo(() => {
    const map = new Map<string, string[]>()
    data.dependencies.forEach((dep) => {
      const existing = map.get(dep.from) || []
      existing.push(dep.to)
      map.set(dep.from, existing)
    })
    return map
  }, [data])

  const connectedTopics = useMemo(() => {
    if (!activeTopic) return null
    const connected = new Set<string>([activeTopic])
    data.dependencies.forEach((dep) => {
      if (dep.from === activeTopic) connected.add(dep.to)
      if (dep.to === activeTopic) connected.add(dep.from)
    })
    return connected
  }, [activeTopic, data])

  if (moduleGroups.length === 0) {
    return (
      <div className="border-line bg-subtle rounded-2xl border px-6 py-14 text-center">
        <p className="text-heading font-semibold">No topic matches “{query}”</p>
        <p className="text-faint mt-2 text-sm">Try a shorter search.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] items-start gap-4">
        {moduleGroups.map((group) => {
          const moduleActive =
            !connectedTopics ||
            group.topics.some((topic) => connectedTopics.has(topic.id))
          return (
            <section
              key={group.name}
              aria-label={group.name}
              className={`border-line bg-card rounded-2xl border p-[18px] transition-opacity duration-200 ${
                moduleActive ? '' : 'opacity-50'
              }`}
            >
              <h2 className="text-heading text-base font-semibold">
                {group.name}
              </h2>
              <ul className="mt-3 flex flex-col gap-1.5">
                {group.topics.map((topic) => {
                  const isActive = topic.id === activeTopic
                  const isConnected =
                    !!connectedTopics && connectedTopics.has(topic.id)
                  const isFaded = !!connectedTopics && !isConnected
                  const prerequisites = dependencyMap.get(topic.id) || []
                  return (
                    <li key={topic.id}>
                      <Link
                        to="/learn-kotlin/$topicId"
                        params={{ topicId: topic.id }}
                        search={{ lang: selectedLanguage || undefined }}
                        onMouseEnter={() => setActiveTopic(topic.id)}
                        onMouseLeave={() => setActiveTopic(null)}
                        onFocus={() => setActiveTopic(topic.id)}
                        onBlur={() => setActiveTopic(null)}
                        className={`group flex min-h-11 items-start gap-2.5 rounded-[10px] border px-3 py-2.5 text-[14px] transition-all duration-150 ${
                          isActive
                            ? 'bg-invert text-on-invert border-transparent'
                            : isConnected
                              ? 'border-brand-a/60 bg-brand-a/5 text-ink'
                              : 'border-line-strong text-body hover:text-ink'
                        } ${isFaded ? 'opacity-40' : ''}`}
                      >
                        <span
                          aria-hidden="true"
                          title={topic.difficulty}
                          className={`mt-[7px] size-2 shrink-0 rounded-full ${difficultyDotClass(topic.difficulty)}`}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block leading-snug font-medium">
                            {topic.title}
                            <span className="sr-only">
                              , {topic.difficulty}
                            </span>
                          </span>
                          {prerequisites.length > 0 && (
                            <span
                              className={`mt-1 block text-[13px] leading-snug ${
                                isActive ? 'text-on-invert/80' : 'text-faint'
                              }`}
                            >
                              Requires:{' '}
                              {prerequisites
                                .map((id) => titleById.get(id) || id)
                                .join(', ')}
                            </span>
                          )}
                        </span>
                        <span
                          className={`mt-0.5 shrink-0 ${isActive ? '' : 'text-fainter'}`}
                        >
                          <ArrowRightIcon size={15} />
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>

      <p className="text-faint mt-5 text-center text-[14px]">
        Hover over a topic to see its connections. Click to view the lesson.
      </p>
    </div>
  )
}

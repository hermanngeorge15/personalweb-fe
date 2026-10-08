import { Link } from '@tanstack/react-router'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import { MutationStatus, clearSaved } from '@/components/admin/MutationStatus'
import { DifficultyOptions } from '@/components/admin/AdminForm'
import { formInt } from '@/lib/adminFormat'
import {
  useKotlinTopicsAdmin,
  useCreateKotlinTopic,
  useDeleteKotlinTopic,
} from '@/lib/queries'

function AdminKotlinTopics() {
  const { data, isLoading, isError } = useKotlinTopicsAdmin()
  const createTopic = useCreateKotlinTopic()
  const deleteTopic = useDeleteKotlinTopic()

  // Group topics by module
  const groupedTopics = data?.reduce(
    (acc, topic) => {
      const module = topic.module || 'Other'
      if (!acc[module]) acc[module] = []
      acc[module].push(topic)
      return acc
    },
    {} as Record<string, typeof data>,
  )

  return (
    <AppShell path="Admin / Kotlin Topics">
      <section className="grid gap-6 md:gap-8">
        <h1 className="text-2xl font-semibold tracking-tight">Kotlin Topics</h1>

        <form
          onChange={() => clearSaved(createTopic)}
          className="grid gap-2 rounded border p-3"
          onSubmit={async (e) => {
            e.preventDefault()
            // currentTarget is null after an await, so keep the form for reset().
            const form = e.currentTarget as HTMLFormElement
            const fd = new FormData(e.currentTarget as HTMLFormElement)
            const id = String(fd.get('id') ?? '')
            const title = String(fd.get('title') ?? '')
            const module = String(fd.get('module') ?? '')
            const difficulty = String(fd.get('difficulty') ?? 'beginner')
            const description = String(fd.get('description') ?? '')
            const kotlinExplanation = String(fd.get('kotlinExplanation') ?? '')
            const kotlinCode = String(fd.get('kotlinCode') ?? '')
            const readingTimeMinutes = formInt(fd, 'readingTimeMinutes')
            const orderIndex = formInt(fd, 'orderIndex')

            if (!id || !title || !module || !kotlinExplanation || !kotlinCode)
              return
            if (readingTimeMinutes === null || orderIndex === null) return

            try {
              await createTopic.mutateAsync({
                id,
                title,
                module,
                difficulty,
                description: description || undefined,
                kotlinExplanation,
                kotlinCode,
                readingTimeMinutes,
                orderIndex,
                // The backend reads missing fields as null rather than using its defaults
                // (no Jackson Kotlin module), so send them explicitly.
                contentStructure: 'tiered',
                maxTierLevel: 2,
              })
              form.reset()
            } catch {
              // shown by MutationStatus
            }
          }}
        >
          <div className="grid gap-2 md:grid-cols-3">
            <input
              name="id"
              placeholder="ID (e.g., null-safety)"
              className="rounded border p-2"
              required
            />
            <input
              name="title"
              placeholder="Title"
              className="rounded border p-2"
              required
            />
            <input
              name="module"
              placeholder="Module (e.g., OOP Fundamentals)"
              className="rounded border p-2"
              required
            />
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            <select name="difficulty" className="rounded border p-2">
              <DifficultyOptions />
            </select>
            <input
              name="readingTimeMinutes"
              type="number"
              placeholder="Reading time (min)"
              defaultValue={10}
              min={1}
              step={1}
              className="rounded border p-2"
              required
            />
            <input
              name="orderIndex"
              type="number"
              placeholder="Order index"
              defaultValue={0}
              min={0}
              step={1}
              className="rounded border p-2"
              required
            />
          </div>
          <input
            name="description"
            placeholder="Description (optional)"
            className="rounded border p-2"
          />
          <textarea
            name="kotlinExplanation"
            placeholder="Kotlin Explanation (Markdown)"
            className="min-h-[100px] rounded border p-2"
            required
          />
          <textarea
            name="kotlinCode"
            placeholder="Kotlin Code Example"
            className="min-h-[100px] rounded border p-2 font-mono text-sm"
            required
          />
          <div>
            <button
              type="submit"
              className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
              disabled={createTopic.isPending}
            >
              {createTopic.isPending ? 'Creating…' : 'Create Topic'}
            </button>{' '}
            <MutationStatus
              isSuccess={createTopic.isSuccess}
              error={createTopic.error}
            />
          </div>
        </form>

        {isLoading && <div>Loading…</div>}
        {isError && <div>Failed to load topics.</div>}

        {groupedTopics && (
          <div className="grid gap-6">
            {Object.entries(groupedTopics).map(([module, topics]) => (
              <div key={module} className="rounded border p-4">
                <h2 className="mb-3 text-lg font-semibold">{module}</h2>
                <ul className="grid gap-2">
                  {topics?.map((topic) => (
                    <li
                      key={topic.id}
                      className="flex items-center justify-between rounded bg-gray-50 p-3 dark:bg-gray-800"
                    >
                      <div>
                        <div className="font-medium">{topic.title}</div>
                        <div className="text-muted-foreground text-sm">
                          {topic.id} • {topic.difficulty} •{' '}
                          {topic.readingTimeMinutes} min
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link
                          to="/admin/kotlin/topics/$id"
                          params={{ id: topic.id }}
                          className="underline"
                        >
                          Edit
                        </Link>
                        <button
                          className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50"
                          onClick={async () => {
                            if (
                              confirm(
                                `Delete topic "${topic.title}"? This cannot be undone.`,
                              )
                            ) {
                              await deleteTopic.mutateAsync({ id: topic.id })
                            }
                          }}
                          disabled={deleteTopic.isPending}
                        >
                          {deleteTopic.isPending ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  )
}

export const Route = createFileRoute({
  beforeLoad: async () => {
    await ensureKeycloakAuth()
    return null
  },
  component: AdminKotlinTopics,
})

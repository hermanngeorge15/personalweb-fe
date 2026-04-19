import { useEffect, useMemo } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import { useKotlinTopicsAdmin, useUpdateKotlinTopic } from '@/lib/queries'

function AdminKotlinTopicEdit() {
  const { id } = useParams({ from: '/admin/kotlin/topics/$id' })
  const list = useKotlinTopicsAdmin()
  const update = useUpdateKotlinTopic()

  const topic = useMemo(
    () => list.data?.find((t) => t.id === id),
    [list.data, id],
  )

  useEffect(() => {
    if (!list.data && !list.isFetching) list.refetch()
  }, [list])

  return (
    <AppShell path="Admin / Kotlin Topics / Edit">
      <section className="grid gap-6 md:gap-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/kotlin/topics" className="text-blue-600 underline">
            &larr; Back to Topics
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Topic</h1>
        </div>

        {!topic && (list.isLoading || list.isFetching) && <div>Loading…</div>}
        {!topic && list.isError && <div>Failed to load topic.</div>}

        {topic && (
          <form
            className="grid gap-3 rounded border p-4"
            onSubmit={async (e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget as HTMLFormElement)

              await update.mutateAsync({
                id: topic.id,
                title: String(fd.get('title') ?? topic.title),
                module: String(fd.get('module') ?? topic.module),
                difficulty: String(fd.get('difficulty') ?? topic.difficulty),
                description: String(fd.get('description') ?? '') || undefined,
                kotlinExplanation: String(
                  fd.get('kotlinExplanation') ?? topic.kotlinExplanation,
                ),
                kotlinCode: String(fd.get('kotlinCode') ?? topic.kotlinCode),
                readingTimeMinutes: parseInt(
                  String(fd.get('readingTimeMinutes') ?? topic.readingTimeMinutes),
                  10,
                ),
                orderIndex: parseInt(
                  String(fd.get('orderIndex') ?? topic.orderIndex),
                  10,
                ),
                partNumber: fd.get('partNumber')
                  ? parseInt(String(fd.get('partNumber')), 10)
                  : undefined,
                partName: String(fd.get('partName') ?? '') || undefined,
                contentStructure:
                  String(fd.get('contentStructure') ?? '') || 'tiered',
                maxTierLevel: parseInt(
                  String(fd.get('maxTierLevel') ?? topic.maxTierLevel),
                  10,
                ),
              })
            }}
          >
            <label className="grid gap-1">
              <span className="text-muted-foreground text-sm">ID (readonly)</span>
              <input
                className="w-full rounded border bg-gray-100 p-2"
                value={topic.id}
                readOnly
              />
            </label>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-muted-foreground text-sm">Title</span>
                <input
                  name="title"
                  className="w-full rounded border p-2"
                  defaultValue={topic.title}
                  required
                />
              </label>
              <label className="grid gap-1">
                <span className="text-muted-foreground text-sm">Module</span>
                <input
                  name="module"
                  className="w-full rounded border p-2"
                  defaultValue={topic.module}
                  required
                />
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <label className="grid gap-1">
                <span className="text-muted-foreground text-sm">Difficulty</span>
                <select
                  name="difficulty"
                  className="w-full rounded border p-2"
                  defaultValue={topic.difficulty}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </label>
              <label className="grid gap-1">
                <span className="text-muted-foreground text-sm">
                  Reading Time (min)
                </span>
                <input
                  name="readingTimeMinutes"
                  type="number"
                  className="w-full rounded border p-2"
                  defaultValue={topic.readingTimeMinutes}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-muted-foreground text-sm">Order Index</span>
                <input
                  name="orderIndex"
                  type="number"
                  className="w-full rounded border p-2"
                  defaultValue={topic.orderIndex}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-muted-foreground text-sm">
                  Max Tier Level
                </span>
                <input
                  name="maxTierLevel"
                  type="number"
                  min={1}
                  max={4}
                  className="w-full rounded border p-2"
                  defaultValue={topic.maxTierLevel}
                />
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="grid gap-1">
                <span className="text-muted-foreground text-sm">Part Number</span>
                <input
                  name="partNumber"
                  type="number"
                  className="w-full rounded border p-2"
                  defaultValue={topic.partNumber ?? ''}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-muted-foreground text-sm">Part Name</span>
                <input
                  name="partName"
                  className="w-full rounded border p-2"
                  defaultValue={topic.partName ?? ''}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-muted-foreground text-sm">
                  Content Structure
                </span>
                <select
                  name="contentStructure"
                  className="w-full rounded border p-2"
                  defaultValue={topic.contentStructure ?? 'tiered'}
                >
                  <option value="tiered">Tiered</option>
                  <option value="flat">Flat</option>
                </select>
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-muted-foreground text-sm">Description</span>
              <input
                name="description"
                className="w-full rounded border p-2"
                defaultValue={topic.description ?? ''}
              />
            </label>

            <label className="grid gap-1">
              <span className="text-muted-foreground text-sm">
                Kotlin Explanation (Markdown)
              </span>
              <textarea
                name="kotlinExplanation"
                className="min-h-[200px] w-full rounded border p-2"
                defaultValue={topic.kotlinExplanation}
                required
              />
            </label>

            <label className="grid gap-1">
              <span className="text-muted-foreground text-sm">
                Kotlin Code Example
              </span>
              <textarea
                name="kotlinCode"
                className="min-h-[200px] w-full rounded border p-2 font-mono text-sm"
                defaultValue={topic.kotlinCode}
                required
              />
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                disabled={update.isPending}
              >
                {update.isPending ? 'Saving…' : 'Save Changes'}
              </button>
              <Link
                to="/admin/kotlin/topics"
                className="rounded border px-4 py-2"
              >
                Cancel
              </Link>
            </div>
          </form>
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
  component: AdminKotlinTopicEdit,
})

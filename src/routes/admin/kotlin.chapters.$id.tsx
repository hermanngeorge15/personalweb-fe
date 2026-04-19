import { useEffect, useMemo } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import { useKotlinChaptersAdmin, useUpdateKotlinChapter } from '@/lib/queries'

function AdminKotlinChapterEdit() {
  const { id } = useParams({ from: '/admin/kotlin/chapters/$id' })
  const list = useKotlinChaptersAdmin()
  const update = useUpdateKotlinChapter()

  const chapter = useMemo(
    () => list.data?.find((c) => c.id === parseInt(id, 10)),
    [list.data, id],
  )

  useEffect(() => {
    if (!list.data && !list.isFetching) list.refetch()
  }, [list])

  return (
    <AppShell path="Admin / Kotlin Chapters / Edit">
      <section className="grid gap-6 md:gap-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/kotlin/chapters" className="text-blue-600 underline">
            &larr; Back to Chapters
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Chapter</h1>
        </div>

        {!chapter && (list.isLoading || list.isFetching) && <div>Loading…</div>}
        {!chapter && list.isError && <div>Failed to load chapter.</div>}

        {chapter && (
          <form
            className="grid gap-3 rounded border p-4"
            onSubmit={async (e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget as HTMLFormElement)

              await update.mutateAsync({
                id: chapter.id,
                chapterNumber: parseInt(
                  String(fd.get('chapterNumber') ?? chapter.chapterNumber),
                  10,
                ),
                title: String(fd.get('title') ?? chapter.title),
                description: String(fd.get('description') ?? '') || undefined,
                introduction: String(fd.get('introduction') ?? '') || undefined,
                implementationSteps:
                  String(fd.get('implementationSteps') ?? '') || undefined,
                codeSnippets:
                  String(fd.get('codeSnippets') ?? '') || undefined,
                summary: String(fd.get('summary') ?? '') || undefined,
                difficulty: String(fd.get('difficulty') ?? chapter.difficulty),
                estimatedTimeMinutes: parseInt(
                  String(
                    fd.get('estimatedTimeMinutes') ?? chapter.estimatedTimeMinutes,
                  ),
                  10,
                ),
                previousChapter: chapter.previousChapter,
                nextChapter: chapter.nextChapter,
              })
            }}
          >
            <div className="grid gap-3 md:grid-cols-3">
              <label className="grid gap-1">
                <span className="text-muted-foreground text-sm">
                  Chapter Number
                </span>
                <input
                  name="chapterNumber"
                  type="number"
                  min={1}
                  className="w-full rounded border p-2"
                  defaultValue={chapter.chapterNumber}
                  required
                />
              </label>
              <label className="grid gap-1 md:col-span-2">
                <span className="text-muted-foreground text-sm">Title</span>
                <input
                  name="title"
                  className="w-full rounded border p-2"
                  defaultValue={chapter.title}
                  required
                />
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-muted-foreground text-sm">Difficulty</span>
                <select
                  name="difficulty"
                  className="w-full rounded border p-2"
                  defaultValue={chapter.difficulty}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </label>
              <label className="grid gap-1">
                <span className="text-muted-foreground text-sm">
                  Estimated Time (min)
                </span>
                <input
                  name="estimatedTimeMinutes"
                  type="number"
                  className="w-full rounded border p-2"
                  defaultValue={chapter.estimatedTimeMinutes}
                />
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-muted-foreground text-sm">Description</span>
              <input
                name="description"
                className="w-full rounded border p-2"
                defaultValue={chapter.description ?? ''}
              />
            </label>

            <label className="grid gap-1">
              <span className="text-muted-foreground text-sm">
                Introduction (Markdown)
              </span>
              <textarea
                name="introduction"
                className="min-h-[150px] w-full rounded border p-2"
                defaultValue={chapter.introduction ?? ''}
              />
            </label>

            <label className="grid gap-1">
              <span className="text-muted-foreground text-sm">
                Implementation Steps (JSON array)
              </span>
              <textarea
                name="implementationSteps"
                className="min-h-[150px] w-full rounded border p-2 font-mono text-sm"
                defaultValue={chapter.implementationSteps ?? ''}
                placeholder='["Step 1: ...", "Step 2: ..."]'
              />
            </label>

            <label className="grid gap-1">
              <span className="text-muted-foreground text-sm">
                Code Snippets (JSON array)
              </span>
              <textarea
                name="codeSnippets"
                className="min-h-[150px] w-full rounded border p-2 font-mono text-sm"
                defaultValue={chapter.codeSnippets ?? ''}
                placeholder='[{"filename": "Main.kt", "language": "kotlin", "code": "...", "explanation": "..."}]'
              />
            </label>

            <label className="grid gap-1">
              <span className="text-muted-foreground text-sm">
                Summary (Markdown)
              </span>
              <textarea
                name="summary"
                className="min-h-[100px] w-full rounded border p-2"
                defaultValue={chapter.summary ?? ''}
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
                to="/admin/kotlin/chapters"
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
  component: AdminKotlinChapterEdit,
})

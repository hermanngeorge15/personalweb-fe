import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import { MutationStatus, clearSaved } from '@/components/admin/MutationStatus'
import { DifficultyOptions } from '@/components/admin/AdminForm'
import { formInt, routeInt } from '@/lib/adminFormat'
import { useKotlinChaptersAdmin, useUpdateKotlinChapter } from '@/lib/queries'

function AdminKotlinChapterEdit() {
  const { id } = Route.useParams()
  const list = useKotlinChaptersAdmin()
  const update = useUpdateKotlinChapter()

  const chapterId = routeInt(id)
  const chapter = useMemo(
    () => list.data?.find((c) => c.id === chapterId),
    [list.data, chapterId],
  )

  return (
    <AppShell path="Admin / Kotlin Chapters / Edit">
      <section className="grid gap-6 md:gap-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/kotlin/chapters" className="text-blue-600 underline">
            &larr; Back to Chapters
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit Chapter
          </h1>
        </div>

        {!chapter && (list.isLoading || list.isFetching) && <div>Loading…</div>}
        {!chapter && list.isError && <div>Failed to load chapter.</div>}
        {!chapter && list.isSuccess && !list.isFetching && (
          <div>No chapter with id {id}.</div>
        )}

        {chapter && (
          <form
            onChange={() => clearSaved(update)}
            className="grid gap-3 rounded border p-4"
            onSubmit={async (e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget as HTMLFormElement)
              const estimatedTimeMinutes = formInt(fd, 'estimatedTimeMinutes')
              if (estimatedTimeMinutes === null) return

              await update
                .mutateAsync({
                  id: chapter.id,
                  // Read-only here: the API refuses a new number (see the field below).
                  chapterNumber: chapter.chapterNumber,
                  title: String(fd.get('title') ?? chapter.title),
                  description: String(fd.get('description') ?? '') || undefined,
                  introduction:
                    String(fd.get('introduction') ?? '') || undefined,
                  implementationSteps:
                    String(fd.get('implementationSteps') ?? '') || undefined,
                  codeSnippets:
                    String(fd.get('codeSnippets') ?? '') || undefined,
                  summary: String(fd.get('summary') ?? '') || undefined,
                  difficulty: String(
                    fd.get('difficulty') ?? chapter.difficulty,
                  ),
                  estimatedTimeMinutes,
                  previousChapter: chapter.previousChapter,
                  nextChapter: chapter.nextChapter,
                })
                .catch(() => undefined) // shown by MutationStatus
            }}
          >
            <div className="grid gap-3 md:grid-cols-3">
              <label className="grid gap-1">
                <span className="text-muted-foreground text-sm">
                  Chapter Number
                </span>
                {/* Previous/next links of the neighbours point at this number, so it
                    cannot be changed here. */}
                <input
                  type="number"
                  className="w-full rounded border bg-gray-50 p-2"
                  value={chapter.chapterNumber}
                  readOnly
                  aria-readonly
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
                <span className="text-muted-foreground text-sm">
                  Difficulty
                </span>
                <select
                  name="difficulty"
                  className="w-full rounded border p-2"
                  defaultValue={chapter.difficulty}
                >
                  <DifficultyOptions current={chapter.difficulty} />
                </select>
              </label>
              <label className="grid gap-1">
                <span className="text-muted-foreground text-sm">
                  Estimated Time (min)
                </span>
                <input
                  name="estimatedTimeMinutes"
                  type="number"
                  min={1}
                  step={1}
                  className="w-full rounded border p-2"
                  defaultValue={chapter.estimatedTimeMinutes}
                  required
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
              <MutationStatus
                isSuccess={update.isSuccess}
                error={update.error}
              />
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

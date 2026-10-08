import { Link } from '@tanstack/react-router'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import { MutationStatus, clearSaved } from '@/components/admin/MutationStatus'
import { DifficultyOptions } from '@/components/admin/AdminForm'
import { formInt } from '@/lib/adminFormat'
import {
  useKotlinChaptersAdmin,
  useCreateKotlinChapter,
  useDeleteKotlinChapter,
} from '@/lib/queries'

function AdminKotlinChapters() {
  const { data, isLoading, isError } = useKotlinChaptersAdmin()
  const createChapter = useCreateKotlinChapter()
  const deleteChapter = useDeleteKotlinChapter()

  return (
    <AppShell path="Admin / Kotlin Chapters">
      <section className="grid gap-6 md:gap-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Expense Tracker Chapters
        </h1>

        <form
          onChange={() => clearSaved(createChapter)}
          className="grid gap-2 rounded border p-3"
          onSubmit={async (e) => {
            e.preventDefault()
            // currentTarget is null after an await, so keep the form for reset().
            const form = e.currentTarget as HTMLFormElement
            const fd = new FormData(form)
            const chapterNumber = formInt(fd, 'chapterNumber')
            const title = String(fd.get('title') ?? '')
            const description = String(fd.get('description') ?? '')
            const difficulty = String(fd.get('difficulty') ?? 'beginner')
            const estimatedTimeMinutes = formInt(fd, 'estimatedTimeMinutes')

            if (
              !title ||
              chapterNumber === null ||
              estimatedTimeMinutes === null
            )
              return

            try {
              await createChapter.mutateAsync({
                chapterNumber,
                title,
                description: description || undefined,
                difficulty,
                estimatedTimeMinutes,
              })
              form.reset()
            } catch {
              // shown by MutationStatus
            }
          }}
        >
          <div className="grid gap-2 md:grid-cols-2">
            <input
              name="chapterNumber"
              type="number"
              placeholder="Chapter Number"
              min={1}
              defaultValue={1}
              className="rounded border p-2"
              required
            />
            <input
              name="title"
              placeholder="Title"
              className="rounded border p-2"
              required
            />
          </div>
          <input
            name="description"
            placeholder="Description (optional)"
            className="rounded border p-2"
          />
          <div className="grid gap-2 md:grid-cols-2">
            <select name="difficulty" className="rounded border p-2">
              <DifficultyOptions />
            </select>
            <input
              name="estimatedTimeMinutes"
              type="number"
              placeholder="Estimated time (min)"
              defaultValue={30}
              min={1}
              step={1}
              className="rounded border p-2"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
              disabled={createChapter.isPending}
            >
              {createChapter.isPending ? 'Creating…' : 'Create Chapter'}
            </button>{' '}
            <MutationStatus
              isSuccess={createChapter.isSuccess}
              error={createChapter.error}
            />
          </div>
        </form>

        {isLoading && <div>Loading…</div>}
        {isError && <div>Failed to load chapters.</div>}

        {data && (
          <ul className="grid gap-2">
            {data
              .sort((a, b) => a.chapterNumber - b.chapterNumber)
              .map((chapter) => (
                <li
                  key={chapter.id}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <div>
                    <div className="font-medium">
                      Chapter {chapter.chapterNumber}: {chapter.title}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {chapter.difficulty} • {chapter.estimatedTimeMinutes} min
                      {chapter.description && ` • ${chapter.description}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to="/admin/kotlin/chapters/$id"
                      params={{ id: String(chapter.id) }}
                      className="underline"
                    >
                      Edit
                    </Link>
                    <button
                      className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50"
                      onClick={async () => {
                        if (
                          confirm(
                            `Delete chapter ${chapter.chapterNumber}? This cannot be undone.`,
                          )
                        ) {
                          await deleteChapter.mutateAsync({ id: chapter.id })
                        }
                      }}
                      disabled={deleteChapter.isPending}
                    >
                      {deleteChapter.isPending ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </li>
              ))}
          </ul>
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
  component: AdminKotlinChapters,
})

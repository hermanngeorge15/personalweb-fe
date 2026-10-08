import { Link } from '@tanstack/react-router'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AdminShell from '@/components/admin/AdminShell'
import { MutationStatus, clearSaved } from '@/components/admin/MutationStatus'
import {
  DeleteButton,
  DifficultyOptions,
  FormActions,
} from '@/components/admin/AdminForm'
import {
  AdminCard,
  AdminPageHeader,
  CardTitle,
  Field,
  Notice,
  inputClass,
  primaryButton,
  rowButton,
} from '@/components/admin/ui'
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
    <AdminShell
      crumbs={[
        { label: 'Admin', to: '/admin' },
        { label: 'Learn Kotlin' },
        { label: 'Chapters' },
      ]}
      viewHref="/learn-kotlin"
    >
      <AdminPageHeader title="Expense Tracker Chapters" />
      <div className="mt-6 flex flex-wrap items-start gap-5">
        <AdminCard className="min-w-0 flex-[999_1_480px] overflow-visible p-0 sm:p-0">
          <div className="border-line flex items-center justify-between gap-3 border-b px-5 py-3.5">
            <h2 className="text-heading text-base font-semibold">
              All chapters
            </h2>
            {data && (
              <span className="text-faint text-[13px]">
                {data.length} {data.length === 1 ? 'chapter' : 'chapters'}
              </span>
            )}
          </div>
          {(isLoading || isError) && (
            <div className="px-5 py-4">
              {isLoading && <Notice>Loading…</Notice>}
              {isError && (
                <Notice tone="danger">Failed to load chapters.</Notice>
              )}
            </div>
          )}
          {data && (
            <ul className="divide-line divide-y">
              {data
                .sort((a, b) => a.chapterNumber - b.chapterNumber)
                .map((chapter) => (
                  <li
                    key={chapter.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
                  >
                    <div className="min-w-0">
                      <div className="text-ink text-[15px] font-medium">
                        Chapter {chapter.chapterNumber}: {chapter.title}
                      </div>
                      <div className="text-muted text-sm">
                        {chapter.difficulty} • {chapter.estimatedTimeMinutes}{' '}
                        min
                        {chapter.description && ` • ${chapter.description}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to="/admin/kotlin/chapters/$id"
                        params={{ id: String(chapter.id) }}
                        className={rowButton}
                      >
                        Edit
                        <span className="sr-only">
                          {' '}
                          chapter {chapter.chapterNumber}
                        </span>
                      </Link>
                      <DeleteButton
                        itemName={`Chapter ${chapter.chapterNumber}: ${chapter.title}`}
                        onDelete={() =>
                          deleteChapter.mutateAsync({ id: chapter.id })
                        }
                      />
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard className="min-w-0 flex-[1_1_380px]">
          <CardTitle>New chapter</CardTitle>
          <form
            onChange={() => clearSaved(createChapter)}
            className="@container grid gap-4"
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
            <div className="grid gap-4 @sm:grid-cols-2">
              <Field label="Chapter number">
                <input
                  name="chapterNumber"
                  type="number"
                  min={1}
                  defaultValue={1}
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="Estimated time (min)">
                <input
                  name="estimatedTimeMinutes"
                  type="number"
                  defaultValue={30}
                  min={1}
                  step={1}
                  className={inputClass}
                  required
                />
              </Field>
            </div>
            <Field label="Title">
              <input name="title" className={inputClass} required />
            </Field>
            <Field label="Description" hint="Optional">
              <input name="description" className={inputClass} />
            </Field>
            <Field label="Difficulty">
              <select name="difficulty" className={inputClass}>
                <DifficultyOptions />
              </select>
            </Field>
            <FormActions>
              <button
                type="submit"
                className={primaryButton}
                disabled={createChapter.isPending}
              >
                {createChapter.isPending ? 'Creating…' : 'Create Chapter'}
              </button>
              <MutationStatus
                isSuccess={createChapter.isSuccess}
                error={createChapter.error}
              />
            </FormActions>
          </form>
        </AdminCard>
      </div>
    </AdminShell>
  )
}

export const Route = createFileRoute({
  beforeLoad: async () => {
    await ensureKeycloakAuth()
    return null
  },
  component: AdminKotlinChapters,
})

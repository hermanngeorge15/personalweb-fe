import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AdminShell from '@/components/admin/AdminShell'
import { MutationStatus, clearSaved } from '@/components/admin/MutationStatus'
import { DifficultyOptions, FormActions } from '@/components/admin/AdminForm'
import {
  cx,
  AdminCard,
  AdminPageHeader,
  ArrowLeftIcon,
  Field,
  Notice,
  inputClass,
  primaryButton,
  secondaryButton,
  textareaClass,
  codeTextareaClass,
} from '@/components/admin/ui'
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
    <AdminShell
      crumbs={[
        { label: 'Admin', to: '/admin' },
        { label: 'Learn Kotlin' },
        { label: 'Chapters', to: '/admin/kotlin/chapters' },
        { label: 'Edit' },
      ]}
      viewHref="/learn-kotlin"
    >
      <AdminPageHeader
        title="Edit Chapter"
        actions={
          <Link to="/admin/kotlin/chapters" className={secondaryButton}>
            <ArrowLeftIcon />
            Back to Chapters
          </Link>
        }
      />
      <div className="mt-6 max-w-[960px]">
        {!chapter && (list.isLoading || list.isFetching) && (
          <Notice>Loading…</Notice>
        )}
        {!chapter && list.isError && (
          <Notice tone="danger">Failed to load chapter.</Notice>
        )}
        {!chapter && list.isSuccess && !list.isFetching && (
          <Notice>No chapter with id {id}.</Notice>
        )}

        {chapter && (
          <AdminCard>
            <form
              onChange={() => clearSaved(update)}
              className="@container grid gap-4"
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
                    description:
                      String(fd.get('description') ?? '') || undefined,
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
              <div className="grid gap-4 @lg:grid-cols-3">
                {/* Previous/next links of the neighbours point at this number, so it
                  cannot be changed here. */}
                <Field
                  label="Chapter Number"
                  hint="Fixed: neighbours link to it."
                >
                  <input
                    type="number"
                    className={inputClass}
                    value={chapter.chapterNumber}
                    readOnly
                    aria-readonly
                  />
                </Field>
                <Field label="Title" className="@lg:col-span-2">
                  <input
                    name="title"
                    className={inputClass}
                    defaultValue={chapter.title}
                    required
                  />
                </Field>
              </div>

              <div className="grid gap-4 @lg:grid-cols-2">
                <Field label="Difficulty">
                  <select
                    name="difficulty"
                    className={inputClass}
                    defaultValue={chapter.difficulty}
                  >
                    <DifficultyOptions current={chapter.difficulty} />
                  </select>
                </Field>
                <Field label="Estimated Time (min)">
                  <input
                    name="estimatedTimeMinutes"
                    type="number"
                    min={1}
                    step={1}
                    className={inputClass}
                    defaultValue={chapter.estimatedTimeMinutes}
                    required
                  />
                </Field>
              </div>

              <Field label="Description">
                <input
                  name="description"
                  className={inputClass}
                  defaultValue={chapter.description ?? ''}
                />
              </Field>

              <Field label="Introduction (Markdown)">
                <textarea
                  name="introduction"
                  className={cx(textareaClass, 'min-h-[150px]')}
                  defaultValue={chapter.introduction ?? ''}
                />
              </Field>

              <Field label="Implementation Steps (JSON array)">
                <textarea
                  name="implementationSteps"
                  className={cx(codeTextareaClass, 'min-h-[150px]')}
                  defaultValue={chapter.implementationSteps ?? ''}
                  placeholder='["Step 1: ...", "Step 2: ..."]'
                />
              </Field>

              <Field label="Code Snippets (JSON array)">
                <textarea
                  name="codeSnippets"
                  className={cx(codeTextareaClass, 'min-h-[150px]')}
                  defaultValue={chapter.codeSnippets ?? ''}
                  placeholder='[{"filename": "Main.kt", "language": "kotlin", "code": "...", "explanation": "..."}]'
                />
              </Field>

              <Field label="Summary (Markdown)">
                <textarea
                  name="summary"
                  className={cx(textareaClass, 'min-h-[100px]')}
                  defaultValue={chapter.summary ?? ''}
                />
              </Field>

              <FormActions>
                <button
                  type="submit"
                  className={primaryButton}
                  disabled={update.isPending}
                >
                  {update.isPending ? 'Saving…' : 'Save Changes'}
                </button>
                <Link to="/admin/kotlin/chapters" className={secondaryButton}>
                  Cancel
                </Link>
                <MutationStatus
                  isSuccess={update.isSuccess}
                  error={update.error}
                />
              </FormActions>
            </form>
          </AdminCard>
        )}
      </div>
    </AdminShell>
  )
}

export const Route = createFileRoute({
  beforeLoad: async () => {
    await ensureKeycloakAuth()
    return null
  },
  component: AdminKotlinChapterEdit,
})

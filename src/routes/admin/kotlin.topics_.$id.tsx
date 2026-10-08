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
  codeInputClass,
  inputClass,
  primaryButton,
  secondaryButton,
  textareaClass,
  codeTextareaClass,
} from '@/components/admin/ui'
import { formInt } from '@/lib/adminFormat'
import { useKotlinTopicsAdmin, useUpdateKotlinTopic } from '@/lib/queries'

function AdminKotlinTopicEdit() {
  const { id } = Route.useParams()
  const list = useKotlinTopicsAdmin()
  const update = useUpdateKotlinTopic()

  const topic = useMemo(
    () => list.data?.find((t) => t.id === id),
    [list.data, id],
  )

  return (
    <AdminShell
      crumbs={[
        { label: 'Admin', to: '/admin' },
        { label: 'Learn Kotlin' },
        { label: 'Topics', to: '/admin/kotlin/topics' },
        { label: 'Edit' },
      ]}
      viewHref="/learn-kotlin"
    >
      <AdminPageHeader
        title="Edit Topic"
        actions={
          <Link to="/admin/kotlin/topics" className={secondaryButton}>
            <ArrowLeftIcon />
            Back to Topics
          </Link>
        }
      />
      <div className="mt-6 max-w-[960px]">
        {!topic && (list.isLoading || list.isFetching) && (
          <Notice>Loading…</Notice>
        )}
        {!topic && list.isError && (
          <Notice tone="danger">Failed to load topic.</Notice>
        )}
        {!topic && list.isSuccess && !list.isFetching && (
          <Notice>No topic with id {id}.</Notice>
        )}

        {topic && (
          <AdminCard>
            <form
              onChange={() => clearSaved(update)}
              className="@container grid gap-4"
              onSubmit={async (e) => {
                e.preventDefault()
                const fd = new FormData(e.currentTarget as HTMLFormElement)
                const readingTimeMinutes = formInt(fd, 'readingTimeMinutes')
                const orderIndex = formInt(fd, 'orderIndex')
                const maxTierLevel = formInt(fd, 'maxTierLevel')
                if (
                  readingTimeMinutes === null ||
                  orderIndex === null ||
                  maxTierLevel === null
                )
                  return

                await update
                  .mutateAsync({
                    id: topic.id,
                    title: String(fd.get('title') ?? topic.title),
                    module: String(fd.get('module') ?? topic.module),
                    difficulty: String(
                      fd.get('difficulty') ?? topic.difficulty,
                    ),
                    description:
                      String(fd.get('description') ?? '') || undefined,
                    kotlinExplanation: String(
                      fd.get('kotlinExplanation') ?? topic.kotlinExplanation,
                    ),
                    kotlinCode: String(
                      fd.get('kotlinCode') ?? topic.kotlinCode,
                    ),
                    readingTimeMinutes,
                    orderIndex,
                    partNumber: formInt(fd, 'partNumber') ?? undefined,
                    partName: String(fd.get('partName') ?? '') || undefined,
                    contentStructure:
                      String(fd.get('contentStructure') ?? '') || 'tiered',
                    maxTierLevel,
                  })
                  .catch(() => undefined) // shown by MutationStatus
              }}
            >
              <Field label="ID (readonly)">
                <input className={codeInputClass} value={topic.id} readOnly />
              </Field>

              <div className="grid gap-4 @lg:grid-cols-2">
                <Field label="Title">
                  <input
                    name="title"
                    className={inputClass}
                    defaultValue={topic.title}
                    required
                  />
                </Field>
                <Field label="Module">
                  <input
                    name="module"
                    className={inputClass}
                    defaultValue={topic.module}
                    required
                  />
                </Field>
              </div>

              <div className="grid gap-4 @sm:grid-cols-2 @3xl:grid-cols-4">
                <Field label="Difficulty">
                  <select
                    name="difficulty"
                    className={inputClass}
                    defaultValue={topic.difficulty}
                  >
                    <DifficultyOptions current={topic.difficulty} />
                  </select>
                </Field>
                <Field label="Reading Time (min)">
                  <input
                    name="readingTimeMinutes"
                    type="number"
                    min={1}
                    step={1}
                    className={inputClass}
                    defaultValue={topic.readingTimeMinutes}
                    required
                  />
                </Field>
                <Field label="Order Index">
                  <input
                    name="orderIndex"
                    type="number"
                    min={0}
                    step={1}
                    className={inputClass}
                    defaultValue={topic.orderIndex}
                    required
                  />
                </Field>
                <Field label="Max Tier Level">
                  <input
                    name="maxTierLevel"
                    type="number"
                    min={1}
                    max={4}
                    className={inputClass}
                    defaultValue={topic.maxTierLevel}
                    required
                  />
                </Field>
              </div>

              <div className="grid gap-4 @lg:grid-cols-3">
                <Field label="Part Number">
                  <input
                    name="partNumber"
                    type="number"
                    className={inputClass}
                    defaultValue={topic.partNumber ?? ''}
                  />
                </Field>
                <Field label="Part Name">
                  <input
                    name="partName"
                    className={inputClass}
                    defaultValue={topic.partName ?? ''}
                  />
                </Field>
                <Field label="Content Structure">
                  <select
                    name="contentStructure"
                    className={inputClass}
                    defaultValue={topic.contentStructure ?? 'tiered'}
                  >
                    <option value="tiered">Tiered</option>
                    <option value="flat">Flat</option>
                  </select>
                </Field>
              </div>

              <Field label="Description">
                <input
                  name="description"
                  className={inputClass}
                  defaultValue={topic.description ?? ''}
                />
              </Field>

              <Field label="Kotlin Explanation (Markdown)">
                <textarea
                  name="kotlinExplanation"
                  className={cx(textareaClass, 'min-h-[200px]')}
                  defaultValue={topic.kotlinExplanation}
                  required
                />
              </Field>

              <Field label="Kotlin Code Example">
                <textarea
                  name="kotlinCode"
                  className={cx(codeTextareaClass, 'min-h-[200px]')}
                  defaultValue={topic.kotlinCode}
                  required
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
                <Link to="/admin/kotlin/topics" className={secondaryButton}>
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
  component: AdminKotlinTopicEdit,
})

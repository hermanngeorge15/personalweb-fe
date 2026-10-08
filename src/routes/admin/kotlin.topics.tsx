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
  codeInputClass,
  inputClass,
  primaryButton,
  rowButton,
  textareaClass,
  codeTextareaClass,
} from '@/components/admin/ui'
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
    <AdminShell
      crumbs={[
        { label: 'Admin', to: '/admin' },
        { label: 'Learn Kotlin' },
        { label: 'Topics' },
      ]}
      viewHref="/learn-kotlin"
    >
      <AdminPageHeader title="Kotlin Topics" />
      <div className="mt-6 flex flex-wrap items-start gap-5">
        <div className="grid min-w-0 flex-[999_1_480px] gap-5">
          {isLoading && <Notice>Loading…</Notice>}
          {isError && <Notice tone="danger">Failed to load topics.</Notice>}
          {groupedTopics &&
            Object.entries(groupedTopics).map(([module, topics]) => (
              <AdminCard key={module} className="overflow-visible p-0 sm:p-0">
                <div className="border-line flex items-center justify-between gap-3 border-b px-5 py-3.5">
                  <h2 className="text-heading text-base font-semibold">
                    {module}
                  </h2>
                  <span className="text-faint text-[13px]">
                    {topics?.length ?? 0}{' '}
                    {topics?.length === 1 ? 'topic' : 'topics'}
                  </span>
                </div>
                <ul className="divide-line divide-y">
                  {topics?.map((topic) => (
                    <li
                      key={topic.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
                    >
                      <div className="min-w-0">
                        <div className="text-ink text-[15px] font-medium">
                          {topic.title}
                        </div>
                        <div className="text-muted text-sm [overflow-wrap:anywhere]">
                          <span className="font-mono text-[13px]">
                            {topic.id}
                          </span>{' '}
                          • {topic.difficulty} • {topic.readingTimeMinutes} min
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to="/admin/kotlin/topics/$id"
                          params={{ id: topic.id }}
                          className={rowButton}
                        >
                          Edit<span className="sr-only"> {topic.title}</span>
                        </Link>
                        <DeleteButton
                          itemName={topic.title}
                          onDelete={() =>
                            deleteTopic.mutateAsync({ id: topic.id })
                          }
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </AdminCard>
            ))}
        </div>

        <div className="min-w-0 flex-[1_1_380px]">
          <AdminCard>
            <CardTitle>New topic</CardTitle>
            <form
              onChange={() => clearSaved(createTopic)}
              className="@container grid gap-4"
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
                const kotlinExplanation = String(
                  fd.get('kotlinExplanation') ?? '',
                )
                const kotlinCode = String(fd.get('kotlinCode') ?? '')
                const readingTimeMinutes = formInt(fd, 'readingTimeMinutes')
                const orderIndex = formInt(fd, 'orderIndex')

                if (
                  !id ||
                  !title ||
                  !module ||
                  !kotlinExplanation ||
                  !kotlinCode
                )
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
              <Field label="ID" hint="e.g. null-safety">
                <input name="id" className={codeInputClass} required />
              </Field>
              <Field label="Title">
                <input name="title" className={inputClass} required />
              </Field>
              <Field label="Module" hint="e.g. OOP Fundamentals">
                <input name="module" className={inputClass} required />
              </Field>
              <div className="grid gap-4 @sm:grid-cols-3">
                <Field label="Difficulty">
                  <select name="difficulty" className={inputClass}>
                    <DifficultyOptions />
                  </select>
                </Field>
                <Field label="Reading time (min)">
                  <input
                    name="readingTimeMinutes"
                    type="number"
                    defaultValue={10}
                    min={1}
                    step={1}
                    className={inputClass}
                    required
                  />
                </Field>
                <Field label="Order index">
                  <input
                    name="orderIndex"
                    type="number"
                    defaultValue={0}
                    min={0}
                    step={1}
                    className={inputClass}
                    required
                  />
                </Field>
              </div>
              <Field label="Description" hint="Optional">
                <input name="description" className={inputClass} />
              </Field>
              <Field label="Kotlin Explanation (Markdown)">
                <textarea
                  name="kotlinExplanation"
                  rows={4}
                  className={textareaClass}
                  required
                />
              </Field>
              <Field label="Kotlin Code Example">
                <textarea
                  name="kotlinCode"
                  rows={4}
                  className={codeTextareaClass}
                  required
                />
              </Field>
              <FormActions>
                <button
                  type="submit"
                  className={primaryButton}
                  disabled={createTopic.isPending}
                >
                  {createTopic.isPending ? 'Creating…' : 'Create Topic'}
                </button>
                <MutationStatus
                  isSuccess={createTopic.isSuccess}
                  error={createTopic.error}
                />
              </FormActions>
            </form>
          </AdminCard>
        </div>
      </div>
    </AdminShell>
  )
}

export const Route = createFileRoute({
  beforeLoad: async () => {
    await ensureKeycloakAuth()
    return null
  },
  component: AdminKotlinTopics,
})

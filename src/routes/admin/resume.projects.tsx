import { Link } from '@tanstack/react-router'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AdminShell from '@/components/admin/AdminShell'
import { MutationStatus, clearSaved } from '@/components/admin/MutationStatus'
import { DeleteButton, FormActions } from '@/components/admin/AdminForm'
import { ResumeProjectFields } from '@/components/admin/ResumeProjectFields'
import {
  AdminCard,
  AdminPageHeader,
  CardTitle,
  Notice,
  primaryButton,
  rowButton,
} from '@/components/admin/ui'
import { fromDateTimeInput } from '@/lib/adminFormat'
import {
  useResumeProjects,
  useCreateResumeProject,
  useDeleteResumeProject,
} from '@/lib/queries'

function AdminResumeProjects() {
  const { data, isLoading, isError } = useResumeProjects()
  const createProject = useCreateResumeProject()
  const deleteProject = useDeleteResumeProject()
  return (
    <AdminShell
      crumbs={[
        { label: 'Admin', to: '/admin' },
        { label: 'Resume' },
        { label: 'Projects' },
      ]}
      viewHref="/resume"
    >
      <AdminPageHeader title="Resume Projects" />
      <div className="mt-6 flex flex-wrap items-start gap-5">
        <AdminCard className="min-w-0 flex-[999_1_480px] overflow-visible p-0 sm:p-0">
          <div className="border-line flex items-center justify-between gap-3 border-b px-5 py-3.5">
            <h2 className="text-heading text-base font-semibold">
              All projects
            </h2>
            {data && (
              <span className="text-faint text-[13px]">
                {data.length} {data.length === 1 ? 'project' : 'projects'}
              </span>
            )}
          </div>
          {(isLoading || isError) && (
            <div className="px-5 py-4">
              {isLoading && <Notice>Loading…</Notice>}
              {isError && (
                <Notice tone="danger">Failed to load resume projects.</Notice>
              )}
            </div>
          )}
          {data && (
            <ul className="divide-line divide-y">
              {data.map((p) => {
                const fmt = (value?: string) =>
                  value
                    ? new Date(value).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                      })
                    : ''
                const start = fmt(p.startAt)
                const end = p.endAt ? fmt(p.endAt) : 'Present'
                const range =
                  start || end ? `${start}${start ? ' – ' : ''}${end}` : ''
                const name = p.projectName ?? p.company ?? ''
                return (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
                  >
                    <div className="min-w-0">
                      <div className="text-ink text-[15px] font-medium">
                        {name}
                      </div>
                      {(p.company || range) && (
                        <div className="text-muted text-sm">
                          {[p.projectName && p.company, range]
                            .filter(Boolean)
                            .join(' · ')}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to="/admin/resume/projects/$id"
                        params={{ id: p.id }}
                        className={rowButton}
                      >
                        Edit<span className="sr-only"> {name}</span>
                      </Link>
                      <DeleteButton
                        itemName={name}
                        onDelete={() => deleteProject.mutateAsync({ id: p.id })}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </AdminCard>

        <AdminCard className="min-w-0 flex-[1_1_420px]">
          <CardTitle>Add project</CardTitle>
          <form
            onChange={() => clearSaved(createProject)}
            className="grid gap-5"
            onSubmit={async (e) => {
              e.preventDefault()
              // currentTarget is null after an await, so keep the form for reset().
              const form = e.currentTarget as HTMLFormElement
              const fd = new FormData(form)
              const company = String(fd.get('company') ?? '')
              const projectName = String(fd.get('projectName') ?? '')
              const description = String(fd.get('description') ?? '')
              const fromStr = String(fd.get('from') ?? '')
              const untilStr = String(fd.get('until') ?? '')
              const responsibilitiesRaw = String(
                fd.get('responsibilities') ?? '',
              )
              const techStackRaw = String(fd.get('techStack') ?? '')
              const repoUrl = String(fd.get('repoUrl') ?? '')
              const demoUrl = String(fd.get('demoUrl') ?? '')
              // The API requires a start date; the input is required too.
              const startAt = fromDateTimeInput(fromStr)
              if ((!projectName && !company) || !startAt) return
              try {
                await createProject.mutateAsync({
                  company,
                  projectName,
                  description,
                  startAt,
                  endAt: fromDateTimeInput(untilStr) ?? undefined,
                  responsibilities: responsibilitiesRaw
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                  techStack: techStackRaw
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                  repoUrl: repoUrl || undefined,
                  demoUrl: demoUrl || undefined,
                })
                form.reset()
              } catch {
                // shown by MutationStatus
              }
            }}
          >
            <ResumeProjectFields />
            <FormActions>
              <button
                type="submit"
                className={primaryButton}
                disabled={createProject.isPending}
              >
                {createProject.isPending ? 'Creating…' : 'Create'}
              </button>
              <MutationStatus
                isSuccess={createProject.isSuccess}
                error={createProject.error}
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
  component: AdminResumeProjects,
})

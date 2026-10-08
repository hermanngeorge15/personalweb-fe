import { Link } from '@tanstack/react-router'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import { MutationStatus, clearSaved } from '@/components/admin/MutationStatus'
import { DeleteButton } from '@/components/admin/AdminForm'
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
    <AppShell path="Admin / Resume / Projects">
      <section className="grid gap-6 md:gap-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Resume Projects
        </h1>
        <form
          onChange={() => clearSaved(createProject)}
          className="grid gap-2 rounded border p-3"
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
            const responsibilitiesRaw = String(fd.get('responsibilities') ?? '')
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
          <div className="grid gap-2 md:grid-cols-2">
            <input
              name="company"
              placeholder="company"
              className="rounded border p-2"
            />
            <input
              name="projectName"
              placeholder="project name"
              className="rounded border p-2"
            />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-muted-foreground text-sm">From</span>
              <input
                name="from"
                type="datetime-local"
                className="rounded border p-2"
                required
              />
            </label>
            <label className="grid gap-1">
              <span className="text-muted-foreground text-sm">Until</span>
              <input
                name="until"
                type="datetime-local"
                className="rounded border p-2"
              />
            </label>
          </div>
          <textarea
            name="description"
            placeholder="description"
            className="min-h-[120px] rounded border p-2"
          />
          <input
            name="responsibilities"
            placeholder="responsibilities (comma-separated)"
            className="rounded border p-2"
          />
          <input
            name="techStack"
            placeholder="tech stack (comma-separated)"
            className="rounded border p-2"
          />
          <div className="grid gap-2 md:grid-cols-2">
            <input
              name="repoUrl"
              placeholder="repo URL"
              className="rounded border p-2"
            />
            <input
              name="demoUrl"
              placeholder="demo URL"
              className="rounded border p-2"
            />
          </div>
          <div>
            <button
              type="submit"
              className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
              disabled={createProject.isPending}
            >
              {createProject.isPending ? 'Creating…' : 'Create'}
            </button>{' '}
            <MutationStatus
              isSuccess={createProject.isSuccess}
              error={createProject.error}
            />
          </div>
        </form>
        {isLoading && <div>Loading…</div>}
        {isError && <div>Failed to load resume projects.</div>}
        {data && (
          <ul className="grid gap-2">
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
              return (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <div>
                    <div className="font-medium">
                      {p.projectName ?? p.company}
                    </div>
                    {range && (
                      <div className="text-muted-foreground text-sm">
                        {range}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to="/admin/resume/projects/$id"
                      params={{ id: p.id }}
                      className="underline"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      onDelete={() => deleteProject.mutateAsync({ id: p.id })}
                    />
                  </div>
                </li>
              )
            })}
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
  component: AdminResumeProjects,
})

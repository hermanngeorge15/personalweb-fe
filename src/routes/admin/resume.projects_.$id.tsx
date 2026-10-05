import { useMemo } from 'react'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import { MutationStatus } from '@/components/admin/MutationStatus'
import { useResumeProjects, useUpdateResumeProject } from '@/lib/queries'
// Shown in local time, because the save below reads the input as local time.
import { fromDateTimeInput, toDateTimeInput } from '@/lib/adminFormat'

function AdminResumeProjectEdit() {
  const { id } = Route.useParams()
  const list = useResumeProjects()
  const update = useUpdateResumeProject()

  const project = useMemo(
    () => list.data?.find((p) => p.id === id),
    [list.data, id],
  )

  return (
    <AppShell path="Admin / Resume / Projects / Edit">
      <section className="grid gap-6 md:gap-8">
        <h1 className="text-2xl font-semibold tracking-tight">Edit Project</h1>
        {!project && (list.isLoading || list.isFetching) && <div>Loading…</div>}
        {!project && list.isError && <div>Failed to load project.</div>}
        {!project && list.isSuccess && !list.isFetching && (
          <div>No project with id {id}.</div>
        )}
        {project && (
          <form
            className="grid gap-2 rounded border p-3"
            onSubmit={async (e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget as HTMLFormElement)
              // The API requires a start date; the input is required too.
              const startAt = fromDateTimeInput(String(fd.get('from') ?? ''))
              if (!startAt) return
              await update
                .mutateAsync({
                  id: project.id,
                  company: String(fd.get('company') ?? ''),
                  projectName: String(fd.get('projectName') ?? ''),
                  description: String(fd.get('description') ?? ''),
                  startAt,
                  endAt:
                    fromDateTimeInput(String(fd.get('until') ?? '')) ??
                    undefined,
                  responsibilities: String(fd.get('responsibilities') ?? '')
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                  techStack: String(fd.get('techStack') ?? '')
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                  repoUrl: String(fd.get('repoUrl') ?? '') || undefined,
                  demoUrl: String(fd.get('demoUrl') ?? '') || undefined,
                })
                .catch(() => undefined) // shown by MutationStatus
            }}
          >
            <div className="grid gap-2 md:grid-cols-2">
              <input
                name="company"
                defaultValue={project.company}
                placeholder="company"
                className="rounded border p-2"
              />
              <input
                name="projectName"
                defaultValue={project.projectName}
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
                  defaultValue={
                    project.startAt ? toDateTimeInput(project.startAt) : ''
                  }
                  className="rounded border p-2"
                  required
                />
              </label>
              <label className="grid gap-1">
                <span className="text-muted-foreground text-sm">Until</span>
                <input
                  name="until"
                  type="datetime-local"
                  defaultValue={
                    project.endAt ? toDateTimeInput(project.endAt) : ''
                  }
                  className="rounded border p-2"
                />
              </label>
            </div>
            <textarea
              name="description"
              defaultValue={project.description}
              placeholder="description"
              className="min-h-[120px] rounded border p-2"
            />
            <input
              name="responsibilities"
              defaultValue={(project.responsibilities ?? []).join(', ')}
              placeholder="responsibilities (comma-separated)"
              className="rounded border p-2"
            />
            <input
              name="techStack"
              defaultValue={(project.techStack ?? []).join(', ')}
              placeholder="tech stack (comma-separated)"
              className="rounded border p-2"
            />
            <div className="grid gap-2 md:grid-cols-2">
              <input
                name="repoUrl"
                defaultValue={project.repoUrl}
                placeholder="repo URL"
                className="rounded border p-2"
              />
              <input
                name="demoUrl"
                defaultValue={project.demoUrl}
                placeholder="demo URL"
                className="rounded border p-2"
              />
            </div>
            <div>
              <button
                type="submit"
                className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
                disabled={update.isPending}
              >
                {update.isPending ? 'Saving…' : 'Save'}
              </button>{' '}
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
  component: AdminResumeProjectEdit,
})

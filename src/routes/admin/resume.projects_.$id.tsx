import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AdminShell from '@/components/admin/AdminShell'
import { MutationStatus, clearSaved } from '@/components/admin/MutationStatus'
import { FormActions } from '@/components/admin/AdminForm'
import { ResumeProjectFields } from '@/components/admin/ResumeProjectFields'
import {
  AdminCard,
  AdminPageHeader,
  ArrowLeftIcon,
  Notice,
  primaryButton,
  secondaryButton,
} from '@/components/admin/ui'
import { useResumeProjects, useUpdateResumeProject } from '@/lib/queries'
import { fromDateTimeInput } from '@/lib/adminFormat'

function AdminResumeProjectEdit() {
  const { id } = Route.useParams()
  const list = useResumeProjects()
  const update = useUpdateResumeProject()

  const project = useMemo(
    () => list.data?.find((p) => p.id === id),
    [list.data, id],
  )

  return (
    <AdminShell
      crumbs={[
        { label: 'Admin', to: '/admin' },
        { label: 'Resume' },
        { label: 'Projects', to: '/admin/resume/projects' },
        { label: 'Edit' },
      ]}
      viewHref="/resume"
    >
      <AdminPageHeader
        title="Edit Project"
        actions={
          <Link to="/admin/resume/projects" className={secondaryButton}>
            <ArrowLeftIcon />
            All projects
          </Link>
        }
      />
      <div className="mt-6 max-w-[880px]">
        {!project && (list.isLoading || list.isFetching) && (
          <Notice>Loading…</Notice>
        )}
        {!project && list.isError && (
          <Notice tone="danger">Failed to load project.</Notice>
        )}
        {!project && list.isSuccess && !list.isFetching && (
          <Notice>No project with id {id}.</Notice>
        )}
        {project && (
          <AdminCard>
            <form
              onChange={() => clearSaved(update)}
              className="grid gap-5"
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
              <ResumeProjectFields project={project} />
              <FormActions>
                <button
                  type="submit"
                  className={primaryButton}
                  disabled={update.isPending}
                >
                  {update.isPending ? 'Saving…' : 'Save'}
                </button>
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
  component: AdminResumeProjectEdit,
})

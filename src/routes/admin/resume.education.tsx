import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import {
  useResumeEducation,
  useCreateResumeEducation,
  useDeleteResumeEducation,
} from '@/lib/queries'

function AdminResumeEducation() {
  const { data, isLoading, isError } = useResumeEducation()
  const createEducation = useCreateResumeEducation()
  const deleteEducation = useDeleteResumeEducation()
  return (
    <AppShell path="Admin / Resume / Education">
      <section className="grid gap-6 md:gap-8">
        <h1 className="text-2xl font-semibold tracking-tight">Resume Education</h1>
        <form
          className="grid gap-2 rounded border p-3"
          onSubmit={async (e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget as HTMLFormElement)
            const institution = String(fd.get('institution') ?? '')
            const degree = String(fd.get('degree') ?? '')
            const field = String(fd.get('field') ?? '')
            if (!institution) return
            await createEducation.mutateAsync({ institution, degree, field })
            ;(e.currentTarget as HTMLFormElement).reset()
          }}
        >
          <div className="grid gap-2 md:grid-cols-3">
            <input name="institution" placeholder="institution" className="rounded border p-2" required />
            <input name="degree" placeholder="degree" className="rounded border p-2" />
            <input name="field" placeholder="field" className="rounded border p-2" />
          </div>
          <div>
            <button
              type="submit"
              className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
              disabled={createEducation.isPending}
            >
              {createEducation.isPending ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
        {isLoading && <div>Loading…</div>}
        {isError && <div>Failed to load resume education.</div>}
        {data && (
          <ul className="grid gap-2">
            {data.map((ed) => (
              <li key={ed.id} className="flex items-center justify-between rounded border p-3">
                <span>{ed.institution}{ed.degree ? ` — ${ed.degree}` : ''}</span>
                <button
                  className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50"
                  onClick={async () => {
                    await deleteEducation.mutateAsync({ id: ed.id })
                  }}
                  disabled={deleteEducation.isPending}
                >
                  {deleteEducation.isPending ? 'Deleting…' : 'Delete'}
                </button>
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
  path: '/admin/resume/education',
  component: AdminResumeEducation,
})



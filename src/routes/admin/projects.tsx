import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import { useProjects, useCreateProject, useDeleteProject } from '@/lib/queries'

function AdminProjects() {
  const { data, isLoading, isError } = useProjects()
  const createProject = useCreateProject()
  const deleteProject = useDeleteProject()
  return (
    <AppShell path="Admin / Projects">
      <section className="grid gap-6 md:gap-8">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <form
          className="flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget as HTMLFormElement)
            const id = String(fd.get('id') ?? '')
            const name = String(fd.get('name') ?? '')
            const description = String(fd.get('description') ?? '')
            if (!id || !name) return
            await createProject.mutateAsync({ id, name, description })
            ;(e.currentTarget as HTMLFormElement).reset()
          }}
        >
          <input name="id" placeholder="id" className="rounded border p-2" />
          <input
            name="name"
            placeholder="name"
            className="rounded border p-2"
          />
          <input
            name="description"
            placeholder="description"
            className="rounded border p-2"
          />
          <button
            type="submit"
            className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
            disabled={createProject.isPending}
          >
            {createProject.isPending ? 'Creating…' : 'Create'}
          </button>
        </form>
        {isLoading && <div>Loading…</div>}
        {isError && <div>Failed to load projects.</div>}
        {data && (
          <ul className="grid gap-2">
            {data.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded border p-3"
              >
                <span>{p.name}</span>
                <button
                  className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50"
                  onClick={async () => {
                    await deleteProject.mutateAsync({ id: p.id })
                  }}
                  disabled={deleteProject.isPending}
                >
                  {deleteProject.isPending ? 'Deleting…' : 'Delete'}
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
  component: AdminProjects,
})

import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import {
  useResumeLanguages,
  useCreateResumeLanguage,
  useDeleteResumeLanguage,
} from '@/lib/queries'

function AdminResumeLanguages() {
  const { data, isLoading, isError } = useResumeLanguages()
  const createLanguage = useCreateResumeLanguage()
  const deleteLanguage = useDeleteResumeLanguage()
  return (
    <AppShell path="Admin / Resume / Languages">
      <section className="grid gap-6 md:gap-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Resume Languages
        </h1>
        <form
          className="flex flex-wrap gap-2 rounded border p-3"
          onSubmit={async (e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget as HTMLFormElement)
            const name = String(fd.get('name') ?? '')
            const level = String(fd.get('level') ?? '')
            if (!name) return
            await createLanguage.mutateAsync({ name, level })
            ;(e.currentTarget as HTMLFormElement).reset()
          }}
        >
          <input
            name="name"
            placeholder="name"
            className="rounded border p-2"
            required
          />
          <input
            name="level"
            placeholder="level"
            className="rounded border p-2"
          />
          <button
            type="submit"
            className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
            disabled={createLanguage.isPending}
          >
            {createLanguage.isPending ? 'Creating…' : 'Create'}
          </button>
        </form>
        {isLoading && <div>Loading…</div>}
        {isError && <div>Failed to load resume languages.</div>}
        {data && (
          <ul className="grid gap-2">
            {data.map((l) => (
              <li
                key={l.id}
                className="flex items-center justify-between rounded border p-3"
              >
                <span>
                  {l.name}
                  {l.level ? ` — ${l.level}` : ''}
                </span>
                <button
                  className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50"
                  onClick={async () => {
                    await deleteLanguage.mutateAsync({ id: l.id })
                  }}
                  disabled={deleteLanguage.isPending}
                >
                  {deleteLanguage.isPending ? 'Deleting…' : 'Delete'}
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
  path: '/admin/resume/languages',
  component: AdminResumeLanguages,
})

import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import { useResumeHobbies, useUpsertResumeHobbies } from '@/lib/queries'

function AdminResumeHobbies() {
  const { data, isLoading, isError } = useResumeHobbies()
  const upsertHobbies = useUpsertResumeHobbies()
  return (
    <AppShell path="Admin / Resume / Hobbies">
      <section className="grid gap-6 md:gap-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Resume Hobbies
        </h1>
        <form
          className="grid gap-2 rounded border p-3"
          onSubmit={async (e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget as HTMLFormElement)
            const sports = String(fd.get('sports') ?? '')
            const others = String(fd.get('others') ?? '')
            await upsertHobbies.mutateAsync({
              sports: sports
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
              others: others
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }}
        >
          <input
            name="sports"
            placeholder="sports (comma-separated)"
            className="rounded border p-2"
            defaultValue={(data?.sports ?? []).join(', ')}
          />
          <input
            name="others"
            placeholder="others (comma-separated)"
            className="rounded border p-2"
            defaultValue={(data?.others ?? []).join(', ')}
          />
          <div>
            <button
              type="submit"
              className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
              disabled={upsertHobbies.isPending}
            >
              {upsertHobbies.isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
        {isLoading && <div>Loading…</div>}
        {isError && <div>Failed to load resume hobbies.</div>}
      </section>
    </AppShell>
  )
}

export const Route = createFileRoute({
  beforeLoad: async () => {
    await ensureKeycloakAuth()
    return null
  },
  path: '/admin/resume/hobbies',
  component: AdminResumeHobbies,
})

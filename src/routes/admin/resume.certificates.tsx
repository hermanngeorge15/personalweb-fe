import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import {
  useResumeCertificates,
  useCreateResumeCertificate,
  useDeleteResumeCertificate,
} from '@/lib/queries'

function AdminResumeCertificates() {
  const { data, isLoading, isError } = useResumeCertificates()
  const createCertificate = useCreateResumeCertificate()
  const deleteCertificate = useDeleteResumeCertificate()
  return (
    <AppShell path="Admin / Resume / Certificates">
      <section className="grid gap-6 md:gap-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Resume Certificates
        </h1>
        <form
          className="grid gap-2 rounded border p-3"
          onSubmit={async (e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget as HTMLFormElement)
            const name = String(fd.get('name') ?? '')
            const issuer = String(fd.get('issuer') ?? '')
            if (!name) return
            await createCertificate.mutateAsync({ name, issuer })
            ;(e.currentTarget as HTMLFormElement).reset()
          }}
        >
          <div className="grid gap-2 md:grid-cols-2">
            <input
              name="name"
              placeholder="name"
              className="rounded border p-2"
              required
            />
            <input
              name="issuer"
              placeholder="issuer"
              className="rounded border p-2"
            />
          </div>
          <div>
            <button
              type="submit"
              className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
              disabled={createCertificate.isPending}
            >
              {createCertificate.isPending ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
        {isLoading && <div>Loading…</div>}
        {isError && <div>Failed to load resume certificates.</div>}
        {data && (
          <ul className="grid gap-2">
            {data.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded border p-3"
              >
                <span>
                  {c.name}
                  {c.issuer ? ` — ${c.issuer}` : ''}
                </span>
                <button
                  className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50"
                  onClick={async () => {
                    await deleteCertificate.mutateAsync({ id: c.id })
                  }}
                  disabled={deleteCertificate.isPending}
                >
                  {deleteCertificate.isPending ? 'Deleting…' : 'Delete'}
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
  path: '/admin/resume/certificates',
  component: AdminResumeCertificates,
})

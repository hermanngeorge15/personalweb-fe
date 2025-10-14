import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import {
  useTestimonials,
  useCreateTestimonial,
  useDeleteTestimonial,
} from '@/lib/queries'

function AdminTestimonials() {
  const { data, isLoading, isError } = useTestimonials()
  const createTestimonial = useCreateTestimonial()
  const deleteTestimonial = useDeleteTestimonial()
  return (
    <AppShell path="Admin / Testimonials">
      <section className="grid gap-6 md:gap-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Testimonials Management
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Add testimonials from LinkedIn or other sources. Include author
            name, role, avatar URL, and the quote.
          </p>
        </div>

        <div className="rounded-xl border bg-white/60 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Add New Testimonial</h2>
          <form
            className="grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget as HTMLFormElement)
              const id = String(fd.get('id') ?? '')
              const author = String(fd.get('author') ?? '')
              const quote = String(fd.get('quote') ?? '')
              const role = String(fd.get('role') ?? '')
              const avatar_url = String(fd.get('avatar_url') ?? '')
              if (!id || !author || !quote) return
              await createTestimonial.mutateAsync({
                id,
                author,
                quote,
                role: role || undefined,
                avatar_url: avatar_url || undefined,
              })
              ;(e.currentTarget as HTMLFormElement).reset()
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  ID <span className="text-red-500">*</span>
                </label>
                <input
                  name="id"
                  placeholder="unique-id"
                  className="w-full rounded border p-2"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Author Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="author"
                  placeholder="John Doe"
                  className="w-full rounded border p-2"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Role / Title
              </label>
              <input
                name="role"
                placeholder="Senior Developer at Company"
                className="w-full rounded border p-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Avatar URL
              </label>
              <input
                name="avatar_url"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                className="w-full rounded border p-2"
              />
              <p className="text-muted-foreground mt-1 text-xs">
                Tip: Right-click on LinkedIn profile picture → Copy image
                address
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Quote / Recommendation <span className="text-red-500">*</span>
              </label>
              <textarea
                name="quote"
                placeholder="Enter the testimonial text..."
                className="w-full rounded border p-2"
                rows={4}
                required
              />
            </div>
            <button
              type="submit"
              className="rounded bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
              disabled={createTestimonial.isPending}
            >
              {createTestimonial.isPending ? 'Creating…' : 'Add Testimonial'}
            </button>
          </form>
        </div>
        <div className="rounded-xl border bg-white/60 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Existing Testimonials</h2>
          {isLoading && <div>Loading…</div>}
          {isError && (
            <div className="text-red-600">Failed to load testimonials.</div>
          )}
          {data && (
            <ul className="grid gap-3">
              {data.map((t) => (
                <li
                  key={t.id}
                  className="flex items-start gap-4 rounded-lg border bg-white p-4"
                >
                  {t.avatar_url ? (
                    <img
                      src={t.avatar_url}
                      alt={t.author}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-100"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-lg font-semibold text-white">
                      {t.author.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold">{t.author}</div>
                    {t.role && (
                      <div className="text-muted-foreground text-sm">
                        {t.role}
                      </div>
                    )}
                    <p className="text-muted-foreground mt-2 text-sm italic">
                      "{t.quote}"
                    </p>
                  </div>
                  <button
                    className="rounded bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    onClick={async () => {
                      if (
                        confirm(
                          'Are you sure you want to delete this testimonial?',
                        )
                      ) {
                        await deleteTestimonial.mutateAsync({ id: t.id })
                      }
                    }}
                    disabled={deleteTestimonial.isPending}
                  >
                    {deleteTestimonial.isPending ? 'Deleting…' : 'Delete'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AppShell>
  )
}

export const Route = createFileRoute({
  beforeLoad: async () => {
    await ensureKeycloakAuth()
    return null
  },
  component: AdminTestimonials,
})

import { useState } from 'react'
import { z } from 'zod'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import {
  AdminForm,
  DeleteButton,
  type AdminField,
  type AdminFormValues,
} from '@/components/admin/AdminForm'
import { intText, requiredText } from '@/lib/adminFormat'
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  type Testimonial,
} from '@/lib/queries'

const fields: AdminField[] = [
  { name: 'author', label: 'Author name', placeholder: 'John Doe' },
  {
    name: 'role',
    label: 'Role / title',
    placeholder: 'Senior Developer at Company',
  },
  {
    name: 'avatar_url',
    label: 'Avatar URL',
    type: 'url',
    hint: 'Tip: right-click the LinkedIn profile picture → Copy image address',
  },
  {
    name: 'order',
    label: 'Order',
    type: 'number',
    hint: 'Lower numbers show first',
  },
  { name: 'quote', label: 'Quote / recommendation', type: 'textarea', rows: 4 },
]

const schema = z.object({
  author: requiredText('Author'),
  role: z.string().trim(),
  avatar_url: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || /^https?:\/\//.test(value),
      'Must start with http:// or https://',
    )
    .transform((value) => value || undefined),
  order: intText('Order'),
  quote: requiredText('Quote'),
})

const empty: AdminFormValues = {
  author: '',
  role: '',
  avatar_url: '',
  order: '0',
  quote: '',
}

const toValues = (t: Testimonial): AdminFormValues => ({
  author: t.author,
  role: t.role ?? '',
  avatar_url: t.avatar_url ?? '',
  order: String(t.order ?? 0),
  quote: t.quote,
})

function AdminTestimonials() {
  const { data, isLoading, isError } = useTestimonials()
  const createTestimonial = useCreateTestimonial()
  const updateTestimonial = useUpdateTestimonial()
  const deleteTestimonial = useDeleteTestimonial()
  const [editing, setEditing] = useState<string | null>(null)
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
          <AdminForm
            schema={schema}
            fields={fields}
            defaultValues={empty}
            submitLabel="Add testimonial"
            resetOnSuccess
            onSubmit={(values) => createTestimonial.mutateAsync(values)}
          />
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
                  className="grid gap-3 rounded-lg border bg-white p-4"
                >
                  <div className="flex items-start gap-4">
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
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <button
                        type="button"
                        className="underline"
                        onClick={() =>
                          setEditing(editing === t.id ? null : t.id)
                        }
                      >
                        {editing === t.id ? 'Close' : 'Edit'}
                      </button>
                      <DeleteButton
                        onDelete={() =>
                          deleteTestimonial.mutateAsync({ id: t.id })
                        }
                      />
                    </div>
                  </div>
                  {editing === t.id && (
                    <AdminForm
                      schema={schema}
                      fields={fields}
                      defaultValues={toValues(t)}
                      submitLabel="Save"
                      onCancel={() => setEditing(null)}
                      onSubmit={(values) =>
                        updateTestimonial.mutateAsync({ id: t.id, ...values })
                      }
                    />
                  )}
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

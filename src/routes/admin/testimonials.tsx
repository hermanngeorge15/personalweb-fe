import { z } from 'zod'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import { CrudList } from '@/components/admin/CrudList'
import type { AdminField, AdminFormValues } from '@/components/admin/AdminForm'
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
  return (
    <CrudList
      title="Testimonials Management"
      path="Admin / Testimonials"
      description="Add testimonials from LinkedIn or other sources. Include author name, role, avatar URL, and the quote."
      items={data}
      isLoading={isLoading}
      isError={isError}
      errorText="Failed to load testimonials."
      emptyText="No testimonials yet."
      listTitle="Existing Testimonials"
      createTitle="Add New Testimonial"
      createLabel="Add testimonial"
      fields={fields}
      schema={schema}
      emptyValues={empty}
      toValues={toValues}
      itemName={(t) => t.author}
      describe={(t) => (
        <span className="flex items-start gap-4">
          {t.avatar_url ? (
            <img
              src={t.avatar_url}
              alt={t.author}
              className="ring-line size-12 shrink-0 rounded-full object-cover ring-2"
            />
          ) : (
            <span
              aria-hidden="true"
              className="bg-brand-gradient text-on-brand flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-semibold"
            >
              {t.author.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="min-w-0">
            <span className="text-ink block font-semibold">{t.author}</span>
            {t.role && (
              <span className="text-muted block text-sm font-normal">
                {t.role}
              </span>
            )}
            <span className="text-body mt-2 block text-sm font-normal italic">
              &ldquo;{t.quote}&rdquo;
            </span>
          </span>
        </span>
      )}
      onCreate={(values) => createTestimonial.mutateAsync(values)}
      onUpdate={(id, values) =>
        updateTestimonial.mutateAsync({ id, ...values })
      }
      onDelete={(id) => deleteTestimonial.mutateAsync({ id })}
    />
  )
}

export const Route = createFileRoute({
  beforeLoad: async () => {
    await ensureKeycloakAuth()
    return null
  },
  component: AdminTestimonials,
})

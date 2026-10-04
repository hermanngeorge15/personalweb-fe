import { z } from 'zod'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import { CrudList } from '@/components/admin/CrudList'
import type {
  AdminField,
  AdminFormValues,
  AdminSchema,
} from '@/components/admin/AdminForm'
import {
  fromDateInput,
  optionalText,
  requiredText,
  toDateInput,
} from '@/lib/adminFormat'
import {
  useResumeEducation,
  useCreateResumeEducation,
  useUpdateResumeEducation,
  useDeleteResumeEducation,
  type EducationBody,
  type ResumeEducation,
} from '@/lib/queries'

const fields: AdminField[] = [
  { name: 'institution', label: 'Institution' },
  { name: 'degree', label: 'Degree' },
  { name: 'field', label: 'Field' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: ['studying', 'graduated'],
  },
  { name: 'since', label: 'Since', type: 'date' },
  { name: 'expectedUntil', label: 'Until (expected)', type: 'date' },
  { name: 'thesisTitle', label: 'Thesis title' },
  {
    name: 'thesisDescription',
    label: 'Thesis description',
    type: 'textarea',
    rows: 3,
  },
]

const schema: AdminSchema<EducationBody> = z.object({
  institution: requiredText('Institution'),
  degree: optionalText,
  field: optionalText,
  status: z.enum(['studying', 'graduated']),
  // The backend requires a start date.
  since: z
    .string()
    .min(1, 'Since is required')
    .transform((value) => fromDateInput(value) ?? ''),
  expectedUntil: z.string().transform(fromDateInput),
  thesisTitle: optionalText,
  thesisDescription: optionalText,
})

const empty: AdminFormValues = {
  institution: '',
  degree: '',
  field: '',
  status: 'studying',
  since: '',
  expectedUntil: '',
  thesisTitle: '',
  thesisDescription: '',
}

const toValues = (e: ResumeEducation): AdminFormValues => ({
  institution: e.institution ?? '',
  degree: e.degree ?? '',
  field: e.field ?? '',
  status: e.status === 'graduated' ? 'graduated' : 'studying',
  since: toDateInput(e.since),
  expectedUntil: toDateInput(e.expectedUntil),
  thesisTitle: e.thesisTitle ?? '',
  thesisDescription: e.thesisDescription ?? '',
})

function AdminResumeEducation() {
  const { data, isLoading, isError } = useResumeEducation()
  const create = useCreateResumeEducation()
  const update = useUpdateResumeEducation()
  const remove = useDeleteResumeEducation()
  return (
    <CrudList
      title="Resume education"
      path="Admin / Resume / Education"
      items={data}
      isLoading={isLoading}
      isError={isError}
      fields={fields}
      schema={schema}
      emptyValues={empty}
      toValues={toValues}
      describe={(e) =>
        [e.institution, e.degree, e.field].filter(Boolean).join(' — ')
      }
      onCreate={(body) => create.mutateAsync(body)}
      onUpdate={(id, body) => update.mutateAsync({ id, body })}
      onDelete={(id) => remove.mutateAsync({ id })}
    />
  )
}

export const Route = createFileRoute({
  beforeLoad: async () => {
    await ensureKeycloakAuth()
    return null
  },
  component: AdminResumeEducation,
})

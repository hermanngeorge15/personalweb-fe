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
  useResumeCertificates,
  useCreateResumeCertificate,
  useUpdateResumeCertificate,
  useDeleteResumeCertificate,
  type CertificateBody,
  type ResumeCertificate,
} from '@/lib/queries'

const fields: AdminField[] = [
  { name: 'name', label: 'Name' },
  { name: 'issuer', label: 'Issuer' },
  { name: 'from', label: 'Issued', type: 'date' },
  { name: 'to', label: 'Expires', type: 'date' },
  { name: 'certificateId', label: 'Certificate ID' },
  { name: 'url', label: 'URL', type: 'url' },
  { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
]

const schema: AdminSchema<CertificateBody> = z.object({
  name: requiredText('Name'),
  issuer: optionalText,
  from: z.string().transform(fromDateInput),
  to: z.string().transform(fromDateInput),
  certificateId: optionalText,
  url: optionalText,
  description: optionalText,
})

const empty: AdminFormValues = {
  name: '',
  issuer: '',
  from: '',
  to: '',
  certificateId: '',
  url: '',
  description: '',
}

const toValues = (c: ResumeCertificate): AdminFormValues => ({
  name: c.name ?? '',
  issuer: c.issuer ?? '',
  from: toDateInput(c.startAt),
  to: toDateInput(c.endAt),
  certificateId: c.certificateId ?? '',
  url: c.url ?? '',
  description: c.description ?? '',
})

function AdminResumeCertificates() {
  const { data, isLoading, isError } = useResumeCertificates()
  const create = useCreateResumeCertificate()
  const update = useUpdateResumeCertificate()
  const remove = useDeleteResumeCertificate()
  return (
    <CrudList
      title="Resume certificates"
      path="Admin / Resume / Certificates"
      items={data}
      isLoading={isLoading}
      isError={isError}
      fields={fields}
      schema={schema}
      emptyValues={empty}
      toValues={toValues}
      describe={(c) => `${c.name ?? ''}${c.issuer ? ` — ${c.issuer}` : ''}`}
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
  component: AdminResumeCertificates,
})

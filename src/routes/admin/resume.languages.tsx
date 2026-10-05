import { z } from 'zod'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import { CrudList } from '@/components/admin/CrudList'
import type {
  AdminField,
  AdminFormValues,
  AdminSchema,
} from '@/components/admin/AdminForm'
import { requiredText } from '@/lib/adminFormat'
import {
  useResumeLanguages,
  useCreateResumeLanguage,
  useUpdateResumeLanguage,
  useDeleteResumeLanguage,
  type LanguageBody,
  type ResumeLanguage,
} from '@/lib/queries'

const fields: AdminField[] = [
  { name: 'name', label: 'Language' },
  { name: 'level', label: 'Level', placeholder: 'A1–C2, Native, Professional' },
]

const schema: AdminSchema<LanguageBody> = z.object({
  name: requiredText('Language'),
  level: requiredText('Level'),
})

const empty: AdminFormValues = { name: '', level: '' }

const toValues = (l: ResumeLanguage): AdminFormValues => ({
  name: l.name ?? '',
  level: l.level ?? '',
})

function AdminResumeLanguages() {
  const { data, isLoading, isError } = useResumeLanguages()
  const create = useCreateResumeLanguage()
  const update = useUpdateResumeLanguage()
  const remove = useDeleteResumeLanguage()
  return (
    <CrudList
      title="Resume languages"
      path="Admin / Resume / Languages"
      items={data}
      isLoading={isLoading}
      isError={isError}
      fields={fields}
      schema={schema}
      emptyValues={empty}
      toValues={toValues}
      describe={(l) => `${l.name ?? ''}${l.level ? ` — ${l.level}` : ''}`}
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
  component: AdminResumeLanguages,
})

import { z } from 'zod'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import { CrudList } from '@/components/admin/CrudList'
import type {
  AdminField,
  AdminFormValues,
  AdminSchema,
} from '@/components/admin/AdminForm'
import { intText, requiredText } from '@/lib/adminFormat'
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  type Project,
  type ProjectUpsertBody,
} from '@/lib/queries'

const fields: AdminField[] = [
  { name: 'title', label: 'Title' },
  { name: 'slug', label: 'Slug' },
  { name: 'summary', label: 'Summary', type: 'textarea', rows: 2 },
  {
    name: 'content_mdx',
    label: 'Content (Markdown)',
    type: 'textarea',
    rows: 8,
  },
  {
    name: 'links',
    label: 'Links (JSON)',
    placeholder: '{"github":"https://…"}',
  },
  { name: 'order', label: 'Order', type: 'number' },
]

const schema: AdminSchema<ProjectUpsertBody> = z.object({
  title: requiredText('Title'),
  slug: requiredText('Slug'),
  summary: requiredText('Summary'),
  content_mdx: requiredText('Content'),
  links: z
    .string()
    .transform((value) => value.trim() || '{}')
    .refine((value) => {
      try {
        return typeof JSON.parse(value) === 'object'
      } catch {
        return false
      }
    }, 'Must be a JSON object, e.g. {"github":"https://…"}'),
  order: intText('Order'),
})

const empty: AdminFormValues = {
  title: '',
  slug: '',
  summary: '',
  content_mdx: '',
  links: '{}',
  order: '0',
}

const toValues = (project: Project): AdminFormValues => ({
  title: project.title,
  slug: project.slug,
  summary: project.summary,
  content_mdx: project.content_mdx,
  links: project.links,
  order: String(project.order),
})

function AdminProjects() {
  const { data, isLoading, isError } = useProjects()
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()
  return (
    <CrudList
      title="Projects"
      path="Admin / Projects"
      items={data}
      isLoading={isLoading}
      isError={isError}
      errorText="Failed to load projects."
      emptyText="No projects yet."
      listTitle="All projects"
      createTitle="New project"
      fields={fields}
      schema={schema}
      emptyValues={empty}
      toValues={toValues}
      itemName={(project) => project.title}
      describe={(project) => (
        <>
          <span className="font-medium">{project.title}</span>
          <span className="text-muted text-sm font-normal">
            {' '}
            — {project.summary}
          </span>
        </>
      )}
      onCreate={(body) => createProject.mutateAsync(body)}
      onUpdate={(id, body) => updateProject.mutateAsync({ id, body })}
      onDelete={(id) => deleteProject.mutateAsync({ id })}
    />
  )
}

export const Route = createFileRoute({
  beforeLoad: async () => {
    await ensureKeycloakAuth()
    return null
  },
  component: AdminProjects,
})

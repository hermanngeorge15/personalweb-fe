import { useState } from 'react'
import { z } from 'zod'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import {
  AdminForm,
  DeleteButton,
  type AdminField,
  type AdminFormValues,
  type AdminSchema,
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
  const [editing, setEditing] = useState<string | null>(null)
  return (
    <AppShell path="Admin / Projects">
      <section className="grid gap-6 md:gap-8">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <details className="rounded border p-3">
          <summary className="cursor-pointer font-medium">New project</summary>
          <div className="mt-3">
            <AdminForm
              schema={schema}
              fields={fields}
              defaultValues={empty}
              submitLabel="Create"
              resetOnSuccess
              onSubmit={(body) => createProject.mutateAsync(body)}
            />
          </div>
        </details>
        {isLoading && <div>Loading…</div>}
        {isError && (
          <div className="text-red-600">Failed to load projects.</div>
        )}
        {data && data.length === 0 && <div>No projects yet.</div>}
        {data && (
          <ul className="grid gap-2">
            {data.map((project) => (
              <li key={project.id} className="grid gap-3 rounded border p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span>
                    <span className="font-medium">{project.title}</span>
                    <span className="text-muted-foreground text-sm">
                      {' '}
                      — {project.summary}
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <button
                      type="button"
                      className="underline"
                      onClick={() =>
                        setEditing(editing === project.id ? null : project.id)
                      }
                    >
                      {editing === project.id ? 'Close' : 'Edit'}
                    </button>
                    <DeleteButton
                      onDelete={() =>
                        deleteProject.mutateAsync({ id: project.id })
                      }
                    />
                  </span>
                </div>
                {editing === project.id && (
                  <AdminForm
                    schema={schema}
                    fields={fields}
                    defaultValues={toValues(project)}
                    submitLabel="Save"
                    onCancel={() => setEditing(null)}
                    onSubmit={(body) =>
                      updateProject.mutateAsync({ id: project.id, body })
                    }
                  />
                )}
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
  component: AdminProjects,
})

import { useState, type ReactNode } from 'react'
import AppShell from '@/components/AppShell'
import {
  AdminForm,
  DeleteButton,
  type AdminField,
  type AdminFormValues,
  type AdminSchema,
} from '@/components/admin/AdminForm'

type CrudListProps<Item extends { id: string }, Body> = {
  title: string
  path: string
  items: Item[] | undefined
  isLoading: boolean
  isError: boolean
  fields: AdminField[]
  schema: AdminSchema<Body>
  emptyValues: AdminFormValues
  toValues: (item: Item) => AdminFormValues
  describe: (item: Item) => ReactNode
  onCreate: (body: Body) => Promise<unknown>
  onUpdate: (id: string, body: Body) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
}

/** One admin section: a create form, then every row with inline Edit and Delete. */
export function CrudList<Item extends { id: string }, Body>(
  props: CrudListProps<Item, Body>,
) {
  const [editing, setEditing] = useState<string | null>(null)
  const { items, fields, schema } = props
  return (
    <AppShell path={props.path}>
      <section className="grid gap-6 md:gap-8">
        <h1 className="text-2xl font-semibold tracking-tight">{props.title}</h1>
        <details className="rounded border p-3">
          <summary className="cursor-pointer font-medium">Add new</summary>
          <div className="mt-3">
            <AdminForm
              schema={schema}
              fields={fields}
              defaultValues={props.emptyValues}
              submitLabel="Create"
              resetOnSuccess
              onSubmit={props.onCreate}
            />
          </div>
        </details>
        {props.isLoading && <div>Loading…</div>}
        {props.isError && <div className="text-red-600">Failed to load.</div>}
        {items && items.length === 0 && <div>Nothing here yet.</div>}
        {items && items.length > 0 && (
          <ul className="grid gap-2">
            {items.map((item) => (
              <li key={item.id} className="grid gap-3 rounded border p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="min-w-0">{props.describe(item)}</span>
                  <span className="flex items-center gap-3">
                    <button
                      type="button"
                      className="underline"
                      onClick={() =>
                        setEditing(editing === item.id ? null : item.id)
                      }
                    >
                      {editing === item.id ? 'Close' : 'Edit'}
                    </button>
                    <DeleteButton onDelete={() => props.onDelete(item.id)} />
                  </span>
                </div>
                {editing === item.id && (
                  <AdminForm
                    schema={schema}
                    fields={fields}
                    defaultValues={props.toValues(item)}
                    submitLabel="Save"
                    onCancel={() => setEditing(null)}
                    onSubmit={(body) => props.onUpdate(item.id, body)}
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

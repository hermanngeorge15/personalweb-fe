import { useEffect, useRef, useState, type ReactNode } from 'react'
import AdminShell, { type Crumb } from '@/components/admin/AdminShell'
import {
  AdminForm,
  DeleteButton,
  type AdminField,
  type AdminFormValues,
  type AdminSchema,
} from '@/components/admin/AdminForm'
import {
  AdminCard,
  AdminPageHeader,
  CardTitle,
  Notice,
  PlusIcon,
  primaryButton,
  rowButton,
} from '@/components/admin/ui'

type CrudListProps<Item extends { id: string }, Body> = {
  title: string
  /** "Admin / Resume / Languages": shown as the breadcrumb trail. */
  path: string
  description?: ReactNode
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
  /** Name used in the delete confirmation; defaults to describe() when that is text. */
  itemName?: (item: Item) => string
  /** Messages and labels; the defaults suit most sections. */
  emptyText?: string
  errorText?: string
  listTitle?: string
  createTitle?: string
  createLabel?: string
}

const CRUMB_LINKS: Record<string, string> = { Admin: '/admin' }

/** "Admin / Resume / Languages" -> breadcrumb trail (only "Admin" is a link). */
export function crumbsFromPath(path: string): Crumb[] {
  return path
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((label) => ({ label, to: CRUMB_LINKS[label] }))
}

const isNarrow = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 1023px)').matches

/**
 * One admin section: every row on the left with Edit and Delete, and a side panel that holds
 * the create form — or, after Edit, that row's edit form.
 */
export function CrudList<Item extends { id: string }, Body>(
  props: CrudListProps<Item, Body>,
) {
  const [editing, setEditing] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const { items, fields, schema } = props
  const editingItem = items?.find((item) => item.id === editing)

  // On narrow screens the panel sits under the list: bring it into view when it changes.
  const [panelVersion, setPanelVersion] = useState(0)
  useEffect(() => {
    if (panelVersion > 0 && isNarrow()) {
      panelRef.current?.scrollIntoView({ block: 'start' })
    }
  }, [panelVersion])

  const openPanel = (id: string | null) => {
    setEditing(id)
    setPanelVersion((version) => version + 1)
  }

  return (
    <AdminShell crumbs={crumbsFromPath(props.path)}>
      <AdminPageHeader
        title={props.title}
        description={props.description}
        actions={
          editing !== null && (
            <button
              type="button"
              className={primaryButton}
              onClick={() => openPanel(null)}
            >
              <PlusIcon />
              Add new
            </button>
          )
        }
      />
      <div className="mt-6 flex flex-wrap items-start gap-5">
        <AdminCard className="min-w-0 flex-[999_1_480px] overflow-visible p-0 sm:p-0">
          <div className="border-line flex items-center justify-between gap-3 border-b px-5 py-3.5">
            <h2 className="text-heading text-base font-semibold">
              {props.listTitle ?? 'Entries'}
            </h2>
            {items && (
              <span className="text-faint text-[13px]">
                {items.length} {items.length === 1 ? 'entry' : 'entries'}
              </span>
            )}
          </div>
          {(props.isLoading || props.isError || items?.length === 0) && (
            <div className="px-5 py-4">
              {props.isLoading && <Notice>Loading…</Notice>}
              {props.isError && (
                <Notice tone="danger">
                  {props.errorText ?? 'Failed to load.'}
                </Notice>
              )}
              {items && items.length === 0 && (
                <Notice>{props.emptyText ?? 'Nothing here yet.'}</Notice>
              )}
            </div>
          )}
          {items && items.length > 0 && (
            <ul className="divide-line divide-y">
              {items.map((item) => {
                const described = props.describe(item)
                const active = editing === item.id
                return (
                  <li
                    key={item.id}
                    className={`flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 ${active ? 'bg-brand-a/5' : ''}`}
                  >
                    <span className="text-ink min-w-0 text-[15px] font-medium [overflow-wrap:anywhere]">
                      {described}
                    </span>
                    <span className="flex items-center gap-2">
                      <button
                        type="button"
                        className={rowButton}
                        aria-pressed={active}
                        onClick={() => openPanel(active ? null : item.id)}
                      >
                        {active ? 'Close' : 'Edit'}
                      </button>
                      <DeleteButton
                        itemName={
                          props.itemName?.(item) ??
                          (typeof described === 'string'
                            ? described
                            : undefined)
                        }
                        onDelete={() => props.onDelete(item.id)}
                      />
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </AdminCard>

        <div ref={panelRef} className="min-w-0 flex-[1_1_420px] scroll-mt-20">
          <AdminCard>
            {editingItem ? (
              <>
                <CardTitle>Edit entry</CardTitle>
                <AdminForm
                  key={editingItem.id}
                  schema={schema}
                  fields={fields}
                  defaultValues={props.toValues(editingItem)}
                  submitLabel="Save"
                  onCancel={() => openPanel(null)}
                  onSubmit={(body) => props.onUpdate(editingItem.id, body)}
                />
              </>
            ) : (
              <>
                <CardTitle>{props.createTitle ?? 'Add new'}</CardTitle>
                <AdminForm
                  key="new"
                  schema={schema}
                  fields={fields}
                  defaultValues={props.emptyValues}
                  submitLabel={props.createLabel ?? 'Create'}
                  resetOnSuccess
                  onSubmit={props.onCreate}
                />
              </>
            )}
          </AdminCard>
        </div>
      </div>
    </AdminShell>
  )
}

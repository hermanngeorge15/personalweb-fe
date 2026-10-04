import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'

/** Every admin form field is edited as a string; the zod schema converts it for the API. */
export type AdminFormValues = Record<string, string>

/** A zod schema that turns the string form values into the API body. */
export type AdminSchema<Out> = z.ZodType<
  Out,
  z.ZodTypeDef & { typeName: string },
  AdminFormValues
>

export type AdminField = {
  name: string
  label: string
  type?:
    | 'text'
    | 'textarea'
    | 'number'
    | 'date'
    | 'datetime-local'
    | 'url'
    | 'select'
  options?: string[]
  rows?: number
  placeholder?: string
  hint?: string
}

type AdminFormProps<Out> = {
  schema: AdminSchema<Out>
  fields: AdminField[]
  defaultValues: AdminFormValues
  submitLabel: string
  onSubmit: (values: Out) => Promise<unknown>
  onCancel?: () => void
  /** Clear the form after a successful submit (create forms). */
  resetOnSuccess?: boolean
}

/**
 * Shared create/edit form for the admin pages: react-hook-form + zod, field errors under each
 * input, and the server's error shown instead of failing silently.
 */
export function AdminForm<Out>({
  schema,
  fields,
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
  resetOnSuccess = false,
}: AdminFormProps<Out>) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormValues, unknown, Out>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  // When the record is refetched after a save, show what the server now holds (for example the
  // publish date it filled in), so the next save does not send stale values back.
  const serializedDefaults = JSON.stringify(defaultValues)
  useEffect(() => {
    reset(JSON.parse(serializedDefaults) as AdminFormValues)
  }, [serializedDefaults, reset])

  const submit = handleSubmit(async (values) => {
    setServerError(null)
    setSaved(false)
    try {
      await onSubmit(values)
      setSaved(true)
      if (resetOnSuccess) reset(defaultValues)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : String(err))
    }
  })

  return (
    <form className="grid gap-3" onSubmit={submit} noValidate>
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => {
          const error = errors[field.name]?.message
          const wide = field.type === 'textarea'
          const inputClass = 'w-full rounded border p-2'
          return (
            <label
              key={field.name}
              className={`grid gap-1 ${wide ? 'md:col-span-2' : ''}`}
            >
              <span className="text-muted-foreground text-sm">
                {field.label}
              </span>
              {field.type === 'textarea' ? (
                <textarea
                  {...register(field.name)}
                  rows={field.rows ?? 4}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              ) : field.type === 'select' ? (
                <select {...register(field.name)} className={inputClass}>
                  {(field.options ?? []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...register(field.name)}
                  type={field.type ?? 'text'}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              )}
              {field.hint && (
                <span className="text-muted-foreground text-xs">
                  {field.hint}
                </span>
              )}
              {typeof error === 'string' && (
                <span className="text-sm text-red-600">{error}</span>
              )}
            </label>
          )
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            className="rounded border px-4 py-2"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        {saved && !serverError && (
          <span className="text-sm text-green-700">Saved.</span>
        )}
        {serverError && (
          <span role="alert" className="text-sm text-red-600">
            Not saved: {serverError}
          </span>
        )}
      </div>
    </form>
  )
}

/** A delete button that asks for a second click instead of a blocking browser dialog. */
export function DeleteButton({
  onDelete,
}: {
  onDelete: () => Promise<unknown>
}) {
  const [armed, setArmed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  return (
    <span className="flex items-center gap-2">
      <button
        type="button"
        className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50"
        disabled={busy}
        onClick={async () => {
          if (!armed) {
            setArmed(true)
            return
          }
          setBusy(true)
          setError(null)
          try {
            await onDelete()
          } catch (err) {
            setError(err instanceof Error ? err.message : String(err))
            setArmed(false)
          } finally {
            setBusy(false)
          }
        }}
      >
        {busy ? 'Deleting…' : armed ? 'Confirm delete' : 'Delete'}
      </button>
      {armed && !busy && (
        <button
          type="button"
          className="text-sm underline"
          onClick={() => setArmed(false)}
        >
          Keep
        </button>
      )}
      {error && (
        <span role="alert" className="text-sm text-red-600">
          Not deleted: {error}
        </span>
      )}
    </span>
  )
}

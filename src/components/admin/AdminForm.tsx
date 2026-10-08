import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import {
  cx,
  Field,
  dangerButton,
  dangerSolidButton,
  inputClass as baseInputClass,
  primaryButton,
  secondaryButton,
  textareaClass,
} from './ui'
import { MutationStatus } from './MutationStatus'

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
    <form
      className="@container grid gap-5"
      onSubmit={submit}
      // "Saved." describes the last submit; once a field changes it no longer holds.
      onChange={() => setSaved(false)}
      noValidate
    >
      <div className="grid gap-4 @lg:grid-cols-2">
        {fields.map((field) => {
          const error = errors[field.name]?.message
          const wide = field.type === 'textarea'
          const inputClass = baseInputClass
          return (
            <Field
              key={field.name}
              label={field.label}
              hint={field.hint}
              error={typeof error === 'string' ? error : undefined}
              className={wide ? '@lg:col-span-2' : undefined}
            >
              {field.type === 'textarea' ? (
                <textarea
                  {...register(field.name)}
                  rows={field.rows ?? 4}
                  placeholder={field.placeholder}
                  className={textareaClass}
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
            </Field>
          )
        })}
      </div>
      <FormActions>
        <button type="submit" className={primaryButton} disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className={secondaryButton} onClick={onCancel}>
            Cancel
          </button>
        )}
        <MutationStatus
          isSuccess={saved && !serverError}
          error={serverError ? new Error(serverError) : null}
        />
      </FormActions>
    </form>
  )
}

/** The row of buttons and the save status under every admin form. */
export function FormActions({ children }: { children: ReactNode }) {
  return (
    <div className="border-line flex flex-wrap items-center gap-3 border-t pt-4">
      {children}
    </div>
  )
}

/**
 * The one delete control of the admin area: the first click opens a small confirmation
 * ("Delete …? This can't be undone." with Keep / Delete), the second click deletes. No blocking
 * browser dialog. A failed delete shows the server's error next to the button.
 */
export function DeleteButton({
  onDelete,
  itemName,
  label = 'Delete',
}: {
  onDelete: () => Promise<unknown>
  /** What is being deleted, for the confirmation heading ("Delete “Czech”?"). */
  itemName?: string
  label?: string
}) {
  const [armed, setArmed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const boxRef = useRef<HTMLSpanElement>(null)
  const keepRef = useRef<HTMLButtonElement>(null)
  const headingId = useId()

  // Open: focus Keep (the safe choice); Escape or a click outside closes it.
  useEffect(() => {
    if (!armed) return
    keepRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setArmed(false)
    }
    const onPointer = (event: PointerEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setArmed(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [armed])

  const confirm = async () => {
    setBusy(true)
    setError(null)
    try {
      await onDelete()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
      setArmed(false)
    }
  }

  return (
    <span ref={boxRef} className="relative inline-flex items-center gap-2">
      <button
        type="button"
        className={cx(dangerButton, 'px-3 sm:min-h-9')}
        disabled={busy}
        aria-expanded={armed}
        onClick={() => setArmed((value) => !value)}
      >
        {busy ? 'Deleting…' : label}
        {itemName && <span className="sr-only"> {itemName}</span>}
      </button>
      {armed && (
        <span
          role="alertdialog"
          aria-labelledby={headingId}
          className="border-line bg-card shadow-window absolute top-full right-0 z-30 mt-2 grid w-[min(320px,calc(100vw-32px))] gap-1.5 rounded-2xl border p-4 text-left whitespace-normal"
        >
          <span
            id={headingId}
            className="text-heading text-[15px] font-semibold"
          >
            {itemName ? `Delete “${itemName}”?` : 'Delete this item?'}
          </span>
          <span className="text-muted text-sm leading-normal">
            This can’t be undone.
          </span>
          <span className="mt-2 flex justify-end gap-2">
            <button
              ref={keepRef}
              type="button"
              className={cx(secondaryButton, 'px-3 sm:min-h-9')}
              onClick={() => setArmed(false)}
            >
              Keep
            </button>
            <button
              type="button"
              className={cx(dangerSolidButton, 'px-3 sm:min-h-9')}
              disabled={busy}
              onClick={confirm}
            >
              {busy ? 'Deleting…' : 'Confirm delete'}
            </button>
          </span>
        </span>
      )}
      {error && (
        <span role="alert" className="text-danger text-sm">
          Not deleted: {error}
        </span>
      )}
    </span>
  )
}

/** The kotlin_topic CHECK constraint allows exactly these; chapters store any string. */
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'expert'] as const

/**
 * `<option>`s for a difficulty `<select>`. A stored value outside the list is kept as an extra
 * option, so opening and saving a record never silently changes its difficulty.
 */
export function DifficultyOptions({ current }: { current?: string }) {
  const values: readonly string[] =
    current && !DIFFICULTIES.some((d) => d === current)
      ? [...DIFFICULTIES, current]
      : DIFFICULTIES
  return (
    <>
      {values.map((value) => (
        <option key={value} value={value}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </option>
      ))}
    </>
  )
}

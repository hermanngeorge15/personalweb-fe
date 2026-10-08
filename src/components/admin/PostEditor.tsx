import {
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import MDXContent from '@/components/MDXContent'
import { formatShortDate } from '@/lib/blog-utils'
import { splitList } from '@/lib/adminFormat'
import type { PostUpsertBody } from '@/lib/queries'
import { postFields, postSchema } from '@/routes/admin/-postForm'
import type { AdminFormValues } from './AdminForm'
import { MutationStatus } from './MutationStatus'
import {
  cx,
  AdminCard,
  AdminPageHeader,
  CardTitle,
  Field,
  StatusBadge,
  codeInputClass,
  inputClass,
  primaryButton,
  secondaryButton,
  textareaClass,
} from './ui'

type View = 'write' | 'split' | 'preview'

const VIEWS: Array<{ value: View; label: string }> = [
  { value: 'write', label: 'Write' },
  { value: 'split', label: 'Split' },
  { value: 'preview', label: 'Preview' },
]

const fieldMeta = (name: string) =>
  postFields.find((field) => field.name === name)

const toolButton =
  'border-line-strong bg-card text-body hover:bg-chip hover:text-ink inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border px-2.5 text-sm transition-colors sm:min-h-9 sm:min-w-9 focus-visible:outline-brand-a focus-visible:outline-2'

type PostEditorProps = {
  /** The page's h1: the post title, or "New post". */
  heading: ReactNode
  defaultValues: AdminFormValues
  submitLabel: string
  onSubmit: (body: PostUpsertBody) => Promise<unknown>
  onCancel?: () => void
  /** Clear the editor after a successful submit (the create form). */
  resetOnSuccess?: boolean
}

/**
 * The post editor: Markdown source next to a live preview rendered by the same MDXContent the
 * public post page uses, with publishing and details in a side column. Same zod schema, field
 * names and messages as the shared AdminForm (see -postForm.ts).
 */
export function PostEditor({
  heading,
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
  resetOnSuccess = false,
}: PostEditorProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [view, setView] = useState<View>(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 1023px)').matches
      ? 'write'
      : 'split',
  )
  const contentRef = useRef<HTMLTextAreaElement | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AdminFormValues, unknown, PostUpsertBody>({
    resolver: zodResolver(postSchema),
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
      // What was just saved is the new baseline for "Unsaved changes".
      else reset(getValues())
    } catch (err) {
      setServerError(err instanceof Error ? err.message : String(err))
    }
  })

  const content = watch('content_mdx') ?? ''
  const preview = useDeferredValue(content)
  const status = watch('status') ?? 'draft'
  const publishedAt = watch('published_at')
  const tags = splitList(watch('tags') ?? '')

  const { ref: registerContentRef, ...contentField } = register('content_mdx')

  /** Wraps the selection (or a placeholder) in Markdown syntax and keeps it selected. */
  const wrapSelection = (
    before: string,
    after: string,
    placeholder: string,
  ) => {
    const el = contentRef.current
    if (!el) return
    const { selectionStart: start, selectionEnd: end, value } = el
    const selected = value.slice(start, end) || placeholder
    setValue(
      'content_mdx',
      value.slice(0, start) + before + selected + after + value.slice(end),
      { shouldDirty: true },
    )
    setSaved(false)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(
        start + before.length,
        start + before.length + selected.length,
      )
    })
  }

  /** Starts the current line with `prefix` (headings). */
  const prefixLine = (prefix: string) => {
    const el = contentRef.current
    if (!el) return
    const { selectionStart: start, value } = el
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    setValue(
      'content_mdx',
      value.slice(0, lineStart) + prefix + value.slice(lineStart),
      { shouldDirty: true },
    )
    setSaved(false)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + prefix.length, start + prefix.length)
    })
  }

  const tools: Array<{ label: string; text: ReactNode; run: () => void }> = [
    {
      label: 'Bold',
      text: <span className="font-bold">B</span>,
      run: () => wrapSelection('**', '**', 'bold text'),
    },
    {
      label: 'Italic',
      text: <span className="italic">I</span>,
      run: () => wrapSelection('*', '*', 'italic text'),
    },
    { label: 'Heading', text: 'H2', run: () => prefixLine('## ') },
    {
      label: 'Link',
      text: 'Link',
      run: () => wrapSelection('[', '](https://)', 'link text'),
    },
    {
      label: 'Inline code',
      text: <span className="font-mono">{'</>'}</span>,
      run: () => wrapSelection('`', '`', 'code'),
    },
    {
      label: 'Image',
      text: 'Image',
      run: () => wrapSelection('![', '](/api/media/files/…)', 'alt text'),
    },
  ]

  const error = (name: string) => {
    const message = errors[name]?.message
    return typeof message === 'string' ? message : undefined
  }

  const saveButton = (
    <button type="submit" className={primaryButton} disabled={isSubmitting}>
      {isSubmitting ? 'Saving…' : submitLabel}
    </button>
  )

  return (
    <form
      onSubmit={submit}
      // "Saved." describes the last submit; once a field changes it no longer holds.
      onChange={() => setSaved(false)}
      noValidate
      className="grid gap-5"
    >
      <AdminPageHeader
        title={heading}
        meta={
          <>
            <StatusBadge status={status} />
            {publishedAt && (
              <span>{formatShortDate(new Date(publishedAt))}</span>
            )}
            {isDirty && (
              <span className="text-body inline-flex items-center gap-1.5 font-medium">
                <span
                  aria-hidden="true"
                  className="bg-brand-a size-1.5 rounded-full"
                />
                Unsaved changes
              </span>
            )}
          </>
        }
        actions={
          <div className="flex flex-wrap items-center justify-end gap-3">
            <MutationStatus
              isSuccess={saved && !serverError}
              error={serverError ? new Error(serverError) : null}
            />
            {onCancel && (
              <button
                type="button"
                className={secondaryButton}
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
            {saveButton}
          </div>
        }
      />

      <div className="flex flex-wrap items-start gap-5">
        <AdminCard className="min-w-0 flex-[999_1_640px] overflow-hidden p-0 sm:p-0">
          <div className="border-line border-b p-4 sm:p-5">
            <Field label={fieldMeta('title')?.label} error={error('title')}>
              <input
                {...register('title')}
                className={cx(
                  inputClass,
                  'text-[17px] font-semibold sm:text-[17px]',
                )}
              />
            </Field>
          </div>

          <div className="border-line bg-subtle flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
            <div
              role="toolbar"
              aria-label="Markdown formatting"
              className="flex flex-wrap gap-1"
            >
              {tools.map((tool) => (
                <button
                  key={tool.label}
                  type="button"
                  aria-label={tool.label}
                  title={tool.label}
                  className={toolButton}
                  disabled={view === 'preview'}
                  onClick={tool.run}
                >
                  {tool.text}
                </button>
              ))}
            </div>
            <div
              role="group"
              aria-label="Editor view"
              className="border-line bg-card flex gap-1 rounded-[10px] border p-1"
            >
              {VIEWS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={view === option.value}
                  onClick={() => setView(option.value)}
                  className={`focus-visible:outline-brand-a min-h-9 rounded-[7px] px-3 text-sm transition-colors focus-visible:outline-2 ${
                    view === option.value
                      ? 'bg-invert text-on-invert'
                      : 'text-body hover:text-ink'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div
            className={
              view === 'split' ? 'grid lg:grid-cols-2' : 'grid grid-cols-1'
            }
          >
            <label
              className={`min-w-0 ${view === 'preview' ? 'hidden' : 'block'} ${
                view === 'split' ? 'border-line lg:border-r' : ''
              }`}
            >
              <span className="sr-only">{fieldMeta('content_mdx')?.label}</span>
              <textarea
                {...contentField}
                ref={(el) => {
                  registerContentRef(el)
                  contentRef.current = el
                }}
                rows={fieldMeta('content_mdx')?.rows ?? 18}
                spellCheck
                className="text-body bg-card focus-visible:ring-brand-a/40 block h-[420px] w-full resize-y border-0 p-4 font-mono text-[13px] leading-[1.75] outline-none focus-visible:ring-2 focus-visible:ring-inset sm:p-5 lg:h-[680px]"
              />
            </label>
            <div
              className={`min-w-0 ${view === 'write' ? 'hidden' : 'block'} ${
                view === 'split' ? 'border-line border-t lg:border-t-0' : ''
              }`}
            >
              <p className="text-faint border-line border-b px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase sm:px-5">
                Preview
              </p>
              <div className="bg-page max-h-[680px] min-h-[420px] overflow-y-auto px-4 py-5 sm:px-6 lg:min-h-[640px]">
                {preview.trim() ? (
                  <MDXContent code={preview} />
                ) : (
                  <p className="text-faint text-[15px]">
                    Nothing to preview yet — write some Markdown.
                  </p>
                )}
              </div>
            </div>
          </div>
          {error('content_mdx') && (
            <p className="text-danger border-line border-t px-4 py-2 text-[13px] sm:px-5">
              {error('content_mdx')}
            </p>
          )}
        </AdminCard>

        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-4">
          <AdminCard>
            <CardTitle>Publishing</CardTitle>
            <div className="grid gap-4">
              <Field label={fieldMeta('status')?.label} error={error('status')}>
                <select {...register('status')} className={inputClass}>
                  {(fieldMeta('status')?.options ?? []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label={fieldMeta('published_at')?.label}
                hint={fieldMeta('published_at')?.hint}
                error={error('published_at')}
              >
                <input
                  {...register('published_at')}
                  type="datetime-local"
                  className={inputClass}
                />
              </Field>
            </div>
          </AdminCard>

          <AdminCard>
            <CardTitle>Details</CardTitle>
            <div className="grid gap-4">
              <Field
                label={fieldMeta('slug')?.label}
                hint={fieldMeta('slug')?.hint}
                error={error('slug')}
              >
                <input
                  {...register('slug')}
                  className={codeInputClass}
                  autoCapitalize="off"
                  spellCheck={false}
                />
              </Field>
              <Field
                label={fieldMeta('excerpt')?.label}
                error={error('excerpt')}
              >
                <textarea
                  {...register('excerpt')}
                  rows={3}
                  className={textareaClass}
                />
              </Field>
              <Field
                label={fieldMeta('tags')?.label}
                error={error('tags')}
                hint={
                  tags.length > 0 && (
                    <span className="mt-0.5 flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-chip text-body rounded-md px-2 py-0.5 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  )
                }
              >
                <input
                  {...register('tags')}
                  placeholder={fieldMeta('tags')?.placeholder}
                  className={inputClass}
                />
              </Field>
            </div>
          </AdminCard>

          <AdminCard>
            <CardTitle>Cover image</CardTitle>
            <Field
              label={fieldMeta('cover_url')?.label}
              hint="Without one, the post gets a branded cover."
              error={error('cover_url')}
            >
              <input
                {...register('cover_url')}
                placeholder={fieldMeta('cover_url')?.placeholder}
                className={codeInputClass}
                spellCheck={false}
              />
            </Field>
          </AdminCard>

          <div className="flex flex-wrap items-center gap-3">
            {saveButton}
            {onCancel && (
              <button
                type="button"
                className={secondaryButton}
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
